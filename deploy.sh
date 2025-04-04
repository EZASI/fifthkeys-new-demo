#!/bin/bash

# FifthKeys Platform Deployment Script
# This script deploys the FifthKeys platform to a production environment

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

# Configuration
APP_NAME="fifthkeys"
DEPLOY_DIR="/home/ubuntu/fifthkeys"
LOG_DIR="${DEPLOY_DIR}/logs"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_DIR="${DEPLOY_DIR}/backups/${TIMESTAMP}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print section header
print_header() {
  echo -e "\n${YELLOW}=== $1 ===${NC}\n"
}

# Print success message
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Print error message
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Create necessary directories
create_directories() {
  print_header "Creating directories"
  
  mkdir -p ${LOG_DIR}
  mkdir -p ${BACKUP_DIR}
  
  print_success "Directories created"
}

# Backup existing deployment
backup_existing() {
  print_header "Backing up existing deployment"
  
  if [ -d "${DEPLOY_DIR}/backend" ]; then
    cp -r ${DEPLOY_DIR}/backend ${BACKUP_DIR}/
    print_success "Backend backed up"
  fi
  
  if [ -d "${DEPLOY_DIR}/frontend/build" ]; then
    cp -r ${DEPLOY_DIR}/frontend/build ${BACKUP_DIR}/
    print_success "Frontend backed up"
  fi
  
  if [ -f "${DEPLOY_DIR}/package.json" ]; then
    cp ${DEPLOY_DIR}/package.json ${BACKUP_DIR}/
    print_success "Package.json backed up"
  fi
  
  print_success "Backup completed at ${BACKUP_DIR}"
}

# Install dependencies
install_dependencies() {
  print_header "Installing dependencies"
  
  cd ${DEPLOY_DIR}
  npm install --production
  
  print_success "Dependencies installed"
}

# Build frontend
build_frontend() {
  print_header "Building frontend"
  
  cd ${DEPLOY_DIR}/frontend
  npm install
  npm run build
  
  print_success "Frontend built"
}

# Configure database
configure_database() {
  print_header "Configuring database"
  
  # Check if MongoDB is installed
  if ! command -v mongod &> /dev/null; then
    print_error "MongoDB is not installed"
    exit 1
  fi
  
  # Check if MongoDB is running
  if ! pgrep -x mongod > /dev/null; then
    print_error "MongoDB is not running"
    exit 1
  fi
  
  print_success "Database configured"
}

# Configure environment
configure_environment() {
  print_header "Configuring environment"
  
  # Create .env file if it doesn't exist
  if [ ! -f "${DEPLOY_DIR}/.env" ]; then
    cat > ${DEPLOY_DIR}/.env << EOF
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/fifthkeys
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)
CORS_ORIGIN=*
LOG_LEVEL=info
SSL_ENABLED=false
EOF
    print_success "Environment file created"
  else
    print_success "Environment file already exists"
  fi
}

# Start application
start_application() {
  print_header "Starting application"
  
  cd ${DEPLOY_DIR}
  
  # Check if PM2 is installed
  if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Installing..."
    npm install -g pm2
  fi
  
  # Stop existing instance if running
  pm2 stop ${APP_NAME} 2>/dev/null || true
  
  # Start application with PM2
  pm2 start backend/index.js --name ${APP_NAME} --log ${LOG_DIR}/app.log
  
  # Save PM2 configuration
  pm2 save
  
  print_success "Application started"
  
  # Display application status
  pm2 status ${APP_NAME}
}

# Configure Nginx (if available)
configure_nginx() {
  print_header "Configuring Nginx"
  
  # Check if Nginx is installed
  if ! command -v nginx &> /dev/null; then
    print_error "Nginx is not installed. Skipping..."
    return
  fi
  
  # Create Nginx configuration
  cat > /tmp/fifthkeys.conf << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
  
  # Move configuration to Nginx directory
  sudo mv /tmp/fifthkeys.conf /etc/nginx/sites-available/fifthkeys.conf
  
  # Create symbolic link
  sudo ln -sf /etc/nginx/sites-available/fifthkeys.conf /etc/nginx/sites-enabled/
  
  # Test Nginx configuration
  sudo nginx -t
  
  # Reload Nginx
  sudo systemctl reload nginx
  
  print_success "Nginx configured"
}

# Display deployment information
display_info() {
  print_header "Deployment Information"
  
  echo "Application: ${APP_NAME}"
  echo "Deployment Directory: ${DEPLOY_DIR}"
  echo "Logs Directory: ${LOG_DIR}"
  echo "Backup Directory: ${BACKUP_DIR}"
  
  # Get server IP
  SERVER_IP=$(hostname -I | awk '{print $1}')
  echo "Server IP: ${SERVER_IP}"
  
  echo -e "\n${GREEN}FifthKeys platform has been deployed successfully!${NC}"
  echo -e "You can access the application at: http://${SERVER_IP}"
  echo -e "API is available at: http://${SERVER_IP}/api"
}

# Main deployment process
main() {
  print_header "Starting FifthKeys Platform Deployment"
  
  create_directories
  backup_existing
  configure_environment
  install_dependencies
  build_frontend
  configure_database
  start_application
  configure_nginx
  display_info
  
  print_header "Deployment Completed"
}

# Execute main function
main
