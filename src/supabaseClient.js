// ============================================
// CLIENTE SUPABASE
// ============================================
// Conecta ao banco de dados Supabase
// As credenciais ficam em .env.local

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Variáveis Supabase faltando! Crie o arquivo .env.local com:\n' +
    'VITE_SUPABASE_URL=https://seu-projeto.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=sua-anon-key'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// ============================================
// HELPERS PARA CONVERTER DADOS
// ============================================
// Supabase usa snake_case, JS usa camelCase

export function fromDb(row) {
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
    destaques: row.destaques || false
  };
}

export function toDb(scenario) {
  return {
    titulo: scenario.titulo,
    categoria: scenario.categoria,
    age_month_min: scenario.ageMonthMin,
    age_month_max: scenario.ageMonthMax,
    genero: scenario.genero,
    descricao_breve: scenario.descricaoBreve || '',
    descricao_detalhada: scenario.descricaoDetalhada || '',
    imagem_url: scenario.imagemUrl || '',
    imagens: scenario.imagens || [],
    destaques: scenario.destaques || false
  };
}

// ============================================
// FUNÇÕES DE CRUD
// ============================================

export async function carregarCenarios() {
  const { data, error } = await supabase
    .from('cenarios')
    .select('*')
    .order('titulo', { ascending: true });
  
  if (error) {
    console.error('❌ Erro ao carregar cenários:', error);
    throw error;
  }
  
  return (data || []).map(fromDb);
}

export async function adicionarCenario(scenario) {
  const { data, error } = await supabase
    .from('cenarios')
    .insert([toDb(scenario)])
    .select()
    .single();
  
  if (error) {
    console.error('❌ Erro ao adicionar:', error);
    throw error;
  }
  
  return fromDb(data);
}

export async function atualizarCenario(id, scenario) {
  const { data, error } = await supabase
    .from('cenarios')
    .update(toDb(scenario))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    throw error;
  }
  
  return fromDb(data);
}

export async function deletarCenario(id) {
  const { error } = await supabase
    .from('cenarios')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('❌ Erro ao deletar:', error);
    throw error;
  }
  
  return true;
}