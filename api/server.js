const express = require('express');
const server = express();

const PostsRouter = require('./posts-router');

server.use(express.json());

server.use('/api/posts', PostsRouter);

// OTHER ENDPOINTS
server.get('/', (req, res) => {
    res.send(`
        <h2>Blog Post API</h2>
        <p>Welcome!</p>
    `);
});

module.exports = server;