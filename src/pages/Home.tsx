import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Avatar,
  IconButton,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';

interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    id: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        setNewPost('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCreatePost}
          disabled={!newPost.trim()}
        >
          Post
        </Button>
      </Paper>

      <Stack spacing={2}>
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader
              avatar={
                <Avatar>
                  {post.author.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={post.author.username}
              subheader={new Date(post.createdAt).toLocaleDateString()}
            />
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton>
                  <FavoriteIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {post.likes}
                </Typography>
                <IconButton>
                  <CommentIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {post.comments}
                </Typography>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Home; 