import { Input, Tooltip, Button, Divider } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { useState } from 'react'

const ListHeader = ({ toDoList }) => {
  const [itemTitle, setItemTitle] = useState('')

  function handleSubmit (e) {
    e.preventDefault()
    toDoList.add(itemTitle)
    setItemTitle('')
  }
  return (
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
  )
}

export default ListHeader
