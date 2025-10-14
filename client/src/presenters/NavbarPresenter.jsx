import { observer } from 'mobx-react-lite';
import Navbar from '../views/NavbarView.jsx'



export default observer(
function NavbarPresenter(props){

    async function onSearchACB(query) {
    if (!query.trim()) return;

    try {
      const result = await props.model.user.search(query, props.model.games);
      console.log("Search result:", result);
      
    } catch (err) {
      console.error("Search failed:", err);
    }
  }


    return <Navbar onSearch={onSearchACB}/>;
    
})