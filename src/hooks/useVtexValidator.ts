import { useState, useRef, useEffect } from 'react';
import { ValidationSummary } from '../types';

export function useVtexValidator() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0); // Optional: if we implement chunks
    const [result, setResult] = useState<ValidationSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/validator.worker.ts', import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'SUCCESS') {
                setResult(payload);
                setIsProcessing(false);
            } else if (type === 'ERROR') {
                setError(payload);
                setIsProcessing(false);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const validateFile = (file: File, imageListString: string) => {
        setIsProcessing(true);
        setError(null);
        setResult(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = e.target?.result;
            workerRef.current?.postMessage({ fileData, imageListString });
        };
        reader.onerror = () => {
            setError('Erro ao ler o arquivo');
            setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file);
    };

    return {
        validateFile,
        isProcessing,
        result,
        error,
        reset: () => {
            setResult(null);
            setError(null);
        }
    };
}
