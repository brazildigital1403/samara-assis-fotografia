// supabaseClient.js — cliente Supabase com CRUD de cenários + upload de imagens
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lmnkdpwahrvrbuihonim.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cWF3PW2XrU98u9KIkwf-WA_7pOZ2xME';

export const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'cenarios-fotos';

// ============================================================================
// HELPERS: conversão entre snake_case (DB) e camelCase (UI)
// ============================================================================
function fromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    titulo: row.titulo,
    categoria: row.categoria,
    ageMonthMin: row.age_month_min,
    ageMonthMax: row.age_month_max,
    genero: row.genero,
    descricaoBreve: row.descricao_breve || '',
    descricaoDetalhada: row.descricao_detalhada || '',
    imagemUrl: row.imagem_url || '',
    imagens: row.imagens || [],
    destaques: !!row.destaques,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDb(cenario) {
  return {
    titulo: cenario.titulo,
    categoria: cenario.categoria,
    age_month_min: cenario.ageMonthMin ?? 0,
    age_month_max: cenario.ageMonthMax ?? 12,
    genero: cenario.genero || 'all',
    descricao_breve: cenario.descricaoBreve || '',
    descricao_detalhada: cenario.descricaoDetalhada || '',
    imagem_url: cenario.imagemUrl || '',
    imagens: cenario.imagens || [],
    destaques: !!cenario.destaques,
  };
}

// ============================================================================
// CRUD CENÁRIOS
// ============================================================================
export async function carregarCenarios() {
  const { data, error } = await supabase
    .from('cenarios')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromDb);
}

export async function adicionarCenario(cenario) {
  const { data, error } = await supabase
    .from('cenarios')
    .insert([toDb(cenario)])
    .select()
    .single();
  if (error) throw error;
  return fromDb(data);
}

export async function atualizarCenario(id, cenario) {
  const { data, error } = await supabase
    .from('cenarios')
    .update(toDb(cenario))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return fromDb(data);
}

export async function deletarCenario(id) {
  // Antes de deletar o cenário, tenta apagar as fotos dele do storage
  try {
    const { data: cen } = await supabase
      .from('cenarios')
      .select('imagem_url, imagens')
      .eq('id', id)
      .single();
    if (cen) {
      const urls = [cen.imagem_url, ...(cen.imagens || [])].filter(Boolean);
      await deletarImagensPorUrls(urls);
    }
  } catch (e) {
    // Não bloqueia a deleção do cenário se a limpeza falhar
    console.warn('[deletarCenario] falha ao limpar fotos do storage:', e);
  }

  const { error } = await supabase.from('cenarios').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ============================================================================
// STORAGE: upload, delete, e helpers
// ============================================================================

/**
 * Gera um path único pro arquivo no bucket.
 * Ex: "1777789000-a3f9c2-newborn-7-dias.jpg"
 */
function gerarPathArquivo(file) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  // Sanitiza o nome original: remove acentos, espaços, caracteres especiais
  const nomeOriginal = (file.name || 'foto')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60); // limita o tamanho do nome
  return `${timestamp}-${random}-${nomeOriginal}`;
}

/**
 * Faz upload de um arquivo de imagem pro Storage do Supabase
 * e retorna a URL pública.
 */
export async function uploadImagem(file, options = {}) {
  if (!file) throw new Error('Nenhum arquivo fornecido');
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type || 'desconhecido'}`);
  }

  const path = gerarPathArquivo(file);

  if (options.onProgress) options.onProgress(10);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('[uploadImagem] erro:', error);
    throw new Error(`Erro ao subir imagem: ${error.message}`);
  }

  if (options.onProgress) options.onProgress(90);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  if (options.onProgress) options.onProgress(100);

  return urlData.publicUrl;
}

/**
 * Extrai o path interno do bucket a partir de uma URL pública.
 * Retorna null se a URL não for do nosso bucket (e.g. URL externa do Wix).
 */
function extrairPathDaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

/**
 * Apaga uma única imagem do storage. Ignora URLs externas (Wix etc).
 */
export async function deletarImagemPorUrl(url) {
  const path = extrairPathDaUrl(url);
  if (!path) return false;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.warn('[deletarImagemPorUrl] falha:', error);
    return false;
  }
  return true;
}

/**
 * Apaga várias imagens de uma vez (mais eficiente que uma a uma).
 */
export async function deletarImagensPorUrls(urls) {
  if (!urls || !urls.length) return;
  const paths = urls.map(extrairPathDaUrl).filter(Boolean);
  if (!paths.length) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.warn('[deletarImagensPorUrls] falha:', error);
}
