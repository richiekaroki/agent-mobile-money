@@ .. @@
     },
     setAgentProfile(state, profile) {
       state.agentProfile = profile
+      // Store timestamp for token validation
+      localStorage.setItem('mobicash_token_timestamp', Date.now().toString())
     },