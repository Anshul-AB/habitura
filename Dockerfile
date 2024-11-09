# Backend setup
FROM node:20.11.0 as backend
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install
COPY backend/ .
EXPOSE 5050

# Frontend setup
FROM node:20.11.0 as frontend
WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# Final Image
FROM node:20.11.0 as final
WORKDIR /app
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/build /app/backend/public
ENV PORT=5050
EXPOSE 5050
CMD ["node", "backend/index.js"]
