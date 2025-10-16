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
    }
  }, [user, props.model.games, props.model.user]);

  const wishlist = props.model.user.otherWishlist || [];

  if (!user) return <div>Loading user...</div>;

  return (
    <User
      user={user}
      username={username}
      wishlist={wishlist}
    />
  );
});
