FROM node:24 AS development

ENV NODE_ENV=development

WORKDIR /usr/src/app

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.1/zsh-in-docker.sh)" -- \
    -p git \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions
RUN npm i -g @nestjs/cli pnpm@10

CMD ["zsh"]
