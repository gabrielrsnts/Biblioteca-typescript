import Usuario from '../model/Usuario';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import StatusEmprestimo from '../model/StatusEmprestimo';
import Emprestimo from '../model/Emprestimo';

export class UsuarioService {
    private usuarioRepository: UsuarioRepository;
    private emprestimoRepository: EmprestimoRepository;

    constructor(
        usuarioRepository: UsuarioRepository,
        emprestimoRepository: EmprestimoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.emprestimoRepository = emprestimoRepository;
    }

    async cadastrarUsuario(usuario: Usuario): Promise<Usuario | null> {
        return await this.usuarioRepository.criar(usuario);
    }

    async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
        return await this.usuarioRepository.buscarPorId(id);
    }

    async buscarTodosUsuarios(): Promise<Usuario[]> {
        return await this.usuarioRepository.buscarTodos();
    }

    async atualizarUsuario(usuario: Usuario): Promise<boolean> {
        return await this.usuarioRepository.atualizar(usuario);
    }

    async deletarUsuario(id: number): Promise<boolean> {
        return await this.usuarioRepository.deletar(id);
    }

    // Verifica se o usuário pode realizar novo empréstimo
    async verificarLimiteEmprestimos(usuarioId: number): Promise<boolean> {
        const todosEmprestimos = await this.emprestimoRepository.buscarTodos();
        const emprestimosDoUsuario = todosEmprestimos.filter(emp => emp.getUsuario().getId() === usuarioId);
        
        // Filtra apenas empréstimos ativos
        const quantidadeEmprestimosAtivos = emprestimosDoUsuario.filter(
            (emp: Emprestimo) => emp.getStatus() === StatusEmprestimo.EM_ANDAMENTO || 
                   emp.getStatus() === StatusEmprestimo.ATRASADO
        ).length;

        // Limite máximo de 3 livros por usuário
        return quantidadeEmprestimosAtivos < 3;
    }

    // Busca recursiva por nome parcial
    async buscarUsuariosPorNomeParcial(nome: string): Promise<Usuario[]> {
        const todosUsuarios = await this.buscarTodosUsuarios();
        return this.filtrarUsuariosPorNome(todosUsuarios, nome.toLowerCase());
    }

    private filtrarUsuariosPorNome(usuarios: Usuario[], nome: string): Usuario[] {
        if (usuarios.length === 0) return [];
        
        const [primeiro, ...resto] = usuarios;
        const matches = primeiro.getNome().toLowerCase().includes(nome);
        
        return matches 
            ? [primeiro, ...this.filtrarUsuariosPorNome(resto, nome)]
            : this.filtrarUsuariosPorNome(resto, nome);
    }

    // Busca por matrícula
    async buscarUsuarioPorMatricula(matricula: string): Promise<Usuario | null> {
        const todosUsuarios = await this.buscarTodosUsuarios();
        return todosUsuarios.find(usuario => usuario.getMatricula() === matricula) || null;
    }
} 