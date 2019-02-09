FROM node:current-alpine
LABEL maintainer="mark@trickkiste.at"

EXPOSE 80

WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY . /app/

CMD ["npm", "start"]

