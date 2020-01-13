FROM node:12.14.0-alpine3.11
WORKDIR /deployment
RUN apk add python3 make
ENV PORT=3000
EXPOSE 3000
COPY . ./
RUN npm install
# RUN ["npm", "run", "build"]
# CMD ["npm", "run", "start"]
CMD ["npm", "run", "dev"]