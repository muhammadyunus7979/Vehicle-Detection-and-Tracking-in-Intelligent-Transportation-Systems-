# Fixed: CORS Configuration

## ✅ What Was Fixed

The backend CORS configuration was empty, which blocked frontend requests. I've added proper CORS settings to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative port)
- `http://127.0.0.1:5173` (alternative localhost)

## 🔄 Restart Backend

**Stop the current backend:**
- Press `Ctrl+C` in the backend terminal, OR
- Run: `Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`

**Start backend again:**
```powershell
cd backend
..\tools\apache-maven-3.9.6\bin\mvn spring-boot:run
```

## ⚠️ Important: MongoDB Still Required

The backend also needs MongoDB to be running. If you see MongoDB connection errors:

1. **Quick Option**: Use MongoDB Atlas (cloud)
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Update `backend/src/main/resources/application.yml` with your connection string

2. **Local Option**: Install MongoDB locally
   - Download: https://www.mongodb.com/try/download/community

See `MONGODB_SETUP.md` for detailed instructions.

## ✅ After Restart

1. Backend should start successfully
2. Frontend should be able to connect
3. Sign up and login should work!

