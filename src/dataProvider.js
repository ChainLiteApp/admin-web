const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const unwrap = async (resp) => {
  if (!resp.ok) {
    let text = '';
    try { text = await resp.text(); } catch {}
    throw new Error(text || `HTTP ${resp.status}`);
  }
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.text();
};

const get = (path) => fetch(`${apiUrl}${path}`);
const post = (path, body) => fetch(`${apiUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const del = (path) => fetch(`${apiUrl}${path}`, { method: 'DELETE' });

export const dataProvider = {
  getList: async (resource, params) => {
    if (resource === 'blocks') {
      const { perPage } = params.pagination || { perPage: 10 };
      const data = await unwrap(await get(`/blocks/latest?limit=${perPage}`));
      const blocks = (data.data?.blocks || []).map((b) => ({ id: b.index ?? b.height ?? b.hash ?? Math.random(), ...b }));
      return { data: blocks, total: blocks.length };
    }
    if (resource === 'transactions') {
      const { perPage } = params.pagination || { perPage: 20 };
      const data = await unwrap(await get(`/transactions/latest?limit=${perPage}`));
      const txs = (data.data?.transactions || []).map((t, i) => ({ id: t.hash ?? i, ...t }));
      return { data: txs, total: txs.length };
    }
    if (resource === 'nodes') {
      const data = await unwrap(await get('/nodes'));
      const nodes = (data.data?.nodes || []).map((n) => ({ id: n, address: n }));
      return { data: nodes, total: nodes.length };
    }
    return { data: [], total: 0 };
  },

  getOne: async (resource, params) => {
    if (resource === 'blocks') {
      const data = await unwrap(await get(`/blocks/${params.id}`));
      const block = data.data?.block || data.block || data.data;
      return { data: { id: block.index ?? block.height ?? block.hash, ...block } };
    }
    if (resource === 'transactions') {
      const data = await unwrap(await get(`/transactions/${params.id}`));
      const tx = data.data?.transaction || data.transaction || data.data;
      return { data: { id: tx.hash, ...tx } };
    }
    throw new Error('Not implemented');
  },

  create: async (resource, params) => {
    if (resource === 'transactions') {
      const resp = await unwrap(await post('/transactions', params.data));
      const created = resp.data || resp;
      const id = created.hash || Date.now();
      return { data: { id, ...created } };
    }
    if (resource === 'nodes') {
      const body = Array.isArray(params.data?.nodes) ? params.data : { nodes: [params.data.address] };
      const resp = await unwrap(await post('/nodes/register', body));
      const created = (resp.data?.registered_nodes || body.nodes).map((n) => ({ id: n, address: n }));
      return { data: created[0] };
    }
    throw new Error('Not implemented');
  },

  delete: async (resource, params) => {
    if (resource === 'nodes') {
      await unwrap(await del(`/nodes/${encodeURIComponent(params.id)}`));
      return { data: { id: params.id } };
    }
    throw new Error('Not implemented');
  },

  // Optional RA methods to satisfy interface
  update: async () => { throw new Error('Not implemented'); },
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
};
