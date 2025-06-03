import Emprestimo from '../model/Emprestimo';
import StatusEmprestimo from '../model/StatusEmprestimo';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroService } from './LivroService';
import { UsuarioService } from './UsuarioService';

export class EmprestimoService {
    private emprestimoRepository: EmprestimoRepository;
    private livroService: LivroService;
    private usuarioService: UsuarioService;

    constructor(
        emprestimoRepository: EmprestimoRepository,
        livroService: LivroService,
        usuarioService: UsuarioService
    ) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroService = livroService;
        this.usuarioService = usuarioService;
    }

    async realizarEmprestimo(livroId: number, usuarioId: number): Promise<Emprestimo | null> {
        // Verifica se o livro existe e está disponível
        const livro = await this.livroService.buscarLivroPorId(livroId);
        if (!livro) {
            throw new Error('Livro não encontrado');
        }

        // Verifica se o usuário existe e pode pegar emprestado
        const usuario = await this.usuarioService.buscarUsuarioPorId(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const podePegarEmprestado = await this.usuarioService.verificarLimiteEmprestimos(usuarioId);
        if (!podePegarEmprestado) {
            throw new Error('Usuário atingiu o limite de empréstimos');
        }

        // Verifica se o livro já está emprestado
        const livroJaEmprestado = await this.verificarLivroEmprestado(livroId);
        if (livroJaEmprestado) {
            throw new Error('Este livro já está emprestado');
        }

        // Cria o novo empréstimo
        const dataEmprestimo = new Date();
        const dataDevolucaoPrevista = new Date();
        dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 15); // 15 dias de prazo

        const novoEmprestimo = new Emprestimo(
            0, // ID será gerado pelo banco
            livro,
            usuario,
            dataEmprestimo,
            dataDevolucaoPrevista
        );

        return await this.emprestimoRepository.criar(novoEmprestimo);
    }

    async realizarDevolucao(emprestimoId: number): Promise<boolean> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(emprestimoId);
        if (!emprestimo) {
            throw new Error('Empréstimo não encontrado');
        }

        const dataDevolucaoEfetiva = new Date();
        emprestimo.realizarDevolucao(dataDevolucaoEfetiva);

        return await this.emprestimoRepository.atualizar(emprestimo);
    }

    async buscarEmprestimoPorId(id: number): Promise<Emprestimo | null> {
        return await this.emprestimoRepository.buscarPorId(id);
    }

    async buscarTodosEmprestimos(): Promise<Emprestimo[]> {
        return await this.emprestimoRepository.buscarTodos();
    }

    // Verifica se um livro já está emprestado
    private async verificarLivroEmprestado(livroId: number): Promise<boolean> {
        const emprestimos = await this.buscarTodosEmprestimos();
        return this.verificarLivroEmprestadoRecursivo(emprestimos, livroId);
    }

    private verificarLivroEmprestadoRecursivo(emprestimos: Emprestimo[], livroId: number): boolean {
        if (emprestimos.length === 0) return false;
        
        const [primeiro, ...resto] = emprestimos;
        if (primeiro.getLivro().getId() === livroId &&
            primeiro.getStatus() === StatusEmprestimo.EM_ANDAMENTO) {
            return true;
        }
        
        return this.verificarLivroEmprestadoRecursivo(resto, livroId);
    }

    // Busca empréstimos por usuário
    async buscarEmprestimosPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
        const todosEmprestimos = await this.emprestimoRepository.buscarTodos();
        return todosEmprestimos.filter(emp => emp.getUsuario().getId() === usuarioId);
    }

    async buscarEmprestimosAtrasados(): Promise<Emprestimo[]> {
        const todosEmprestimos = await this.emprestimoRepository.buscarTodos();
        return this.filtrarEmprestimosAtrasados(todosEmprestimos);
    }

    private filtrarEmprestimosAtrasados(emprestimos: Emprestimo[]): Emprestimo[] {
        if (emprestimos.length === 0) return [];

        const [primeiro, ...resto] = emprestimos;
        const estaAtrasado = primeiro.getStatus() === StatusEmprestimo.ATRASADO;

        return estaAtrasado
            ? [primeiro, ...this.filtrarEmprestimosAtrasados(resto)]
            : this.filtrarEmprestimosAtrasados(resto);
    }
} 