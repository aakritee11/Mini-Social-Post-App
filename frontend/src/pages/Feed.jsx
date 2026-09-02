import { useState, useEffect } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import CreatePost from '../components/Feed/CreatePost.jsx';
import PostCard from '../components/Feed/Postcard.jsx';
import { postsAPI } from '../api.js';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await postsAPI.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    loadPosts();
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Social Feed</Typography>
      
      <CreatePost onPostCreated={handlePostCreated} />
      
      {posts.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 5 }}>
          No posts yet. Be the first to post!
        </Typography>
      ) : (
        posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
        ))
      )}
    </Container>
  );
}