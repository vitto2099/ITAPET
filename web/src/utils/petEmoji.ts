/**
 * Utilitário Oficial de Emojis e Avatares para ItaPet (Itaiópolis - SC)
 * 
 * Atribui emojis variados e realistas para cães e gatos com base em:
 * 1. Raça informada (Poodle -> 🐩, Pastor/Labrador -> 🦮, Husky -> 🐺, etc.)
 * 2. Nome/Cor do animal ('Pretinho'/'Coca' -> 🐈‍⬛/🐕‍🦺, 'Amarelo'/'Paçoca' -> 🐕/🐈, etc.)
 * 3. Hash determinístico para SRD e demais animais, garantindo que o mesmo animal
 *    sempre tenha o mesmo emoji consistente em todas as telas, cards e passaporte.
 */

export interface PetEmojiInput {
  id?: string;
  microchip?: string;
  nomeAnimal?: string;
  especie?: string;
  raca?: string;
  sexo?: string;
  pelagem?: string;
  cor?: string;
}

// Catálogo de Emojis para Cães (diversas raças, portes e pelagens)
export const DOG_EMOJIS = [
  '🐶', // Cãozinho clássico / Caramelo amigável
  '🐕', // Cãozinho tipo Shiba / Vira-lata Caramelo Nacional
  '🦮', // Golden Retriever / Labrador / Cão Dourado
  '🐩', // Poodle branquinho / Shih-tzu / Peludo
  '🐕‍🦺', // Cão Pretinho / Com coleira de proteção
  '🐺', // Husky Siberiano / Lobo / Cinza e Branco
] as const;

// Catálogo de Emojis para Gatos (diversas cores, rajados e expressões)
export const CAT_EMOJIS = [
  '🐱', // Gatinho clássico cinza/branco
  '🐈', // Gatinho rajado / Laranja / Caramelo
  '🐈‍⬛', // Gatinho pretinho da sorte / Panterinha
  '😸', // Gatinho sorridente e brincalhão
  '😺', // Gatinho contente
  '😻', // Gatinho amoroso / dengoso
  '😽', // Gatinho calmo e carinhoso
] as const;

/**
 * Retorna o emoji individual e característico do animal
 */
export function getPetAvatarEmoji(pet?: PetEmojiInput | null): string {
  if (!pet) return '🐾';

  const especie = (pet.especie || '').toLowerCase();
  const raca = (pet.raca || '').toLowerCase();
  const nome = (pet.nomeAnimal || '').toLowerCase();
  const pelagem = ((pet.pelagem || '') + ' ' + (pet.cor || '')).toLowerCase();

  const isCat = especie.includes('felin') || especie.includes('gato');

  // GATOS
  if (isCat) {
    // Gatos pretos
    if (
      nome.includes('pret') ||
      nome.includes('black') ||
      nome.includes('noturno') ||
      nome.includes('pantera') ||
      pelagem.includes('pret') ||
      pelagem.includes('negra')
    ) {
      return '🐈‍⬛';
    }

    // Gatos laranjas / rajados / tigrados
    if (
      nome.includes('amar') ||
      nome.includes('laranja') ||
      nome.includes('ruiv') ||
      nome.includes('garfield') ||
      nome.includes('tom') ||
      pelagem.includes('amar') ||
      pelagem.includes('laranja') ||
      pelagem.includes('ruiv')
    ) {
      return '🐈';
    }

    // Gatos brancos / siameses / persas / cinzas
    if (
      raca.includes('siam') ||
      raca.includes('persa') ||
      raca.includes('angora') ||
      nome.includes('cinza') ||
      nome.includes('silver') ||
      nome.includes('fuma') ||
      nome.includes('neve') ||
      nome.includes('algod')
    ) {
      return '🐱';
    }

    // Hash determinístico para SRD e demais gatos
    const seed = (pet.id || '') + (pet.microchip || '') + (pet.nomeAnimal || '');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % CAT_EMOJIS.length;
    return CAT_EMOJIS[idx];
  }

  // CÃES
  // Poodle, Shih-tzu, Bichon, Spitz, Lulu da Pomerânia
  if (
    raca.includes('poodle') ||
    raca.includes('pudle') ||
    raca.includes('shitzu') ||
    raca.includes('shihtzu') ||
    raca.includes('spitz') ||
    raca.includes('bichon') ||
    raca.includes('malt') ||
    nome.includes('bolinha') ||
    nome.includes('pompom') ||
    nome.includes('algod')
  ) {
    return '🐩';
  }

  // Pastor Alemão, Golden Retriever, Labrador, Rottweiler, Boxer
  if (
    raca.includes('pastor') ||
    raca.includes('golden') ||
    raca.includes('labrador') ||
    raca.includes('boxer') ||
    raca.includes('rotwaler') ||
    raca.includes('dog alemão')
  ) {
    return '🦮';
  }

  // Husky, Akita, Lobo
  if (
    raca.includes('husk') ||
    raca.includes('akita') ||
    raca.includes('wolf') ||
    nome.includes('lobo') ||
    nome.includes('thor')
  ) {
    return '🐺';
  }

  // Cães pretos / escuros
  if (
    nome.includes('pret') ||
    nome.includes('black') ||
    nome.includes('coca') ||
    nome.includes('neg') ||
    nome.includes('sombra') ||
    pelagem.includes('pret') ||
    pelagem.includes('escur')
  ) {
    return '🐕‍🦺';
  }

  // Cães amarelos, dourados, caramelo, paçoca
  if (
    nome.includes('amar') ||
    nome.includes('paçoca') ||
    nome.includes('caramel') ||
    nome.includes('nutel') ||
    nome.includes('toffee') ||
    pelagem.includes('amar') ||
    pelagem.includes('dourad') ||
    pelagem.includes('caramel')
  ) {
    return '🐕';
  }

  // Hash determinístico para SRD e demais cães
  const seed = (pet.id || '') + (pet.microchip || '') + (pet.nomeAnimal || '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % DOG_EMOJIS.length;
  return DOG_EMOJIS[idx];
}

/**
 * Retorna o par de emojis ou rótulo representativo da espécie
 */
export function getSpeciesLabelWithEmoji(especie?: string): string {
  const e = (especie || '').toLowerCase();
  if (e.includes('canino') || e.includes('cão') || e.includes('cachorro')) {
    return '🐶 Cão';
  }
  if (e.includes('felino') || e.includes('gato')) {
    return '🐱 Gato';
  }
  return '🐾 Pet';
}

/**
 * Retorna os emojis múltiplos para botões de filtro
 */
export const SPECIES_FILTER_ICONS = {
  all: '🐾',
  dogs: '🐶🐕',
  cats: '🐱🐈',
} as const;
