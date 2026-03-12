import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  LinearProgress,
  Grid
} from '@mui/material';
import { Build } from '@mui/icons-material';
import api from '../services/api';

const defaultDockerfile = `FROM node:16
COPY example-app/ /app/
WORKDIR /app
RUN npm install`;

function BuildImage({ onImageBuilt }) {
  const [imageName, setImageName] = useState('');
  const [dockerfile, setDockerfile] = useState(defaultDockerfile);
  const [building, setBuilding] = useState(false);
  const [buildResult, setBuildResult] = useState(null);

  const handleBuild = async () => {
    if (!imageName.trim()) {
      setBuildResult({ type: 'error', message: 'Please enter an image name' });
      return;
    }

    setBuilding(true);
    setBuildResult(null);

    try {
      const result = await api.buildImage(imageName.trim(), dockerfile);
      setBuildResult({ type: 'success', message: result.message });
      onImageBuilt();
      
      // Clear form after successful build
      setTimeout(() => {
        setImageName('');
        setDockerfile(defaultDockerfile);
        setBuildResult(null);
      }, 3000);
    } catch (error) {
      setBuildResult({ 
        type: 'error', 
        message: error.response?.data?.error || error.message 
      });
    } finally {
      setBuilding(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Build New Image
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Image Configuration
            </Typography>
            
            <TextField
              fullWidth
              label="Image Name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="e.g., my-web-app"
              margin="normal"
              disabled={building}
            />

            <TextField
              fullWidth
              label="Dockerfile"
              value={dockerfile}
              onChange={(e) => setDockerfile(e.target.value)}
              multiline
              rows={12}
              margin="normal"
              disabled={building}
              sx={{ fontFamily: 'monospace' }}
            />

            {building && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Building image...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {buildResult && (
              <Alert 
                severity={buildResult.type} 
                sx={{ mt: 2 }}
                onClose={() => setBuildResult(null)}
              >
                {buildResult.message}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              startIcon={<Build />}
              onClick={handleBuild}
              disabled={building || !imageName.trim()}
              sx={{ mt: 2 }}
            >
              {building ? 'Building...' : 'Build Image'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dockerfile Reference
            </Typography>
            
            <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <Typography variant="body2" gutterBottom>
                <strong>FROM</strong> - Base image
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                FROM node:16
              </Typography>

              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                <strong>COPY</strong> - Copy files
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                COPY source/ /destination/
              </Typography>

              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                <strong>WORKDIR</strong> - Set working directory
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                WORKDIR /app
              </Typography>

              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                <strong>RUN</strong> - Execute commands
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                RUN npm install
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Tips:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Use descriptive image names</li>
                <li>Keep Dockerfiles simple</li>
                <li>Copy only necessary files</li>
                <li>Use specific base image versions</li>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BuildImage;