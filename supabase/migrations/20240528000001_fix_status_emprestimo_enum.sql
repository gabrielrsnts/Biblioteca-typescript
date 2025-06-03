-- Primeiro, removemos o valor padrão da coluna
ALTER TABLE emprestimos ALTER COLUMN status DROP DEFAULT;

-- Criamos um novo tipo enum com os valores corretos
DROP TYPE IF EXISTS status_emprestimo_new;
CREATE TYPE status_emprestimo_new AS ENUM (
    'em_andamento',
    'devolvido',
    'atrasado',
    'renovado',
    'cancelado'
);

-- Atualizamos a tabela para usar o novo tipo
ALTER TABLE emprestimos 
    ALTER COLUMN status TYPE status_emprestimo_new 
    USING (
        CASE status::text
            WHEN 'EM_ANDAMENTO' THEN 'em_andamento'::status_emprestimo_new
            WHEN 'DEVOLVIDO' THEN 'devolvido'::status_emprestimo_new
            WHEN 'ATRASADO' THEN 'atrasado'::status_emprestimo_new
            WHEN 'RENOVADO' THEN 'renovado'::status_emprestimo_new
            WHEN 'CANCELADO' THEN 'cancelado'::status_emprestimo_new
        END
    );

-- Removemos o tipo antigo
DROP TYPE IF EXISTS status_emprestimo;

-- Renomeamos o novo tipo para o nome original
ALTER TYPE status_emprestimo_new RENAME TO status_emprestimo;

-- Adicionamos o valor padrão novamente com o novo formato
ALTER TABLE emprestimos ALTER COLUMN status SET DEFAULT 'em_andamento'; 