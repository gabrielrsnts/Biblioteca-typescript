import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Usuario from '../model/Usuario';
import { supabase } from '../config/supabase';
import { retryOperation } from '../utils/databaseUtils';

describe('UsuarioRepository', () => {
    let repository: UsuarioRepository;
    let usuarioTeste: Usuario;

    beforeAll(async () => {
        repository = new UsuarioRepository();
        
        // Limpar a tabela antes dos testes
        await supabase.from('usuarios').delete().neq('id', 0);
    });

    beforeEach(async () => {
        // Limpar a tabela antes de cada teste
        await supabase.from('usuarios').delete().neq('id', 0);
        
        const timestamp = new Date().getTime();
        usuarioTeste = new Usuario(
            null as any,
            `20230001${timestamp}`,
            'João Silva',
            `joao${timestamp}@email.com`,
            '987654321'
        );
    });

    it('deve criar um novo usuário', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        expect(usuarioSalvo).not.toBeNull();
        expect(usuarioSalvo?.getId()).toBeGreaterThan(0);
        expect(usuarioSalvo?.getNome()).toBe('João Silva');
    });

    it('deve buscar um usuário por ID', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        if (!usuarioSalvo) throw new Error('Falha ao criar usuário para teste');

        const usuarioEncontrado = await retryOperation(async () => {
            const result = await repository.buscarPorId(usuarioSalvo.getId());
            if (!result) throw new Error('Usuário não encontrado após criação');
            return result;
        });

        expect(usuarioEncontrado.getId()).toBe(usuarioSalvo.getId());
        expect(usuarioEncontrado.getNome()).toBe(usuarioSalvo.getNome());
    });

    it('deve atualizar um usuário', async () => {
        const usuarioSalvo = await repository.criar(usuarioTeste);
        if (!usuarioSalvo) throw new Error('Falha ao criar usuário para teste');

        usuarioSalvo.setNome('Maria Silva Santos');
        
        const atualizado = await retryOperation(async () => {
            const result = await repository.atualizar(usuarioSalvo);
            if (!result) throw new Error('Falha ao atualizar usuário');
            return result;
        });

        expect(atualizado).toBe(true);

        const usuarioAtualizado = await retryOperation(async () => {
            const result = await repository.buscarPorId(usuarioSalvo.getId());
            if (!result) throw new Error('Usuário não encontrado após atualização');
            return result;
        });

        expect(usuarioAtualizado.getNome()).toBe('Maria Silva Santos');
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
        // Criar primeiro usuário
        const usuario1 = await retryOperation(async () => {
            const result = await repository.criar(usuarioTeste);
            if (!result) throw new Error('Falha ao criar primeiro usuário para teste');
            return result;
        });

        // Criar segundo usuário com dados diferentes
        const timestamp = new Date().getTime();
        const usuario2 = new Usuario(
            null as any,
            `20230002${timestamp}`,
            'Maria Santos',
            `maria${timestamp}@email.com`,
            '123456789'
        );

        const usuarioSalvo2 = await retryOperation(async () => {
            const result = await repository.criar(usuario2);
            if (!result) throw new Error('Falha ao criar segundo usuário para teste');
            return result;
        });

        // Buscar todos os usuários com retry
        const usuarios = await retryOperation(async () => {
            const result = await repository.buscarTodos();
            if (result.length < 2) throw new Error('Número insuficiente de usuários encontrados');
            return result;
        });

        expect(usuarios.length).toBeGreaterThanOrEqual(2);
    });
}); 