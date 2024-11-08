FROM node:20.11.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=development

FROM nginx:latest

COPY --from=build app/dist/tcc-interface/browser /usr/share/nginx/html

EXPOSE 80
