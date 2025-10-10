import { observer } from 'mobx-react-lite';
import Auth from '../views/AuthView';



export default observer(
function AuthPresenter(props){

    async function handleRegisterACB(username, email, password) {
        try {
        await props.model.user.register(username, email, password);
        alert("Registered successfully!");
        } catch (e) {
        alert("Registration failed");
        }
  }

  async function handleLoginACB(usernameOrEmail, password) {
    console.log("Username:", usernameOrEmail, " Password: ", password);
    try {
      await props.model.user.login(usernameOrEmail, password);
      alert("Logged in successfully!");
      window.location.hash = "#/"; // redirect to home
    } catch (e) {
      alert("Login failed");
    }
  }

  function handleLogoutACB() {
  props.model.user.logout();
  alert("Logged out successfully!");
  window.location.hash = "#/auth"; // or "#/" if you want to go home
}


    return <Auth onLogout={handleLogoutACB} onLogin={handleLoginACB} onRegister={handleRegisterACB} currentUser={props.model.user.currentUser}/>;
    
})