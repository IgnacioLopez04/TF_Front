import './App.css'
import { AuthProvider } from './context/authContext'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
