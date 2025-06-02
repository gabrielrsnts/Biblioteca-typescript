import * as fs from 'fs';
import * as path from 'path';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import Emprestimo from '../model/Emprestimo';

/**
 * Salva um array de dados em um arquivo JSON
 * @param nomeArquivo Nome do arquivo onde os dados serão salvos
 * @param dados Array de dados a serem salvos
 */
export function salvarEmArquivo<T>(nomeArquivo: string, dados: T[]): void {
    try {
        const jsonString = JSON.stringify(dados, null, 2);
        fs.writeFileSync(path.join(process.cwd(), nomeArquivo), jsonString, 'utf-8');
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao salvar arquivo ${nomeArquivo}: ${error.message}`);
        }
        throw new Error(`Erro ao salvar arquivo ${nomeArquivo}: Erro desconhecido`);
    }
}

/**
 * Carrega dados de um arquivo JSON
 * @param nomeArquivo Nome do arquivo a ser lido
 * @returns Array de objetos do tipo especificado
 */
export function carregarDeArquivo<T>(nomeArquivo: string): T[] {
    try {
        if (!fs.existsSync(path.join(process.cwd(), nomeArquivo))) {
            return [];
        }
        const jsonString = fs.readFileSync(path.join(process.cwd(), nomeArquivo), 'utf-8');
        return JSON.parse(jsonString) as T[];
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Erro ao carregar arquivo ${nomeArquivo}: ${error.message}`);
        }
        throw new Error(`Erro ao carregar arquivo ${nomeArquivo}: Erro desconhecido`);
    }
}

/**
 * Classe responsável por gerenciar o backup do sistema
 */
export class SistemaBackup {
    private readonly ARQUIVO_LIVROS = 'livros.json';
    private readonly ARQUIVO_USUARIOS = 'usuarios.json';
    private readonly ARQUIVO_EMPRESTIMOS = 'emprestimos.json';

    /**
     * Salva o estado atual do sistema em arquivos JSON
     */
    public salvarSistema(livros: Livro[], usuarios: Usuario[], emprestimos: Emprestimo[]): void {
        try {
            salvarEmArquivo(this.ARQUIVO_LIVROS, livros);
            salvarEmArquivo(this.ARQUIVO_USUARIOS, usuarios);
            salvarEmArquivo(this.ARQUIVO_EMPRESTIMOS, emprestimos);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao salvar o sistema: ${error.message}`);
            }
            throw new Error(`Erro ao salvar o sistema: Erro desconhecido`);
        }
    }

    /**
     * Carrega o estado do sistema a partir dos arquivos JSON
     */
    public carregarSistema(): { livros: Livro[], usuarios: Usuario[], emprestimos: Emprestimo[] } {
        try {
            const livros = carregarDeArquivo<Livro>(this.ARQUIVO_LIVROS);
            const usuarios = carregarDeArquivo<Usuario>(this.ARQUIVO_USUARIOS);
            const emprestimos = carregarDeArquivo<Emprestimo>(this.ARQUIVO_EMPRESTIMOS);

            return {
                livros,
                usuarios,
                emprestimos
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Erro ao carregar o sistema: ${error.message}`);
            }
            throw new Error(`Erro ao carregar o sistema: Erro desconhecido`);
        }
    }
}