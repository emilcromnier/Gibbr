// src/presenters/ProfilePresenter.js
import { observer } from "mobx-react-lite";
import Profile from "../views/ProfileView";
import { useEffect } from "react";


export default observer(
function ProfilePresenter(props){

    const user = props.model.user.currentUser;
    const loading = props.model.user.loading;
    const userModel = props.model.user;
    
    useEffect(() => {
    if (!user) return;
    props.model.user.fetchWishlistDetails(props.model.games);
    props.model.user.fetchMyReviews(props.model.games)
    .then(reviews => console.log("Fetched reviews:", reviews));
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

function handleUpdateReview(reviewId, review) {
  const newText = prompt("Update your review:", review.reviewText);
  const newRating = parseInt(prompt("Update your rating (1–5):", review.rating), 10);

  if (newText && newRating) {
    userModel
      .updateReview(reviewId, { reviewText: newText, rating: newRating })
      .then(() => alert("Review updated!"))
      .catch(err => alert(`Error updating review: ${err.message}`));
  }
}

function handleRemoveReview(reviewId) {
  if (window.confirm("Are you sure you want to delete this review?")) {
    userModel
      .deleteReview(reviewId)
      .then(() => alert("Review deleted!"))
      .catch(err => alert(`Error deleting review: ${err.message}`));
  }
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
    onUpdateReview={handleUpdateReview}
    onRemoveReview={handleRemoveReview}
  />
);

})
