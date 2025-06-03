import { LivroRepository } from '../repositories/LivroRepository';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';

async function testarRepositorioLivros() {
    console.log('Iniciando testes do repositório de livros...\n');
    
    const repo = new LivroRepository();
    
    try {
        // Teste de criação
        console.log('1. Testando criação de livro...');
        const novoLivro = new Livro(
            1,
            'O Hobbit',
            'J.R.R. Tolkien',
            1937,
            CategoriaLivro.LITERATURA
        );
        
        const livroSalvo = await repo.criar(novoLivro);
        if (livroSalvo) {
            console.log('✓ Livro criado com sucesso');
            console.log('Dados do livro:', {
                id: livroSalvo.getId(),
                titulo: livroSalvo.getTitulo(),
                autor: livroSalvo.getAutor(),
                anoPublicacao: livroSalvo.getAnoPublicacao(),
                categoria: livroSalvo.getCategoria()
            });
        } else {
            throw new Error('Falha ao criar livro');
        }

        // Teste de busca
        console.log('\n2. Testando busca de livro...');
        const livroEncontrado = await repo.buscarPorId(livroSalvo.getId());
        if (livroEncontrado) {
            console.log('✓ Livro encontrado com sucesso');
            console.log('Dados do livro:', {
                id: livroEncontrado.getId(),
                titulo: livroEncontrado.getTitulo(),
                autor: livroEncontrado.getAutor(),
                anoPublicacao: livroEncontrado.getAnoPublicacao(),
                categoria: livroEncontrado.getCategoria()
            });
        } else {
            throw new Error('Falha ao buscar livro');
        }

        // Teste de atualização
        console.log('\n3. Testando atualização de livro...');
        livroEncontrado.setTitulo('O Hobbit - Uma Jornada Inesperada');
        const atualizou = await repo.atualizar(livroEncontrado);
        if (atualizou) {
            console.log('✓ Livro atualizado com sucesso');
        } else {
            throw new Error('Falha ao atualizar livro');
        }

        // Teste de listagem
        console.log('\n4. Testando listagem de livros...');
        const todosLivros = await repo.buscarTodos();
        console.log('✓ Livros listados com sucesso');
        console.log('Total de livros:', todosLivros.length);

        // Teste de deleção
        console.log('\n5. Testando deleção de livro...');
        const deletou = await repo.deletar(livroSalvo.getId());
        if (deletou) {
            console.log('✓ Livro deletado com sucesso');
        } else {
            throw new Error('Falha ao deletar livro');
        }

    } catch (error) {
        console.error('✗ Erro durante os testes:', error);
    }

    console.log('\nTestes concluídos!');
}

// Executar os testes
testarRepositorioLivros(); 