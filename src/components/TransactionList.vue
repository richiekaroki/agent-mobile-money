@@ .. @@
     const emitPageChange = () => {
       // Note: This component doesn't emit changePage event in current setup
       // If needed, add emit definition and use context.emit
     }

@@ .. @@
   },
   setup(props, { emit }) {
     const transactions = ref([])