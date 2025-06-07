import { Request, Response } from 'express';
import { EmprestimoController } from '../../controller/EmprestimoController';
import { EmprestimoService } from '../../service/EmprestimoService';
import Emprestimo from '../../model/Emprestimo';
import Livro from '../../model/Livro';
import Usuario from '../../model/Usuario';
import CategoriaLivro from '../../model/CategoriaLivro';
import StatusEmprestimo from '../../model/StatusEmprestimo';

// Mock do EmprestimoService
jest.mock('../../service/EmprestimoService');

describe('EmprestimoController', () => {
    let emprestimoController: EmprestimoController;
    let emprestimoService: jest.Mocked<EmprestimoService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockEmprestimo: Emprestimo;
    let mockLivro: Livro;
    let mockUsuario: Usuario;

    beforeEach(() => {
        // Reset dos mocks
        emprestimoService = new EmprestimoService(null as any, null as any, null as any) as jest.Mocked<EmprestimoService>;
        emprestimoController = new EmprestimoController(emprestimoService);

        // Mock do livro e usuário para testes
        mockLivro = new Livro(1, 'O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, CategoriaLivro.FANTASIA);
        mockUsuario = new Usuario(1, '12345', 'João Silva', 'joao@email.com', '123456789');

        // Mock do empréstimo para testes
        const dataEmprestimo = new Date();
        const dataDevolucaoPrevista = new Date();
        dataDevolucaoPrevista.setDate(dataEmprestimo.getDate() + 15);

        mockEmprestimo = new Emprestimo(
            1,
            mockLivro,
            mockUsuario,
            dataEmprestimo,
            dataDevolucaoPrevista
        );

        // Mock do response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    describe('realizarEmprestimo', () => {
        it('deve realizar um empréstimo com sucesso', async () => {
            mockRequest = {
                body: {
                    livroId: 1,
                    usuarioId: 1
                }
            };

            emprestimoService.realizarEmprestimo = jest.fn().mockResolvedValue(mockEmprestimo);

            await emprestimoController.realizarEmprestimo(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockEmprestimo);
        });

        it('deve retornar erro quando empréstimo falha', async () => {
            mockRequest = {
                body: {
                    livroId: 1,
                    usuarioId: 1
                }
            };

            const erro = new Error('Livro não disponível');
            emprestimoService.realizarEmprestimo = jest.fn().mockRejectedValue(erro);

            await emprestimoController.realizarEmprestimo(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Livro não disponível' });
        });
    });

    describe('realizarDevolucao', () => {
        it('deve realizar uma devolução com sucesso', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            emprestimoService.realizarDevolucao = jest.fn().mockResolvedValue(true);

            await emprestimoController.realizarDevolucao(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Devolução realizada com sucesso' });
        });

        it('deve retornar erro quando devolução falha', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            emprestimoService.realizarDevolucao = jest.fn().mockResolvedValue(false);

            await emprestimoController.realizarDevolucao(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Erro ao realizar devolução' });
        });
    });

    describe('buscarEmprestimoPorId', () => {
        it('deve retornar um empréstimo quando encontrado', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            emprestimoService.buscarEmprestimoPorId = jest.fn().mockResolvedValue(mockEmprestimo);

            await emprestimoController.buscarEmprestimoPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockEmprestimo);
        });

        it('deve retornar 404 quando empréstimo não encontrado', async () => {
            mockRequest = {
                params: { id: '999' }
            };

            emprestimoService.buscarEmprestimoPorId = jest.fn().mockResolvedValue(null);

            await emprestimoController.buscarEmprestimoPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Empréstimo não encontrado' });
        });
    });

    describe('listarEmprestimos', () => {
        it('deve retornar lista de empréstimos', async () => {
            const emprestimos = [mockEmprestimo];
            emprestimoService.buscarTodosEmprestimos = jest.fn().mockResolvedValue(emprestimos);

            await emprestimoController.listarEmprestimos(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(emprestimos);
        });
    });

    describe('buscarEmprestimosPorUsuario', () => {
        it('deve retornar empréstimos de um usuário', async () => {
            mockRequest = {
                params: { usuarioId: '1' }
            };

            const emprestimos = [mockEmprestimo];
            emprestimoService.buscarEmprestimosPorUsuario = jest.fn().mockResolvedValue(emprestimos);

            await emprestimoController.buscarEmprestimosPorUsuario(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(emprestimos);
        });
    });

    describe('buscarEmprestimosAtrasados', () => {
        it('deve retornar lista de empréstimos atrasados', async () => {
            const emprestimosAtrasados = [mockEmprestimo];
            emprestimoService.buscarEmprestimosAtrasados = jest.fn().mockResolvedValue(emprestimosAtrasados);

            await emprestimoController.buscarEmprestimosAtrasados(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(emprestimosAtrasados);
        });
    });
}); 