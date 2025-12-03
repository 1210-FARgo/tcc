// supabase.js

// 1. Importa a biblioteca diretamente da CDN (versão compatível com navegador)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 2. Suas configurações
const supabaseUrl = 'https://wthlsjmxbhtnwacklwci.supabase.co'
const supabaseKey = 'sb_publishable_47AI3d72L4BwpftH8YL59A_C_4drqpw' // Cole sua chave anon aqui

// 3. Cria e EXPORTA a conexão
export const supabase = createClient(supabaseUrl, supabaseKey)