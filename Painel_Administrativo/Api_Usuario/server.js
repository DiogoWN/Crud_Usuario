import express, { request, response } from 'express'
import pool from './conexao.js'

const app = express()
app.use(express.static('public')) //Serve para o Express acessar o HTML e o CSS 
app.use(express.json()) //Serve poara o Express entender os dados em formato JSON 
app.use(express.urlencoded({ extended: true })) //Serve para o Express receber as requisições do HTML e ler objetos mais complexos

// Adiciona o usuário
app.post('/usuario', async (req, res) => {
    const { nome, email, cpf, telefone, data_nascimento } = req.body //Pega os dados dos usuários

    try {
        const sql = 'INSERT INTO usuarios (nome, email, cpf, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)'

        await pool.query(sql, [nome, email, cpf, telefone, data_nascimento]) //Envia os dados dos usuários
        res.redirect('/lista_usuario.html')//Leva o para a lista de usuários
    } catch (error) {
        console.error('[ERRO!] Ao inserir no MySQL:', error)
        res.status(500).send('[ERRO!] Ao cadastrar usuário no banco de dados.')
    }
})

// Listar o usuário
app.get('/usuario', async (req, res) => {
    try {
        const sql = `
            SELECT id, nome, email, cpf, telefone, 
                   DATE_FORMAT(data_nascimento, '%d/%m/%Y') AS data_nascimento 
            FROM usuarios 
            WHERE ativo = 1 OR ativo = true OR ativo IS NULL
        `
        const [rows] = await pool.query(sql)
        res.json(rows)
    } catch (error) {
        console.error('[ERRO MYSQL]:', error);
        res.status(500).send('Erro no servidor')
    }
})

//Buscar um usuário
app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT id, nome, email, cpf, telefone, 
                   DATE_FORMAT(data_nascimento, '%d/%m/%Y') AS data_nascimento 
            FROM usuarios 
            WHERE id = ? AND (ativo = true OR ativo = 1)
        `;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('[ERRO!]:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Edita o usuário
app.put('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, cpf, telefone, data_nascimento } = req.body;

    try {
        const sql = `
            UPDATE usuarios 
            SET nome = ?, email = ?, cpf = ?, telefone = ?, data_nascimento = ?
            WHERE id = ? AND (ativo = true OR ativo = 1)
        `;
        
        // Executa a query passando os valores recebidos no body
        const [result] = await pool.query(sql, [
            nome, 
            email, 
            cpf, 
            telefone, 
            data_nascimento, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.send('Usuário atualizado com sucesso');
    } catch (error) {
        console.error('[ERRO SQL NO PUT]:', error);
        res.status(500).send(`Erro no banco de dados: ${error.message}`);
    }
});

//Deleta o usuário
app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params

    try {
        const sql = 'UPDATE usuarios SET ativo = false WHERE id = ?'
        const [resultado] = await pool.query(sql, [id])

        if (resultado.affectedRows === 0) { //Vê se tev alguma linha alterada
           return res.status(404).send('[ERRO!] Usuário não encontrado')
        }

        res.status(200).send('Usuário removido com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).send('Erro ao deletar usuário no banco de dados.');
    }
})

app.listen(3000)
