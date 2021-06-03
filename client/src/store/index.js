import Vue from 'vue';
import Vuex from 'vuex';

import router from '../router';
import { apolloClient } from '../main';

import {
  ADD_TASK,
  ASSIGN_TASK,
  GET_ALL_TASKS,
  GET_REQUEST_TASKS,
  GET_ASSIGN_TASKS,
  CHANGE_STATUS,
  GET_CURRENT_USER,
  GET_ASSIGNEES,
  SEARCH_ALL_TASKS,
  SEARCH_ASSIGN_TASKS,
  SEARCH_REQUEST_TASKS,
  SIGNUP_USER,
  SIGNIN_USER
} from '../queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    assignees: [],
    authError: null,
    error: null,
    loading: false,
    searchResults: [],
    tasks: [],
    user: null
  },
  mutations: {
    addTask: (state, payload) => {
      state.tasks.push(payload);
    },

    clearError: state => (state.error = null),

    clearSearchResults: state => (state.searchResults = []),

    clearUser: state => (state.user = null),

    setAssignees: (state, payload) => {
      state.assignees = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setTasks: (state, payload) => {
      state.tasks = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    }
  },
  actions: {
    // Task Queries

    addTask: ({ commit }, payload) => {
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: ADD_TASK,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('addTask', data.addTask);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },

    getAllTasks: ({ commit }) => {
      commit('setLoading', true);

      apolloClient
        .query({
          query: GET_ALL_TASKS
        })
        .then(({ data }) => {
          commit('setTasks', data.getAllTasks);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },

    getRequestTasks: ({ commit }, payload) => {
      commit('setLoading', true);

      // use Apollo client to fire action

      apolloClient
        .query({
          query: GET_REQUEST_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setTasks', data.getRequestTasks);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },

    getAssignTasks: ({ commit }, payload) => {
      commit('setLoading', true);

      // use Apollo client to fire action

      apolloClient
        .query({
          query: GET_ASSIGN_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setTasks', data.getAssignTasks);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    // User Queries

    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
          if (data.getCurrentUser) {
            localStorage.setItem('role', data.getCurrentUser.role);
            localStorage.setItem('fullname', data.getCurrentUser.fullname);
          }
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },

    getAssignees: ({ commit }) => {
      apolloClient
        .query({
          query: GET_ASSIGNEES
        })
        .then(({ data }) => {
          commit('setAssignees', data.getAssignees);
        })
        .catch(err => {
          console.error(err);
        });
    },

    assignTask: ({}, payload) => {
      apolloClient
        .mutate({
          mutation: ASSIGN_TASK,
          variables: payload
        })
        .then(({ data }) => {
          router.go();
        })
        .catch(err => {
          console.error(err);
        });
    },

    changeStatus: ({}, payload) => {
      apolloClient
        .mutate({
          mutation: CHANGE_STATUS,
          variables: payload
        })
        .then(({ data }) => {})
        .catch(err => {
          console.error(err);
        });
    },

    searchAllTasks: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_ALL_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setSearchResults', data.searchAllTasks);
        })
        .catch(err => console.error(err));
    },

    searchAssignTasks: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_ASSIGN_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setSearchResults', data.searchAssignTasks);
        })
        .catch(err => console.error(err));
    },

    searchRequestTasks: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_REQUEST_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setSearchResults', data.searchRequestTasks);
        })
        .catch(err => console.error(err));
    },

    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signupUser.token);

          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },

    signinUser: ({ commit }, payload) => {
      localStorage.setItem('token', '');
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);

          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },

    signoutUser: async ({ commit }) => {
      // clear user in state

      commit('clearUser');

      // remove token from localStorage

      await localStorage.setItem('token', '');
      await localStorage.setItem('role', '');

      // end Session

      await apolloClient.resetStore();

      // redirect to home

      await router.push('/');
    }
  },

  getters: {
    assignees: state => state.assignees,
    authError: state => state.authError,
    error: state => state.error,
    loading: state => state.loading,
    searchResults: state => state.searchResults,
    tasks: state => state.tasks,
    user: state => state.user
  },
  modules: {}
});
