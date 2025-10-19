# Script de PowerShell para verificar el estado del sistema y dependencias
# Útil para diagnosticar problemas antes de ejecutar la aplicación

param(
    [switch]$Detailed
)

# Función para imprimir mensajes con colores
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[⚠] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
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

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    }
    catch {
        return $false
    }
}

# Función para verificar si un proceso está corriendo
function Test-Process {
    param([string]$ProcessName)
    $process = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    return $process -ne $null
}

echo "🔍 Verificación del Sistema - Aplicación de Notas"
echo "=================================================="
echo ""

# Verificar sistema operativo
Write-Status "Sistema operativo: $($env:OS)"
Write-Status "Arquitectura: $($env:PROCESSOR_ARCHITECTURE)"
Write-Status "PowerShell versión: $($PSVersionTable.PSVersion)"
echo ""

# Verificar Node.js
Write-Status "Verificando Node.js..."
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Success "Node.js instalado: $nodeVersion"
    
    # Verificar versión mínima
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($nodeMajor -ge 18) {
        Write-Success "Versión de Node.js compatible (>=18)"
    }
    else {
        Write-Warning "Versión de Node.js antigua. Se recomienda >=18"
    }
}
else {
    Write-Error "Node.js no está instalado"
}
echo ""

# Verificar npm
Write-Status "Verificando npm..."
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Success "npm instalado: $npmVersion"
}
else {
    Write-Error "npm no está instalado"
}
echo ""

# Verificar MySQL
Write-Status "Verificando MySQL..."
if (Test-Command "mysql") {
    try {
        $mysqlVersion = mysql --version
        Write-Success "MySQL instalado: $($mysqlVersion.Split(' ')[2])"
        
        # Verificar si MySQL está corriendo
        if (Test-Process "mysqld") {
            Write-Success "MySQL está corriendo"
        }
        else {
            Write-Warning "MySQL no está corriendo"
        }
    }
    catch {
        Write-Warning "MySQL instalado pero no accesible desde línea de comandos"
    }
}
else {
    Write-Error "MySQL no está instalado"
}
echo ""

# Verificar estructura del proyecto
Write-Status "Verificando estructura del proyecto..."
if ((Test-Path "package.json") -and (Test-Path "backend") -and (Test-Path "frontend")) {
    Write-Success "Estructura del proyecto correcta"
}
else {
    Write-Error "Estructura del proyecto incorrecta"
    Write-Status "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
}
echo ""

# Verificar archivos de configuración
Write-Status "Verificando archivos de configuración..."

if (Test-Path "backend/package.json") {
    Write-Success "backend/package.json encontrado"
}
else {
    Write-Error "backend/package.json no encontrado"
}

if (Test-Path "frontend/package.json") {
    Write-Success "frontend/package.json encontrado"
}
else {
    Write-Error "frontend/package.json no encontrado"
}

if (Test-Path "backend/prisma/schema.prisma") {
    Write-Success "Schema de Prisma encontrado"
}
else {
    Write-Error "Schema de Prisma no encontrado"
}

if (Test-Path "backend/.env") {
    Write-Success "Archivo .env encontrado"
}
else {
    Write-Warning "Archivo .env no encontrado (se creará automáticamente)"
}
echo ""

# Verificar dependencias instaladas
Write-Status "Verificando dependencias instaladas..."

if (Test-Path "backend/node_modules") {
    Write-Success "Dependencias del backend instaladas"
}
else {
    Write-Warning "Dependencias del backend no instaladas"
}

if (Test-Path "frontend/node_modules") {
    Write-Success "Dependencias del frontend instaladas"
}
else {
    Write-Warning "Dependencias del frontend no instaladas"
}
echo ""

# Verificar puertos
Write-Status "Verificando puertos..."

if (Test-Port 5000) {
    Write-Warning "Puerto 5000 está en uso"
}
else {
    Write-Success "Puerto 5000 disponible"
}

if (Test-Port 5173) {
    Write-Warning "Puerto 5173 está en uso"
}
else {
    Write-Success "Puerto 5173 disponible"
}
echo ""

# Verificar conexión a base de datos
Write-Status "Verificando conexión a base de datos..."
try {
    $mysqlTest = mysql -u root -e "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Conexión a MySQL exitosa"
        
        # Verificar si la base de datos existe
        $dbTest = mysql -u root -e "USE notesapp;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Base de datos 'notesapp' existe"
        }
        else {
            Write-Warning "Base de datos 'notesapp' no existe (se creará automáticamente)"
        }
    }
    else {
        Write-Error "No se puede conectar a MySQL"
        Write-Status "Asegúrate de que MySQL esté corriendo y configurado correctamente"
    }
}
catch {
    Write-Error "No se puede verificar la conexión a MySQL"
}
echo ""

# Verificación detallada si se solicita
if ($Detailed) {
    Write-Status "Verificación detallada del sistema..."
    echo ""
    
    # Información del sistema
    Write-Status "Información del sistema:"
    Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory | Format-Table -AutoSize
    
    # Procesos de Node.js
    Write-Status "Procesos de Node.js corriendo:"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Format-Table -AutoSize
    
    # Espacio en disco
    Write-Status "Espacio en disco:"
    Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}} | Format-Table -AutoSize
}
echo ""

# Resumen
echo "📊 Resumen de la Verificación"
echo "=============================="

$totalChecks = 0
$passedChecks = 0

# Contar checks
if (Test-Command "node") { $passedChecks++ }; $totalChecks++
if (Test-Command "npm") { $passedChecks++ }; $totalChecks++
if (Test-Command "mysql") { $passedChecks++ }; $totalChecks++
if ((Test-Path "package.json") -and (Test-Path "backend") -and (Test-Path "frontend")) { $passedChecks++ }; $totalChecks++

Write-Host "Checks pasados: $passedChecks/$totalChecks" -ForegroundColor Cyan

if ($passedChecks -eq $totalChecks) {
    Write-Success "¡Sistema listo para ejecutar la aplicación!"
    echo ""
    Write-Status "Para iniciar la aplicación, ejecuta: .\start.ps1"
}
else {
    Write-Warning "Algunos checks fallaron. Revisa los errores arriba."
    echo ""
    Write-Status "Para instalar dependencias faltantes, ejecuta: .\start.ps1"
}

echo ""
echo "🔧 Comandos útiles:"
echo "  .\start.ps1          - Iniciar aplicación completa"
echo "  .\check-system.ps1   - Verificar sistema (este script)"
echo "  .\check-system.ps1 -Detailed  - Verificación detallada"
echo "  cd backend; npm start  - Solo backend"
echo "  cd frontend; npm run dev  - Solo frontend"
