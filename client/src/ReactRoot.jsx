
import { observer } from 'mobx-react-lite';
/*import AppPresenter from './appPresenter';*/

import NavbarPresenter from "./presenters/NavbarPresenter.jsx"
import FriendsPresenter from './presenters/FriendsPresenter.jsx';
import {  createHashRouter,  RouterProvider, useParams} from "react-router-dom";



export default observer(    
    function ReactRoot(props){

        return (
                
               
                <div>
                <RouterProvider router={makeRouter()}/>
                {}
                
                </div>
               
                );
        }  
    
     )


     function makeRouter(){
        return createHashRouter([
            {
                path: "/",
                element: <div className="general"><NavbarPresenter/> </div>
            },
            {
                path: "/menu",
                element: <div className="general"><NavbarPresenter/> </div>
            },
            {
                path: "/friends",
                element: <div className="general"><NavbarPresenter/> <FriendsPresenter/> </div>
            },


            
        ])
    }