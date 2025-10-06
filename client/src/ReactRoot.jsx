
import { observer } from 'mobx-react-lite';
/*import AppPresenter from './appPresenter';*/

import NavbarPresenter from "./presenters/NavbarPresenter.jsx"
import GameGridPresenter from './presenters/GameGridPresenter.jsx';
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
                element: <div className="general"><NavbarPresenter/> <GameGridPresenter/> </div>
            },


            
        ])
    }