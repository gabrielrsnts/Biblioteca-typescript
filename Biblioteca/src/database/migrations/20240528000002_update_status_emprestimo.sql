-- Primeiro, removemos o valor padrão da coluna
ALTER TABLE emprestimos ALTER COLUMN status DROP DEFAULT;

-- Atualizamos os valores existentes
UPDATE emprestimos
SET status = CASE status
    WHEN 'em_andamento' THEN 'ATIVO'
    WHEN 'devolvido' THEN 'CONCLUIDO'
    WHEN 'atrasado' THEN 'ATRASADO'
    WHEN 'cancelado' THEN 'CANCELADO'
    ELSE 'ATIVO'
END;

-- Removemos o tipo enum antigo
DROP TYPE IF EXISTS status_emprestimo CASCADE;

-- Criamos o novo tipo enum
CREATE TYPE status_emprestimo AS ENUM (
    'ATIVO',
    'CONCLUIDO',
    'ATRASADO',
    'CANCELADO'
);

-- Alteramos a coluna para usar o novo tipo
ALTER TABLE emprestimos
    ALTER COLUMN status TYPE status_emprestimo
    USING status::text::status_emprestimo;

-- Adicionamos o valor padrão novamente
ALTER TABLE emprestimos
    ALTER COLUMN status SET DEFAULT 'ATIVO'; 