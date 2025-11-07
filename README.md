# 📝 Gerador de Contratos - Back-End (Node.js + MySQL)

Este projeto é uma API back-end para geração e gerenciamento de modelos de contratos personalizados. Os usuários podem se registrar, fazer login e preencher contratos com seus próprios dados. Apenas administradores podem criar novos modelos.

## 🔧 Tecnologias Utilizadas

- Node.js + Express
- MySQL (usando `mysql2`)
- JWT para autenticação
- Bcrypt para hash de senhas
- Mustache para renderização de modelos dinâmicos
- Cookie-parser

---

## 🚀 Funcionalidades

### 🛡️ Autenticação
- Registro de usuários com hash de senha (`bcrypt`)
- Login com JWT + cookies
- Verificação de token para proteger rotas
- Controle de acesso por função (usuário comum vs. administrador)

### 📄 Contratos
- Administradores podem:
  - Criar modelos de contrato com título, descrição e conteúdo com placeholders (ex: `{{nome}}`)
- Usuários autenticados podem:
  - Listar todos os modelos disponíveis
  - Selecionar um modelo por ID
  - Preencher o modelo com seus dados via POST e receber o texto final renderizado

---

## 📦 Estrutura das Rotas

| Método | Rota                        | Proteção         | Descrição                                          |
|--------|-----------------------------|------------------|----------------------------------------------------|
| POST   | `/Register`                 | Pública          | Cria nova conta de usuário                         |
| POST   | `/Login`                    | Pública          | Login e geração de JWT                             |
| GET    | `/`                         | Token de usuário | Lista todos os modelos de contrato                 |
| GET    | `/Contract/:id`            | Token de usuário | Retorna um modelo de contrato específico           |
| POST   | `/Contract_Edit/:id`       | Token de usuário | Aplica os dados no modelo (render com Mustache)   |
| POST   | `/Admin/Models/Add`        | Apenas admins    | Adiciona um novo modelo de contrato                |

---

## ⚙️ Instalação e Uso

1. Clone o repositório:
   ```bash
   git clone https://github.com/RafaelHenriqu/ContratEasy.git
   cd ContratEasy

2. Instale as dependências:

````bash
npm install
````

3. Configure o .env:
````env
host=localhost
user=root
password=sua_senha
port=3306
database=contratos
SC=sua_chave_jwt
````

4. Inicie o servidor:

````bash
node index.js
````

## 🧪 Exemplo de Uso (via Postman)
1. Faça login e salve o cookie Token

2. Acesse GET / para ver os modelos

3. Acesse POST /Contract_Edit/:id com um corpo como:

````json
{
    "Nome":"exemplo",
    "Projeto":"exemplo",
    "Empresa":"exemplo"
}
````

E receba o contrato final preenchido!

## 📚 Licença
Este projeto é de código aberto, feito para fins educacionais e profissionais. Fique à vontade para usar e adaptar.
