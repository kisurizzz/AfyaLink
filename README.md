# AfyaLink - Healthcare Management System

AfyaLink is a comprehensive healthcare management system designed to streamline patient and program management for healthcare providers. The system facilitates efficient client registration, program management, and enrollment tracking.

## Live Demo

- Frontend: [https://afya-link1.vercel.app](https://afya-link1.vercel.app)
- Backend API: [https://afyalinkbackend.onrender.com](https://afyalinkbackend.onrender.com)

## Features

- **User Management**
  - Secure authentication system
  - Role-based access control
  - User profile management

- **Client Management**
  - Patient registration and profile management
  - Search and filter capabilities
  - Detailed client information tracking

- **Program Management**
  - Create and manage health programs
  - Track program duration and status
  - Program enrollment management

- **Enrollment System**
  - Program enrollment tracking
  - Status monitoring
  - Enrollment history

## Technology Stack

### Frontend
- React/Next.js
- Material-UI
- Modern JavaScript (ES6+)
- Deployed on Vercel

### Backend
- Flask (Python)
- SQLAlchemy
- JWT Authentication
- Deployed on Render

### Database
- PostgreSQL (Production)
- SQLite (Development)

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/kisurizzz/AfyaLink.git
cd afyalink
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies:
```bash
cd server/health_system
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create a .env file in server/health_system
JWT_SECRET_KEY=your_secret_key_here
DATABASE_URI=your_database_uri_here
```

5. Initialize the database:
```bash
flask db upgrade
```

6. Run the backend server:
```bash
python app.py
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
afyalink/
├── client/                 # Frontend application
│   ├── app/               # Next.js application
│   ├── src/               # Source files
│   └── public/            # Static files
│
├── server/                # Backend application
│   └── health_system/     # Flask application
│       ├── models.py      # Database models
│       ├── routes/        # API routes
│       └── app.py         # Main application file
│
└── README.md             # Project documentation
```

## API Documentation

### Authentication Endpoints
- `POST /api/doctors/login` - User login
- `POST /api/doctors/logout` - User logout

### Client Endpoints
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/<id>` - Get client details
- `PUT /api/clients/<id>` - Update client
- `DELETE /api/clients/<id>` - Delete client

### Program Endpoints
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create new program
- `GET /api/programs/<id>` - Get program details
- `PUT /api/programs/<id>` - Update program
- `DELETE /api/programs/<id>` - Delete program

### Enrollment Endpoints
- `POST /api/enrollments` - Create enrollment
- `DELETE /api/enrollments/<client_id>/<program_id>` - Remove enrollment

## Security Features

- JWT-based authentication
- Password hashing
- Role-based access control
- API endpoint protection
- Data validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the frontend components
- Flask and SQLAlchemy for the backend framework
- Next.js for the frontend framework
- Vercel for frontend hosting
- Render for backend hosting
- PostgreSQL for database hosting

## Contact

Your Name - arnoldkisuri7@gmail.com
Project Link: [https://github.com/kisurizzz/AfyaLink](https://github.com/kisurizzz/afyalink)
