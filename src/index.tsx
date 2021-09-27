import { render } from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';
import { WasabyBLLink } from './WasabyBLLink/WasabyBLLink';

const client = new ApolloClient({
    link: from([
        WasabyBLLink,
        new HttpLink({ uri: 'https://qys9u.sse.codesandbox.io/' })
    ]),
    cache: new InMemoryCache()
});

const rootElement = document.getElementById('root');
render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    rootElement
);
