import '/src/App.css'
import '/src/styles/navbar.css'
import { observer } from 'mobx-react-lite';
import logo from '../assets/GibbR_new_logo.png.png';
import { useState } from "react";



function Search(props) {

return(
    <div>{props.result}</div>
)
  
  
}

export default Search;