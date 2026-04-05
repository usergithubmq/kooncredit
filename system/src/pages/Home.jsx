import React, { useEffect } from 'react';
import './home/Home.css';
import { initEngine } from './home/Home.js';
import Header from './components/Header.jsx';

const Home = () => {
    useEffect(() => {
        document.title = "Denar | Interactive Systems";
        initEngine();
    }, []);

    return (
        <div className="home-wrapper">
            <Header />
            <div className="denar-logo-hero">
                <img src="/denarTexto.png" alt="Denar Logo" />
            </div>
            <video autoPlay muted loop playsInline id="bg-video">
                <source src="/video/us.mp4" type="video/mp4" />
            </video>
            <canvas id="webgl-canvas"></canvas>
            <div id="scene-strip">
                <div className="scene-dot active"></div>
                <div className="scene-dot"></div>
                <div className="scene-dot"></div>
                <div className="scene-dot"></div>
                <div className="scene-dot"></div>
            </div>
            <div id="scroll-container">

                <section id="s0">
                    <div className="text-card">
                        <div className="tag">DENAR.network</div>
                        <h1>TECNOLOGÍA<br />QUE SE<br />ADAPTA</h1>
                        <p className="body-text">
                            No creemos en estructuras rígidas. Nuestra infraestructura
                            financiera evoluciona y cambia de forma para encajar
                            perfectamente en la arquitectura de tu negocio.
                        </p>
                        <a className="cta" href="#s1">
                            VENTAS
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 6h10M6 1l5 5-5 5" />
                            </svg>
                        </a>
                    </div>
                </section>
                <section id="s1">
                    <div className="text-card right">
                        <div className="h-line"></div>
                        <h2>FLUJO<br />CONTINUO</h2>
                        <p className="body-text">
                            Al igual que nuestras interfaces, el capital debe ser fluido.
                            Diseñamos ecosistemas B2B que se moldean según las
                            demandas del mercado actual.
                        </p>
                    </div>
                </section>
                <section id="s2">
                    <div className="text-card">
                        <div className="h-line"></div>
                        <h2>CÓDIGO<br />LÍQUIDO</h2>
                        <p className="body-text">
                            Nuestras soluciones SaaS no son moldes fijos. Son
                            algoritmos capaces de reconfigurarse para resolver los
                            desafíos específicos de cada industria.
                        </p>
                        <a className="cta" href="#s3">
                            Sistemas Dinámicos
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 6h10M6 1l5 5-5 5" />
                            </svg>
                        </a>
                    </div>
                </section>
                <section id="s3">
                    <div className="text-card center">
                        <div className="h-line"></div>
                        <h2>NUNCA<br />ESTÁTICOS</h2>
                        <p className="body-text">
                            En Denar, la innovación es un estado de cambio constante.
                            Si tu negocio crece, nuestra tecnología se expande contigo.
                        </p>
                    </div>
                </section>
                <section id="s4">
                    <div className="text-card right">
                        <div className="h-line"></div>
                        <h2>REGÍSTRATE</h2>
                        <p className="body-text">
                            Regístrate e inicia tu actualización hacia el nuevo mundo de la tecnología en las finanzas.
                            Da el siguiente paso hacia una infraestructura más ágil, segura y preparada para el futuro.
                        </p>
                        <a className="cta" href="#s0">
                            Comenzar ahora
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 6h10M6 1l5 5-5 5" />
                            </svg>
                        </a>
                    </div>
                </section>
            </div>
            <div id="credit">
                <a href="https://denar.network" target="_blank" rel="noopener">
                    DENAR NETWORK — 2026
                </a>
            </div>
        </div>
    );
};

export default Home;