# Используем официальный Node.js образ в качестве базового для сборки
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY ./src ./src
COPY ./public ./public
ENV REACT_APP_URL="https://api.eucalytics.uk/bar"

# Строим приложение для продакшена
RUN npm run build

# Используем Nginx для сервировки статических файлов
FROM nginx:alpine

# Копируем файлы сборки из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
