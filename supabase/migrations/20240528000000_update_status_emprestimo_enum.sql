-- Primeiro, criamos um novo tipo enum com os valores corretos
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
DROP TYPE status_emprestimo;

-- Renomeamos o novo tipo para o nome original
ALTER TYPE status_emprestimo_new RENAME TO status_emprestimo; 