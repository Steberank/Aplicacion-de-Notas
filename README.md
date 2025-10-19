# Notes Application

A complete web application for managing notes with tags, colors, archiving, and pinning features. Includes React frontend and Node.js backend with Prisma and MySQL.

## Quick Start

### Option 1: Automatic Script

**For Linux/macOS:**

```bash
# Check system first (optional)
./check-system.sh

# Start application
./start.sh
```

**For Windows (PowerShell):**

```powershell
# Check system first (optional)
.\check-system.ps1

# Start application
.\start.ps1
```

### Option 2: Manual Installation

1. **Install system dependencies:**

   - Node.js 18+
   - MySQL 8.0+
   - npm

2. **Configure database:**

   ```sql
   CREATE DATABASE notesapp;
   ```

3. **Install dependencies:**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**

   ```bash
   # Create backend/.env file
   DATABASE_URL="mysql://root:@localhost:3306/notesapp"
   PORT=5000
   NODE_ENV=development
   ```

5. **Configure Prisma:**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Run application:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Features

### Main Functionality

- **Create notes** with title and content
- **Edit existing** notes
- **Delete notes** with confirmation
- **Archive/unarchive** notes
- **Pin/unpin** important notes
- **Change colors** randomly
- **Manage tags** (create, delete, assign)
- **Smart search** with Fuse.js
- **Filtering** by tags and status

### User Interface

- **Responsive design** and modern
- **Sidebar** with search and navigation
- **Notes grid** organized
- **Pinned notes** at the top
- **Edit popup** with overlay
- **Integrated tag management**

### Technologies

**Frontend:**

- React 18
- Vite
- CSS3 (Flexbox/Grid)
- Fuse.js (search)
- Custom Hooks

**Backend:**

- Node.js
- Express.js
- Prisma ORM
- MySQL
- CORS

## Database

### Prisma Schema

```prisma
model Nota {
  id            Int      @id @default(autoincrement())
  titulo        String
  contenido     String
  color         String   @default("#FFE4B5")
  estaArchivado Boolean  @default(false)
  estaFijado    Boolean  @default(false)
  creadoEn      DateTime @default(now())
  editadoEn     DateTime @updatedAt
  etiquetas     NotaEtiqueta[]
}

model Etiqueta {
  id       Int            @id @default(autoincrement())
  texto    String         @unique
  color    String         @default("#E0E0E0")
  creadoEn DateTime       @default(now())
  notas    NotaEtiqueta[]
}

model NotaEtiqueta {
  notaId     Int
  etiquetaId Int
  nota       Nota     @relation(fields: [notaId], references: [id], onDelete: Cascade)
  etiqueta   Etiqueta @relation(fields: [etiquetaId], references: [id], onDelete: Cascade)

  @@id([notaId, etiquetaId])
}
```

## API Endpoints

### Notes

- `GET /api/notas` - Get all notes
- `GET /api/notas/:id` - Get note by ID
- `POST /api/notas` - Create new note
- `PUT /api/notas/:id` - Update note
- `DELETE /api/notas/:id` - Delete note
- `PATCH /api/notas/:id/fijar` - Pin/unpin note
- `PATCH /api/notas/:id/archivar` - Archive/unarchive note
- `PATCH /api/notas/:id/cambiar-color` - Change color
- `POST /api/notas/:id/etiquetas` - Add tag
- `DELETE /api/notas/:id/etiquetas/:etiquetaId` - Remove tag

### Tags

- `GET /api/etiquetas` - Get all tags
- `POST /api/etiquetas` - Create new tag
- `DELETE /api/etiquetas/:id` - Delete tag

## Available Scripts

### Automatic Startup Script

```bash
# Linux/macOS
./start.sh

# Windows
.\start.ps1
```

### Manual Scripts

```bash
# Backend
cd backend
npm start          # Start server
npm run dev        # Development mode
npx prisma studio  # Database interface

# Frontend
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
```

## Advanced Configuration

### Environment Variables

**Backend (.env):**

```env
DATABASE_URL="mysql://user:password@host:port/database"
PORT=5000
NODE_ENV=development
```

### Customization

1. **Note colors:** Modify array in `NotaEditable.jsx`
2. **Tag colors:** Modify array in `MenuEtiquetas.jsx`
3. **Search configuration:** Adjust parameters in `Sidebar.jsx`

## Troubleshooting

### MySQL Connection Error

```bash
# Verify MySQL is running
mysql -u root -p

# Create database
CREATE DATABASE notesapp;
```

### Prisma Error

```bash
cd backend
npx prisma generate
npx prisma db push
```

### Port in Use

```bash
# Change port in backend/.env
PORT=3001
```

## License

This project is open source and available under the MIT license.
