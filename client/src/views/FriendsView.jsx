// src/views/FriendsView.js
export default function FriendsView({ friends, loading, error, onRemoveFriend, onViewProfile }) {
  if (loading) return <p className="text-gray-500">Loading friends...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!friends?.length) return <p>Bitchless 😔</p>;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-semibold">Your Friends</h2>
      <ul className="space-y-2">
        {friends.map((f) => (
          <li
            key={f._id}
            className="flex justify-between items-center bg-gray-800 text-white rounded-xl p-3"
          >
            <span
              onClick={() => onViewProfile(f)}
              className="cursor-pointer hover:underline"
            >
              {f.username}
            </span>

            <button
              onClick={() => onRemoveFriend(f._id)}
              className="text-sm text-red-400 hover:text-red-200"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
