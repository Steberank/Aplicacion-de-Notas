#!/bin/bash

# Script para ejecutar la aplicación de notas completa
# Incluye configuración de base de datos, instalación de dependencias y ejecución

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependencias del sistema
check_dependencies() {
    print_status "Verificando dependencias del sistema..."
    
    if ! command_exists node; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm no está instalado. Por favor instala npm"
        exit 1
    fi
    
    if ! command_exists mysql; then
        print_warning "MySQL no está instalado. Intentando instalar..."
        
        # Detectar el sistema operativo
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install mysql
            else
                print_error "Homebrew no está instalado. Por favor instala MySQL manualmente"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command_exists apt-get; then
                sudo apt-get update && sudo apt-get install -y mysql-server
            elif command_exists yum; then
                sudo yum install -y mysql-server
            else
                print_error "No se pudo instalar MySQL automáticamente. Por favor instálalo manualmente"
                exit 1
            fi
        else
            print_error "Sistema operativo no soportado"
            exit 1
        fi
    fi
    
    print_success "Dependencias verificadas"
}

# Función para configurar MySQL
setup_mysql() {
    print_status "Configurando MySQL..."
    
    # Iniciar MySQL si no está corriendo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mysql 2>/dev/null || true
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo systemctl start mysql 2>/dev/null || sudo service mysql start 2>/dev/null || true
    fi
    
    # Esperar a que MySQL esté listo
    print_status "Esperando a que MySQL esté listo..."
    sleep 5
    
    # Crear base de datos si no existe
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS notesapp;" 2>/dev/null || {
        print_warning "No se pudo conectar a MySQL como root. Intentando sin contraseña..."
        mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS notesapp;" || {
            print_error "No se pudo crear la base de datos. Por favor configura MySQL manualmente"
            print_status "Puedes crear la base de datos manualmente con: CREATE DATABASE notesapp;"
        }
    }
    
    print_success "MySQL configurado"
}

# Función para instalar dependencias
install_dependencies() {
    print_status "Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
    
    print_status "Instalando dependencias del frontend..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencias instaladas"
}

# Función para configurar variables de entorno
setup_environment() {
    print_status "Configurando variables de entorno..."
    
    # Crear archivo .env para el backend si no existe
    if [ ! -f backend/.env ]; then
        cat > backend/.env << EOF
DATABASE_URL="mysql://root:@localhost:3306/notesapp"
PORT=5000
NODE_ENV=development
EOF
        print_success "Archivo .env creado en backend/"
    else
        print_status "Archivo .env ya existe en backend/"
    fi
    
    print_success "Variables de entorno configuradas"
}

# Función para configurar Prisma
setup_prisma() {
    print_status "Configurando Prisma..."
    
    cd backend
    
    # Generar cliente de Prisma
    npx prisma generate
    
    # Aplicar migraciones/schema
    npx prisma db push --accept-data-loss
    
    cd ..
    
    print_success "Prisma configurado"
}

# Función para ejecutar la aplicación
run_app() {
    print_status "Iniciando aplicación..."
    
    # Crear archivo de configuración para ejecutar ambos procesos
    cat > run_app.js << 'EOF'
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando aplicación de notas...\n');

// Función para ejecutar un comando en un directorio específico
function runCommand(command, args, cwd, name) {
    console.log(`📦 Iniciando ${name}...`);
    
    const process = spawn(command, args, {
        cwd: cwd,
        stdio: 'inherit',
        shell: true
    });
    
    process.on('error', (err) => {
        console.error(`❌ Error en ${name}:`, err);
    });
    
    return process;
}

// Ejecutar backend
const backend = runCommand('npm', ['start'], path.join(__dirname, 'backend'), 'Backend (Puerto 5000)');

// Esperar un poco para que el backend se inicie
setTimeout(() => {
    // Ejecutar frontend
    const frontend = runCommand('npm', ['run', 'dev'], path.join(__dirname, 'frontend'), 'Frontend (Puerto 5173)');
    
    // Manejar cierre de procesos
    process.on('SIGINT', () => {
        console.log('\n🛑 Cerrando aplicación...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Cerrando aplicación...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });
    
}, 3000);

console.log('\n✅ Aplicación iniciada correctamente!');
console.log('🌐 Backend: http://localhost:5000');
console.log('🌐 Frontend: http://localhost:5173');
console.log('\n💡 Presiona Ctrl+C para detener la aplicación\n');
EOF
    
    # Ejecutar la aplicación
    node run_app.js
}

# Función para limpiar archivos temporales
cleanup() {
    print_status "Limpiando archivos temporales..."
    rm -f run_app.js
    print_success "Limpieza completada"
}

# Función principal
main() {
    echo "🎯 Iniciando configuración de la aplicación de notas..."
    echo "=================================================="
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        print_status "Asegúrate de que estés en el directorio que contiene las carpetas 'backend' y 'frontend'"
        exit 1
    fi
    
    # Ejecutar pasos de configuración
    check_dependencies
    setup_mysql
    install_dependencies
    setup_environment
    setup_prisma
    
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo "=================================================="
    echo ""
    
    # Preguntar si quiere ejecutar la aplicación
    read -p "¿Deseas ejecutar la aplicación ahora? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_app
    else
        print_status "Para ejecutar la aplicación más tarde, usa: ./start.sh"
    fi
    
    # Limpiar archivos temporales al salir
    trap cleanup EXIT
}

# Ejecutar función principal
main "$@"
