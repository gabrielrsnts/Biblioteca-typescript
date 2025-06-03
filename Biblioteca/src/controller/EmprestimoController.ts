import { logAction } from '../utils/logger';

export class EmprestimoController {
  private emprestimos: any[] = [];

  constructor(private livroCtrl: any, private usuarioCtrl: any) {}

  @logAction
  emprestarLivro(idLivro: number, idUsuario: number) {
    const livro = this.livroCtrl.getLivros().find((l: any) => l.id === idLivro);
    const usuario = this.usuarioCtrl.buscarUsuario(idUsuario);

    if (!livro || !livro.disponivel) return console.log('Livro não disponível.');
    if (!usuario) return console.log('Usuário não encontrado.');

    this.emprestimos.push({ livroId: idLivro, usuarioId: idUsuario, data: new Date() });
    this.livroCtrl.atualizarDisponibilidade(idLivro, false);
    console.log('Empréstimo realizado!');
  }

  @logAction
  devolverLivro(idLivro: number) {
    const emprestimo = this.emprestimos.find(e => e.livroId === idLivro);
    if (!emprestimo) return console.log('Livro não estava emprestado.');
    this.livroCtrl.atualizarDisponibilidade(idLivro, true);
    console.log('Livro devolvido com sucesso!');
  }

  listarEmprestimos() {
    this.emprestimos.forEach(e => {
      console.log(`Livro ID: ${e.livroId} | Usuário ID: ${e.usuarioId} | Data: ${e.data.toISOString()}`);
    });
  }
}
