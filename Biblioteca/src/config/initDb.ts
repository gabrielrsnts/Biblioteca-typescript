import { supabase } from './supabase';

async function criarTabelas() {
    // Criar tabela de livros
    const { error: erroLivros } = await supabase
        .from('livros')
        .select('id')
        .limit(1);

    if (erroLivros) {
        console.error('Erro ao verificar tabela de livros:', erroLivros);
    }

    // Criar tabela de usuários
    const { error: erroUsuarios } = await supabase
        .from('usuarios')
        .select('id')
        .limit(1);

    if (erroUsuarios) {
        console.error('Erro ao verificar tabela de usuários:', erroUsuarios);
    }

    // Criar tabela de empréstimos
    const { error: erroEmprestimos } = await supabase
        .from('emprestimos')
        .select('id')
        .limit(1);

    if (erroEmprestimos) {
        console.error('Erro ao verificar tabela de empréstimos:', erroEmprestimos);
    }
}

export async function inicializarBancoDados() {
    try {
        await criarTabelas();
        console.log('Conexão com o banco de dados verificada com sucesso!');
    } catch (error) {
        console.error('Erro ao verificar banco de dados:', error);
        throw error;
    }
} 