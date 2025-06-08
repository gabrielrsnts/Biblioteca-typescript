// Configuração do terminal para UTF-8
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');

// Aumentar o timeout dos testes para operações assíncronas
jest.setTimeout(30000);

// Mock do prompt-sync
jest.mock('prompt-sync', () => {
    return () => jest.fn();
}); 