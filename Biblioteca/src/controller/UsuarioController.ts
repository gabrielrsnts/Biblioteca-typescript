import { Request, Response } from 'express';
import { UsuarioService } from '../service/UsuarioService';
import Usuario from '../model/Usuario';

export interface UsuarioCadastroDTO {
    matricula: string;
    nome: string;
    email: string;
    telefone: string;
}

export class UsuarioController {
    constructor(private usuarioService: UsuarioService) {}

    // Método para chamadas diretas
    async cadastrarUsuarioDirectly(dados: UsuarioCadastroDTO): Promise<Usuario | null> {
        return await this.usuarioService.cadastrarUsuario(dados);
    }

    // Método para API
    async cadastrarUsuario(req: Request, res: Response) {
        try {
            const usuario = await this.usuarioService.cadastrarUsuario(req.body);
            return res.status(201).json(usuario);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async buscarUsuarioPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const usuario = await this.usuarioService.buscarUsuarioPorId(id);
            
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    // Método para chamadas diretas
    async listarUsuariosDirectly() {
        return await this.usuarioService.listarUsuarios();
    }

    // Método para API
    async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await this.usuarioService.listarUsuarios();
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Erro ao listar usuários' 
            });
        }
    }

    async atualizarUsuario(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { matricula, nome, email, telefone } = req.body;
            
            const usuarioExistente = await this.usuarioService.buscarUsuarioPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }

            usuarioExistente.setMatricula(matricula);
            usuarioExistente.setNome(nome);
            usuarioExistente.setEmail(email);
            usuarioExistente.setTelefone(telefone);

            const atualizado = await this.usuarioService.atualizarUsuario(usuarioExistente);
            if (atualizado) {
                res.json(usuarioExistente);
            } else {
                res.status(400).json({ mensagem: 'Erro ao atualizar usuário' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async deletarUsuario(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const deletado = await this.usuarioService.deletarUsuario(id);
            
            if (deletado) {
                res.status(204).send();
            } else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarUsuarioPorMatricula(req: Request, res: Response) {
        try {
            const { matricula } = req.params;
            const usuario = await this.usuarioService.buscarUsuarioPorMatricula(matricula);
            
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async verificarLimiteEmprestimos(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const podePegarEmprestado = await this.usuarioService.verificarLimiteEmprestimos(id);
            res.json({ podePegarEmprestado });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarUsuariosPorNome(req: Request, res: Response) {
        try {
            const { nome } = req.query;
            if (typeof nome !== 'string') {
                return res.status(400).json({ mensagem: 'Nome inválido' });
            }

            const usuarios = await this.usuarioService.buscarUsuariosPorNomeParcial(nome);
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarUsuarioPorIdDirectly(id: number): Promise<Usuario | null> {
        try {
            if (isNaN(id)) {
                throw new Error('ID do usuário deve ser um número válido');
            }

            if (id <= 0) {
                throw new Error('ID do usuário deve ser um número positivo');
            }

            return await this.usuarioService.buscarUsuarioPorId(id);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    async buscarUsuarioPorMatriculaDirectly(matricula: string): Promise<Usuario | null> {
        try {
            if (!matricula || matricula.trim() === '') {
                throw new Error('Matrícula não pode estar vazia');
            }

            return await this.usuarioService.buscarUsuarioPorMatricula(matricula);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }
}
