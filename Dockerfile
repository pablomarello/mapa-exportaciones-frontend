# Install dependencies only when needed
FROM node:18.16.0 AS deps
WORKDIR /app
COPY package.json ./
RUN npm install


FROM node:18.16.0 AS build 
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG ENVIRONMENT
ENV NODE_ENV ${ENVIRONMENT}
RUN npm run build:${ENVIRONMENT}


FROM nginx:1.17.1-alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]