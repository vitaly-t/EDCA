# mxabierto mxabierto/edca
# https://github.com/mxabierto/edca
# Build:
#   docker build -t mxabierto/edca .
# Usage:
#   docker run \
#   --link mongodb-container:mongodb \
#   --link postgres-container:postgres \
#   --name edca \
#   -dP mxabierto/edca

FROM mxabierto/nodejs

MAINTAINER bcessa <ben@datos.mx>

WORKDIR /edca

ADD . /edca

# Install required modules
RUN npm install --no-optional

# Install bower components
RUN \
  npm install -g bower && \
  apk update && \
  apk add git && \
  cd public && \
  bower --allow-root install

# Expose default connection port
ENV PORT 3000
EXPOSE ${PORT}

# Default to running the www command
ENTRYPOINT ["/edca/bin/www"]
