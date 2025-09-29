# CLAUDE.md - OFF Studio Frontend

This document provides essential information for future Claude instances working on the OFF Studio frontend project.

## Project Overview

This is a **Vue 3 + Vite** frontend application for OFF Studio, a creative agency/portfolio website. The application connects to a **Strapi headless CMS** backend and features smooth scrolling animations using **GSAP (GreenSock Animation Platform)**.

### Technology Stack
- **Vue 3** with Composition API
- **Vite** (build tool and dev server)
- **Vue Router** for navigation
- **Pinia** for state management
- **GSAP Pro** with multiple plugins (ScrollTrigger, ScrollSmoother, SplitText, etc.)
- **Strapi** headless CMS as backend
- **Axios** for API calls
- **Lenis** and **AnimeJS** for additional animations

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── global/          # Site-wide components (Header, Footer, CTA)
│   ├── home/            # Homepage components (Hero, Projects, Stats, About)
│   ├── projects/        # Projects listing components
│   ├── single/          # Single project detail components
│   └── contact/         # Contact page components
├── views/               # Vue Router views (HomeView, ProjectsView, etc.)
├── stores/              # Pinia stores
├── services/            # API services
├── router/              # Vue Router configuration
├── assets/              # Static assets and fonts
└── main.js             # Application entry point
```

## Key Architecture Patterns

### 1. GSAP Animation System
The project heavily uses GSAP for animations with a consistent pattern:
- **ScrollTrigger** for scroll-based animations
- **ScrollSmoother** for smooth scrolling experience (initialized in App.vue)
- **SplitText** for character-by-character text animations
- **Route transitions** with exit animations before navigation

#### Animation Pattern in Components:
```javascript
const animations = ref([])
const scrollTriggers = ref([])

const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())
  // Clear inline styles and pin-spacers
}

onUnmounted(() => cleanup())
onBeforeRouteLeave(() => {
  playExitAnimations()
  setTimeout(() => next(), DURATION)
})
```

### 2. Route Transition System
Custom route transition system in `src/router/index.js`:
- **Global exit animations** triggered before route changes
- Components expose exit functions to `window` object (e.g., `window.playSingleTitleExitAnimations`)
- Router calls all `play*` functions before navigating
- **1500ms timeout** for exit animations

### 3. Content Management with Strapi
Centralized content management through `src/stores/content.js`:
- **Single source of truth** for all CMS content
- **Parallel data fetching** (contact, content, projects)
- **Error handling** with fallbacks
- **Data normalization** from Strapi's response format

#### API Endpoints:
- `/api/contact` - Contact information (single type)
- `/api/content` - General content (single type)
- `/api/projets` - Projects collection
- `/api/projets/:id` - Single project

### 4. Component Organization
Components are organized by page/feature:
- **Global**: Reusable across all pages
- **Home**: Homepage-specific components
- **Single**: Individual project detail components
- **Projects**: Project listing components
- **Contact**: Contact page components

## Important Configuration

### Environment Variables
Required in `.env` file:
```
VITE_STRAPI_URL=your_strapi_url
VITE_STRAPI_API_KEY=your_strapi_api_key
```

### GSAP Plugins Registration
All GSAP plugins are registered in `src/main.js`:
```javascript
gsap.registerPlugin(MotionPathPlugin, Observer, ScrollToPlugin,
  SplitText, ScrollTrigger, ScrollSmoother, TextPlugin, CustomEase)
```

### Routing Configuration
4 main routes:
- `/` - Home
- `/projects` - Projects listing
- `/project/:id` - Single project detail
- `/contact` - Contact page

## Common Development Tasks

### Adding New Components
1. Follow the existing component structure in appropriate folder
2. Use Composition API with `<script setup>`
3. Implement GSAP animations with proper cleanup
4. Add exit animations if component is part of route transitions

### Working with Strapi Data
1. Content is fetched centrally in `src/stores/content.js`
2. Components access data through store getters
3. Check `src/services/api.js` for available API methods
4. All API calls include error handling and fallbacks

### Animation Development
1. Always cleanup animations in `onUnmounted`
2. Use `ScrollTrigger.refresh()` after DOM changes
3. Set initial states before animating
4. Follow the established animation patterns (see single components)

### Debugging
- API requests are logged in console with status indicators
- Strapi content is logged on app startup
- GSAP animations can be debugged through browser dev tools

## Node.js Version Requirement
The project requires Node.js `^20.19.0 || >=22.12.0` as specified in package.json.

## Key Files to Reference

1. **`src/components/single/`** - Best examples of GSAP animation patterns
2. **`src/stores/content.js`** - Data management patterns
3. **`src/services/api.js`** - API integration patterns
4. **`src/router/index.js`** - Route transition system
5. **`src/main.js`** - GSAP configuration and app setup

This architecture provides a smooth, animated portfolio website with content managed through Strapi CMS and sophisticated GSAP animations throughout the user experience.