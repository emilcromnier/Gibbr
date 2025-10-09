
import { observer } from 'mobx-react-lite';
/*import AppPresenter from './appPresenter';*/

import NavbarPresenter from "./presenters/NavbarPresenter.jsx"

import GameGridPresenter from './presenters/GameGridPresenter.jsx';

import FriendsPresenter from './presenters/FriendsPresenter.jsx';

import ProfilePresenter from './presenters/ProfilePresenter.jsx';

import GamePresenter from './presenters/GamePresenter.jsx';
import {  createHashRouter,  RouterProvider, useParams} from "react-router-dom";



export default observer(    
    function ReactRoot(props){

        return (
                
               
                <div>
                <RouterProvider router={makeRouter(props.model)}/>
                {}
                
                </div>
               
                );
        }  
    
     )


     function makeRouter(model){
        return createHashRouter([
            {
                path: "/",
                element: <div className="general"><NavbarPresenter/> <GameGridPresenter model={model}/> </div>
            },
            {
                path: "/menu",
                element: <div className="general"><NavbarPresenter/> <GameGridPresenter model={model}/> </div>
            },
            {
                path: "/friends",
                element: <div className="general"><NavbarPresenter/> <FriendsPresenter/> </div>
            },
                        {
                path: "/profile",
                element: <div className="general"><NavbarPresenter/> <ProfilePresenter/> </div>
            },
            {
                path: "/game/:id", // Dynamic route for individual games
                element: <div className="general"><NavbarPresenter /> <GamePresenter model={model} /></div>
            },


            
        ])
    }