import { AppRouter } from './AppRouter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Inicio} from './pages/Inicio';
import { Navigation } from './components/Navigation';
import { Navbar } from './components/Navbar';
import { Trivia } from './pages/Trivia';
import { Map } from './pages/Map';
import { CardEstadistica } from './components/CardEstadistica';
import { Estadistica } from './pages/Estadistica';


function App() {
  return (
    <>
    <Router basename='/ui/'>
      <Routes>
        <Route path='/' Component={Inicio}/>
        <Route path='/mapa' Component={Map} />
        <Route path='/trivia' Component={Trivia} />
        <Route path='/estadistica' element={<Estadistica/>}/>
      </Routes>
    </Router>
    {/* <AppRouter/> */}
    {/* <Navbar/>
    <BrowserRouter>
    <Navigation/>
    <Routes>
      <Route path="/" element={<Navigate to="/index"/>}/>
      <Route path="/index" element={<Inicio/>}/>
      <Route path="/productos" element={<Productos/>}/>
    </Routes>
    </BrowserRouter> */}
    </>
  )
}

export default App
