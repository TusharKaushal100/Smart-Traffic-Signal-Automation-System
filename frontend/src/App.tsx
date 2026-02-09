
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Main } from './pages/main-page';
import { Signup } from './pages/signup';
import { Login } from './pages/signin';

function APP(){
    
     return <BrowserRouter>
          <Routes>
               {/* <Route path="/myQuestions" element={<Main></Main>}></Route> */}
               <Route path="/signup" element={<Signup></Signup>}></Route>
               <Route path="/login" element={<Login></Login>}></Route>
          </Routes>
     </BrowserRouter>
     
}


export default APP;