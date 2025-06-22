import Post from "../models/postSchema.js";

// 🔍 Get all public posts
export const getPublicPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("refId") // load the actual post content
      .limit(10); // return only a preview list

    res.status(200).json({ message: "Fetched posts", data: posts });
  } catch (err) {
    console.error("🔥 Failed to get posts:", err);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
};

// 🌍 Paginated Public Feed
export const getPaginatedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ isPublic: true });

    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username")
      .populate("refId");

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("🔥 Failed to fetch paginated posts:", err);
    res.status(500).json({ error: "Failed to retrieve paginated posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("refId");

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📝 Create new post (after creating linked content)
export const createPost = async (req, res) => {
  try {
    const { category, refId } = req.body;
    const post = new Post({
      category,
      refId,
      author: req.user._id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Failed to create post", error });
  }
};

// 👤 Get posts by logged-in user
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate("author");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user posts", error });
  }
};

// 🗑️ Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post || post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};
