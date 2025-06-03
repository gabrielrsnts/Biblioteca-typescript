import { logAction } from '../utils/logger';

export class LivroController {
  private livros: any[] = [];

  @logAction
  cadastrarLivro(titulo: string, autor: string) {
    const livro = { id: this.livros.length + 1, titulo, autor, disponivel: true };
    this.livros.push(livro);
    console.log('Livro cadastrado com sucesso!');
  }

  listarLivros() {
    this.livros.forEach(l => {
      console.log(`ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor} | Disponível: ${l.disponivel}`);
    });
  }

  getLivros() {
    return this.livros;
  }

  atualizarDisponibilidade(id: number, disponivel: boolean) {
    const livro = this.livros.find(l => l.id === id);
    if (livro) livro.disponivel = disponivel;
  }
}
