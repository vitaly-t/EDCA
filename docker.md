# Docker

La aplicación puede ser ejecutada utilizando contenedores docker, de la siguiente forma.

### Crear imagen:
`docker build -t mxabierto/edca .`

### Ejecutar dependencias:
`docker run -d --name mongodb mxabierto/mongodb-min`
`docker run -d --name postgres -e POSTGRES_PASSWORD=secretpassword postgres`

### Ejecutar aplicación:
`docker run \
--link mongodb-container:mongodb \
--link postgres-container:postgres \
--name edca \
-dP mxabierto/edca`

### Ejecutar comandos:
`docker exec -it edca scripts/useradm add USERNAME PASSWORD`
