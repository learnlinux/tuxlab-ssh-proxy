FROM node:7.10.1-alpine
MAINTAINER Derek Brown <derek@allderek.com>

# Copy Source
COPY src/ /root/

# Install Git
RUN apk update && \
    apk add git

# Install App
RUN cd /root/ && \
    npm install --production && \
    rm -rf /var/cache/apk/*

EXPOSE 22 80 443

ENTRYPOINT ["node"]
CMD ["/root/proxy.js"]
