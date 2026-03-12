const JSDocker = require('./docker');

async function demo() {
  const docker = new JSDocker();
  
  console.log('🐳 JS Docker Demo Starting...\n');
  
  try {
    // Image build et
    console.log('📦 Building image...');
    await docker.buildImage('example-app', `
FROM node:16
COPY example-app/ /app/
WORKDIR /app
RUN npm install
    `);
    
    // Container çalıştır
    console.log('🚀 Running container...');
    const container = await docker.run('example-app', {
      name: 'my-web-app',
      ports: { '3000': '8080' },
      env: { 'PORT': '3000' },
      command: 'node index.js',
      detach: false
    });
    
    console.log(`✅ Container started: ${container.name} (${container.id})`);
    
    // Container bilgilerini göster
    setTimeout(() => {
      console.log('\n📊 Container Info:');
      console.log(JSON.stringify(container.getInfo(), null, 2));
      
      console.log('\n📋 All Containers:');
      docker.ps(true).forEach(c => {
        console.log(`- ${c.name} (${c.id}): ${c.status}`);
      });
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  demo();
}

module.exports = { JSDocker };