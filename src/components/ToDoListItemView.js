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
        <List.Item className='listItem' style={{ padding: '10px' }}>
          <Button
            type={item.isCompleted ? 'primary' : 'default'}
            shape='circle'
            onClick={item.toggleIsCompleted}
            icon={<CheckCircleTwoTone style={{ fontSize: '22px' }} />}
          ></Button>
          <Text
            style={{ width: '100%', overflow: 'hidden' }}
            ellipsis='true'
            className='listItemText'
            delete={item.isCompleted}
            disabled={item.isCompleted}
            editable={
              item.isCompleted
                ? false
                : { onChange: item.changeTitle, triggerType: 'text' }
            }
          >
            {item.title}
          </Text>
          <Button onClick={handleRemoveClick} danger>
            <DeleteFilled style={{ fontSize: '18px' }} />
          </Button>
        </List.Item>
      </>
    )
  }
)

export default ToDoListItemView
