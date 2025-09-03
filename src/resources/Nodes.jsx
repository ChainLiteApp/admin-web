import * as React from 'react';
import { List, Datagrid, TextField, Create, SimpleForm, TextInput } from 'react-admin';

export const NodeList = (props) => (
  <List {...props} pagination={false} exporter={false}>
    <Datagrid>
      <TextField source="address" label="Node Address" />
    </Datagrid>
  </List>
);

export const NodeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="address" fullWidth />
    </SimpleForm>
  </Create>
);
