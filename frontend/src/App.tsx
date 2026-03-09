
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Main } from './pages/main-page';
import { Signup } from './pages/signup';
import { Login } from './pages/signin';
import { Dashboard } from './pages/dashboard';

function APP(){
    
     return <BrowserRouter>
          <Routes>
               <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
               <Route path="/signup" element={<Signup></Signup>}></Route>
               <Route path="/login" element={<Login></Login>}></Route>
          </Routes>
     </BrowserRouter>
     
}


export default APP;