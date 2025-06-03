import { supabase } from '../config/supabase';
import Livro from '../model/Livro';
import CategoriaLivro from '../model/CategoriaLivro';

export class LivroRepository {
    private readonly TABLE_NAME = 'livros';

    async criar(livro: Livro): Promise<Livro | null> {
        const dados = {
            titulo: livro.getTitulo(),
            autor: livro.getAutor(),
            ano_publicacao: livro.getAnoPublicacao(),
            categoria: livro.getCategoria()
        };
        
        console.log('Tentando criar livro com dados:', dados);
        
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .insert([dados])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar livro:', error);
            return null;
        }

        return this.converterParaLivro(data);
    }

    async buscarTodos(): Promise<Livro[]> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }

        return data.map(this.converterParaLivro);
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar livro:', error);
            return null;
        }

        return this.converterParaLivro(data);
    }

    async atualizar(livro: Livro): Promise<boolean> {
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .update({
                titulo: livro.getTitulo(),
                autor: livro.getAutor(),
                ano_publicacao: livro.getAnoPublicacao(),
                categoria: livro.getCategoria()
            })
            .eq('id', livro.getId());

        if (error) {
            console.error('Erro ao atualizar livro:', error);
            return false;
        }

        return true;
    }

    async deletar(id: number): Promise<boolean> {
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar livro:', error);
            return false;
        }

        return true;
    }

    private converterParaLivro(data: any): Livro {
        return new Livro(
            data.id,
            data.titulo,
            data.autor,
            data.ano_publicacao,
            data.categoria as CategoriaLivro
        );
    }
} 