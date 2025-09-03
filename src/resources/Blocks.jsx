import * as React from 'react';
import { List, Datagrid, TextField, NumberField, Show, SimpleShowLayout, DateField, FunctionField } from 'react-admin';
import { Box, Tooltip, IconButton, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Mono = ({ children }) => (
  <Box component="span" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{children}</Box>
);

const TruncMono = ({ text }) => (
  <Tooltip title={text} placement="top">
    <Mono>{String(text || '').slice(0, 16)}…</Mono>
  </Tooltip>
);

const CopyBtn = ({ value, onClick }) => (
  <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(String(value || '')); onClick?.(); }} aria-label="Copy">
    <ContentCopyIcon fontSize="inherit" />
  </IconButton>
);

export const BlockList = (props) => (
  <List {...props} pagination={false} exporter={false}>
    <Datagrid rowClick="show">
      <NumberField source="index" label="Index" />
      <FunctionField label="Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TruncMono text={r.hash} />
          <CopyBtn value={r.hash} />
        </Stack>
      )} />
      <FunctionField label="Prev Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TruncMono text={r.previous_hash} />
          <CopyBtn value={r.previous_hash} />
        </Stack>
      )} />
      <NumberField source="proof" label="Proof" />
      <DateField source="timestamp" label="Timestamp" showTime />
    </Datagrid>
  </List>
);

export const BlockShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <NumberField source="index" label="Index" />
      <FunctionField label="Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Mono>{r.hash}</Mono>
          <CopyBtn value={r.hash} />
        </Stack>
      )} />
      <FunctionField label="Prev Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Mono>{r.previous_hash}</Mono>
          <CopyBtn value={r.previous_hash} />
        </Stack>
      )} />
      <NumberField source="proof" label="Proof" />
      <DateField source="timestamp" label="Timestamp" showTime />
      <FunctionField label="Transactions" render={(r) => (
        <Box component="pre" sx={{ m: 0, p: 1, bgcolor: 'action.hover', borderRadius: 1, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(r.transactions || [], null, 2)}
        </Box>
      )} />
    </SimpleShowLayout>
  </Show>
);
