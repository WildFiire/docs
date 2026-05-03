import { reactive } from 'vue'

export const searchState = reactive({
  isOpen: false,
  open() {
    this.isOpen = true
  },
  close() {
    this.isOpen = false
  },
  toggle() {
    this.isOpen = !this.isOpen
  }
})
