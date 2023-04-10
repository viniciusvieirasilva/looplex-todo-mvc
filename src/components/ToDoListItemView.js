import React from 'react'
import { List, Button, Typography } from 'antd'
import {
  DeleteFilled,
  CheckCircleTwoTone,
  CheckCircleOutlined
} from '@ant-design/icons'
import { observer } from 'mobx-react'

const { Text } = Typography

const ToDoListItemView = observer(
  ({ item, openNotification, closeNotification, deleteConfirm, onUndo }) => {
    function handleRemoveClick (e) {
      closeNotification()
      deleteConfirm(() => {
        e.preventDefault()
        item.removeItem()
        openNotification(() => {
          onUndo()
        })
      }, 'Deseja remover este item?')
    }

    return (
      <>
        {item.isCompleted ? (
          <List.Item className='listItem'>
            <Button
              type='primary'
              shape='circle'
              onClick={item.toggleIsCompleted}
              icon={<CheckCircleTwoTone style={{ fontSize: '22px' }} />}
            ></Button>
            <Text ellipsis='true' className='listItemText' delete disabled>
              {item.title}
            </Text>
            <Button onClick={handleRemoveClick} danger>
              <DeleteFilled style={{ fontSize: '18px' }} />
            </Button>
          </List.Item>
        ) : (
          <List.Item className='listItem'>
            <Button
              shape='circle'
              onClick={item.toggleIsCompleted}
              icon={<CheckCircleOutlined style={{ fontSize: '22px' }} />}
            ></Button>
            <Text
              style={{ width: '100%', overflow: 'hidden' }}
              ellipsis={{ tooltip: 'I am ellipsis now!' }}
              className='listItemText'
              value={item.title}
              editable={{ onChange: item.changeTitle, triggerType: 'text' }}
            >
              {item.title}
            </Text>
            <Button onClick={handleRemoveClick} danger>
              <DeleteFilled style={{ fontSize: '18px' }} />
            </Button>
          </List.Item>
        )}
      </>
    )
  }
)

export default ToDoListItemView
