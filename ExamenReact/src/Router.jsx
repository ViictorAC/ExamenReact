import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './guards/ProtectedRoute'
// layout
import Layout from './pages/Layout'
// Pages
import Login from './pages/Login'
import Registro from './pages/Registro'
import AreaPersonal from './pages/AreaPersonal'
import NotFound from './pages/NotFound'
import Home from './pages/Home'


export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children:[
        {index: true, element: <Login/>},
        {path: 'login', element:<Login/>},
        {path: 'registro', element:<Registro/>},

        //Zona protegina

        {
            element: <ProtectedRoute/>,
            children:[
                {path:"home", element: <Home/>},
                {path:"areapersonal", element: <AreaPersonal/>}
            ]
        },
        //Error 404
        {path:"*", element:<NotFound/>}
    ]
  }
])
export default Router