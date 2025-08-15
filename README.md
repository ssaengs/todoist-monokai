# Todo List Application

A comprehensive todo list application built with Next.js, MongoDB, and TypeScript. Features include drag-and-drop sorting, priority levels, notes, media attachments, and a modern UI.

## Features

- ✅ **Single Page Application** - Clean, modern interface
- ✅ **Drag & Drop Sorting** - Reorder todos with beautiful animations
- ✅ **Priority System** - 5-level priority scale (1-5) with color coding
- ✅ **Click to Move** - Click any todo to move it to the bottom
- ✅ **Rich Content** - Add notes and media attachments to todos
- ✅ **Persistent Storage** - MongoDB database for data persistence
- ✅ **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Drag & Drop**: react-beautiful-dnd
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - MongoDB will be available at `mongodb://localhost:27017`

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your MongoDB connection string
   ```

3. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or install MongoDB locally
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`

## Usage

### Adding Todos
1. Type a todo title in the input field
2. Click the input to expand and set priority (1-5)
3. Click "Add" to create the todo

### Managing Todos
- **Drag & Drop**: Use the grip handle to reorder todos
- **Click Title**: Click any todo title to move it to the bottom
- **Complete**: Click the checkbox to mark as complete
- **Edit**: Click the edit icon to modify title and notes
- **Delete**: Click the trash icon to remove a todo

### Adding Details
1. Click "Show details" on any todo
2. **Priority**: Change priority level (1-5)
3. **Notes**: Add text notes and descriptions
4. **Media**: Add URLs for images, videos, or other media

### Priority Levels
- **1 (Red)**: Lowest priority
- **2 (Orange)**: Low priority  
- **3 (Yellow)**: Medium priority
- **4 (Blue)**: High priority
- **5 (Green)**: Highest priority

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo
- `POST /api/todos/reorder` - Reorder todos

## Database Schema

```typescript
interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  priority: number; // 1-5
  notes: string;
  media: string[]; // URLs
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── AddTodoForm.tsx    # Add todo form
│   └── TodoItem.tsx       # Individual todo item
├── lib/                   # Utility functions
│   └── mongodb.ts         # Database connection
├── models/                # Database models
│   └── Todo.ts            # Todo model
├── docker-compose.yml     # Docker setup
├── Dockerfile             # Container configuration
└── package.json           # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
