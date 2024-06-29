# PULLER DOCKERHUB

PULLER DOCKERHUB is a Docker container designed to facilitate automated pulling of Docker images from Docker Hub.

## Requirements

Ensure you have Docker installed and configured on your host system.

## Setting Up PULLER DOCKERHUB

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/puller-dockerhub.git
   cd puller-dockerhub

2. **Configure PULLER DOCKERHUB**
Edit the Docker Compose file (docker-compose.yml) to configure the PULLER DOCKERHUB container:
```bash
version: "3.6"

services:
  puller:
    build: .
    restart: always
    volumes:
      - /etc:/local_etc  # Example of mounting host directory
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - '4999:4999'
    environment:
      SERVER_PORT: 4999

```


3. **Deploy PULLER DOCKERHU**

## Deployment

To deploy this project run

```bash
 docker-compose up -d
```


## Using PULLER DOCKERHUB

PULLER DOCKERHUB allows you to automate Docker image pulls. Access the PULLER DOCKERHUB endpoint to trigger pulls:

* Webhook URL: http://API_URL/trigger?data=/local_etc/atadawl
Send a POST request to the webhook URL to pull Docker images:



```basg
curl -X POST http://API_URL/trigger?data=/local_etc/atadawl
```


## Troubleshooting

* Permission Issues: Ensure Docker socket (/var/run/docker.sock) permissions are set correctly.
* Network/Firewall Issues: Check network and firewall settings to allow Docker communication.
* Logging: View container logs for troubleshooting:

```basg
docker logs puller-dockerhub_puller_1
```

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.




## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

For support or questions, contact me

