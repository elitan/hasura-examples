import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { withApollo } from 'react-apollo';
import gql from "graphql-tag";

const GET_USERS = gql`
query get_users {
    users {
        id
        name
        age
        postssByuserId {
            id
            title
        }
    }
}
`;

const UPDATE_USER = gql`
	mutation update_user (
		$id: Int!,
		$set: users_set_input!
	) {
		update_users (
			_set: $set,
			where: {
				id: { _eq: $id }
			}
		) {
			returning {
				id
				name
                age
			}
		}
	}
`

class App extends Component {

    renderUsers(users) {
        return users.map(user => {
            return (
                <li key={user.id} onClick={() => {
                    const options = {
                        mutation: UPDATE_USER,
                        variables: {
                            id: user.id,
                            set: {
                                age: 10,
                            }
                        },
                        // refetchQueries: [{
                        //     query: GET_USERS,
                        // }],
                    };
                    this.props.client.mutate(options);
                }}>
                    name: {user.name},
                    age: {user.age},
                </li>
            )
        })
    }

    render() {
        return (
            <>

            <Query
                query={GET_USERS}
            >
                {({ loading, error, data }) => {

                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    console.log({data});

                    return (
                        <ul>
                            {this.renderUsers(data.users)}
                        </ul>
                    )
                }}
            </Query>
            </>
        );
    }
}

export default withApollo(App);
