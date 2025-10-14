import { observer } from 'mobx-react-lite';
import Search from '../views/SearchView';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';




export default observer(function SearchPresenter(props) {
  const { query } = useParams();


 
    if (!query) return;


             const result = props.model.user.search(query, props.model.games); 
            console.log("Search result:", result); 

      
  return (
    <Search  result={result}  />
  );
});