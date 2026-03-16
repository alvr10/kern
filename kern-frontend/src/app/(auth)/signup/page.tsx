'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from '../auth.module.css';

export default function SignUpPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <h1 className={styles.title}>Revisa tu correo</h1>
        <p className={styles.subtitle}>
          Hemos enviado un enlace de confirmación a <strong>{email}</strong>. 
          Por favor, confirma tu cuenta para continuar.
        </p>
        <Link href="/login" className={styles.submitBtn} style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
          Volver al Inicio de Sesión
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Crea tu cuenta</h1>
      <p className={styles.subtitle}>Empieza a organizar tu contenido con una estructura profesional.</p>

      <form className={styles.form} onSubmit={handleSignUp}>
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
            placeholder="Mínimo 6 caracteres"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className={styles.footer}>
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className={styles.link}>Inicia sesión</Link>
      </p>
    </>
  );
}
