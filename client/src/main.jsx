import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'


import ReactRoot from './ReactRoot.jsx'
import model from './GamesModel.js'

import { observable, configure, reaction } from 'mobx'
import GamesModel from './GamesModel.js'
configure({ enforceActions: "never" }) // we don’t use MobX actions
const reactiveModel = observable(GamesModel)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactRoot model={reactiveModel} />
  </StrictMode>,
)

window.myModel= reactiveModel;   
reactiveModel.fetchTrendingGames();

