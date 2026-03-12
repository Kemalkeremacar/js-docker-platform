# 🐳 JS Docker Platform

> JavaScript ile yazılmış Docker benzeri container yönetim sistemi + Modern React Dashboard

[![GitHub stars](https://img.shields.io/github/stars/Kemalkeremacar/js-docker-platform?style=social)](https://github.com/Kemalkeremacar/js-docker-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Kemalkeremacar/js-docker-platform?style=social)](https://github.com/Kemalkeremacar/js-docker-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Kemalkeremacar/js-docker-platform)](https://github.com/Kemalkeremacar/js-docker-platform/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![JS Docker Platform](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/dashboard.png)

## 🚀 Özellikler

### � Core Container System
- ✅ **Container Lifecycle Management** - Oluştur, başlat, durdur, sil
- ✅ **Image Build System** - Dockerfile parser ile otomatik build
- ✅ **Process Isolation** - Node.js child processes ile izolasyon
- ✅ **Port Mapping** - Host-container port yönlendirme
- ✅ **Environment Variables** - Container ortam değişkenleri
- ✅ **Volume Mounting** - Dosya sistemi bağlama
- ✅ **CLI Interface** - Docker benzeri komut satırı

### 🎨 Modern Web Dashboard
- ✅ **React + Material-UI** - Professional arayüz
- ✅ **Real-time Monitoring** - Canlı container takibi
- ✅ **Interactive Management** - Click ile container yönetimi
- ✅ **Visual Charts** - Container stats ve system monitoring
- ✅ **WebSocket Integration** - Anlık güncellemeler
- ✅ **Responsive Design** - Mobile-friendly arayüz

## 📸 Screenshots

### Dashboard - Genel Bakış
![Dashboard](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/dashboard.png)

### Container Yönetimi
![Containers](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/containers.png)

### Image Listesi
![Images](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/images.png)

### Interactive Build
![Build](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/build.png)

## 🎬 Demo

![Demo GIF](https://raw.githubusercontent.com/Kemalkeremacar/js-docker-platform/main/screenshots/demo.gif)

*Container oluşturma, çalıştırma ve real-time monitoring*

## 🏷️ Teknolojiler

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## 📊 Proje İstatistikleri

- 📁 **24 dosya** - Modüler kod yapısı
- 📝 **21,661+ satır kod** - Kapsamlı implementasyon
- 🎨 **React Components** - Modern UI bileşenleri
- 🔌 **RESTful API** - 8+ endpoint
- ⚡ **WebSocket** - Real-time communication
- 🐳 **Container Engine** - Full lifecycle management

## 🎯 Kullanım Alanları

- 🔧 **Development Environment** - Mikroservisler için izole ortamlar
- 🧪 **Testing** - Farklı versiyonları test etme
- 📦 **Deployment** - Production'a hazır containerlar
- 📊 **Monitoring** - Real-time container takibi
- 🎓 **Eğitim** - Container teknolojilerini öğrenme

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

## 🏷️ Teknolojiler

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

## 🎯 Kullanım Alanları

- 🔧 **Development Environment** - Mikroservisler için izole ortamlar
- 🧪 **Testing** - Farklı versiyonları test etme
- 📦 **Deployment** - Production'a hazır containerlar
- 📊 **Monitoring** - Real-time container takibi
- 🎓 **Eğitim** - Container teknolojilerini öğrenme

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