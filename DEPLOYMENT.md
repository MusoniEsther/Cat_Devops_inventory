# Deployment Guide - Inventory Management System

## Phase 6: Deployment Architecture

### Resource Requirements

#### Per Pod
- **CPU Request:** 250m (0.25 CPU cores)
- **CPU Limit:** 500m (0.5 CPU cores)
- **Memory Request:** 256Mi
- **Memory Limit:** 512Mi

#### Cluster Minimum (3 Node Cluster)
- **Total CPU Required:** 2.5 cores (3 replicas × 250m + buffer)
- **Total Memory Required:** 3Gi (3 replicas × 512Mi + buffer)

### Deployment Strategies

#### Rolling Update (Default)
- **maxSurge:** 1 pod
- **maxUnavailable:** 0 pods
- Zero downtime deployments
- Gradual rollout of new versions

#### Autoscaling
- **Min Replicas:** 2 pods
- **Max Replicas:** 10 pods
- **Scale Up Trigger:** CPU > 70% or Memory > 80%
- **Scale Down Wait:** 5 minutes

### Health Checks

#### Liveness Probe
- **Endpoint:** `/health`
- **Initial Delay:** 30 seconds
- **Period:** 10 seconds
- **Timeout:** 5 seconds
- **Failure Threshold:** 3 attempts

#### Readiness Probe
- **Endpoint:** `/health`
- **Initial Delay:** 5 seconds
- **Period:** 5 seconds
- **Timeout:** 3 seconds
- **Failure Threshold:** 2 attempts

## Deployment Steps

### Prerequisites
1. Kubernetes cluster (1.19+)
2. kubectl configured
3. Sufficient cluster resources

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Configure autoscaling
kubectl apply -f k8s/hpa.yaml
```

### Verify Deployment

```bash
# Check deployment status
kubectl rollout status deployment/inventory-system

# Get pods
kubectl get pods -l app=inventory-system

# Get service
kubectl get svc inventory-system

# View logs
kubectl logs -f deployment/inventory-system
```

## Scaling

### Manual Scaling
```bash
kubectl scale deployment inventory-system --replicas=5
```

### Autoscaling Status
```bash
kubectl get hpa inventory-system
kubectl describe hpa inventory-system
```

## Blue-Green Deployment

### Deploy Green Version
```bash
kubectl set image deployment/inventory-system \
  inventory-system=node:18-alpine:v2.0.0
```

### Verify Green
```bash
kubectl rollout status deployment/inventory-system
```

### Rollback if Needed
```bash
kubectl rollout undo deployment/inventory-system
```

## Monitoring

### Check Resource Usage
```bash
kubectl top nodes
kubectl top pods
```

### View Events
```bash
kubectl describe deployment inventory-system
kubectl describe nodes
```

## Troubleshooting

### Pod Stuck in Pending
```bash
kubectl describe pod <pod-name>
```

### Pod CrashLoopBackOff
```bash
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
```

### Service Not Accessible
```bash
kubectl describe svc inventory-system
kubectl port-forward svc/inventory-system 3000:80
```

## GitHub Actions Deployment

Automatic deployment is triggered by:
1. Push to main branch (staging)
2. Git tag v*.*.* (production)
3. Manual workflow dispatch

Configure Kubernetes credentials:
```bash
cat ~/.kube/config | base64 | tr -d '\n'
```

Add as `KUBE_CONFIG` secret in GitHub repository settings.
