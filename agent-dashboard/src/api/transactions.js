// src/api/transactions.js
export function fetchMockTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = []
      for (let i = 1; i <= 50; i++) {
        const date = new Date(2024, 10, (i % 30) + 1).toISOString().split('T')[0] // Generate dates in November 2024
        const amount = (Math.random() * 1000).toFixed(2)
        const type = i % 2 === 0 ? 'withdrawal' : 'deposit' // Alternate between 'withdrawal' and 'deposit'
        transactions.push({ id: i, date, amount, type })
      }
      resolve(transactions)
    }, 1000) // Simulate network delay
  })
}
