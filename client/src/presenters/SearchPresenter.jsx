import { observer } from 'mobx-react-lite';
import Search from '../views/SearchView';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default observer(function SearchPresenter(props) {
  const { query } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setResult(null);

    props.model.user
      .search(query, props.model.games)
      .then(res => {
        setResult(res);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [query, props.model]);

  return (
    <Search
      query={query}
      result={result}
      loading={loading}
      error={error}
    />
  );
});
