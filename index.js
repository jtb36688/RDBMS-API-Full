const express = require('express')
const knex = require('knex')

const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3',
    },
    useNullAsDefault: true,
  };
const db = knex(knexConfig);

const server = express();
server.use(express.json());

server.get('/api/roles', async (req, res) => {
    try {
      const roles = await db('roles');
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  server.get('/api/roles/:id', async (req, res) => {
    try {
      const role = await db('roles')
        .where({ id: req.params.id })
        .first();
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  const errors = {
    '19': 'Another record with that value exists',
  };
  
  server.post('/api/roles', async (req, res) => {
    try {
      const [id] = await db('roles').insert(req.body);
  
      const role = await db('roles')
        .where({ id })
        .first();
  
      res.status(201).json(role);
    } catch (error) {
      const message = errors[error.errno] || 'We ran into an error';
      res.status(500).json({ message, error });
    }
  });
  server.put('/api/roles/:id', async (req, res) => {
    try {
      const count = await db('roles')
        .where({ id: req.params.id })
        .update(req.body);
  
      if (count > 0) {
        const role = await db('roles')
          .where({ id: req.params.id })
          .first();
  
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
  });
  
  server.delete('/api/roles/:id', async (req, res) => {
    try {
      const count = await db('roles')
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Records not found' });
      }
    } catch (error) {}
  });
  
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`\nrunning on ${port}\n`));