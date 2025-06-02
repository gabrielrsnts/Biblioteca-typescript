import StatusLivro from './StatusLivro';
import CategoriaLivro from './CategoriaLivro';

class Livro {
    private id: number;
    private titulo: string;
    private autor: string;
    private anoPublicacao: number;
    private status: StatusLivro;
    private categoria: CategoriaLivro;

    constructor(
        id: number,
        titulo: string,
        autor: string,
        anoPublicacao: number,
        categoria: CategoriaLivro
    ) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.status = StatusLivro.DISPONIVEL;
        this.categoria = categoria;
    }

    // Getters
    public getId(): number {
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

    public getStatus(): StatusLivro {
        return this.status;
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
        this.status = status;
    }

    public setCategoria(categoria: CategoriaLivro): void {
        this.categoria = categoria;
    }
}

export default Livro; 