import { observer } from 'mobx-react-lite';
import Auth from '../views/AuthView';



export default observer(
function AuthPresenter(props){

    async function handleRegisterACB(username, email, password) {
        try {
        await props.model.user.register(username, email, password);
    
        } catch (e) {
     
        }
  }

  async function handleLoginACB(usernameOrEmail, password) {
    try {
      await props.model.user.login(usernameOrEmail, password);
    
      window.location.hash = "#/"; // redirect to home
    } catch (e) {
    
    }
  }

  function handleLogoutACB() {
  props.model.user.logout();

  window.location.hash = "#/auth"; 
}


    return <Auth onLogout={handleLogoutACB} onLogin={handleLoginACB} onRegister={handleRegisterACB} currentUser={props.model.user.currentUser}/>;
    
})