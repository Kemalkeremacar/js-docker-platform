const fs = require('fs-extra');
const path = require('path');

class Storage {
  constructor() {
    this.dataDir = path.join(__dirname, '.jsdata');
    this.imagesFile = path.join(this.dataDir, 'images.json');
    this.containersFile = path.join(this.dataDir, 'containers.json');
  }

  async init() {
    await fs.ensureDir(this.dataDir);
    
    // Initialize files if they don't exist
    if (!await fs.pathExists(this.imagesFile)) {
      await fs.writeJson(this.imagesFile, []);
    }
    if (!await fs.pathExists(this.containersFile)) {
      await fs.writeJson(this.containersFile, []);
    }
  }

  async saveImages(images) {
    const imageArray = Array.from(images.values());
    await fs.writeJson(this.imagesFile, imageArray);
  }

  async loadImages() {
    try {
      const imageArray = await fs.readJson(this.imagesFile);
      const images = new Map();
      imageArray.forEach(img => {
        // Date string'ini Date object'e çevir
        img.created = new Date(img.created);
        images.set(img.name, img);
      });
      return images;
    } catch (error) {
      return new Map();
    }
  }

  async saveContainers(containers) {
    const containerArray = Array.from(containers.values()).map(c => c.getInfo());
    await fs.writeJson(this.containersFile, containerArray);
  }

  async loadContainers() {
    try {
      const containerArray = await fs.readJson(this.containersFile);
      return containerArray;
    } catch (error) {
      return [];
    }
  }
}

module.exports = Storage;