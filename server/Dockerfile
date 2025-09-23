

FROM node:20

WORKDIR /app

#Copy package.json and package-lock.
COPY package*.json ./

#Install app dependencies
RUN npm install

#Copy the rest of our app into the container
COPY . .

#Set port environment variable
ENV port=8080
#expose the port so our computer can access it
EXPOSE 8080

#Run the app
CMD ["npm", "start"]