import { Button, Divider, Radio, Typography } from 'antd'
import { observer } from 'mobx-react'

const ListFooter = ({ toDoList, deleteConfirm, openNotification }) => {
  function handleChangeFilter (e) {
    toDoList.setFilter(e.target.value)
  }

  const { Text } = Typography

  return (
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
        disabled={
          !(
            (toDoList.totalCompletedCount && toDoList.filter === 'todos') ||
            toDoList.filter === 'concluidos'
          )
        }
      >
        Apagar concluídos
      </Button>
    </div>
  )
}

export default observer(ListFooter)
