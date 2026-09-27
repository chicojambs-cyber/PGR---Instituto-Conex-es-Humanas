/**
 * Gera um identificador anônimo criptográfico unidirecional (SHA-256)
 * para assegurar conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)
 * e diretrizes éticas da NR-1 / COPSOQ II-Br.
 */
export async function generateAnonymousHash(seed?: string): Promise<string> {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  const raw = `${seed || 'anon'}-${timestamp}-${random}-${window.crypto.randomUUID?.() || 'rand'}`;
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `LGPD-${hashHex.substring(0, 16).toUpperCase()}`;
  } catch {
    // Fallback simples caso SubtleCrypto não esteja disponível
    return `LGPD-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  }
}
