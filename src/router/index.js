@@ .. @@
 // Auth guard
 const requireAuth = (to, from, next) => {
   const token = localStorage.getItem('authToken')
-  const token = localStorage.getItem('authToken')
   if (token) {
     next()
   } else {
     next('/auth')
   }
 }

 const redirectIfAuth = (to, from, next) => {
   const token = localStorage.getItem('authToken')
   if (token) {
-  }
-  if (token) {
     next('/')
   } else {
     next()
   }
 }