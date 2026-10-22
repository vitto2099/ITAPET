# 🐾 ItaPet Itaiópolis - Especificação Técnica de UI/UX e Design System
**Versão:** 2.0 (Mobile-First, Acessível & Governamental)  
**Município:** Itaiópolis - Santa Catarina  
**Órgão:** Secretaria Municipal de Agricultura e Meio Ambiente  
**Destinatário:** Equipe de Engenharia Frontend & Desenvolvimento  

---

## 1. Visão Geral e Princípios Fundamentais

Esta especificação foi concebida para transformar o **ItaPet** em uma plataforma pública de padrão ouro em usabilidade, com foco imediato na experiência do cidadão e do médico veterinário através do celular.

### Os 4 Pilares de Design:
1. **Clareza Imediata (Zero Adivinhação):** Nunca depender exclusivamente de emojis isolados ou ícones enigmáticos. Qualquer ação ou filtro deve ter rótulo textual legível e autoexplicativo em português.
2. **Hierarquia Dual de Marca (Autoridade vs. Afeto):** O **Brasão do Município de Itaiópolis** representa a fé pública, a autoridade institucional e a segurança jurídica. O **Logo ItaPet** personifica o acolhimento, o cuidado com os animais e a agilidade do serviço público. Eles nunca devem ficar prensados no mesmo bloco com uma linha fina divisória.
3. **Transparência Histórica:** Categorizar explicitamente os **1.038 animais atendidos no Mutirão de Castração** como `Registros Anteriores (Mutirão)` e diferenciá-los com clareza dos `Novos Cadastros Online`.
4. **Legibilidade e Ergonomia Mobile (WCAG 2.1 AAA):** Eliminar totalmente fontes diminutas (9px, 10px e 11px). Garantir áreas de toque mínimas de **44px a 48px** e contraste estrito para visualização sob luz solar em telas móveis.

---

## 2. Arquitetura Dual Branding: Brasão de Itaiópolis vs. Logo ItaPet

### 2.1 O Problema Anterior
Ambos os logos estavam agrupados lado a lado dentro de uma mesma caixinha `div p-1.5` com um divisor `w-px bg-slate-200`. Isso empobrecia o Brasão Municipal e diminuía o impacto visual do ItaPet, gerando poluição em telas estreitas.

### 2.2 A Nova Solução Arquitetural
Adotar a estrutura padrão de portais governamentais modernos (Gov.br / Prefeituras Digitais):

```
+---------------------------------------------------------------------------------------+
| TOPBAR GOVERNAMENTAL (Fundo escuro neutro ou linho suave - Altura 36px)              |
| [Brasão Itaiópolis] PREFEITURA DE ITAIÓPOLIS - SC | Secretaria de Meio Ambiente      |
+---------------------------------------------------------------------------------------+
| NAVBAR PRINCIPAL DO SERVIÇO (Fundo branco/vidro fosco - Altura 64px a 72px)          |
| [Logo ItaPet] ItaPet [SinPatinhas SC]    | [Links Desktop] | [Modo Vet / Cidadão]     |
+---------------------------------------------------------------------------------------+
```

### 2.3 Especificação dos Locais de Aplicação

#### A. Barra Superior do Aplicativo (`Navbar.tsx` & `App.tsx`)
- **Faixa Superior Institucional (Topbar Governamental):**
  - Fundo: `#084725` (Verde escuro profundo institucional) ou `#0F172A` (Slate 900).
  - Conteúdo à esquerda: `<img src="/brasao_itaiopolis.png" className="h-6 sm:h-7 w-auto" />` seguido de `PREFEITURA MUNICIPAL DE ITAIÓPOLIS` em caixa alta, fonte `text-xs font-bold tracking-wider text-emerald-100`.
  - Conteúdo à direita: `Secretaria de Agricultura e Meio Ambiente • SinPatinhas`.
- **Navbar do ItaPet:**
  - Fundo: `bg-white/95 backdrop-blur-md border-b border-stone-200`.
  - Marca ItaPet: `<img src="/logo.png" className="w-12 h-12 object-contain" />` acompanhado do título `ItaPet` (`text-2xl font-black text-[#0D6838]`) e badge `SinPatinhas 🐾` (`bg-[#EAF7EE] text-[#0D6838] border border-emerald-300`).

#### B. Hero Banner da Página Inicial (`LandingPage.tsx`)
- **Chancela Municipal no Topo do Banner:**
  - Badge em pílula translúcida:
    ```tsx
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-sm">
      <img src="/brasao_itaiopolis.png" alt="Brasão de Itaiópolis" className="h-6 w-auto" />
      <span>Município de Itaiópolis • Secretaria de Agricultura e Meio Ambiente</span>
    </div>
    ```
- **Centro do Banner (Destaque ItaPet):**
  - O Logo do ItaPet ganha protagonismo com moldura própria, integrado ao título oficial da campanha:
    ```tsx
    <div className="flex items-center justify-center gap-3">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-2 shadow-xl ring-4 ring-white/20">
        <img src="/logo.png" alt="ItaPet" className="w-full h-full object-contain" />
      </div>
      <div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white">ItaPet Itaiópolis</h1>
        <p className="text-[#F9C72C] font-extrabold text-sm sm:text-base">Cadastro Oficial SinPatinhas / Identificação Animal</p>
      </div>
    </div>
    ```

#### C. Carteira de Identificação Animal Oficial (`PetCardModal.tsx`)
- **Cabeçalho com Duplo Aval:**
  - Canto Superior Esquerdo: **Brasão de Itaiópolis** com o texto oficial "PREFEITURA MUNICIPAL DE ITAIÓPOLIS - SC • Secretaria de Agricultura e Meio Ambiente".
  - Canto Superior Direito: **Logo ItaPet** com selo "SinPatinhas - Identificação Digital".
  - Isso confere valor documental oficial à carteirinha quando impressa pelo cidadão ou inspecionada pela fiscalização.

---

## 3. Eliminação de Emojis Enigmáticos: Sistema de Filtros Autoexplicativos

### 3.1 Diagnóstico do Usuário
> *"tem muita coisa que nao ta na cara imediatamente tipo um filtro de gato ecachorro ser so o emoji"*

O uso de botões contendo somente emojis (ex: `[🐶]`, `[🐱]`, `[🐾]`) é uma barreira de acessibilidade cognitiva. Cidadãos e servidores públicos precisam de clareza textual imediata.

### 3.2 Novo Padrão de Componente: **Segmented Filter Buttons**
Todos os filtros de seleção rápida devem obrigatoriamente combinar:
**[ Ícone Semântico + Rótulo Textual Descritivo + Contador (quando aplicável) ]**

#### A. Filtro de Espécie
| Chave | Rótulo Desktop | Rótulo Mobile | Ícone | Altura de Toque |
|---|---|---|---|---|
| `Todos` | `🐾 Todos os Animais` | `🐾 Todos` | 🐾 | 46px |
| `Canino` | `🐶 Cães (Caninos)` | `🐶 Cães` | 🐶 | 46px |
| `Felino` | `🐱 Gatos (Felinos)` | `🐱 Gatos` | 🐱 | 46px |

**Código do Componente (Tailwind):**
```tsx
<div className="grid grid-cols-3 gap-2">
  {[
    { key: 'Todos', label: '🐾 Todos os Animais', mobileLabel: '🐾 Todos' },
    { key: 'Canino', label: '🐶 Cães (Caninos)', mobileLabel: '🐶 Cães' },
    { key: 'Felino', label: '🐱 Gatos (Felinos)', mobileLabel: '🐱 Gatos' }
  ].map((esp) => {
    const isSelected = filterEspecie === esp.key;
    return (
      <button
        key={esp.key}
        type="button"
        onClick={() => setFilterEspecie(esp.key)}
        className={`min-h-[46px] px-3 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center text-center ${
          isSelected
            ? 'bg-[#0D6838] text-white border-2 border-[#084725] shadow-md ring-2 ring-emerald-500/20'
            : 'bg-[#FAF8F5] text-stone-700 border-2 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300'
        }`}
      >
        <span className="hidden sm:inline">{esp.label}</span>
        <span className="sm:hidden">{esp.mobileLabel}</span>
      </button>
    );
  })}
</div>
```

#### B. Filtro de Sexo
| Chave | Rótulo Completo | Rótulo Compacto |
|---|---|---|
| `Todos` | `🐾 Ambos os Sexos` | `Todos` |
| `Fêmea` | `♀ Fêmeas` | `♀ Fêmeas` |
| `Macho` | `♂ Machos` | `♂ Machos` |

---

## 4. Categorização Clara dos Registros: Mutirão vs. Novos Cadastros

### 4.1 Cenário Atual
O município possui **1.038 animais** originados das planilhas de castração e microchipagem realizadas pela Prefeitura (`origem === 'relatorio_consolidado_castracao'`). Novos animais entram pelo portal web do cidadão (`origem === 'cadastro_online'`).

### 4.2 O Novo Filtro de Categoria
Adicionar um seletor de alto nível nas telas de consulta (`AnimalExplorer.tsx` e `AdminDashboard.tsx`):

```tsx
<div className="flex flex-wrap gap-2">
  <button
    type="button"
    onClick={() => setFilterOrigem('Todos')}
    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
      filterOrigem === 'Todos'
        ? 'bg-[#0D6838] text-white border-2 border-[#084725] shadow-sm'
        : 'bg-white text-stone-700 border-2 border-stone-200 hover:bg-stone-50'
    }`}
  >
    📁 Todos os Registros (1.038+)
  </button>

  <button
    type="button"
    onClick={() => setFilterOrigem('relatorio_consolidado_castracao')}
    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
      filterOrigem === 'relatorio_consolidado_castracao'
        ? 'bg-[#0369A1] text-white border-2 border-[#075985] shadow-sm'
        : 'bg-blue-50 text-[#0369A1] border-2 border-blue-200 hover:bg-blue-100'
    }`}
  >
    🏛️ Registros Anteriores (Mutirão)
  </button>

  <button
    type="button"
    onClick={() => setFilterOrigem('cadastro_online')}
    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
      filterOrigem === 'cadastro_online'
        ? 'bg-[#15803D] text-white border-2 border-[#166534] shadow-sm'
        : 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100'
    }`}
  >
    ✨ Novos Cadastros Online
  </button>
</div>
```

### 4.3 Badges Visuais Padronizados

#### 🏛️ Badge para Registros Anteriores (Mutirão)
- **Texto:** `🏛️ Registros Anteriores (Mutirão)`
- **Classe Tailwind:** `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0369A1] border-2 border-blue-200 text-xs font-black shadow-2xs`
- **Tooltip / Subtexto Informativo:** *"Atendido no Mutirão Municipal de Castração de Itaiópolis (Procedimento oficial conveniado)."*

#### ✨ Badge para Novos Cadastros Online
- **Texto:** `✨ Novo Cadastro Online`
- **Classe Tailwind:** `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] border-2 border-emerald-300 text-xs font-black shadow-2xs`
- **Tooltip / Subtexto Informativo:** *"Cadastrado digitalmente pelo tutor responsável no Portal ItaPet."*

---

## 5. Escala Tipográfica e Legibilidade (Erradicação de Fontes Minúsculas)

### 5.1 Regra Absoluta
**Fica proibido o uso de `text-[9px]`, `text-[10px]` e `text-[11px]` em qualquer componente da interface.**
Fontes abaixo de 12px são ilegíveis em dispositivos móveis populares e reprovadas nas diretrizes WCAG 2.1 (Critério 1.4.3 e 1.4.12) e no e-MAG (Modelo de Acessibilidade em Governo Eletrônico).

### 5.2 Tabela de Conversão Mandatória

| Código Antigo (Proibido) | Nova Classe Tailwind | Tamanho Real | Aplicação Obrigatória |
|---|---|---|---|
| `text-[9px]`, `text-[10px]` | `text-xs font-bold` | 12px (LH 16px) | Badges de status, carimbos, chips de raça |
| `text-[11px]` | `text-xs font-semibold` ou `text-sm font-medium` | 12px ou 14px | Subtítulos, datas, números de documentos |
| `text-xs` (quando corpo) | `text-sm font-normal` | 14px (LH 20px) | Textos explicativos de cards, observações |
| Inputs com `text-xs` | `text-base font-semibold` | 16px (LH 24px) | **Obrigatório em inputs para celular** (evita zoom automático no iOS!) |
| Botões com `text-xs` | `text-sm font-black` | 14px (LH 20px) | Ações de salvar, filtrar, abrir ficha |

### 5.3 Contraste de Cores em Fundo Claro
- **Texto Principal:** `#132E27` (Verde escuro profundo) ou `#0F172A` (Slate 900) -> Taxa de contraste > **12:1** (Supera o nível AAA de 7:1).
- **Texto Secundário:** `#334155` (Slate 700) -> Taxa de contraste **8.5:1** (Supera o nível AAA).
- **Proibido:** Cinzas claros e lavados como `#94A3B8` ou `#A8A29E` para leitura de informações essenciais.

---

## 6. Ergonomia Mobile-First (Celular & Telas Pequenas)

### 6.1 Touch Targets (Áreas de Toque Mínimas)
- Todo elemento interativo (botão, chip de filtro, link de navegação, campo de input) deve possuir área mínima clicável de **44px x 44px** (ideal **48px x 48px**).
- No Tailwind: usar `min-h-[46px]` ou `min-h-[48px]`, combinado com `px-4 py-2.5` ou `py-3`.

### 6.2 Mobile Bottom Navigation (`App.tsx`)
A barra inferior fixa no celular precisa de rótulos com no mínimo **12px (`text-xs`)** e espaçamento generoso:

```tsx
<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t-2 border-stone-200 shadow-xl px-2 py-2 flex items-center justify-around">
  <button onClick={() => setCurrentView('home')} className="min-h-[48px] flex flex-col items-center justify-center gap-1 px-3">
    <Home className="w-5 h-5 text-stone-600" />
    <span className="text-xs font-bold text-stone-700">Início</span>
  </button>
  <button onClick={() => setIsPublicSearchOpen(true)} className="min-h-[48px] flex flex-col items-center justify-center gap-1 px-3">
    <Search className="w-5 h-5 text-[#0284C7]" />
    <span className="text-xs font-bold text-stone-700">Buscar Chip</span>
  </button>
  <button onClick={() => setIsCastrationModalOpen(true)} className="min-h-[48px] flex flex-col items-center justify-center gap-1 px-3">
    <Syringe className="w-5 h-5 text-rose-600" />
    <span className="text-xs font-bold text-rose-700">Castração</span>
  </button>
  <button onClick={() => setCurrentView('citizen')} className="min-h-[48px] flex flex-col items-center justify-center gap-1 px-3">
    <PawPrint className="w-5 h-5 text-amber-600" />
    <span className="text-xs font-bold text-stone-700">Meus Pets</span>
  </button>
</nav>
```

### 6.3 Substituição de Tabelas por Cards no Mobile
Tabelas horizontais largas (`<table className="w-full">`) geram frustração no celular porque exigem scroll lateral e cortam dados.
- Em resoluções `< 768px` (abaixo de `md`): exibir **Cards Verticais** com Foto, Nome, Microchip, Badge da Origem e Botão de Ação com largura total (`w-full min-h-[46px]`).
- Em resoluções `>= 768px`: exibir a tabela estruturada normalmente.

---

## 7. Roteiro de Implementação Componente por Componente

### 7.1 `web/src/components/Navbar.tsx`
1. Inserir a **Topbar Institucional Municipal** com o Brasão de Itaiópolis (`brasao_itaiopolis.png`) acima da barra de navegação.
2. Na barra do ItaPet, usar a logo do ItaPet com altura de 48px, texto "ItaPet" em 24px e o badge "SinPatinhas SC".
3. Aumentar fontes de navegação de `text-xs` para `text-sm font-extrabold`.
4. Os botões de alternância rápida de perfil (🐶 Cidadão / 🩺 Veterinário) devem ter padding `py-2 px-3.5` e altura de 44px.

### 7.2 `web/src/components/AnimalExplorer.tsx`
1. No seletor de espécie: usar `🐾 Todos os Animais`, `🐶 Cães (Caninos)` e `🐱 Gatos (Felinos)`.
2. Adicionar o **Filtro de Categoria**:
   - `📁 Todos (1.038+)`
   - `🏛️ Registros Anteriores (Mutirão)`
   - `✨ Novos Cadastros Online`
3. Nos cards da listagem:
   - Exibir no topo o badge correspondente à categoria do animal.
   - Para animais do mutirão, exibir: `🏛️ Registros Anteriores (Mutirão)` + número da senha (ex: `Senha #01`).
4. Aumentar fontes de dados do animal (peso, raça, tutor) para `text-xs` e `text-sm`.
5. Na visualização móvel: garantir que os botões de abas (`Filtros`, `Lista`, `Ficha`) tenham altura mínima de 48px e texto de 13px/14px.

### 7.3 `web/src/components/AdminDashboard.tsx`
1. No cabeçalho da Mesa Veterinária:
   - Adicionar o seletor de Categoria/Origem com botões grandes.
   - Atualizar contadores no topo:
     - Total de Animais: 1.038+
     - Registros Anteriores (Mutirão): 1.038
     - Novos Cadastros Online: X
2. Na tabela de animais:
   - Incluir uma coluna visual de **Origem** com os badges `🏛️ Mutirão` e `✨ Novo Online`.
   - Aumentar o tamanho do texto da tabela de `text-xs` para `text-sm`.
   - Ações (botões de visualização e edição) com tamanho mínimo de toque de 44px.

### 7.4 `web/src/components/PetCardModal.tsx`
1. No topo da Carteirinha Oficial:
   - Lado Esquerdo: **Brasão de Itaiópolis** com o título oficial da Prefeitura.
   - Lado Direito: **Logo ItaPet** com a chancela SinPatinhas.
2. No corpo da Carteirinha:
   - Adicionar o carimbo oficial da procedência:
     - Se `origem === 'relatorio_consolidado_castracao'`:
       `🏛️ PROCEDÊNCIA: REGISTRO ANTERIOR (MUTIRÃO MUNICIPAL DE CASTRAÇÃO)`
     - Se `origem === 'cadastro_online'`:
       `✨ PROCEDÊNCIA: CADASTRO DIGITAL VIA PORTAL DO CIDADÃO`
3. Aumentar todas as legendas de `text-[9px]`/`text-[10px]` para `text-xs font-bold`.

### 7.5 `web/src/components/CitizenDashboard.tsx`
1. Atualizar o contador no modal de reivindicação de 822 para **1.038 Animais do Mutirão**.
2. Cada card de pet do cidadão deve exibir o badge claro de procedência.
3. Botões de ação como "Ver Carteira de Identificação Animal ✨" com altura de 48px e tipografia `text-sm font-black`.

### 7.6 `web/src/components/LandingPage.tsx`
1. No Hero:
   - Separar o Brasão da Cidade e a Logo do ItaPet.
   - Selo do Brasão de Itaiópolis na barra institucional do Hero.
   - Logo do ItaPet com o mascote e tipografia amigável em destaque.
2. Aumentar fontes de exemplos de microchip de `text-[11px]` para `text-xs font-bold`.
3. Campo de busca de microchip com altura de 52px e fonte `text-base` para evitar zoom indesejado no celular.

---

## 8. Verificação de Acessibilidade (Checklist de Homologação)

- [x] **Zero Fontes Diminutas:** Nenhuma ocorrência de `text-[9px]`, `text-[10px]` ou `text-[11px]`.
- [x] **Áreas de Toque:** Todos os botões, links e inputs possuem no mínimo 44px de altura.
- [x] **Filtros Autoexplicativos:** Botões contêm texto completo (`[🐶 Cães (Caninos)]`, `[🐱 Gatos (Felinos)]`).
- [x] **Identificação de Base:** Usuário e veterinário conseguem filtrar e identificar instantaneamente os 1.038 animais do mutirão.
- [x] **Dual Branding:** Brasão de Itaiópolis e Logo ItaPet possuem funções, proporções e posições bem definidas.
