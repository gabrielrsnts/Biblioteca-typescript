import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Emprestimo from '../model/Emprestimo';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import CategoriaLivro from '../model/CategoriaLivro';
import StatusEmprestimo from '../model/StatusEmprestimo';

async function testarRepositorioEmprestimos() {
    console.log('Iniciando testes do repositório de empréstimos...\n');
    
    const emprestimoRepo = new EmprestimoRepository();
    const livroRepo = new LivroRepository();
    const usuarioRepo = new UsuarioRepository();
    
    try {
        // Primeiro, vamos criar um livro e um usuário para usar nos testes
        console.log('Preparando dados de teste...');
        
        const id = Math.floor(Math.random() * 1000000) + 1;
        const matricula = `MAT${String(id).padStart(6, '0')}`;
        const email = `usuario.${id}@email.com`;
        
        const livro = await livroRepo.criar(new Livro(
            id,
            'Dom Casmurro',
            'Machado de Assis',
            1899,
            CategoriaLivro.LITERATURA
        ));

        const usuario = await usuarioRepo.criar(new Usuario(
            id + 1,
            matricula,
            'Maria Santos',
            email,
            '(11) 98765-4321'
        ));

        if (!livro || !usuario) {
            throw new Error('Falha ao criar livro ou usuário para teste');
        }

        // Teste de criação
        console.log('\n1. Testando criação de empréstimo...');
        const dataEmprestimo = new Date();
        const dataDevolucaoPrevista = new Date();
        dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 15); // 15 dias de prazo

        const novoEmprestimo = new Emprestimo(
            id + 2,
            livro,
            usuario,
            dataEmprestimo,
            dataDevolucaoPrevista
        );
        
        const emprestimoSalvo = await emprestimoRepo.criar(novoEmprestimo);
        if (emprestimoSalvo) {
            console.log('✓ Empréstimo criado com sucesso');
            console.log('Dados do empréstimo:', {
                id: emprestimoSalvo.getId(),
                livro: emprestimoSalvo.getLivro().getTitulo(),
                usuario: emprestimoSalvo.getUsuario().getNome(),
                dataEmprestimo: emprestimoSalvo.getDataEmprestimo(),
                dataDevolucaoPrevista: emprestimoSalvo.getDataDevolucaoPrevista(),
                status: emprestimoSalvo.getStatus()
            });
        } else {
            throw new Error('Falha ao criar empréstimo');
        }

        // Teste de busca
        console.log('\n2. Testando busca de empréstimo...');
        const emprestimoEncontrado = await emprestimoRepo.buscarPorId(emprestimoSalvo.getId());
        if (emprestimoEncontrado) {
            console.log('✓ Empréstimo encontrado com sucesso');
            console.log('Dados do empréstimo:', {
                id: emprestimoEncontrado.getId(),
                livro: emprestimoEncontrado.getLivro().getTitulo(),
                usuario: emprestimoEncontrado.getUsuario().getNome(),
                status: emprestimoEncontrado.getStatus()
            });
        } else {
            throw new Error('Falha ao buscar empréstimo');
        }

        // Teste de atualização
        console.log('\n3. Testando atualização de empréstimo...');
        const dataDevolucao = new Date();
        emprestimoEncontrado.realizarDevolucao(dataDevolucao);
        
        const atualizou = await emprestimoRepo.atualizar(emprestimoEncontrado);
        if (atualizou) {
            console.log('✓ Empréstimo atualizado com sucesso');
        } else {
            throw new Error('Falha ao atualizar empréstimo');
        }

        // Teste de listagem
        console.log('\n4. Testando listagem de empréstimos...');
        const todosEmprestimos = await emprestimoRepo.buscarTodos();
        console.log('✓ Empréstimos listados com sucesso');
        console.log('Total de empréstimos:', todosEmprestimos.length);

        // Teste de deleção
        console.log('\n5. Testando deleção de empréstimo...');
        const deletou = await emprestimoRepo.deletar(emprestimoSalvo.getId());
        if (deletou) {
            console.log('✓ Empréstimo deletado com sucesso');
        } else {
            throw new Error('Falha ao deletar empréstimo');
        }

        // Limpando dados de teste
        console.log('\nLimpando dados de teste...');
        await livroRepo.deletar(livro.getId());
        await usuarioRepo.deletar(usuario.getId());
        console.log('✓ Dados de teste limpos com sucesso');

    } catch (error) {
        console.error('✗ Erro durante os testes:', error);
    }

    console.log('\nTestes concluídos!');
}

// Executar os testes
testarRepositorioEmprestimos(); 