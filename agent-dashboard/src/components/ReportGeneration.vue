
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Report Generation</h2>
      <button
        @click="showNewReport = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate New Report
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800">Reports Generated</h3>
        <p class="text-2xl font-bold text-blue-600">{{ reportStats.generated }}</p>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-green-800">This Month</h3>
        <p class="text-2xl font-bold text-green-600">{{ reportStats.thisMonth }}</p>
      </div>
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-800">Pending</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ reportStats.pending }}</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg">
        <h3 class="text-sm font-medium text-purple-800">Scheduled</h3>
        <p class="text-2xl font-bold text-purple-600">{{ reportStats.scheduled }}</p>
      </div>
    </div>

    <!-- Report Templates -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Report Templates</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in reportTemplates"
          :key="template.id"
          class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="generateQuickReport(template)"
        >
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" :class="template.iconBg">
              <span class="text-white text-sm">{{ template.icon }}</span>
            </div>
            <h4 class="font-medium text-gray-800">{{ template.name }}</h4>
          </div>
          <p class="text-sm text-gray-600">{{ template.description }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">Recent Reports</h3>
      <div v-if="reports.length === 0" class="text-center py-8 text-gray-500">
        No reports generated yet
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="report in reports"
          :key="report.id"
          class="border rounded-lg p-4 hover:bg-gray-50"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">{{ report.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ report.description }}</p>
              <div class="flex items-center mt-2 space-x-4">
                <span class="text-xs text-gray-500">{{ formatDate(report.createdAt) }}</span>
                <span class="text-xs text-gray-500">{{ report.type }}</span>
                <span class="text-xs text-gray-500">{{ report.period }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="getStatusClass(report.status)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ report.status }}
              </span>
              <button
                v-if="report.status === 'completed'"
                @click="downloadReport(report)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Download
              </button>
              <button
                @click="deleteReport(report)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Report Modal -->
    <div v-if="showNewReport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 class="text-lg font-semibold mb-4">Generate Custom Report</h3>
        <form @submit.prevent="generateReport">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
              <input
                v-model="newReport.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter report name"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                v-model="newReport.type"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="transactions">Transaction Report</option>
                <option value="commission">Commission Report</option>
                <option value="balance">Balance Report</option>
                <option value="performance">Performance Report</option>
                <option value="customer">Customer Report</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                v-model="newReport.period"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div v-if="newReport.period === 'custom'" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  v-model="newReport.startDate"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  v-model="newReport.endDate"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                v-model="newReport.format"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (XLSX)</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Report</label>
              <div class="flex items-center">
                <input
                  v-model="newReport.emailReport"
                  type="checkbox"
                  class="mr-2"
                >
                <span class="text-sm text-gray-600">Send report to my email</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showNewReport = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportGeneration',
  data() {
    return {
      showNewReport: false,
      reportStats: {
        generated: 24,
        thisMonth: 8,
        pending: 2,
        scheduled: 3
      },
      reportTemplates: [
        {
          id: 1,
          name: 'Daily Transactions',
          description: 'All transactions from today',
          icon: '📊',
          iconBg: 'bg-blue-500',
          type: 'transactions',
          period: 'today'
        },
        {
          id: 2,
          name: 'Weekly Commission',
          description: 'Commission earned this week',
          icon: '💰',
          iconBg: 'bg-green-500',
          type: 'commission',
          period: 'last7days'
        },
        {
          id: 3,
          name: 'Monthly Performance',
          description: 'Performance metrics for this month',
          icon: '📈',
          iconBg: 'bg-purple-500',
          type: 'performance',
          period: 'thismonth'
        },
        {
          id: 4,
          name: 'Balance Summary',
          description: 'Current balance and history',
          icon: '💳',
          iconBg: 'bg-orange-500',
          type: 'balance',
          period: 'last30days'
        }
      ],
      reports: [
        {
          id: 'RPT001',
          name: 'Weekly Transaction Report',
          description: 'Transaction summary for the past week',
          type: 'transactions',
          period: 'last7days',
          status: 'completed',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          format: 'pdf'
        },
        {
          id: 'RPT002',
          name: 'Monthly Commission Report',
          description: 'Commission breakdown for current month',
          type: 'commission',
          period: 'thismonth',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          format: 'excel'
        }
      ],
      newReport: {
        name: '',
        type: 'transactions',
        period: 'last7days',
        startDate: '',
        endDate: '',
        format: 'pdf',
        emailReport: false
      }
    }
  },
  methods: {
    generateQuickReport(template) {
      const report = {
        id: 'RPT' + String(Date.now()).slice(-3),
        name: template.name,
        description: template.description,
        type: template.type,
        period: template.period,
        status: 'pending',
        createdAt: new Date().toISOString(),
        format: 'pdf'
      }

      this.reports.unshift(report)
      this.reportStats.pending++

      // Simulate report generation
      setTimeout(() => {
        report.status = 'completed'
        this.reportStats.pending--
        this.reportStats.generated++
        this.reportStats.thisMonth++

        this.$emit('notification', {
          type: 'success',
          title: 'Report Ready',
          message: `${report.name} has been generated successfully.`
        })
      }, 3000)

      this.$emit('notification', {
        type: 'info',
        title: 'Report Generation Started',
        message: `Generating ${template.name}...`
      })
    },

    generateReport() {
      const report = {
        id: 'RPT' + String(Date.now()).slice(-3),
        name: this.newReport.name,
        description: `Custom ${this.newReport.type} report`,
        type: this.newReport.type,
        period: this.newReport.period,
        status: 'pending',
        createdAt: new Date().toISOString(),
        format: this.newReport.format
      }

      this.reports.unshift(report)
      this.reportStats.pending++

      // Reset form
      this.newReport = {
        name: '',
        type: 'transactions',
        period: 'last7days',
        startDate: '',
        endDate: '',
        format: 'pdf',
        emailReport: false
      }
      this.showNewReport = false

      // Simulate report generation
      setTimeout(() => {
        report.status = 'completed'
        this.reportStats.pending--
        this.reportStats.generated++
        this.reportStats.thisMonth++

        this.$emit('notification', {
          type: 'success',
          title: 'Report Ready',
          message: `${report.name} has been generated successfully.`
        })
      }, 5000)

      this.$emit('notification', {
        type: 'info',
        title: 'Report Generation Started',
        message: `Generating custom report...`
      })
    },

    downloadReport(report) {
      // Simulate file download
      const blob = new Blob(['Sample report content'], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.name}.${report.format}`
      a.click()
      window.URL.revokeObjectURL(url)

      this.$emit('notification', {
        type: 'success',
        title: 'Download Started',
        message: `Downloading ${report.name}...`
      })
    },

    deleteReport(report) {
      const index = this.reports.findIndex(r => r.id === report.id)
      if (index > -1) {
        this.reports.splice(index, 1)
        this.reportStats.generated--

        this.$emit('notification', {
          type: 'info',
          title: 'Report Deleted',
          message: `${report.name} has been deleted.`
        })
      }
    },

    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>
