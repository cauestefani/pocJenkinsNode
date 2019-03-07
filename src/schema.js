const _ = require('lodash');
//Authors and Posts get data from JSON Arrays in the respective files.
const Authors = require('./data/authors');
const Posts = require('./data/posts');
const Users = require('./services/users');


/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql');

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represent a Post",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: function (post) {
        return _.find(Authors, a => a.id == post.author_id);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represent an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    twitterHandle: { type: GraphQLString },
    post: {
      type: new GraphQLList(PostType),
      resolve: function (author) {
        return Posts.map(p => p.author_id == author.id)
      }
    }
  })
});

// This is the Root Query
const BlogQueryRootType = new GraphQLObjectType({
  name: 'BlogAppSchema',
  description: "Blog Application Schema Query Root",
  fields: () => ({
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all Authors",
      resolve: function () {
        return Authors
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of all Posts",
      resolve: function () {
        return Posts
      }
    },
    user: {
      type: UserType,
      description: "User",
      resolve: () =>
        Users.fetchResponseByURL()
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Mock of user id',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve: function (user) {
        return Posts.filter(p => p.author == user.name)
      }
    }
  })
});

// This is the schema declaration
const BlogAppSchema = new GraphQLSchema({
  query: BlogQueryRootType
  // If you need to create or updata a datasource, 
  // you use mutations. Note:
  // mutations will not be explored in this post.
  // mutation: BlogMutationRootType 
});

module.exports = BlogAppSchema;