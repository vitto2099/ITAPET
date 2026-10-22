import React, { useEffect, useRef, useState } from 'react';
import { X, Flashlight, Camera, AlertCircle } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  title?: string;
}

// Bip sonoro agradável gerado via Web Audio API (zero dependência de arquivo de som)
function playBeepSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Tom A5
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch {
    // Silencioso se bloqueado por permissões de áudio
  }
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Leitor de Microchip & QR Code'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extrai o microchip ou CPF de URLs completas ou strings brutas
  const parsePayload = (raw: string): string => {
    try {
      if (raw.includes('consulta=')) {
        const url = new URL(raw, window.location.origin);
        const chip = url.searchParams.get('consulta');
        if (chip) return chip.trim();
      }
      if (raw.includes('chip=')) {
        const url = new URL(raw, window.location.origin);
        const chip = url.searchParams.get('chip');
        if (chip) return chip.trim();
      }
    } catch {
      // Ignora erro de parser de URL
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 15 || digits.length === 11) return digits;
    return raw.trim();
  };

  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    let detectorInterval: ReturnType<typeof setInterval> | null = null;
    let zxingReader: any = null;

    async function startCamera() {
      setErrorMsg(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Verifica capacidade de Lanterna / Tocha
        const track = stream.getVideoTracks()[0];
        const trackAny = track as any;
        const caps = trackAny?.getCapabilities ? trackAny.getCapabilities() : {};
        if (caps && caps.torch) {
          setHasTorch(true);
        }

        // 1. Prioridade: BarcodeDetector nativo da Web Platform (Chrome Android, Edge, Safari 17+)
        if ('BarcodeDetector' in window) {
          try {
            const BarcodeDetectorClass = (window as unknown as { BarcodeDetector: any }).BarcodeDetector;
            const barcodeDetector = new BarcodeDetectorClass({
              formats: ['qr_code', 'code_128', 'ean_13', 'data_matrix', 'code_39']
            });

            detectorInterval = setInterval(async () => {
              if (!videoRef.current || videoRef.current.readyState < 2) return;
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const detected = barcodes[0].rawValue;
                  handleFound(detected);
                }
              } catch {
                // Frame sem código legível
              }
            }, 250);
            return;
          } catch {
            // Se falhar a inicialização nativa, usa fallback
          }
        }

        // 2. Fallback: ZXing Browser carregado dinamicamente
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        zxingReader = new BrowserMultiFormatReader();
        if (videoRef.current) {
          zxingReader.decodeFromVideoElement(videoRef.current, (result: any) => {
            if (result && !isCancelled) {
              handleFound(result.getText());
            }
          });
        }
      } catch (err) {
        console.error('Erro na inicialização da câmera:', err);
        setErrorMsg('Não foi possível acessar a câmera. Verifique as permissões do seu navegador.');
      }
    }

    const handleFound = (code: string) => {
      if (!code) return;
      const clean = parsePayload(code);
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      playBeepSound();
      onScanSuccess(clean);
      onClose();
    };

    startCamera();

    return () => {
      isCancelled = true;
      if (detectorInterval) clearInterval(detectorInterval);
      if (zxingReader) {
        try {
          // Parar leitor se existir método
        } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await (track as any).applyConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch {
      // Falha ao alternar tocha
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-800 text-white border-b border-stone-700">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport da Câmera */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-300 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                playsInline 
                muted 
                className="w-full h-full object-cover" 
              />
              
              {/* Retículo de Leitura */}
              <div className="absolute inset-8 sm:inset-10 border-2 border-dashed border-emerald-400/90 rounded-2xl pointer-events-none flex flex-col justify-between p-3 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                <span className="text-xs text-white bg-emerald-700/90 px-3 py-1 rounded-full font-bold self-center shadow-xs">
                  Enquadre o QR Code ou Código de Barras
                </span>
                <div className="w-full h-0.5 bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
                <span className="text-xs text-stone-200 font-semibold self-center bg-black/50 px-2.5 py-1 rounded-md">
                  ItaPet • Prefeitura de Itaiópolis
                </span>
              </div>
            </>
          )}
        </div>

        {/* Barra de Controles Inferior */}
        <div className="p-4 bg-stone-800 flex items-center justify-between border-t border-stone-700">
          <p className="text-xs text-stone-300 font-medium">
            Aponte para a medalha da coleira ou etiqueta do microchip.
          </p>
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                torchOn ? 'bg-amber-400 text-stone-950 font-black' : 'bg-stone-700 text-white hover:bg-stone-600'
              }`}
            >
              <Flashlight className="w-4 h-4" />
              <span>{torchOn ? 'Lanterna Ligada' : 'Ligar Lanterna'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
