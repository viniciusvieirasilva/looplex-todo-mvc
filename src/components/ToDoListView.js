import React, { useState } from 'react'
import ToDoListItemView from './ToDoListItemView'
import {
  List,
  Input,
  Button,
  Tooltip,
  Divider,
  Radio,
  Typography,
  notification,
  Modal
} from 'antd'
import {
  CheckCircleTwoTone,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { observer } from 'mobx-react'

const { Text } = Typography

const ToDoListView = observer(({ toDoList }) => {
  const [itemTitle, setItemTitle] = useState('')
  const [filter, setFilter] = useState('todos')

  function handleSubmit (e) {
    e.preventDefault()
    toDoList.add(itemTitle)
    setItemTitle('')
  }

  function handleChangeFilter (e) {
    setFilter(e.target.value)
  }

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
      message: 'Item excluído com sucesso',
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

  return (
    <div>
      {contextHolder}
      {contextHolderModal}
      <List
        header={
          <Input
            placeholder='Novo item'
            prefix={
              toDoList.totalLeftCount > 0 || toDoList.totalCount == 0 ? (
                <Tooltip placement='top' title='Selecionar todos'>
                  <Button
                    shape='circle'
                    icon={<CheckCircleTwoTone style={{ fontSize: '22px' }} />}
                    onClick={toDoList.toggleListIsCompleted}
                  ></Button>
                  <Divider type='vertical' />
                </Tooltip>
              ) : (
                <Tooltip placement='top' title='Desmarcar todos'>
                  <Button
                    shape='circle'
                    icon={<CheckCircleTwoTone style={{ fontSize: '22px' }} />}
                    type='primary'
                    onClick={toDoList.toggleListIsCompleted}
                  ></Button>
                  <Divider type='vertical' />
                </Tooltip>
              )
            }
            onPressEnter={handleSubmit}
            onChange={ev => setItemTitle(ev.target.value)}
            value={itemTitle}
          />
        }
        footer={
          <div className='listFooter'>
            <Text>{toDoList.totalLeftCount} itens restantes</Text>
            <Divider type='vertical' />
            <Radio.Group
              buttonStyle='solid'
              size='small'
              defaultValue='todos'
              onChange={handleChangeFilter}
            >
              <Radio.Button value='todos'>Todos</Radio.Button>
              <Radio.Button value='concluidos'>Concluídos</Radio.Button>
              <Radio.Button value='naoConcluidos'>Não Concluídos</Radio.Button>
            </Radio.Group>
            <Divider type='vertical' />
            {toDoList.totalCompletedCount &&
            (filter == 'todos' || filter == 'concluidos') > 0 ? (
              <Button
                className='footerButton'
                danger
                onClick={() => {
                  deleteConfirm(() => {
                    toDoList.removeCompleted()
                    openNotification(() => {
                      toDoList.undoRemove()
                    })
                  }, 'Deseja remover os items completados?')
                }}
              >
                Apagar concluídos
              </Button>
            ) : (
              <Button className='footerButton' danger disabled>
                Apagar concluídos
              </Button>
            )}
          </div>
        }
        bordered
        dataSource={toDoList.getfilteredItems(filter)}
        renderItem={item => (
          <ToDoListItemView
            item={item}
            openNotification={openNotification}
            closeNotification={closeNotification}
            deleteConfirm={deleteConfirm}
            onUndo={() => toDoList.undoRemove()}
          />
        )}
      />
    </div>
  )
})

export default ToDoListView
