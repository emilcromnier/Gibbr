import { observer } from 'mobx-react-lite';
import Profile from '../views/ProfileView';



export default observer(
function FriendsPresenter(props){
    const placeholderWishlist = [
  { id: 1, name: "BF6" },
  { id: 2, name: "Assassin's Creed" },
  { id: 3, name: "Crysis" },
  { id: 4, name: "Bamse" },
  { id: 5, name: "RDR2" },
];

    return <Profile wishlist={placeholderWishlist}/>;
    
})