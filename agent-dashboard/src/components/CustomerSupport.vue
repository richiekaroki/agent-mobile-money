<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Customer Support</h2>
      <button
        @click="showNewTicket = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        New Support Ticket
      </button>
    </div>

    <!-- Support Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-green-800">Open Tickets</h3>
        <p class="text-2xl font-bold text-green-600">{{ supportStats.openTickets }}</p>
      </div>
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-800">Pending Response</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ supportStats.pendingResponse }}</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800">Resolved This Month</h3>
        <p class="text-2xl font-bold text-blue-600">{{ supportStats.resolvedThisMonth }}</p>
      </div>
    </div>

    <!-- Support Tickets List -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Recent Support Tickets</h3>
      <div v-if="supportTickets.length === 0" class="text-center py-8 text-gray-500">
        No support tickets found
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="ticket in supportTickets"
          :key="ticket.id"
          class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          @click="selectedTicket = ticket"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-800">{{ ticket.subject }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ ticket.description }}</p>
              <div class="flex items-center mt-2 space-x-4">
                <span class="text-xs text-gray-500">ID: {{ ticket.id }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(ticket.createdAt) }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span
                :class="getStatusClass(ticket.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ ticket.status }}
              </span>
              <span
                :class="getPriorityClass(ticket.priority)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ ticket.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Ticket Modal -->
    <div
      v-if="showNewTicket"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Create Support Ticket</h3>
        <form @submit.prevent="createTicket">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                v-model="newTicket.subject"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="newTicket.priority"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newTicket.description"
                required
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the issue"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showNewTicket = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div
      v-if="selectedTicket"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">{{ selectedTicket.subject }}</h3>
          <button @click="selectedTicket = null" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">ID: {{ selectedTicket.id }}</span>
            <span class="text-sm text-gray-500">{{ formatDate(selectedTicket.createdAt) }}</span>
          </div>
          <div class="flex space-x-4">
            <span
              :class="getStatusClass(selectedTicket.status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ selectedTicket.status }}
            </span>
            <span
              :class="getPriorityClass(selectedTicket.priority)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ selectedTicket.priority }}
            </span>
          </div>
          <div>
            <h4 class="font-medium mb-2">Description</h4>
            <p class="text-gray-600">{{ selectedTicket.description }}</p>
          </div>
          <div v-if="selectedTicket.response">
            <h4 class="font-medium mb-2">Support Response</h4>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-blue-800">{{ selectedTicket.response }}</p>
              <span class="text-xs text-blue-600">{{ formatDate(selectedTicket.responseAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerSupport',
  data() {
    return {
      showNewTicket: false,
      selectedTicket: null,
      supportStats: {
        openTickets: 2,
        pendingResponse: 1,
        resolvedThisMonth: 8,
      },
      supportTickets: [
        {
          id: 'ST001',
          subject: 'Transaction Failed',
          description: 'Customer transaction failed but amount was debited',
          status: 'open',
          priority: 'high',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          response: null,
          responseAt: null,
        },
        {
          id: 'ST002',
          subject: 'Account Balance Discrepancy',
          description: 'Balance showing incorrect amount after last transaction',
          status: 'pending',
          priority: 'medium',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          response: 'We are investigating this issue. Please provide transaction ID.',
          responseAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
      newTicket: {
        subject: '',
        description: '',
        priority: 'medium',
      },
    }
  },
  methods: {
    createTicket() {
      const ticket = {
        id: 'ST' + String(Date.now()).slice(-3),
        subject: this.newTicket.subject,
        description: this.newTicket.description,
        status: 'open',
        priority: this.newTicket.priority,
        createdAt: new Date().toISOString(),
        response: null,
        responseAt: null,
      }

      this.supportTickets.unshift(ticket)
      this.supportStats.openTickets++

      // Reset form
      this.newTicket = {
        subject: '',
        description: '',
        priority: 'medium',
      }
      this.showNewTicket = false

      // Show success notification
      this.$emit('notification', {
        type: 'success',
        title: 'Ticket Created',
        message: `Support ticket ${ticket.id} has been created successfully.`,
      })
    },

    getStatusClass(status) {
      const classes = {
        open: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-blue-100 text-blue-800',
        closed: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getPriorityClass(priority) {
      const classes = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800',
      }
      return classes[priority] || 'bg-gray-100 text-gray-800'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    },
  },
}
</script>
