import axios from 'axios'

// Use environment variables for Strapi Cloud configuration
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://acceptable-heart-0cd6e519a8.strapiapp.com'
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY

// Clean up URL to prevent double slashes
const cleanUrl = (url) => {
  return url.replace(/\/+$/, '') // Remove trailing slashes
}

// Validate configuration
if (!STRAPI_API_KEY) {
  console.warn('⚠️ VITE_STRAPI_API_KEY is missing! Add it to your .env file')
}

// Create axios instance with Strapi Cloud configuration
const api = axios.create({
  baseURL: `${cleanUrl(STRAPI_URL)}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    
    // Log headers for debugging (without exposing the full token)
    if (config.headers.Authorization) {
      console.log('✅ Authorization header present')
    } else {
      console.warn('⚠️ No Authorization header')
    }
    
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data)
      
      // Specific error handling
      switch (error.response.status) {
        case 400:
          console.error('💡 Tip: Check API token and endpoint URLs')
          break
        case 401:
          console.error('💡 Tip: API token may be invalid or expired')
          break
        case 403:
          console.error('💡 Tip: API token lacks required permissions')
          break
        case 404:
          console.error('💡 Tip: Endpoint not found - check collection/single type names')
          break
      }
    } else if (error.request) {
      console.error('❌ Network Error:', error.message)
    } else {
      console.error('❌ Request Setup Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API service methods
export const apiService = {
  // Get contact data (single type)
  async getContact() {
    try {
      const response = await api.get('/contact?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching contact:', error)
      // Return null instead of throwing to prevent app crash
      return { data: null }
    }
  },

  // Get content data (single type)
  async getContent() {
    try {
      const response = await api.get('/content?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching content:', error)
      return { data: null }
    }
  },

  // Get all projects (collection type)
  async getProjects() {
    try {
      const response = await api.get('/projets?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { data: [] }
    }
  },

  // Get single project by id
  async getProject(id) {
    try {
      const response = await api.get(`/projets/${id}?populate=*`)
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      return { data: null }
    }
  },

  // Test connection
  async testConnection() {
    try {
      console.log('🧪 Testing Strapi connection...')
      console.log('🔗 Base URL:', api.defaults.baseURL)
      const response = await api.get('/users-permissions/roles')
      console.log('✅ Connection successful!')
      return true
    } catch (error) {
      console.error('❌ Connection failed:', error.response?.data || error.message)
      return false
    }
  },

  // Utility method to get current configuration
  getConfig() {
    return {
      baseURL: api.defaults.baseURL,
      originalUrl: STRAPI_URL,
      cleanedUrl: cleanUrl(STRAPI_URL),
      hasApiKey: !!STRAPI_API_KEY,
      environment: import.meta.env.MODE,
      usingCloud: true
    }
  }
}

export default api