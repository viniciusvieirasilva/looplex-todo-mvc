import { Image, Layout, Card, Typography, Row, Col } from 'antd'
const { Header, Content } = Layout
import { ToDoList } from '@/models/ToDoList'
import ToDoListView from '@/components/ToDoListView'
import { onSnapshot } from 'mobx-state-tree'
import { useEffect, useState } from 'react'

const { Title } = Typography

export default function Home () {
  const [toDoList, setToDoList] = useState(ToDoList.create({ items: [] }))

  useEffect(() => {
    const localStorageData = localStorage.getItem('toDoListApp')
    if (localStorageData) {
      const json = JSON.parse(localStorageData)
      if (ToDoList.is(json)) {
        setToDoList(ToDoList.create(json))
      }
    }
  }, [])

  useEffect(() => {
    onSnapshot(toDoList, snapshot => {
      localStorage.setItem('toDoListApp', JSON.stringify(snapshot))
    })
  }, [toDoList])

  return (
    <Layout className='main'>
      <Header className='header'>
        <Image
          src={'../assets/logo-icon.png'}
          alt='logo'
          width={160}
          height={160}
        />
        <Title style={{ color: 'white' }}>Looplex ToDo MVC</Title>
      </Header>
      <Content className='content'>
        <Card
          bordered={false}
          className='card'
          style={{ boxShadow: 'none', height: 'calc(100vh - 200px)' }}
        >
          <Row justify='center'>
            <Col lg={16}>
              <ToDoListView toDoList={toDoList} />
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  )
}
