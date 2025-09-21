export const environment = {
    production: false,
    // ConfigService를 통해 동적으로 감지됨
    apiUrl: 'http://localhost:5000/api',  // 기본값 (fallback)
    wsUrl: 'ws://localhost:5000'
  }; 