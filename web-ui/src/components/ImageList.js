import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  PlayArrow,
  Refresh
} from '@mui/icons-material';
import api from '../services/api';

function ImageList({ images, onRefresh }) {
  const handleRunFromImage = async (imageName) => {
    try {
      const containerName = `${imageName}-${Date.now()}`;
      await api.runContainer(imageName, {
        name: containerName,
        ports: { '3000': '8080' },
        env: { 'NODE_ENV': 'development' }
      });
      alert(`Container ${containerName} started successfully!`);
    } catch (error) {
      console.error('Failed to run container:', error);
      alert('Failed to run container: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (imagePath) => {
    // This is a placeholder - in a real implementation, you'd calculate actual size
    return `${Math.floor(Math.random() * 100) + 50} MB`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Images ({images.length})
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={onRefresh}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Repository</TableCell>
              <TableCell>Tag</TableCell>
              <TableCell>Image ID</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    No images found. Build your first image!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              images.map((image) => (
                <TableRow key={image.name}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {image.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      latest
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {image.name.substring(0, 12)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(image.created)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatSize(image.path)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRunFromImage(image.name)}
                      title="Run Container"
                    >
                      <PlayArrow />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ImageList;