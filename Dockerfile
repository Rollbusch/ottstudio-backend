FROM node:20-alpine3.18

WORKDIR /app
COPY . .

RUN npm install --unsafe-perm
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]