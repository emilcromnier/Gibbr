import { observer } from 'mobx-react-lite';
import Profile from '../views/ProfileView';



export default observer(
function ProfilePresenter(props){

    const user = props.model.user.currentUser;
    console.log("LOADED USER", user);


    if (!user) {
        return (
        <div >
            <h2>You are not logged in</h2>
            <p>
            <a href="#/auth">Log in</a> to see your profile.
            </p>
        </div>
        );
    }

    const wishlist = user.backlog || [];
    const reviews = user.reviews || [];


    return <Profile username={user.username} description={user.description || "No description yet"} wishlist={wishlist} reviews={reviews}/>;
    
})