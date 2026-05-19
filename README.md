# ItaPet 🐾 - Gestão Animal Inteligente

O **ItaPet** é uma plataforma moderna desenvolvida para a prefeitura de **Itaiópolis - SC**, focada na digitalização e desburocratização do cadastro e monitoramento da população animal do município. O sistema conecta cidadãos e veterinários municipais em um fluxo eficiente de registro, acompanhamento de vacinas e identificação rápida.

---

## 🌟 O Projeto

O projeto nasceu da necessidade de um controle mais rigoroso sobre os animais domésticos da cidade, permitindo o rastreamento via microchip, gestão do histórico de vacinação e a identificação rápida dos tutores de animais encontrados na rua. Além disso, o app tem um forte aspecto de cidadania, dando aos moradores uma "Carteira Digital" para seus animais.

### Principais Objetivos:
*   **Controle Populacional:** Monitoramento estatístico de raças, espécies e localização por bairro.
*   **Saúde Pública:** Gestão do histórico de vacinação (antirrábica, polivalente, etc.).
*   **Segurança:** Rastreamento via Microchip e prevenção ao abandono.
*   **Cidadania:** Plataforma digital com as fotos, dados e carteirinha do pet.

---

## ✨ Funcionalidades

### 👨‍👩‍👧 Para o Cidadão (Tutor)
*   **Cadastro Digital:** Registre seus pets com até 4 fotos do animal e foto da carteirinha.
*   **Gerenciamento Total:** Edite as informações ou exclua registros de animais diretamente pelo celular.
*   **Histórico em Tempo Real:** Acompanhe o status do cadastro (pendente, aprovado) e veja a linha do tempo de vacinas lançadas pela prefeitura.
*   **Recuperação de Acesso:** Sistema de "Esqueci minha senha" integrado.

### 🩺 Para o Administrador (Veterinário / Prefeitura)
*   **Validação de Cadastros:** Analise as fotos e dados enviados pelos moradores para aprovar (✅) ou rejeitar (❌) registros no sistema.
*   **Lançamento de Procedimentos:** Aplique vacinas e associe números de Microchip diretamente ao histórico do pet cadastrado.
*   **Busca Rápida:** Identificação instantânea buscando por Microchip, CPF ou Nome.
*   **Gestão de Dados Históricos:** O sistema diferencia registros novos dos registros antigos (migrados do papel), mantendo avisos caso o bairro do tutor não esteja especificado.

---

## 🛠️ Stack Tecnológica

O ItaPet foi construído visando alta performance e facilidade de manutenção para os desenvolvedores:

*   **Mobile / Frontend:** [React Native](https://reactnative.dev/) com framework [Expo](https://expo.dev/) (usando Expo Router para navegação em abas/pastas).
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) para segurança total de tipos.
*   **Backend as a Service:** [Firebase](https://firebase.google.com/):
    *   **Authentication:** Login por E-mail/Senha e controle de sessões.
    *   **Firestore Database:** Banco de dados NoSQL em tempo real para armazenamento de pets, usuários e vacinas.
    *   **Firebase Storage:** Armazenamento seguro de imagens (fotos de pets, vacinas, perfis).

---

## 🚀 Guia de Instalação e Execução

### Pré-requisitos
*   Node.js (versão LTS recomendada).
*   App "Expo Go" instalado no seu dispositivo móvel (Android/iOS) ou Emulador.
*   Conta no Firebase Console configurada.

### Rodando o Projeto
1. Clone este repositório no seu computador:
   ```bash
   git clone https://github.com/seu-usuario/ITAPET.git
   cd ITAPET
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o Firebase:
   - Certifique-se de que o arquivo `src/services/firebaseConfig.ts` possui as chaves de acesso corretas do seu projeto no Firebase.
4. Inicie o servidor do Expo:
   ```bash
   npx expo start
   ```
5. Escaneie o QR Code que aparecerá no terminal usando o app Expo Go (ou aperte `a` para rodar no emulador Android).

---

## 📖 Documentação Completa
Para informações detalhadas sobre as coleções do banco de dados, estrutura de arquivos e regras de permissão, consulte o arquivo [DOCUMENTATION.md](./DOCUMENTATION.md) na raiz deste projeto.

---

*Desenvolvido com ❤️ para promover a saúde e a proteção animal na comunidade de Itaiópolis - SC.*
