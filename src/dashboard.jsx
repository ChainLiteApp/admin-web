import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Tooltip,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRedirect } from 'react-admin';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const useFetch = (path, deps = []) => {
  const [state, setState] = React.useState({ loading: true, data: null, error: null });
  React.useEffect(() => {
    let mounted = true;
    setState({ loading: true, data: null, error: null });
    fetch(`${API}${path}`)
      .then(async (r) => (r.ok ? r.json() : Promise.reject(await r.text())))
      .then((data) => mounted && setState({ loading: false, data, error: null }))
      .catch((e) => mounted && setState({ loading: false, data: null, error: String(e) }));
    return () => { mounted = false; };
  }, deps);
  return state;
};

const relTime = (ts) => {
  const d = Number(ts);
  if (!d) return '';
  const diff = Date.now() - d;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  return `${day}d ago`;
};

function StatCard({ title, status, loading }) {
  const color = status === 'healthy' || status === 'ready' ? 'success' : (status ? 'warning' : 'default');
  const Icon = status === 'healthy' || status === 'ready' ? CheckCircleIcon : ErrorIcon;
  return (
    <Card>
      {loading && <LinearProgress />}
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Chip size="small" color={color} icon={<Icon />} label={loading ? 'Loading…' : (status || 'unknown')} />
        </Stack>
      </CardContent>
    </Card>
  );
}

function BlocksTable({ blocks, loading, error, onCopy }) {
  const redirect = useRedirect();
  return (
    <Card>
      {loading && <LinearProgress />}
      <CardContent>
        <Typography variant="h6">Latest Blocks</Typography>
        <Divider sx={{ my: 1 }} />
        {error && <Typography color="error" variant="body2">{String(error)}</Typography>}
        {!loading && !blocks.length && <Typography variant="body2" color="text.secondary">No blocks yet.</Typography>}
        {!!blocks.length && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell>
                <TableCell>Hash</TableCell>
                <TableCell>Prev</TableCell>
                <TableCell>Tx</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocks.map((b) => (
                <TableRow key={b.hash} hover sx={{ cursor: 'pointer' }} onClick={() => redirect('show', 'blocks', b.index)}>
                  <TableCell>{b.index}</TableCell>
                  <TableCell>
                    <Tooltip title={b.hash} placement="top">
                      <span>{String(b.hash).slice(0, 10)}…</span>
                    </Tooltip>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onCopy?.(b.hash); }} aria-label="Copy block hash"><ContentCopyIcon fontSize="inherit" /></IconButton>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={b.previous_hash} placement="top">
                      <span>{String(b.previous_hash).slice(0, 10)}…</span>
                    </Tooltip>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onCopy?.(b.previous_hash); }} aria-label="Copy prev hash"><ContentCopyIcon fontSize="inherit" /></IconButton>
                  </TableCell>
                  <TableCell>{(b.transactions || []).length}</TableCell>
                  <TableCell>{relTime(b.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function TxTable({ txs, loading, error, onCopy }) {
  return (
    <Card>
      {loading && <LinearProgress />}
      <CardContent>
        <Typography variant="h6">Latest Transactions</Typography>
        <Divider sx={{ my: 1 }} />
        {error && <Typography color="error" variant="body2">{String(error)}</Typography>}
        {!loading && !txs.length && <Typography variant="body2" color="text.secondary">No transactions yet.</Typography>}
        {!!txs.length && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Hash</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txs.map((t) => (
                <TableRow key={t.hash || `${t.sender}-${t.timestamp}`} hover>
                  <TableCell>
                    <Tooltip title={t.hash} placement="top">
                      <span>{String(t.hash || '').slice(0, 10)}…</span>
                    </Tooltip>
                    <IconButton size="small" onClick={() => onCopy?.(t.hash)} aria-label="Copy tx hash"><ContentCopyIcon fontSize="inherit" /></IconButton>
                  </TableCell>
                  <TableCell>{String(t.sender || '').slice(0, 12)}…</TableCell>
                  <TableCell>{String(t.recipient || '').slice(0, 12)}…</TableCell>
                  <TableCell align="right">{Number(t.amount || 0)}</TableCell>
                  <TableCell>{relTime(t.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const health = useFetch('/health');
  const ready = useFetch('/readyz');
  const mining = useFetch('/mining/status');
  const latestBlocks = useFetch('/blocks/latest?limit=5', []);
  const latestTx = useFetch('/transactions/latest?limit=5', []);

  const [snack, setSnack] = React.useState({ open: false, message: '', severity: 'success' });
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ''));
      setSnack({ open: true, message: 'Copied to clipboard', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, message: 'Copy failed', severity: 'error' });
    }
  };

  const mine = async () => {
    try {
      const r = await fetch(`${API}/mine`);
      if (!r.ok) throw new Error(await r.text());
      setSnack({ open: true, message: 'Mining triggered', severity: 'success' });
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      setSnack({ open: true, message: 'Failed to mine', severity: 'error' });
    }
  };
  const resolve = async () => {
    try {
      const r = await fetch(`${API}/nodes/resolve`);
      if (!r.ok) throw new Error(await r.text());
      setSnack({ open: true, message: 'Consensus triggered', severity: 'success' });
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      setSnack({ open: true, message: 'Failed to resolve', severity: 'error' });
    }
  };

  const blocks = latestBlocks.data?.data?.blocks || [];
  const txs = latestTx.data?.data?.transactions || [];

  return (
    <Stack spacing={2} sx={{ m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard title="Health" status={health.data?.status || health.data?.data?.status} loading={health.loading} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Readiness" status={ready.data?.status || ready.data?.data?.status} loading={ready.loading} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            {mining.loading && <LinearProgress />}
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Mining</Typography>
                <Chip size="small" icon={<BoltIcon />} label={mining.loading ? 'Loading…' : (mining.data?.data?.status || mining.data?.status || 'unknown')} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Actions</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="contained" startIcon={<BoltIcon />} onClick={mine}>Mine</Button>
                <Button variant="outlined" startIcon={<SyncIcon />} onClick={resolve}>Resolve</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <BlocksTable blocks={blocks} loading={latestBlocks.loading} error={latestBlocks.error} onCopy={copy} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TxTable txs={txs} loading={latestTx.loading} error={latestTx.error} onCopy={copy} />
        </Grid>
      </Grid>

      <Box sx={{ pb: 1 }} />

      <Snackbar open={snack.open} autoHideDuration={2000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
    </Stack>
  );
}
