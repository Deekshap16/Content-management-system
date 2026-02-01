![Featured AI Assistant](https://github.com/Deekshap16/Content-management-system/blob/3440179be261b3ffa0ea32ec244da30a1d802c6d/Screenshot%202026-02-01%20102541.png)
# Content Management System

A full-stack content management system built with Node.js, Express, MongoDB, React, and Vite. This application allows users to create, manage, and publish content with a rich text editor, user authentication, and role-based access control.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Role-Based Access Control**: Admin and Editor roles with different permissions
- **Content Creation**: Rich text editor powered by CKEditor for creating posts
- **Post Management**: Create, edit, delete, and view posts with slugs, excerpts, and featured images
- **File Uploads**: Support for uploading featured images (with AWS S3 integration)
- **Dashboard**: User dashboard to manage posts
- **Responsive Design**: Modern, responsive frontend built with React

## Tech Stack

### Backend
- **Node.js** with **Express.js** for the server
- **MongoDB** with **Mongoose** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **AWS SDK** for cloud storage
- **CORS** for cross-origin requests
- **Express Validator** for input validation

### Frontend
- **React** with **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **CKEditor** for rich text editing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- AWS S3 bucket (optional, for file uploads)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd content-management-system
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/cms
   JWT_SECRET=your_jwt_secret_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   ```

5. **Start MongoDB:**
   Make sure MongoDB is running on your system or update `MONGO_URI` for a cloud instance.

## Usage

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port)

3. **Access the Application:**
   - Open your browser and go to `http://localhost:5173`
   - Register a new account or login
   - Create and manage your content

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
content-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Editor.jsx
│   │   ├── pages/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
