
#Build React app
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json && npm install

COPY . .

RUN npm run build

#Run serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

