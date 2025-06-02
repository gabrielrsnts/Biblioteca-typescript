import { BaseError } from "./BaseError";

export class LivroNaoEncontradoError extends BaseError {
    constructor(id?: number) {
        const message = id 
            ? `Livro com ID ${id} não foi encontrado.`
            : 'Livro não encontrado.';
        super(message);
        Object.setPrototypeOf(this, LivroNaoEncontradoError.prototype);
    }
} 