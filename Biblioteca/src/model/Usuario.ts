class Usuario {
    private id: number;
    private matricula: string;
    private nome: string;
    private email: string;
    private telefone: string;

    constructor(
        id: number,
        matricula: string,
        nome: string,
        email: string,
        telefone: string
    ) {
        this.id = id;
        this.matricula = matricula;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    // Getters
    public getId(): number {
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

export default Usuario; 