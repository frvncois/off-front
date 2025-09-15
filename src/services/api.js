import axios from 'axios'

// Use environment variables for Strapi Cloud configuration
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://acceptable-heart-0cd6e519a8.strapiapp.com'
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY

// Create axios instance with Strapi Cloud configuration
const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${STRAPI_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
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
      throw error
    }
  },

  // Get content data (single type)
  async getContent() {
    try {
      const response = await api.get('/content?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching content:', error)
      throw error
    }
  },

  // Get all projects (collection type)
  async getProjects() {
    try {
      const response = await api.get('/projets?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  // Get single project by id
  async getProject(id) {
    try {
      const response = await api.get(`/projets/${id}?populate=*`)
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  },

  // Utility method to get current configuration
  getConfig() {
    return {
      baseURL: `${STRAPI_URL}/api`,
      environment: import.meta.env.MODE,
      usingCloud: true
    }
  }
}

export default api