import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Image as ImageIcon,
  Memory,
  Computer
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard({ containers, images, stats, onRefresh }) {
  const runningContainers = containers.filter(c => c.status === 'running');
  const stoppedContainers = containers.filter(c => c.status === 'exited');

  const containerData = [
    { name: 'Running', value: runningContainers.length, color: '#4caf50' },
    { name: 'Stopped', value: stoppedContainers.length, color: '#f44336' },
  ];

  const memoryUsage = stats.system?.memory ? [
    { name: 'Used', value: Math.round(stats.system.memory.heapUsed / 1024 / 1024) },
    { name: 'Total', value: Math.round(stats.system.memory.heapTotal / 1024 / 1024) },
  ] : [];

  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PlayArrow color="success" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Running Containers
                </Typography>
                <Typography variant="h4">
                  {runningContainers.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Stop color="error" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Stopped Containers
                </Typography>
                <Typography variant="h4">
                  {stoppedContainers.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ImageIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Images
                </Typography>
                <Typography variant="h4">
                  {images.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Computer color="info" sx={{ mr: 1 }} />
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  System Uptime
                </Typography>
                <Typography variant="h4">
                  {stats.system ? Math.round(stats.system.uptime / 60) : 0}m
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Container Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={containerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {containerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Memory Usage (MB)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memoryUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Containers */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Containers
              </Typography>
              <Button onClick={onRefresh} variant="outlined" size="small">
                Refresh
              </Button>
            </Box>
            
            {containers.length === 0 ? (
              <Typography color="textSecondary">
                No containers found. Create your first container!
              </Typography>
            ) : (
              containers.slice(0, 5).map((container) => (
                <Box key={container.id} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                  <Box>
                    <Typography variant="body1">
                      {container.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {container.id} • {container.image}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="body2" 
                      className={`container-status-${container.status}`}
                      sx={{ mr: 1 }}
                    >
                      {container.status}
                    </Typography>
                    {container.status === 'running' && (
                      <Box sx={{ width: 100, mr: 1 }}>
                        <LinearProgress />
                      </Box>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;