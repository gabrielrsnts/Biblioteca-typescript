import { inserirDadosIniciais } from '../database/dados_iniciais';

async function main() {
    try {
        console.log('Iniciando inserção de dados...');
        await inserirDadosIniciais();
        console.log('Processo finalizado!');
    } catch (error) {
        console.error('Erro:', error);
    }
}

main(); 