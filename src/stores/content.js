import { defineStore } from 'pinia'
import { apiService } from '@/services/api'

export const useContentStore = defineStore('content', {
  state: () => ({
    contact: null,
    content: null,
    projects: [],
    loading: false,
    error: null
  }),

  getters: {
    // Get contact information
    getContactInfo: (state) => state.contact,
    
    // Get general content
    getGeneralContent: (state) => state.content,
    
    // Get all projects
    getAllProjects: (state) => state.projects,
    
    // Get project by id
    getProjectById: (state) => (id) => {
      return state.projects.find(project => project.id === parseInt(id))
    },
    
    // Check if data is loading
    isLoading: (state) => state.loading,
    
    // Get error state
    hasError: (state) => state.error
  },

  actions: {
    // Fetch all content from Strapi
    async fetchAllContent() {
      this.loading = true
      this.error = null
      
      try {
        // Fetch all content types in parallel
        const [contactData, contentData, projectsData] = await Promise.all([
          apiService.getContact(),
          apiService.getContent(),
          apiService.getProjects()
        ])
        
        // Store the direct data objects (not wrapped in .data)
        this.contact = contactData.data
        this.content = contentData.data
        this.projects = projectsData.data
        
      } catch (error) {
        this.error = error.message
        console.error('Error fetching all content:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch contact data only
    async fetchContact() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getContact()
        this.contact = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching contact:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch content data only
    async fetchContent() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getContent()
        this.content = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching content:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch projects data only
    async fetchProjects() {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getProjects()
        this.projects = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching projects:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch single project
    async fetchProject(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await apiService.getProject(id)
        
        // Update the project in the projects array if it exists
        const index = this.projects.findIndex(project => project.id === parseInt(id))
        if (index !== -1) {
          this.projects[index] = response.data
        } else {
          this.projects.push(response.data)
        }
        
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching project:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Clear error state
    clearError() {
      this.error = null
    },

    // Reset store
    reset() {
      this.contact = null
      this.content = null
      this.projects = []
      this.loading = false
      this.error = null
    }
  }
})