import Livro from '../model/Livro';
import { LivroRepository } from '../repositories/LivroRepository';

export class LivroService {
    private livroRepository: LivroRepository;

    constructor(livroRepository: LivroRepository) {
        this.livroRepository = livroRepository;
    }

    async cadastrarLivro(livro: Livro): Promise<Livro | null> {
        return await this.livroRepository.criar(livro);
    }

    async buscarLivroPorId(id: number): Promise<Livro | null> {
        return await this.livroRepository.buscarPorId(id);
    }

    async buscarTodosLivros(): Promise<Livro[]> {
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
        const todosLivros = await this.buscarTodosLivros();
        return this.filtrarLivrosPorTitulo(todosLivros, titulo.toLowerCase());
    }

    private filtrarLivrosPorTitulo(livros: Livro[], titulo: string): Livro[] {
        if (livros.length === 0) return [];
        
        const [primeiro, ...resto] = livros;
        const matches = primeiro.getTitulo().toLowerCase().includes(titulo);
        
        return matches 
            ? [primeiro, ...this.filtrarLivrosPorTitulo(resto, titulo)]
            : this.filtrarLivrosPorTitulo(resto, titulo);
    }

    // Verifica se um livro está disponível para empréstimo
    async verificarDisponibilidadeLivro(livroId: number): Promise<boolean> {
        const livro = await this.buscarLivroPorId(livroId);
        if (!livro) return false;
        
        // Aqui você pode adicionar mais lógica de verificação de disponibilidade
        // Por exemplo, verificar se não está emprestado no momento
        return true;
    }
} 