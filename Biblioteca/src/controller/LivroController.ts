import { Request, Response } from 'express';
import { LivroService } from '../service/LivroService';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';

export class LivroController {
    constructor(private livroService: LivroService) {}

    async cadastrarLivro(req: Request, res: Response) {
        try {
            const { titulo, autor, anoPublicacao, categoria } = req.body;
            
            const livro = new Livro(
                null as any,
                titulo,
                autor,
                anoPublicacao,
                categoria as CategoriaLivro
            );

            const livroSalvo = await this.livroService.cadastrarLivro(livro);
            if (livroSalvo) {
                res.status(201).json(livroSalvo);
            } else {
                res.status(400).json({ mensagem: 'Erro ao cadastrar livro' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
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

    async listarLivros(req: Request, res: Response) {
        try {
            const livros = await this.livroService.buscarTodosLivros();
            res.json(livros);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
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
}
