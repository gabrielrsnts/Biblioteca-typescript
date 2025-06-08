import { Request, Response } from 'express';
import { LivroService } from '../service/LivroService';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';

export interface LivroCadastroDTO {
    titulo: string;
    autor: string;
    anoPublicacao: number;
    categoria: CategoriaLivro;
}

export class LivroController {
    constructor(private livroService: LivroService) {}

    // Método para chamadas diretas
    async cadastrarLivroDirectly(dados: LivroCadastroDTO): Promise<Livro | null> {
        return await this.livroService.cadastrarLivro(dados);
    }

    // Método para API
    async cadastrarLivro(req: Request, res: Response) {
        try {
            const livro = await this.livroService.cadastrarLivro(req.body);
            return res.status(201).json(livro);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async buscarLivroPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const livro = await this.livroService.buscarLivroPorId(id);
            
            if (livro) {
                res.json(livro);
            } else {
                res.status(404).json({ mensagem: 'Livro não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    // Método para chamadas diretas
    async listarLivrosDirectly() {
        return await this.livroService.listarLivros();
    }

    // Método para API
    async listarLivros(req: Request, res: Response) {
        try {
            const livros = await this.livroService.listarLivros();
            return res.json(livros);
        } catch (error) {
            return res.status(500).json({ 
                error: error instanceof Error ? error.message : 'Erro ao listar livros' 
            });
        }
    }

    async atualizarLivro(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { titulo, autor, anoPublicacao, categoria } = req.body;
            
            const livroExistente = await this.livroService.buscarLivroPorId(id);
            if (!livroExistente) {
                return res.status(404).json({ mensagem: 'Livro não encontrado' });
            }

            livroExistente.setTitulo(titulo);
            livroExistente.setAutor(autor);
            livroExistente.setAnoPublicacao(anoPublicacao);
            livroExistente.setCategoria(categoria);

            const atualizado = await this.livroService.atualizarLivro(livroExistente);
            if (atualizado) {
                res.json(livroExistente);
            } else {
                res.status(400).json({ mensagem: 'Erro ao atualizar livro' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async deletarLivro(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const deletado = await this.livroService.deletarLivro(id);
            
            if (deletado) {
                res.status(204).send();
            } else {
                res.status(404).json({ mensagem: 'Livro não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarLivrosPorTitulo(req: Request, res: Response) {
        try {
            const { titulo } = req.query;
            if (typeof titulo !== 'string') {
                return res.status(400).json({ mensagem: 'Título inválido' });
            }

            const livros = await this.livroService.buscarLivrosPorTituloParcial(titulo);
            res.json(livros);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async verificarDisponibilidade(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const disponivel = await this.livroService.verificarDisponibilidadeLivro(id);
            res.json({ disponivel });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    async buscarLivroPorIdDirectly(id: number): Promise<Livro | null> {
        try {
            if (isNaN(id)) {
                throw new Error('ID do livro deve ser um número válido');
            }

            if (id <= 0) {
                throw new Error('ID do livro deve ser um número positivo');
            }

            return await this.livroService.buscarLivroPorId(id);
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            return null;
        }
    }

    async buscarLivrosPorTituloParcial(titulo: string): Promise<Livro[]> {
        return await this.livroService.buscarLivrosPorTituloParcial(titulo);
    }

    async buscarLivrosDisponiveis(): Promise<Livro[]> {
        return await this.livroService.buscarLivrosDisponiveis();
    }

    async buscarLivrosPorCategoria(categoria: CategoriaLivro): Promise<Livro[]> {
        try {
            return await this.livroService.buscarLivrosPorCategoria(categoria);
        } catch (error) {
            console.error('Erro ao buscar livros por categoria:', error);
            throw error;
        }
    }
}
