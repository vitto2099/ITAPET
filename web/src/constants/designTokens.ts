/**
 * 🐾 ITAPET DESIGN SYSTEM TOKENS & UI SPECIFICATIONS
 * Design Governamental Acessível, Inclusivo e Mobile-First
 * Prefeitura Municipal de Itaiópolis - SC • Secretaria de Agricultura e Meio Ambiente
 */

export const ITAPET_COLORS = {
  // 1. Verde Esmeralda / Floresta Principal (Secretaria de Meio Ambiente & SinPatinhas)
  forest: {
    primary: '#0D6838', // Cor principal dos títulos, faixas e molduras
    vibrant: '#16874E', // Verde alegre dos botões e logos
    dark: '#084725',    // Borda 3D e rodapé profundo
    soft: '#EAF7EE',    // Fundo suave de badges e chips
    surface: '#F0FDF4', // Cards de status positivo
  },

  // 2. Amarelo Sol / Ouro Dourado (Destaques, Ribbons e Botões de Ação)
  sun: {
    gold: '#F9C72C',    // Cor primária de destaque (ribbon e botões)
    accent: '#FFC107',  // Ouro vibrante para estrelas e selos
    hover: '#F8BE12',   // Estado hover de botões dourados
    border: '#C69205',  // Borda 3D inferior do botão dourado
    soft: '#FEF9C3',    // Fundo pastel de avisos carinhosos
    subtle: '#FFFBEB',  // Tonalidade linho-dourada suave
  },

  // 3. Azul Céu Suave & Governamental (Badges Governamentais, Gov.br e Acentos)
  sky: {
    gov: '#0B4F8A',     // Azul institucional gov / prefeitura
    accent: '#0284C7',  // Azul celeste dos balões e nuvens
    dark: '#0369A1',    // Texto sobre fundo azul claro
    soft: '#E0F2FE',    // Fundo da pílula de identificação segura
    border: '#BAE6FD',  // Borda de cards informativos
  },

  // 4. Fundo Linho/Creme Acolhedor (Sem o amarelo enjoativo, sem branco hospitalar)
  linen: {
    canvas: '#FAF8F5',  // Fundo oficial da página inteira
    card: '#FFFFFF',    // Fundo de cards e modais
    hover: '#F3EEE7',   // Fundo de hover e tracks
    border: '#E8E2D9',  // Borda suave de cartões e divisórias
  },

  // 5. Texto Profundo (Altíssimo contraste WCAG AAA)
  ink: {
    deep: '#132E27',    // Texto principal de altíssimo contraste (WCAG AAA)
    muted: '#334155',   // Subtítulos e instruções secundárias (Slate-700)
    subtle: '#475569',  // Metadados, datas e placeholders com excelente contraste (Slate-600)
  }
} as const;

/**
 * 📐 ESCALA TIPOGRÁFICA ACESSÍVEL (WCAG 2.1 AAA)
 * REGRA ESTRITA: NENHUMA FONTE INFERIOR A 12PX (text-xs).
 * Eliminação total de text-[9px], text-[10px], text-[11px].
 */
export const ITAPET_TYPOGRAPHY = {
  fontFamily: {
    display: "'Fredoka', 'Nunito', system-ui, sans-serif",
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  scale: {
    // 12px: Apenas para micro-tags, badges de status e carimbos
    micro: {
      fontSize: '12px',
      lineHeight: '16px',
      className: 'text-xs font-bold tracking-wide',
    },
    // 14px: Metadados, cards secundários, tabelas mobile, dicas
    compact: {
      fontSize: '14px',
      lineHeight: '20px',
      className: 'text-sm font-medium leading-normal',
    },
    // 16px: Corpo de texto principal, labels de formulários e inputs (evita zoom do iOS)
    body: {
      fontSize: '16px',
      lineHeight: '24px',
      className: 'text-base font-normal leading-relaxed',
    },
    // 18px: Subtítulos de seções e títulos de cards destacados
    headingSm: {
      fontSize: '18px',
      lineHeight: '28px',
      className: 'text-lg font-bold leading-snug',
    },
    // 20px: Títulos de blocos operacionais e modais
    headingMd: {
      fontSize: '20px',
      lineHeight: '28px',
      className: 'text-xl font-extrabold leading-tight tracking-tight',
    },
    // 24px: Títulos de páginas e dashboards
    headingLg: {
      fontSize: '24px',
      lineHeight: '32px',
      className: 'text-2xl font-black leading-tight tracking-tight',
    },
    // 30px a 36px+: Hero banners e cabeçalhos de impacto
    headingXl: {
      fontSize: '32px',
      lineHeight: '40px',
      className: 'text-2xl sm:text-4xl font-extrabold tracking-tight',
    }
  }
} as const;

/**
 * 🏷️ CATEGORIZAÇÃO OFICIAL DE REGISTROS
 * Separação clara entre a base histórica do mutirão (1.363 animais) e novos cadastros online
 */
export const ITAPET_RECORD_CATEGORIES = {
  mutirao: {
    id: 'relatorio_consolidado_castracao',
    name: 'Registros Anteriores (Mutirão)',
    shortLabel: 'Mutirão Anterior',
    badgeText: '🏛️ Registros Anteriores (Mutirão)',
    badgeClasses: 'bg-blue-50 text-[#0369A1] border-2 border-blue-200 font-extrabold text-xs px-3 py-1 rounded-full shadow-xs',
    cardBorder: 'border-blue-200',
    description: 'Animal cadastrado e microchipado durante o Mutirão Municipal de Castração de Itaiópolis.',
    authoritySeal: 'Mutirão Oficial Itaiópolis - SC',
    icon: '🏛️'
  },
  novoCadastro: {
    id: 'cadastro_online',
    name: 'Novos Cadastros Online',
    shortLabel: 'Novo Cadastro Online',
    badgeText: '✨ Novo Cadastro Online',
    badgeClasses: 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full shadow-xs',
    cardBorder: 'border-emerald-300',
    description: 'Animal cadastrado digitalmente pelo tutor responsável através do Portal ItaPet.',
    authoritySeal: 'Cadastro Digital do Cidadão',
    icon: '✨'
  }
} as const;

/**
 * 🔘 SISTEMA DE FILTROS COM RÓTULOS EXPLÍCITOS (SEM EMOJIS ENIGMÁTICOS)
 * Botões grandes, autoexplicativos, com área de toque mínima de 44px
 */
export const ITAPET_FILTER_DEFINITIONS = {
  // Filtro de Espécie
  species: [
    { 
      key: 'Todos', 
      label: '🐾 Todos os Animais', 
      mobileLabel: '🐾 Todos',
      ariaLabel: 'Exibir todos os animais cães e gatos' 
    },
    { 
      key: 'Canino', 
      label: '🐶🐕 Cães (Caninos)', 
      mobileLabel: '🐶🐕 Cães',
      ariaLabel: 'Filtrar apenas por cães caninos' 
    },
    { 
      key: 'Felino', 
      label: '🐱🐈 Gatos (Felinos)', 
      mobileLabel: '🐱🐈 Gatos',
      ariaLabel: 'Filtrar apenas por gatos felinos' 
    }
  ],

  // Filtro de Categoria / Origem
  category: [
    { 
      key: 'Todos', 
      label: '📁 Todos os Registros (1.363+)', 
      mobileLabel: '📁 Todos',
      ariaLabel: 'Exibir registros do mutirão e novos cadastros' 
    },
    { 
      key: 'relatorio_consolidado_castracao', 
      label: '🏛️ Registros Anteriores (Mutirão)', 
      mobileLabel: '🏛️ Mutirão',
      ariaLabel: 'Exibir apenas animais do mutirão municipal anterior' 
    },
    { 
      key: 'cadastro_online', 
      label: '✨ Novos Cadastros Online', 
      mobileLabel: '✨ Novos',
      ariaLabel: 'Exibir apenas novos animais cadastrados pelo portal' 
    }
  ],

  // Filtro de Sexo
  sex: [
    { 
      key: 'Todos', 
      label: '🐾 Ambos os Sexos', 
      mobileLabel: 'Todos',
      ariaLabel: 'Exibir machos e fêmeas' 
    },
    { 
      key: 'Fêmea', 
      label: '♀ Fêmeas', 
      mobileLabel: '♀ Fêmeas',
      ariaLabel: 'Filtrar apenas fêmeas' 
    },
    { 
      key: 'Macho', 
      label: '♂ Machos', 
      mobileLabel: '♂ Machos',
      ariaLabel: 'Filtrar apenas machos' 
    }
  ]
} as const;

/**
 * 📱 TOQUE E ERGONOMIA MOBILE (WCAG 2.5.5 / 2.5.8)
 */
export const ITAPET_TOUCH_TARGETS = {
  minTouchSizePx: 44,       // Mínimo absoluto para acessibilidade
  comfortTouchSizePx: 48,   // Tamanho confortável para dedos
  buttonClasses: 'min-h-[46px] px-4 py-2.5 rounded-2xl flex items-center justify-center font-bold text-sm transition-all',
  inputClasses: 'min-h-[48px] px-4 py-3 rounded-2xl text-base font-semibold border-2 outline-none transition-all',
} as const;

/**
 * 🏛️ ARQUITETURA DUAL BRANDING GOVERNAMENTAL
 * Separação entre a autoridade pública do Município de Itaiópolis e a identidade de serviço do ItaPet
 */
export const ITAPET_DUAL_BRANDING = {
  municipal: {
    src: '/brasao_itaiopolis.png',
    alt: 'Brasão Oficial do Município de Itaiópolis - Santa Catarina',
    entity: 'PREFEITURA MUNICIPAL DE ITAIÓPOLIS',
    state: 'SANTA CATARINA',
    department: 'Secretaria de Agricultura e Meio Ambiente',
    service: 'Controle Populacional e Zoonoses',
    placement: 'TopBar Governamental Superior, Selo do Hero, Rodapé Oficial e Cabeçalho do Documento Imprimível',
  },
  app: {
    src: '/logo.png',
    alt: 'Logo Oficial ItaPet Itaiópolis',
    brandName: 'ItaPet',
    tagline: 'SinPatinhas Itaiópolis',
    subBrand: 'Identificação Digital & Microchipagem',
    placement: 'Navbar Principal, Cartão do Cidadão, Modais de Ação e Carrossel de Serviços',
  }
} as const;

export const ITAPET_COPY = {
  pamphletTitle: 'ORIENTAÇÃO AOS RESPONSÁVEIS',
  pamphletSubtitle: 'CADASTRO NO SINPATINHAS',
  greeting: 'Prezado Responsável,',
  introText: 'Após a realização da castração e da implantação do microchip em seu animal, é importante que o número do microchip seja cadastrado no SinPatinhas – Sistema do Cadastro Nacional de Animais Domésticos, garantindo a correta identificação do seu cão ou gato.',
  safePetPill: 'Seu pet identificado é mais seguro! ♡',
  signatureFooter: 'Juntos por um município mais consciente e pet friendly! ♡ 🐾',
  municipalDepartment: 'Secretaria de Agricultura e Meio Ambiente',
  cityHall: 'Prefeitura de Itaiópolis/SC',
  stepSubtitle: 'O cadastro é simples, rápido e seguro:',
  officialCardTitle: 'CARTEIRA DE IDENTIFICAÇÃO ANIMAL',
  qrCodePrompt: 'Aponte a câmera do seu celular para o QR Code e acesse o SinPatinhas',
} as const;

export const ITAPET_STEPS = [
  {
    step: 1,
    title: 'Acesse o portal',
    url: 'https://sinpatinhas.mma.gov.br/login',
    text: 'Acesse o portal do SinPatinhas (https://sinpatinhas.mma.gov.br/login);',
    badge: '1',
  },
  {
    step: 2,
    title: 'Login Gov.br',
    url: 'https://www.gov.br',
    text: 'Faça login utilizando sua Conta Gov.br;',
    badge: '2',
  },
  {
    step: 3,
    title: 'Informe os dados do animal',
    url: '',
    text: 'Informe os dados do animal, incluindo o número do microchip implantado no procedimento de castração.',
    badge: '3',
  },
  {
    step: 4,
    title: 'Carteira de Identificação Animal',
    url: '',
    text: 'Ao concluir o cadastro, será emitida uma Carteira de Identificação Animal em formato digital, que poderá ser impresso ou fixado na coleira do animal, facilitando sua identificação e localização em caso de perda.',
    badge: '4',
  },
] as const;
