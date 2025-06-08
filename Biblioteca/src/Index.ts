// Configuração do terminal para UTF-8
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');

import { mostrarMenu } from './ui/menu';
import { inicializarBancoDados } from './config/initDb';

async function main() {
    try {
        console.log('Iniciando Sistema de Biblioteca...');
        
        // Inicializar banco de dados
        await inicializarBancoDados();
        
        // Mostrar menu
        await mostrarMenu();
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

main();
