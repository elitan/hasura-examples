import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from "graphql-tag";

const GET_USERS = gql`
query get_users {
    users {
        id
        name
        age
    }
}
`;

class App extends Component {

    renderUsers(users) {
        return users.map(user => {
            return (
                <li>
                    name: {user.name},
                    age: {user.age},
                    number of posts: {users}
                </li>
            )
        })
    }
    render() {
        return (
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
                    );
                }}
            </Query>
        );
    }
}

export default App;
