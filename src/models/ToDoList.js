import { types, getParent, destroy, getSnapshot, detach } from 'mobx-state-tree'
import { Howl } from 'howler'

const sound = new Howl({
  src: ['../../assets/comp.wav']
})

export const ToDoListItem = types
  .model({
    id: types.identifier,
    title: types.string,
    isCompleted: false
  })
  .actions(self => ({
    changeTitle (newTitle) {
      if (
        newTitle != '' &&
        !getParent(self, 2).items.some(item => item.title === newTitle)
      ) {
        self.title = newTitle
      }
    },
    toggleIsCompleted () {
      self.isCompleted = !self.isCompleted
      if (self.isCompleted) {
        if (sound.playing()) {
          sound.stop()
          sound.play()
        } else {
          sound.play()
        }
      }
    },
    removeItem () {
      getParent(self, 2).remove(self)
    }
  }))

export const ToDoList = types
  .model({
    items: types.optional(types.array(ToDoListItem), []),
    prevItems: types.optional(types.array(ToDoListItem), [])
  })
  .actions(self => ({
    add (title) {
      if (title != '' && !self.items.some(item => item.title === title)) {
        self.items.push({
          id: encodeURIComponent(title.toLowerCase().replace(/\s+/gim, '-')),
          title: title,
          isCompleted: false
        })
      }
    },
    remove (item) {
      self.prevItems = getSnapshot(self.items)
      destroy(item)
    },
    undoRemove () {
      if (self.prevItems.length) {
        self.items = getSnapshot(self.prevItems)
        self.prevItems = []
      }
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
      self.prevItems = getSnapshot(self.items)
      if (self.items.some(item => item.isCompleted)) {
        self.items.forEach(item => {
          if (item.isCompleted) {
            destroy(item)
          }
        })
      }
    },
    setItems (newItems) {
      self.items = newItems
    },
    reorder (from, to) {
      const item = detach(self.items[from])
      self.items.splice(to, 0, item)
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
