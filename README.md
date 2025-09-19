# Sistema Bibliotecário 📚

## Descrição
Sistema de gerenciamento de biblioteca desenvolvido em TypeScript com arquitetura em camadas, usando Supabase como banco de dados.

## Tecnologias Utilizadas 🛠️

### Backend
- **TypeScript** - Linguagem principal
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Banco de dados PostgreSQL como serviço

### Dependências Principais
```json
{
  "@supabase/supabase-js": "^2.39.1",
  "express": "^5.1.0",
  "prompt-sync": "^4.2.0",
  "dotenv": "^16.5.0"
}
```

### Ferramentas de Desenvolvimento
- **Jest** - Framework de testes
- **ts-jest** - Suporte TypeScript para Jest
- **TypeScript** - Compilador e ferramentas
- **Babel** - Transpilador

## Arquitetura 🏗️

### Estrutura de Diretórios
```
src/
├── config/        # Configurações (Supabase, DB)
├── controller/    # Controladores
├── database/      # Migrations e scripts DB
├── model/         # Modelos de domínio
├── repositories/  # Camada de acesso a dados
├── service/       # Lógica de negócios
├── tests/         # Testes automatizados
├── ui/           # Interface do usuário
└── utils/        # Utilitários
```

### Padrões de Projeto
- **Repository Pattern**
- **Service Layer**
- **MVC**
- **DTO (Data Transfer Objects)**

## Modelos Principais 📋

### Livro
```typescript
class Livro {
  id: number
  titulo: string
  autor: string
  anoPublicacao: number
  categoria: CategoriaLivro
}
```

### Usuário
```typescript
class Usuario {
  id: number
  matricula: string
  nome: string
  email: string
  telefone: string
}
```

### Empréstimo
```typescript
class Emprestimo {
  id: number
  livroId: number
  usuarioId: number
  dataEmprestimo: Date
  dataDevolucaoPrevista: Date
  dataDevolucaoEfetiva: Date | null
  status: StatusEmprestimo
}
```

## Funcionalidades 🔧

- Cadastro de livros
- Cadastro de usuários
- Realizar empréstimos
- Devolver livros
- Pesquisar livros por título
- Listar empréstimos por usuário
- Ver livros disponíveis
- Buscar por categoria

## Banco de Dados 💾

### Tabelas Principais
- `livros`
- `usuarios`
- `emprestimos`

### Enums
```sql
CREATE TYPE categoria_livro AS ENUM (
  'FICCAO_CIENTIFICA', 'ROMANCE', 'FANTASIA', 'BIOGRAFIA',
  'HISTORIA', 'TECNOLOGIA', 'CIENCIAS', 'LITERATURA',
  'AUTOAJUDA', 'EDUCACIONAL', 'INFANTIL', 'POESIA',
  'MANGA', 'QUADRINHOS'
);

CREATE TYPE status_emprestimo AS ENUM (
  'em_andamento', 'devolvido', 'atrasado', 'renovado', 'cancelado'
);
```

## Testes 🧪

- **Jest** para testes unitários e de integração
- Cobertura de testes para serviços e controllers
- Mocks para dependências externas

```bash
npm test        # Executa todos os testes
npm run test:watch  # Executa testes em modo watch
```

## Como Executar 🚀

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais do Supabase
```

4. Execute as migrações
```bash
npm run migrate
```

5. Inicie o servidor
```bash
npm run start
```

## Scripts Disponíveis 📜

```bash
npm start       # Inicia a aplicação
npm run build   # Compila o TypeScript
npm run dev     # Inicia em modo desenvolvimento
npm test        # Executa testes
npm run typecheck  # Verifica tipos TypeScript
```

## Contribuição 👥

1. Faça um Fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
