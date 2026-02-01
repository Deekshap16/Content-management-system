import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import AWS from 'aws-sdk';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const mockUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${Date.now()}-${req.file.originalname}`;
    
    res.json({ url: mockUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/',
  protect,
  [
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('slug').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, slug, content, excerpt, featuredImage, status, tags } = req.body;

      const slugExists = await Post.findOne({ slug });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }

      const post = await Post.create({
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        tags,
        author: req.user._id
      });

      const populatedPost = await Post.findById(post._id).populate('author', 'name email');

      res.status(201).json(populatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put('/:id',
  protect,
  [
    body('title').notEmpty(),
    body('content').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const { title, slug, content, excerpt, featuredImage, status, tags } = req.body;

      if (slug && slug !== post.slug) {
        const slugExists = await Post.findOne({ slug });
        if (slugExists) {
          return res.status(400).json({ message: 'Slug already exists' });
        }
      }

      post.title = title || post.title;
      post.slug = slug || post.slug;
      post.content = content || post.content;
      post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
      post.featuredImage = featuredImage !== undefined ? featuredImage : post.featuredImage;
      post.status = status || post.status;
      post.tags = tags || post.tags;

      const updatedPost = await post.save();
      const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name email');

      res.json(populatedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;