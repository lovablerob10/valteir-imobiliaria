"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Compress image before upload
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                const fileExt = file.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const filePath = `hero/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("imoveis")
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("imoveis")
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            }

            onChange(newImages);
            toast.success("Imagens enviadas com sucesso!");
        } catch (error: any) {
            console.error("Erro no upload:", error);
            toast.error("Erro ao enviar imagens. Verifique se o bucket 'imoveis' existe no Supabase.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const setAsCover = (index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        const [coverImage] = newImages.splice(index, 1);
        newImages.unshift(coverImage);
        onChange(newImages);
        toast.success("Imagem definida como capa!");
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group">
                        <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />

                        {/* Badge de Capa - usando inline styles para garantir renderização */}
                        {index === 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    padding: '4px 10px',
                                    backgroundColor: '#d2ae6d',
                                    color: '#000',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    borderRadius: '6px',
                                    zIndex: 50,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                ⭐ CAPA
                            </div>
                        )}

                        {/* Botão remover - sempre visível no canto */}
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                padding: '4px',
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                borderRadius: '50%',
                                zIndex: 50,
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            title="Remover imagem"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Botão "Usar como Capa" - sempre visível na parte inferior */}
                        {index !== 0 && (
                            <button
                                type="button"
                                onClick={() => setAsCover(index)}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    padding: '6px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: '#d2ae6d',
                                    fontSize: '9px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    zIndex: 50,
                                    textAlign: 'center',
                                }}
                            >
                                ⭐ Definir como Capa
                            </button>
                        )}
                    </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-zinc-800 hover:border-accent/40 cursor-pointer transition-all bg-zinc-900/30 hover:bg-zinc-900/50">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Adicionar</span>
                        </>
                    )}
                </label>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Formatos aceitos: JPG, PNG, WEBP. Tamanho máx: 2MB.
            </p>
        </div>
    );
}
