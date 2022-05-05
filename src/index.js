import { createServer, createPubSub } from '@graphql-yoga/node';
import { PrismaClient } from '@prisma/client';
import { typeDefinitions } from './schema';
import database from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

const pubsub = createPubSub();
const prisma = new PrismaClient();



const server = createServer({
  schema: {
    typeDefs: typeDefinitions,
    resolvers: {
      Query,
      Mutation,
      Subscription,
      User,
      Post,
      Comment,
    },
  },
  context: {
    db: database,
    pubsub,
    prisma,
  },
});

// Start the server and explore http://localhost:4000/graphql
server.start(() => {
  console.log('Server is UP!');
});
