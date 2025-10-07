import '/src/App.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/gibbrLogo.png';



function Navbar(props) {

    function ToFriendsACB(){
        window.location.hash = "#/friends";
    
    }
    
    function BackToMenuACB(){
        window.location.hash = "#/menu";
    
    }

    

  return(
  
    <div className= "navbar_items">

        <img className="navbar_img" src={logo} alt="Gibbr Logo" />
        <button className="nav_home_btn" onClick={BackToMenuACB} >Home</button>
        <button className="nav_friends_btn" onClick={ToFriendsACB}>Friends</button>
        <button className="nav_profile_btn" >Profile</button>        
        <button className='login_navbar'  >Login</button>
    </div>


  )
  
  
}

export default Navbar;