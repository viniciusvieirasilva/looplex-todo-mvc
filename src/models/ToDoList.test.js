import { ToDoList, ToDoListItem } from './ToDoList'
import { getSnapshot, onPatch } from 'mobx-state-tree'

it('can create a instance of a model', () => {
  const item = ToDoListItem.create({
    id: 'item 1',
    title: 'Tarefa 1',
    isCompleted: false
  })

  expect(item.title).toBe('Tarefa 1')
  item.changeTitle('Tarefa 3')
  expect(item.title).toBe('Tarefa 3')
  expect(item.isCompleted).toBe(false)
  item.toggleIsCompleted()
  expect(item.isCompleted).toBe(true)
})

it('can create a ToDoList, add and remove items', () => {
  const list = ToDoList.create({
    items: [
      {
        id: 'item-1',
        title: 'item 1',
        isCompleted: false
      },
      {
        id: 'item-2',
        title: 'item 2',
        isCompleted: true
      }
    ]
  })

  const patches = []
  onPatch(list, snapshot => {
    patches.push(snapshot)
  })

  expect(list.items.length).toBe(2)
  expect(list.items[1].title).toBe('item 2')

  list.items[1].removeItem()
  expect(list.items.length).toBe(1)

  list.add('item 3')
  expect(list.items.length).toBe(2)

  expect(getSnapshot(list)).toMatchSnapshot()

  expect(patches).toMatchSnapshot()
})
