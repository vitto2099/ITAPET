# ITAPET - Sistema de Gestão Animal 🐾

ItaPet é um aplicativo desenvolvido com **Expo** e **Firebase** para facilitar o cadastro e controle de animais em Itaiópolis - SC. O app permite que cidadãos cadastrem seus pets e que veterinários (administradores) aprovem esses cadastros e gerenciem vacinas.

---

## 🚀 Como Rodar Localmente

Para rodar o projeto em sua máquina, siga os passos abaixo:

### 1. Pré-requisitos
* **Node.js** instalado (versão 18 ou superior recomendada).
* **npm** ou **yarn**.
* **Expo Go** instalado no seu celular (para testar em dispositivo real).

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
# Entre na pasta do projeto
cd ITAPET

# Instale as dependências
npm install
```

### 3. Configuração do Firebase (CRUCIAL)
O app depende do Firebase. Se você não configurou as chaves, o app pode falhar ao tentar autenticar ou salvar dados.
1. Vá em `src/services/firebaseConfig.ts`.
2. Substitua os placeholders (`SUA_API_KEY`, etc.) pelas suas credenciais do Firebase Console.

### 4. Executando o App
```bash
npm start
```
* Pressione `w` para abrir no navegador (Web).
* Use o QR Code no app **Expo Go** (Android/iOS) para abrir no celular.
* **Nota:** O celular e o computador devem estar na **mesma rede Wi-Fi**.

---

## 🗺️ Guia de Navegação

O app utiliza **Expo Router** e está dividido em fluxos:

### Fluxo de Autenticação (`/(auth)`)
* **Login:** Tela inicial. 
* **Cadastro:** Criação de novas contas para cidadãos.

### Fluxo do Usuário Cidadão (`/(user)`)
* **Home:** Lista de pets do usuário e status de aprovação.
* **Cadastrar Pet:** Formulário para enviar dados de um novo animal.
* **Perfil:** Configurações da conta.
* **Ajuda:** Informações de suporte.

### Fluxo Administrativo / Veterinário (`/(admin)`)
* **Dashboard:** Busca de animais por microchip e filtros por bairro.
* **Aprovar Pets:** Lista de cadastros pendentes para validação.

---

## 🧪 Configurações de Teste

Como o sistema ainda está em desenvolvimento, existem facilidades para teste:

### 1. Como entrar como Administrador
O app possui uma lógica de simulação no login:
* Para acessar o **Painel Admin**: Use qualquer e-mail que contenha a palavra `admin` (ex: `admin@itapet.com`).
* Para acessar o **Painel Cidadão**: Use qualquer outro e-mail.

### 2. Dados Mockados
Algumas telas (como a Home e o Dashboard) exibem dados fictícios ("Rex", "Luna") para que você possa visualizar a interface mesmo sem conexão com o banco de dados.

---

## 🛠️ Solução de Problemas (Troubleshooting)

* **"Não consigo acessar nada após o login":** Verifique se o Firebase está configurado corretamente em `src/services/firebaseConfig.ts`.
* **"O QR Code não carrega no celular":** Certifique-se de que o computador e o celular estão no mesmo Wi-Fi. Tente mudar o modo de conexão no terminal para `Tunnel` se o `LAN` falhar.
* **"Erro de módulo não encontrado":** Rode `npm install` novamente para garantir que tudo foi baixado.

---

*Desenvolvido para a comunidade de Itaiópolis - SC.*
