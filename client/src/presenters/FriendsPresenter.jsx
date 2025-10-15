// src/presenters/FriendsPresenter.js
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import FriendsView from "../views/FriendsView";

export default observer(function FriendsPresenter(props) {
  const userModel = props.model.user;
  const user = userModel.currentUser;
  const friends = userModel.friends;
  const loading = userModel.loading;
  const error = userModel.error;

  // Fetch friends when user changes
  useEffect(() => {
    if (!user?.username) return;

    async function loadFriends() {
      try {
        const data = await userModel.fetchFriends(user.username);
        userModel.friends = data;
      } catch (err) {
        console.error("Failed to load friends:", err);
      }
    }

    loadFriends();
  }, [user]); // run when user changes

  // Remove a friend
  async function handleRemoveFriend(friendId) {
    if (!user?.username) return;
    try {
      await userModel.removeFriend(user.username, friendId);
      userModel.friends = userModel.friends.filter(f => f._id !== friendId);
    } catch (err) {
      console.error("Failed to remove friend:", err);
    }
  }

  // Optional: view friend profile
  function handleViewProfile(friend) {
    console.log("Viewing profile for:", friend.username);
    // implement navigation if needed
  }

  // Not logged in state
  if (!user) {
    return (
      <div>
        <h2>You are not logged in</h2>
        <p>
          <a href="#/auth">Log in</a> to see your friends list.
        </p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <div>Loading friends...</div>;
  }

  // Empty state
  if (!friends.length) {
    return <div>You don’t have any friends yet.</div>;
  }

  // Render FriendsView
  return (
    <FriendsView
      friends={friends}
      loading={loading}
      error={error}
      onRemoveFriend={handleRemoveFriend}
      onViewProfile={handleViewProfile}
    />
  );
});
