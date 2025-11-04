import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    selected: {
      selName: '',
      selLvl: '',
      selTutor: '',
    },
  }),
  actions: {
    setSelected(patch) {
      // patch: np. { name: 'Dance4Kids' } albo { lvl: 'Podstawowy' }
      this.selected = { ...this.selected, ...patch }
    },
    clearSelected() {
      this.selected = { selName: '', selLvl: '', selTutor: '' }
    },
  },
})
