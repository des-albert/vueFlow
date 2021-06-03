const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

//  Import typedefs and resolvers

const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import environment variables and Models

require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Task = require('./models/Task');

// Connect to MongoDB database

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB Connected'))
  .catch(err => console.error(err));

// Create Apollo / GraphQL Server

const getUser = async token => {
  if (token) {
    try {
      return (user = await jwt.verify(token, process.env.SECRET));
    } catch (err) {
      throw new AuthenticationError('Your session has ended - please sign in again');
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace('Context creation failed:', '')
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return { User, Task, currentUser: await getUser(token) };
  }
});

const PORT = 4000;
const port = process.env.PORT || PORT;
server.listen(port).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
