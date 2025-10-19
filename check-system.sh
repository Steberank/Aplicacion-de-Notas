#!/bin/bash

# Script para verificar el estado del sistema y dependencias
# Útil para diagnosticar problemas antes de ejecutar la aplicación

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

echo "🔍 Verificación del Sistema - Aplicación de Notas"
echo "=================================================="
echo ""

# Verificar sistema operativo
print_status "Sistema operativo: $(uname -s)"
print_status "Arquitectura: $(uname -m)"
echo ""

# Verificar Node.js
print_status "Verificando Node.js..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js instalado: $NODE_VERSION"
    
    # Verificar versión mínima
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_success "Versión de Node.js compatible (>=18)"
    else
        print_warning "Versión de Node.js antigua. Se recomienda >=18"
    fi
else
    print_error "Node.js no está instalado"
fi
echo ""

# Verificar npm
print_status "Verificando npm..."
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm instalado: $NPM_VERSION"
else
    print_error "npm no está instalado"
fi
echo ""

# Verificar MySQL
print_status "Verificando MySQL..."
if command -v mysql >/dev/null 2>&1; then
    MYSQL_VERSION=$(mysql --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "MySQL instalado: $MYSQL_VERSION"
    
    # Verificar si MySQL está corriendo
    if pgrep -x "mysqld" > /dev/null; then
        print_success "MySQL está corriendo"
    else
        print_warning "MySQL no está corriendo"
    fi
else
    print_error "MySQL no está instalado"
fi
echo ""

# Verificar estructura del proyecto
print_status "Verificando estructura del proyecto..."
if [ -f "package.json" ] && [ -d "backend" ] && [ -d "frontend" ]; then
    print_success "Estructura del proyecto correcta"
else
    print_error "Estructura del proyecto incorrecta"
    print_status "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
fi
echo ""

# Verificar archivos de configuración
print_status "Verificando archivos de configuración..."

if [ -f "backend/package.json" ]; then
    print_success "backend/package.json encontrado"
else
    print_error "backend/package.json no encontrado"
fi

if [ -f "frontend/package.json" ]; then
    print_success "frontend/package.json encontrado"
else
    print_error "frontend/package.json no encontrado"
fi

if [ -f "backend/prisma/schema.prisma" ]; then
    print_success "Schema de Prisma encontrado"
else
    print_error "Schema de Prisma no encontrado"
fi

if [ -f "backend/.env" ]; then
    print_success "Archivo .env encontrado"
else
    print_warning "Archivo .env no encontrado (se creará automáticamente)"
fi
echo ""

# Verificar dependencias instaladas
print_status "Verificando dependencias instaladas..."

if [ -d "backend/node_modules" ]; then
    print_success "Dependencias del backend instaladas"
else
    print_warning "Dependencias del backend no instaladas"
fi

if [ -d "frontend/node_modules" ]; then
    print_success "Dependencias del frontend instaladas"
else
    print_warning "Dependencias del frontend no instaladas"
fi
echo ""

# Verificar puertos
print_status "Verificando puertos..."

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Puerto 5000 está en uso"
else
    print_success "Puerto 5000 disponible"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Puerto 5173 está en uso"
else
    print_success "Puerto 5173 disponible"
fi
echo ""

# Verificar conexión a base de datos
print_status "Verificando conexión a base de datos..."
if mysql -u root -e "SELECT 1;" >/dev/null 2>&1; then
    print_success "Conexión a MySQL exitosa"
    
    # Verificar si la base de datos existe
    if mysql -u root -e "USE notesapp;" >/dev/null 2>&1; then
        print_success "Base de datos 'notesapp' existe"
    else
        print_warning "Base de datos 'notesapp' no existe (se creará automáticamente)"
    fi
else
    print_error "No se puede conectar a MySQL"
    print_status "Asegúrate de que MySQL esté corriendo y configurado correctamente"
fi
echo ""

# Resumen
echo "📊 Resumen de la Verificación"
echo "=============================="

TOTAL_CHECKS=0
PASSED_CHECKS=0

# Contar checks (simplificado)
if command -v node >/dev/null 2>&1; then ((PASSED_CHECKS++)); fi; ((TOTAL_CHECKS++))
if command -v npm >/dev/null 2>&1; then ((PASSED_CHECKS++)); fi; ((TOTAL_CHECKS++))
if command -v mysql >/dev/null 2>&1; then ((PASSED_CHECKS++)); fi; ((TOTAL_CHECKS++))
if [ -f "package.json" ] && [ -d "backend" ] && [ -d "frontend" ]; then ((PASSED_CHECKS++)); fi; ((TOTAL_CHECKS++))

echo "Checks pasados: $PASSED_CHECKS/$TOTAL_CHECKS"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    print_success "¡Sistema listo para ejecutar la aplicación!"
    echo ""
    print_status "Para iniciar la aplicación, ejecuta: ./start.sh"
else
    print_warning "Algunos checks fallaron. Revisa los errores arriba."
    echo ""
    print_status "Para instalar dependencias faltantes, ejecuta: ./start.sh"
fi

echo ""
echo "🔧 Comandos útiles:"
echo "  ./start.sh          - Iniciar aplicación completa"
echo "  ./check-system.sh   - Verificar sistema (este script)"
echo "  cd backend && npm start  - Solo backend"
echo "  cd frontend && npm run dev  - Solo frontend"
