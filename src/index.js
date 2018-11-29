import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
// Setup the network "links"
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

import './index.css';
import App from './App';


// apollo client stuff
const base_host = '' // TODO: Fill in host of Hasura server
const wsurl = `ws://${base_host}/v1alpha1/graphql`;
const httpurl = `http://${base_host}/v1alpha1/graphql`;

const headers = {
	'Content-Type': 'application/json',
};

const wsLink = new WebSocketLink({
	uri: wsurl,
	options: {
		connectionParams: {
			reconnect: true,
			headers,
		},
	},
});
const httpLink = new HttpLink({
	uri: httpurl,
	headers,
});

const link = split(
	// split based on operation type
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLink,
);

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

ReactDOM.render(<ApolloProvider client={client}>
	<App />
</ApolloProvider>
, document.getElementById('root'));
