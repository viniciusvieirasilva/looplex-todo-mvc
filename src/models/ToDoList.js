import { types, getParent, destroy } from 'mobx-state-tree'
import { Howl } from 'howler'

const sound = new Howl({
  src: ['../../assets/comp.wav']
})

export const ToDoListItem = types
  .model({
    id: types.string,
    title: types.string,
    isCompleted: false
  })
  .actions(self => ({
    changeTitle (newTitle) {
      if (newTitle != '') {
        self.title = newTitle
      }
    },
    toggleIsCompleted () {
      self.isCompleted = !self.isCompleted
      //   if (self.isCompleted && !sound.playing()) {
      if (self.isCompleted) {
        if (sound.playing()) {
          sound.stop()
          sound.play()
        } else {
          sound.play()
        }
      }
      //   }
    },
    removeItem () {
      getParent(self, 2).remove(self)
    }
  }))

export const ToDoList = types
  .model({
    items: types.optional(types.array(ToDoListItem), [])
  })
  .actions(self => ({
    add (title) {
      if (title != '') {
        self.items.push({
          id: encodeURIComponent(title.toLowerCase().replace(/\s+/gim, '-')),
          title: title,
          isCompleted: false
        })
      }
    },
    remove (item) {
      destroy(item)
    },
    toggleListIsCompleted () {
      if (self.items.some(item => !item.isCompleted)) {
        self.items.forEach(item => {
          if (!item.isCompleted) {
            item.toggleIsCompleted()
          }
        })
      } else {
        self.items.forEach(item => item.toggleIsCompleted())
      }
    },
    removeCompleted () {
      if (self.items.some(item => item.isCompleted)) {
        self.items.forEach(item => {
          if (item.isCompleted) {
            item.removeItem()
          }
        })
      }
    }
  }))
  .views(self => ({
    get totalCount () {
      return self.items.length
    },
    get totalLeftCount () {
      return self.items.filter(item => !item.isCompleted).length
    },
    get totalCompletedCount () {
      return self.items.filter(item => item.isCompleted).length
    },
    getfilteredItems (filter) {
      const states = {
        todos: self.items,
        concluidos: self.items.filter(item => item.isCompleted),
        naoConcluidos: self.items.filter(item => !item.isCompleted)
      }
      return states[filter]
    }
  }))
