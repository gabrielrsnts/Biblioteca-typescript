import { supabase } from './supabase';
import { inserirDadosIniciais } from '../database/dados_iniciais';

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

async function verificarDadosIniciais() {
    // Verificar se já existem livros
    const { data: livros, error: erroLivros } = await supabase
        .from('livros')
        .select('id')
        .limit(1);

    // Verificar se já existem usuários
    const { data: usuarios, error: erroUsuarios } = await supabase
        .from('usuarios')
        .select('id')
        .limit(1);

    // Se não houver livros ou usuários, inserir dados iniciais
    if ((!livros || livros.length === 0) || (!usuarios || usuarios.length === 0)) {
        console.log('Banco de dados vazio. Inserindo dados iniciais...');
        await inserirDadosIniciais();
    } else {
        console.log('Dados iniciais já existem no banco de dados.');
    }
}

export async function inicializarBancoDados() {
    try {
        await criarTabelas();
        console.log('Conexão com o banco de dados verificada com sucesso!');
        
        await verificarDadosIniciais();
    } catch (error) {
        console.error('Erro ao verificar banco de dados:', error);
        throw error;
    }
} 