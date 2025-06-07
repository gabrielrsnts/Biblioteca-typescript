import { supabase } from '../config/supabase';
import Emprestimo from '../model/Emprestimo';
import { LivroRepository } from './LivroRepository';
import { UsuarioRepository } from './UsuarioRepository';
import StatusEmprestimo from '../model/StatusEmprestimo';
import { retryOperation } from '../utils/databaseUtils';

export class EmprestimoRepository {
    private readonly TABLE_NAME = 'emprestimos';
    private livroRepo: LivroRepository;
    private usuarioRepo: UsuarioRepository;

    constructor() {
        this.livroRepo = new LivroRepository();
        this.usuarioRepo = new UsuarioRepository();
    }

    async criar(emprestimo: Emprestimo): Promise<Emprestimo | null> {
        try {
            // Verificar se o livro e usuário existem
            const [livro, usuario] = await Promise.all([
                this.livroRepo.buscarPorId(emprestimo.getLivro().getId()),
                this.usuarioRepo.buscarPorId(emprestimo.getUsuario().getId())
            ]);

            if (!livro || !usuario) {
                console.error('Livro ou usuário não encontrado');
                return null;
            }

            const dados = {
                livro_id: emprestimo.getLivro().getId(),
                usuario_id: emprestimo.getUsuario().getId(),
                data_emprestimo: emprestimo.getDataEmprestimo(),
                data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista(),
                data_devolucao_efetiva: emprestimo.getDataDevolucaoReal(),
                status: emprestimo.getStatus()
            };

            const { data: emprestimoInserido, error } = await supabase
                .from(this.TABLE_NAME)
                .insert([dados])
                .select(`
                    *,
                    livro:livros(*),
                    usuario:usuarios(*)
                `)
                .maybeSingle();

            if (error || !emprestimoInserido) {
                console.error('Erro ao criar empréstimo:', error);
                return null;
            }

            return this.converterParaEmprestimo(emprestimoInserido);
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            return null;
        }
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select(`
                    *,
                    livro:livros(*),
                    usuario:usuarios(*)
                `)
                .eq('id', id)
                .maybeSingle();

            if (error || !data) {
                throw new Error(`Empréstimo não encontrado com ID: ${id}`);
            }

            return this.converterParaEmprestimo(data);
        } catch (error) {
            console.error('Erro ao buscar empréstimo:', error);
            return null;
        }
    }

    async buscarTodos(): Promise<Emprestimo[]> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select(`
                    *,
                    livro:livros(*),
                    usuario:usuarios(*)
                `);

            if (error || !data) {
                throw new Error('Erro ao buscar empréstimos');
            }

            return data.map(e => this.converterParaEmprestimo(e));
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            return [];
        }
    }

    async atualizar(emprestimo: Emprestimo): Promise<boolean> {
        if (!emprestimo.getId()) {
            return false;
        }

        const dados = {
            livro_id: emprestimo.getLivro().getId(),
            usuario_id: emprestimo.getUsuario().getId(),
            data_emprestimo: emprestimo.getDataEmprestimo(),
            data_devolucao_prevista: emprestimo.getDataDevolucaoPrevista(),
            data_devolucao_efetiva: emprestimo.getDataDevolucaoReal(),
            status: emprestimo.getStatus()
        };

        try {
            const { error } = await supabase
                .from(this.TABLE_NAME)
                .update(dados)
                .eq('id', emprestimo.getId());

            return !error;
        } catch (error) {
            console.error('Erro ao atualizar empréstimo:', error);
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
            console.error('Erro ao deletar empréstimo:', error);
            return false;
        }
    }

    converterParaEmprestimo(dados: any): Emprestimo {
        const livro = this.livroRepo.converterParaLivro(dados.livro);
        const usuario = this.usuarioRepo.converterParaUsuario(dados.usuario);

        const emprestimo = new Emprestimo(
            dados.id,
            livro,
            usuario,
            new Date(dados.data_emprestimo),
            new Date(dados.data_devolucao_prevista)
        );

        if (dados.data_devolucao_efetiva) {
            emprestimo.realizarDevolucao(new Date(dados.data_devolucao_efetiva));
        }

        if (dados.status !== StatusEmprestimo.EM_ANDAMENTO) {
            emprestimo.setStatus(dados.status as StatusEmprestimo);
        }

        return emprestimo;
    }
} 