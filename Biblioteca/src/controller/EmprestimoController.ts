import { Request, Response } from 'express';
import { EmprestimoService } from '../service/EmprestimoService';

export class EmprestimoController {
    constructor(private emprestimoService: EmprestimoService) {}

    async realizarEmprestimo(req: Request, res: Response) {
        try {
            const { livroId, usuarioId } = req.body;
            
            const emprestimo = await this.emprestimoService.realizarEmprestimo(livroId, usuarioId);
            if (emprestimo) {
                res.status(201).json(emprestimo);
            } else {
                res.status(400).json({ mensagem: 'Erro ao realizar empréstimo' });
            }
        } catch (error: any) {
            if (error.message) {
                res.status(400).json({ mensagem: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
        }
    }

    async realizarDevolucao(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const devolvido = await this.emprestimoService.realizarDevolucao(id);
            
            if (devolvido) {
                res.status(200).json({ mensagem: 'Devolução realizada com sucesso' });
            } else {
                res.status(400).json({ mensagem: 'Erro ao realizar devolução' });
            }
        } catch (error: any) {
            if (error.message) {
                res.status(400).json({ mensagem: error.message });
            } else {
                res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
        }
    }

    async buscarEmprestimoPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const emprestimo = await this.emprestimoService.buscarEmprestimoPorId(id);
            
            if (emprestimo) {
                res.json(emprestimo);
            } else {
                res.status(404).json({ mensagem: 'Empréstimo não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async listarEmprestimos(req: Request, res: Response) {
        try {
            const emprestimos = await this.emprestimoService.buscarTodosEmprestimos();
            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarEmprestimosPorUsuario(req: Request, res: Response) {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            const emprestimos = await this.emprestimoService.buscarEmprestimosPorUsuario(usuarioId);
            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarEmprestimosAtrasados(req: Request, res: Response) {
        try {
            const emprestimos = await this.emprestimoService.buscarEmprestimosAtrasados();
            res.json(emprestimos);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }
}
