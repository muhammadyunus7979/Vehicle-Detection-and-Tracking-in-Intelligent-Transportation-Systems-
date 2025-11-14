Vehicle Detection & Tracking for ITS
====================================

This repository contains a production-ready implementation blueprint for a full-stack Intelligent Transportation System (ITS) focused on vehicle detection, tracking, and analytics. The project includes:

- Spring Boot backend with REST APIs, in-memory storage, and video processing.
- React + Vite frontend dashboard with video player, analytics, and performance metrics.
- Support for multiple vehicle types (cars, trucks, bikes, motorcycles, buses, vans).
- Real-time speed tracking and visualization with line and bar graphs.

## Prerequisites

- **Java 21** or higher
- **Maven 3.9+** (or use the included Maven in `tools/apache-maven-3.9.6/`)
- **Node.js 18+** and **npm**
- **PowerShell** (for Windows) or **Bash** (for Linux/Mac)

## Quick Start

### 1. Start the Backend

The backend uses Spring Boot with in-memory storage (no database required).

**Using included Maven (Windows PowerShell):**
```powershell
cd backend
..\tools\apache-maven-3.9.6\bin\mvn spring-boot:run
```

**Using system Maven:**
```bash
cd backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

**API Endpoints:**
- `POST /api/videos/upload` - Upload a video file
- `POST /api/videos/{videoId}/process` - Start video processing
- `GET /api/videos/{videoId}` - Get video information
- `GET /api/videos/{videoId}/speeds` - Get vehicle speeds
- `GET /api/videos/{videoId}/analytics` - Get analytics and metrics
- `GET /api/videos/{videoId}/stream` - Stream video file

### 2. Start the Frontend

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173** (or the next available port)

### 3. Access the Dashboard

Open your browser and navigate to:
- **Frontend Dashboard:** http://localhost:5173/dashboard

## Project Structure

```
opencv/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   └── pom.xml             # Maven dependencies
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── routes/         # Page components
│   │   └── api/            # API client
│   └── package.json        # npm dependencies
└── tools/                  # Build tools (Maven)
```

## Features

- **Video Upload & Processing:** Upload videos and automatically process them for vehicle detection
- **Multiple Vehicle Types:** Detects cars, trucks, bikes, motorcycles, buses, and vans
- **Speed Tracking:** Real-time vehicle speed detection and display
- **Performance Metrics:** 
  - Accuracy over time (mAP50)
  - FPS over time
  - Speed vs time (Line and Bar graphs)
  - Vehicle class distribution
- **Video Player:** Play processed videos with play/pause controls
- **Dark Mode UI:** Modern dark-themed interface

## Development Commands

### Backend

```bash
# Run the backend
cd backend
mvn spring-boot:run

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
app:
  storage:
    path: ${STORAGE_PATH:${java.io.tmpdir}/vdt-storage}
  inference:
    url: ${INFERENCE_URL:http://localhost:8001/infer}
```

### Frontend Configuration

Create `frontend/.env.local` (optional):

```env
VITE_API_URL=http://localhost:8080/api
```

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Verify Java 21 is installed: `java -version`
- Ensure Maven is available or use the included Maven in `tools/`

### Frontend won't start
- Run `npm install` in the frontend directory
- Check if Node.js 18+ is installed: `node -v`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Video upload fails
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify file size is under 2GB (configured limit)

## Notes

- The backend uses **in-memory storage** - data is lost on restart
- Video files are stored in the system temp directory by default
- Processing uses mock detection data (for demonstration)
- The application runs in **dark mode only**

