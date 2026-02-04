import * as XLSX from 'xlsx';
import { VtexSku, ValidationError, ValidationSummary } from '../types';

// Web Worker context
self.onmessage = async (e: MessageEvent) => {
    const { fileData, imageListString } = e.data as { fileData: ArrayBuffer, imageListString: string };

    try {
        const workbook = XLSX.read(fileData, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<VtexSku>(worksheet);

        const imageList = new Set<string>(
            imageListString
                .split(/[\n,;]+/)
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
        );

        const errors: ValidationError[] = [];
        let validCount = 0;

        jsonData.forEach((sku, index) => {
            const row = index + 2; // Header is row 1
            const localErrors: string[] = [];

            // 1. Logistics Validation
            const weight = Number(sku._Peso) || 0;
            const height = Number(sku._Altura) || 0;
            const width = Number(sku._Largura) || 0;
            const length = Number(sku._Comprimento) || 0;

            if (weight <= 0 || height <= 0 || width <= 0 || length <= 0) {
                localErrors.push('Dados logísticos inválidos (Peso ou Dimensões zerados)');
            }

            // 2. Image Validation
            const refId = sku._CodigoReferenciaSKU;
            if (refId) {
                // Assume logic: refId + ".jpg" exists in imageList?
                // Or user pastes filenames.
                // User prompt: "Cruzar o campo _CodigoReferenciaSKU com a lista de nomes JPG fornecida."
                // Usually filenames are like REFID.jpg or just REFID.
                // I'll check if the refId is present in some form.
                // If imageList has "REF123.jpg", and RefId is "REF123", I should check for match.
                // I'll check if `refId` or `refId.jpg` is in the set.

                const hasImage = imageList.has(refId) || imageList.has(`${refId}.jpg`) || Array.from(imageList).some((img: string) => img.includes(refId));
                if (!hasImage) {
                    localErrors.push('Imagem não encontrada na lista fornecida');
                }
            } else {
                localErrors.push('SKU sem Código de Referência');
            }

            // 3. Mandatory Fields
            if (!sku._IDCategoria) localErrors.push('Faltando _IDCategoria');
            if (!sku._IDMarca) localErrors.push('Faltando _IDMarca');

            // 4. Status Determination
            const isActive = sku._SKUAtivo === 'SIM' || sku._ProdutoAtivo === 'SIM';

            if (localErrors.length > 0) {
                let status: ValidationError['status'] = 'Active with Error' as any; // Type mismatch fix below

                // Refine status based on prompt rules:
                // "Se _SKUAtivo ou _ProdutoAtivo for 'SIM', mas houver erros de logística ou imagem, classificar como 'Ativo com Erro'."
                if (isActive) {
                    status = 'Ativo com Erro';
                } else {
                    // Can be inactive but with errors still
                    status = 'Erro Cadastro'; // Generic fallback
                    if (localErrors.some(e => e.includes('Imagem'))) status = 'Erro Imagem';
                    if (localErrors.some(e => e.includes('Dados logísticos'))) status = 'Erro Logística';
                }

                errors.push({
                    sku: sku._CodigoReferenciaSKU || `Row ${row}`,
                    row,
                    errors: localErrors,
                    status,
                    data: sku
                });
            } else {
                validCount++;
            }
        });

        const summary: ValidationSummary = {
            total: jsonData.length,
            valid: validCount,
            invalid: errors.length,
            errors
        };

        self.postMessage({ type: 'SUCCESS', payload: summary });

    } catch (error: any) {
        self.postMessage({ type: 'ERROR', payload: error.message });
    }
};
