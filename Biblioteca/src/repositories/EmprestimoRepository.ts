import { supabase } from '../config/supabase';
import Emprestimo from '../model/Emprestimo';
import { LivroRepository } from './LivroRepository';
import { UsuarioRepository } from './UsuarioRepository';
import StatusEmprestimo from '../model/StatusEmprestimo';

export class EmprestimoRepository {
    private readonly TABLE_NAME = 'emprestimos';
    private livroRepo: LivroRepository;
    private usuarioRepo: UsuarioRepository;

    constructor() {
        this.livroRepo = new LivroRepository();
        this.usuarioRepo = new UsuarioRepository();
    }

    async criar(emprestimo: Emprestimo): Promise<Emprestimo | null> {
        const dados = {
            livro_id: emprestimo.getLivro().getId(),
            usuario_id: emprestimo.getUsuario().getId(),
            data_emprestimo: emprestimo.getDataEmprestimo().toISOString(),
            data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista().toISOString(),
            data_devolucao_efetiva: emprestimo.getDataDevolucaoReal()?.toISOString() || null,
            status: emprestimo.getStatus()
        };
        
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .insert([dados])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar empréstimo:', error);
            return null;
        }

        return await this.converterParaEmprestimo(data);
    }

    async buscarTodos(): Promise<Emprestimo[]> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Erro ao buscar empréstimos:', error);
            return [];
        }

        const emprestimos = await Promise.all(data.map(d => this.converterParaEmprestimo(d)));
        return emprestimos.filter((e): e is Emprestimo => e !== null);
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        const { data, error } = await supabase
            .from(this.TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar empréstimo:', error);
            return null;
        }

        return await this.converterParaEmprestimo(data);
    }

    async atualizar(emprestimo: Emprestimo): Promise<boolean> {
        const { error } = await supabase
            .from(this.TABLE_NAME)
            .update({
                livro_id: emprestimo.getLivro().getId(),
                usuario_id: emprestimo.getUsuario().getId(),
                data_emprestimo: emprestimo.getDataEmprestimo().toISOString(),
                data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista().toISOString(),
                data_devolucao_efetiva: emprestimo.getDataDevolucaoReal()?.toISOString() || null,
                status: emprestimo.getStatus()
            })
            .eq('id', emprestimo.getId());

        if (error) {
            console.error('Erro ao atualizar empréstimo:', error);
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
            console.error('Erro ao deletar empréstimo:', error);
            return false;
        }

        return true;
    }

    private async converterParaEmprestimo(data: any): Promise<Emprestimo | null> {
        const livro = await this.livroRepo.buscarPorId(data.livro_id);
        const usuario = await this.usuarioRepo.buscarPorId(data.usuario_id);

        if (!livro || !usuario) {
            console.error('Erro ao converter empréstimo: livro ou usuário não encontrado');
            return null;
        }

        const emprestimo = new Emprestimo(
            data.id,
            livro,
            usuario,
            new Date(data.data_emprestimo),
            new Date(data.data_devolucao_prevista)
        );

        if (data.data_devolucao_efetiva) {
            emprestimo.realizarDevolucao(new Date(data.data_devolucao_efetiva));
        }

        if (data.status !== StatusEmprestimo.EM_ANDAMENTO) {
            emprestimo.setStatus(data.status as StatusEmprestimo);
        }

        return emprestimo;
    }
} 