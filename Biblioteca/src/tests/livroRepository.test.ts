import { LivroRepository } from '../repositories/LivroRepository';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';
import { supabase } from '../config/supabase';

describe('LivroRepository', () => {
    let repository: LivroRepository;
    let livroTeste: Livro;

    beforeAll(async () => {
        repository = new LivroRepository();
        
        // Limpar a tabela antes dos testes
        await supabase.from('livros').delete().neq('id', 0);
    });

    beforeEach(() => {
        livroTeste = new Livro(
            null as any,
            'Dom Casmurro',
            'Machado de Assis',
            1899,
            CategoriaLivro.ROMANCE
        );
    });

    it('deve criar um novo livro', async () => {
        const livroSalvo = await repository.criar(livroTeste);
        expect(livroSalvo).not.toBeNull();
        expect(livroSalvo?.getTitulo()).toBe('Dom Casmurro');
        expect(livroSalvo?.getId()).toBeGreaterThan(0);
    });

    it('deve buscar um livro por ID', async () => {
        const livroSalvo = await repository.criar(livroTeste);
        if (!livroSalvo) throw new Error('Falha ao criar livro para teste');

        const livroEncontrado = await repository.buscarPorId(livroSalvo.getId());
        expect(livroEncontrado).not.toBeNull();
        expect(livroEncontrado?.getTitulo()).toBe('Dom Casmurro');
    });

    it('deve atualizar um livro', async () => {
        const livroSalvo = await repository.criar(livroTeste);
        if (!livroSalvo) throw new Error('Falha ao criar livro para teste');

        livroSalvo.setTitulo('Memórias Póstumas de Brás Cubas');
        const atualizado = await repository.atualizar(livroSalvo);
        expect(atualizado).toBe(true);

        const livroAtualizado = await repository.buscarPorId(livroSalvo.getId());
        expect(livroAtualizado?.getTitulo()).toBe('Memórias Póstumas de Brás Cubas');
    });

    it('deve deletar um livro', async () => {
        const livroSalvo = await repository.criar(livroTeste);
        if (!livroSalvo) throw new Error('Falha ao criar livro para teste');

        const deletado = await repository.deletar(livroSalvo.getId());
        expect(deletado).toBe(true);

        const livroEncontrado = await repository.buscarPorId(livroSalvo.getId());
        expect(livroEncontrado).toBeNull();
    });

    it('deve buscar todos os livros', async () => {
        await repository.criar(livroTeste);
        
        const outroLivro = new Livro(
            0,
            'Quincas Borba',
            'Machado de Assis',
            1891,
            CategoriaLivro.ROMANCE
        );
        await repository.criar(outroLivro);

        const livros = await repository.buscarTodos();
        expect(livros.length).toBeGreaterThanOrEqual(2);
    });
}); 