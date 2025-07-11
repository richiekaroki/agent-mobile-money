@@ .. @@
     agentProfile: {
       name: 'Agent Name',
       balance: 0,
+      agentId: '',
+      phone: '',
+      location: '',
+      joinDate: '',
+      status: ''
     },
@@ .. @@
     
     async fetchAgentProfile({ commit }) {
       try {
-        // Simulate API call
-        await new Promise(resolve => setTimeout(resolve, 500))
+        // Get current user from localStorage or auth service
+        const userData = localStorage.getItem('userData')
+        if (userData) {
+          const user = JSON.parse(userData)
+          commit('setAgentProfile', user)
+          
+          // Update dashboard stats
+          commit('setDashboardStats', {
+            totalBalance: user.balance || 0,
+            commissionEarned: 2150,
+            monthlyTarget: 5000,
+            dailyTarget: 50
+          })
+          return
+        }
         
-        const mockProfile = { 
-          name: 'Richard Karoki', 
-          balance: 45250,
-          agentId: 'AG001',
-          phone: '+254 700 123 456',
-          location: 'Nairobi, Kenya',
-          joinDate: '2023-01-15',
-          status: 'active'
+        // Fallback to demo profile if no user data
+        await new Promise(resolve => setTimeout(resolve, 500))
+        
+        const demoProfile = { 
+          name: 'Demo Agent', 
+          balance: 10000,
+          agentId: 'AG000',
+          phone: '+254 700 000 000',
+          location: 'Kenya',
+          joinDate: new Date().toISOString().split('T')[0],
+          status: 'active'
         }
-        commit('setAgentProfile', mockProfile)
+        commit('setAgentProfile', demoProfile)
         
         // Update dashboard stats
         commit('setDashboardStats', {
-          totalBalance: mockProfile.balance,
+          totalBalance: demoProfile.balance,
           commissionEarned: 2150,
           monthlyTarget: 5000,
           dailyTarget: 50