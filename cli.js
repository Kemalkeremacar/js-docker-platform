#!/usr/bin/env node

const JSDocker = require('./docker');
const fs = require('fs-extra');

class DockerCLI {
  constructor() {
    this.docker = new JSDocker();
  }

  async run() {
    // Docker'ı initialize et
    await this.docker.init();
    
    const args = process.argv.slice(2);
    const command = args[0];

    try {
      switch (command) {
        case 'build':
          await this.build(args);
          break;
        case 'run':
          await this.runContainer(args);
          break;
        case 'start':
          await this.start(args);
          break;
        case 'stop':
          await this.stop(args);
          break;
        case 'rm':
          await this.remove(args);
          break;
        case 'ps':
          await this.ps(args);
          break;
        case 'images':
          await this.images();
          break;
        case 'logs':
          await this.logs(args);
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;
        default:
          console.log(`Unknown command: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }

  async build(args) {
    // Docker'ı initialize et
    await this.docker.init();
    
    const imageName = args[1];
    const dockerfilePath = args[2] || './Dockerfile';
    
    if (!imageName) {
      throw new Error('Image name is required');
    }

    if (!await fs.pathExists(dockerfilePath)) {
      throw new Error(`Dockerfile not found: ${dockerfilePath}`);
    }

    const dockerfile = await fs.readFile(dockerfilePath, 'utf8');
    await this.docker.buildImage(imageName, dockerfile);
  }

  async runContainer(args) {
    // Docker'ı initialize et
    await this.docker.init();
    
    const imageName = args[1];
    if (!imageName) {
      throw new Error('Image name is required');
    }

    const options = this.parseRunOptions(args.slice(2));
    const container = await this.docker.run(imageName, options);
    
    console.log(`Container started: ${container.id}`);
  }

  parseRunOptions(args) {
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      switch (arg) {
        case '-d':
        case '--detach':
          options.detach = true;
          break;
        case '-p':
        case '--port':
          const portMapping = args[++i];
          const [hostPort, containerPort] = portMapping.split(':');
          options.ports = options.ports || {};
          options.ports[containerPort] = hostPort;
          break;
        case '-v':
        case '--volume':
          const volumeMapping = args[++i];
          const [hostPath, containerPath] = volumeMapping.split(':');
          options.volumes = options.volumes || {};
          options.volumes[containerPath] = hostPath;
          break;
        case '-e':
        case '--env':
          const envVar = args[++i];
          const [key, value] = envVar.split('=');
          options.env = options.env || {};
          options.env[key] = value;
          break;
        case '--name':
          options.name = args[++i];
          break;
        default:
          if (!arg.startsWith('-')) {
            options.command = arg;
          }
      }
    }
    
    return options;
  }

  async start(args) {
    const containerId = args[1];
    if (!containerId) {
      throw new Error('Container ID is required');
    }

    await this.docker.start(containerId);
    console.log(`Container ${containerId} started`);
  }

  async stop(args) {
    const containerId = args[1];
    if (!containerId) {
      throw new Error('Container ID is required');
    }

    await this.docker.stop(containerId);
    console.log(`Container ${containerId} stopped`);
  }

  async remove(args) {
    const containerId = args[1];
    if (!containerId) {
      throw new Error('Container ID is required');
    }

    await this.docker.rm(containerId);
    console.log(`Container ${containerId} removed`);
  }

  async ps(args) {
    // Docker'ı initialize et
    await this.docker.init();
    
    const all = args.includes('-a') || args.includes('--all');
    const containers = this.docker.ps(all);
    
    console.log('CONTAINER ID\tNAME\t\tSTATUS\t\tPORTS');
    containers.forEach(container => {
      const ports = Object.entries(container.ports || {})
        .map(([cp, hp]) => `${hp}:${cp}`)
        .join(', ') || 'none';
      
      console.log(`${container.id}\t${container.name}\t${container.status}\t${ports}`);
    });
  }

  async images() {
    // Docker'ı initialize et
    await this.docker.init();
    
    const images = this.docker.getImages();
    
    console.log('IMAGE NAME\tCREATED');
    images.forEach(image => {
      console.log(`${image.name}\t${image.created.toISOString()}`);
    });
  }

  async logs(args) {
    const containerId = args[1];
    if (!containerId) {
      throw new Error('Container ID is required');
    }

    this.docker.logs(containerId);
  }

  showHelp() {
    console.log(`
JS Docker - A simple Docker-like container system

Usage: node cli.js <command> [options]

Commands:
  build <name> [dockerfile]     Build an image from Dockerfile
  run <image> [options]         Run a container from image
  start <container>             Start a stopped container
  stop <container>              Stop a running container
  rm <container>                Remove a container
  ps [-a]                       List containers
  images                        List images
  logs <container>              Show container logs
  help                          Show this help

Run options:
  -d, --detach                  Run in background
  -p, --port <host:container>   Port mapping
  -v, --volume <host:container> Volume mapping
  -e, --env <key=value>         Environment variable
  --name <name>                 Container name

Examples:
  node cli.js build myapp ./Dockerfile
  node cli.js run myapp -p 3000:3000 -d
  node cli.js ps -a
    `);
  }
}

if (require.main === module) {
  const cli = new DockerCLI();
  cli.run();
}

module.exports = DockerCLI;