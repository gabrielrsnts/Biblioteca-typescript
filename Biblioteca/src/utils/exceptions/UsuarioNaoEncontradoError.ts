import { BaseError } from "./BaseError";

export class UsuarioNaoEncontradoError extends BaseError {
    constructor(id?: number) {
        const message = id 
            ? `Usuário com ID ${id} não foi encontrado.`
            : 'Usuário não encontrado.';
        super(message);
        Object.setPrototypeOf(this, UsuarioNaoEncontradoError.prototype);
    }
} 