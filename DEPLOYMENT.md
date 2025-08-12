# Deployment Guide

## Overview

This guide covers the deployment strategy, security measures, privacy compliance, and operational procedures for the AI-Powered Resume Builder. The system is designed with a Docker-first approach for initial deployment, with cloud migration capabilities for future scaling.

## Deployment Strategy

### Phase 1: Initial Docker Deployment

#### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Docker Host   │    │   Data Layer    │
│    (nginx)      │───▶│   Application   │───▶│  (PostgreSQL,   │
│                 │    │   Containers    │    │   Redis, S3)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Container Structure
```yaml
# docker-compose.yml - JavaScript-First Stack
services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.react
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
      - NODE_ENV=production
    volumes:
      - ./frontend:/app
      - /app/node_modules
  
  backend:
    build:
      context: ./backend  
      dockerfile: Dockerfile.nodejs
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/resumebuilder
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=resumebuilder
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
  
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### JavaScript-Specific Dockerfiles

**Frontend Dockerfile (Dockerfile.react):**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile (Dockerfile.nodejs):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000
CMD ["node", "dist/index.js"]
```

#### Deployment Commands
```bash
# Initial setup
docker-compose up -d

# Health check
docker-compose ps

# Logs monitoring
docker-compose logs -f

# Updates
docker-compose pull
docker-compose up -d
```

### Phase 2: Cloud Migration Strategy

#### Target Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/WAF       │    │  Kubernetes     │    │  Managed        │
│   (CloudFlare)  │───▶│  Cluster        │───▶│  Services       │
│                 │    │  (EKS/GKE/AKS)  │    │  (RDS/ElastiCache)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Cloud Provider Options

**AWS Deployment:**
- **Compute**: EKS (Kubernetes), ECS (Containers), or EC2
- **Database**: RDS PostgreSQL with Multi-AZ
- **Cache**: ElastiCache Redis
- **Storage**: S3 for file storage
- **CDN**: CloudFront
- **Security**: WAF, Shield, Certificate Manager

**Google Cloud Deployment:**
- **Compute**: GKE, Cloud Run, or Compute Engine
- **Database**: Cloud SQL PostgreSQL
- **Cache**: Memorystore Redis
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Security**: Cloud Armor, SSL certificates

**Azure Deployment:**
- **Compute**: AKS, Container Instances, or Virtual Machines
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Storage**: Blob Storage
- **CDN**: Azure CDN
- **Security**: Application Gateway, SSL certificates

## Security Implementation

### Authentication & Authorization

#### JWT Token Strategy
```javascript
// Token structure
const tokenPayload = {
  userId: 'uuid',
  email: 'user@example.com',
  role: 'user',
  plan: 'premium',
  iat: 1640995200,
  exp: 1641081600 // 24 hours
}

// Refresh token rotation
const refreshTokenConfig = {
  lifetime: '7 days',
  rotation: true,
  reuseDetection: true,
  familyTracking: true
}
```

#### Role-Based Access Control (RBAC)
```yaml
roles:
  user:
    permissions:
      - read:own_profile
      - write:own_profile
      - create:resume
      - read:own_resume
      - delete:own_resume
  
  premium_user:
    inherits: user
    permissions:
      - unlimited_ai_requests
      - advanced_templates
      - priority_support
  
  admin:
    permissions:
      - read:all_profiles
      - manage:system_settings
      - view:analytics
      - manage:users
```

### Data Protection

#### Encryption Standards
**Data at Rest:**
- **Algorithm**: AES-256-GCM
- **Key Management**: Hardware Security Modules (HSM)
- **Database**: Transparent Data Encryption (TDE)
- **File Storage**: Server-side encryption with customer keys

**Data in Transit:**
- **Protocol**: TLS 1.3 minimum
- **Certificate**: Extended Validation (EV) SSL
- **Perfect Forward Secrecy**: ECDHE key exchange
- **HSTS**: HTTP Strict Transport Security enabled

#### Key Management
```javascript
// Environment-specific key rotation
const keyRotationSchedule = {
  development: '30 days',
  staging: '14 days',
  production: '7 days'
}

// Key hierarchy
const keyStructure = {
  masterKey: 'HSM-generated root key',
  dataKeys: 'Per-tenant encryption keys',
  sessionKeys: 'Per-session temporary keys'
}
```

### Network Security

#### Firewall Configuration
```bash
# Allow only necessary ports
iptables -A INPUT -p tcp --dport 443 -j ACCEPT  # HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # HTTP (redirect to HTTPS)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # SSH (admin only)
iptables -A INPUT -j DROP                        # Drop all others
```

#### API Security
```yaml
rate_limiting:
  global: 1000 requests/hour
  per_user: 100 requests/hour
  ai_endpoints: 20 requests/minute
  
cors_policy:
  allowed_origins:
    - https://resumebuilder.ai
    - https://app.resumebuilder.ai
  allowed_methods: [GET, POST, PUT, DELETE]
  allowed_headers: [Authorization, Content-Type]
  
security_headers:
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: "1; mode=block"
  Strict-Transport-Security: "max-age=31536000; includeSubDomains"
```

## Privacy & Compliance

### Data Retention Policy

#### 90-Day Retention Standard
```javascript
const retentionPolicy = {
  userActivity: {
    duration: 90, // days
    scope: ['page_views', 'feature_usage', 'ai_interactions'],
    anonymization: 'after_30_days'
  },
  
  resumeData: {
    duration: 90, // days after account deletion
    scope: ['resume_content', 'job_descriptions', 'ai_outputs'],
    encryption: 'always',
    backup: 'encrypted_offsite'
  },
  
  systemLogs: {
    duration: 365, // days (compliance requirement)
    scope: ['error_logs', 'security_events', 'audit_trails'],
    anonymization: 'immediate_pii_removal'
  }
}
```

#### Automated Data Cleanup
```javascript
// Daily cleanup job using Node.js and cron
import cron from 'node-cron';
import { db } from './database.js';
import { logger } from './logger.js';

class DataCleanupService {
  constructor() {
    // Schedule daily cleanup at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.cleanupExpiredData();
    });
  }

  async cleanupExpiredData() {
    try {
      logger.info('Starting daily data cleanup job');

      // User activity data (90 days retention)
      await this.deleteOldActivityLogs(90);
      
      // Resume data for deleted accounts (90 days retention)
      await this.deleteOrphanedResumeData(90);
      
      // Temporary files (24 hours retention)
      await this.cleanupTempFiles(24);
      
      // AI processing cache (7 days retention)
      await this.cleanupAiCache(7);
      
      // Anonymize old logs (30 days retention)
      await this.anonymizeOldLogs(30);

      logger.info('Data cleanup job completed successfully');
    } catch (error) {
      logger.error('Data cleanup job failed:', error);
    }
  }

  async deleteOldActivityLogs(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await db.query(
      'DELETE FROM activity_logs WHERE created_at < $1',
      [cutoffDate]
    );
    
    logger.info(`Deleted ${result.rowCount} old activity logs`);
  }

  async deleteOrphanedResumeData(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await db.query(`
      DELETE FROM resumes 
      WHERE user_id NOT IN (SELECT id FROM users) 
      AND updated_at < $1
    `, [cutoffDate]);
    
    logger.info(`Deleted ${result.rowCount} orphaned resume records`);
  }

  async cleanupTempFiles(hours) {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const tempDir = process.env.TEMP_DIR || '/tmp';
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    
    try {
      const files = await fs.readdir(tempDir);
      let deletedCount = 0;
      
      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }
      
      logger.info(`Deleted ${deletedCount} temporary files`);
    } catch (error) {
      logger.error('Error cleaning temp files:', error);
    }
  }

  async cleanupAiCache(days) {
    const Redis = await import('ioredis');
    const redis = new Redis.default(process.env.REDIS_URL);
    
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    const keys = await redis.keys('ai_cache:*');
    let deletedCount = 0;
    
    for (const key of keys) {
      const timestamp = await redis.hget(key, 'timestamp');
      if (timestamp && parseInt(timestamp) < cutoffTime) {
        await redis.del(key);
        deletedCount++;
      }
    }
    
    logger.info(`Deleted ${deletedCount} expired AI cache entries`);
    await redis.quit();
  }

  async anonymizeOldLogs(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await db.query(`
      UPDATE system_logs 
      SET user_id = NULL, ip_address = 'anonymized', user_agent = 'anonymized'
      WHERE created_at < $1 AND user_id IS NOT NULL
    `, [cutoffDate]);
    
    logger.info(`Anonymized ${result.rowCount} old log entries`);
  }
}

// Initialize cleanup service
const cleanupService = new DataCleanupService();
export { cleanupService };
```

### GDPR Compliance

#### Data Subject Rights Implementation
```javascript
// Right to Access
const exportUserData = async (userId) => {
  return {
    profile: await getUserProfile(userId),
    resumes: await getUserResumes(userId),
    activity: await getUserActivity(userId),
    preferences: await getUserPreferences(userId)
  }
}

// Right to Rectification
const updateUserData = async (userId, updates) => {
  // Validate updates
  // Apply changes
  // Log modification
  // Notify user
}

// Right to Erasure
const deleteUserData = async (userId) => {
  // Mark for deletion
  // Schedule cleanup
  // Anonymize logs
  // Send confirmation
}

// Right to Data Portability
const exportPortableData = async (userId) => {
  // Standard format export
  // Machine-readable format
  // Complete data set
}
```

#### Privacy by Design
- **Data Minimization**: Collect only necessary information
- **Purpose Limitation**: Use data only for stated purposes
- **Storage Limitation**: Implement retention policies
- **Transparency**: Clear privacy notices
- **User Control**: Granular privacy settings

### CCPA Compliance

#### California Consumer Rights
```yaml
ccpa_rights:
  right_to_know:
    - categories_collected
    - sources_of_information
    - business_purposes
    - third_party_sharing
  
  right_to_delete:
    - user_request_process
    - verification_requirements
    - deletion_timeline
    - confirmation_notification
  
  right_to_opt_out:
    - sale_of_information
    - targeted_advertising
    - profiling_activities
```

## Monitoring & Operations

### System Monitoring

#### Health Checks
```yaml
health_endpoints:
  application:
    endpoint: /health
    checks:
      - database_connection
      - redis_connection
      - ai_service_availability
      - disk_space
      - memory_usage
  
  ai_services:
    endpoint: /ai/health
    checks:
      - openai_api_status
      - response_time_thresholds
      - error_rate_monitoring
      - quota_usage_tracking
```

#### Alerting Configuration
```javascript
const alertingRules = {
  critical: {
    application_down: {
      condition: 'health_check_failed for 2 minutes',
      notification: ['sms', 'email', 'slack']
    },
    database_connection_lost: {
      condition: 'db_connection_errors > 5 in 1 minute',
      notification: ['sms', 'pagerduty']
    }
  },
  
  warning: {
    high_response_time: {
      condition: 'avg_response_time > 3s for 5 minutes',
      notification: ['email', 'slack']
    },
    ai_quota_warning: {
      condition: 'ai_quota_usage > 80%',
      notification: ['email']
    }
  }
}
```

### Performance Monitoring

#### Metrics Collection
```yaml
metrics:
  application:
    - request_duration_histogram
    - request_rate_counter
    - error_rate_counter
    - active_users_gauge
  
  ai_services:
    - ai_request_duration
    - ai_success_rate
    - ai_quota_usage
    - ai_cost_tracking
  
  infrastructure:
    - cpu_usage_percentage
    - memory_usage_percentage
    - disk_usage_percentage
    - network_throughput
```

#### Log Management
```javascript
const loggingConfig = {
  format: 'json',
  levels: ['error', 'warn', 'info', 'debug'],
  
  fields: {
    timestamp: 'ISO 8601',
    requestId: 'UUID',
    userId: 'hashed',
    action: 'string',
    duration: 'milliseconds',
    statusCode: 'number'
  },
  
  destinations: [
    'stdout', // Container logs
    'elasticsearch', // Centralized logging
    'file' // Local backup
  ]
}
```

### Backup & Recovery

#### Backup Strategy
```yaml
backup_schedule:
  database:
    frequency: 'every 6 hours'
    retention: '30 days'
    encryption: 'AES-256'
    verification: 'daily'
  
  user_files:
    frequency: 'every 4 hours'
    retention: '90 days'
    incremental: true
    cross_region: true
  
  configuration:
    frequency: 'on change'
    retention: '1 year'
    versioning: true
```

#### Disaster Recovery
```yaml
recovery_objectives:
  RTO: 4 hours  # Recovery Time Objective
  RPO: 1 hour   # Recovery Point Objective
  
recovery_procedures:
  database:
    primary_failure: 'automatic_failover_to_standby'
    data_corruption: 'point_in_time_recovery'
    complete_loss: 'restore_from_backup'
  
  application:
    service_failure: 'container_restart'
    node_failure: 'traffic_redirect'
    region_failure: 'cross_region_failover'
```

### Scaling Strategy

#### Auto-scaling Configuration
```yaml
scaling_rules:
  horizontal:
    trigger: 'cpu_usage > 70% for 5 minutes'
    scale_up: 'add 2 instances'
    scale_down: 'remove 1 instance when cpu < 30% for 10 minutes'
    max_instances: 20
    min_instances: 2
  
  vertical:
    trigger: 'memory_usage > 85% for 3 minutes'
    action: 'increase memory allocation'
    limits: 'max 8GB per container'
```

#### Load Balancing
```nginx
upstream backend {
    least_conn;
    server backend1:5000 weight=3;
    server backend2:5000 weight=3;
    server backend3:5000 weight=2;
    
    keepalive 32;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Operational Procedures

### Deployment Process

#### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Security scan
        run: npm audit
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker images
        run: docker build -t resumebuilder:${{ github.sha }} .
      - name: Push to registry
        run: docker push resumebuilder:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/resumebuilder \
            app=resumebuilder:${{ github.sha }}
          kubectl rollout status deployment/resumebuilder
```

#### Release Management
```javascript
const releaseProcess = {
  phases: [
    'code_freeze',
    'testing_validation',
    'staging_deployment',
    'production_deployment',
    'monitoring_verification'
  ],
  
  rollback_triggers: [
    'error_rate > 5%',
    'response_time > 5s',
    'user_complaints > 10',
    'critical_functionality_broken'
  ],
  
  rollback_procedure: [
    'stop_new_deployments',
    'revert_to_previous_version',
    'verify_system_health',
    'notify_stakeholders'
  ]
}
```

### Incident Response

#### Incident Classification
```yaml
severity_levels:
  P1_critical:
    description: "System completely down or major security breach"
    response_time: "5 minutes"
    escalation: "immediate"
  
  P2_high:
    description: "Core functionality impaired"
    response_time: "30 minutes"
    escalation: "1 hour"
  
  P3_medium:
    description: "Non-core functionality affected"
    response_time: "2 hours"
    escalation: "4 hours"
  
  P4_low:
    description: "Minor issues or feature requests"
    response_time: "next business day"
    escalation: "weekly review"
```

#### Response Procedures
1. **Detection**: Automated alerts or user reports
2. **Assessment**: Determine severity and impact
3. **Response**: Immediate action to restore service
4. **Communication**: Update stakeholders and users
5. **Resolution**: Implement permanent fix
6. **Post-mortem**: Document lessons learned

### Maintenance Windows

#### Scheduled Maintenance
```yaml
maintenance_schedule:
  security_updates:
    frequency: "monthly"
    window: "Sunday 02:00-04:00 UTC"
    duration: "2 hours maximum"
  
  database_maintenance:
    frequency: "quarterly"
    window: "Sunday 01:00-05:00 UTC"
    duration: "4 hours maximum"
  
  infrastructure_updates:
    frequency: "as needed"
    window: "negotiated with stakeholders"
    duration: "varies"
```

#### Emergency Maintenance
- **Authorization**: CTO or designated on-call engineer
- **Notification**: Minimum 30 minutes advance notice
- **Duration**: Maximum 2 hours without additional approval
- **Communication**: Real-time status updates