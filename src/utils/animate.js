// Complete Animation Library with Stagger for All Triggers
// File: /src/utils/animate.js

class AnimationEngine {
  constructor() {
    this.animations = new Map()
    this.scrollElements = new Map()
    this.parentObservers = new Map()
    this.staggerGroups = new Map()
  }

  init() {
    this.setupScrollHandler()
    this.setupMutationWatcher()
    this.scanForElements()
  }

  setupScrollHandler() {
    let rafId = null
    window.addEventListener('scroll', () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        this.scrollElements.forEach((data, element) => {
          if (data.active) {
            this.processScrollAnimation(element, data.config)
          }
        })
        rafId = null
      })
    }, { passive: true })
  }

  setupMutationWatcher() {
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            this.processElement(node)
            node.querySelectorAll?.('[data-animate]').forEach(el => this.processElement(el))
          }
        })
      })
    }).observe(document.body, { childList: true, subtree: true })
  }

  scanForElements() {
    document.querySelectorAll('[data-animate]:not([data-processed])').forEach(el => {
      this.processElement(el)
    })
  }

  processElement(element) {
    const type = element.getAttribute('data-animate')
    if (!type || element.hasAttribute('data-processed')) return

    element.setAttribute('data-processed', 'true')
    const config = this.animations.get(type)
    if (!config) return

    // Apply initial styles
    if (config.initial) {
      Object.assign(element.style, config.initial)
    }

    // Handle different trigger types
    if (config.trigger === 'scroll-progress') {
      this.setupScrollProgress(element, config)
    } else if (config.parent) {
      this.setupParentTrigger(element, config)
    } else {
      this.setupElementTrigger(element, config)
    }
  }

  setupScrollProgress(element, config) {
    const parent = config.parent ? element.closest(config.parent) : null
    
    if (config.stagger && parent) {
      // Handle staggered scroll-progress animations
      this.setupStaggeredScrollProgress(element, config, parent)
    } else {
      // Handle single element scroll-progress
      this.scrollElements.set(element, { config, active: false })
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const data = this.scrollElements.get(element)
          if (data) {
            data.active = entry.isIntersecting
            if (entry.isIntersecting) {
              this.processScrollAnimation(element, config)
            }
          }
        })
      }, {
        threshold: config.threshold || 0.1,
        rootMargin: config.rootMargin || '0px'
      })
      
      observer.observe(element)
    }
  }

  setupStaggeredScrollProgress(element, config, parent) {
    if (!this.staggerGroups.has(parent)) {
      this.staggerGroups.set(parent, {
        elements: [],
        config: config,
        observer: null
      })
    }

    const group = this.staggerGroups.get(parent)
    group.elements.push(element)

    // Setup parent observer if not done
    if (!group.observer) {
      group.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activateStaggeredScrollGroup(parent)
          } else {
            this.deactivateStaggeredScrollGroup(parent)
          }
        })
      }, {
        threshold: config.threshold || 0.1,
        rootMargin: config.rootMargin || '0px'
      })
      
      group.observer.observe(parent)
    }
  }

  activateStaggeredScrollGroup(parent) {
    const group = this.staggerGroups.get(parent)
    if (!group) return

    group.elements.forEach((element, index) => {
      setTimeout(() => {
        this.scrollElements.set(element, { 
          config: group.config, 
          active: true,
          staggerIndex: index 
        })
        this.processScrollAnimation(element, group.config)
      }, index * group.config.stagger)
    })
  }

  deactivateStaggeredScrollGroup(parent) {
    const group = this.staggerGroups.get(parent)
    if (!group) return

    group.elements.forEach(element => {
      const data = this.scrollElements.get(element)
      if (data) {
        data.active = false
      }
    })
  }

  setupParentTrigger(element, config) {
    const parent = element.closest(config.parent)
    if (!parent) return

    const type = element.getAttribute('data-animate')

    // Initialize parent data
    if (!parent._animationChildren) {
      parent._animationChildren = []
      parent._childrenByType = new Map()
    }

    // Store element
    parent._animationChildren.push({ element, config })
    
    if (!parent._childrenByType.has(type)) {
      parent._childrenByType.set(type, [])
    }
    parent._childrenByType.get(type).push({ element, config })

    // Setup parent observer if not already done
    if (!this.parentObservers.has(parent)) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerParentAnimation(entry.target)
          }
        })
      }, {
        threshold: config.threshold || 0.1,
        rootMargin: config.rootMargin || '0px 0px -50px 0px'
      })
      
      observer.observe(parent)
      this.parentObservers.set(parent, observer)
    }
  }

  setupElementTrigger(element, config) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(element, config)
        }
      })
    }, {
      threshold: config.threshold || 0.1,
      rootMargin: config.rootMargin || '0px'
    })
    
    observer.observe(element)
  }

  triggerParentAnimation(parent) {
    if (!parent._childrenByType) return

    parent._childrenByType.forEach((children, type) => {
      const config = children[0]?.config
      if (!config || config.trigger !== 'scroll-in') return

      if (config.stagger) {
        children.forEach(({ element, config }, index) => {
          setTimeout(() => {
            this.animateElement(element, config)
          }, index * config.stagger)
        })
      } else {
        children.forEach(({ element, config }) => {
          this.animateElement(element, config)
        })
      }
    })

    // Stop observing parent
    const observer = this.parentObservers.get(parent)
    if (observer) {
      observer.unobserve(parent)
      this.parentObservers.delete(parent)
    }
  }

  processScrollAnimation(element, config) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight))
    
    if (config.scrollEffect) {
      this.applyScrollEffects(element, config.scrollEffect, progress)
    }
  }

  applyScrollEffects(element, effects, progress) {
    Object.entries(effects).forEach(([property, values]) => {
      if (!Array.isArray(values) || values.length !== 2) return
      
      const [start, end] = values
      
      if (property === 'opacity') {
        const value = this.interpolateNumber(start, end, progress)
        element.style.opacity = value
      } else if (property === 'transform') {
        const value = this.interpolateTransform(start, end, progress)
        element.style.transform = value
      }
    })
  }

  interpolateNumber(start, end, progress) {
    const startNum = parseFloat(start)
    const endNum = parseFloat(end)
    return startNum + (endNum - startNum) * progress
  }

  interpolateTransform(start, end, progress) {
    // Handle translateY
    const translateYRegex = /translateY\(([^)]+)\)/
    const startMatch = start.match(translateYRegex)
    const endMatch = end.match(translateYRegex)
    
    if (startMatch && endMatch) {
      const startValue = parseFloat(startMatch[1])
      const endValue = parseFloat(endMatch[1])
      const unit = startMatch[1].replace(/[\d.-]/g, '') || 'px'
      const currentValue = startValue + (endValue - startValue) * progress
      return `translateY(${currentValue}${unit})`
    }

    // Handle scale
    const scaleRegex = /scale\(([^)]+)\)/
    const startScaleMatch = start.match(scaleRegex)
    const endScaleMatch = end.match(scaleRegex)
    
    if (startScaleMatch && endScaleMatch) {
      const startValue = parseFloat(startScaleMatch[1])
      const endValue = parseFloat(endScaleMatch[1])
      const currentValue = startValue + (endValue - startValue) * progress
      return `scale(${currentValue})`
    }

    // Handle rotate
    const rotateRegex = /rotate\(([^)]+)\)/
    const startRotateMatch = start.match(rotateRegex)
    const endRotateMatch = end.match(rotateRegex)
    
    if (startRotateMatch && endRotateMatch) {
      const startValue = parseFloat(startRotateMatch[1])
      const endValue = parseFloat(endRotateMatch[1])
      const unit = startRotateMatch[1].replace(/[\d.-]/g, '') || 'deg'
      const currentValue = startValue + (endValue - startValue) * progress
      return `rotate(${currentValue}${unit})`
    }

    return progress > 0.5 ? end : start
  }

  animateElement(element, config) {
    if (config.animate) {
      Object.assign(element.style, config.animate)
    }
  }

  register(name, config) {
    this.animations.set(name, config)
  }

  rescan() {
    this.scanForElements()
  }
}

// Create instance
const engine = new AnimationEngine()

// Register animations
engine.register('revealAndFadeOut', {
  trigger: 'scroll-in',
  parent: '.is-content',
  stagger: 150,
  initial: {
    opacity: '0',
    filter: 'blur(3px)',
    transition: 'none'
  },
  animate: {
    opacity: '1',
    filter: 'blur(0px)',
    transition: 'all 0.8s ease-out'
  },
  // Add scroll-progress behavior too
  scrollEffect: {
    opacity: ['1', '0'],
    transform: ['translateY(0%)', 'translateY(-300%)']
  }
})

// Initialize
document.readyState === 'loading' 
  ? document.addEventListener('DOMContentLoaded', () => engine.init())
  : engine.init()

// Export
window.animateUtils = { rescan: () => engine.rescan() }
export { engine }