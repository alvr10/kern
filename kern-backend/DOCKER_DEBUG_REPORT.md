# Docker Infrastructure Debug Report

## 🚨 Critical Issue: Daemon State Inconsistency / Ghost Containers

The project is currently experiencing severe Docker daemon corruption on the host. The primary symptom is that `docker compose up` fails with `No such container` errors for a specific ID (`46a7bef30901...`) that does not appear in standard `docker ps -a` listings, yet blocks the creation/startup of RabbitMQ and other services.

### Core Error Information
- **Error Response**: `Error response from daemon: No such container: 46a7bef309011a61b80cb42738eb4d686408e158878203683c84a467349ad6f1`
- **Port Conflicts**: Multiple ports (27017, 3009, 5672) are frequently reported as "already in use" by `docker-proxy`, even after `docker compose down` and `prune`.

---

## 🛠 Troubleshooting Log (Attempted Solutions)

### 1. Standard Cleanup
- **Commands**: `docker compose down -v --remove-orphans`, `docker system prune -af --volumes`
- **Result**: Failed. Ghost containers/ports persisted.

### 2. Manual Process Termination
- **Commands**: `sudo kill -9 [PIDs]` for `docker-proxy` processes found via `netstat` and `lsof`.
- **Result**: Temporary relief for one port (e.g., 27017), but immediate conflict on the next service (e.g., 3009).

### 3. Namespace/Project Isolation
- **Action**: Ran `docker compose -p kern-v3 up -d` to isolate the project.
- **Result**: Failed. Infrastructure services still clash with the ghost state of previous runs.

### 4. Configuration Changes
- **Action**: Removed all `container_name:` definitions from `docker-compose.yml` to prevent name collisions.
- **Action**: Renamed services (e.g., `rabbitmq` to `rabbitmq-v2`).
- **Result**: The daemon still throws `No such container` when trying to manage the lifecycle of these services, suggesting a deep internal mismatch in Docker's metadata storage.

### 5. Service Restart
- **Action**: `sudo service docker restart`
- **Result**: Did not clear the ghost container state.

---

## 📂 Current Setup State

- **docker-compose.yml**: Modified to remove explicit `container_name` fields. This was done to allow Docker to generate unique IDs and avoid the "Name already in use" conflict.
- **Network**: Using a custom bridge network `kern-network`.
- **Ports**: 
    - MongoDB: 27017
    - RabbitMQ: 5672, 15672
    - Gateway: 3000
    - Admin: 3009
    - Services: 3001-3008

---

## ⏭ Suggested Next Steps for the AI

1. **Host-Level Intervention**: A full system reboot may be required to clear kernel-level network hooks or stuck `containerd` tasks.
2. **Deep Docker Cleanup**:
   - Stop Docker: `sudo systemctl stop docker`
   - **(CAUTION)**: Wipe Docker state: `sudo rm -rf /var/lib/docker` (This deletes ALL images/volumes/containers on the host).
   - Start Docker: `sudo systemctl start docker`
3. **Inspect Runtime State**: Use `docker inspect` on the problematic hash if it ever reappears, or check `/var/run/docker.sock` directly if tools allow.
4. **Environment Check**: Verify if another orchestration tool (like a background K8s/Minikube or another Compose project) is competing for the same ports or volume mounts.

---
**Status**: Blocked by Docker Daemon.
