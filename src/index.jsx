import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  gql,
  ApolloProvider,
} from "@apollo/client"

import cache from "./cache"

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`

const port = process.env.BACKEND_PORT || 4000

const httpLink = new HttpLink({
  uri: `http://localhost:${port}/graphql`,
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token")

  operation.setContext(({ headers }) => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...headers,
    },
  }))
  return forward(operation)
})

const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),

  typeDefs,
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
