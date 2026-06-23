'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Menu } from '@/components/menu';
import { SmoothScroll } from '@/components/smooth-scroll';
import TextBlockReveal from '@/components/ui/text-block-reveal';
import styles from './page.module.css';
import {
  Sparkles,
  MessageSquare,
  Send,
  Check,
  Clock,
  Calendar,
  Users,
  Layers,
  Eye,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Heart,
  Share2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Comment {
  id: number;
  author: string;
  avatar: string;
  role: string;
  text: string;
  time: string;
}

export default function Home(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const organizationRef = useRef<HTMLDivElement>(null);

  const [platform, setPlatform] = useState<'x' | 'instagram' | 'linkedin'>('instagram');
  const [postText, setPostText] = useState<string>(
    '¡Acabamos de lanzar la nueva versión de KERN! 🚀 Una plataforma colaborativa diseñada específicamente para que los equipos de marketing preparen, debatan y programen su contenido en redes sociales sin fricciones. #marketing #colaboracion #socialmedia',
  );
  const [status, setStatus] = useState<'Borrador' | 'En Revisión' | 'Aprobado' | 'Programado'>('En Revisión');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Sofía Romero',
      avatar: 'SR',
      role: 'Directora Creativa',
      text: '¿Podemos cambiar la imagen de fondo por una con tonos más cálidos?',
      time: 'Hace 5 min',
    },
    {
      id: 2,
      author: 'Mateo Silva',
      avatar: 'MS',
      role: 'Content Manager',
      text: 'El copy suena genial. Hecho el ajuste de hashtags.',
      time: 'Hace 2 min',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [gradientIndex, setGradientIndex] = useState(0);

  const gradients = [
    'from-pink-500 via-red-500 to-yellow-500',
    'from-blue-600 via-indigo-700 to-purple-800',
    'from-emerald-400 via-teal-500 to-cyan-600',
    'from-amber-200 via-orange-400 to-pink-600',
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      author: 'Tú (Marketing)',
      avatar: 'TU',
      role: 'Colaborador',
      text: newComment.trim(),
      time: 'Ahora mismo',
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleApprove = () => {
    setStatus('Aprobado');
    const systemComment: Comment = {
      id: Date.now(),
      author: 'Sistema KERN',
      avatar: '🤖',
      role: 'Automatización',
      text: '✅ Publicación aprobada por el equipo. Lista para su programación.',
      time: 'Ahora mismo',
    };
    setComments(prev => [...prev, systemComment]);
  };

  const handleSchedule = () => {
    setStatus('Programado');
    const systemComment: Comment = {
      id: Date.now() + 1,
      author: 'Sistema KERN',
      avatar: '🤖',
      role: 'Automatización',
      text: '📅 Publicación programada para el próximo Lunes a las 10:00 AM.',
      time: 'Ahora mismo',
    };
    setComments(prev => [...prev, systemComment]);
  };

  useGSAP(
    () => {
      gsap.to(heroRef.current, {
        scale: 0.85,
        borderRadius: '3rem',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      });

      gsap.to('.org-title', {
        scrollTrigger: {
          trigger: organizationRef.current,
          start: 'top top',
          end: '+=60%',
          scrub: true,
        },
        opacity: 0,
        y: -100,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <SmoothScroll>
      <main ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
        <Menu />

        <div ref={heroRef} className="relative overflow-hidden">
          <section className={styles.hero}>
            <div className={styles.revealOverlay}></div>
            <video autoPlay loop muted playsInline className={styles.videoBackground}>
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            <div className={styles.grain}></div>
            <div className={styles.container}>
              <div className={styles.grid}>
                <h1 className={styles.title}>
                  Plataforma KERN <br />
                  <span className={styles.titleDesc}>Diseño social colaborativo.</span>
                </h1>
                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.actionButton}
                    onClick={() => {
                      document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Comenzar a explorar
                  </button>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.statement1}>La claridad empieza preguntando.</div>
                <div className={styles.statement2}>KERN ©2026</div>
                <div className={styles.paragraphs}>
                  <p>
                    El descubrimiento no siempre empieza con conocimiento - empieza con estructura. El contexto que guía
                    al entendimiento hacia adelante.
                  </p>
                  <p>
                    KERN es tu compañero para la distribución. Una interfaz calmada para hacer mejores estrategias de
                    publicación. Menos ruido. Más significado.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="org-section relative z-10">
          <section
            ref={organizationRef}
            className="relative flex w-full flex-col items-center overflow-hidden bg-zinc-950 pb-[10vh] pt-32 md:pt-48"
          >
            <div className="org-title sticky top-[15vh] z-10 mb-[10vh] flex w-full flex-col items-center px-6">
              <TextBlockReveal blockColor="#f4f4f5">
                <h2 className="text-center text-6xl font-black uppercase leading-[0.85] tracking-tighter text-zinc-100 md:text-8xl lg:text-[10vw]">
                  ENTRA AL <br />
                  <span className="text-zinc-500">PLAYGROUND</span>
                </h2>
              </TextBlockReveal>
            </div>

            <div id="playground" className="relative z-20 w-full max-w-7xl px-4 md:px-8 mt-12">
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> Demostración Interactiva
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                  Prepara contenido en tiempo real
                </h3>
                <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
                  Cambia el texto, simula comentarios de tu equipo, aprueba las publicaciones y cámbialas de plataforma
                  de inmediato.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-4 md:p-8 backdrop-blur-xl">
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
                      Plataforma
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                      <button
                        onClick={() => setPlatform('instagram')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${platform === 'instagram' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
                      >
                        Instagram
                      </button>
                      <button
                        onClick={() => setPlatform('x')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${platform === 'x' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
                      >
                        X / Twitter
                      </button>
                      <button
                        onClick={() => setPlatform('linkedin')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${platform === 'linkedin' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
                      >
                        LinkedIn
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
                      Contenido de la Publicación
                    </label>
                    <textarea
                      value={postText}
                      onChange={e => setPostText(e.target.value)}
                      rows={5}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none font-sans"
                      placeholder="Escribe tu post aquí..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
                      Imagen de Fondo (Diseño)
                    </label>
                    <div className="flex gap-3">
                      {gradients.map((g, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGradientIndex(idx)}
                          className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${g} border-2 transition-all ${gradientIndex === idx ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={status === 'Aprobado' || status === 'Programado'}
                      className="flex-1 min-w-[140px] bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Check className="w-3.5 h-3.5" /> Aprobar Publicación
                    </button>
                    <button
                      onClick={handleSchedule}
                      disabled={status === 'Programado'}
                      className="flex-1 min-w-[140px] bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Clock className="w-3.5 h-3.5" /> Programar Lunes
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-6 flex flex-col justify-center">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-3">
                      Vista Previa Real
                    </span>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
                      <div className="p-3.5 flex items-center justify-between border-b border-zinc-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-200">
                            K
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-200">Platform KERN</div>
                            <div className="text-[10px] text-zinc-500">@kern_platform</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            status === 'Borrador'
                              ? 'bg-zinc-800 text-zinc-400'
                              : status === 'En Revisión'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : status === 'Aprobado'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {platform === 'instagram' && (
                        <div
                          className={`aspect-square w-full bg-gradient-to-tr ${gradients[gradientIndex]} flex flex-col justify-end p-6 relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="relative z-10 backdrop-blur-md bg-zinc-950/40 p-4 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-white tracking-widest uppercase mb-1 block">
                              SOCIAL WORKSPACE
                            </span>
                            <h4 className="text-sm font-bold text-white leading-snug">
                              Prepara tu contenido en equipo
                            </h4>
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        <p className="text-xs text-zinc-300 line-clamp-6 leading-relaxed whitespace-pre-wrap font-sans">
                          {postText || 'Escribe un post de ejemplo en el editor...'}
                        </p>
                      </div>

                      <div className="p-3 border-t border-zinc-900/60 flex items-center justify-between text-zinc-500">
                        {platform === 'instagram' ? (
                          <div className="flex gap-4">
                            <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer transition-colors" />
                            <MessageSquare className="w-4 h-4 hover:text-zinc-200 cursor-pointer transition-colors" />
                            <Share2 className="w-4 h-4 hover:text-zinc-200 cursor-pointer transition-colors" />
                          </div>
                        ) : (
                          <div className="flex gap-8 text-[11px]">
                            <span className="hover:text-zinc-300 cursor-pointer">💬 12</span>
                            <span className="hover:text-emerald-400 cursor-pointer">🔁 45</span>
                            <span className="hover:text-pink-400 cursor-pointer">❤️ 89</span>
                          </div>
                        )}
                        <Bookmark className="w-4 h-4 hover:text-zinc-200 cursor-pointer transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col justify-between h-[360px] bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-200">Discusión del Equipo</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{comments.length} comentarios</span>
                    </div>

                    <div className="flex-1 overflow-y-auto my-3 pr-1 flex flex-col gap-3 scrollbar-thin">
                      {comments.map(comment => (
                        <div
                          key={comment.id}
                          className="text-xs bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-zinc-800 text-[9px] font-bold text-zinc-300 flex items-center justify-center">
                                {comment.avatar}
                              </span>
                              <div>
                                <span className="font-semibold text-zinc-200 block text-[10px]">{comment.author}</span>
                                <span className="text-[8px] text-zinc-500 block -mt-0.5">{comment.role}</span>
                              </div>
                            </div>
                            <span className="text-[8px] text-zinc-500">{comment.time}</span>
                          </div>
                          <p className="text-zinc-400 text-[11px] leading-relaxed pl-6">{comment.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Añade una sugerencia..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      />
                      <button
                        type="submit"
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 p-2 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section id="use-cases" className="relative z-20 py-24 md:py-36 bg-zinc-950 border-t border-zinc-900">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
                DISEÑADO PARA <br />
                <span className="text-zinc-500">EQUIPOS DE MARKETING</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg">
                Se acabaron las capturas por chat y hojas de cálculo obsoletas. Centraliza la creación, el debate y la
                programación en un solo lienzo limpio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900/30 border border-zinc-800/80 p-8 rounded-3xl hover:border-zinc-700 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Colaboración Real</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Añade comentarios directamente sobre borradores. Menciona a tus redactores y diseñadores sin cambiar
                  de aplicación.
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-8 rounded-3xl hover:border-zinc-700 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Previsualización Exacta</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Comprueba cómo quedará tu publicación en Instagram, X y LinkedIn antes de programarla o publicarla.
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-8 rounded-3xl hover:border-zinc-700 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Pipeline de Estado</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Un flujo visual estructurado para organizar tus posts desde borradores e ideas iniciales hasta la
                  aprobación final.
                </p>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/80 p-8 rounded-3xl hover:border-zinc-700 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Calendario Unificado</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Planifica y visualiza la distribución de tu contenido en todos los canales sociales mediante una
                  agenda integrada.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative z-20 py-24 md:py-36 bg-zinc-900/20 border-t border-zinc-900/60">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-4">
                  El Flujo del Trabajo
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 uppercase">
                  De la idea a la red en tres pasos
                </h2>

                <div className="flex flex-col gap-8 mt-10">
                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Estructura y Redacta</h4>
                      <p className="text-zinc-400 text-sm">
                        Tu equipo colabora en una interfaz libre de distracciones. Diseña el texto y asigna los recursos
                        multimedia.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Debate e Itera</h4>
                      <p className="text-zinc-400 text-sm">
                        Comenta al lado del post, solicita cambios visuales o de texto y obtén aprobaciones con un clic.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Distribución Automatizada</h4>
                      <p className="text-zinc-400 text-sm">
                        Una vez aprobado, KERN se encarga de programar o publicar directamente en cada red social.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden p-8 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-500/10 rounded-full blur-3xl pointer-events-none" />
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                  Tablero Kanban de Aprobación
                </h4>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 min-h-[220px] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase">
                      <span>Borrador</span>
                      <span className="bg-zinc-900 px-1.5 py-0.5 rounded">2</span>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] font-medium text-purple-400 bg-purple-950/50 px-1.5 py-0.5 rounded mb-2 inline-block">
                        LinkedIn
                      </span>
                      <h5 className="text-[11px] font-bold text-white mb-1 line-clamp-1">Lanzamiento Q3</h5>
                      <p className="text-[9px] text-zinc-500 line-clamp-2">
                        Contenido preliminar sobre el roadmap técnico de KERN...
                      </p>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] font-medium text-pink-400 bg-pink-950/50 px-1.5 py-0.5 rounded mb-2 inline-block">
                        Instagram
                      </span>
                      <h5 className="text-[11px] font-bold text-white mb-1 line-clamp-1">Carrusel de Diseño</h5>
                      <p className="text-[9px] text-zinc-500 line-clamp-2">
                        Imágenes de la nueva UI y explicaciones rápidas...
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 min-h-[220px] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-550 uppercase">
                      <span className="text-amber-500">Revisión</span>
                      <span className="bg-zinc-900 px-1.5 py-0.5 rounded">1</span>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-850 relative group cursor-pointer">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      </div>
                      <span className="text-[9px] font-medium text-sky-400 bg-sky-950/50 px-1.5 py-0.5 rounded mb-2 inline-block">
                        X (Twitter)
                      </span>
                      <h5 className="text-[11px] font-bold text-white mb-1 line-clamp-1">Hilo de Lanzamiento</h5>
                      <p className="text-[9px] text-zinc-500 line-clamp-2">
                        1/5 La colaboración nunca fue tan simple. Presentamos...
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/60 min-h-[220px] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-550 uppercase">
                      <span className="text-emerald-500">Programado</span>
                      <span className="bg-zinc-900 px-1.5 py-0.5 rounded">1</span>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] font-medium text-pink-400 bg-pink-950/50 px-1.5 py-0.5 rounded mb-2 inline-block">
                        Instagram
                      </span>
                      <h5 className="text-[11px] font-bold text-white mb-1 line-clamp-1">Caso de Éxito</h5>
                      <p className="text-[9px] text-zinc-500 line-clamp-2">
                        Cómo el equipo creativo de Acme aumentó la velocidad de publicación...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="relative z-20 py-24 md:py-36 bg-zinc-950 border-t border-zinc-900">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-4">
                Suscripciones
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6">
                Planes simples <br />
                <span className="text-zinc-500">sin sorpresas</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg">
                Comienza gratis y escala a medida que crezca tu equipo y tu audiencia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Creador</h3>
                  <p className="text-zinc-500 text-xs mb-6">Para profesionales individuales.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">0€</span>
                    <span className="text-zinc-500 text-sm">/mes</span>
                  </div>
                  <ul className="flex flex-col gap-4 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> 1 workspace personal
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> Hasta 3 cuentas sociales
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> Vista previa de posts
                    </li>
                  </ul>
                </div>
                <button className="w-full mt-8 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850 hover:border-zinc-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-all">
                  Comenzar Gratis
                </button>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-650 transition-all relative overflow-hidden shadow-xl scale-105">
                <div className="absolute top-0 right-0 bg-white text-zinc-950 text-[9px] font-black uppercase tracking-widest py-1.5 px-6 rounded-bl-xl">
                  Recomendado
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Equipo</h3>
                  <p className="text-zinc-400 text-xs mb-6">Para equipos de marketing colaborativos.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">29€</span>
                    <span className="text-zinc-450 text-sm">/mes</span>
                  </div>
                  <ul className="flex flex-col gap-4 text-xs text-zinc-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" /> Workspaces ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" /> Cuentas sociales ilimitadas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" /> Comentarios y debates en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" /> Control de aprobaciones de equipo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" /> Programación de posts avanzada
                    </li>
                  </ul>
                </div>
                <button className="w-full mt-8 bg-white hover:bg-zinc-100 text-zinc-950 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md">
                  Iniciar Prueba Gratis
                </button>
              </div>

              <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Corporativo</h3>
                  <p className="text-zinc-500 text-xs mb-6">Para agencias y grandes marcas.</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">Personalizado</span>
                  </div>
                  <ul className="flex flex-col gap-4 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> Todo lo del plan Equipo
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> SSO & Seguridad avanzada
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> Account Manager dedicado
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-zinc-400" /> SLA de publicación garantizado
                    </li>
                  </ul>
                </div>
                <button className="w-full mt-8 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-850 hover:border-zinc-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-all">
                  Contactar Ventas
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 py-24 md:py-36 bg-gradient-to-b from-zinc-950 to-black text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="container-custom max-w-4xl relative z-10 px-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
              CREA MEJOR CONTENIDO, <br />
              <span className="text-zinc-500">JUNTOS.</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10">
              Prueba la plataforma de preparación y aprobación de redes sociales más rápida del mercado. Diseñada para
              equipos modernos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white hover:bg-zinc-100 text-zinc-950 font-bold py-3 px-8 rounded-full text-sm transition-all flex items-center gap-2 shadow-lg">
                Comenzar gratis <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-transparent border border-zinc-850 hover:bg-zinc-900/50 text-white font-semibold py-3 px-8 rounded-full text-sm transition-all">
                Ver Demo en Video
              </button>
            </div>
          </div>
        </section>

        <footer className="relative z-20 bg-black border-t border-zinc-900 py-12 text-center text-xs text-zinc-650">
          <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500">
            <div>
              <span className="font-bold text-white tracking-widest text-sm">KERN</span>
              <p className="mt-1 text-[11px]">© 2026 KERN. Todos los derechos reservados.</p>
            </div>
            <div className="flex gap-6">
              <a href="/legal-notice" className="hover:text-zinc-300 transition-colors">
                Aviso Legal
              </a>
              <a href="/privacy" className="hover:text-zinc-300 transition-colors">
                Privacidad
              </a>
              <a href="/terms" className="hover:text-zinc-300 transition-colors">
                Términos de Servicio
              </a>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
