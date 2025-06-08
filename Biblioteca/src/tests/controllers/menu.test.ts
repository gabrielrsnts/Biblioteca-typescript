import { LivroController } from '../../controller/LivroController';
import { UsuarioController } from '../../controller/UsuarioController';
import EmprestimoController from '../../controller/EmprestimoController';
import { LivroService } from '../../service/LivroService';
import { UsuarioService } from '../../service/UsuarioService';
import EmprestimoService from '../../service/EmprestimoService';
import { LivroRepository } from '../../repositories/LivroRepository';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';
import { EmprestimoRepository } from '../../repositories/EmprestimoRepository';
import { supabase } from '../../config/supabase';
import CategoriaLivro from '../../model/CategoriaLivro';
import Livro from '../../model/Livro';
import Usuario from '../../model/Usuario';
import Emprestimo from '../../model/Emprestimo';
import { retryOperation } from '../../utils/databaseUtils';

// Mock do prompt-sync
jest.mock('prompt-sync', () => {
    return () => jest.fn();
});

describe('Testes do Menu da Biblioteca', () => {
    let livroController: LivroController;
    let usuarioController: UsuarioController;
    let emprestimoController: EmprestimoController;
    let livroSalvo: Livro;
    let usuarioSalvo: Usuario;

    beforeAll(async () => {
        // Limpar dados das tabelas
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);

        // Inicializar repositórios
        const livroRepo = new LivroRepository(supabase);
        const usuarioRepo = new UsuarioRepository(supabase);
        const emprestimoRepo = new EmprestimoRepository(supabase);

        // Inicializar serviços
        const livroService = new LivroService(livroRepo);
        const usuarioService = new UsuarioService(usuarioRepo, emprestimoRepo);
        const emprestimoService = new EmprestimoService(emprestimoRepo, livroService, usuarioService);

        // Inicializar controllers
        livroController = new LivroController(livroService);
        usuarioController = new UsuarioController(usuarioService);
        emprestimoController = new EmprestimoController(emprestimoService);

        // Aguardar um pouco para garantir que o banco foi limpo
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    beforeEach(async () => {
        // Limpar dados das tabelas antes de cada teste
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);

        // Aguardar um pouco para garantir que o banco foi limpo
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Criar dados de teste
        const timestamp = new Date().getTime();

        // Criar livro de teste
        const livroResult = await retryOperation(async () => {
            const result = await livroController.cadastrarLivroDirectly({
                titulo: 'O Senhor dos Anéis',
                autor: 'J.R.R. Tolkien',
                anoPublicacao: 1954,
                categoria: CategoriaLivro.FANTASIA
            });
            if (!result) throw new Error('Falha ao cadastrar livro');
            return result;
        }, 3, 1000);
        livroSalvo = livroResult;

        // Aguardar um pouco antes de criar o usuário
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Criar usuário de teste
        const usuarioResult = await retryOperation(async () => {
            const result = await usuarioController.cadastrarUsuarioDirectly({
                matricula: `12345${timestamp}`,
                nome: 'João Silva',
                email: `joao${timestamp}@email.com`,
                telefone: '123456789'
            });
            if (!result) throw new Error('Falha ao cadastrar usuário');
            return result;
        }, 3, 1000);
        usuarioSalvo = usuarioResult;

        // Aguardar um pouco para garantir que os dados foram salvos
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    describe('Operações de Livro', () => {
        it('deve listar livros cadastrados', async () => {
            const livros = await livroController.listarLivrosDirectly();
            expect(livros.length).toBeGreaterThan(0);
            expect(livros[0].getTitulo()).toBe('O Senhor dos Anéis');
        });

        it('deve buscar livro por título', async () => {
            const livros = await livroController.buscarLivrosPorTituloParcial('Senhor');
            expect(livros.length).toBeGreaterThan(0);
            expect(livros[0].getTitulo()).toContain('Senhor');
        });

        it('deve listar livros disponíveis', async () => {
            const livros = await livroController.buscarLivrosDisponiveis();
            expect(livros.length).toBeGreaterThan(0);
            expect(livros[0].getTitulo()).toBe('O Senhor dos Anéis');
        });
    });

    describe('Operações de Usuário', () => {
        it('deve listar usuários cadastrados', async () => {
            const usuarios = await usuarioController.listarUsuariosDirectly();
            expect(usuarios.length).toBeGreaterThan(0);
            expect(usuarios[0].getNome()).toBe('João Silva');
        });

        it('deve buscar usuário por matrícula', async () => {
            const matricula = usuarioSalvo.getMatricula();
            const usuario = await usuarioController.buscarUsuarioPorMatriculaDirectly(matricula);
            expect(usuario).not.toBeNull();
            expect(usuario?.getNome()).toBe('João Silva');
        });
    });

    describe('Operações de Empréstimo', () => {
        it('deve realizar empréstimo com sucesso', async () => {
            const livroId = livroSalvo.getId();
            const usuarioId = usuarioSalvo.getId();
            if (!livroId || !usuarioId) throw new Error('IDs não podem ser nulos');

            // Verificar se o livro e usuário ainda existem
            const [livroExistente, usuarioExistente] = await Promise.all([
                retryOperation(() => livroController.buscarLivroPorIdDirectly(livroId)),
                retryOperation(() => usuarioController.buscarUsuarioPorIdDirectly(usuarioId))
            ]);

            expect(livroExistente).not.toBeNull();
            expect(usuarioExistente).not.toBeNull();

            const emprestimo = await retryOperation(async () => {
                const result = await emprestimoController.emprestarLivroDirectly(livroId, usuarioId);
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            }, 3, 1000);

            expect(emprestimo).not.toBeNull();
            expect(emprestimo?.getLivroId()).toBe(livroId);
            expect(emprestimo?.getUsuarioId()).toBe(usuarioId);
        });

        it('deve listar empréstimos por usuário', async () => {
            const livroId = livroSalvo.getId();
            const usuarioId = usuarioSalvo.getId();
            if (!livroId || !usuarioId) throw new Error('IDs não podem ser nulos');

            // Verificar se o livro e usuário ainda existem
            const [livroExistente, usuarioExistente] = await Promise.all([
                retryOperation(() => livroController.buscarLivroPorIdDirectly(livroId)),
                retryOperation(() => usuarioController.buscarUsuarioPorIdDirectly(usuarioId))
            ]);

            expect(livroExistente).not.toBeNull();
            expect(usuarioExistente).not.toBeNull();

            // Realizar empréstimo
            await retryOperation(async () => {
                const result = await emprestimoController.emprestarLivroDirectly(livroId, usuarioId);
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            }, 3, 1000);

            // Aguardar um pouco antes de buscar os empréstimos
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Buscar empréstimos do usuário
            const emprestimos = await retryOperation(async () => {
                const result = await emprestimoController.buscarEmprestimosPorUsuario(usuarioId);
                if (result.length === 0) throw new Error('Nenhum empréstimo encontrado');
                return result;
            }, 3, 1000);

            expect(emprestimos.length).toBeGreaterThan(0);
            expect(emprestimos[0].getUsuarioId()).toBe(usuarioId);
        });
    });
}); 