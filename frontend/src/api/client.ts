import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql", // or your real IP if running on device
  cache: new InMemoryCache(),
});

export default client;
