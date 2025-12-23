// Este script customiza o Swagger UI para setar automaticamente o token JWT após login
window.addEventListener('DOMContentLoaded', function () {
  // Intercepta o submit do /auth/login
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    // Detecta chamada ao endpoint de login
    if (args[0] && typeof args[0] === 'string' && args[0].includes('/auth/login')) {
      const response = await originalFetch(...args);
      try {
        const data = await response.clone().json();
        if (data && data.access_token) {
          // Seta o token no Swagger UI
          const bearer = `Bearer ${data.access_token}`;
          const key = 'swagger_access_token';
          localStorage.setItem(key, bearer);
          // Tenta setar no authorize se disponível
          if (window.ui && window.ui.preauthorizeApiKey) {
            window.ui.preauthorizeApiKey('bearer', bearer);
          }
        }
      } catch (e) {}
      return response;
    }
    return originalFetch(...args);
  };

  // Ao carregar, tenta setar o token salvo
  setTimeout(() => {
    const token = localStorage.getItem('swagger_access_token');
    if (token && window.ui && window.ui.preauthorizeApiKey) {
      window.ui.preauthorizeApiKey('bearer', token);
    }
  }, 1000);
});
