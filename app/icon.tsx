import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 22,
                    background: '#09090b', // zinc-950 escuro
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37', // dourado (accent)
                    borderRadius: '50%',
                    fontFamily: 'serif',
                    fontWeight: 800,
                    border: '1px solid #d4af3740', // Borda leve
                }}
            >
                V
            </div>
        ),
        {
            ...size,
        }
    )
}
