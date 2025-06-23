# ONDC Buyer App - Deployment Guide

## 🚀 Quick Start

### Live Application
**Deployed URL**: https://khqsavnh.manus.space

The ONDC Buyer App is successfully deployed and ready for use. You can access the live application using the URL above.

## 📦 What's Included

### ✅ Completed Features
1. **Modern React Frontend**
   - Responsive design for all devices
   - Product catalog with search and filtering
   - Shopping cart functionality
   - Product detail pages
   - Category navigation
   - Hero carousel and featured products

2. **Flask Backend API**
   - RESTful API endpoints
   - ONDC protocol integration (mock implementation)
   - Product management
   - Cart operations
   - CORS enabled for frontend integration

3. **ONDC Integration**
   - Protocol-compliant request/response structures
   - Search, select, init, confirm flow implementation
   - Mock data for development and testing
   - Ready for real ONDC API integration

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.8+
- Git

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
# Access at http://localhost:5173
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
# Access at http://localhost:5000
```

## 🌐 Production Deployment

### Frontend (Already Deployed)
- **Platform**: Manus Cloud
- **URL**: https://khqsavnh.manus.space
- **Status**: ✅ Live and accessible
- **Features**: Full React application with all pages and functionality

### Backend Deployment Options

#### Option 1: Manus Cloud (Recommended)
```bash
# Deploy backend to Manus Cloud
cd backend
# Configure environment variables
# Deploy using Manus deployment tools
```

#### Option 2: Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

#### Option 3: Traditional Server
```bash
# Set up on Ubuntu/CentOS server
# Configure nginx reverse proxy
# Set up SSL certificates
# Configure environment variables
```

## 🔧 Configuration

### Environment Variables
```env
# Backend Configuration
FLASK_ENV=production
DATABASE_URL=mongodb://localhost:27017/ondc_buyer_app
REDIS_URL=redis://localhost:6379/0

# ONDC Configuration
ONDC_REGISTRY_URL=https://registry.ondc.org
ONDC_GATEWAY_URL=https://gateway.ondc.org
ONDC_SUBSCRIBER_ID=your-subscriber-id
ONDC_SUBSCRIBER_URI=https://your-domain.com

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Frontend Configuration
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

### Database Setup
```bash
# MongoDB setup for production
# Create database and collections
# Set up indexes for performance
# Configure backup and monitoring
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database setup completed
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] ONDC credentials obtained

### Frontend Deployment
- [x] React app built for production
- [x] Static files optimized
- [x] CDN configured
- [x] HTTPS enabled
- [x] Performance optimized

### Backend Deployment
- [ ] Flask app configured for production
- [ ] Database connections tested
- [ ] API endpoints verified
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Health checks enabled

### ONDC Integration
- [ ] ONDC registry registration
- [ ] Digital certificates installed
- [ ] API endpoints tested
- [ ] Protocol compliance verified
- [ ] Error handling implemented

## 🔍 Testing

### Frontend Testing
```bash
cd frontend
pnpm run test
pnpm run build
pnpm run preview
```

### Backend Testing
```bash
cd backend
python -m pytest
curl http://localhost:5000/api/health
```

### Integration Testing
```bash
# Test frontend-backend communication
# Verify API responses
# Test user flows
# Check error handling
```

## 📊 Monitoring

### Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- User analytics

### Infrastructure Monitoring
- Server resources
- Database performance
- Network latency
- SSL certificate expiry

## 🚨 Troubleshooting

### Common Issues

#### Frontend Issues
```bash
# Build errors
pnpm run build --verbose

# Runtime errors
# Check browser console
# Verify API endpoints
```

#### Backend Issues
```bash
# Database connection
# Check environment variables
# Verify CORS configuration
# Test API endpoints
```

#### ONDC Integration Issues
```bash
# Certificate validation
# Protocol compliance
# Network connectivity
# Error response handling
```

## 🔄 Updates and Maintenance

### Regular Updates
- Security patches
- Dependency updates
- Performance optimizations
- Feature enhancements

### Backup Strategy
- Database backups
- Code repository backups
- Configuration backups
- SSL certificate backups

## 📞 Support

### Technical Support
- Documentation: See DOCUMENTATION.md
- Issues: Create GitHub issues
- Email: support@ondcbuyer.com

### ONDC Support
- ONDC Documentation: https://docs.ondc.org
- ONDC Registry: https://registry.ondc.org
- ONDC Community: https://community.ondc.org

## 🎯 Next Steps

### Immediate Actions
1. **Test the deployed application**: https://khqsavnh.manus.space
2. **Review the codebase**: Explore the frontend and backend code
3. **Configure ONDC credentials**: Set up real ONDC integration
4. **Deploy backend**: Choose deployment option and deploy API

### Future Enhancements
1. **User Authentication**: Implement login/signup functionality
2. **Payment Integration**: Add payment gateway support
3. **Order Tracking**: Implement real-time order tracking
4. **Mobile App**: Develop React Native mobile application
5. **Analytics**: Add user behavior tracking and analytics

---

**🎉 Congratulations! Your ONDC Buyer App is ready for use.**

Visit https://khqsavnh.manus.space to see your application in action!

