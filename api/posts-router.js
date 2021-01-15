const express = require('express');
const router = express.Router();

const Post = require('./db-helpers');

router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Post.insert(req.body)
        .then(res => {
            res.status(201).json(res)
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database."})
        })
    }
});

router.post('/:id/comments', (req,res) => {
    const { id } = req.params
    const comment = req.body

    if (!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    if (!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    Post.insertComment(comment)
        .then(comment => {
            res.status(201).json(comment)
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the comment to the database." })
        })
});

router.get('/', (req, res) => {
    Post.find()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            res.status(404).json({ error: "The posts information could not be retrieved" })
        })
});

router.get('/:id', (req, res) => {
    const { id } = req.params

    Post.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved" })
        })
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Post.findPostComments(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The comments information could not be retrieved" })
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    Post.remove(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200)
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
        })
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    const { id } = req.params;

    if (!changes.title || !changes.conents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Post.update(id, changes)
            .then(post => {
                if (post) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist" })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The post information could not be modified" })
            })
    };
});

module.exports = router;