const { spawn, exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

class Container {
  constructor(image, options = {}) {
    this.id = crypto.randomBytes(6).toString('hex');
    this.image = image;
    this.name = options.name || `container_${this.id}`;
    this.ports = options.ports || {};
    this.volumes = options.volumes || {};
    this.env = options.env || {};
    this.workdir = options.workdir || '/app';
    this.process = null;
    this.status = 'created';
    this.rootfs = path.join(__dirname, 'containers', this.id);
  }

  async create() {
    console.log(`Creating container ${this.name} (${this.id})`);
    
    // Container root filesystem oluştur
    await fs.ensureDir(this.rootfs);
    await fs.ensureDir(path.join(this.rootfs, 'app'));
    await fs.ensureDir(path.join(this.rootfs, 'tmp'));
    
    // Image'dan dosyaları kopyala
    if (await fs.pathExists(this.image)) {
      await fs.copy(this.image, path.join(this.rootfs, 'app'));
    }
    
    this.status = 'created';
    console.log(`Container ${this.name} created successfully`);
  }

  async start(command = 'node index.js') {
    if (this.status === 'running') {
      throw new Error('Container is already running');
    }

    console.log(`Starting container ${this.name}`);
    
    const env = {
      ...process.env,
      ...this.env,
      CONTAINER_ID: this.id,
      CONTAINER_NAME: this.name
    };

    // Container process'i başlat
    this.process = spawn('node', ['-e', `
      ${this.generateStartScript(command)}
    `], {
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.process.stdout.on('data', (data) => {
      console.log(`[${this.name}] ${data.toString().trim()}`);
    });

    this.process.stderr.on('data', (data) => {
      console.error(`[${this.name}] ERROR: ${data.toString().trim()}`);
    });

    this.process.on('exit', (code) => {
      console.log(`Container ${this.name} exited with code ${code}`);
      this.status = 'exited';
    });

    this.status = 'running';
    console.log(`Container ${this.name} started with PID ${this.process.pid}`);
  }

  generateStartScript(command) {
    const appPath = path.join(this.rootfs, 'app').replace(/\\/g, '/');
    return `
      console.log('Container ${this.name} is starting...');
      
      try {
        process.chdir('${appPath}');
        console.log('Changed to directory:', process.cwd());
        
        // Web server'ı başlat
        const http = require('http');
        
        const server = http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(\`
            <h1>Hello from JS Docker Container!</h1>
            <p>Container ID: \${process.env.CONTAINER_ID}</p>
            <p>Container Name: \${process.env.CONTAINER_NAME}</p>
            <p>Current Time: \${new Date().toISOString()}</p>
            <p>Working Directory: \${process.cwd()}</p>
          \`);
        });

        const port = process.env.PORT || 3000;
        server.listen(port, () => {
          console.log(\`Server running on port \${port}\`);
          console.log(\`Container: \${process.env.CONTAINER_NAME} (\${process.env.CONTAINER_ID})\`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
          console.log('Received SIGTERM, shutting down gracefully');
          server.close(() => {
            process.exit(0);
          });
        });
        
      } catch (error) {
        console.error('Container execution error:', error.message);
        process.exit(1);
      }
    `;
  }

  async stop() {
    if (this.status !== 'running' || !this.process) {
      throw new Error('Container is not running');
    }

    console.log(`Stopping container ${this.name}`);
    this.process.kill('SIGTERM');
    
    // Graceful shutdown için bekle
    setTimeout(() => {
      if (this.process && !this.process.killed) {
        this.process.kill('SIGKILL');
      }
    }, 5000);

    this.status = 'stopped';
  }

  async remove() {
    if (this.status === 'running') {
      await this.stop();
    }

    console.log(`Removing container ${this.name}`);
    await fs.remove(this.rootfs);
    this.status = 'removed';
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      status: this.status,
      ports: this.ports,
      volumes: this.volumes,
      pid: this.process ? this.process.pid : null
    };
  }
}

module.exports = Container;