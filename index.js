const express = require('express');
const typeDefs = require('./tydedefs');
const resolvers = require ('./resolvers');
const { ApolloServer }  =  require('@apollo/server');
const { startStandaloneServer }  =  require('@apollo/server/standalone');
const context = "./context.js"

console.log(context.temp)


const prisma = context.prisma



const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the REST API');
  });


app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validate the request data
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    // Attempt to create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // Return the created user on success
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user: ' + error.message });
  }
});


// Get all users (Read - GET)
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// Get a single user by ID (Read - GET)
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user.' });
  }
});

// Update a user by ID (Update - PUT or PATCH)
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user.' });
  }
});

// Delete a user by ID (Delete - DELETE)
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user.' });
  }
});



const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const { url } =  startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
console.log(`🚀  Server ready at: ${url}`);