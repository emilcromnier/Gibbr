import '/src/App.css'
import { observer } from 'mobx-react-lite';




function Friends(props) {
  
  const friends = props.friends;

  return (
    <div className="friends_list" style={{ padding: '1rem' }}>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;