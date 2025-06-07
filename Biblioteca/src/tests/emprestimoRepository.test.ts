import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Emprestimo from '../model/Emprestimo';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import CategoriaLivro from '../model/CategoriaLivro';
import StatusEmprestimo from '../model/StatusEmprestimo';
import { supabase } from '../config/supabase';
import { retryOperation } from '../utils/databaseUtils';

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
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);
    });

    beforeEach(async () => {
        // Limpar as tabelas antes de cada teste
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);

        // Criar livro para os testes
        livroTeste = new Livro(
            null as any,
            'Dom Casmurro',
            'Machado de Assis',
            1899,
            CategoriaLivro.ROMANCE
        );
        const livroSalvo = await retryOperation(async () => {
            const result = await livroRepo.criar(livroTeste);
            if (!result) throw new Error('Falha ao criar livro para teste');
            return result;
        });
        livroTeste = livroSalvo;

        // Criar usuário para os testes
        const timestamp = new Date().getTime();
        usuarioTeste = new Usuario(
            null as any,
            `20230001${timestamp}`,
            'Maria Santos',
            `maria${timestamp}@email.com`,
            '987654321'
        );
        const usuarioSalvo = await retryOperation(async () => {
            const result = await usuarioRepo.criar(usuarioTeste);
            if (!result) throw new Error('Falha ao criar usuário para teste');
            return result;
        });
        usuarioTeste = usuarioSalvo;

        // Criar empréstimo para os testes
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
        // Verificar se o livro e usuário ainda existem
        const [livroExistente, usuarioExistente] = await Promise.all([
            retryOperation(() => livroRepo.buscarPorId(livroTeste.getId())),
            retryOperation(() => usuarioRepo.buscarPorId(usuarioTeste.getId()))
        ]);

        expect(livroExistente).not.toBeNull();
        expect(usuarioExistente).not.toBeNull();

        // Criar empréstimo com retry
        const emprestimoSalvo = await retryOperation(async () => {
            const result = await repository.criar(emprestimoTeste);
            if (!result) throw new Error('Falha ao criar empréstimo');
            return result;
        }, 5, 2000); // Aumentar número de tentativas e delay

        expect(emprestimoSalvo.getId()).toBeGreaterThan(0);
        expect(emprestimoSalvo.getStatus()).toBe(StatusEmprestimo.EM_ANDAMENTO);
        expect(emprestimoSalvo.getLivro().getId()).toBe(livroTeste.getId());
        expect(emprestimoSalvo.getUsuario().getId()).toBe(usuarioTeste.getId());
    }, 60000); // Aumentar timeout do teste para 60 segundos

    it('deve buscar um empréstimo por ID', async () => {
        const emprestimoSalvo = await retryOperation(async () => {
            const result = await repository.criar(emprestimoTeste);
            if (!result) throw new Error('Falha ao criar empréstimo para teste');
            return result;
        });

        const emprestimoEncontrado = await retryOperation(async () => {
            const result = await repository.buscarPorId(emprestimoSalvo.getId());
            if (!result) throw new Error('Empréstimo não encontrado após criação');
            return result;
        });

        expect(emprestimoEncontrado.getId()).toBe(emprestimoSalvo.getId());
        expect(emprestimoEncontrado.getLivro().getId()).toBe(livroTeste.getId());
        expect(emprestimoEncontrado.getUsuario().getId()).toBe(usuarioTeste.getId());
    });

    it('deve atualizar um empréstimo', async () => {
        const emprestimoSalvo = await retryOperation(async () => {
            const result = await repository.criar(emprestimoTeste);
            if (!result) throw new Error('Falha ao criar empréstimo para teste');
            return result;
        });

        const dataDevolucao = new Date();
        emprestimoSalvo.realizarDevolucao(dataDevolucao);

        const atualizado = await retryOperation(async () => {
            const result = await repository.atualizar(emprestimoSalvo);
            if (!result) throw new Error('Falha ao atualizar empréstimo');
            return result;
        });

        expect(atualizado).toBe(true);

        const emprestimoAtualizado = await retryOperation(async () => {
            const result = await repository.buscarPorId(emprestimoSalvo.getId());
            if (!result) throw new Error('Empréstimo não encontrado após atualização');
            return result;
        });

        expect(emprestimoAtualizado.getStatus()).toBe(StatusEmprestimo.DEVOLVIDO);
    });

    it('deve deletar um empréstimo', async () => {
        const emprestimoSalvo = await retryOperation(async () => {
            const result = await repository.criar(emprestimoTeste);
            if (!result) throw new Error('Falha ao criar empréstimo para teste');
            return result;
        });

        const deletado = await repository.deletar(emprestimoSalvo.getId());
        expect(deletado).toBe(true);

        const emprestimoEncontrado = await repository.buscarPorId(emprestimoSalvo.getId());
        expect(emprestimoEncontrado).toBeNull();
    });

    it('deve buscar todos os empréstimos', async () => {
        // Criar primeiro empréstimo
        const emprestimo1 = await retryOperation(async () => {
            const result = await repository.criar(emprestimoTeste);
            if (!result) throw new Error('Falha ao criar primeiro empréstimo para teste');
            return result;
        });

        // Criar segundo empréstimo com novo livro
        const livro2 = new Livro(
            null as any,
            'Memórias Póstumas',
            'Machado de Assis',
            1881,
            CategoriaLivro.ROMANCE
        );
        const livroSalvo2 = await retryOperation(async () => {
            const result = await livroRepo.criar(livro2);
            if (!result) throw new Error('Falha ao criar segundo livro para teste');
            return result;
        });

        const emprestimo2 = new Emprestimo(
            null as any,
            livroSalvo2,
            usuarioTeste,
            new Date(),
            new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        );

        const emprestimoSalvo2 = await retryOperation(async () => {
            const result = await repository.criar(emprestimo2);
            if (!result) throw new Error('Falha ao criar segundo empréstimo para teste');
            return result;
        });

        // Buscar todos os empréstimos
        const emprestimos = await retryOperation(async () => {
            const result = await repository.buscarTodos();
            if (result.length < 2) throw new Error('Número insuficiente de empréstimos encontrados');
            return result;
        });

        // Verificar se os empréstimos criados estão na lista
        const idsEncontrados = emprestimos.map(e => e.getId());
        expect(idsEncontrados).toContain(emprestimo1.getId());
        expect(idsEncontrados).toContain(emprestimoSalvo2.getId());
    });
}); 