import { useState } from 'react';
import { Card, CardContent, CardActions, Button, TextField, Typography, Box, Avatar } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { postsAPI } from '../../api';
import CommentIcon from '@mui/icons-material/Comment';

export default function PostCard({ post, onUpdate }) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLiked = post.likes?.some(like => like?._id === user.id || like === user.id);

  const handleLike = async () => {
    setLoading(true);
    try {
      const updatedPost = await postsAPI.likePost(post._id);
      onUpdate?.(updatedPost.data);
    } catch (err) {
      console.error('Like failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const updatedPost = await postsAPI.commentPost(post._id, commentText);
      setCommentText('');
      onUpdate?.(updatedPost.data);
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 1 }}>{post.username?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="subtitle2">{post.username}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        
        {post.text && <Typography variant="body2" sx={{ mb: 2 }}>{post.text}</Typography>}
        
        {post.imageUrl && (
          <Box component="img" src={post.imageUrl} sx={{ width: '100%', mb: 2, borderRadius: 1 }} />
        )}
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          onClick={handleLike}
          disabled={loading}
          startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          color={isLiked ? 'error' : 'inherit'}
        >
          {post.likes?.length || 0} Likes
        </Button>
        <Button size="small">
          {post.comments?.length || 0} <CommentIcon/>
        </Button>
      </CardActions>
      
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          multiline
          rows={2}
        />
        <Button
          variant="text"
          size="small"
          sx={{ mt: 1 }}
          onClick={handleComment}
          disabled={loading || !commentText.trim()}
        >
          Comment
        </Button>
      </Box>
      
      {post.comments?.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Comments</Typography>
          {post.comments.map((comment, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {comment.username}
              </Typography>
              <Typography variant="caption" display="block">
                {comment.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}