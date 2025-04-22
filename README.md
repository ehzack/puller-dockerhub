<p align="center">
  <img src="https://raw.githubusercontent.com/ehzack/puller-dockerhub/main/logo.png" alt="PULLER DOCKERHUB Logo" width="120" />
  <h1 align="center">PULLER DOCKERHUB</h1>
  <p align="center">
    Automate and orchestrate Docker image pulls from Docker Hub with ease.
  </p>

</p>

---

## 📋 Table of Contents

- [✨ Features](#-features)  
- [🚀 Quick Start](#-rocket-quick-start)  
- [⚙️ Configuration](#️-configuration)  
  - [Environment Variables](#environment-variables)  
  - [Compose Parameters](#compose-parameters)  
- [📖 Usage](#-usage)  
  - [Trigger via HTTP](#trigger-via-http)  
  - [Webhook Example](#webhook-example)  
- [🛠️ Health & Metrics](#️-health--metrics)  
- [🐞 Troubleshooting](#-troubleshooting)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  
- [📬 Contact & Support](#-contact--support)  

---

## ✨ Features

- **Automated Pulls**: Instantly pull or update any Docker Hub image on demand.
- **Webhook-Driven**: Trigger pulls via simple HTTP request or CI/CD webhook.
- **Lightweight**: Minimal base image footprint; optimized for performance.
- **Secure**: Runs with least privileges; binds only necessary ports.
- **Configurable**: Environment-driven parameters for port, paths, retries, and logging.
- **Extensible**: Easily integrate into GitHub Actions, GitLab CI, Jenkins, or custom pipelines.

---

## 🚀 Quick Start

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ehzack/puller-dockerhub.git
   cd puller-dockerhub
   ```

2. **Customize your configuration**  
   See [Configuration](#️-configuration) below.

3. **Launch with Docker Compose**  
   ```bash
   docker-compose up -d
   ```

4. **Verify**  
   ```bash
   docker-compose ps
   # Should show `puller` service running on port $SERVER_PORT
   ```

---

## ⚙️ Configuration

### Environment Variables

| Variable           | Default | Description                                                    |
| ------------------ | ------- | -------------------------------------------------------------- |
| `SERVER_PORT`      | `4999`  | HTTP port for the Puller API.                                  |
| `PULL_RETRIES`     | `3`     | Number of retry attempts on pull failure.                      |
| `LOG_LEVEL`        | `info`  | Logging verbosity (`debug`, `info`, `warn`, `error`).          |
| `ALLOWED_ORIGINS`  | `*`     | CORS origins permitted to access the endpoint.                 |

### Compose Parameters

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
      - /etc:/local_etc:ro                  # Optional: mount custom config/data
    environment:
      SERVER_PORT: 4999
      PULL_RETRIES: 3
      LOG_LEVEL: info
      ALLOWED_ORIGINS: https://ci.example.com
```

---

## 📖 Usage

### Trigger via HTTP

Send a **POST** request to trigger an image pull:

```bash
curl -X POST   "http://<HOST>:<PORT>/trigger"   -H "Content-Type: application/json"   -d '{
    "image": "nginx:latest",
    "container_name": "webserver",
    "options": {
      "pullPolicy": "always"
    }
  }'
```

**Parameters**:

- `image` _(string, required)_: `<repository>:<tag>` on Docker Hub.
- `container_name` _(string, optional)_: Friendly name for logging.
- `options.pullPolicy` _(string)_: `always` | `if-not-present`.

### Webhook Example

Integrate with GitHub Actions:

```yaml
jobs:
  notify-puller:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Puller
        run: |
          curl -X POST             https://puller.example.com/trigger             -H "Authorization: Bearer ${{ secrets.PULLER_TOKEN }}"             -d '{"image":"yourimage:latest"}'
```

---

## 🛠️ Health & Metrics

- **Health Check**:  
  `GET /health` returns `200 OK` if the service is operational.
- **Metrics**:  
  Exposed on `/metrics` (Prometheus format).

---

## 🐞 Troubleshooting

- **Permission Denied on Docker Socket**  
  ```bash
  chmod 660 /var/run/docker.sock
  adduser $(whoami) docker
  ```
- **Container Fails to Start**  
  ```bash
  docker logs puller-dockerhub_puller_1
  ```
- **Network Timeouts**  
  Ensure your host can reach `registry-1.docker.io` and firewall rules permit outbound HTTPS.

---

## 🤝 Contributing

Your contributions are welcome!

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "Add awesome feature"`)  
4. Push to your branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

Please review our [CODE_OF_CONDUCT.md](/CODE_OF_CONDUCT.md) and [CONTRIBUTING.md](/CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

- **Author**: zack
- **Project Repo**: [github.com/ehzack/puller-dockerhub](https://github.com/ehzack/puller-dockerhub)  
- **Issues & Feature Requests**: [GitHub Issues](https://github.com/ehzack/puller-dockerhub/issues)
