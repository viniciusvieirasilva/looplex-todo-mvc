import React from 'react'
import ToDoListItemView from './ToDoListItemView'
import { List, Button, notification, Modal, Divider } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { observer, Observer } from 'mobx-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import ListHeader from './ListHeader'
import ListFooter from './ListFooter'

const ToDoListView = observer(({ toDoList }) => {
  const [api, contextHolder] = notification.useNotification()

  const closeNotification = key => {
    api.destroy(key)
  }

  const openNotification = onUndo => {
    const key = 'updatable'
    const btn = (
      <>
        <Button
          type='primary'
          onClick={() => {
            onUndo()
            closeNotification(key)
          }}
          danger
        >
          Desfazer
        </Button>
      </>
    )
    api.open({
      message: 'Item(ns) excluído(s) com sucesso',
      description: '',
      duration: 3,
      btn,
      key,
      onClose: closeNotification(key)
    })
  }

  const [modal, contextHolderModal] = Modal.useModal()

  const deleteConfirm = (onConfirm, content) => {
    modal.confirm({
      title: 'Excluir',
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'Excluir',
      cancelText: 'Cancelar',
      onOk: onConfirm
    })
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const updatedItems = reorder(
      toDoList.items,
      result.source.index,
      result.destination.index
    )

    toDoList.setItems(updatedItems)
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '15px 0',
    borderRadius: '8px',

    background: isDragging ? 'lightgreen' : 'inherit',

    ...draggableStyle
  })

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightcyan' : 'inherit'
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <div
            className='droppable-container'
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {contextHolder}
            {contextHolderModal}
            <Observer>
              {() => (
                <List
                  header={<ListHeader toDoList={toDoList} />}
                  dataSource={toDoList.getFilteredItems()}
                  renderItem={(item, index) => {
                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <ToDoListItemView
                              item={item}
                              openNotification={openNotification}
                              closeNotification={closeNotification}
                              deleteConfirm={deleteConfirm}
                              onUndo={() => toDoList.undoRemove()}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  }}
                />
              )}
            </Observer>
            {provided.placeholder}
            <Divider />
            <ListFooter
              toDoList={toDoList}
              deleteConfirm={deleteConfirm}
              openNotification={openNotification}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
})

export default ToDoListView
