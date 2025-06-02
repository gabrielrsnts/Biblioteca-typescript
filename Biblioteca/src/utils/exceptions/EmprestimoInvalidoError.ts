import { BaseError } from "./BaseError";

export class EmprestimoInvalidoError extends BaseError {
    constructor(motivo: string) {
        super(`Empréstimo inválido: ${motivo}.`);
        Object.setPrototypeOf(this, EmprestimoInvalidoError.prototype);
    }
} 