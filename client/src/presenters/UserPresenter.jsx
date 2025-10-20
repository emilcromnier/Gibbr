import { observer } from 'mobx-react-lite';
import User from '../views/UserView';
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default observer(function UserPresenter(props) {
  const { username } = useParams();

  

  // Fetch user and wishlist
  useEffect(() => {
    if (!username) return;
    props.model.user.fetchUserByUsername(username); // store user in usersByUsername
    
 
  }, [username, props.model.user]);

    const user = props.model.user.otherUser;


  useEffect(() => {
    if (user) {
      props.model.user.fetchWishlistDetails(props.model.games, user);
        props.model.user.fetchReviews(props.model.games, user.username);
    }
  }, [user, props.model.games, props.model.user]);

  const wishlist = props.model.user.otherWishlist || [];
  const reviews = props.model.user.otherReviews || [];

  if (props.model.user.loading) return <div>Loading user...</div>;

    const handleAddFriend = () => {
    props.model.user.addFriend(user._id);
  };

  // Hide the button if you’re looking at your own profile
  const showAddFriend =
    props.model.user.currentUser &&
    user._id !== props.model.user.currentUser._id &&
    !props.model.user.currentUser.friends.includes(user._id);

  return (
    <User
      user={user}
      username={username}
      reviews={reviews}
      wishlist={wishlist}
    showAddFriend={showAddFriend}
      onAddFriend={handleAddFriend}
    />
  );
});
