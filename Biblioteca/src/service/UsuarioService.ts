import Usuario from '../model/Usuario';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import StatusEmprestimo from '../model/StatusEmprestimo';
import Emprestimo from '../model/Emprestimo';

export class UsuarioService {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private emprestimoRepository: EmprestimoRepository
    ) {}

    async cadastrarUsuario(dados: {
        matricula: string;
        nome: string;
        email: string;
        telefone: string;
    }): Promise<Usuario | null> {
        // Validar dados
        if (!dados.matricula || !dados.nome || !dados.email || !dados.telefone) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dados.email)) {
            throw new Error('Email inválido');
        }

        // Validar matrícula (apenas números e letras)
        if (!/^[A-Za-z0-9]+$/.test(dados.matricula)) {
            throw new Error('Matrícula deve conter apenas letras e números');
        }

        // Validar telefone (apenas números)
        const telefoneNumeros = dados.telefone.replace(/\D/g, '');
        if (telefoneNumeros.length < 8 || telefoneNumeros.length > 11) {
            throw new Error('Telefone inválido');
        }

        const usuario = new Usuario(
            null,
            dados.matricula,
            dados.nome,
            dados.email.toLowerCase(),
            telefoneNumeros
        );

        return await this.usuarioRepository.salvar(usuario);
    }

    async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
        return await this.usuarioRepository.buscarPorId(id);
    }

    async buscarUsuarioPorMatricula(matricula: string): Promise<Usuario | null> {
        return await this.usuarioRepository.buscarPorMatricula(matricula);
    }

    async buscarTodosUsuarios(): Promise<Usuario[]> {
        return await this.usuarioRepository.buscarTodos();
    }

    async listarUsuarios(): Promise<Usuario[]> {
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
        const emprestimosAtivos = await this.emprestimoRepository.buscarPorUsuarioId(usuarioId);
        const limiteEmprestimos = 3; // Limite máximo de empréstimos ativos por usuário
        
        return emprestimosAtivos.length < limiteEmprestimos;
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
} 