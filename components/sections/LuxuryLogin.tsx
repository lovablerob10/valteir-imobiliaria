'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Gem, Building2 } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (email: string, password: string, remember: boolean) => void;
}

interface VideoBackgroundProps {
    videoUrl: string;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface SocialButtonProps {
    icon: React.ReactNode;
    name: string;
}

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    id: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-accent transition-colors">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-3 py-3 bg-zinc-900/50 border border-white/5 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-accent/40 focus:bg-zinc-900/80 transition-all duration-300 backdrop-blur-sm"
            />
        </div>
    );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
    return (
        <div className="relative inline-block w-10 h-5 cursor-pointer">
            <input
                type="checkbox"
                id={id}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-accent' : 'bg-zinc-700/50'}`}>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5' : ''}`} />
            </div>
        </div>
    );
};

// VideoBackground Component
const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10 bg-black">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
            <video
                ref={videoRef}
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 scale-150"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Seu navegador não suporta vídeos.
            </video>
        </div>
    );
};

// Main LoginForm Component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Let the parent handle the actual auth logic
        onSubmit(email, password, remember);

        // Reset state handled by parent if successful or failed
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 md:p-12 rounded-2xl backdrop-blur-md bg-black/40 border border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.5)] max-w-md w-full relative overflow-hidden">
            {/* Ambient lighting effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 blur-[100px] pointer-events-none" />

            <div className="mb-10 text-center relative z-10">
                <h2 className="text-3xl font-serif mb-2 relative group inline-block">
                    <span className="relative inline-block text-3xl font-serif text-white tracking-wide">
                        Valteir <span className="italic text-accent">Imobiliária</span>
                    </span>
                    <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-4" />
                </h2>
                <div className="mt-4 flex flex-col items-center space-y-1">
                    <p className="text-zinc-400 text-sm font-light tracking-wide">
                        Acesse seu portfólio de ativos exclusivos
                    </p>
                    <div className="flex space-x-4 mt-4 text-accent/40">
                        <Building2 size={14} />
                        <ShieldCheck size={14} />
                        <Gem size={14} />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <FormInput
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="E-mail Corporativo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="relative">
                    <FormInput
                        icon={<Lock size={18} />}
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha de Acesso"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white focus:outline-none transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                        <div onClick={() => setRemember(!remember)} className="cursor-pointer">
                            <ToggleSwitch
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                id="remember-me"
                            />
                        </div>
                        <label
                            htmlFor="remember-me"
                            className="text-xs text-zinc-400 cursor-pointer hover:text-white transition-colors select-none"
                            onClick={() => setRemember(!remember)}
                        >
                            Lembrar dispositivo
                        </label>
                    </div>
                    <a href="#" className="text-xs text-zinc-500 hover:text-accent transition-colors">
                        Esqueceu a senha?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg bg-accent/90 hover:bg-accent text-zinc-950 font-bold uppercase tracking-widest text-xs transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                            Verificando...
                        </span>
                    ) : 'Acessar Painel'}
                </button>
            </form>

            <p className="mt-8 text-center text-xs text-zinc-600">
                Acesso restrito para equipe autorizada.
                <br />
                <span className="opacity-50">Protegido por criptografia de ponta a ponta.</span>
            </p>
        </div>
    );
};

export { LoginForm, VideoBackground };
