import { Request, Response } from 'express';
import { UsuarioController } from '../../controller/UsuarioController';
import { UsuarioService } from '../../service/UsuarioService';
import Usuario from '../../model/Usuario';

// Mock do UsuarioService
jest.mock('../../service/UsuarioService');

describe('UsuarioController', () => {
    let usuarioController: UsuarioController;
    let usuarioService: jest.Mocked<UsuarioService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUsuario: Usuario;

    beforeEach(() => {
        // Reset dos mocks
        usuarioService = new UsuarioService(null as any, null as any) as jest.Mocked<UsuarioService>;
        usuarioController = new UsuarioController(usuarioService);

        // Mock do usuário para testes
        mockUsuario = new Usuario(
            1,
            '12345',
            'João Silva',
            'joao@email.com',
            '123456789'
        );

        // Mock do response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    describe('cadastrarUsuario', () => {
        it('deve cadastrar um usuário com sucesso', async () => {
            mockRequest = {
                body: {
                    matricula: '12345',
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '123456789'
                }
            };

            usuarioService.cadastrarUsuario = jest.fn().mockResolvedValue(mockUsuario);

            await usuarioController.cadastrarUsuario(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockUsuario);
        });

        it('deve retornar erro ao falhar cadastro', async () => {
            mockRequest = {
                body: {
                    matricula: '12345',
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '123456789'
                }
            };

            usuarioService.cadastrarUsuario = jest.fn().mockResolvedValue(null);

            await usuarioController.cadastrarUsuario(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Erro ao cadastrar usuário' });
        });
    });

    describe('buscarUsuarioPorId', () => {
        it('deve retornar um usuário quando encontrado', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            usuarioService.buscarUsuarioPorId = jest.fn().mockResolvedValue(mockUsuario);

            await usuarioController.buscarUsuarioPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockUsuario);
        });

        it('deve retornar 404 quando usuário não encontrado', async () => {
            mockRequest = {
                params: { id: '999' }
            };

            usuarioService.buscarUsuarioPorId = jest.fn().mockResolvedValue(null);

            await usuarioController.buscarUsuarioPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
        });
    });

    describe('listarUsuarios', () => {
        it('deve retornar lista de usuários', async () => {
            const usuarios = [mockUsuario];
            usuarioService.buscarTodosUsuarios = jest.fn().mockResolvedValue(usuarios);

            await usuarioController.listarUsuarios(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(usuarios);
        });
    });

    describe('buscarUsuarioPorMatricula', () => {
        it('deve retornar usuário quando encontrado pela matrícula', async () => {
            mockRequest = {
                params: { matricula: '12345' }
            };

            usuarioService.buscarUsuarioPorMatricula = jest.fn().mockResolvedValue(mockUsuario);

            await usuarioController.buscarUsuarioPorMatricula(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockUsuario);
        });

        it('deve retornar 404 quando usuário não encontrado pela matrícula', async () => {
            mockRequest = {
                params: { matricula: '99999' }
            };

            usuarioService.buscarUsuarioPorMatricula = jest.fn().mockResolvedValue(null);

            await usuarioController.buscarUsuarioPorMatricula(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Usuário não encontrado' });
        });
    });

    describe('verificarLimiteEmprestimos', () => {
        it('deve retornar status do limite de empréstimos', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            usuarioService.verificarLimiteEmprestimos = jest.fn().mockResolvedValue(true);

            await usuarioController.verificarLimiteEmprestimos(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({ podePegarEmprestado: true });
        });
    });

    describe('buscarUsuariosPorNome', () => {
        it('deve retornar usuários com nome correspondente', async () => {
            mockRequest = {
                query: { nome: 'João' }
            };

            const usuarios = [mockUsuario];
            usuarioService.buscarUsuariosPorNomeParcial = jest.fn().mockResolvedValue(usuarios);

            await usuarioController.buscarUsuariosPorNome(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(usuarios);
        });

        it('deve retornar erro com nome inválido', async () => {
            mockRequest = {
                query: { nome: undefined }
            };

            await usuarioController.buscarUsuariosPorNome(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Nome inválido' });
        });
    });
}); 