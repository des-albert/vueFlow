import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import FormAlert from './components/Shared/FormAlert';

// Register Global Component

Vue.component('form-alert', FormAlert);

Vue.use(VueApollo);

export const apolloClient = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',

  uri: 'https://vueflow.herokuapp.com/graphql',

  // Include auth token with request to backend

  fetchOptions: {
    credentials: 'include'
  },
  request: (operation) => {
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }

    // operation adds token to an authorization header

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.name === 'AuthenticationError') {
          // set Auth Error in state
          store.commit('setAuthError', err);
          // signout user (to clear token)
          store.dispatch('signoutUser');
        }
      }
    }
  }
});
const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: (h) => h(App),

  created() {
    this.$store.dispatch('getCurrentUser');
    this.$store.dispatch('getAssignees');
  }
}).$mount('#app');
