// src/views/FriendsView.js
import "/src/styles/friends.css";

export default function FriendsView({ friends, loading, error, onRemoveFriend, onViewProfile }) {
  if (loading) return <p className="friends__status friends__status--loading">Loading friends...</p>;
  if (error) return <p className="friends__status friends__status--error">{error}</p>;
  if (!friends?.length) return <p className="friends__status friends__status--empty">Bitchless 😔</p>;

  return (
    <div className="friends">
      <h2 className="friends__title">Your Friends</h2>
      <ul className="friends__list">
        {friends.map((f) => (
          <li
            key={f._id}
            className="friends__item"
          >
            <span
              onClick={() => onViewProfile(f)}
              className="friends__name"
            >
              {f.username}
            </span>

            <button
              onClick={() => onRemoveFriend(f._id)}
              className="friends__remove"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
