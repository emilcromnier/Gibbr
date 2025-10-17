import '/src/App.css'
import '/src/styles/navbar.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/GibbR.svg';
import { Search } from "lucide-react";
import { useState } from 'react';



function Navbar(props) {
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");

    
    function handleKeyDown(e) {
        if (e.key === "Enter") {
            props.onSearch(query);
        }
    }

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

    function LoginLogoutACB(){
        if (props.currentUser) {
            props.onLogout();
            window.location.hash = "#/menu";
        }
        else {
            ToAuthACB();
        } 
    }

    

  return(
    
    <nav className = "navbar">
        <div className = "navbar__left">

            <img className ="navbar__logo" src={logo} alt="Gibbr Logo" onClick={BackToMenuACB}/>
            <div className = "navbar__center">
                <button className="navbar__button navbar__button--home" onClick={BackToMenuACB} >Home</button>
                <button className="navbar__button navbar__button--friends" onClick={ToFriendsACB}>Friends</button>
                <button className="navbar__button navbar__button--profile" onClick={ToProfileACB}>Profile</button>        
            </div>
        </div>

        <div className = "navbar__right">
            <Search className = "navbar__icon" onClick = {() => setShowSearch(prev => !prev)}/>
            {showSearch && (
            <input className = "navbar__search--input" type = "text" id = "search" placeholder = "Search items..." value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}/>
            )}
           <button className='navbar__button navbar__button--login' onClick={LoginLogoutACB} >{props.currentUser ? "Logout" : "Login"} </button>
        </div>

    </nav>


  )
  
  
}

export default Navbar;