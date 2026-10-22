# ItaPet 🐾 - Gestão Animal Inteligente (Plataforma Web Oficial)

O **ItaPet** é a plataforma oficial desenvolvida para a prefeitura de **Itaiópolis - SC**, focada na digitalização, desburocratização e monitoramento da população animal do município. O sistema conecta cidadãos e a equipe veterinária municipal em um ecossistema integrado de cadastro, carteirinha digital com QR Code, acompanhamento de vacinas, rastreamento por microchip e feira de adoção.

---

## 🌟 Transição para a Web

Originalmente concebido como aplicativo móvel, o **ItaPet evoluiu para uma Plataforma Web moderna e acessível**, trazendo vantagens cruciais:
1. **Sem Necessidade de Download:** O cidadão não precisa baixar apps pesados; acessa pelo celular ou computador diretamente pelo navegador.
2. **Ambiente Otimizado para a Prefeitura:** Veterinários e servidores usam computadores de mesa com teclado, leitor de código de barras USB e monitores grandes, acelerando os atendimentos em até 5x.
3. **Consulta Pública Instantânea:** Qualquer munícipe que encontrar um animal perdido na rua pode bipar a medalha de QR Code com a câmera do celular e acessar o portal na hora.
4. **Preservação de Dados Históricos:** Os **822 registros de castração e microchipagem** legados do arquivo `relatorio_consolidado.csv` foram 100% preservados, higienizados e integrados à plataforma.

---

## ✨ Funcionalidades da Plataforma Web

### 👨‍👩‍👧 Para o Munícipe (Cidadão)
* **Cadastro Rápido do Animal:** Envio de até 4 fotos reais, raça, porte, sexo e seleção do bairro em Itaiópolis.
* **Carteira Digital do Pet (Passaporte ItaPet):** Documento oficial com **QR Code em tempo real**, histórico de vacinas e botão de impressão em PDF.
* **Vincular Pet Histórico:** Ferramenta inteligente para o munícipe reivindicar seu pet castrado em mutirões anteriores e vinculá-lo à sua conta.
* **Solicitação de Castração Municipal:** Formulário de agendamento gratuito com geração de senha e prioridade para famílias com CadÚnico/NIS.
* **Feira de Adoção:** Galeria de animais resgatados pelo município prontos para adoção responsável com contato direto via WhatsApp.

### 🩺 Para a Equipe Técnica (Veterinário / Prefeitura)
* **Buscador Universal de Microchip:** Busca instantânea por número de Microchip (15 dígitos), Nome do Pet ou Nome do Tutor.
* **Fila de Homologação:** Aprovação (✅) ou solicitação de retificação (❌) com motivo direto ao morador.
* **Lançamento de Vacinas:** Aplicação de doses (Antirrábica, V8/V10, vermífugos) com data, observações e registro do CRMV.
* **Auditoria de Dados:** Alertas visuais automáticos para microchips duplicados ou cadastros pendentes de endereço.
* **Exportação de Relatórios:** Geração de relatórios da prefeitura em formato CSV com 1 clique.

### 🔍 Para Toda a Comunidade (Acesso Público & LGPD)
* **Consulta Pública de Microchip:** Verificação rápida de animais encontrados na rua com dados de tutores mascarados para total conformidade com a LGPD.

---

## 🛠️ Stack Tecnológica Web

* **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
* **Ícones & Interface:** [Lucide React](https://lucide.dev/)
* **Geração de QR Code:** [QRCode](https://github.com/soldair/node-qrcode)
* **Backend as a Service:** [Google Firebase](https://firebase.google.com/)
  * **Authentication:** Login por E-mail, CPF e sessões simuladas
  * **Firestore Database:** Banco de dados NoSQL com regras de segurança RBAC (`firestore.rules`)
  * **Firebase Storage:** Armazenamento seguro de fotos e comprovantes (`storage.rules`)
  * **Firebase Hosting:** Hospedagem escalável configurada em `firebase.json`

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js (v18 ou superior - testado com Node v24).

### Rodando o Site Web
```bash
# Instalar dependências da web (caso ainda não tenha feito)
cd web && npm install && cd ..

# Iniciar o servidor de desenvolvimento
npm run dev:web
```
O site estará disponível em **`http://localhost:5173/`**.

### Compilar para Produção
```bash
npm run build:web
```
Gera a pasta otimizada `web/dist/` pronta para deploy.

### Scripts de Migração de Dados (ETL)
```bash
# 1. Higienizar e validar o CSV com 822 registros
npm run migrate:csv

# 2. Simular o envio em lotes (Dry-Run)
node ./scripts/upload_to_firestore.js --dry-run

# 3. Gravar os 822 registros no Firestore (Ao Vivo)
node ./scripts/upload_to_firestore.js --live
```

---

*Desenvolvido com carinho para a Secretaria de Meio Ambiente e Proteção Animal de Itaiópolis - SC.*
