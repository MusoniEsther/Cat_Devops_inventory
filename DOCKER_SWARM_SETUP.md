# Docker Swarm Setup Guide

## Prerequisites

- Docker Engine 20.10+
- Linux server or VirtualBox VM
- Network connectivity between nodes
- Ports 2377, 7946, 4789 open (for Swarm communication)

## Step 1: Initialize Swarm Manager

### Find Your IP Address

```bash
# List all network interfaces
ip addr show

# Or get IP directly
hostname -I
```

Look for IPv4 address (e.g., `192.168.x.x` or `10.x.x.x`)

### Initialize Swarm

```bash
# Replace with your actual IP address
docker swarm init --advertise-addr YOUR_IP_ADDRESS

# Example:
docker swarm init --advertise-addr 192.168.1.100
```

### Verify Initialization

```bash
docker info | grep Swarm
docker node ls
```

## Step 2: Get Join Token for Worker Nodes

```bash
# Get worker join token
docker swarm join-token worker

# Output will look like:
# docker swarm join --token SWMTKN-1-xxxxx YOUR_IP:2377
```

## Step 3: Join Worker Nodes

On each worker node, run:

```bash
docker swarm join --token SWMTKN-1-xxxxx MANAGER_IP:2377
```

## Step 4: Verify Cluster

```bash
# On manager node
docker node ls

# Output should show all nodes with their roles
```

## Step 5: Deploy Stack

```bash
# Clone the repository
git clone https://github.com/MusoniEsther/Cat_Devops_inventory.git
cd Cat_Devops_inventory

# Deploy the stack
docker stack deploy -c docker-stack.yml inventory-system

# Verify deployment
docker stack ls
docker service ls
docker service ps inventory-system_inventory-system
```

## Troubleshooting

### Multiple IP Addresses Error

```bash
# Error: could not choose an IP address to advertise
# Solution: Specify the correct interface

docker swarm init --advertise-addr eth0
# or
docker swarm init --advertise-addr 192.168.1.100:2377
```

### Port Already in Use

```bash
# Check which service is using the port
sudo netstat -tulpn | grep 2377

# Or use lsof
sudo lsof -i :2377
```

### Node Can't Connect to Manager

```bash
# Verify firewall rules
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp

# Verify connectivity
ping MANAGER_IP
```

### Service Won't Start

```bash
# Check service logs
docker service logs inventory-system_inventory-system

# Check node status
docker node ls
docker node inspect NODE_ID

# Check resource availability
docker stats
```

## Common Commands

### Monitor Cluster

```bash
# List nodes
docker node ls

# List services
docker service ls

# View service details
docker service inspect inventory-system_inventory-system

# View running tasks
docker service ps inventory-system_inventory-system

# Check resource usage
docker stats

# View logs
docker service logs inventory-system_inventory-system -f
```

### Scale Service

```bash
# Scale to 3 replicas
docker service scale inventory-system_inventory-system=3

# Scale to 5 replicas
docker service scale inventory-system_inventory-system=5
```

### Update Service

```bash
# Update image
docker service update \
  --image esther7472/inventory-system:v1.0.1 \
  inventory-system_inventory-system

# Rollback
docker service rollback inventory-system_inventory-system
```

### Remove Stack

```bash
docker stack rm inventory-system
```

## Network Troubleshooting

### Check Network Status

```bash
docker network ls
docker network inspect inventory-system_inventory-network
```

### Test Connectivity Between Nodes

```bash
# On manager node
docker run -it --rm busybox ping WORKER_IP
```

## Resource Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Per node
docker node inspect NODE_ID

# Per service
docker service inspect --pretty inventory-system_inventory-system
```

## Backup & Recovery

### Backup Swarm State

```bash
# Backup swarm data (run on manager)
sudo tar -czf swarm-backup.tar.gz /var/lib/docker/swarm
```

### Restore Swarm

```bash
# Force new cluster from backup
docker swarm init --force-new-cluster

# Restore from backup
sudo tar -xzf swarm-backup.tar.gz -C /
```

## Best Practices

1. **Node Management**
   - Keep manager nodes separate from worker nodes
   - Use at least 3 manager nodes for HA
   - Use labels for node constraints

2. **Service Updates**
   - Use rolling updates
   - Test in staging first
   - Keep rollback capability

3. **Monitoring**
   - Monitor resource usage
   - Check service health regularly
   - Review logs for errors

4. **Security**
   - Firewall ports between nodes
   - Use strong passphrases for join tokens
   - Rotate certificates regularly

## Next Steps

- Configure health checks
- Set up monitoring (Prometheus, Grafana)
- Implement backup strategy
- Set up logging aggregation (ELK Stack)
