# 🍽️ Restaurante API

Bem-vindo à **API de Pedidos de Restaurante** — desenvolvida com foco em simplicidade, escalabilidade e ✨ organização!

> Gerencie pedidos, pratos e usuários com segurança e eficiência. Tudo com o poder do **Prisma ORM** + Node.js.

![Dashboard](https://via.placeholder.com/900x400.png?text=Dashboard+de+Pedidos)

---

## 🧠 Tecnologias Utilizadas

- ⚙️ **Node.js + Express**
- 🧩 **Prisma ORM** (PostgreSQL ou MySQL)
- 🔐 **JWT** para autenticação
- 🧪 **Jest** para testes
- ⚓ **Docker** (opcional para ambiente isolado)

---

## 🧩 Prisma ORM — O Coração da Persistência

Utilizamos o **Prisma ORM** para comunicação com o banco de dados, com vantagens como:

- Tipagem automática dos dados 💡
- Autocompletar no VS Code 🤖
- Migrations fáceis e seguras 📜
- Relacionamentos poderosos (1:N, N:N)

🔑 Principais Rotas da API

Método	Rota	Descrição
GET	/menu	🍝 Lista todos os pratos
POST	/order	📝 Criar novo pedido
PUT	/order/:id	🔄 Atualizar status do pedido
GET	/orders/history	📜 Histórico de pedidos
POST	/auth/login	🔐 Login do usuário


📁 src
├── controllers     # Lógica de cada recurso
├── prisma          # Cliente Prisma e seed
├── routes          # Endpoints da API
├── middlewares     # Autenticação, erros, etc
├── utils           # Funções auxiliares
└── config          # Variáveis e conexão


# Clone o repositório
git clone https://github.com/seuusuario/restaurante-api.git

cd restaurante-api

# Instale as dependências
npm install

# Copie e configure variáveis de ambiente
cp .env.example .env

# Gere o cliente Prisma e execute as migrations
npx prisma generate
npx prisma migrate dev --name init

# (Opcional) Popule o banco
npx prisma db seed

# Inicie o servidor
npm start
