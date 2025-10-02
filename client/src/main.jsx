import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'


import ReactRoot from './ReactRoot.jsx'
//import model from './MovieModel.js' 

import { observable, configure, reaction } from 'mobx'
configure({ enforceActions: "never" }) // we don’t use MobX actions
//const reactiveModel = observable(model)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactRoot />
  </StrictMode>,
)
