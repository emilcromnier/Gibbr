// src/presenters/ProfilePresenter.js
import { observer } from "mobx-react-lite";
import Profile from "../views/ProfileView";
import { useEffect } from "react";

export default observer(function ProfilePresenter(props) {
  const userModel = props.model.user;
  const user = userModel.currentUser;

  useEffect(() => {
    if (!user) return;
    userModel.fetchWishlistDetails(props.model.games);
    userModel.fetchMyReviews(props.model.games);
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

  function handleRemoveFromWishlist(game) {
  userModel.removeFromWishlist(game)
    .then(() => alert(`${game.title} removed from wishlist!`))
    .catch(err => alert(`Error removing from wishlist: ${err.message}`));
}


  if (!wishlist.length) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <Profile
      username={user.username}
      description={user.description || "No description yet"}
      wishlist={wishlist}
      reviews={reviews}
      onRemoveFromWishlist={handleRemoveFromWishlist}
    />
  );
});
