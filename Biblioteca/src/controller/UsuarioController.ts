export class UsuarioController {
  private usuarios: any[] = [];

  cadastrarUsuario(nome: string) {
    const usuario = { id: this.usuarios.length + 1, nome };
    this.usuarios.push(usuario);
    console.log('Usuário cadastrado com sucesso!');
  }

  listarUsuarios() {
    this.usuarios.forEach(u => {
      console.log(`ID: ${u.id} | Nome: ${u.nome}`);
    });
  }

  getUsuarios() {
    return this.usuarios;
  }

  buscarUsuario(id: number) {
    return this.usuarios.find(u => u.id === id);
  }
}
