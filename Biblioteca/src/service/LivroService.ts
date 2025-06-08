import Livro from '../model/Livro';
import { LivroRepository } from '../repositories/LivroRepository';
import { LivroCadastroDTO } from '../controller/LivroController';
import CategoriaLivro from '../model/CategoriaLivro';

export class LivroService {
    private livroRepository: LivroRepository;

    constructor(livroRepository: LivroRepository) {
        this.livroRepository = livroRepository;
    }

    async cadastrarLivro(dados: LivroCadastroDTO): Promise<Livro | null> {
        const livro = new Livro(
            null,
            dados.titulo,
            dados.autor,
            dados.anoPublicacao,
            dados.categoria
        );
        return await this.livroRepository.salvar(livro);
    }

    async buscarLivroPorId(id: number): Promise<Livro | null> {
        return await this.livroRepository.buscarPorId(id);
    }

    async buscarTodosLivros(): Promise<Livro[]> {
        return await this.livroRepository.buscarTodos();
    }

    async listarLivros(): Promise<Livro[]> {
        return await this.livroRepository.buscarTodos();
    }

    async atualizarLivro(livro: Livro): Promise<boolean> {
        return await this.livroRepository.atualizar(livro);
    }

    async deletarLivro(id: number): Promise<boolean> {
        return await this.livroRepository.deletar(id);
    }

    // Função recursiva para busca parcial por título
    async buscarLivrosPorTituloParcial(titulo: string): Promise<Livro[]> {
        return await this.livroRepository.buscarPorTituloParcial(titulo);
    }

    // Verifica se um livro está disponível para empréstimo
    async verificarDisponibilidadeLivro(livroId: number): Promise<boolean> {
        const livro = await this.buscarLivroPorId(livroId);
        if (!livro) return false;
        
        // Aqui você pode adicionar mais lógica de verificação de disponibilidade
        // Por exemplo, verificar se não está emprestado no momento
        return true;
    }

    async buscarLivrosDisponiveis(): Promise<Livro[]> {
        const todosLivros = await this.buscarTodosLivros();
        const livrosDisponiveis: Livro[] = [];

        for (const livro of todosLivros) {
            const id = livro.getId();
            if (id !== null) {
                const disponivel = await this.verificarDisponibilidadeLivro(id);
                if (disponivel) {
                    livrosDisponiveis.push(livro);
                }
            }
        }

        return livrosDisponiveis;
    }

    async buscarLivrosPorCategoria(categoria: CategoriaLivro): Promise<Livro[]> {
        try {
            return await this.livroRepository.buscarLivrosPorCategoria(categoria);
        } catch (error) {
            console.error('Erro ao buscar livros por categoria:', error);
            throw error;
        }
    }
} 