import './App.css';
import React,{ useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Reservation from './components/Reservation'
import Dashboard from './components/Dashboard';

function App() {
  const [alert, setAlert] = useState(null);

  // show alert msg according message type
  const showAlert = (message,type) => {
    setAlert({
        msg:message,
        type:type
    })
    setTimeout(() => {
       setAlert(null);
    }, 2000);
  }
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Alert alert={alert}/>
        <div className='container'>
          <Routes>
            <Route path="/" element={<Reservation showAlert={showAlert}/>} />
            <Route path="/dashboard" element={<Dashboard showAlert={showAlert}/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );  
}

export default App;
