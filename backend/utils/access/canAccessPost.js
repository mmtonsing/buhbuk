// utils/access/canAccessPost.js

export function canAccessPost(post, user) {
  if (!post) return false;

  // Public and free
  if (post.isPublic && !post.isPremium) return true;

  // Public but paid: only author can access
  if (post.isPublic && post.isPremium) {
    return user?._id?.toString() === post.author?.toString();
  }

  // Private: only author can access
  if (!post.isPublic) {
    return user?._id?.toString() === post.author?.toString();
  }

  return false;
}
