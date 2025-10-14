import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'


import ReactRoot from './ReactRoot.jsx'
import model from './GamesModel.js'

import { observable, configure, reaction } from 'mobx'
import GamesModel from './GamesModel.js'
import UserModel from './UserModel.js'
configure({ enforceActions: "never" }) // we don’t use MobX actions
const gamesModel = observable(GamesModel)
const userModel = observable(UserModel)

const rootModel = observable({
  games: gamesModel,
  user: userModel,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactRoot model={rootModel} />
  </StrictMode>,
)

window.myModel= rootModel;   
rootModel.games.fetchTrendingGames();
rootModel.user.restoreSession();

