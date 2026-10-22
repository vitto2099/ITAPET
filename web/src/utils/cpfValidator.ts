/**
 * Validador Oficial de CPF - Módulo 11 da Receita Federal do Brasil
 * Rejeita CPFs com todos os dígitos iguais (ex: 000.000.000-00, 111.111.111-11)
 * e valida os dois dígitos verificadores.
 */

export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const clean = cpf.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (clean.length !== 11) return false;

  // Rejeita sequências de dígitos todos repetidos
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Cálculo do 1º dígito verificador (pesos de 10 a 2)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9), 10)) return false;

  // Cálculo do 2º dígito verificador (pesos de 11 a 2)
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '').slice(0, 11);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  if (clean.length <= 9) return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 11)}`;
}
