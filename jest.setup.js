// Aumentar o timeout para testes assíncronos
jest.setTimeout(30000);

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 