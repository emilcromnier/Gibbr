import { observer } from 'mobx-react-lite';
import Navbar from '../views/NavbarView.jsx'
import UserModel from '/src/UserModel.js';



export default observer(
function NavbarPresenter(props){
    const user = UserModel.currentUser;
    const loading = UserModel.loading;
    const error = UserModel.error;

    async function onSearchACB(query) {
        const trimmed = query.trim();
        if (!trimmed) return;
        window.location.hash = `#/search/${encodeURIComponent(trimmed)}`;
    }

    function onLoginACB(){
        window.location.hash = "#/auth"
    }

    function onLogoutACB(){
        UserModel.logout();
        window.location.hash = "#/menu";
    }


    return (
        <Navbar 
            currentUser={user}
            loading={loading}
            error={error} 
            onLogin={onLoginACB}
            onLogout={onLogoutACB}
            onSearch={onSearchACB}
        />);
    
})