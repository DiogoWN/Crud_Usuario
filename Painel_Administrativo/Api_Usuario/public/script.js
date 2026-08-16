async function CarregarUsuario() {
    try {
        const resposta = await fetch('/usuario')
        if (!resposta.ok) {
            console.error('[ERRO!] A rota /usuario retornou um status inválido:', resposta.status)
            return
        }

        const usuarios = await resposta.json()
        const info = document.getElementById('infoUsusario');
        if (!info) return

        info.innerHTML = ''

        usuarios.forEach(u => { // Cria a lista dos usuários
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.cpf}</td>
                <td>${u.telefone}</td>
                <td>${u.data_nascimento || 'N/A'}</td>
                <td> 
                    <button onclick="AtualizarUsuario(${u.id})">Editar</button>
                    <button onclick="ExcluirUsuario(${u.id})">Deletar</button>
                </td>
            `
            info.appendChild(tr)
        });
    } catch (error) {
        console.error('[ERRO!] Lista não carregada', error)
    }
}
CarregarUsuario()

async function ExcluirUsuario(id) {
    if (confirm("Quer deletar esse usuário?")) {
        try {
            const resposta = await fetch(`/usuario/${id}`, {  //Serve para avisar para o fetch mudar de GET para DELETE 
                method: "DELETE"
            })

            if (resposta.ok) {
                alert("Usuário deletado")
                CarregarUsuario() //Serve para o usuário não precisar regarregar a página manualmente
            } else {
                alert("usuário não encontrado")
            }
        } catch (error) {
            console.error('[ERRO!] Ao tentar deletar:', error);
        }
    }
}

async function AtualizarUsuario(id) {
    try {
        const resBusca = await fetch(`/usuario/${id}`) //Busca os datos atuais do usuário 
        if (!resBusca.ok) return alert("Usuário não encontrado")
        const usuarioAtual = await resBusca.json()

        const novoNome = prompt("Digite o novo nome:", usuarioAtual.nome)
        const novoEmail = prompt("Digite o novo e-mail:", usuarioAtual.email)
        const novoCPF = prompt("Digite o novo cpf:", usuarioAtual.cpf)
        const novoTelefone = prompt("Digite o novo telefone:", usuarioAtual.telefone)
        const novaDataBr = prompt("Digite a nova data de nascimento (DD/MM/YYYY):", usuarioAtual.data_nascimento)

        if (!novoNome || !novoEmail || !novoTelefone || !novaDataBr) {
            return alert("Nome, E-mail, Telefone e Data de nascimento são obrigatórios!")
        }

        const partesData = novaDataBr.split('/')
        const dataParaBanco = `${partesData[2]}-${partesData[1]}-${partesData[0]}`
        
        const resposta = await fetch(`/usuario/${id}`, { //Serve para avisar para o fetch mudar de GET para PUT 
            method: "PUT",
            headers: { //Serve para explicar ao Express que as informções vão em formato JSON 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ //Serve para carregar os novos valores
                nome: novoNome,
                email: novoEmail,
                cpf: novoCPF, 
                telefone: novoTelefone,
                data_nascimento: dataParaBanco
            })
        })

        if (resposta.ok) {
            alert("Usuário atualizado com sucesso!")
            CarregarUsuario() // Recarrega a tabela na tela
        } else {
            const msgErro = await resposta.text()
            alert(`Erro ao atualizar: ${msgErro}`)
        }
    } catch (error) {
        console.error('[ERRO!] Ao tentar atualizar o usuário:', error)
    }
}

document.addEventListener('DOMContentLoaded', () => { //Serve para o navegador buscar a tabela depois que toda as estrutura tiver sido carregada e evitar erros de null
    CarregarUsuario()
})