@echo off
echo ================================
echo   Data Table System Startup
echo ================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting servers...
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop servers
echo.
call npm start
