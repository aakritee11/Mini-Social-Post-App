
import express from "express";
import Post from "../models/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET ALL POSTS
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE POST
router.post('/', auth, async (req, res) => {
  try {
    const { text, imageUrl } = req.body;
    if (!text && !imageUrl) return res.status(400).json({ msg: 'Text or image required' });
    
    const post = new Post({
      userId: req.user.id,
      username: req.user.username,
      text,
      imageUrl,
      likes: [],
      comments: []
    });
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE POST
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD COMMENT
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    
    post.comments.push({
      userId: req.user.id,
      username: req.user.username,
      text
    });
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;