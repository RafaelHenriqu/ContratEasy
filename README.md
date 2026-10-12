# ContratEasy

O **ContratEasy** é uma API RESTful para gerenciamento de contratos. Permite criar, editar, visualizar e remover contratos, com autenticação via JWT e controle de visibilidade por status.

## 🚀 Funcionalidades

### 🔐 Autenticação e Segurança
- Registro e Login de usuários.
- JWT (JSON Web Tokens) para sessões seguras e *stateless*.
- Cookies `httpOnly` para prevenir ataques XSS.
- Senhas protegidas com `bcrypt`.

### 📄 Gestão de Contratos (CRUD)
- Criar contrato com validação estrita de tipos e campos obrigatórios.
- Ver apenas os próprios contratos (perfil).
- Ver contratos públicos (ativos e concluídos) na busca global.
- Editar contrato com verificação de propriedade.
- Remover contrato com validação de permissão.

### 🛡️ Controle de Acesso por Status
- Status `ativo` ou `concluido`: visíveis para todos os usuários.
- Status `inativo`: oculto na busca global, visível apenas para o dono.
- Validação de dados: o servidor rejeita tipos incorretos (ex: `Value` deve ser número).

## 🛠️ Tecnologias

- Node.js
- Express.js
- MySQL
- JsonWebToken (JWT)
- Bcrypt
- dotenv

## 📦 Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/RafaelHenriqu/ContratEasy.git
cd contrateasy
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados (MySQL):
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

4. Crie um arquivo `.env` na raiz com:
```env
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=sua_porta
SERVER_PORT=porta_do_servidor
DB_NAME=nome_do_banco
SECRETS_JWT=sua_chave_secreta_aqui
```

1. Inicie o servidor:
```bash
npm run dev
```

## 📡 Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST   | /auth/register | Cria uma nova conta de usuário |
| POST   | /auth/login | Autentica e retorna o JWT |

### Contratos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|:----:|
| POST   | /contracts/create | Cria um novo contrato | ✅ |
| PUT    | /contracts/edit | Edita um contrato existente | ✅ |
| DELETE | /contracts/del | Remove um contrato | ✅ |
| GET    | /contracts/search | Lista contratos públicos | ✅ |
| GET    | /contracts/profile | Lista contratos do usuário logado | ✅ |

## 📝 Exemplo de Requisição

**POST /contracts**

```json
{
  "Title": "Consultoria de Marketing",
  "Description": "Projeto de SEO para site XYZ",
  "Status": "ativo",
  "Value": 1500.00
}
```

**Resposta:**

```json
{
  "message": "Contrato criado!"
}
```

## 📄 Licença

Projeto desenvolvido para fins de portfólio e estudo.

---

Feito com carinho por **Rafael Henrique**
