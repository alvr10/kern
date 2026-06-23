'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuth, useSignIn } from '@/lib/api/auth/hooks';
import { supabase } from '@/lib/api/auth/client';
import { useRouter } from 'next/navigation';

interface OverviewStats {
  totalUsers?: number;
  totalOrganizations?: number;
  totalContentPieces?: number;
  totalTokensUsed?: number;
}

interface UserRecord {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isBanned?: boolean;
}

interface OrgRecord {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function AdminDashboard(): React.JSX.Element {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { mutate: signIn, isPending: loginPending, error: loginError } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [orgs, setOrgs] = useState<OrgRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.app_metadata?.role === 'admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      signIn({ email, password });
    }
  };

  const handleExit = () => {
    router.push('/dashboard/organizations');
  };

  const fetchAdminData = async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const [overviewData, usersData, orgsData] = await Promise.all([
        apiClient.get<OverviewStats>('/admin/analytics/overview').catch(err => {
          console.error(err);
          return {};
        }),
        apiClient.get<UserRecord[] | { items: UserRecord[] }>('/admin/users').catch(err => {
          console.error(err);
          return { items: [] };
        }),
        apiClient.get<OrgRecord[] | { items: OrgRecord[] }>('/admin/organizations').catch(err => {
          console.error(err);
          return { items: [] };
        }),
      ]);

      setStats(overviewData);
      setUsers(Array.isArray(usersData) ? usersData : usersData?.items || []);
      setOrgs(Array.isArray(orgsData) ? orgsData : orgsData?.items || []);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  // Force a token refresh on mount so the latest app_metadata.role is in the JWT
  useEffect(() => {
    supabase.auth.refreshSession().catch(() => {
      /* ignore */
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAuthenticated && isAdmin) {
      timer = setTimeout(() => {
        fetchAdminData();
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  const handleToggleBan = async (userId: string, currentBanned: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/ban`, { banned: !currentBanned });
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isBanned: !currentBanned } : u)));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      alert(`Error toggling ban status: ${apiErr?.message}`);
    }
  };

  const handleDeleteOrg = async (orgId: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) return;
    try {
      await apiClient.delete(`/admin/organizations/${orgId}`);
      setOrgs(prev => prev.filter(o => o.id !== orgId));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      alert(`Error deleting organization: ${apiErr?.message}`);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          color: '#fafafa',
        }}
      >
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          color: '#fafafa',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #27272a',
            backgroundColor: '#18181b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-title)' }}>
            Consola de Administración
          </h2>
          <p style={{ fontSize: '14px', color: '#a1a1aa', marginBottom: '24px' }}>
            Ingresa tus credenciales de administrador para proceder.
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#71717a',
                  fontWeight: 600,
                }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #27272a',
                  backgroundColor: '#09090b',
                  color: '#fafafa',
                  outline: 'none',
                  fontSize: '14px',
                }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#71717a',
                  fontWeight: 600,
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #27272a',
                  backgroundColor: '#09090b',
                  color: '#fafafa',
                  outline: 'none',
                  fontSize: '14px',
                }}
                required
              />
            </div>
            {loginError && <p style={{ fontSize: '12px', color: '#ef4444' }}>{loginError.message}</p>}
            <button
              type="submit"
              disabled={loginPending}
              style={{
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#fafafa',
                color: '#09090b',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                opacity: loginPending ? 0.6 : 1,
              }}
            >
              {loginPending ? 'Iniciando sesión...' : 'Acceder al Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          color: '#fafafa',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #7f1d1d',
            backgroundColor: '#450a0a',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px', color: '#fca5a5' }}>Acceso Denegado</h2>
          <p style={{ fontSize: '14px', color: '#fca5a5', marginBottom: '24px' }}>
            Tu cuenta no tiene privilegios de administrador.
          </p>
          <a
            href="/dashboard/organizations"
            style={{ color: '#fafafa', textDecoration: 'underline', fontSize: '14px' }}
          >
            Ir al Dashboard Principal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090b',
        color: '#fafafa',
        fontFamily: 'var(--font-body)',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #27272a',
            paddingBottom: '24px',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{ fontSize: '32px', fontWeight: 500, fontFamily: 'var(--font-title)', letterSpacing: '-0.02em' }}
            >
              Admin Control Center
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '4px' }}>
              Platform-wide management and diagnostics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #27272a',
                backgroundColor: '#18181b',
                color: '#fafafa',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleExit}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #ef4444',
                backgroundColor: 'transparent',
                color: '#ef4444',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Exit Console
            </button>
          </div>
        </header>

        {error && (
          <div
            style={{
              padding: '16px',
              borderRadius: '6px',
              backgroundColor: '#450a0a',
              border: '1px solid #7f1d1d',
              color: '#fca5a5',
              marginBottom: '32px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{ padding: '24px', borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b' }}
          >
            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Total Users</div>
            <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>{stats?.totalUsers ?? '—'}</div>
          </div>
          <div
            style={{ padding: '24px', borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b' }}
          >
            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Organizations</div>
            <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
              {stats?.totalOrganizations ?? '—'}
            </div>
          </div>
          <div
            style={{ padding: '24px', borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b' }}
          >
            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Content Generated</div>
            <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
              {stats?.totalContentPieces ?? '—'}
            </div>
          </div>
          <div
            style={{ padding: '24px', borderRadius: '12px', border: '1px solid #27272a', backgroundColor: '#18181b' }}
          >
            <div style={{ fontSize: '14px', color: '#a1a1aa' }}>AI Tokens Used</div>
            <div style={{ fontSize: '36px', fontWeight: 600, marginTop: '8px' }}>
              {stats?.totalTokensUsed?.toLocaleString() ?? '—'}
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px' }}>
          {/* Users Table */}
          <section
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #27272a',
              backgroundColor: '#18181b',
              overflowX: 'auto',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
              Registered Users
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', color: '#71717a' }}>
                  <th style={{ padding: '12px 8px' }}>User Details</th>
                  <th style={{ padding: '12px 8px' }}>Joined</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '24px 8px', color: '#71717a', textAlign: 'center' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #27272a' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 500 }}>{user.name || 'No Name'}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#a1a1aa' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleBan(user.id, !!user.isBanned)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: '1px solid ' + (user.isBanned ? '#22c55e' : '#ef4444'),
                            backgroundColor: 'transparent',
                            color: user.isBanned ? '#22c55e' : '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Orgs Table */}
          <section
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #27272a',
              backgroundColor: '#18181b',
              overflowX: 'auto',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px', fontFamily: 'var(--font-title)' }}>
              Organizations
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #27272a', color: '#71717a' }}>
                  <th style={{ padding: '12px 8px' }}>Name / Slug</th>
                  <th style={{ padding: '12px 8px' }}>Created</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgs.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '24px 8px', color: '#71717a', textAlign: 'center' }}>
                      No organizations found.
                    </td>
                  </tr>
                ) : (
                  orgs.map(org => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #27272a' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 500 }}>{org.name}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{org.slug}</div>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#a1a1aa' }}>
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ef4444',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
