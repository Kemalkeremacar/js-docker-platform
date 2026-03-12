# JS Docker

JavaScript ile yazılmış Docker benzeri container sistemi + Modern Web UI Dashboard

## ✨ Özellikler

### 🐳 Core Container System
- ✅ Container oluşturma ve yönetimi
- ✅ Image build sistemi (Dockerfile parser)
- ✅ Process isolation (Node.js child processes)
- ✅ Port mapping ve environment variables
- ✅ Volume mounting
- ✅ Docker benzeri CLI komutları

### 🎨 Modern Web Dashboard
- ✅ React + Material-UI arayüzü
- ✅ Real-time container monitoring
- ✅ Interactive container management
- ✅ Visual image building
- ✅ Live stats ve charts
- ✅ WebSocket real-time updates

## 🚀 Kurulum ve Çalıştırma

### Backend + Frontend Beraber
```bash
npm install
cd web-ui && npm install && cd ..
npm run dev
```

### Sadece CLI
```bash
npm install
node cli.js --help
```

### Sadece Web UI
```bash
# Terminal 1: API Server
npm run server

# Terminal 2: React UI
npm run ui
```

## 🎯 Kullanım

### Web Dashboard
1. `npm run dev` ile başlat
2. http://localhost:3000 adresini aç
3. Dashboard'dan container'ları yönet

### CLI Komutları
```bash
# Image build et
node cli.js build my-app ./Dockerfile

# Container çalıştır
node cli.js run my-app --name web-server -p 8080:3000 -d

# Container'ları listele
node cli.js ps -a

# Image'ları listele
node cli.js images
```

## 📊 Web Dashboard Özellikleri

### Dashboard Tab
- Container ve image istatistikleri
- System resource monitoring
- Real-time charts ve graphs
- Quick actions

### Containers Tab
- Tüm container'ları listele
- Start/stop/remove operations
- Yeni container çalıştır
- Port ve environment configuration

### Images Tab
- Mevcut image'ları görüntüle
- Image'dan hızlı container çalıştır
- Image detayları ve metadata

### Build Tab
- Interactive Dockerfile editor
- Real-time build process
- Dockerfile syntax reference
- Build history

## 🏗️ Mimari

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │◄──►│   Express API    │◄──►│   JS Docker     │
│   (Port 3000)   │    │   (Port 3001)    │    │   Engine        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼────────┐             │
         │              │  WebSocket      │             │
         └──────────────►│  Real-time      │◄────────────┘
                        │  Updates        │
                        └─────────────────┘
```

### Bileşenler
- **React UI**: Modern dashboard arayüzü
- **Express API**: RESTful API server
- **WebSocket**: Real-time updates
- **JS Docker Engine**: Container management core
- **CLI**: Command line interface

## 🔧 API Endpoints

```
GET    /api/images              # Image listesi
POST   /api/images/build        # Image build
GET    /api/containers          # Container listesi  
POST   /api/containers/run      # Container çalıştır
POST   /api/containers/:id/stop # Container durdur
DELETE /api/containers/:id      # Container sil
GET    /api/stats               # System stats
```

## 🎨 Teknolojiler

### Frontend
- React 18
- Material-UI 5
- Recharts (Charts)
- Socket.IO Client
- Axios

### Backend
- Node.js
- Express.js
- Socket.IO
- fs-extra

## 💡 Geliştirme Fırsatları

Bu proje şunları öğretir:
- **System Programming**: Process management, file systems
- **Web Development**: React, REST APIs, WebSocket
- **DevOps Concepts**: Containerization, orchestration
- **Architecture Design**: Microservices, real-time systems

## 🚀 Gelecek Özellikler

- [ ] Docker Compose benzeri multi-container
- [ ] Container networking
- [ ] Volume management UI
- [ ] Container logs viewer
- [ ] Resource monitoring (CPU, Memory)
- [ ] Registry system (push/pull)
- [ ] User authentication
- [ ] Container health checks

## 📈 Portfolio Değeri

Bu proje CV'nde şu şekilde sunulabilir:
- "Full-stack containerization platform geliştirdim"
- "Docker benzeri sistem + modern web dashboard"
- "Real-time monitoring ve WebSocket integration"
- "System programming + modern web technologies"