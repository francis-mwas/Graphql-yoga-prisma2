import { GraphQLYogaError } from '@graphql-yoga/node';
import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  // create user
  async createUser(parent, args, ctx, info) {
    const { prisma } = ctx;
    try {
      console.log('About to create user');
      console.log('The email is: ', args.data.email);

      const emailTaken = await prisma.user.findUnique({
        where: { email: args.data.email },
      });
      if (emailTaken) {
        throw new GraphQLYogaError(
          `User with this email ${args.data.email} already exists`
        );
      }
      const { email, name, age } = args.data;
      const user = await prisma.User.create({
        data: {
          email,
          name,
          age,
        },
      });

      console.log('The user we want to create: ', args.data);

      return user;
    } catch (error) {
      throw new GraphQLYogaError(`An error occurred: ${error}`);
    }
  },
  // update user
  async updateUser(parent, args, { db, prisma }, info) {
    const { data } = args;
    console.log(args);
    try {
      const userExists = await prisma.user.findUnique({
        where: {
          id: Number(args.id),
        },
      });

      if (!userExists) {
        throw new Error('User with this id does not exist');
      }
      const { email, name, age } = data;
      const user = await prisma.user.update({
        where: { id: Number(args.id) },
        data: {
          email,
          name,
          age,
        },
      });

      return user;
    } catch (error) {
      throw new GraphQLYogaError(`An error occurred: ${error}`);
    }
  },
  updatePost(parent, args, { db }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    console.log('The post to update: ', post);

    if (!post) {
      throw new GraphQLYogaError(`Post with this ${id} id does not exist!`);
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;
    }

    return post;
  },
  updateComments(parent, args, { db }, info) {
    const { id, data } = args;
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new GraphQLYogaError(`Comment with this ${id} id does not exist!`);
    }
    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    return comment;
  },
  createPost(parent, args, { db }, info) {
    const userExists = db.users.some((user) => user.id === args.post.author);
    if (!userExists) {
      throw new GraphQLYogaError(
        `User with this ${args.post.author} id does not exist!`
      );
    }
    const post = {
      id: uuidv4(),
      ...args.post,
    };
    db.posts.push(post);
    return post;
  },

  // delete user and associated posts and comments
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex === -1) {
      throw new GraphQLYogaError(`User Not Found!`);
    }
    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        comments = comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  },
  // delete a post and associated comments
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex === -1) {
      throw new GraphQLYogaError(`Post Not Found!`);
    }
    const deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      const match = comment.post === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== args.id);
      }
      return !match;
    });
    return deletedPost[0];
  },
  // delete a comment
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new GraphQLYogaError(`Coomment Not Found!`);
    }
    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  },
  createComments(parent, args, { db }, info) {
    try {
      const userExists = users.some((user) => user.id === args.comments.author);
      const postExists = db.posts.some((post) => {
        return post.id === args.comments.post && post.published;
      });
      if (!userExists) {
        throw new GraphQLYogaError(
          `User with this ${args.comments.author} does not exist!`
        );
      }
      if (!postExists) {
        throw new GraphQLYogaError(
          `Post with this ${args.comments.post} does not exist!`
        );
      }

      const comment = {
        id: uuidv4(),
        ...args.comments,
      };
      db.comments.push(comment);
      return comment;
    } catch (error) {
      throw new GraphQLYogaError(error);
    }
  },
};

export { Mutation as default };
