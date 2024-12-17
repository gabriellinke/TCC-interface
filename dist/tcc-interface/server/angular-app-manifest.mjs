
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 5339, hash: '5dceccac90db11df11b97e01cb41dd904a4f55e10a69f5e3a15ffc66cd9f0321', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 5357, hash: 'e75b62282ab4c40336df0db8e688e6309eb816c71047074a02a4988af2ea829c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ENJN3P6E.css': {size: 2968, hash: 'EQIkx+ZgxPw', text: () => import('./assets-chunks/styles-ENJN3P6E_css.mjs').then(m => m.default)}
  },
};
