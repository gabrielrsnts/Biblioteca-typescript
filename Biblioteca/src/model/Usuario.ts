export default class Usuario {
    constructor(
        public id: number | null,
        public matricula: string,
        public nome: string,
        public email: string,
        public telefone: string
    ) {}

    public getId(): number | null {
        return this.id;
    }

    public getMatricula(): string {
        return this.matricula;
    }

    public getNome(): string {
        return this.nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    // Setters
    public setMatricula(matricula: string): void {
        this.matricula = matricula;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }
} 