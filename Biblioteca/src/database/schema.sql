-- Removendo o tipo enum existente e recriando
DROP TYPE IF EXISTS categoria_livro CASCADE;
DROP TYPE IF EXISTS status_emprestimo CASCADE;

CREATE TYPE categoria_livro AS ENUM (
    'FICCAO_CIENTIFICA',
    'ROMANCE',
    'FANTASIA',
    'BIOGRAFIA',
    'HISTORIA',
    'TECNOLOGIA',
    'CIENCIAS',
    'LITERATURA',
    'AUTOAJUDA',
    'EDUCACIONAL',
    'INFANTIL',
    'POESIA',
    'MANGA',
    'QUADRINHOS'
);

CREATE TYPE status_emprestimo AS ENUM (
    'ATIVO',
    'CONCLUIDO',
    'ATRASADO',
    'CANCELADO'
);

-- Recriando as tabelas
DROP TABLE IF EXISTS emprestimos;
DROP TABLE IF EXISTS livros;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    categoria categoria_livro NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL REFERENCES livros(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_emprestimo TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    data_devolucao_prevista TIMESTAMP WITH TIME ZONE NOT NULL,
    data_devolucao_efetiva TIMESTAMP WITH TIME ZONE,
    status status_emprestimo NOT NULL DEFAULT 'ATIVO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_livros_updated_at
    BEFORE UPDATE ON livros
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emprestimos_updated_at
    BEFORE UPDATE ON emprestimos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 