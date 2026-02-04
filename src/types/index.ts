export interface VtexSku {
    _CodigoReferenciaSKU?: string;
    _Peso?: number;
    _Altura?: number;
    _Largura?: number;
    _Comprimento?: number;
    _SKUAtivo?: string;
    _ProdutoAtivo?: string;
    _IDCategoria?: string | number;
    _IDMarca?: string | number;
    [key: string]: any;
}

export interface ValidationError {
    sku: string;
    row: number;
    errors: string[];
    status: 'Ativo com Erro' | 'Erro Logística' | 'Erro Imagem' | 'Erro Cadastro';
    data: VtexSku;
}

export interface ValidationSummary {
    total: number;
    valid: number;
    invalid: number;
    errors: ValidationError[];
}
