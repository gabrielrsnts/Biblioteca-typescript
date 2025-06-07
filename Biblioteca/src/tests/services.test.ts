import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import Emprestimo from '../model/Emprestimo';
import StatusEmprestimo from '../model/StatusEmprestimo';
import CategoriaLivro from '../model/CategoriaLivro';
import { LivroService } from '../service/LivroService';
import { UsuarioService } from '../service/UsuarioService';
import { EmprestimoService } from '../service/EmprestimoService';
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
        // Limpar dados das tabelas
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);

        // Inicializar serviços
        const livroRepo = new LivroRepository();
        const usuarioRepo = new UsuarioRepository();
        const emprestimoRepo = new EmprestimoRepository();

        livroService = new LivroService(livroRepo);
        usuarioService = new UsuarioService(usuarioRepo, emprestimoRepo);
        emprestimoService = new EmprestimoService(emprestimoRepo, livroService, usuarioService);
    });

    beforeEach(async () => {
        // Limpar dados das tabelas antes de cada teste
        await Promise.all([
            supabase.from('emprestimos').delete().neq('id', 0),
            supabase.from('livros').delete().neq('id', 0),
            supabase.from('usuarios').delete().neq('id', 0)
        ]);

        // Criar livro e usuário para os testes
        const livro = new Livro(
            null as any,
            'O Senhor dos Anéis',
            'J.R.R. Tolkien',
            1954,
            CategoriaLivro.FANTASIA
        );

        const livroResult = await retryOperation(async () => {
            const result = await livroService.cadastrarLivro(livro);
            if (!result) throw new Error('Falha ao cadastrar livro');
            return result;
        });
        livroSalvo = livroResult;

        const timestamp = new Date().getTime();
        const usuario = new Usuario(
            null as any,
            `12345${timestamp}`,
            'João Silva',
            `joao${timestamp}@email.com`,
            '123456789'
        );

        const usuarioResult = await retryOperation(async () => {
            const result = await usuarioService.cadastrarUsuario(usuario);
            if (!result) throw new Error('Falha ao cadastrar usuário');
            return result;
        });
        usuarioSalvo = usuarioResult;
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
            const podePegarEmprestado = await retryOperation(async () => {
                const result = await usuarioService.verificarLimiteEmprestimos(usuarioSalvo.getId());
                return result;
            });

            expect(podePegarEmprestado).toBe(true);
        });
    });

    describe('EmprestimoService', () => {
        let emprestimoSalvo: Emprestimo;

        it('deve realizar um empréstimo', async () => {
            emprestimoSalvo = await retryOperation(async () => {
                const result = await emprestimoService.realizarEmprestimo(
                    livroSalvo.getId(),
                    usuarioSalvo.getId()
                );
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            });

            expect(emprestimoSalvo.getStatus()).toBe(StatusEmprestimo.EM_ANDAMENTO);
        });

        it('não deve permitir empréstimo duplicado', async () => {
            // Verificar se o livro e usuário ainda existem
            const [livroExistente, usuarioExistente] = await Promise.all([
                retryOperation(() => livroService.buscarLivroPorId(livroSalvo.getId())),
                retryOperation(() => usuarioService.buscarUsuarioPorId(usuarioSalvo.getId()))
            ]);

            expect(livroExistente).not.toBeNull();
            expect(usuarioExistente).not.toBeNull();

            // Realizar primeiro empréstimo
            emprestimoSalvo = await retryOperation(async () => {
                const result = await emprestimoService.realizarEmprestimo(
                    livroSalvo.getId(),
                    usuarioSalvo.getId()
                );
                if (!result) throw new Error('Falha ao realizar primeiro empréstimo');
                return result;
            }, 5, 2000); // Aumentar número de tentativas e delay

            // Tentar realizar segundo empréstimo do mesmo livro
            await expect(
                emprestimoService.realizarEmprestimo(livroSalvo.getId(), usuarioSalvo.getId())
            ).rejects.toThrow('Este livro já está emprestado');
        }, 60000); // Aumentar timeout do teste para 60 segundos

        it('deve realizar devolução', async () => {
            // Realizar empréstimo
            emprestimoSalvo = await retryOperation(async () => {
                // Verificar se o livro ainda existe
                const livroExistente = await livroService.buscarLivroPorId(livroSalvo.getId());
                if (!livroExistente) throw new Error('Livro não encontrado antes do empréstimo');

                const result = await emprestimoService.realizarEmprestimo(
                    livroSalvo.getId(),
                    usuarioSalvo.getId()
                );
                if (!result) throw new Error('Falha ao realizar empréstimo');
                return result;
            });

            const devolucaoRealizada = await retryOperation(async () => {
                const result = await emprestimoService.realizarDevolucao(emprestimoSalvo.getId());
                if (!result) throw new Error('Falha ao realizar devolução');
                return result;
            });

            expect(devolucaoRealizada).toBe(true);

            // Verificar o status do empréstimo após a devolução
            const emprestimoAposDevol = await retryOperation(async () => {
                const result = await emprestimoService.buscarEmprestimoPorId(emprestimoSalvo.getId());
                if (!result) throw new Error('Empréstimo não encontrado após devolução');
                return result;
            });

            expect(emprestimoAposDevol.getStatus()).toBe(StatusEmprestimo.DEVOLVIDO);
        });
    });
}); 