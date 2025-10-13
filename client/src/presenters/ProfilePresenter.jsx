import { observer } from 'mobx-react-lite';
import Profile from '../views/ProfileView';



export default observer(
function ProfilePresenter(props){

    const user = props.model.user.currentUser;



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

    props.model.user.fetchWishlistDetails();



    //const wishlist = user.backlog || [];
    const wishlist = props.model.user.wishlist || [];
    const reviews = user.reviews || [];


    return <Profile username={user.username} description={user.description || "No description yet"} wishlist={wishlist} reviews={reviews}/>;
    
})