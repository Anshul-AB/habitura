# Backend setup
FROM node:20.11.0 AS backend
WORKDIR /app/backend
COPY backend/package.json .
RUN npm install && npm install -g nodemon
COPY backend/ .
EXPOSE 5000

# Frontend setup
FROM node:20.11.0 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# Final Image
FROM node:20.11.0 AS final
WORKDIR /app
# Copy the backend and frontend files from the previous stages
COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/build /app/frontend/build
# Copy node_modules from the backend stage
COPY --from=backend /app/backend/node_modules /app/backend/node_modules
# Set the working directory to backend for running the server
WORKDIR /app/backend
ENV PORT=5000
EXPOSE 5000
CMD ["npm", "start"]
