-- Criar tabela de livros permanentes
CREATE TABLE IF NOT EXISTS livros_permanentes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de usuários permanentes
CREATE TABLE IF NOT EXISTS usuarios_permanentes (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_livros_permanentes_titulo ON livros_permanentes(titulo);
CREATE INDEX IF NOT EXISTS idx_livros_permanentes_categoria ON livros_permanentes(categoria);
CREATE INDEX IF NOT EXISTS idx_usuarios_permanentes_matricula ON usuarios_permanentes(matricula);
CREATE INDEX IF NOT EXISTS idx_usuarios_permanentes_email ON usuarios_permanentes(email); 