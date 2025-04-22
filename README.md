<p align="center">
  <img src="https://raw.githubusercontent.com/ehzack/puller-dockerhub/master/logo.png" alt="PULLER DOCKERHUB Logo" width="120" />
  <h1 align="center">PULLER DOCKERHUB</h1>
  <p align="center">
    A lightweight HTTP API to automate `docker pull` and `docker-compose up` on Docker Hub events.
  </p>
  
</p>

---

## 📋 Table of Contents

- [🚀 What Is Puller?](#-what-is-puller)  
- [✨ Key Features](#-key-features)  
- [🚀 Quick Start](#-quick-start)  
- [⚙️ Configuration](#️-configuration)  
  - [Environment Variables](#environment-variables)  
  - [Compose Setup](#compose-setup)  
- [📖 Usage](#-usage)  
  - [Trigger via HTTP](#trigger-via-http)  
  - [🔗 Integrate with Docker Hub](#-integrate-with-docker-hub)  
- [🛠️ Health & Logging](#️-health--logging)  
- [🐞 Troubleshooting](#-troubleshooting)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  
- [📬 Contact](#-contact)  

---

## 🚀 What Is Puller?

**Puller** is a minimal HTTP API service that listens for Docker Hub webhook payloads and, pulls and redeploys a specified container.

It's designed to be lightweight, easy to configure, and suitable for use in CI/CD pipelines.

This lets you automatically redeploy containers whenever you push a new image tag to Docker Hub, without manual intervention.

---

## ✨ Key Features

- **Automatic Pull & Deploy**  
  Executes `docker pull` and `docker-compose up` on-demand.  
- **Webhook Listener**  
  Accepts Docker Hub webhook POSTs and parses the payload for image and tag.  
- **Configurable**  
  Control ports, retry attempts, and service names via environment variables.  
- **Lightweight**  
  Small memory footprint and simple dependencies.  
- **Secure by Default**  
  Runs with read-only Docker socket and minimal privileges.

---

## 🚀 Quick Start

1. **Clone & Deploy**  
   ```bash
   git clone https://github.com/ehzack/puller-dockerhub.git
   cd puller-dockerhub
   docker-compose up -d
   ```

2. **Configure Webhook on Docker Hub**  
   See [Integrate with Docker Hub](#-integrate-with-docker-hub) below.

3. **Push a New Tag**  
   ```bash
   docker tag my-app:latest youruser/my-app:release-1.0
   docker push youruser/my-app:release-1.0
   ```
   Puller will automatically pull and redeploy your container.

---

## ⚙️ Configuration

### Environment Variables

| Variable           | Default | Description                                          |
| ------------------ | ------- | ---------------------------------------------------- |
| `SERVER_PORT`      | `4999`  | HTTP port on which Puller listens.                   |
| `RETRY_COUNT`      | `3`     | Number of times to retry a failed `docker pull`.     |
| `COMPOSE_SERVICE`  | none    | (Optional) Service name for `docker-compose up`.     |
| `LOG_LEVEL`        | `info`  | Logging level: `debug`, `info`, `warn`, `error`.     |
| `LOG_MAX_SIZE`     | `3`     | Maximum size of log files in MB.                     |
| `LOG_MAX_FILES`    | `3`     | Maximum number of log files to retain.               |

### Compose Setup

```yaml
version: "3.8"
services:
  puller:
    image: ehzack/puller-dockerhub:latest
    restart: always
    ports:
      - "${SERVER_PORT:-4999}:4999"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      SERVER_PORT: 4999
      LOG_MAX_SIZE: 3 # in MB
      LOG_MAX_FILES: 3
```

---

## 📖 Usage

### Trigger via HTTP

You can manually trigger a pull & deploy:

```bash
curl -X POST "http://<HOST>:<PORT>/trigger"      -H "Content-Type: application/json"      -d '{
       "image": "youruser/my-app:latest",
       "composeService": "web"
     }'
```

- **`image`**: Full image reference (`<repo>:<tag>`).  
- **`composeService`**: (Optional) Overrides `COMPOSE_SERVICE` env var.

### 🔗 Integrate with Docker Hub

1. **Add Webhook**  
   - Go to your Docker Hub repo ▶︎ **Settings** ▶︎ **Webhooks**.  
   - Click **Add Webhook**, set the URL to:  
     ```
     http://<PULLER_HOST>:<PULLER_PORT>/trigger?path=$path$&container_name=$container_name
      ```
Query Parameters:
- **$path**: The location of your docker-compose.yml file (Example: /home/user/app/docker-compose.yml)
- **$container_name**: The name of the container you want to restart (Example: my-web-app)


Example URL:
- http://localhost:4999/trigger?path=/home/user/app/docker-compose.yml&container_name=web-app
     


2. **Configure Compose Service**  
   Ensure your `docker-compose.yml` defines the service you want to restart:

   ```yaml
   version: "3.8"
   services:
     web:
       image: youruser/my-app:latest
       # ...
   ```

3. **Push New Image**  
   Every `docker push` will send a webhook to Puller. It will:
   1. Parse the payload for `repository` and `push_data.tag`.  
   2. Run `docker pull youruser/my-app:<tag>`.  
   3. Execute `docker-compose up -d web`.

---

## 🛠️ Health & Logging

- **Health Endpoint**:  
  `GET /health` returns `200 OK` if service is healthy.  
- **Logs**:  
  Stream logs via Docker:  
  ```bash
  docker logs -f puller-dockerhub_puller_1
  ```

---

## 🐞 Troubleshooting

- **Socket Permission Denied**  
  ```bash
  sudo chmod 660 /var/run/docker.sock
  sudo usermod -aG docker $(whoami)
  ```
- **Unexpected Payload**  
  Ensure Docker Hub webhook is configured with **application/json** content type.  
- **Service Not Restarting**  
  Confirm `COMPOSE_SERVICE` matches your service name in `docker-compose.yml`.

---

## 🤝 Contributing

We welcome your improvements and bug fixes! Please see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE).

---

## 📬 Contact

- **Author**: Zack  
- **GitHub**: [ehzack/puller-dockerhub](https://github.com/ehzack/puller-dockerhub)  

