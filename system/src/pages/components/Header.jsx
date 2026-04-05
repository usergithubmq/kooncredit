import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-[1000] flex justify-center transition-all duration-500 ease-in-out pointer-events-none
            ${isScrolled ? 'py-4' : 'py-8'}`}
        >
            <nav
                className={`relative flex items-center justify-between w-[92%] max-w-[1400px] px-10 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-500 pointer-events-auto
                ${isScrolled
                        ? 'h-[70px] w-[85%] bg-[#051d26]/90 border-cyan-400/30 shadow-cyan-900/20'
                        : 'h-[85px] bg-[#051d26]/40'}`}
            >
                {/* TEXTURA: Rejilla Nanotech (Pseudo-elemento con CSS inline para el patrón) */}
                <div
                    className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(124, 224, 242, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(124, 224, 242, 0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* AREA DEL LOGOTIPO */}
                <div className="relative z-10 flex items-center group">
                    <a href="/">
                        <img
                            src="/denarTexto.png"
                            alt="Denar Logo"
                            className={`transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-1 object-contain
    ${isScrolled ? 'h-20' : 'h-32'}`}
                        />
                    </a>
                </div>

                {/* LINKS DE NAVEGACIÓN */}
                <ul className="relative z-10 hidden lg:flex items-center gap-[45px]">
                    {['Contactar', 'Ayuda', 'Desarrolladores'].map((item) => (
                        <li key={item}>
                            <a
                                /* Si es Desarrolladores va a /docs, si no, al ID de la sección */
                                href={item === 'Desarrolladores' ? '/docs' : `#${item.toLowerCase()}`}
                                className="text-[11px] font-light uppercase tracking-[1.5px] text-white/70 hover:text-[#7ce0f2] hover:drop-shadow-[0_0_15px_rgba(124,224,242,0.4)] transition-all duration-300"
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* BOTÓN ENTERPRISE (Satinado Metálico) */}
                <div className="relative z-10">
                    <a
                        href="/login"
                        className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden text-[12px] font-black uppercase tracking-[2px] text-[#051d26] bg-white rounded-xl transition-all duration-500 group hover:-translate-y-1 hover:tracking-[3px] hover:shadow-[0_15px_40px_rgba(124,224,242,0.4)]"
                    >
                        {/* Brillo de Borde (Edge Glow) */}
                        <span className="absolute inset-0 rounded-xl border border-cyan-400/50 opacity-50 group-hover:opacity-100 transition-opacity duration-400" />

                        {/* Reflejo (Glossy Overlay) */}
                        <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-all duration-700 group-hover:left-full" />

                        <span className="relative z-10">Consola</span>
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;