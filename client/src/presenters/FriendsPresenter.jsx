import { observer } from 'mobx-react-lite';
import Friends from '../views/FriendsView';



export default observer(
function FriendsPresenter(props){
    const placeholderFriends = [
  { id: 1, name: "Benny" },
  { id: 2, name: "Elmo" },
  { id: 3, name: "Gemal" },
  { id: 4, name: "Janne" },
  { id: 5, name: "Jan Borg" },
];

    return <Friends friends={placeholderFriends}/>;
    
})