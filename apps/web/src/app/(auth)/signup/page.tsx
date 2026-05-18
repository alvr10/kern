'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSignUp } from '@/lib/api/auth/hooks';
import styles from '../auth.module.css';

export default function SignUpPage(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const { mutate: signUp, isPending: loading, error } = useSignUp();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(
      { email, password },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      },
    );
  };

  if (success) {
    return (
      <>
        <h1 className={styles.title}>Revisa tu correo</h1>
        <p className={styles.subtitle}>
          Hemos enviado un enlace de confirmación a <strong>{email}</strong>. Por favor, confirma tu cuenta para
          continuar.
        </p>
        <Link
          href="/login"
          className={styles.submitBtn}
          style={{
            textAlign: 'center',
            display: 'block',
            textDecoration: 'none',
          }}
        >
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
          <label htmlFor="email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="nombre@empresa.com"
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </div>

        {error && <div className={styles.error}>{error.message}</div>}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className={styles.footer}>
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className={styles.link}>
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
