
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

    <div class="space-y-6">
      <!-- Profile Settings -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              v-model="settings.profile.displayName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="settings.profile.email"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              v-model="settings.profile.phone"
              type="tel"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              v-model="settings.profile.location"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800">Email Notifications</p>
              <p class="text-sm text-gray-600">Receive transaction and account updates via email</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.notifications.email"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800">SMS Notifications</p>
              <p class="text-sm text-gray-600">Receive important alerts via SMS</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.notifications.sms"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800">Push Notifications</p>
              <p class="text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="settings.notifications.push"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800">Two-Factor Authentication</p>
              <p class="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button
              @click="settings.security.twoFactor = !settings.security.twoFactor"
              :class="settings.security.twoFactor ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'"
              class="px-4 py-2 text-white rounded-lg transition-colors"
            >
              {{ settings.security.twoFactor ? 'Enabled' : 'Disabled' }}
            </button>
          </div>

          <div>
            <button
              @click="showChangePassword = true"
              class="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <!-- App Settings -->
      <div class="border-b pb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">App Settings</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              v-model="settings.app.theme"
              class="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              v-model="settings.app.language"
              class="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              v-model="settings.app.currency"
              class="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button
          @click="resetSettings"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset to Default
        </button>
        <button
          @click="saveSettings"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Change Password</h3>
        <form @submit.prevent="changePassword">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                v-model="passwordForm.current"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                v-model="passwordForm.new"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                v-model="passwordForm.confirm"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showChangePassword = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      showChangePassword: false,
      settings: {
        profile: {
          displayName: 'John Doe',
          email: 'demo@agent.com',
          phone: '+254700123456',
          location: 'Nairobi, Kenya'
        },
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        security: {
          twoFactor: false
        },
        app: {
          theme: 'light',
          language: 'en',
          currency: 'KES'
        }
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  methods: {
    saveSettings() {
      // Save settings to localStorage or send to API
      localStorage.setItem('agent_settings', JSON.stringify(this.settings))

      this.$emit('notification', {
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been saved successfully.'
      })
    },

    resetSettings() {
      this.settings = {
        profile: {
          displayName: 'John Doe',
          email: 'demo@agent.com',
          phone: '+254700123456',
          location: 'Nairobi, Kenya'
        },
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        security: {
          twoFactor: false
        },
        app: {
          theme: 'light',
          language: 'en',
          currency: 'KES'
        }
      }

      this.$emit('notification', {
        type: 'info',
        title: 'Settings Reset',
        message: 'Settings have been reset to default values.'
      })
    },

    changePassword() {
      if (this.passwordForm.new !== this.passwordForm.confirm) {
        this.$emit('notification', {
          type: 'error',
          title: 'Password Mismatch',
          message: 'New passwords do not match.'
        })
        return
      }

      if (this.passwordForm.new.length < 6) {
        this.$emit('notification', {
          type: 'error',
          title: 'Weak Password',
          message: 'Password must be at least 6 characters long.'
        })
        return
      }

      // Simulate password change
      this.passwordForm = {
        current: '',
        new: '',
        confirm: ''
      }
      this.showChangePassword = false

      this.$emit('notification', {
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been changed successfully.'
      })
    }
  },

  mounted() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('agent_settings')
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
    }
  }
}
</script>
