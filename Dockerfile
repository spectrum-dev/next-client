FROM node:16-alpine as build

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_GRAPHQL_API_URL

ENV REACT_APP_API_BASE_URL ${REACT_APP_API_BASE_URL}
ENV REACT_APP_GRAPHQL_API_URL ${REACT_APP_GRAPHQL_API_URL}

# Used to fix erroring renavate artifact updating 
ENV RENOVATE_BINARY_SOURCE=global

# Build
WORKDIR /usr/src/app
COPY package*.json ./

COPY . ./
RUN npm install
RUN npm run build

# Stage - Production
FROM nginx:1.21

RUN rm -rf /etc/nginx/conf.d
COPY .nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .nginx/conf.d/timeout.conf /etc/nginx/conf.d/timeout.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
