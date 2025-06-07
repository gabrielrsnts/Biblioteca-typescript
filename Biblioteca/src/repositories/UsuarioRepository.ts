import { supabase } from '../config/supabase';
import Usuario from '../model/Usuario';
import { retryOperation } from '../utils/databaseUtils';

export class UsuarioRepository {
    private readonly TABLE_NAME = 'usuarios';

    async criar(usuario: Usuario): Promise<Usuario | null> {
        const dados = {
            matricula: usuario.getMatricula(),
            nome: usuario.getNome(),
            email: usuario.getEmail(),
            telefone: usuario.getTelefone()
        };
        
        try {
            const { data: usuarioInserido, error } = await supabase
                .from(this.TABLE_NAME)
                .insert([dados])
                .select()
                .maybeSingle();

            if (error || !usuarioInserido) {
                console.error('Erro ao criar usuário:', error);
                return null;
            }

            return this.converterParaUsuario(usuarioInserido);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return null;
        }
    }

    async buscarTodos(): Promise<Usuario[]> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select();

            if (error || !data) {
                throw new Error('Erro ao buscar usuários');
            }

            return data.map(u => this.converterParaUsuario(u));
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select()
                .eq('id', id)
                .maybeSingle();

            if (error || !data) {
                throw new Error(`Usuário não encontrado com ID: ${id}`);
            }

            return this.converterParaUsuario(data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    async atualizar(usuario: Usuario): Promise<boolean> {
        if (!usuario.getId()) {
            return false;
        }

        const dados = {
            matricula: usuario.getMatricula(),
            nome: usuario.getNome(),
            email: usuario.getEmail(),
            telefone: usuario.getTelefone()
        };

        try {
            const { error } = await supabase
                .from(this.TABLE_NAME)
                .update(dados)
                .eq('id', usuario.getId());

            return !error;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return false;
        }
    }

    async deletar(id: number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from(this.TABLE_NAME)
                .delete()
                .eq('id', id);

            return !error;
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return false;
        }
    }

    converterParaUsuario(dados: any): Usuario {
        return new Usuario(
            dados.id,
            dados.matricula,
            dados.nome,
            dados.email,
            dados.telefone
        );
    }
} 