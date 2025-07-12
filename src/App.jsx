import './App.css'
import { Layout } from './components/Layout'
import { AuthProvider } from './context/authContext'
import PrivateRoute from './context/PrivateRoute'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { Paciente } from './pages/paciente'
import { NuevoPaciente } from './pages/nuevo-paciente'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate  to='/home'/>}/>
          <Route path="/login" element={<Login/>}/>
          { /* //! Rutas protegidas */ }
          <Route element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route path='/home' element={<Home/>}/> 
            <Route path='/paciente/:dni' element={<Paciente/>}/> 
            <Route path='/nuevo-paciente' element={<NuevoPaciente/>}/> 
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
