import { salvarEmArquivo, carregarDeArquivo, SistemaBackup } from '../utils/serialization';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import Emprestimo from '../model/Emprestimo';
import StatusEmprestimo from '../model/StatusEmprestimo';
import CategoriaLivro from '../model/CategoriaLivro';

// Dados de teste
const livrosTeste: Livro[] = [
    new Livro(
        1,
        'O Senhor dos Anéis',
        'J.R.R. Tolkien',
        1954,
        CategoriaLivro.FANTASIA
    ),
    new Livro(
        2,
        'Harry Potter',
        'J.K. Rowling',
        1997,
        CategoriaLivro.FANTASIA
    )
];

const usuariosTeste: Usuario[] = [
    new Usuario(
        1,
        'MAT001',
        'João Silva',
        'joao@email.com',
        '123456789'
    ),
    new Usuario(
        2,
        'MAT002',
        'Maria Santos',
        'maria@email.com',
        '987654321'
    )
];

const emprestimosTeste: Emprestimo[] = [
    new Emprestimo(
        1,
        livrosTeste[0],
        usuariosTeste[0],
        new Date('2024-01-15'),
        new Date('2024-01-30')
    )
];

// Função principal de teste
async function testarSerializacao() {
    console.log('Iniciando testes de serialização...\n');

    // Testando funções individuais
    try {
        console.log('1. Testando salvarEmArquivo e carregarDeArquivo com livros...');
        salvarEmArquivo('livros_teste.json', livrosTeste);
        const livrosCarregados = carregarDeArquivo<Livro>('livros_teste.json');
        console.log('✓ Livros salvos e carregados com sucesso');
        console.log('Dados carregados:', JSON.stringify(livrosCarregados, null, 2));
    } catch (error) {
        console.error('✗ Erro ao testar livros:', error);
    }

    // Testando o SistemaBackup
    try {
        console.log('\n2. Testando SistemaBackup...');
        const backup = new SistemaBackup();
        
        console.log('Salvando todo o sistema...');
        backup.salvarSistema(livrosTeste, usuariosTeste, emprestimosTeste);
        
        console.log('Carregando todo o sistema...');
        const dadosCarregados = backup.carregarSistema();
        
        console.log('✓ Sistema de backup funcionando corretamente');
        console.log('Dados carregados:');
        console.log('- Livros:', dadosCarregados.livros.length);
        console.log('- Usuários:', dadosCarregados.usuarios.length);
        console.log('- Empréstimos:', dadosCarregados.emprestimos.length);
    } catch (error) {
        console.error('✗ Erro ao testar sistema de backup:', error);
    }

    console.log('\nTestes concluídos!');
}

// Executar os testes
testarSerializacao(); 