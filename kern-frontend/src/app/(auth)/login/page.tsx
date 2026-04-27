'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@/lib/api/auth/hooks';
import styles from '../auth.module.css';

export default function SignInPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: signIn, isPending: loading, error } = useSignIn();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(
      { email, password },
      {
        onSuccess: () => {
          router.push('/');
          router.refresh();
        },
      }
    );
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

        {error && <div className={styles.error}>{error.message}</div>}

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
