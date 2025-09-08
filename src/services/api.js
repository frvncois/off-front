import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Authorization': 'Bearer 20b1388c24ebc2d68f69c83df0ea11fbe3ef7c501c9eac5cc4cbbe17a82118bca6432bc1a8eb7689246b2f4522828dbf3c62e68d8e832b227d093cfaad7c3d4ce952f6b900128c4465274b575e8b666acf2d5f13cd52e5d712ef327a3baca1dee964ce0f9826e9a1b3b3f5226a3e85dd62e9fdef17a94101df90606b34a4431f',
    'Content-Type': 'application/json'
  }
})

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
      const response = await api.get('/projets/${id}?populate=*')
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  }
}

export default api