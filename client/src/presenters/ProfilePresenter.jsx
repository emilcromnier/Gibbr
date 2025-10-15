import { observer } from 'mobx-react-lite';
import Profile from '../views/ProfileView';
import { useEffect } from 'react';



export default observer(
function ProfilePresenter(props){

    const user = props.model.user.currentUser;
    
    useEffect(() => {
    if (!user) return;
    props.model.user.fetchWishlistDetails(props.model.games);
    props.model.user.fetchReviews(props.model.games);
  }, [user]); // run only when `user` changes



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





    //const wishlist = user.backlog || [];
    const wishlist = props.model.user.wishlist || [];
    //const reviews = user.reviews || [];
    const reviews = props.model.user.reviews || [];
    if (!wishlist.length) {
    return <div>Loading wishlist...</div>;
    }


    return <Profile username={user.username} description={user.description || "No description yet"} wishlist={wishlist} reviews={reviews}/>;
    
})