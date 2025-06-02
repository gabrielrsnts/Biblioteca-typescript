Diagrama inicial do projeto

```mermaid
classDiagram

class Livro {
  +string id
  +string titulo
  +string autor
  +number anoPublicacao
  +CategoriaLivro categoria
  +StatusLivro status
}

class Usuario {
  +string id
  +string nome
  +string email
  +number telefone
  +string matricula
}

class Emprestimo {
  +string id
  +Livro livro
  +Usuario usuario
  +Date dataEmprestimo
  +Date dataDevolucaoPrevista
  +Date dataDevolucaoReal
  +StatusEmprestimo status
}

class CategoriaLivro {
  <<enum>>
  +FICCAO_CIENTIFICA
  +ROMANCE
  +FANTASIA
  +BIOGRAFIA
  +HISTORIA
  +TECNOLOGIA
  +CIENCIAS
  +LITERATURA
  +AUTOAJUDA
  +EDUCACIONAL
  +INFANTIL
  +POESIA
  +MANGA
  +QUADRINHOS
}

class StatusLivro {
  <<enum>>
  +DISPONIVEL
  +EMPRESTADO
}


class StatusEmprestimo {
  <<enum>>
  +EM_ANDAMENTO
  +DEVOLVIDO
  +ATRASADO
  +RENOVADO
  +CANCELADO
}

Usuario "1" --> "*" Emprestimo : realiza
Livro "1" --> "*" Emprestimo : é emprestado em
Emprestimo "*" --> "1" Livro : refere-se a
Emprestimo "*" --> "1" Usuario : feito por
