import Livro from './Livro';
import Usuario from './Usuario';
import StatusEmprestimo from './StatusEmprestimo';

export default class Emprestimo {
    constructor(
        private id: number | null,
        private livroId: number,
        private usuarioId: number,
        private dataEmprestimo: Date,
        private dataDevolucaoPrevista: Date,
        private dataDevolucaoEfetiva: Date | null = null,
        private status: StatusEmprestimo = StatusEmprestimo.EM_ANDAMENTO
    ) {}

    public getId(): number | null {
        return this.id;
    }

    public getLivroId(): number {
        return this.livroId;
    }

    public getUsuarioId(): number {
        return this.usuarioId;
    }

    public getDataEmprestimo(): Date {
        return this.dataEmprestimo;
    }

    public getDataDevolucaoPrevista(): Date {
        return this.dataDevolucaoPrevista;
    }

    public getDataDevolucaoEfetiva(): Date | null {
        return this.dataDevolucaoEfetiva;
    }

    public getStatus(): StatusEmprestimo {
        return this.status;
    }

    public setDataDevolucaoEfetiva(data: Date): void {
        this.dataDevolucaoEfetiva = data;
    }

    public setStatus(status: StatusEmprestimo): void {
        this.status = status;
    }

    // Métodos
    public realizarDevolucao(dataDevolucao: Date): void {
        this.dataDevolucaoEfetiva = dataDevolucao;
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