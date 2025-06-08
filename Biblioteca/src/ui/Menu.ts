import promptSync from 'prompt-sync';
import { LivroController } from '../controller/LivroController';
import { UsuarioController } from '../controller/UsuarioController';
import EmprestimoController from '../controller/EmprestimoController';
import { LivroService } from '../service/LivroService';
import { UsuarioService } from '../service/UsuarioService';
import EmprestimoService from '../service/EmprestimoService';
import { LivroRepository } from '../repositories/LivroRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { supabase } from '../config/supabase';
import CategoriaLivro from '../model/CategoriaLivro';
import Livro from '../model/Livro';
import Usuario from '../model/Usuario';
import Emprestimo from '../model/Emprestimo';

// Configuração do terminal para UTF-8
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');

// Inicialização dos repositórios com Supabase
const livroRepo = new LivroRepository(supabase);
const usuarioRepo = new UsuarioRepository(supabase);
const emprestimoRepo = new EmprestimoRepository(supabase);

// Inicialização dos serviços
const livroService = new LivroService(livroRepo);
const usuarioService = new UsuarioService(usuarioRepo, emprestimoRepo);
const emprestimoService = new EmprestimoService(emprestimoRepo, livroService, usuarioService);

// Inicialização dos controllers
const livroController = new LivroController(livroService);
const usuarioController = new UsuarioController(usuarioService);
const emprestimoController = new EmprestimoController(emprestimoService);

// Inicialização do prompt
const prompt = promptSync({
    sigint: true
});

// Função para limpar a tela
function limparTela(): void {
    console.clear();
    // Garante que o console está usando UTF-8
    console.log('\x1b[1m\x1b[36m'); // Define cor e estilo
    process.stdout.write('\x1b[0m'); // Reseta as configurações
}

// Função para formatar texto (mantém caracteres especiais válidos)
function formatarTexto(texto: string): string {
    return texto.trim()
        .replace(/[^\w\sÀ-ÿ]/g, '') // Mantém letras, números, espaços e caracteres acentuados
        .replace(/\s+/g, ' '); // Remove espaços extras
}

export async function mostrarMenu(): Promise<void> {
    let opcao: string;
    
    do {
        limparTela();
        console.log('📚 Sistema de Biblioteca');
        console.log('======================');
        console.log('1 - Cadastrar livro');
        console.log('2 - Listar livros');
        console.log('3 - Cadastrar usuário');
        console.log('4 - Listar usuários');
        console.log('5 - Realizar empréstimo');
        console.log('6 - Realizar devolução');
        console.log('7 - Pesquisar livro por título');
        console.log('8 - Ver empréstimos por usuário');
        console.log('9 - Ver livros disponíveis');
        console.log('10 - Buscar livros por categoria');
        console.log('0 - Sair do sistema');
        console.log('======================');
        
        opcao = prompt('Escolha uma opção: ');
        
        limparTela();
        
        try {
            switch (opcao) {
                case '1':
                    await cadastrarLivro();
                    break;
                case '2':
                    await listarLivros();
                    break;
                case '3':
                    await cadastrarUsuario();
                    break;
                case '4':
                    await listarUsuarios();
                    break;
                case '5':
                    await realizarEmprestimo();
                    break;
                case '6':
                    await realizarDevolucao();
                    break;
                case '7':
                    await pesquisarLivroPorTitulo();
                    break;
                case '8':
                    await verEmprestimosPorUsuario();
                    break;
                case '9':
                    await verLivrosDisponiveis();
                    break;
                case '10':
                    await buscarLivrosPorCategoria();
                    break;
                case '0':
                    console.log('Encerrando o sistema...');
                    break;
                default:
                    console.log('Opção inválida!');
            }
            
            if (opcao !== '0') {
                prompt('Pressione ENTER para continuar...');
            }
        } catch (error) {
            console.error('Erro:', error instanceof Error ? error.message : 'Erro desconhecido');
            prompt('Pressione ENTER para continuar...');
        }
    } while (opcao !== '0');
}

async function cadastrarLivro(): Promise<void> {
    console.log('📖 Cadastro de Livro');
    console.log('===================');
    
    const titulo = prompt('Título: ');
    const autor = prompt('Autor: ');
    const anoStr = prompt('Ano de publicação: ');
    const ano = parseInt(anoStr);
    
    console.log('\nCategorias disponíveis:');
    Object.entries(CategoriaLivro).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    
    const categoria = prompt('Categoria: ');
    
    if (!Object.values(CategoriaLivro).includes(categoria as CategoriaLivro)) {
        throw new Error('Categoria inválida!');
    }
    
    const resultado = await livroController.cadastrarLivroDirectly({
        titulo: formatarTexto(titulo),
        autor: formatarTexto(autor),
        anoPublicacao: ano,
        categoria: categoria as CategoriaLivro
    });
    
    if (!resultado) {
        throw new Error('Erro ao cadastrar livro');
    }
    
    console.log('\nLivro cadastrado com sucesso!');
    console.log('ID:', resultado.getId());
}

async function listarLivros(): Promise<void> {
    console.log('📚 Lista de Livros');
    console.log('=================');
    
    const livros = await livroController.listarLivrosDirectly();
    
    if (livros.length === 0) {
        console.log('Nenhum livro cadastrado.');
        return;
    }
    
    livros.forEach((livro: Livro) => {
        console.log(`\nID: ${livro.getId()}`);
        console.log(`Título: ${livro.getTitulo()}`);
        console.log(`Autor: ${livro.getAutor()}`);
        console.log(`Ano: ${livro.getAnoPublicacao()}`);
        console.log(`Categoria: ${livro.getCategoria()}`);
        console.log('-------------------');
    });
}

async function cadastrarUsuario(): Promise<void> {
    console.log('👤 Cadastro de Usuário');
    console.log('=====================');
    
    const matricula = prompt('Matrícula: ');
    const nome = prompt('Nome: ');
    const email = prompt('Email: ');
    const telefone = prompt('Telefone: ');
    
    const resultado = await usuarioController.cadastrarUsuarioDirectly({
        matricula: formatarTexto(matricula),
        nome: formatarTexto(nome),
        email: email.trim().toLowerCase(),
        telefone: telefone.replace(/\D/g, '') // Remove não-dígitos do telefone
    });
    
    if (!resultado) {
        throw new Error('Erro ao cadastrar usuário');
    }
    
    console.log('\nUsuário cadastrado com sucesso!');
    console.log('ID:', resultado.getId());
}

async function listarUsuarios(): Promise<void> {
    console.log('👥 Lista de Usuários');
    console.log('===================');
    
    const usuarios = await usuarioController.listarUsuariosDirectly();
    
    if (usuarios.length === 0) {
        console.log('Nenhum usuário cadastrado.');
        return;
    }
    
    usuarios.forEach((usuario: Usuario) => {
        console.log(`\nID: ${usuario.getId()}`);
        console.log(`Matrícula: ${usuario.getMatricula()}`);
        console.log(`Nome: ${usuario.getNome()}`);
        console.log(`Email: ${usuario.getEmail()}`);
        console.log(`Telefone: ${usuario.getTelefone()}`);
        console.log('-------------------');
    });
}

async function realizarEmprestimo(): Promise<void> {
    console.log('📚 Realizar Empréstimo');
    console.log('=====================');

    // Listar livros disponíveis
    console.log('\nLivros disponíveis:');
    const livros = await livroController.listarLivrosDirectly();
    if (livros.length === 0) {
        throw new Error('Não há livros cadastrados no sistema');
    }
    livros.forEach((livro: Livro) => {
        console.log(`ID: ${livro.getId()} - Título: ${livro.getTitulo()} - Autor: ${livro.getAutor()}`);
    });

    // Listar usuários
    console.log('\nUsuários cadastrados:');
    const usuarios = await usuarioController.listarUsuariosDirectly();
    if (usuarios.length === 0) {
        throw new Error('Não há usuários cadastrados no sistema');
    }
    usuarios.forEach((usuario: Usuario) => {
        console.log(`ID: ${usuario.getId()} - Nome: ${usuario.getNome()} - Matrícula: ${usuario.getMatricula()}`);
    });

    const livroIdStr = prompt('\nID do livro: ');
    const usuarioIdStr = prompt('ID do usuário: ');

    const livroId = parseInt(livroIdStr);
    const usuarioId = parseInt(usuarioIdStr);

    if (isNaN(livroId) || isNaN(usuarioId)) {
        throw new Error('IDs inválidos. Por favor, insira números válidos.');
    }

    if (livroId <= 0 || usuarioId <= 0) {
        throw new Error('IDs devem ser números positivos');
    }

    // Verificar se o livro existe
    const livro = await livroController.buscarLivroPorIdDirectly(livroId);
    if (!livro) {
        throw new Error(`Livro com ID ${livroId} não encontrado`);
    }

    // Verificar se o usuário existe
    const usuario = await usuarioController.buscarUsuarioPorIdDirectly(usuarioId);
    if (!usuario) {
        throw new Error(`Usuário com ID ${usuarioId} não encontrado`);
    }

    try {
        const resultado = await emprestimoController.emprestarLivroDirectly(livroId, usuarioId);
        if (!resultado) {
            throw new Error('Não foi possível realizar o empréstimo');
        }

        console.log('\nEmpréstimo realizado com sucesso!');
        console.log('ID do empréstimo:', resultado.getId());
        console.log(`Livro: ${livro.getTitulo()}`);
        console.log(`Usuário: ${usuario.getNome()}`);
        console.log(`Data de devolução prevista: ${resultado.getDataDevolucaoPrevista().toLocaleDateString()}`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Erro ao realizar empréstimo: ${error.message}`);
        }
        throw new Error('Erro desconhecido ao realizar empréstimo');
    }
}

async function realizarDevolucao(): Promise<void> {
    console.log('📚 Devolução de Livro');
    console.log('====================');
    
    // Buscar todos os empréstimos ativos
    const emprestimosAtivos = await emprestimoController.buscarEmprestimosAtivos();
    
    if (emprestimosAtivos.length === 0) {
        console.log('\nNão há empréstimos ativos no momento.');
        return;
    }
    
    console.log('\nEmpréstimos ativos:');
    console.log('==================');
    
    for (const emprestimo of emprestimosAtivos) {
        const livro = await livroController.buscarLivroPorIdDirectly(emprestimo.getLivroId());
        const usuario = await usuarioController.buscarUsuarioPorIdDirectly(emprestimo.getUsuarioId());
        
        if (livro && usuario) {
            console.log(`\nID do Empréstimo: ${emprestimo.getId()}`);
            console.log(`Livro: ${livro.getTitulo()}`);
            console.log(`Usuário: ${usuario.getNome()}`);
            console.log(`Data do empréstimo: ${emprestimo.getDataEmprestimo().toLocaleDateString()}`);
            console.log(`Data prevista de devolução: ${emprestimo.getDataDevolucaoPrevista().toLocaleDateString()}`);
            console.log('-------------------');
        }
    }
    
    const emprestimoId = Number(prompt('\nDigite o ID do empréstimo para devolução: '));
    
    if (isNaN(emprestimoId) || emprestimoId <= 0) {
        console.log('\nID do empréstimo inválido!');
        return;
    }
    
    const sucesso = await emprestimoController.realizarDevolucaoDirectly(emprestimoId);
    
    if (!sucesso) {
        console.log('\nErro ao realizar devolução!');
        return;
    }
    
    console.log('\nDevolução realizada com sucesso!');
}

async function pesquisarLivroPorTitulo(): Promise<void> {
    console.log('🔍 Pesquisar Livro por Título');
    console.log('============================');
    
    const titulo = prompt('Digite o título do livro: ');
    
    const livros = await livroController.buscarLivrosPorTituloParcial(titulo);
    
    if (livros.length === 0) {
        console.log('\nNenhum livro encontrado com esse título.');
        return;
    }
    
    console.log('\nLivros encontrados:');
    console.log('===================');
    
    livros.forEach(livro => {
        console.log(`\nID: ${livro.getId()}`);
        console.log(`Título: ${livro.getTitulo()}`);
        console.log(`Autor: ${livro.getAutor()}`);
        console.log(`Ano: ${livro.getAnoPublicacao()}`);
        console.log(`Categoria: ${livro.getCategoria()}`);
        console.log('-------------------');
    });
}

async function verEmprestimosPorUsuario(): Promise<void> {
    console.log('👤 Empréstimos por Usuário');
    console.log('==========================');
    
    const matricula = prompt('Digite a matrícula do usuário: ');
    
    const usuario = await usuarioController.buscarUsuarioPorMatriculaDirectly(matricula);
    
    if (!usuario) {
        console.log('\nUsuário não encontrado!');
        return;
    }
    
    const emprestimos = await emprestimoController.buscarEmprestimosPorUsuario(usuario.getId()!);
    
    if (emprestimos.length === 0) {
        console.log('\nEste usuário não possui empréstimos.');
        return;
    }
    
    console.log(`\nEmpréstimos de ${usuario.getNome()}:`);
    console.log('=============================');
    
    for (const emprestimo of emprestimos) {
        const livro = await livroController.buscarLivroPorIdDirectly(emprestimo.getLivroId());
        if (livro) {
            console.log(`\nID do Empréstimo: ${emprestimo.getId()}`);
            console.log(`Livro: ${livro.getTitulo()}`);
            console.log(`Data do empréstimo: ${emprestimo.getDataEmprestimo().toLocaleDateString()}`);
            console.log(`Data prevista de devolução: ${emprestimo.getDataDevolucaoPrevista().toLocaleDateString()}`);
            console.log(`Status: ${emprestimo.getStatus()}`);
            console.log('-------------------');
        }
    }
}

async function verLivrosDisponiveis(): Promise<void> {
    console.log('📚 Livros Disponíveis');
    console.log('====================');
    
    const livrosDisponiveis = await livroController.buscarLivrosDisponiveis();
    
    if (livrosDisponiveis.length === 0) {
        console.log('\nNão há livros disponíveis no momento.');
        return;
    }
    
    console.log('\nLista de livros disponíveis:');
    console.log('===========================');
    
    livrosDisponiveis.forEach(livro => {
        console.log(`\nID: ${livro.getId()}`);
        console.log(`Título: ${livro.getTitulo()}`);
        console.log(`Autor: ${livro.getAutor()}`);
        console.log(`Ano: ${livro.getAnoPublicacao()}`);
        console.log(`Categoria: ${livro.getCategoria()}`);
        console.log('-------------------');
    });
}

async function buscarLivrosPorCategoria(): Promise<void> {
    console.log('🔍 Buscar Livros por Categoria');
    console.log('============================');
    
    console.log('\nCategorias disponíveis:');
    Object.entries(CategoriaLivro).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
    
    const categoria = prompt('\nDigite a categoria desejada: ');
    
    if (!Object.values(CategoriaLivro).includes(categoria as CategoriaLivro)) {
        console.log('\nCategoria inválida!');
        return;
    }
    
    const livros = await livroController.buscarLivrosPorCategoria(categoria as CategoriaLivro);
    
    if (livros.length === 0) {
        console.log('\nNenhum livro encontrado nesta categoria.');
        return;
    }
    
    console.log('\nLivros encontrados:');
    console.log('===================');
    
    livros.forEach(livro => {
        console.log(`\nID: ${livro.getId()}`);
        console.log(`Título: ${livro.getTitulo()}`);
        console.log(`Autor: ${livro.getAutor()}`);
        console.log(`Ano: ${livro.getAnoPublicacao()}`);
        console.log(`Categoria: ${livro.getCategoria()}`);
        console.log('-------------------');
    });
}
