# ONDC Buyer App

A modern buyer application for the Open Network for Digital Commerce (ONDC) that enables users to discover, search, and purchase products from various sellers on the ONDC network.

## Features

- **Product Discovery**: Browse and search products from multiple ONDC sellers
- **Multi-Seller Cart**: Add products from different sellers to a unified cart
- **Real-time Order Tracking**: Track orders with live updates
- **Secure Payments**: Multiple payment options with secure processing
- **User Management**: Account creation, profile management, and order history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Architecture

The application follows a microservices architecture with:

- **Frontend**: React.js with TypeScript, Tailwind CSS, and modern UI components
- **Backend**: Flask API server with ONDC protocol integration
- **Database**: SQLite for development, MongoDB for production
- **Cache**: Redis for session management and caching
- **ONDC Integration**: Full compliance with ONDC API specifications

## Project Structure

```
ondc-buyer-app/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
├── backend/                 # Flask backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic services
│   │   └── main.py         # Application entry point
│   └── requirements.txt
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── design-references/      # UI/UX design references
└── docker-compose.yml      # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.8+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ondc-buyer-app
```

2. Set up the frontend:
```bash
cd frontend
pnpm install
pnpm run dev
```

3. Set up the backend:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Development

### Frontend Development
- Built with React.js 18+ and TypeScript
- Styled with Tailwind CSS and shadcn/ui components
- State management with Redux Toolkit
- Routing with React Router
- Icons from Lucide React

### Backend Development
- Flask web framework with RESTful APIs
- SQLAlchemy for database operations
- JWT authentication
- CORS enabled for frontend integration
- ONDC protocol integration

### ONDC Integration

The app integrates with ONDC APIs for:
- Product catalog search and discovery
- Order management and tracking
- Payment processing
- Seller communication
- Logistics coordination

## API Documentation

API documentation is available at `/api/docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

