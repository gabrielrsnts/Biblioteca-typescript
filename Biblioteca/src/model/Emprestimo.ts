import Livro from './Livro';
import Usuario from './Usuario';
import StatusEmprestimo from './StatusEmprestimo';

class Emprestimo {
    private id: number;
    private livro: Livro;
    private usuario: Usuario;
    private dataEmprestimo: Date;
    private dataDevolucaoPrevista: Date;
    private dataDevolucaoReal: Date | null;
    private status: StatusEmprestimo;

    constructor(
        id: number,
        livro: Livro,
        usuario: Usuario,
        dataEmprestimo: Date,
        dataDevolucaoPrevista: Date
    ) {
        this.id = id;
        this.livro = livro;
        this.usuario = usuario;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
        this.dataDevolucaoReal = null;
        this.status = StatusEmprestimo.EM_ANDAMENTO;
    }

    // Getters
    public getId(): number {
        return this.id;
    }

    public getLivro(): Livro {
        return this.livro;
    }

    public getUsuario(): Usuario {
        return this.usuario;
    }

    public getDataEmprestimo(): Date {
        return this.dataEmprestimo;
    }

    public getDataDevolucaoPrevista(): Date {
        return this.dataDevolucaoPrevista;
    }

    public getDataDevolucaoReal(): Date | null {
        return this.dataDevolucaoReal;
    }

    public getStatus(): StatusEmprestimo {
        return this.status;
    }

    // Setters
    public setLivro(livro: Livro): void {
        this.livro = livro;
    }

    public setUsuario(usuario: Usuario): void {
        this.usuario = usuario;
    }

    public setDataEmprestimo(dataEmprestimo: Date): void {
        this.dataEmprestimo = dataEmprestimo;
    }

    public setDataDevolucaoPrevista(data: Date): void {
        this.dataDevolucaoPrevista = data;
    }

    public setDataDevolucaoReal(data: Date): void {
        this.dataDevolucaoReal = data;
    }

    public setStatus(status: StatusEmprestimo): void {
        this.status = status;
    }

    // Métodos
    public realizarDevolucao(dataDevolucao: Date): void {
        this.dataDevolucaoReal = dataDevolucao;
        this.status = StatusEmprestimo.DEVOLVIDO;
    }

    public renovarEmprestimo(novaDataDevolucao: Date): void {
        this.dataDevolucaoPrevista = novaDataDevolucao;
        this.status = StatusEmprestimo.EM_ANDAMENTO;
    }

    public cancelarEmprestimo(): void {
        this.status = StatusEmprestimo.CANCELADO;
    }

    public atualizarStatus(): void {
        if (this.status !== StatusEmprestimo.DEVOLVIDO && 
            this.status !== StatusEmprestimo.CANCELADO) {
            if (new Date() > this.dataDevolucaoPrevista) {
                this.status = StatusEmprestimo.ATRASADO;
            }
        }
    }
}

export default Emprestimo; 