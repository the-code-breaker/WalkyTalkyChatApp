import { useState } from 'react'
import { Route } from 'react-router-dom';
import { HomePage,ChatPage } from './Pages';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Route path = '/' component={HomePage} exact />
      <Route path = '/chats' component={ChatPage} />
    </div>
  )
}

export default App
