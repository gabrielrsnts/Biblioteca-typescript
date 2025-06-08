import StatusLivro from './StatusLivro';
import CategoriaLivro from './CategoriaLivro';

export default class Livro {
    constructor(
        public id: number | null,
        public titulo: string,
        public autor: string,
        public anoPublicacao: number,
        public categoria: CategoriaLivro
    ) {}

    public getId(): number | null {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getAutor(): string {
        return this.autor;
    }

    public getAnoPublicacao(): number {
        return this.anoPublicacao;
    }

    public getCategoria(): CategoriaLivro {
        return this.categoria;
    }

    // Setters
    public setTitulo(titulo: string): void {
        this.titulo = titulo;
    }

    public setAutor(autor: string): void {
        this.autor = autor;
    }

    public setAnoPublicacao(anoPublicacao: number): void {
        this.anoPublicacao = anoPublicacao;
    }

    public setStatus(status: StatusLivro): void {
        // Implementation needed
    }

    public setCategoria(categoria: CategoriaLivro): void {
        this.categoria = categoria;
    }
} 