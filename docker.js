const Container = require('./container');
const Storage = require('./storage');
const fs = require('fs-extra');
const path = require('path');

class JSDocker {
  constructor() {
    this.containers = new Map();
    this.images = new Map();
    this.storage = new Storage();
  }

  async init() {
    // Docker dizinlerini oluştur
    await fs.ensureDir(path.join(__dirname, 'containers'));
    await fs.ensureDir(path.join(__dirname, 'images'));
    
    // Storage'ı initialize et
    await this.storage.init();
    
    // Mevcut image'ları yükle
    this.images = await this.storage.loadImages();
  }

  // Image oluştur
  async buildImage(imageName, dockerfile) {
    console.log(`Building image: ${imageName}`);
    
    const imagePath = path.join(__dirname, 'images', imageName);
    await fs.ensureDir(imagePath);
    
    // Basit Dockerfile parser
    const instructions = dockerfile.split('\n').filter(line => line.trim());
    
    for (const instruction of instructions) {
      const [command, ...args] = instruction.trim().split(' ');
      
      switch (command.toUpperCase()) {
        case 'FROM':
          // Base image (şimdilik skip)
          break;
        case 'COPY':
          const [src, dest] = args;
          await fs.copy(src, path.join(imagePath, dest));
          break;
        case 'RUN':
          // Build time commands (şimdilik skip)
          break;
        case 'WORKDIR':
          // Working directory ayarla
          break;
      }
    }
    
    this.images.set(imageName, {
      name: imageName,
      path: imagePath,
      created: new Date()
    });
    
    // Image'ları kaydet
    await this.storage.saveImages(this.images);
    
    console.log(`Image ${imageName} built successfully`);
  }

  // Container çalıştır
  async run(imageName, options = {}) {
    const imagePath = path.join(__dirname, 'images', imageName);
    
    if (!await fs.pathExists(imagePath)) {
      throw new Error(`Image ${imageName} not found`);
    }

    const container = new Container(imagePath, options);
    await container.create();
    
    this.containers.set(container.id, container);
    
    // Detached mode'da da container'ı başlat
    await container.start(options.command);
    
    return container;
  }

  // Container başlat
  async start(containerId) {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    await container.start();
    return container;
  }

  // Container durdur
  async stop(containerId) {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    await container.stop();
    return container;
  }

  // Container sil
  async rm(containerId) {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    await container.remove();
    this.containers.delete(containerId);
  }

  // Container'ları listele
  ps(all = false) {
    const containers = Array.from(this.containers.values());
    
    if (!all) {
      return containers.filter(c => c.status === 'running');
    }
    
    return containers.map(c => c.getInfo());
  }

  // Image'ları listele
  getImages() {
    return Array.from(this.images.values());
  }

  // Container logları
  logs(containerId) {
    const container = this.containers.get(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    
    // Basit log implementation
    console.log(`Logs for container ${container.name}:`);
    return container.getInfo();
  }
}

module.exports = JSDocker;