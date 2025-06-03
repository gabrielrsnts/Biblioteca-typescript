import * as readline from 'readline-sync';
import { LivroController } from '../controller/LivroController';
import { UsuarioController } from '../controller/UsuarioController';
import { EmprestimoController } from '../controller/EmprestimoController';

export class Menu {
  private livroCtrl = new LivroController();
  private usuarioCtrl = new UsuarioController();
  private emprestimoCtrl = new EmprestimoController(this.livroCtrl, this.usuarioCtrl);

  exibirMenu() {
    let opcao = '';
    do {
      console.log('\n--- Sistema Biblioteca ---');
      console.log('1. Cadastrar Livro');
      console.log('2. Listar Livros');
      console.log('3. Cadastrar Usuário');
      console.log('4. Listar Usuários');
      console.log('5. Emprestar Livro');
      console.log('6. Devolver Livro');
      console.log('7. Listar Empréstimos');
      console.log('0. Sair');

      opcao = readline.question('Escolha uma opcao: ');
      switch (opcao) {
        case '1':
          const titulo = readline.question('Título do livro: ');
          const autor = readline.question('Autor: ');
          this.livroCtrl.cadastrarLivro(titulo, autor);
          break;
        case '2':
          this.livroCtrl.listarLivros();
          break;
        case '3':
          const nome = readline.question('Nome do usuário: ');
          this.usuarioCtrl.cadastrarUsuario(nome);
          break;
        case '4':
          this.usuarioCtrl.listarUsuarios();
          break;
        case '5':
          const idLivroEmp = parseInt(readline.question('ID do livro: '));
          const idUsuarioEmp = parseInt(readline.question('ID do usuário: '));
          this.emprestimoCtrl.emprestarLivro(idLivroEmp, idUsuarioEmp);
          break;
        case '6':
          const idLivroDev = parseInt(readline.question('ID do livro a devolver: '));
          this.emprestimoCtrl.devolverLivro(idLivroDev);
          break;
        case '7':
          this.emprestimoCtrl.listarEmprestimos();
          break;
        case '0':
          console.log('Saindo...');
          break;
        default:
          console.log('Opção inválida!');
      }
    } while (opcao !== '0');
  }
}
