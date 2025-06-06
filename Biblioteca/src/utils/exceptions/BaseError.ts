export abstract class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype); // Correção para herança adequada
    }
} 