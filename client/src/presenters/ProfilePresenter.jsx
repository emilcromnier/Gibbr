// src/presenters/ProfilePresenter.js
import { observer } from "mobx-react-lite";
import Profile from "../views/ProfileView";
import { useEffect } from "react";

export default observer(function ProfilePresenter(props) {
  const userModel = props.model.user;
  const user = userModel.currentUser;


export default observer(
function ProfilePresenter(props){

    const user = props.model.user.currentUser;
    const loading = props.model.user.loading;
    const userModel = props.model.user;
    
    useEffect(() => {
    if (!user) return;
    props.model.user.fetchWishlistDetails(props.model.games);
    props.model.user.fetchReviews(props.model.games);
  }, [user]); // run only when `user` changes

  if (!user) {
    return (
      <div>
        <h2>You are not logged in</h2>
        <p>
          <a href="#/auth">Log in</a> to see your profile.
        </p>
      </div>
    );
  }

  const wishlist = userModel.wishlist || [];
  const reviews = userModel.reviews || [];

  async function handleRemoveFromWishlist(game) {
    try {
      await userModel.removeFromWishlist(game, user.username, userModel.token);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  }





    //const wishlist = user.backlog || [];
    const wishlist = props.model.user.wishlist || [];
    //const reviews = user.reviews || [];
    const reviews = props.model.user.reviews || [];

    if (loading) {
    return <div>Loading wishlist...</div>;
    }

    if (!wishlist.length) {
    return <div>Nothing in wishlist</div>;
    }


    return <Profile username={user.username} description={user.description || "No description yet"} wishlist={wishlist} reviews={reviews}/>;
    
})
