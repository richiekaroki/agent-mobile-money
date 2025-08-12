// Enhanced Authentication Service with proper security practices
class AuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://api.mobicash.com'
    this.tokenKey = 'mobicash_auth_token'
    this.userKey = 'mobicash_user_data'
    this.refreshTokenKey = 'mobicash_refresh_token'
    this.usersKey = 'mobicash_registered_users'
    this.sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
  }

  // Secure token generation
  generateSecureToken(length = 32) {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Improved password hashing with salt
  async hashPassword(password, salt = null) {
    if (!salt) {
      salt = this.generateSecureToken(16)
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt + 'mobicash_2024')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return { hash: hashHex, salt }
  }

  // Enhanced email validation
  validateEmail(email) {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Enhanced phone validation for Kenya
  validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-()]/g, '')
    const kenyaRegex = /^(\+254|254|0)(7[0-9]{8}|1[0-9]{8})$/
    return kenyaRegex.test(cleanPhone)
  }

  // Improved password validation
  validatePassword(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasNoSpaces = !/\s/.test(password)

    const requirements = {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      hasNoSpaces,
    }

    const score = Object.values(requirements).filter(Boolean).length
    const isValid = score >= 5 // At least 5 out of 6 requirements

    return {
      isValid,
      requirements,
      strength: this.calculatePasswordStrength(password, score),
    }
  }

  calculatePasswordStrength(password, score = null) {
    if (score === null) {
      score = 0
      if (password.length >= 8) score += 1
      if (password.length >= 12) score += 1
      if (/[A-Z]/.test(password)) score += 1
      if (/[a-z]/.test(password)) score += 1
      if (/\d/.test(password)) score += 1
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
    }

    if (score <= 2) return { level: 'weak', color: 'red', percentage: 25 }
    if (score <= 4) return { level: 'medium', color: 'yellow', percentage: 60 }
    if (score <= 5) return { level: 'strong', color: 'green', percentage: 85 }
    return { level: 'very strong', color: 'green', percentage: 100 }
  }

  // Secure user storage
  getRegisteredUsers() {
    try {
      const users = localStorage.getItem(this.usersKey)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  saveUser(userData) {
    try {
      const users = this.getRegisteredUsers()
      const existingUserIndex = users.findIndex(u => u.email === userData.email)

      const userToSave = {
        ...userData,
        updatedAt: new Date().toISOString(),
      }

      if (existingUserIndex >= 0) {
        users[existingUserIndex] = userToSave
      } else {
        users.push(userToSave)
      }

      localStorage.setItem(this.usersKey, JSON.stringify(users))
      return true
    } catch {
      return false
    }
  }

  findUserByEmail(email) {
    const users = this.getRegisteredUsers()
    return users.find(u => u.email.toLowerCase() === email.toLowerCase())
  }

  // Enhanced sign up with better validation
  async signUp(userData) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(async () => {
        try {
          const { firstName, lastName, email, phone, password, confirmPassword } = userData

          // Comprehensive validation
          const errors = []

          if (!firstName || firstName.trim().length < 2) {
            errors.push('First name must be at least 2 characters long')
          }

          if (!lastName || lastName.trim().length < 2) {
            errors.push('Last name must be at least 2 characters long')
          }

          if (!this.validateEmail(email)) {
            errors.push('Please enter a valid email address')
          }

          if (!this.validatePhone(phone)) {
            errors.push('Please enter a valid Kenyan phone number')
          }

          const passwordValidation = this.validatePassword(password)
          if (!passwordValidation.isValid) {
            errors.push(
              'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
            )
          }

          if (password !== confirmPassword) {
            errors.push('Passwords do not match')
          }

          if (errors.length > 0) {
            throw new Error(errors.join('. '))
          }

          // Check if email already exists
          const existingUser = this.findUserByEmail(email)
          if (existingUser) {
            throw new Error('An account with this email already exists. Please sign in instead.')
          }

          // Hash password with salt
          const { hash: passwordHash, salt } = await this.hashPassword(password)

          // Create new user
          const newUser = {
            id: `AG${Date.now().toString().slice(-6)}`,
            name: `${firstName.trim()} ${lastName.trim()}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.replace(/[\s\-()]/g, ''),
            agentId: `AG${Date.now().toString().slice(-6)}`,
            location: 'Kenya',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active',
            balance: 10000,
            role: 'agent',
            verified: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            passwordHash,
            passwordSalt: salt,
            loginAttempts: 0,
            lockedUntil: null,
          }

          // Save user
          if (!this.saveUser(newUser)) {
            throw new Error('Failed to create account. Please try again.')
          }

          // Generate tokens
          const accessToken = this.generateSecureToken(64)
          const refreshToken = this.generateSecureToken(32)

          // Store session data
          this.setSession(newUser, accessToken, refreshToken)

          resolve({
            success: true,
            user: this.sanitizeUser(newUser),
            accessToken,
            refreshToken,
            message: 'Account created successfully!',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Account creation failed. Please try again.',
          })
        }
      }, 1500)
    })
  }

  // Enhanced sign in with security features
  async signIn(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { email, password, rememberMe } = credentials

          // Input validation
          if (!this.validateEmail(email)) {
            throw new Error('Please enter a valid email address')
          }

          if (!password || password.length < 6) {
            throw new Error('Password is required')
          }

          // Demo user check
          if (email === 'demo@agent.com' && password === 'demo123') {
            const demoUser = this.createDemoUser()
            const accessToken = this.generateSecureToken(64)
            const refreshToken = this.generateSecureToken(32)

            this.setSession(demoUser, accessToken, refreshToken, rememberMe)

            resolve({
              success: true,
              user: this.sanitizeUser(demoUser),
              accessToken,
              refreshToken: rememberMe ? refreshToken : null,
              message: 'Welcome to the demo!',
            })
            return
          }

          // Find user
          const user = this.findUserByEmail(email)
          if (!user) {
            throw new Error('No account found with this email address')
          }

          // Check if account is locked
          if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
            const lockTime = Math.ceil((new Date(user.lockedUntil) - new Date()) / (1000 * 60))
            throw new Error(`Account is locked. Try again in ${lockTime} minutes.`)
          }

          // Verify password
          const { hash } = await this.hashPassword(password, user.passwordSalt)
          if (hash !== user.passwordHash) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1

            if (user.loginAttempts >= 5) {
              user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
              this.saveUser(user)
              throw new Error('Too many failed attempts. Account locked for 30 minutes.')
            }

            this.saveUser(user)
            throw new Error(`Invalid password. ${5 - user.loginAttempts} attempts remaining.`)
          }

          // Reset login attempts on successful login
          user.loginAttempts = 0
          user.lockedUntil = null
          user.lastLogin = new Date().toISOString()
          this.saveUser(user)

          // Generate tokens
          const accessToken = this.generateSecureToken(64)
          const refreshToken = this.generateSecureToken(32)

          this.setSession(user, accessToken, refreshToken, rememberMe)

          resolve({
            success: true,
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken: rememberMe ? refreshToken : null,
            message: 'Sign in successful',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Sign in failed. Please try again.',
          })
        }
      }, 1000)
    })
  }

  // Session management
  setSession(user, accessToken, refreshToken, rememberMe = false) {
    const sessionData = {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      expiresAt: Date.now() + this.sessionTimeout,
      rememberMe,
    }

    localStorage.setItem(this.tokenKey, accessToken)
    localStorage.setItem(this.userKey, JSON.stringify(sessionData.user))
    localStorage.setItem('userData', JSON.stringify(sessionData.user)) // Add this line for compatibility

    if (rememberMe) {
      localStorage.setItem(this.refreshTokenKey, refreshToken)
    }
  }

  // Remove sensitive data from user object
  sanitizeUser(user) {
    const { passwordHash, passwordSalt, loginAttempts, lockedUntil, ...sanitizedUser } = user
    return sanitizedUser
  }

  // Create demo user
  createDemoUser() {
    return {
      id: 'AG001',
      name: 'John Doe',
      email: 'demo@agent.com',
      phone: '+254700123456',
      agentId: 'AG001',
      location: 'Nairobi, Kenya',
      joinDate: '2023-01-15',
      status: 'active',
      balance: 45250,
      role: 'agent',
      verified: true,
      lastLogin: new Date().toISOString(),
    }
  }

  // Enhanced session validation
  isAuthenticated() {
    try {
      const token = this.getToken()
      const user = this.getCurrentUser()

      if (!token || !user) {
        return false
      }

      // Check if session has expired (optional, for enhanced security)
      const userData = localStorage.getItem(this.userKey)
      if (userData) {
        const session = JSON.parse(userData)
        if (session.expiresAt && Date.now() > session.expiresAt) {
          this.signOut()
          return false
        }
      }

      return true
    } catch {
      return false
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.userKey)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  async signOut() {
    try {
      // Clear all auth data
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.userKey)
      localStorage.removeItem(this.refreshTokenKey)

      return { success: true, message: 'Signed out successfully' }
    } catch {
      return { success: false, message: 'Sign out failed' }
    }
  }

  // Enhanced token refresh
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newAccessToken = this.generateSecureToken(64)
      localStorage.setItem(this.tokenKey, newAccessToken)

      return { success: true, accessToken: newAccessToken }
    } catch {
      this.signOut() // Force logout on refresh failure
      return { success: false, message: 'Session expired. Please sign in again.' }
    }
  }

  // Password reset functionality
  async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          if (!this.validateEmail(email)) {
            throw new Error('Please enter a valid email address')
          }

          const user = this.findUserByEmail(email)
          if (!user) {
            // Don't reveal if email exists for security
            resolve({
              success: true,
              message:
                'If an account with this email exists, password reset instructions have been sent.',
            })
            return
          }

          // In a real app, you'd send an email with a secure token
          resolve({
            success: true,
            message: 'Password reset instructions have been sent to your email',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Password reset request failed',
          })
        }
      }, 1000)
    })
  }

  // Update user profile
  async updateProfile(updates) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = this.getCurrentUser()
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          // Validate updates
          if (updates.email && !this.validateEmail(updates.email)) {
            throw new Error('Invalid email address')
          }

          if (updates.phone && !this.validatePhone(updates.phone)) {
            throw new Error('Invalid phone number')
          }

          const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString(),
          }

          // Save to current session
          localStorage.setItem(this.userKey, JSON.stringify(updatedUser))

          // Save to registered users
          this.saveUser(updatedUser)

          resolve({
            success: true,
            user: this.sanitizeUser(updatedUser),
            message: 'Profile updated successfully',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Profile update failed',
          })
        }
      }, 500)
    })
  }

  // Change password - COMPLETED METHOD
  async changePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = this.getCurrentUser()
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          const user = this.findUserByEmail(currentUser.email)
          if (!user) {
            throw new Error('User not found')
          }

          // Verify current password
          const { hash } = await this.hashPassword(currentPassword, user.passwordSalt)
          if (hash !== user.passwordHash) {
            throw new Error('Current password is incorrect')
          }

          // Validate new password
          const passwordValidation = this.validatePassword(newPassword)
          if (!passwordValidation.isValid) {
            throw new Error(
              'New password must be at least 8 characters with uppercase, lowercase, number, and special character'
            )
          }

          // Hash new password
          const { hash: newPasswordHash, salt: newSalt } = await this.hashPassword(newPassword)

          // Update user with new password
          user.passwordHash = newPasswordHash
          user.passwordSalt = newSalt
          user.updatedAt = new Date().toISOString()

          // Save updated user
          if (!this.saveUser(user)) {
            throw new Error('Failed to update password. Please try again.')
          }

          resolve({
            success: true,
            message: 'Password changed successfully',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Password change failed',
          })
        }
      }, 800)
    })
  }

  // Account verification status
  async verifyAccount(verificationCode) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = this.getCurrentUser()
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          // Simulate verification code check
          if (verificationCode !== '123456') {
            throw new Error('Invalid verification code')
          }

          const user = this.findUserByEmail(currentUser.email)
          if (!user) {
            throw new Error('User not found')
          }

          // Update verification status
          user.verified = true
          user.verifiedAt = new Date().toISOString()
          user.updatedAt = new Date().toISOString()

          // Save updated user
          if (!this.saveUser(user)) {
            throw new Error('Failed to verify account. Please try again.')
          }

          // Update session
          const updatedUser = this.sanitizeUser(user)
          localStorage.setItem(this.userKey, JSON.stringify(updatedUser))

          resolve({
            success: true,
            user: updatedUser,
            message: 'Account verified successfully',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Account verification failed',
          })
        }
      }, 1000)
    })
  }

  // Get user statistics
  getUserStats() {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return null
    }

    const user = this.findUserByEmail(currentUser.email)
    if (!user) {
      return null
    }

    return {
      joinDate: user.joinDate,
      lastLogin: user.lastLogin,
      totalSessions: user.totalSessions || 0,
      accountAge: this.calculateAccountAge(user.createdAt),
      isVerified: user.verified,
      accountStatus: user.status,
    }
  }

  // Calculate account age
  calculateAccountAge(createdAt) {
    const now = new Date()
    const created = new Date(createdAt)
    const diffTime = Math.abs(now - created)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} year${years > 1 ? 's' : ''}`
    }
  }

  // Delete account
  async deleteAccount(password) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = this.getCurrentUser()
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          const user = this.findUserByEmail(currentUser.email)
          if (!user) {
            throw new Error('User not found')
          }

          // Verify password for security
          const { hash } = await this.hashPassword(password, user.passwordSalt)
          if (hash !== user.passwordHash) {
            throw new Error('Password is incorrect')
          }

          // Remove user from registered users
          const users = this.getRegisteredUsers()
          const filteredUsers = users.filter(u => u.email !== user.email)
          localStorage.setItem(this.usersKey, JSON.stringify(filteredUsers))

          // Sign out user
          await this.signOut()

          resolve({
            success: true,
            message: 'Account deleted successfully',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Account deletion failed',
          })
        }
      }, 1000)
    })
  }

  // Export user data (GDPR compliance)
  async exportUserData() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const currentUser = this.getCurrentUser()
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          const user = this.findUserByEmail(currentUser.email)
          if (!user) {
            throw new Error('User not found')
          }

          // Remove sensitive data for export
          const exportData = {
            ...this.sanitizeUser(user),
            exportedAt: new Date().toISOString(),
          }

          resolve({
            success: true,
            data: exportData,
            message: 'User data exported successfully',
          })
        } catch (error) {
          reject({
            success: false,
            message: error.message || 'Data export failed',
          })
        }
      }, 500)
    })
  }
}

// Create and export instance
const authService = new AuthService()
export { authService }
export default authService
