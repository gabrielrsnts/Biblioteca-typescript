import { Request, Response } from 'express';
import EmprestimoService from '../service/EmprestimoService';
import Emprestimo from '../model/Emprestimo';

export default class EmprestimoController {
    private emprestimoService: EmprestimoService;

    constructor(emprestimoService: EmprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    async realizarEmprestimo(req: Request, res: Response) {
        try {
            const { livroId, usuarioId } = req.body;
            const emprestimo = await this.emprestimoService.realizarEmprestimo(livroId, usuarioId);
            return res.status(201).json(emprestimo);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async realizarEmprestimoDirectly(livroId: number, usuarioId: number): Promise<Emprestimo | null> {
        try {
            return await this.emprestimoService.realizarEmprestimo(livroId, usuarioId);
        } catch (error) {
            console.error('Erro ao realizar empréstimo:', error);
            return null;
        }
    }

    async realizarDevolucao(req: Request, res: Response) {
        try {
            const { emprestimoId } = req.body;
            const sucesso = await this.emprestimoService.realizarDevolucao(emprestimoId);
            return res.status(200).json({ sucesso });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async realizarDevolucaoDirectly(emprestimoId: number): Promise<boolean> {
        try {
            return await this.emprestimoService.realizarDevolucao(emprestimoId);
        } catch (error) {
            console.error('Erro ao realizar devolução:', error);
            return false;
        }
    }

    async buscarEmprestimoPorId(id: number): Promise<Emprestimo | null> {
        return await this.emprestimoService.buscarEmprestimoPorId(id);
    }

    async buscarEmprestimosPorUsuario(usuarioId: number): Promise<Emprestimo[]> {
        return await this.emprestimoService.buscarEmprestimosPorUsuario(usuarioId);
    }

    async listarEmprestimos(req: Request, res: Response) {
        try {
            const emprestimos = await this.emprestimoService.listarEmprestimos();
            return res.status(200).json(emprestimos);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async buscarEmprestimoPorIdDirectly(id: number): Promise<Emprestimo | null> {
        try {
            if (isNaN(id)) {
                throw new Error('ID do empréstimo deve ser um número válido');
            }

            if (id <= 0) {
                throw new Error('ID do empréstimo deve ser um número positivo');
            }

            return await this.emprestimoService.buscarEmprestimoPorId(id);
        } catch (error) {
            console.error('Erro ao buscar empréstimo:', error);
            return null;
        }
    }

    // Métodos diretos para uso via CLI
    async emprestarLivroDirectly(livroId: number, usuarioId: number): Promise<Emprestimo | null> {
        try {
            if (isNaN(livroId) || isNaN(usuarioId)) {
                throw new Error('ID do livro e ID do usuário devem ser números válidos');
            }

            if (livroId <= 0 || usuarioId <= 0) {
                throw new Error('IDs devem ser números positivos');
            }

            return await this.emprestimoService.realizarEmprestimo(livroId, usuarioId);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao realizar empréstimo:', error.message);
                throw error;
            }
            console.error('Erro ao realizar empréstimo:', error);
            return null;
        }
    }

    async listarEmprestimosDirectly(): Promise<Emprestimo[]> {
        try {
            return await this.emprestimoService.listarEmprestimos();
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error);
            return [];
        }
    }

    async buscarEmprestimosAtivos(): Promise<Emprestimo[]> {
        return await this.emprestimoService.buscarEmprestimosAtivos();
    }
}

