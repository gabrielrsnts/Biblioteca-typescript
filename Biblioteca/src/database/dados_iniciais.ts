import { supabase } from '../config/supabase';
import CategoriaLivro from '../model/CategoriaLivro';

const livros = [
    { titulo: '1984', autor: 'George Orwell', ano_publicacao: 1949, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano_publicacao: 1899, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano_publicacao: 1954, categoria: CategoriaLivro.FANTASIA },
    { titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', ano_publicacao: 1967, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'Orgulho e Preconceito', autor: 'Jane Austen', ano_publicacao: 1813, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'A Revolução dos Bichos', autor: 'George Orwell', ano_publicacao: 1945, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', ano_publicacao: 1943, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'A Menina que Roubava Livros', autor: 'Markus Zusak', ano_publicacao: 2005, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Código Da Vinci', autor: 'Dan Brown', ano_publicacao: 2003, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Apanhador no Campo de Centeio', autor: 'J.D. Salinger', ano_publicacao: 1951, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', ano_publicacao: 1937, categoria: CategoriaLivro.FANTASIA },
    { titulo: 'A Cor Púrpura', autor: 'Alice Walker', ano_publicacao: 1982, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'A Culpa é das Estrelas', autor: 'John Green', ano_publicacao: 2012, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'Ensaio sobre a Cegueira', autor: 'José Saramago', ano_publicacao: 1995, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Diário de Anne Frank', autor: 'Anne Frank', ano_publicacao: 1947, categoria: CategoriaLivro.BIOGRAFIA },
    { titulo: 'It: A Coisa', autor: 'Stephen King', ano_publicacao: 1986, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', ano_publicacao: 1953, categoria: CategoriaLivro.FICCAO_CIENTIFICA },
    { titulo: 'O Alquimista', autor: 'Paulo Coelho', ano_publicacao: 1988, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', ano_publicacao: 2019, categoria: CategoriaLivro.LITERATURA },
    { titulo: 'O Morro dos Ventos Uivantes', autor: 'Emily Brontë', ano_publicacao: 1847, categoria: CategoriaLivro.LITERATURA }
];

const usuarios = [
    { matricula: '20250001', nome: 'Isabella Farias', email: 'henriqueda-costa@almeida.br', telefone: '0900 961 7318' },
    { matricula: '20250002', nome: 'Esther Sales', email: 'bryanmonteiro@farias.br', telefone: '0500 763 7790' },
    { matricula: '20250003', nome: 'Larissa Araújo', email: 'bryanda-cruz@ig.com.br', telefone: '(081) 1886-8023' },
    { matricula: '20250004', nome: 'Camila Freitas', email: 'nicoleda-mata@sales.br', telefone: '+55 21 6436-1016' },
    { matricula: '20250005', nome: 'Raul Ramos', email: 'oliviapeixoto@costa.net', telefone: '(071) 1270 6665' },
    { matricula: '20250006', nome: 'Lucas Gabriel da Mata', email: 'xmartins@yahoo.com.br', telefone: '+55 (051) 1178 6235' },
    { matricula: '20250007', nome: 'Otávio Monteiro', email: 'yfreitas@goncalves.com', telefone: '0900-615-3033' },
    { matricula: '20250008', nome: 'Calebe Dias', email: 'marcos-vinicius85@gmail.com', telefone: '+55 (011) 7543-1649' },
    { matricula: '20250009', nome: 'Heitor Castro', email: 'emanuelly55@gmail.com', telefone: '+55 81 9723-1700' },
    { matricula: '20250010', nome: 'Luiz Henrique Peixoto', email: 'nramos@yahoo.com.br', telefone: '+55 81 6763-5974' },
    { matricula: '20250011', nome: 'Yasmin Moreira', email: 'maria-cecilia46@ig.com.br', telefone: '0500-588-0555' },
    { matricula: '20250012', nome: 'Dr. Lorenzo Teixeira', email: 'silveiracaio@ig.com.br', telefone: '51 0216 1323' },
    { matricula: '20250013', nome: 'Valentina Pinto', email: 'murilo45@gmail.com', telefone: '61 8498 8258' },
    { matricula: '20250014', nome: 'Pedro Henrique das Neves', email: 'ferreiramaysa@ig.com.br', telefone: '+55 84 1805 1770' },
    { matricula: '20250015', nome: 'Esther Moraes', email: 'barrosbernardo@uol.com.br', telefone: '+55 71 9012-0887' },
    { matricula: '20250016', nome: 'Matheus Aragão', email: 'portoantonio@bol.com.br', telefone: '+55 (031) 4731 5036' },
    { matricula: '20250017', nome: 'Benjamin Correia', email: 'leandroda-luz@da.br', telefone: '(021) 6496-0228' },
    { matricula: '20250018', nome: 'Giovanna Mendes', email: 'vitor-hugo78@ig.com.br', telefone: '51 6996 8064' },
    { matricula: '20250019', nome: 'Enrico Porto', email: 'dsales@ig.com.br', telefone: '(021) 8629-6905' },
    { matricula: '20250020', nome: 'Marcelo da Paz', email: 'rmendes@gmail.com', telefone: '+55 (061) 1522 4314' }
];

export async function inserirDadosIniciais() {
    try {
        // Inserir livros
        for (const livro of livros) {
            const { error } = await supabase
                .from('livros')
                .insert(livro)
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Código de erro para violação de chave única
                    console.log(`Livro "${livro.titulo}" já existe.`);
                } else {
                    console.error(`Erro ao inserir livro "${livro.titulo}":`, error);
                }
            } else {
                console.log(`Livro "${livro.titulo}" inserido com sucesso.`);
            }
        }

        // Inserir usuários
        for (const usuario of usuarios) {
            const { error } = await supabase
                .from('usuarios')
                .insert(usuario)
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Código de erro para violação de chave única
                    console.log(`Usuário "${usuario.nome}" já existe.`);
                } else {
                    console.error(`Erro ao inserir usuário "${usuario.nome}":`, error);
                }
            } else {
                console.log(`Usuário "${usuario.nome}" inserido com sucesso.`);
            }
        }

        console.log('Dados iniciais inseridos com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados iniciais:', error);
    }
} 