CREATE DATABASE IF NOT EXISTS sistema_usuarios;
USE sistema_usuarios;

CREATE TABLE  usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);
select * from usuarios;

SET SQL_SAFE_UPDATES = 0;
UPDATE usuarios SET ativo = true WHERE ativo IS NULL OR ativo = false;
SET SQL_SAFE_UPDATES = 1;