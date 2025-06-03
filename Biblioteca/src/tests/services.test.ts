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

describe('Testes dos Serviços da Biblioteca', () => {
    let livroService: LivroService;
    let usuarioService: UsuarioService;
    let emprestimoService: EmprestimoService;
    let livroSalvo: Livro | null;
    let usuarioSalvo: Usuario | null;

    beforeAll(async () => {
        // Limpar dados das tabelas
        await supabase.from('emprestimos').delete().neq('id', 0);
        await supabase.from('livros').delete().neq('id', 0);
        await supabase.from('usuarios').delete().neq('id', 0);

        // Inicializar serviços
        const livroRepo = new LivroRepository();
        const usuarioRepo = new UsuarioRepository();
        const emprestimoRepo = new EmprestimoRepository();

        livroService = new LivroService(livroRepo);
        usuarioService = new UsuarioService(usuarioRepo, emprestimoRepo);
        emprestimoService = new EmprestimoService(emprestimoRepo, livroService, usuarioService);

        // Criar livro e usuário para os testes
        const livro = new Livro(
            null as any,
            'O Senhor dos Anéis',
            'J.R.R. Tolkien',
            1954,
            CategoriaLivro.FANTASIA
        );
        livroSalvo = await livroService.cadastrarLivro(livro);

        const timestamp = new Date().getTime();
        const usuario = new Usuario(
            null as any,
            `12345${timestamp}`,
            'João Silva',
            `joao${timestamp}@email.com`,
            '123456789'
        );
        usuarioSalvo = await usuarioService.cadastrarUsuario(usuario);
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

            livroSalvo = await livroService.cadastrarLivro(livro);
            expect(livroSalvo).not.toBeNull();
            expect(livroSalvo?.getTitulo()).toBe('O Senhor dos Anéis');
        });

        it('deve buscar livro por título parcial', async () => {
            const livrosEncontrados = await livroService.buscarLivrosPorTituloParcial('Senhor');
            expect(livrosEncontrados.length).toBeGreaterThan(0);
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

            usuarioSalvo = await usuarioService.cadastrarUsuario(usuario);
            expect(usuarioSalvo).not.toBeNull();
            expect(usuarioSalvo?.getNome()).toBe('João Silva');
        });

        it('deve verificar limite de empréstimos', async () => {
            if (!usuarioSalvo) throw new Error('Usuário não foi salvo');
            
            const podePegarEmprestado = await usuarioService.verificarLimiteEmprestimos(usuarioSalvo.getId());
            expect(podePegarEmprestado).toBe(true);
        });
    });

    describe('EmprestimoService', () => {
        let emprestimoSalvo: Emprestimo | null;

        it('deve realizar um empréstimo', async () => {
            if (!livroSalvo || !usuarioSalvo) throw new Error('Livro ou usuário não foram salvos');

            emprestimoSalvo = await emprestimoService.realizarEmprestimo(
                livroSalvo.getId(),
                usuarioSalvo.getId()
            );

            expect(emprestimoSalvo).not.toBeNull();
            expect(emprestimoSalvo?.getStatus()).toBe(StatusEmprestimo.EM_ANDAMENTO);
        });

        it('não deve permitir empréstimo duplicado', async () => {
            if (!livroSalvo || !usuarioSalvo) throw new Error('Livro ou usuário não foram salvos');

            await expect(
                emprestimoService.realizarEmprestimo(livroSalvo.getId(), usuarioSalvo.getId())
            ).rejects.toThrow('Este livro já está emprestado');
        });

        it('deve realizar devolução', async () => {
            if (!emprestimoSalvo) throw new Error('Empréstimo não foi salvo');

            const devolucaoRealizada = await emprestimoService.realizarDevolucao(emprestimoSalvo.getId());
            expect(devolucaoRealizada).toBe(true);
        });
    });
}); 