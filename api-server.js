const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const JSDocker = require('./docker');

class DockerAPIServer {
  constructor(port = 3001) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.port = port;
    this.docker = new JSDocker();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('web-ui/build'));
  }

  setupRoutes() {
    // Images API
    this.app.get('/api/images', async (req, res) => {
      try {
        await this.docker.init();
        const images = this.docker.getImages();
        res.json(images);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Build Image API
    this.app.post('/api/images/build', async (req, res) => {
      try {
        const { name, dockerfile } = req.body;
        await this.docker.init();
        await this.docker.buildImage(name, dockerfile);
        
        // Emit to all clients
        this.io.emit('imageBuilt', { name });
        
        res.json({ success: true, message: `Image ${name} built successfully` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Containers API
    this.app.get('/api/containers', async (req, res) => {
      try {
        await this.docker.init();
        const containers = this.docker.ps(true);
        res.json(containers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Run Container API
    this.app.post('/api/containers/run', async (req, res) => {
      try {
        const { image, options } = req.body;
        await this.docker.init();
        const container = await this.docker.run(image, options);
        
        // Emit to all clients
        this.io.emit('containerStarted', container.getInfo());
        
        res.json(container.getInfo());
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Stop Container API
    this.app.post('/api/containers/:id/stop', async (req, res) => {
      try {
        const { id } = req.params;
        await this.docker.init();
        await this.docker.stop(id);
        
        // Emit to all clients
        this.io.emit('containerStopped', { id });
        
        res.json({ success: true, message: `Container ${id} stopped` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Remove Container API
    this.app.delete('/api/containers/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await this.docker.init();
        await this.docker.rm(id);
        
        // Emit to all clients
        this.io.emit('containerRemoved', { id });
        
        res.json({ success: true, message: `Container ${id} removed` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Container Logs API
    this.app.get('/api/containers/:id/logs', async (req, res) => {
      try {
        const { id } = req.params;
        await this.docker.init();
        const logs = this.docker.logs(id);
        res.json({ logs });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // System Stats API
    this.app.get('/api/stats', async (req, res) => {
      try {
        await this.docker.init();
        const containers = this.docker.ps(true);
        const images = this.docker.getImages();
        
        const stats = {
          containers: {
            total: containers.length,
            running: containers.filter(c => c.status === 'running').length,
            stopped: containers.filter(c => c.status === 'exited').length
          },
          images: {
            total: images.length
          },
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform
          }
        };
        
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Real-time stats
      const statsInterval = setInterval(async () => {
        try {
          await this.docker.init();
          const containers = this.docker.ps(true);
          socket.emit('statsUpdate', {
            containers: containers.length,
            running: containers.filter(c => c.status === 'running').length
          });
        } catch (error) {
          console.error('Stats update error:', error.message);
        }
      }, 2000);

      socket.on('disconnect', () => {
        clearInterval(statsInterval);
      });
    });
  }

  async start() {
    await this.docker.init();
    this.server.listen(this.port, () => {
      console.log(`🚀 JS Docker API Server running on http://localhost:${this.port}`);
      console.log(`📊 Dashboard will be available at http://localhost:${this.port}`);
    });
  }
}

module.exports = DockerAPIServer;

// Start server if run directly
if (require.main === module) {
  const server = new DockerAPIServer();
  server.start().catch(console.error);
}