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

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group">
                        <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
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
