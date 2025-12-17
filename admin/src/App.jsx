import React, { useEffect } from 'react';
import Narbar from './component/Navbar/Navbar';
import Sidebar from './component/Sidebar/Sidebar';
import{ Routes,Route} from "react-router-dom";
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Coupons from './pages/Coupons/Coupons';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {

  const url="http://localhost:4000";

  useEffect(() => {
    AOS.init({
      duration: 600,
      offset: 20,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <div>
      <ToastContainer/>
      <Narbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/" element={<Dashboard url={url}/>}/>
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/list" element={<List url={url}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
          <Route path="/coupons" element={<Coupons url={url}/>}/>
        </Routes>
      </div>
      
    </div>
  );
}

export default App;