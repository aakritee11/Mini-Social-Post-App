import { useState } from 'react';
import { Box, Button, TextField, Card, CardContent, Typography, Alert } from '@mui/material';
import { postsAPI } from '../../api';

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await postsAPI.createPost({ text, imageUrl });
      setText('');
      setImageUrl('');
      onPostCreated?.();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Create a Post</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
        />
        
        <TextField
          fullWidth
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          margin="normal"
        />
        
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading || (!text && !imageUrl)}
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </CardContent>
    </Card>
  );
}