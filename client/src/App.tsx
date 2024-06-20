import { useQuery, gql } from '@apollo/client';

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

interface HelloData {
  hello: string;
}

function App() {
  const { loading, error, data } = useQuery<HelloData>(HELLO_QUERY);

  if (loading) return <p>Chargement . . .</p>;
  if (error) return <p>Erreur de lien avec le back !</p>;

  return (
    <div>
      <h1>{data?.hello}</h1>
    </div>
  );
}

export default App;