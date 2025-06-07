# 🛠️ GEST ON - Sistema de Gerenciamento Técnico

**GEST ON** é uma aplicação web desenvolvida para empresas de manutenção de computadores e impressoras. A plataforma oferece um painel completo para gerenciar clientes, equipamentos, chamados técnicos, problemas reportados e soluções aplicadas.


## 🚀 Tecnologias Utilizadas

- **Next.js** — Framework React para aplicações web modernas
- **React.js** — Interface declarativa e baseada em componentes
- **TypeScript** — Tipagem estática para maior robustez no código
- **Tailwind CSS** — Estilização rápida e responsiva com classes utilitárias
- **Supabase** — Backend as a Service com autenticação e banco de dados PostgreSQL
- **Neon PostgreSQL** — Banco de dados em nuvem performático
- **Prisma ORM** — Mapeamento objeto-relacional moderno e intuitivo

---

## 🎯 Objetivo

Automatizar e facilitar o gerenciamento de ordens de serviço (OS) em empresas de suporte técnico, oferecendo:

- Cadastro e gerenciamento de **clientes e equipamentos**
- Registro de **chamados técnicos** com controle de status
- Associação de **problemas e soluções** por equipamento
- **Controle de permissões** por tipo de usuário (admin, técnico, atendente)
- Interface **moderna, responsiva e intuitiva**

---

## 💡 Paradigmas Utilizados

### 🔹 Programação Orientada a Componentes (POC)
Com React e Next.js, toda a interface é construída a partir de componentes reutilizáveis, promovendo escalabilidade e organização.

### 🔹 Programação Declarativa
O uso de JSX e Tailwind permite descrever diretamente o que a interface deve exibir, melhorando a clareza e manutenção do código.

---

## ✅ Funcionalidades

- 🔐 Autenticação via Supabase com controle de tipo de usuário  
- 🧑‍💼 Dashboard com visualização de chamados por cliente, técnico ou status  
- 🖥️ Registro detalhado de equipamentos e histórico de reparos  
- 🔍 Filtros por status, técnico, data e cliente  
- ⚙️ Página de administração de usuários (admin-only)  


---

## 📸 Capturas de Tela

![Pagina de Login](./public/paginainicial.png)
![Dashboard](./public/dashboard.png)

---

## 🛠️ Como executar localmente

-Instale as dependências 
npm install

-Configure as variáveis de ambiente no arquivo .env.local:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

-Inicie o servidor
npm run dev