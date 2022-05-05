const Query = {
  async users(parent, args, ctx, info) {
    const { prisma } = ctx;

    if (!args.query) {
      return await prisma.User.findMany();
    }
    const users = await prisma.User.findMany();
    return users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  posts(parent, args, { db }, info) {
    if (!args.query) return db.posts;
    return db.posts.filter((post) => {
      return post.title.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      id: 'sdf234567',
      name: 'Francis mwangi',
      email: 'mwas@gmail.com',
      age: 32,
    };
  },
  post() {
    return {
      id: '3456fghj',
      title: 'Introduction to JS',
      body: '',
      published: true,
    };
  },
};

export { Query as default };
