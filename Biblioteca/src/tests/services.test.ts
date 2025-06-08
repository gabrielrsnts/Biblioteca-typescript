import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import Emprestimo from '../model/Emprestimo';
import StatusEmprestimo from '../model/StatusEmprestimo';
import CategoriaLivro from '../model/CategoriaLivro';
import { LivroService } from '../service/LivroService';
import { UsuarioService } from '../service/UsuarioService';
import EmprestimoService from '../service/EmprestimoService';
import { LivroRepository } from '../repositories/LivroRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { supabase } from '../config/supabase';
import { retryOperation } from '../utils/databaseUtils';

describe('Testes dos Serviços da Biblioteca', () => {
    let livroService: LivroService;
    let usuarioService: UsuarioService;
    let emprestimoService: EmprestimoService;
    let livroSalvo: Livro;
    let usuarioSalvo: Usuario;

    beforeAll(async () => {
        // Inicializar serviços
        const livroRepo = new LivroRepository(supabase);
        const usuarioRepo = new UsuarioRepository(supabase);
        const emprestimoRepo = new EmprestimoRepository(supabase);

        livroService = new LivroService(livroRepo);
        usuarioService = new UsuarioService(usuarioRepo, emprestimoRepo);
        emprestimoService = new EmprestimoService(emprestimoRepo, livroService, usuarioService);
    });

    beforeEach(async () => {
        // Criar livro e usuário para os testes
        const livro = new Livro(
            null as any,
            'Livro de Teste',
            'Autor de Teste',
            2024,
            CategoriaLivro.LITERATURA
        );

        const livroResult = await retryOperation(async () => {
            const result = await livroService.cadastrarLivro(livro);
            if (!result) throw new Error('Falha ao cadastrar livro');
            return result;
        }, 3, 1000);
        livroSalvo = livroResult;

        // Aguardar um pouco antes de criar o usuário
        await new Promise(resolve => setTimeout(resolve, 1000));

        const timestamp = new Date().getTime();
        const usuario = new Usuario(
            null as any,
            `TESTE${timestamp}`,
            'Usuário de Teste',
            `teste${timestamp}@email.com`,
            '123456789'
        );

        const usuarioResult = await retryOperation(async () => {
            const result = await usuarioService.cadastrarUsuario(usuario);
            if (!result) throw new Error('Falha ao cadastrar usuário');
            return result;
        }, 3, 1000);
        usuarioSalvo = usuarioResult;

        // Aguardar um pouco para garantir que os dados foram salvos
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    describe('LivroService', () => {
        it('deve cadastrar um novo livro', async () => {
            const livro = new Livro(
                null as any,
                'O Senhor dos Anéis',
                'J.R.R. Tolkien',
                1954,
                CategoriaLivro.FANTASIA
            );

            const novoLivro = await retryOperation(async () => {
                const result = await livroService.cadastrarLivro(livro);
                if (!result) throw new Error('Falha ao cadastrar livro');
                return result;
            });

            expect(novoLivro.getTitulo()).toBe('O Senhor dos Anéis');
        });

        it('deve buscar livro por título parcial', async () => {
            const livrosEncontrados = await retryOperation(async () => {
                const result = await livroService.buscarLivrosPorTituloParcial('Senhor');
                if (result.length === 0) throw new Error('Nenhum livro encontrado');
                return result;
            });

            expect(livrosEncontrados[0].getTitulo()).toContain('Senhor');
        });

        it('deve buscar livros por categoria', async () => {
            // Primeiro cadastra um livro de fantasia
            const livroFantasia = new Livro(
                null as any,
                'O Hobbit',
                'J.R.R. Tolkien',
                1937,
                CategoriaLivro.FANTASIA
            );

            await retryOperation(async () => {
                const result = await livroService.cadastrarLivro(livroFantasia);
                if (!result) throw new Error('Falha ao cadastrar livro de fantasia');
                return result;
            });

            // Depois cadastra um livro de literatura
            const livroLiteratura = new Livro(
                null as any,
                'Dom Casmurro',
                'Machado de Assis',
                1899,
                CategoriaLivro.LITERATURA
            );

            await retryOperation(async () => {
                const result = await livroService.cadastrarLivro(livroLiteratura);
                if (!result) throw new Error('Falha ao cadastrar livro de literatura');
                return result;
            });

            // Busca livros da categoria FANTASIA
            const livrosFantasia = await retryOperation(async () => {
                const result = await livroService.buscarLivrosPorCategoria(CategoriaLivro.FANTASIA);
                if (result.length === 0) throw new Error('Nenhum livro de fantasia encontrado');
                return result;
            });

            // Verifica se todos os livros encontrados são da categoria FANTASIA
            expect(livrosFantasia.length).toBeGreaterThan(0);
            livrosFantasia.forEach(livro => {
                expect(livro.getCategoria()).toBe(CategoriaLivro.FANTASIA);
            });

            // Busca livros da categoria LITERATURA
            const livrosLiteratura = await retryOperation(async () => {
                const result = await livroService.buscarLivrosPorCategoria(CategoriaLivro.LITERATURA);
                if (result.length === 0) throw new Error('Nenhum livro de literatura encontrado');
                return result;
            });

            // Verifica se todos os livros encontrados são da categoria LITERATURA
            expect(livrosLiteratura.length).toBeGreaterThan(0);
            livrosLiteratura.forEach(livro => {
                expect(livro.getCategoria()).toBe(CategoriaLivro.LITERATURA);
            });
        });
    });

    describe('UsuarioService', () => {
        it('deve cadastrar um novo usuário', async () => {
            const timestamp = new Date().getTime();
            const usuario = new Usuario(
                null as any,
                `12345${timestamp}`,
                'João Silva',
                `joao${timestamp}@email.com`,
                '123456789'
            );

            const novoUsuario = await retryOperation(async () => {
                const result = await usuarioService.cadastrarUsuario(usuario);
                if (!result) throw new Error('Falha ao cadastrar usuário');
                return result;
            });

            expect(novoUsuario.getNome()).toBe('João Silva');
        });

        it('deve verificar limite de empréstimos', async () => {
            const id = usuarioSalvo.getId();
            if (!id) throw new Error('ID do usuário não pode ser nulo');
            
            const podePegarEmprestado = await retryOperation(async () => {
                const result = await usuarioService.verificarLimiteEmprestimos(id);
                return result;
            });
            
            expect(podePegarEmprestado).toBe(true);
        });
    });

    describe('EmprestimoService', () => {
        let emprestimoSalvo: Emprestimo;

        it('deve realizar um empréstimo', async () => {
            // Criar um novo livro e usuário para o teste
            const timestamp = new Date().getTime();
            const livro = new Livro(
                null as any,
                'O Senhor dos Anéis',
                'J.R.R. Tolkien',
                1954,
                CategoriaLivro.FANTASIA
            );

            const usuario = new Usuario(
                null as any,
                `12345${timestamp}`,
                'João Silva',
                `joao${timestamp}@email.com`,
                '123456789'
            );

            // Salvar o livro e o usuário
            const [livroSalvo, usuarioSalvo] = await Promise.all([
                retryOperation(async () => {
                    const result = await livroService.cadastrarLivro(livro);
                    if (!result) throw new Error('Falha ao cadastrar livro');
                    return result;
                }),
                retryOperation(async () => {
                    const result = await usuarioService.cadastrarUsuario(usuario);
                    if (!result) throw new Error('Falha ao cadastrar usuário');
                    return result;
                })
            ]);

            // Aguardar um pouco antes de realizar o empréstimo
            await new Promise(resolve => setTimeout(resolve, 1000));

            const livroId = livroSalvo.getId();
            const usuarioId = usuarioSalvo.getId();
            if (!livroId || !usuarioId) throw new Error('IDs não podem ser nulos');

            emprestimoSalvo = await retryOperation(async () => {
                const result = await emprestimoService.realizarEmprestimo(
                    livroId,
                    usuarioId
                );
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            }, 3, 1000);

            expect(emprestimoSalvo.getStatus()).toBe(StatusEmprestimo.EM_ANDAMENTO);
            expect(emprestimoSalvo.getLivroId()).toBe(livroId);
            expect(emprestimoSalvo.getUsuarioId()).toBe(usuarioId);
        });

        it('deve realizar uma devolução', async () => {
            // Criar um novo livro e usuário para o teste
            const timestamp = new Date().getTime();
            const livro = new Livro(
                null as any,
                'O Hobbit',
                'J.R.R. Tolkien',
                1937,
                CategoriaLivro.FANTASIA
            );

            const usuario = new Usuario(
                null as any,
                `54321${timestamp}`,
                'Maria Silva',
                `maria${timestamp}@email.com`,
                '987654321'
            );

            // Salvar o livro e o usuário
            const [livroSalvo, usuarioSalvo] = await Promise.all([
                retryOperation(async () => {
                    const result = await livroService.cadastrarLivro(livro);
                    if (!result) throw new Error('Falha ao cadastrar livro');
                    return result;
                }),
                retryOperation(async () => {
                    const result = await usuarioService.cadastrarUsuario(usuario);
                    if (!result) throw new Error('Falha ao cadastrar usuário');
                    return result;
                })
            ]);

            // Aguardar um pouco antes de realizar o empréstimo
            await new Promise(resolve => setTimeout(resolve, 1000));

            const livroId = livroSalvo.getId();
            const usuarioId = usuarioSalvo.getId();
            if (!livroId || !usuarioId) throw new Error('IDs não podem ser nulos');

            // Realizar um empréstimo primeiro
            const emprestimo = await retryOperation(async () => {
                const result = await emprestimoService.realizarEmprestimo(livroId, usuarioId);
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            });

            // Aguardar um pouco antes de realizar a devolução
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Realizar a devolução
            const devolucaoRealizada = await retryOperation(async () => {
                const result = await emprestimoService.realizarDevolucao(emprestimo.getId()!);
                if (!result) throw new Error('Falha ao realizar devolução');
                return result;
            });

            expect(devolucaoRealizada).toBe(true);

            // Verificar se o status foi atualizado
            const emprestimoAtualizado = await emprestimoService.buscarEmprestimoPorId(emprestimo.getId()!);
            expect(emprestimoAtualizado?.getStatus()).toBe(StatusEmprestimo.DEVOLVIDO);
        });
    });
}); 