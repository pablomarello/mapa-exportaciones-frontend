import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {Inicio} from './pages/Inicio';
import { Navbar } from './components/Navbar';

export const AppRouter = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Inicio/>}/>
      </Routes>
    </>
    
  )
}
