@echo off
chcp 437 >nul
setlocal

set "PROJECT_ROOT=%~dp0"
set "BACKEND_DIR=%PROJECT_ROOT%backend"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"
set "BACKEND_PORT=8090"
set "FRONTEND_PORT=5193"

:MAIN_MENU
cls
echo.
echo ========================================
echo    Documents Translate - Startup Menu
echo ========================================
echo.
echo   1. Start Backend + Frontend
echo   2. Backend only (port %BACKEND_PORT%)
echo   3. Frontend only (port %FRONTEND_PORT%)
echo   4. Stop all services
echo   5. Restart all
echo   6. Check status
echo   7. Open browser
echo.
echo   0. Exit
echo.
echo ========================================

set /p "choice=Select [0-7]: "

if "%choice%"=="1" goto START_ALL
if "%choice%"=="2" goto START_BACKEND
if "%choice%"=="3" goto START_FRONTEND
if "%choice%"=="4" goto STOP_ALL
if "%choice%"=="5" goto RESTART_ALL
if "%choice%"=="6" goto STATUS
if "%choice%"=="7" goto OPEN_TEST
if "%choice%"=="0" goto EXIT

echo Invalid choice
pause
goto MAIN_MENU

:START_ALL
echo.
echo [1/2] Starting backend...
start "Backend" cmd /c "cd /d "%BACKEND_DIR%" && uvicorn backend.main:app --reload --port %BACKEND_PORT%"

echo [2/2] Starting frontend...
start "Frontend" cmd /c "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo Waiting for services...
timeout /t 5 /nobreak >nul

echo.
echo Status:
netstat -an | find ":%BACKEND_PORT%" >nul 2>&1 && echo [OK] Backend || echo [X] Backend failed
netstat -an | find ":%FRONTEND_PORT%" >nul 2>&1 && echo [OK] Frontend || echo [X] Frontend failed

echo.
start http://localhost:%FRONTEND_PORT%
echo Browser opened...
pause
goto MAIN_MENU

:START_BACKEND
echo.
echo Starting backend...
start "Backend" cmd /c "cd /d "%BACKEND_DIR%" && uvicorn backend.main:app --reload --port %BACKEND_PORT%"
echo.
timeout /t 3 /nobreak >nul
netstat -an | find ":%BACKEND_PORT%" >nul 2>&1 && echo [OK] Backend started || echo [X] Backend failed
pause
goto MAIN_MENU

:START_FRONTEND
echo.
echo Starting frontend...
start "Frontend" cmd /c "cd /d "%FRONTEND_DIR%" && npm run dev"
echo.
timeout /t 3 /nobreak >nul
netstat -an | find ":%FRONTEND_PORT%" >nul 2>&1 && echo [OK] Frontend started || echo [X] Frontend failed
start http://localhost:%FRONTEND_PORT%
pause
goto MAIN_MENU

:STOP_ALL
echo.
echo Stopping services...
taskkill /F /IM uvicorn.exe >nul 2>&1
echo [OK] Backend stopped
taskkill /F /IM node.exe >nul 2>&1
echo [OK] Frontend stopped
pause
goto MAIN_MENU

:RESTART_ALL
echo.
echo Restarting...
call :STOP_ALL
timeout /t 2 /nobreak >nul
goto START_ALL

:STATUS
cls
echo.
echo ========================================
echo              Service Status
echo ========================================

netstat -an | find ":%BACKEND_PORT%" >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Backend: Running (port %BACKEND_PORT%)
) else (
    echo [X] Backend: Not running
)

netstat -an | find ":%FRONTEND_PORT%" >nul 2>&1
if !errorlevel! equ 0 (
    echo [OK] Frontend: Running (port %FRONTEND_PORT%)
) else (
    echo [X] Frontend: Not running
)

echo.
echo ========================================
echo API Docs: http://localhost:%BACKEND_PORT%/docs
echo Frontend: http://localhost:%FRONTEND_PORT%
echo ========================================
pause
goto MAIN_MENU

:OPEN_TEST
start http://localhost:%FRONTEND_PORT%
goto MAIN_MENU

:EXIT
exit /b 0
