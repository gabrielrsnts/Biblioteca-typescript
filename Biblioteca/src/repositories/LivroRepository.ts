import { supabase } from '../config/supabase';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';
import { retryOperation } from '../utils/databaseUtils';

export class LivroRepository {
    private readonly TABLE_NAME = 'livros';

    async criar(livro: Livro): Promise<Livro | null> {
        const dados = {
            titulo: livro.getTitulo(),
            autor: livro.getAutor(),
            ano_publicacao: livro.getAnoPublicacao(),
            categoria: livro.getCategoria()
        };
        
        try {
            const livroInserido = await retryOperation(async () => {
                const { data, error } = await supabase
                    .from(this.TABLE_NAME)
                    .insert([dados])
                    .select()
                    .maybeSingle();

                if (error) throw error;
                if (!data) throw new Error('Falha ao inserir livro: nenhum dado retornado');
                
                return data;
            });

            return this.converterParaLivro(livroInserido);
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            return null;
        }
    }

    async buscarTodos(): Promise<Livro[]> {
        try {
            const data = await retryOperation(async () => {
                const { data, error } = await supabase
                    .from(this.TABLE_NAME)
                    .select('*');

                if (error) throw error;
                return data;
            });

            return data.map(this.converterParaLivro);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        try {
            const data = await retryOperation(async () => {
                const { data, error } = await supabase
                    .from(this.TABLE_NAME)
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (error) throw error;
                if (!data) throw new Error(`Livro não encontrado com ID: ${id}`);
                
                return data;
            });

            return this.converterParaLivro(data);
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            return null;
        }
    }

    async atualizar(livro: Livro): Promise<boolean> {
        try {
            await retryOperation(async () => {
                const { error } = await supabase
                    .from(this.TABLE_NAME)
                    .update({
                        titulo: livro.getTitulo(),
                        autor: livro.getAutor(),
                        ano_publicacao: livro.getAnoPublicacao(),
                        categoria: livro.getCategoria()
                    })
                    .eq('id', livro.getId());

                if (error) throw error;
                return true;
            });

            return true;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            return false;
        }
    }

    async deletar(id: number): Promise<boolean> {
        try {
            await retryOperation(async () => {
                const { error } = await supabase
                    .from(this.TABLE_NAME)
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return true;
            });

            return true;
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return false;
        }
    }

    converterParaLivro(data: any): Livro {
        return new Livro(
            data.id,
            data.titulo,
            data.autor,
            data.ano_publicacao,
            data.categoria as CategoriaLivro
        );
    }
} 