import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Emprestimo from '../model/Emprestimo';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import CategoriaLivro from '../model/CategoriaLivro';
import StatusEmprestimo from '../model/StatusEmprestimo';
import { supabase } from '../config/supabase';

describe('EmprestimoRepository', () => {
    let repository: EmprestimoRepository;
    let livroRepo: LivroRepository;
    let usuarioRepo: UsuarioRepository;
    let livroTeste: Livro;
    let usuarioTeste: Usuario;
    let emprestimoTeste: Emprestimo;

    beforeAll(async () => {
        repository = new EmprestimoRepository();
        livroRepo = new LivroRepository();
        usuarioRepo = new UsuarioRepository();
        
        // Limpar as tabelas antes dos testes
        await supabase.from('emprestimos').delete().neq('id', 0);
        await supabase.from('livros').delete().neq('id', 0);
        await supabase.from('usuarios').delete().neq('id', 0);

        // Criar livro e usuário para os testes
        livroTeste = new Livro(
            null as any,
            'Dom Casmurro',
            'Machado de Assis',
            1899,
            CategoriaLivro.ROMANCE
        );
        livroTeste = await livroRepo.criar(livroTeste) as Livro;

        const timestamp = new Date().getTime();
        usuarioTeste = new Usuario(
            null as any,
            `20230001${timestamp}`,
            'Maria Santos',
            `maria${timestamp}@email.com`,
            '987654321'
        );
        usuarioTeste = await usuarioRepo.criar(usuarioTeste) as Usuario;
    });

    beforeEach(() => {
        const dataEmprestimo = new Date();
        const dataDevolucaoPrevista = new Date();
        dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 15);

        emprestimoTeste = new Emprestimo(
            null as any,
            livroTeste,
            usuarioTeste,
            dataEmprestimo,
            dataDevolucaoPrevista
        );
    });

    it('deve criar um novo empréstimo', async () => {
        const emprestimoSalvo = await repository.criar(emprestimoTeste);
        expect(emprestimoSalvo).not.toBeNull();
        expect(emprestimoSalvo?.getId()).toBeGreaterThan(0);
        expect(emprestimoSalvo?.getStatus()).toBe(StatusEmprestimo.EM_ANDAMENTO);
    });

    it('deve buscar um empréstimo por ID', async () => {
        const emprestimoSalvo = await repository.criar(emprestimoTeste);
        if (!emprestimoSalvo) throw new Error('Falha ao criar empréstimo para teste');

        const emprestimoEncontrado = await repository.buscarPorId(emprestimoSalvo.getId());
        expect(emprestimoEncontrado).not.toBeNull();
        expect(emprestimoEncontrado?.getLivro().getTitulo()).toBe('Dom Casmurro');
        expect(emprestimoEncontrado?.getUsuario().getNome()).toBe('Maria Santos');
    });

    it('deve atualizar um empréstimo', async () => {
        const emprestimoSalvo = await repository.criar(emprestimoTeste);
        if (!emprestimoSalvo) throw new Error('Falha ao criar empréstimo para teste');

        const dataDevolucao = new Date();
        emprestimoSalvo.realizarDevolucao(dataDevolucao);
        
        const atualizado = await repository.atualizar(emprestimoSalvo);
        expect(atualizado).toBe(true);

        const emprestimoAtualizado = await repository.buscarPorId(emprestimoSalvo.getId());
        expect(emprestimoAtualizado?.getStatus()).toBe(StatusEmprestimo.DEVOLVIDO);
    });

    it('deve deletar um empréstimo', async () => {
        const emprestimoSalvo = await repository.criar(emprestimoTeste);
        if (!emprestimoSalvo) throw new Error('Falha ao criar empréstimo para teste');

        const deletado = await repository.deletar(emprestimoSalvo.getId());
        expect(deletado).toBe(true);

        const emprestimoEncontrado = await repository.buscarPorId(emprestimoSalvo.getId());
        expect(emprestimoEncontrado).toBeNull();
    });

    it('deve buscar todos os empréstimos', async () => {
        await repository.criar(emprestimoTeste);
        
        const outroEmprestimo = new Emprestimo(
            0,
            livroTeste,
            usuarioTeste,
            new Date(),
            new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        );
        await repository.criar(outroEmprestimo);

        const emprestimos = await repository.buscarTodos();
        expect(emprestimos.length).toBeGreaterThanOrEqual(2);
    });
}); 