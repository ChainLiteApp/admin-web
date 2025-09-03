import * as React from 'react';
import { List, Datagrid, TextField, NumberField, Create, SimpleForm, TextInput, NumberInput, Show, SimpleShowLayout, DateField, FunctionField } from 'react-admin';
import { Box, Tooltip, IconButton, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Mono = ({ children }) => (
  <Box component="span" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{children}</Box>
);

const TruncMono = ({ text, n = 16 }) => (
  <Tooltip title={text} placement="top">
    <Mono>{String(text || '').slice(0, n)}…</Mono>
  </Tooltip>
);

const CopyBtn = ({ value, onClick }) => (
  <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(String(value || '')); onClick?.(); }} aria-label="Copy">
    <ContentCopyIcon fontSize="inherit" />
  </IconButton>
);

export const TransactionList = (props) => (
  <List {...props} pagination={false} exporter={false}>
    <Datagrid rowClick="show">
      <FunctionField label="Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TruncMono text={r.hash} />
          <CopyBtn value={r.hash} />
        </Stack>
      )} />
      <FunctionField label="Sender" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TruncMono text={r.sender} n={12} />
          <CopyBtn value={r.sender} />
        </Stack>
      )} />
      <FunctionField label="Recipient" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <TruncMono text={r.recipient} n={12} />
          <CopyBtn value={r.recipient} />
        </Stack>
      )} />
      <NumberField source="amount" />
      <NumberField source="fee" />
    </Datagrid>
  </List>
);

export const TransactionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="sender" fullWidth />
      <TextInput source="recipient" fullWidth />
      <NumberInput source="amount" />
      <NumberInput source="fee" />
    </SimpleForm>
  </Create>
);

export const TransactionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <FunctionField label="Hash" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Mono>{r.hash}</Mono>
          <CopyBtn value={r.hash} />
        </Stack>
      )} />
      <FunctionField label="Sender" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Mono>{r.sender}</Mono>
          <CopyBtn value={r.sender} />
        </Stack>
      )} />
      <FunctionField label="Recipient" render={(r) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Mono>{r.recipient}</Mono>
          <CopyBtn value={r.recipient} />
        </Stack>
      )} />
      <NumberField source="amount" />
      <NumberField source="fee" />
      <DateField source="timestamp" showTime />
    </SimpleShowLayout>
  </Show>
);
