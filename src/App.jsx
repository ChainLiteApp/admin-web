import * as React from 'react';
import { Admin, Resource, ListGuesser, ShowGuesser, Layout, AppBar, ToggleThemeButton, TitlePortal } from 'react-admin';
import { Chip, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { dataProvider } from './dataProvider.js';
import Dashboard from './dashboard.jsx';
import { TransactionCreate, TransactionList, TransactionShow } from './resources/Transactions.jsx';
import { BlockList, BlockShow } from './resources/Blocks.jsx';
import { NodeList, NodeCreate } from './resources/Nodes.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#00bcd4' },
    background: { default: '#f6f8fb' }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' } } }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#80deea' },
  },
  shape: { borderRadius: 10 },
});

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const MyAppBar = () => (
  <AppBar toolbar>
    <TitlePortal />
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
      <Chip size="small" label={API.replace(/^https?:\/\//, '')} variant="outlined" />
      <ToggleThemeButton />
    </Stack>
  </AppBar>
);

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

export default function App() {
  return (
    <Admin title="ChainLite Admin" dataProvider={dataProvider} dashboard={Dashboard} theme={theme} darkTheme={darkTheme} layout={MyLayout}>
      <Resource name="blocks" options={{ label: 'Blocks' }} list={BlockList} show={BlockShow} />
      <Resource name="transactions" options={{ label: 'Transactions' }} list={TransactionList} create={TransactionCreate} show={TransactionShow} />
      <Resource name="nodes" options={{ label: 'Nodes' }} list={NodeList} create={NodeCreate} />
    </Admin>
  );
}
