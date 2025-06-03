import { UsuarioRepository } from '../repositories/UsuarioRepository';
import Usuario from '../model/Usuario';

async function testarRepositorioUsuarios() {
    console.log('Iniciando testes do repositório de usuários...\n');
    
    const repo = new UsuarioRepository();
    
    try {
        // Teste de criação
        console.log('1. Testando criação de usuário...');
        const novoUsuario = new Usuario(
            1,
            'MAT001',
            'João Silva',
            'joao.silva@email.com',
            '(11) 98765-4321'
        );
        
        const usuarioSalvo = await repo.criar(novoUsuario);
        if (usuarioSalvo) {
            console.log('✓ Usuário criado com sucesso');
            console.log('Dados do usuário:', {
                id: usuarioSalvo.getId(),
                matricula: usuarioSalvo.getMatricula(),
                nome: usuarioSalvo.getNome(),
                email: usuarioSalvo.getEmail(),
                telefone: usuarioSalvo.getTelefone()
            });
        } else {
            throw new Error('Falha ao criar usuário');
        }

        // Teste de busca
        console.log('\n2. Testando busca de usuário...');
        const usuarioEncontrado = await repo.buscarPorId(usuarioSalvo.getId());
        if (usuarioEncontrado) {
            console.log('✓ Usuário encontrado com sucesso');
            console.log('Dados do usuário:', {
                id: usuarioEncontrado.getId(),
                matricula: usuarioEncontrado.getMatricula(),
                nome: usuarioEncontrado.getNome(),
                email: usuarioEncontrado.getEmail(),
                telefone: usuarioEncontrado.getTelefone()
            });
        } else {
            throw new Error('Falha ao buscar usuário');
        }

        // Teste de atualização
        console.log('\n3. Testando atualização de usuário...');
        usuarioEncontrado.setTelefone('(11) 99999-9999');
        const atualizou = await repo.atualizar(usuarioEncontrado);
        if (atualizou) {
            console.log('✓ Usuário atualizado com sucesso');
        } else {
            throw new Error('Falha ao atualizar usuário');
        }

        // Teste de listagem
        console.log('\n4. Testando listagem de usuários...');
        const todosUsuarios = await repo.buscarTodos();
        console.log('✓ Usuários listados com sucesso');
        console.log('Total de usuários:', todosUsuarios.length);

        // Teste de deleção
        console.log('\n5. Testando deleção de usuário...');
        const deletou = await repo.deletar(usuarioSalvo.getId());
        if (deletou) {
            console.log('✓ Usuário deletado com sucesso');
        } else {
            throw new Error('Falha ao deletar usuário');
        }

    } catch (error) {
        console.error('✗ Erro durante os testes:', error);
    }

    console.log('\nTestes concluídos!');
}

// Executar os testes
testarRepositorioUsuarios(); 