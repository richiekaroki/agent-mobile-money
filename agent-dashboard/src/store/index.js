// src/store/index.js
import { createStore } from 'vuex';
import { fetchMockTransactions } from '../api/transactions';

export default createStore({
  state: {
    transactions: [],
    agentProfile: {
      name: 'Agent Name',
      balance: 0,
    },
    notifications: [],
  },
  mutations: {
    setTransactions(state, transactions) {
      state.transactions = transactions;
    },
    setAgentProfile(state, profile) {
      state.agentProfile = profile;
    },
    addNotification(state, message) {
      state.notifications.push(message);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  actions: {
    async fetchTransactions({ commit }) {
      const transactions = await fetchMockTransactions();
      commit('setTransactions', transactions);
    },
    fetchAgentProfile({ commit }) {
      const mockProfile = { name: 'Richard Karoki', balance: 1000 };
      commit('setAgentProfile', mockProfile);
    },
    addTransaction({ commit }, transaction) {
      commit('addTransaction', transaction);
      commit('addNotification', 'New transaction added!');
    },
  },
  getters: {
    getTransactions: (state) => state.transactions,
    getAgentProfile: (state) => state.agentProfile,
  },
});
