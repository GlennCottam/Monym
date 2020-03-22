FROM node:latest

# Create app directory
RUN mkdir -p /monym
WORKDIR /monym

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /monym/
# COPY src/* ./src/
# COPY config/* ./config/
# COPY public/* ./public/
# COPY views/* ./views/
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . /monym/

EXPOSE 6969

CMD [ "node", "src/index.js" ]
