export default {
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
};