import { Button, Divider } from 'antd'
import { Radio, Typography } from 'antd'

const ListFooter = ({
  toDoList,
  filter,
  setFilter,
  deleteConfirm,
  openNotification
}) => {
  function handleChangeFilter (e) {
    setFilter(e.target.value)
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
  )
}

export default ListFooter
