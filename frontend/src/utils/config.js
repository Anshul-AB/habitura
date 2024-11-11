export const backendUrl = 
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_BACKEND_URL
    : process.env.IS_DOCKER === "true"
    ? process.env.DOCKER_BACKEND_URL
    : process.env.REACT_APP_DEV_BACKEND_URL;
