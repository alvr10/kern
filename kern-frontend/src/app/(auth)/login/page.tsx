'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from '../auth.module.css';

export default function SignInPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Bienvenido de nuevo</h1>
      <p className={styles.subtitle}>Ingresa tus credenciales para acceder a tu plataforma.</p>

      <form className={styles.form} onSubmit={handleSignIn}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="nombre@empresa.com"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className={styles.footer}>
        ¿No tienes una cuenta?{' '}
        <Link href="/signup" className={styles.link}>Regístrate gratis</Link>
      </p>
    </>
  );
}
