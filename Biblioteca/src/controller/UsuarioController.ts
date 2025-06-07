import { Request, Response } from 'express';
import { UsuarioService } from '../service/UsuarioService';
import Usuario from '../model/Usuario';

export class UsuarioController {
    constructor(private usuarioService: UsuarioService) {}

    async cadastrarUsuario(req: Request, res: Response) {
        try {
            const { matricula, nome, email, telefone } = req.body;
            
            const usuario = new Usuario(
                null as any,
                matricula,
                nome,
                email,
                telefone
            );

            const usuarioSalvo = await this.usuarioService.cadastrarUsuario(usuario);
            if (usuarioSalvo) {
                res.status(201).json(usuarioSalvo);
            } else {
                res.status(400).json({ mensagem: 'Erro ao cadastrar usuário' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
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

    async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await this.usuarioService.buscarTodosUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
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
}
