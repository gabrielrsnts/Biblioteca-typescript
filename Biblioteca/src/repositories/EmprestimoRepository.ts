import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './BaseRepository';
import Emprestimo from '../model/Emprestimo';
import StatusEmprestimo from '../model/StatusEmprestimo';

export class EmprestimoRepository extends BaseRepository {
    private readonly TABLE_NAME = 'emprestimos';

    constructor(db: SupabaseClient) {
        super(db);
    }

    async salvar(emprestimo: Emprestimo): Promise<Emprestimo | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .insert({
                    livro_id: emprestimo.getLivroId(),
                    usuario_id: emprestimo.getUsuarioId(),
                    data_emprestimo: emprestimo.getDataEmprestimo(),
                    data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista(),
                    data_devolucao_efetiva: emprestimo.getDataDevolucaoEfetiva(),
                    status: emprestimo.getStatus()
                })
                .select()
                .single();

            if (error) {
                console.error('Erro ao salvar empréstimo:', error);
                return null;
            }

            return new Emprestimo(
                data.id,
                data.livro_id,
                data.usuario_id,
                new Date(data.data_emprestimo),
                new Date(data.data_devolucao_prevista),
                data.data_devolucao_efetiva ? new Date(data.data_devolucao_efetiva) : null,
                data.status as StatusEmprestimo
            );
        } catch (error) {
            console.error('Erro ao salvar empréstimo:', error);
            return null;
        }
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('id', id)
                .single();

            if (error || !data) {
                return null;
            }

            return new Emprestimo(
                data.id,
                data.livro_id,
                data.usuario_id,
                new Date(data.data_emprestimo),
                new Date(data.data_devolucao_prevista),
                data.data_devolucao_efetiva ? new Date(data.data_devolucao_efetiva) : null,
                data.status as StatusEmprestimo
            );
        } catch (error) {
            console.error('Erro ao buscar empréstimo:', error);
            return null;
        }
    }

    async buscarPorLivroId(livroId: number): Promise<Emprestimo | null> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('livro_id', livroId)
                .eq('status', StatusEmprestimo.EM_ANDAMENTO)
                .single();

            if (error || !data) {
                return null;
            }

            return new Emprestimo(
                data.id,
                data.livro_id,
                data.usuario_id,
                new Date(data.data_emprestimo),
                new Date(data.data_devolucao_prevista),
                data.data_devolucao_efetiva ? new Date(data.data_devolucao_efetiva) : null,
                data.status as StatusEmprestimo
            );
        } catch (error) {
            console.error('Erro ao buscar empréstimo por livro:', error);
            return null;
        }
    }

    async buscarPorUsuarioId(usuarioId: number): Promise<Emprestimo[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select()
                .eq('usuario_id', usuarioId)
                .eq('status', StatusEmprestimo.EM_ANDAMENTO);

            if (error || !data) {
                return [];
            }

            return data.map(item => new Emprestimo(
                item.id,
                item.livro_id,
                item.usuario_id,
                new Date(item.data_emprestimo),
                new Date(item.data_devolucao_prevista),
                item.data_devolucao_efetiva ? new Date(item.data_devolucao_efetiva) : null,
                item.status as StatusEmprestimo
            ));
        } catch (error) {
            console.error('Erro ao buscar empréstimos do usuário:', error);
            return [];
        }
    }

    async buscarTodos(): Promise<Emprestimo[]> {
        try {
            const { data, error } = await this.db
                .from(this.TABLE_NAME)
                .select();

            if (error || !data) {
                return [];
            }

            return data.map(item => new Emprestimo(
                item.id,
                item.livro_id,
                item.usuario_id,
                new Date(item.data_emprestimo),
                new Date(item.data_devolucao_prevista),
                item.data_devolucao_efetiva ? new Date(item.data_devolucao_efetiva) : null,
                item.status as StatusEmprestimo
            ));
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            return [];
        }
    }

    async atualizar(emprestimo: Emprestimo): Promise<boolean> {
        if (!emprestimo.getId()) {
            return false;
        }

        try {
            const { error } = await this.db
                .from(this.TABLE_NAME)
                .update({
                    livro_id: emprestimo.getLivroId(),
                    usuario_id: emprestimo.getUsuarioId(),
                    data_emprestimo: emprestimo.getDataEmprestimo(),
                    data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista(),
                    data_devolucao_efetiva: emprestimo.getDataDevolucaoEfetiva(),
                    status: emprestimo.getStatus()
                })
                .eq('id', emprestimo.getId());

            return !error;
        } catch (error) {
            console.error('Erro ao atualizar empréstimo:', error);
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
            console.error('Erro ao deletar empréstimo:', error);
            return false;
        }
    }
} 