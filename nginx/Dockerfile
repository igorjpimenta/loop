FROM nginxinc/nginx-unprivileged:1.27.2-alpine

ARG USER
ARG GROUP
ARG UID
ARG GID

USER root

RUN addgroup -S ${GROUP} -g ${GID} && \
    adduser -S -D ${USER} -G ${GROUP} -u ${UID}

RUN mkdir -p /var/cache/nginx /usr/share/nginx/html/media; \
    chown -R ${USER}:${GROUP} /var/cache/nginx /usr/share/nginx/html/media; \
    chmod -R 775 /var/cache/nginx /usr/share/nginx/html/media;

EXPOSE 80

USER ${USER}

CMD ["nginx", "-g", "daemon off;"]
