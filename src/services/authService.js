// Authentication service with proper user management
import { ref } from 'vue'

class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.mobicash.com'
    this.tokenKey = 'mobicash_auth_token'
    this.userKey = 'mobicash_user_data'
    this.refreshTokenKey = 'mobicash_refresh_token'
    this.usersKey = 'mobicash_registered_users' // Store for registered users
  }

  // Get all registered users from localStorage
  getRegisteredUsers() {
    try {
      const users = localStorage.getItem(this.usersKey)
      return users ? JSON.parse(users) : []
    } catch (error) {
      return []
    }
  }

  // Save user to registered users list
  saveUser(userData) {
    try {
      const users = this.getRegisteredUsers()
      const existingUserIndex = users.findIndex(u => u.email === userData.email)
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = userData
      } else {
        users.push(userData)
      }
      
      localStorage.setItem(this.usersKey, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Error saving user:', error)
      return false
    }
  }

  // Find user by email
  findUserByEmail(email) {
    const users = this.getRegisteredUsers()
    return users.find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  // Generate secure token (in production, this comes from your backend)
  generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Hash password (in production, use proper bcrypt on backend)
  async hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'mobicash_salt_2024')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone number (Kenya format)
  validatePhone(phone) {
    const phoneRegex = /^(\+254|0)[17]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Password strength validation
  validatePassword(password) {
    const minLength = 6 // Reduced for easier testing
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength,
      strength: this.calculatePasswordStrength(password),
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    }
  }

  calculatePasswordStrength(password) {
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    if (score <= 2) return { level: 'weak', color: 'red', percentage: 33 }
    if (score <= 4) return { level: 'medium', color: 'yellow', percentage: 66 }
    return { level: 'strong', color: 'green', percentage: 100 }
  }

  // Sign in with registered users
  async signIn(credentials) {
    return new Promise(async (resolve, reject) => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const { email, password, rememberMe } = credentials

        // Input validation
        if (!this.validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }

        // Check demo user first
        if (email === 'demo@agent.com' && password === 'demo123') {
          const demoUser = {
            id: 'AG001',
            name: 'Richard Karoki',
            email: 'demo@agent.com',
            phone: '+254 700 123 456',
            agentId: 'AG001',
            location: 'Nairobi, Kenya',
            joinDate: '2023-01-15',
            status: 'active',
            balance: 45250,
            role: 'agent',
            verified: true,
            lastLogin: new Date().toISOString()
          }

          const accessToken = this.generateSecureToken(64)
          const refreshToken = this.generateSecureToken(32)

          localStorage.setItem(this.tokenKey, accessToken)
          localStorage.setItem(this.userKey, JSON.stringify(demoUser))
          
          if (rememberMe) {
            localStorage.setItem(this.refreshTokenKey, refreshToken)
          }

          resolve({
            success: true,
            user: demoUser,
            accessToken,
            refreshToken: rememberMe ? refreshToken : null,
            message: 'Sign in successful'
          })
          return
        }

        // Check registered users
        const user = this.findUserByEmail(email)
        if (!user) {
          throw new Error('No account found with this email address. Please sign up first.')
        }

        // Verify password (in production, compare hashed passwords)
        const hashedPassword = await this.hashPassword(password)
        if (user.passwordHash !== hashedPassword) {
          throw new Error('Invalid password. Please check your credentials and try again.')
        }

        // Update last login
        user.lastLogin = new Date().toISOString()
        this.saveUser(user)

        // Generate tokens
        const accessToken = this.generateSecureToken(64)
        const refreshToken = this.generateSecureToken(32)

        // Store tokens
        localStorage.setItem(this.tokenKey, accessToken)
        localStorage.setItem(this.userKey, JSON.stringify(user))
        
        if (rememberMe) {
          localStorage.setItem(this.refreshTokenKey, refreshToken)
        }

        resolve({
          success: true,
          user: user,
          accessToken,
          refreshToken: rememberMe ? refreshToken : null,
          message: 'Sign in successful'
        })

      } catch (error) {
        reject({
          success: false,
          message: error.message || 'Sign in failed. Please try again.'
        })
      }
    })
  }

  async signUp(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const { firstName, lastName, email, phone, password, confirmPassword } = userData

        // Comprehensive validation
        if (!firstName || firstName.length < 2) {
          throw new Error('First name must be at least 2 characters long')
        }

        if (!lastName || lastName.length < 2) {
          throw new Error('Last name must be at least 2 characters long')
        }

        if (!this.validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        if (!this.validatePhone(phone)) {
          throw new Error('Please enter a valid Kenyan phone number (+254 or 07/01)')
        }

        const passwordValidation = this.validatePassword(password)
        if (!passwordValidation.isValid) {
          throw new Error('Password must be at least 6 characters long')
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }

        // Check if email already exists
        const existingUser = this.findUserByEmail(email)
        if (existingUser) {
          throw new Error('An account with this email already exists. Please sign in instead.')
        }

        // Hash password
        const passwordHash = await this.hashPassword(password)

        // Create new user
        const newUser = {
          id: `AG${Date.now().toString().slice(-6)}`,
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone: phone.replace(/\s/g, ''),
          agentId: `AG${Date.now().toString().slice(-6)}`,
          location: 'Kenya',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'active',
          balance: 10000, // Starting bonus
          role: 'agent',
          verified: true, // Auto-verify for demo
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          passwordHash // Store hashed password
        }

        // Save user to registered users
        if (!this.saveUser(newUser)) {
          throw new Error('Failed to create account. Please try again.')
        }

        // Generate tokens
        const accessToken = this.generateSecureToken(64)
        const refreshToken = this.generateSecureToken(32)

        // Store user data
        localStorage.setItem(this.tokenKey, accessToken)
        localStorage.setItem(this.userKey, JSON.stringify(newUser))
        localStorage.setItem(this.refreshTokenKey, refreshToken)

        resolve({
          success: true,
          user: newUser,
          accessToken,
          refreshToken,
          message: 'Account created successfully!'
        })

      } catch (error) {
        reject({
          success: false,
          message: error.message || 'Account creation failed. Please try again.'
        })
      }
    })
  }

  async signOut() {
    try {
      // In production, invalidate token on server
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.userKey)
      localStorage.removeItem(this.refreshTokenKey)
      
      return { success: true, message: 'Signed out successfully' }
    } catch (error) {
      return { success: false, message: 'Sign out failed' }
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Simulate API call to refresh token
      await new Promise(resolve => setTimeout(resolve, 500))

      const newAccessToken = this.generateSecureToken(64)
      localStorage.setItem(this.tokenKey, newAccessToken)

      return { success: true, accessToken: newAccessToken }
    } catch (error) {
      return { success: false, message: 'Token refresh failed' }
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.userKey)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      return null
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  isAuthenticated() {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  // Password reset (simulate)
  async requestPasswordReset(email) {
    return new Promise(async (resolve, reject) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (!this.validateEmail(email)) {
          throw new Error('Please enter a valid email address')
        }

        const user = this.findUserByEmail(email)
        if (!user) {
          throw new Error('No account found with this email address')
        }

        resolve({
          success: true,
          message: 'Password reset instructions have been sent to your email'
        })
      } catch (error) {
        reject({
          success: false,
          message: error.message || 'Password reset request failed'
        })
      }
    })
  }

  // Email verification (simulate)
  async verifyEmail(token) {
    return new Promise(async (resolve, reject) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const user = this.getCurrentUser()
        if (user) {
          user.verified = true
          user.status = 'active'
          localStorage.setItem(this.userKey, JSON.stringify(user))
          this.saveUser(user)
        }

        resolve({
          success: true,
          message: 'Email verified successfully'
        })
      } catch (error) {
        reject({
          success: false,
          message: 'Email verification failed'
        })
      }
    })
  }

  // Update user profile
  async updateProfile(updates) {
    return new Promise(async (resolve, reject) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))

        const currentUser = this.getCurrentUser()
        if (!currentUser) {
          throw new Error('No user logged in')
        }

        const updatedUser = { ...currentUser, ...updates }
        
        // Save to current session
        localStorage.setItem(this.userKey, JSON.stringify(updatedUser))
        
        // Save to registered users
        this.saveUser(updatedUser)

        resolve({
          success: true,
          user: updatedUser,
          message: 'Profile updated successfully'
        })
      } catch (error) {
        reject({
          success: false,
          message: error.message || 'Profile update failed'
        })
      }
    })
  }
}

export default new AuthService()