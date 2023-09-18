const context = require("./context.js")

const resolvers = {
    Query: {
      Users: async () => {
        return await context.prisma.user.findMany();
      },
    },
     Mutation: {
      createUser : async (parent, args) => {
        const { name, email } = args;
        return await prisma.user.create({
          data: { name, email },
        });
      },
    }, 
  };
  
  module.exports = resolvers;
  