import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  TextField,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserProfile {
  username: string;
  email: string;
  bio: string;
  joinDate: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setBio(data.bio);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3 }}
          >
            {profile.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">{profile.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              Joined {new Date(profile.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          sx={{ mb: 3 }}
        >
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{profile.postsCount}</Typography>
              <Typography color="text.secondary">Posts</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{profile.followersCount}</Typography>
              <Typography color="text.secondary">Followers</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{profile.followingCount}</Typography>
              <Typography color="text.secondary">Following</Typography>
            </CardContent>
          </Card>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              label="Bio"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setBio(profile.bio);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profile.bio || 'No bio yet.'}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              Edit Bio
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Profile; 