import Emprestimo from '../model/Emprestimo';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroService } from './LivroService';
import { UsuarioService } from './UsuarioService';
import StatusEmprestimo from '../model/StatusEmprestimo';

export default class EmprestimoService {
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

    async realizarEmprestimo(livroId: number, usuarioId: number): Promise<Emprestimo> {
        // Verificar se o livro existe
        const livro = await this.livroService.buscarLivroPorId(livroId);
        if (!livro) {
            throw new Error('Livro não encontrado');
        }

        // Verificar se o usuário existe
        const usuario = await this.usuarioService.buscarUsuarioPorId(usuarioId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar se o usuário pode pegar mais livros emprestados
        const podePegarEmprestado = await this.usuarioService.verificarLimiteEmprestimos(usuarioId);
        if (!podePegarEmprestado) {
            throw new Error('Usuário atingiu o limite de empréstimos');
        }

        // Verificar se o livro está disponível
        const livroDisponivel = await this.verificarDisponibilidadeLivro(livroId);
        if (!livroDisponivel) {
            throw new Error('Livro não está disponível para empréstimo');
        }

        // Criar o empréstimo
        const dataEmprestimo = new Date();
        const dataDevolucaoPrevista = new Date();
        dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 14); // 14 dias de prazo

        const emprestimo = new Emprestimo(
            null as any,
            livroId,
            usuarioId,
            dataEmprestimo,
            dataDevolucaoPrevista,
            null,
            StatusEmprestimo.EM_ANDAMENTO
        );

        const emprestimoSalvo = await this.emprestimoRepository.salvar(emprestimo);
        if (!emprestimoSalvo) {
            throw new Error('Erro ao salvar empréstimo');
        }

        return emprestimoSalvo;
    }

    async realizarDevolucao(emprestimoId: number): Promise<boolean> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(emprestimoId);
        if (!emprestimo) {
            throw new Error('Empréstimo não encontrado');
        }

        if (emprestimo.getStatus() === StatusEmprestimo.DEVOLVIDO) {
            throw new Error('Este livro já foi devolvido');
        }

        emprestimo.setDataDevolucaoEfetiva(new Date());
        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);

        return await this.emprestimoRepository.atualizar(emprestimo);
    }

    async verificarDisponibilidadeLivro(livroId: number): Promise<boolean> {
        const emprestimo = await this.emprestimoRepository.buscarPorLivroId(livroId);
        return !emprestimo || emprestimo.getStatus() !== StatusEmprestimo.EM_ANDAMENTO;
    }

    async buscarEmprestimoPorId(id: number): Promise<Emprestimo | null> {
        return await this.emprestimoRepository.buscarPorId(id);
    }

    async buscarEmprestimosPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
        return await this.emprestimoRepository.buscarPorUsuarioId(usuarioId);
    }

    async buscarEmprestimosAtrasados(): Promise<Emprestimo[]> {
        const emprestimos = await this.emprestimoRepository.buscarTodos();
        const hoje = new Date();
        
        return emprestimos.filter(emprestimo => {
            return emprestimo.getStatus() === StatusEmprestimo.EM_ANDAMENTO &&
                   emprestimo.getDataDevolucaoPrevista() < hoje;
        });
    }

    async listarEmprestimos(): Promise<Emprestimo[]> {
        return await this.emprestimoRepository.buscarTodos();
    }

    async buscarEmprestimosAtivos(): Promise<Emprestimo[]> {
        const emprestimos = await this.emprestimoRepository.buscarTodos();
        return emprestimos.filter(emprestimo => emprestimo.getStatus() === StatusEmprestimo.EM_ANDAMENTO);
    }
} 