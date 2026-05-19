# Documentação Técnica - ItaPet

Esta documentação fornece uma visão técnica detalhada sobre a estrutura do projeto, o schema do banco de dados Firestore e os fluxos de arquitetura do aplicativo.

---

## 📂 1. Estrutura de Diretórios (Expo Router)

O projeto utiliza o **Expo Router** baseado em arquivos (file-based routing), separando as rotas por grupos lógicos `(auth)`, `(user)` e `(admin)`.

```text
ITAPET/
├── app/                      # Rotas e Telas Principais (Expo Router)
│   ├── (auth)/               # Rotas de Autenticação (públicas)
│   │   ├── login.tsx         # Tela de Login
│   │   ├── cadastro.tsx      # Criação de conta
│   │   └── esqueci-senha.tsx # Recuperação de conta via Firebase Auth
│   ├── (user)/               # Rotas exclusivas de Tutores (Cidadãos)
│   │   ├── home.tsx          # Dashboard do usuário com lista de seus pets
│   │   ├── cadastrar-pet.tsx # Formulário (com envio de fotos pro Storage)
│   │   ├── editar-meu-pet.tsx# Edição de dados e exclusão do pet
│   │   ├── detalhes-pet.tsx  # Ficha do pet (galeria de fotos e linha do tempo)
│   │   └── perfil.tsx        # Edição de perfil e exclusão de conta
│   ├── (admin)/              # Rotas exclusivas do Veterinário / Prefeitura
│   │   ├── dashboard.tsx     # Buscador por microchip, filtros por bairro
│   │   ├── aprovar-pets.tsx  # Fila de moderação de cadastros
│   │   ├── cadastrar-pet-admin.tsx # Lançamento de vacinas e Microchip
│   │   └── editar-pet.tsx    # Deleção permanente pelo sistema
│   └── _layout.tsx           # Layout principal (gerencia contexto de autenticação)
├── src/                      # Lógica de Negócios e Configurações
│   ├── contexts/             # Context API (AuthContext)
│   ├── services/             # Configs (firebaseConfig.ts, uploadImage.ts)
│   ├── styles/               # Arquivos de estilização StyleSheet separados
│   └── types/                # Tipagens TypeScript (ex: pet.ts, user.ts)
└── assets/                   # Imagens locais e fontes do app
```

---

## 💾 2. Banco de Dados (Firestore Schema)

O sistema utiliza duas coleções principais: `users` e `registrations`.

### Coleção: `users`
Armazena informações adicionais dos usuários autenticados (além das credenciais guardadas pelo Firebase Auth).

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `uid` | String | (Document ID) Mesmo ID do Firebase Auth |
| `nome` | String | Nome completo do usuário |
| `cpf` | String | CPF para buscas e verificação de exclusividade |
| `telefone` | String | Contato |
| `role` | String | Nível de permissão (`"admin"` ou `"user"`) |
| `fotoPerfil` | String | URL da foto hospedada no Firebase Storage |
| `criadoEm` | Timestamp | Data da criação da conta |

### Coleção: `registrations`
Armazena todos os cadastros de animais.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | String | (Document ID) Gerado automaticamente pelo Firebase |
| `userId` | String | ID do dono do animal (Referência a `users`) |
| `nomeAnimal`| String | Ex: "Rex", "Caramelo" |
| `especie` | String | "Canino", "Felino", etc. |
| `raca` | String | SRD, Poodle, Labrador, etc. |
| `bairro` | String | Localização em Itaiópolis |
| `status` | String | `"pendente"`, `"aprovado"`, `"concluido"` |
| `microchip` | String | Código do microchip (pode ser vazio no início) |
| `fotosPet` | Array<String> | Array contendo até 4 links das fotos do animal |
| `fotoUrl` | String | (Legado) Foto principal do animal |
| `carteiraUrl`| String | Link para a foto do documento de vacinação |
| `criadoEm` | Timestamp | Data da submissão do formulário |
| `vacinas` | Array<Object> | Histórico de vacinas e procedimentos inseridos pelo admin |

**Estrutura do Objeto dentro de `vacinas`:**
```json
{
  "nome": "Antirrábica",
  "data": "19/05/2026",
  "fotoUrl": "https://firebasestorage..."
}
```

---

## 🔒 3. Controle de Acesso e Segurança (RBAC)

A segurança é gerenciada através da propriedade `role` dentro do documento do usuário no Firestore, verificada via React Context API (`AuthContext`).

1.  **Cidadão (`role === 'user'`):**
    *   Ao acessar `(user)/home.tsx`, a consulta no banco força `where("userId", "==", user.uid)`, garantindo que ele só veja os próprios pets.
    *   Ao tentar acessar rotas `(admin)`, o Context API pode bloquear ou não renderizar atalhos.
2.  **Veterinário (`role === 'admin'`):**
    *   Pode ler todos os registros em `(admin)/dashboard.tsx` e não é bloqueado por restrições de `userId`.
    *   Exclusivo acesso a rotas de alteração severa (`deleteDoc`) em pets alheios.

---

## 📸 4. Fluxo de Upload de Imagens

O gerenciamento de imagens (fotos dos animais e perfis) segue este fluxo:
1.  Usuário escolhe foto via `expo-image-picker`.
2.  Função `uploadImage` (em `src/services/uploadImage.ts`) converte o arquivo gerado pelo aparelho em um **Blob**.
3.  O arquivo é enviado para o **Firebase Storage** no caminho `/registrations/{user_uid}/pet_{timestamp}.jpg`.
4.  É retornado um `DownloadURL` público.
5.  O URL é gravado nos campos `fotosPet` (Array) ou `carteiraUrl` (String) no **Firestore**.

---

## 🛠️ 5. Scripts Úteis
*   Para iniciar o app limpando o cache: `npx expo start -c`
*   Para compilar os erros do TypeScript: `npx tsc --noEmit`
