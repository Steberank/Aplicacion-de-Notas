# Script de PowerShell para ejecutar la aplicación de notas completa
# Incluye configuración de base de datos, instalación de dependencias y ejecución

param(
    [switch]$SkipDependencies,
    [switch]$SkipDatabase,
    [switch]$SkipInstall
)

# Configurar para detener en errores
$ErrorActionPreference = "Stop"

# Función para imprimir mensajes con colores
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Función para verificar si un comando existe
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Verificar dependencias del sistema
function Test-Dependencies {
    Write-Status "Verificando dependencias del sistema..."
    
    if (-not (Test-Command "node")) {
        Write-Error "Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
        exit 1
    }
    
    if (-not (Test-Command "npm")) {
        Write-Error "npm no está instalado. Por favor instala npm"
        exit 1
    }
    
    if (-not (Test-Command "mysql")) {
        Write-Warning "MySQL no está instalado. Por favor instala MySQL desde https://dev.mysql.com/downloads/"
        Write-Status "También puedes usar XAMPP, WAMP, o MySQL Workbench"
        Write-Status "Asegúrate de que MySQL esté corriendo en el puerto 3306"
    }
    
    Write-Success "Dependencias verificadas"
}

# Función para configurar MySQL
function Initialize-MySQL {
    Write-Status "Configurando MySQL..."
    
    # Verificar si MySQL está corriendo
    try {
        $mysqlTest = mysql -u root -e "SELECT 1;" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "No se pudo conectar a MySQL. Asegúrate de que esté corriendo"
            Write-Status "Puedes iniciar MySQL con: net start mysql (como administrador)"
        }
    }
    catch {
        Write-Warning "No se pudo verificar MySQL. Continuando..."
    }
    
    # Crear base de datos si no existe
    try {
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS notesapp;" 2>$null
        Write-Success "Base de datos 'notesapp' creada o ya existe"
    }
    catch {
        Write-Warning "No se pudo crear la base de datos automáticamente"
        Write-Status "Puedes crear la base de datos manualmente con: CREATE DATABASE notesapp;"
    }
    
    Write-Success "MySQL configurado"
}

# Función para instalar dependencias
function Install-Dependencies {
    Write-Status "Instalando dependencias del backend..."
    Set-Location backend
    npm install
    Set-Location ..
    
    Write-Status "Instalando dependencias del frontend..."
    Set-Location frontend
    npm install
    Set-Location ..
    
    Write-Success "Dependencias instaladas"
}

# Función para configurar variables de entorno
function Initialize-Environment {
    Write-Status "Configurando variables de entorno..."
    
    # Crear archivo .env para el backend si no existe
    if (-not (Test-Path "backend\.env")) {
        @"
DATABASE_URL="mysql://root:@localhost:3306/notesapp"
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
        Write-Success "Archivo .env creado en backend/"
    }
    else {
        Write-Status "Archivo .env ya existe en backend/"
    }
    
    Write-Success "Variables de entorno configuradas"
}

# Función para configurar Prisma
function Initialize-Prisma {
    Write-Status "Configurando Prisma..."
    
    Set-Location backend
    
    # Generar cliente de Prisma
    npx prisma generate
    
    # Aplicar migraciones/schema
    npx prisma db push --accept-data-loss
    
    Set-Location ..
    
    Write-Success "Prisma configurado"
}

# Función para ejecutar la aplicación
function Start-Application {
    Write-Status "Iniciando aplicación..."
    
    Write-Host ""
    Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    
    $response = Read-Host "¿Deseas ejecutar la aplicación ahora? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host ""
        Write-Host "🚀 Iniciando aplicación de notas..." -ForegroundColor Green
        Write-Host "==================================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📦 Iniciando Backend (Puerto 5000)..." -ForegroundColor Blue
        Write-Host "📦 Iniciando Frontend (Puerto 5173)..." -ForegroundColor Blue
        Write-Host ""
        Write-Host "✅ Aplicación iniciada correctamente!" -ForegroundColor Green
        Write-Host "🌐 Backend: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "💡 Presiona Ctrl+C para detener la aplicación" -ForegroundColor Yellow
        Write-Host ""
        
        # Ejecutar backend en una nueva ventana
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"
        
        # Esperar un poco y ejecutar frontend
        Start-Sleep -Seconds 3
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"
        
        Write-Host "Aplicación ejecutándose en ventanas separadas..." -ForegroundColor Green
    }
    else {
        Write-Status "Para ejecutar la aplicación más tarde, usa: .\start.ps1"
    }
}

# Función principal
function Main {
    Write-Host "🎯 Iniciando configuración de la aplicación de notas..." -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Cyan
    
    # Verificar que estamos en el directorio correcto
    if (-not (Test-Path "package.json") -or -not (Test-Path "backend") -or -not (Test-Path "frontend")) {
        Write-Error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        Write-Status "Asegúrate de que estés en el directorio que contiene las carpetas 'backend' y 'frontend'"
        exit 1
    }
    
    # Ejecutar pasos de configuración
    if (-not $SkipDependencies) {
        Test-Dependencies
    }
    
    if (-not $SkipDatabase) {
        Initialize-MySQL
    }
    
    if (-not $SkipInstall) {
        Install-Dependencies
    }
    
    Initialize-Environment
    Initialize-Prisma
    Start-Application
}

# Ejecutar función principal
Main
