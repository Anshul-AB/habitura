# Backend setup
FROM node:20.11.0 as backend
WORKDIR /app
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
RUN npm run build  # Build the frontend for production

# Final Image
FROM node:20.11.0 as final
WORKDIR /app
COPY --from=backend /app /app
COPY --from=frontend /app/frontend/build /app/frontend/build

ENV PORT=5050
EXPOSE 5050
CMD ["npm", "start"]