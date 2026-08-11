import mysql from 'mysql2/promise';

const pool = mysql.createPool({ // Criando o pool de conexões com o MySQL
  host: 'localhost',
  user: '',  // <- Coloque aqui seu usuário
  password: '', // <- Coloque aqui a senha
  database: '',  // <- Coloque aqui o nome do seu banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; // Exportando o pool para que possa ser usado em outros arquivos da aplicação