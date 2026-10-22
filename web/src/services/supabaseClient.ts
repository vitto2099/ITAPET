import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
};

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('Falha ao inicializar cliente Supabase:', err);
  }
}

export const supabase = clientInstance;

/**
 * Converte CPF limpo (apenas 11 números) em um formato determinístico de e-mail
 * para autenticação sem atrito via Supabase Auth.
 */
export const cpfToAuthEmail = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '');
  return `${clean}@cidadao.itapet.gov.br`;
};
