// Authentication service with proper security measures
import { ref } from 'vue'

class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.mobicash.com'
    this.tokenKey = 'mobicash_auth_token'
    this.userKey = 'mobicash_user_data'
    this.refreshTokenKey = 'mobicash_refresh_token'
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
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
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
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    if (score <= 2) return { level: 'weak', color: 'red', percentage: 33 }
    if (score <= 4) return { level: 'medium', color: 'yellow', percentage: 66 }
    return { level: 'strong', color: 'green', percentage: 100 }
  }

  // Simulate API calls (replace with real API endpoints)
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

        // Demo credentials
        const demoUsers = [
          {
            email: 'demo@agent.com',
            password: 'demo123',
            userData: {
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
          },
          {
            email: 'admin@mobicash.com',
            password: 'admin123',
            userData: {
              id: 'ADM001',
              name: 'System Administrator',
              email: 'admin@mobicash.com',
              phone: '+254 700 000 000',
              agentId: 'ADM001',
              location: 'Nairobi, Kenya',
              joinDate: '2023-01-01',
              status: 'active',
              balance: 100000,
              role: 'admin',
              verified: true,
              lastLogin: new Date().toISOString()
            }
          }
        ]

        const user = demoUsers.find(u => u.email === email && u.password === password)

        if (!user) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }

        // Generate tokens
        const accessToken = this.generateSecureToken(64)
        const refreshToken = this.generateSecureToken(32)

        // Store tokens
        localStorage.setItem(this.tokenKey, accessToken)
        localStorage.setItem(this.userKey, JSON.stringify(user.userData))
        
        if (rememberMe) {
          localStorage.setItem(this.refreshTokenKey, refreshToken)
        }

        resolve({
          success: true,
          user: user.userData,
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
          throw new Error('Password must be at least 8 characters with uppercase, lowercase, and numbers')
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }

        // Check if email already exists (simulate)
        const existingEmails = ['existing@test.com', 'taken@example.com']
        if (existingEmails.includes(email.toLowerCase())) {
          throw new Error('An account with this email already exists')
        }

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
          status: 'pending_verification',
          balance: 5000, // Starting bonus
          role: 'agent',
          verified: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
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
          message: 'Account created successfully! Please verify your email.'
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
}

export default new AuthService()