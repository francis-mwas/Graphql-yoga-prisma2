export const typeDefinitions = `
type Query {
  users(query: String): [User!]!
  posts(query: String): [Post!]!
  me: User!
  post: Post!
  comments: [Comment!]!
}
type Mutation {
  createUser(data: CreateuserInput!): User!
  updateUser(id: ID!, data: UpdateuserInput!): User!
  deleteUser(id: ID!): User!
  createPost(post: CreatePost!): Post!
  updatePost(id: ID!, data: UpdatePostInput!): Post!
  deletePost(id: ID!): Post!
  createComments(comments: CreateComments!): Comment!
  updateComments(id: ID!, data: UpdateCommentInput!): Comment!
  deleteComment(id: ID!): Comment!
}

type Subscription {
  count: Int!
  post: PostSubscriptionPayload!
  comment(postId: ID!): CommentSubscriptionPayload!
}

input CreateuserInput {
  name: String!
  email: String!
  age: Int
}
input UpdateuserInput{
    name: String
    email: String
    age: Int
}
input UpdatePostInput{
  title: String
  body: String
  published: Boolean
  author: ID
}
input UpdateCommentInput{
  text: String
}
input CreatePost {
  title: String!
  body: String!
  published: Boolean!
  author: ID!
}
input CreateComments {
  text: String!
  author: ID!
  post: ID
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  comments: [Comment!]!
}
type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
}
type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

enum MutationType { 
  CREATED
  UPDATED
  DELETED
}
type PostSubscriptionPayload {
  mutation: MutationType!
  data: Post!
}
type CommentSubscriptionPayload {
  mutaion: MutationType!
  data: Comment!
}
`;
