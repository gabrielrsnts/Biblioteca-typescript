import { supabase } from '../config/supabase';
import Usuario from '../model/Usuario';

export class UsuarioRepository {
    private readonly TABLE_NAME = 'usuarios';

    async criar(usuario: Usuario): Promise<Usuario | null> {
        const dados = {
            id: usuario.getId(),
            matricula: usuario.getMatricula(),
            nome: usuario.getNome(),
            email: usuario.getEmail(),
            telefone: usuario.getTelefone()
        };
        
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .insert([dados])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar usuário:', error);
            return null;
        }

        return this.converterParaUsuario(data);
    }

    async buscarTodos(): Promise<Usuario[]> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }

        return data.map(this.converterParaUsuario);
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }

        return this.converterParaUsuario(data);
    }

    async atualizar(usuario: Usuario): Promise<boolean> {
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .update({
                matricula: usuario.getMatricula(),
                nome: usuario.getNome(),
                email: usuario.getEmail(),
                telefone: usuario.getTelefone()
            })
            .eq('id', usuario.getId());

        if (error) {
            console.error('Erro ao atualizar usuário:', error);
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
            console.error('Erro ao deletar usuário:', error);
            return false;
        }

        return true;
    }

    private converterParaUsuario(data: any): Usuario {
        return new Usuario(
            data.id,
            data.matricula,
            data.nome,
            data.email,
            data.telefone
        );
    }
} 