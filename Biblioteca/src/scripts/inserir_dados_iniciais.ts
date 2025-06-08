import { inserirDadosIniciais } from '../database/dados_iniciais';

console.log('Iniciando inserção dos dados iniciais...');

inserirDadosIniciais()
    .then(() => {
        console.log('Processo finalizado!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Erro durante a inserção dos dados:', error);
        process.exit(1);
    }); 