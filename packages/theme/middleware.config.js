module.exports = {
  integrations: {
    beckn: {
      location: '@vue-storefront/beckn-api/server',
      configuration: {
        api: {
          url: 'http://qa.api.box.beckn.org/bap/client',
          endpoints: {
            search: '/v1/search',
            onSearch: '/v1/on_search',
            getQuote: '/v1/get_quote',
            onGetQuote: 'v1/on_get_quote',
            initiatizeOrder: 'v1/initiatize_order',
            onInitializeOrder: 'v1/on_initialize_order'
          }
        }
      }
    }
  }
};
