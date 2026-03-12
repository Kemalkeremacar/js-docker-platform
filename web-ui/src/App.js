import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { Storage as DockerIcon } from '@mui/icons-material';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import ContainerList from './components/ContainerList';
import ImageList from './components/ImageList';
import BuildImage from './components/BuildImage';
import api from './services/api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [containers, setContainers] = useState([]);
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('containerStarted', (container) => {
      setContainers(prev => [...prev, container]);
    });

    newSocket.on('containerStopped', ({ id }) => {
      setContainers(prev => 
        prev.map(c => c.id === id ? { ...c, status: 'exited' } : c)
      );
    });

    newSocket.on('containerRemoved', ({ id }) => {
      setContainers(prev => prev.filter(c => c.id !== id));
    });

    newSocket.on('imageBuilt', ({ name }) => {
      loadImages();
    });

    newSocket.on('statsUpdate', (newStats) => {
      setStats(prev => ({ ...prev, ...newStats }));
    });

    // Load initial data
    loadContainers();
    loadImages();
    loadStats();

    return () => newSocket.close();
  }, []);

  const loadContainers = async () => {
    try {
      const data = await api.getContainers();
      setContainers(data);
    } catch (error) {
      console.error('Failed to load containers:', error);
    }
  };

  const loadImages = async () => {
    try {
      const data = await api.getImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <DockerIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JS Docker Dashboard
          </Typography>
          <Typography variant="body2">
            Containers: {stats.containers?.running || 0} running, {stats.containers?.total || 0} total
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Dashboard" />
            <Tab label="Containers" />
            <Tab label="Images" />
            <Tab label="Build" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Dashboard 
              containers={containers} 
              images={images} 
              stats={stats}
              onRefresh={() => {
                loadContainers();
                loadImages();
                loadStats();
              }}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ContainerList 
              containers={containers} 
              onRefresh={loadContainers}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ImageList 
              images={images} 
              onRefresh={loadImages}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <BuildImage 
              onImageBuilt={() => {
                loadImages();
                setTabValue(2); // Switch to Images tab
              }}
            />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;