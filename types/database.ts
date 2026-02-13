export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            imoveis: {
                Row: {
                    id: string
                    titulo: string
                    descricao: string | null
                    slug: string
                    tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'mansao' | 'cobertura' | 'loft'
                    status: 'ativo' | 'vendido' | 'reservado' | 'inativo'
                    endereco: string
                    numero: string | null
                    complemento: string | null
                    bairro: string
                    cidade: string
                    estado: string
                    cep: string | null
                    latitude: number | null
                    longitude: number | null
                    preco: number
                    preco_condominio: number | null
                    iptu_mensal: number | null
                    iptu_anual: number | null
                    quartos: number | null
                    suites: number | null
                    banheiros: number | null
                    vagas_garagem: number | null
                    area_util: number | null
                    area_total: number | null
                    area_construida: number | null
                    ano_construcao: number | null
                    andar: number | null
                    features: string[]
                    imagens: string[]
                    video_url: string | null
                    tour_virtual_url: string | null
                    planta_baixa_url: string | null
                    corretor_id: string | null
                    proprietario_nome: string | null
                    proprietario_telefone: string | null
                    proprietario_email: string | null
                    destaque: boolean
                    ordem_destaque: number
                    visualizacoes: number
                    favoritos_count: number
                    created_at: string
                    updated_at: string
                }
            }
            leads: {
                Row: {
                    id: string
                    imovel_id: string | null
                    nome: string
                    email: string
                    telefone: string
                    mensagem: string | null
                    status: string
                    created_at: string
                }
            }
            perfis: {
                Row: {
                    id: string
                    nome: string
                    email: string
                    role: 'admin' | 'corretor' | 'editor'
                    avatar_url: string | null
                    telefone: string | null
                }
            }
        }
    }
}

export type Imovel = Database['public']['Tables']['imoveis']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type Perfil = Database['public']['Tables']['perfis']['Row']
