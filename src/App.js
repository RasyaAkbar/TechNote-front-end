import { Routes, Route } from 'react-router-dom';
import DashLayout from './components/DashLayout';
import Public from './components/Public';
import Login from './features/auth/Login';
import Welcome from './features/auth/Welcome';
import Layout from './components/Layout';
import UsersList from './features/users/UsersList';
import NotesList from './features/notes/NotesList';
import NewUserForm from './features/users/NewUserForm';
import EditUser from './features/users/EditUser';
import Prefetch from './features/auth/Prefetch';
import EditNote from './features/notes/EditNote';
import NewNote from './features/notes/NewNote';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import { ROLES } from './config/ROLES';

function App() {
    return (
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Public/>}/>
          <Route path='login' element={<Login/>}/>
          <Route element={<PersistLogin/>}>

            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
              <Route element={<Prefetch/>}>

                <Route path='dash' element={<DashLayout/>}>
                  <Route index element={<Welcome/>}/>

                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]}/>}>
                    <Route path='users'>
                      <Route index element={<UsersList/>}/>
                      <Route path=':id' element={<EditUser/>}/>
                      <Route path='new' element={<NewUserForm/>}/>
                    </Route>
                  </Route>
                  <Route path='notes'>
                    <Route index element={<NotesList/>}/>
                    <Route path='new' element={<NewNote/>}/>
                    <Route path=':id' element={<EditNote/>}/>
                  </Route>

                </Route>{/* end of dash */}
              </Route>

            </Route>{/* end of protected routes */}
          </Route> 
        </Route>
      </Routes>
    );
}

export default App;
