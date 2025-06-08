import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import Usuario from '../model/Usuario';

export class UsuarioRepository extends BaseRepository {
    private readonly TABLE_NAME = 'usuarios';

    constructor(db: SupabaseClient) {
        super(db);
    }

    async salvar(usuario: Usuario): Promise<Usuario | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .insert({
                    matricula: usuario.getMatricula(),
                    nome: usuario.getNome(),
                    email: usuario.getEmail(),
                    telefone: usuario.getTelefone()
                })
                .select()
                .single();

            if (error) {
                console.error('Erro ao salvar usuário:', error);
                return null;
            }

            return new Usuario(
                data.id,
                data.matricula,
                data.nome,
                data.email,
                data.telefone
            );
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            return null;
        }
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('id', id)
                .single();

            if (error || !data) {
                return null;
            }

            return new Usuario(
                data.id,
                data.matricula,
                data.nome,
                data.email,
                data.telefone
            );
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    async buscarPorMatricula(matricula: string): Promise<Usuario | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('matricula', matricula)
                .single();

            if (error || !data) {
                return null;
            }

            return new Usuario(
                data.id,
                data.matricula,
                data.nome,
                data.email,
                data.telefone
            );
        } catch (error) {
            console.error('Erro ao buscar usuário por matrícula:', error);
            return null;
        }
    }

    async buscarTodos(): Promise<Usuario[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .order('nome');

            if (error || !data) {
                return [];
            }

            return data.map(item => new Usuario(
                item.id,
                item.matricula,
                item.nome,
                item.email,
                item.telefone
            ));
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }

    async atualizar(usuario: Usuario): Promise<boolean> {
        if (!usuario.getId()) {
            return false;
        }

        try {
            const { error } = await this.db
                .from(this.TABLE_NAME)
                .update({
                    matricula: usuario.getMatricula(),
                    nome: usuario.getNome(),
                    email: usuario.getEmail(),
                    telefone: usuario.getTelefone()
                })
                .eq('id', usuario.getId());

            return !error;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
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
            console.error('Erro ao deletar usuário:', error);
            return false;
        }
    }
} 