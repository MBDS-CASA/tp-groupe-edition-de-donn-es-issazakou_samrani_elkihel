# Étape 1 : Construire l'application React
FROM node:20 AS build
WORKDIR /app

# Copier les fichiers de dépendances et installer les modules
COPY package*.json ./
RUN npm install

# Copier le reste du code source et générer le build
COPY . .
RUN npm run build

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:alpine

# Copier le build dans le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le bon port
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
