import { Request, Response } from 'express';
import { LivroController } from '../../controller/LivroController';
import { LivroService } from '../../service/LivroService';
import Livro from '../../model/Livro';
import CategoriaLivro from '../../model/CategoriaLivro';

// Mock do LivroService
jest.mock('../../service/LivroService');

describe('LivroController', () => {
    let livroController: LivroController;
    let livroService: jest.Mocked<LivroService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockLivro: Livro;

    beforeEach(() => {
        // Reset dos mocks
        livroService = new LivroService(null as any) as jest.Mocked<LivroService>;
        livroController = new LivroController(livroService);

        // Mock do livro para testes
        mockLivro = new Livro(
            1,
            'O Senhor dos Anéis',
            'J.R.R. Tolkien',
            1954,
            CategoriaLivro.FANTASIA
        );

        // Mock do response
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    describe('cadastrarLivro', () => {
        it('deve cadastrar um livro com sucesso', async () => {
            mockRequest = {
                body: {
                    titulo: 'O Senhor dos Anéis',
                    autor: 'J.R.R. Tolkien',
                    anoPublicacao: 1954,
                    categoria: CategoriaLivro.FANTASIA
                }
            };

            livroService.cadastrarLivro = jest.fn().mockResolvedValue(mockLivro);

            await livroController.cadastrarLivro(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockLivro);
        });

        it('deve retornar erro ao falhar cadastro', async () => {
            mockRequest = {
                body: {
                    titulo: 'O Senhor dos Anéis',
                    autor: 'J.R.R. Tolkien',
                    anoPublicacao: 1954,
                    categoria: CategoriaLivro.FANTASIA
                }
            };

            livroService.cadastrarLivro = jest.fn().mockResolvedValue(null);

            await livroController.cadastrarLivro(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Erro ao cadastrar livro' });
        });
    });

    describe('buscarLivroPorId', () => {
        it('deve retornar um livro quando encontrado', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            livroService.buscarLivroPorId = jest.fn().mockResolvedValue(mockLivro);

            await livroController.buscarLivroPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockLivro);
        });

        it('deve retornar 404 quando livro não encontrado', async () => {
            mockRequest = {
                params: { id: '999' }
            };

            livroService.buscarLivroPorId = jest.fn().mockResolvedValue(null);

            await livroController.buscarLivroPorId(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Livro não encontrado' });
        });
    });

    describe('listarLivros', () => {
        it('deve retornar lista de livros', async () => {
            const livros = [mockLivro];
            livroService.buscarTodosLivros = jest.fn().mockResolvedValue(livros);

            await livroController.listarLivros(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(livros);
        });
    });

    describe('buscarLivrosPorTitulo', () => {
        it('deve retornar livros com título correspondente', async () => {
            mockRequest = {
                query: { titulo: 'Senhor' }
            };

            const livros = [mockLivro];
            livroService.buscarLivrosPorTituloParcial = jest.fn().mockResolvedValue(livros);

            await livroController.buscarLivrosPorTitulo(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(livros);
        });

        it('deve retornar erro com título inválido', async () => {
            mockRequest = {
                query: { titulo: undefined }
            };

            await livroController.buscarLivrosPorTitulo(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Título inválido' });
        });
    });

    describe('verificarDisponibilidade', () => {
        it('deve retornar status de disponibilidade do livro', async () => {
            mockRequest = {
                params: { id: '1' }
            };

            livroService.verificarDisponibilidadeLivro = jest.fn().mockResolvedValue(true);

            await livroController.verificarDisponibilidade(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({ disponivel: true });
        });
    });
}); 