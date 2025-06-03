import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Usuario from '../model/Usuario';
import { supabase } from '../config/supabase';

describe('UsuarioRepository', () => {
    let repository: UsuarioRepository;
    let usuarioTeste: Usuario;

    beforeAll(async () => {
        repository = new UsuarioRepository();
        
        // Limpar a tabela antes dos testes
        await supabase.from('usuarios').delete().neq('id', 0);
    });

    beforeEach(() => {
        const timestamp = new Date().getTime();
        usuarioTeste = new Usuario(
            null as any,
            `20230001${timestamp}`,
            'Maria Santos',
            `maria${timestamp}@email.com`,
            '987654321'
        );
    });

    it('deve criar um novo usuário', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        expect(usuarioSalvo).not.toBeNull();
        expect(usuarioSalvo?.getNome()).toBe('Maria Santos');
        expect(usuarioSalvo?.getId()).toBeGreaterThan(0);
    });

    it('deve buscar um usuário por ID', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        if (!usuarioSalvo) throw new Error('Falha ao criar usuário para teste');

        const usuarioEncontrado = await repository.buscarPorId(usuarioSalvo.getId());
        expect(usuarioEncontrado).not.toBeNull();
        expect(usuarioEncontrado?.getNome()).toBe('Maria Santos');
    });

    it('deve atualizar um usuário', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        if (!usuarioSalvo) throw new Error('Falha ao criar usuário para teste');

        usuarioSalvo.setNome('Maria Silva Santos');
        const atualizado = await repository.atualizar(usuarioSalvo);
        expect(atualizado).toBe(true);

        const usuarioAtualizado = await repository.buscarPorId(usuarioSalvo.getId());
        expect(usuarioAtualizado?.getNome()).toBe('Maria Silva Santos');
    });

    it('deve deletar um usuário', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        if (!usuarioSalvo) throw new Error('Falha ao criar usuário para teste');

        const deletado = await repository.deletar(usuarioSalvo.getId());
        expect(deletado).toBe(true);

        const usuarioEncontrado = await repository.buscarPorId(usuarioSalvo.getId());
        expect(usuarioEncontrado).toBeNull();
    });

    it('deve buscar todos os usuários', async () => {
        await repository.criar(usuarioTeste);
        
        const outroUsuario = new Usuario(
            0,
            '20230002',
            'João Silva',
            'joao@email.com',
            '123456789'
        );
        await repository.criar(outroUsuario);

        const usuarios = await repository.buscarTodos();
        expect(usuarios.length).toBeGreaterThanOrEqual(2);
    });
}); 