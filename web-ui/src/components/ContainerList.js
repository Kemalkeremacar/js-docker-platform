import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Delete,
  Add,
  Refresh
} from '@mui/icons-material';
import api from '../services/api';

function ContainerList({ containers, onRefresh }) {
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [newContainer, setNewContainer] = useState({
    image: '',
    name: '',
    ports: '',
    env: ''
  });

  const handleRunContainer = async () => {
    try {
      const options = {
        name: newContainer.name,
        ports: newContainer.ports ? 
          Object.fromEntries(newContainer.ports.split(',').map(p => p.split(':'))) : {},
        env: newContainer.env ? 
          Object.fromEntries(newContainer.env.split(',').map(e => e.split('='))) : {}
      };

      await api.runContainer(newContainer.image, options);
      setRunDialogOpen(false);
      setNewContainer({ image: '', name: '', ports: '', env: '' });
      onRefresh();
    } catch (error) {
      console.error('Failed to run container:', error);
      alert('Failed to run container: ' + error.message);
    }
  };

  const handleStopContainer = async (id) => {
    try {
      await api.stopContainer(id);
      onRefresh();
    } catch (error) {
      console.error('Failed to stop container:', error);
      alert('Failed to stop container: ' + error.message);
    }
  };

  const handleRemoveContainer = async (id) => {
    if (window.confirm('Are you sure you want to remove this container?')) {
      try {
        await api.removeContainer(id);
        onRefresh();
      } catch (error) {
        console.error('Failed to remove container:', error);
        alert('Failed to remove container: ' + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'success';
      case 'exited': return 'error';
      case 'created': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Containers ({containers.length})
        </Typography>
        <Box>
          <Button
            startIcon={<Refresh />}
            onClick={onRefresh}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setRunDialogOpen(true)}
          >
            Run Container
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Container ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ports</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {containers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    No containers found. Run your first container!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {container.id.substring(0, 12)}
                    </Typography>
                  </TableCell>
                  <TableCell>{container.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {container.image.split('/').pop()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={container.status} 
                      color={getStatusColor(container.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {container.ports && Object.entries(container.ports).map(([containerPort, hostPort]) => (
                      <Typography key={containerPort} variant="body2">
                        {hostPort}:{containerPort}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box>
                      {container.status === 'running' ? (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleStopContainer(container.id)}
                          title="Stop"
                        >
                          <Stop />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleRunContainer(container.id)}
                          title="Start"
                        >
                          <PlayArrow />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveContainer(container.id)}
                        title="Remove"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Run Container Dialog */}
      <Dialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Run New Container</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image Name"
                value={newContainer.image}
                onChange={(e) => setNewContainer({...newContainer, image: e.target.value})}
                placeholder="e.g., my-web-app"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Container Name"
                value={newContainer.name}
                onChange={(e) => setNewContainer({...newContainer, name: e.target.value})}
                placeholder="e.g., my-container"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Port Mapping"
                value={newContainer.ports}
                onChange={(e) => setNewContainer({...newContainer, ports: e.target.value})}
                placeholder="e.g., 8080:3000,9000:9000"
                helperText="Format: hostPort:containerPort,hostPort2:containerPort2"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Environment Variables"
                value={newContainer.env}
                onChange={(e) => setNewContainer({...newContainer, env: e.target.value})}
                placeholder="e.g., NODE_ENV=production,PORT=3000"
                helperText="Format: KEY=value,KEY2=value2"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRunDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRunContainer} 
            variant="contained"
            disabled={!newContainer.image}
          >
            Run Container
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContainerList;