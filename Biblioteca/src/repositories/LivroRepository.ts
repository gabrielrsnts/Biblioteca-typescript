import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';
import StatusEmprestimo from '../model/StatusEmprestimo';

export class LivroRepository extends BaseRepository {
    private readonly TABLE_NAME = 'livros';

    constructor(db: SupabaseClient) {
        super(db);
    }

    async salvar(livro: Livro): Promise<Livro | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .insert({
                    titulo: livro.getTitulo(),
                    autor: livro.getAutor(),
                    ano_publicacao: livro.getAnoPublicacao(),
                    categoria: livro.getCategoria()
                })
                .select()
                .single();

            if (error) {
                console.error('Erro ao salvar livro:', error);
                return null;
            }

            return new Livro(
                data.id,
                data.titulo,
                data.autor,
                data.ano_publicacao,
                data.categoria as CategoriaLivro
            );
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            return null;
        }
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('id', id)
                .single();

            if (error || !data) {
                return null;
            }

            return new Livro(
                data.id,
                data.titulo,
                data.autor,
                data.ano_publicacao,
                data.categoria as CategoriaLivro
            );
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            return null;
        }
    }

    async buscarTodos(): Promise<Livro[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .order('titulo');

            if (error || !data) {
                return [];
            }

            return data.map(item => new Livro(
                item.id,
                item.titulo,
                item.autor,
                item.ano_publicacao,
                item.categoria as CategoriaLivro
            ));
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }
    }

    async atualizar(livro: Livro): Promise<boolean> {
        if (!livro.getId()) {
            return false;
        }

        try {
            const { error } = await this.db
                .from(this.TABLE_NAME)
                .update({
                    titulo: livro.getTitulo(),
                    autor: livro.getAutor(),
                    ano_publicacao: livro.getAnoPublicacao(),
                    categoria: livro.getCategoria()
                })
                .eq('id', livro.getId());

            return !error;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            return false;
        }
    }

    async deletar(id: number): Promise<boolean> {
        try {
            const { error } = await this.db
                .from(this.TABLE_NAME)
                .delete()
                .eq('id', id);

            return !error;
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return false;
        }
    }

    async buscarPorTituloParcial(titulo: string): Promise<Livro[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .ilike('titulo', `%${titulo}%`)
                .order('titulo');

            if (error || !data) {
                return [];
            }

            return data.map(item => new Livro(
                item.id,
                item.titulo,
                item.autor,
                item.ano_publicacao,
                item.categoria as CategoriaLivro
            ));
        } catch (error) {
            console.error('Erro ao buscar livros por título:', error);
            return [];
        }
    }

    async buscarLivrosEmprestados(): Promise<Livro[]> {
        try {
            const { data: emprestimos, error: emprestimosError } = await this.db
                .from('emprestimos')
                .select('livro_id')
                .eq('status', StatusEmprestimo.EM_ANDAMENTO);

            if (emprestimosError || !emprestimos) {
                return [];
            }

            const livrosIds = emprestimos.map(emp => emp.livro_id);

            if (livrosIds.length === 0) {
                return [];
            }

            const { data: livros, error: livrosError } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .in('id', livrosIds);

            if (livrosError || !livros) {
                return [];
            }

            return livros.map(livro => new Livro(
                livro.id,
                livro.titulo,
                livro.autor,
                livro.ano_publicacao,
                livro.categoria
            ));
        } catch (error) {
            console.error('Erro ao buscar livros emprestados:', error);
            return [];
        }
    }

    async buscarLivrosDisponiveis(): Promise<Livro[]> {
        try {
            // Primeiro, buscar os IDs dos livros que estão emprestados
            const { data: emprestimos, error: emprestimosError } = await this.db
                .from('emprestimos')
                .select('livro_id')
                .eq('status', StatusEmprestimo.EM_ANDAMENTO);

            if (emprestimosError) {
                throw emprestimosError;
            }

            const livrosEmprestadosIds = emprestimos?.map(emp => emp.livro_id) || [];

            // Depois, buscar todos os livros que não estão na lista de emprestados
            const { data: livros, error: livrosError } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .not('id', 'in', livrosEmprestadosIds);

            if (livrosError || !livros) {
                return [];
            }

            return livros.map(livro => new Livro(
                livro.id,
                livro.titulo,
                livro.autor,
                livro.ano_publicacao,
                livro.categoria
            ));
        } catch (error) {
            console.error('Erro ao buscar livros disponíveis:', error);
            return [];
        }
    }

    async verificarDisponibilidade(id: number): Promise<boolean> {
        try {
            const { data, error } = await this.db
                .from('emprestimos')
                .select()
                .eq('livro_id', id)
                .eq('status', StatusEmprestimo.EM_ANDAMENTO)
                .single();

            if (error) {
                return true; // Se houver erro, assumimos que o livro está disponível
            }

            return !data; // Se não encontrar empréstimo ativo, o livro está disponível
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return false;
        }
    }

    async buscarLivrosPorCategoria(categoria: CategoriaLivro): Promise<Livro[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select('*')
                .eq('categoria', categoria);

            if (error) {
                throw error;
            }

            return data.map(livro => new Livro(
                livro.id,
                livro.titulo,
                livro.autor,
                livro.ano_publicacao,
                livro.categoria
            ));
        } catch (error) {
            console.error('Erro ao buscar livros por categoria:', error);
            throw error;
        }
    }
} 