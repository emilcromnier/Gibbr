import '/src/App.css'
import '/src/styles/navbar.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/GibbR_new_logo.png.png';
import { Search } from "lucide-react";



function Navbar(props) {

    function ToFriendsACB(){
        window.location.hash = "#/friends";
    
    }
    
    function BackToMenuACB(){
        window.location.hash = "#/menu";
    
    }

    function ToProfileACB(){
        window.location.hash = "#/profile"
    }

        function ToAuthACB(){
        window.location.hash = "#/auth"
    }

    

  return(
    
    <nav className = "navbar">
        <div className = "navbar__left">
            <img className ="navbar__logo" src={logo} alt="Gibbr Logo" />
        </div>

        <div className = "navbar__center">
            <button className="navbar__button navbar__button--home" onClick={BackToMenuACB} >Home</button>
            <button className="navbar__button navbar__button--friends" onClick={ToFriendsACB}>Friends</button>
            <button className="navbar__button navbar__button--profile" onClick={ToProfileACB}>Profile</button>        
            <button className='navbar__button navbar__button--login' onClick={ToAuthACB} >Login</button>
        </div>

        <div classname = "navbar__right">
            <Search className = "navbar__icon"/>
            <input type = "text" id = "search" placeholder = "Search items..." />
        </div>
    </nav>


  )
  
  
}

export default Navbar;