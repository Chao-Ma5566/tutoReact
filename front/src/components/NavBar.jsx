import { NavLink } from "react-router-dom"
import {useEffect} from 'react'
import axios from 'axios'

const NavBar = (props) => {
     useEffect(() => {
    if(!axios.defaults.headers.common['Authorization']){
      const token = localStorage.getItem("jwtToken")
      if(token){
        axios.defaults.headers.common['Authorization'] = 'Bearer '+token
      }
    }
  },[])
    
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">
                        Acceuil
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/test">
                        User List
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/ajoute">
                        Créer Article
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/newUser">
                        Créer user
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/login">
                        Login
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/upload">
                        upload
                    </NavLink>
                </li>
            </ul>
        </nav>
        )
}

export default NavBar