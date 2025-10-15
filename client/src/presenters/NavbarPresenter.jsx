import { observer } from 'mobx-react-lite';
import Navbar from '../views/NavbarView.jsx'



export default observer(
function NavbarPresenter(props){

async function onSearchACB(query) {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.location.hash = `#/search/${encodeURIComponent(trimmed)}`;
}


    return <Navbar onSearch={onSearchACB}/>;
    
})