Diagrama inicial do projeto

```mermaid
classDiagram

class Livro {
  +string id
  +string titulo
  +string autor
  +Categoria categoria
  +StatusLivro status
}

class Usuario {
  +string id
  +string nome
  +string email
  +TipoUsuario tipo
}

class Emprestimo {
  +string id
  +string livroId
  +string usuarioId
  +Date dataEmprestimo
  +Date? dataDevolucao
  +StatusEmprestimo status
}

class Categoria {
  <<enum>>
}

class StatusLivro {
  <<enum>>
}

class TipoUsuario {
  <<enum>>
}

class StatusEmprestimo {
  <<enum>>
}

Usuario "1" --> "*" Emprestimo : realiza
Livro "1" --> "*" Emprestimo : é emprestado em
Emprestimo "*" --> "1" Livro : refere-se a
Emprestimo "*" --> "1" Usuario : feito por
