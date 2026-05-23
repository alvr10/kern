'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useOrganizations,
  useUpdateOrganization,
  useDeleteOrganization,
  useOrganizationMembers,
  useInviteUser,
  useRemoveMember,
  useUpdateMemberRole,
} from '@/lib/api/organizations-service/hooks';
import { MemberRole } from '@/lib/api/organizations-service/types';
import { useSocialAccounts, useConnectSocialAccount, useDisconnectSocialAccount } from '@/lib/api/social-service/hooks';
import { SocialPlatform } from '@/lib/api/types';
import styles from './page.module.css';
import { UserMinus, Trash2, Camera, AtSign, Briefcase, Sparkles, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

/**
 * Organization Settings Page
 */
export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // 1. Get current organization
  const { data: organizations, isLoading: isOrgLoading } = useOrganizations();
  const organization = organizations?.find(org => org.slug === slug);
  const organizationId = organization?.id || (organization as { _id?: string })?._id;

  // 2. State for General Settings
  const [name, setName] = useState('');

  // 3. State for Invites
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>(MemberRole.VIEWER);

  // 4. Mutations
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();
  const inviteUser = useInviteUser();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  // 5. Members
  const { data: members, isLoading: isMembersLoading } = useOrganizationMembers(organizationId || '');

  // 6. Active Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'channels'>('general');

  // Listen to url search params on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const tab = queryParams.get('tab');
      if (tab === 'channels') {
        setActiveTab('channels');
      } else if (tab === 'members') {
        setActiveTab('members');
      }
    }
  }, []);

  const handleTabChange = (tab: 'general' | 'members' | 'channels') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  // 7. Social Accounts Queries & Mutations
  const { data: connectedAccounts = [] } = useSocialAccounts(organizationId || '');
  const connectMutation = useConnectSocialAccount();
  const disconnectMutation = useDisconnectSocialAccount();

  // 8. Custom Platform States
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customPlatformName, setCustomPlatformName] = useState('');
  const [isConnectingCustom, setIsConnectingCustom] = useState(false);

  const handleConnectPlatform = async (platform: string) => {
    if (!organizationId) return;
    try {
      const generatedId = `mock_user_${Math.random().toString(36).substring(7)}`;
      const generatedToken = `mock_token_${Math.random().toString(36).substring(7)}`;

      await connectMutation.mutateAsync({
        organizationId,
        platform: platform as SocialPlatform,
        platformUserId: generatedId,
        accessToken: generatedToken,
      });
    } catch (err) {
      console.error('Failed to connect channel:', err);
    }
  };

  const handleConnectCustomPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !customPlatformName.trim()) return;
    setIsConnectingCustom(true);
    try {
      const platformKey = customPlatformName.trim().toUpperCase().replace(/\s+/g, '_');
      const generatedId = `mock_user_${Math.random().toString(36).substring(7)}`;
      const generatedToken = `mock_token_${Math.random().toString(36).substring(7)}`;

      await connectMutation.mutateAsync({
        organizationId,
        platform: platformKey as SocialPlatform,
        platformUserId: generatedId,
        accessToken: generatedToken,
      });

      setCustomPlatformName('');
      setIsCustomModalOpen(false);
    } catch (err) {
      console.error('Failed to connect custom platform:', err);
    } finally {
      setIsConnectingCustom(false);
    }
  };

  const handleDisconnectPlatform = async (id: string) => {
    if (!organizationId) return;
    try {
      await disconnectMutation.mutateAsync({
        id,
        organizationId,
      });
    } catch (err) {
      console.error('Failed to disconnect channel:', err);
    }
  };

  const getPlatformIcon = (platform: string, size = 18) => {
    const clean = platform.toUpperCase();
    if (clean.includes('INSTAGRAM')) {
      return <Camera size={size} style={{ color: '#e1306c' }} />;
    } else if (clean.includes('THREADS')) {
      return <AtSign size={size} />;
    } else if (clean.includes('LINKEDIN')) {
      return <Briefcase size={size} style={{ color: '#0077b5' }} />;
    } else {
      return <Sparkles size={size} style={{ color: '#f59e0b' }} />;
    }
  };

  const defaultChannels = [
    {
      key: 'INSTAGRAM',
      label: 'Instagram',
      icon: <Camera size={24} style={{ color: '#e1306c' }} />,
    },
    {
      key: 'THREADS',
      label: 'Threads',
      icon: <AtSign size={24} />,
    },
    {
      key: 'LINKEDIN',
      label: 'LinkedIn',
      icon: <Briefcase size={24} style={{ color: '#0077b5' }} />,
    },
  ];

  // Sync state when org loads
  useEffect(() => {
    if (organization) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(organization.name);
    }
  }, [organization]);

  if (isOrgLoading || !organization) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const handleUpdateGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    updateOrg.mutate({
      id: organizationId,
      data: {
        name,
      },
    });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !inviteEmail) return;

    inviteUser.mutate(
      {
        id: organizationId,
        data: {
          email: inviteEmail,
          role: inviteRole,
        },
      },
      {
        onSuccess: () => {
          setInviteEmail('');
          alert('Invitación enviada con éxito');
        },
      },
    );
  };

  const handleDelete = () => {
    if (!organizationId) return;
    const confirmName = prompt(
      `Escribe el nombre de la organización "${organization.name}" para confirmar el borrado:`,
    );

    if (confirmName === organization.name) {
      deleteOrg.mutate(organizationId, {
        onSuccess: () => {
          router.push('/dashboard/organizations');
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ajustes de Organización</h1>
        <p className={styles.subtitle}>Gestiona los detalles, miembros y configuración de {organization.name}</p>
      </header>

      {/* Tabs Navigation Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '32px',
          paddingBottom: '0px',
        }}
      >
        <button
          onClick={() => handleTabChange('general')}
          className={cn(styles.tabBtn, activeTab === 'general' && styles.tabBtnActive)}
        >
          General
        </button>
        <button
          onClick={() => handleTabChange('members')}
          className={cn(styles.tabBtn, activeTab === 'members' && styles.tabBtnActive)}
        >
          Miembros
        </button>
        <button
          onClick={() => handleTabChange('channels')}
          className={cn(styles.tabBtn, activeTab === 'channels' && styles.tabBtnActive)}
        >
          Canales Sociales
        </button>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>General</h2>
              <p className={styles.sectionDescription}>Información básica de tu organización</p>
            </div>

            <form className={styles.form} onSubmit={handleUpdateGeneral}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre de la Organización</label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: Mi Equipo de Marketing"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Slug de la URL (kern.id/slug)</label>
                <input className={styles.input} value={organization.slug} disabled placeholder="mi-equipo" />
                <p className={styles.sectionDescription} style={{ fontSize: '11px' }}>
                  El slug no se puede cambiar después de la creación.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo de Organización</label>
                <input className={styles.input} value={organization.type} disabled />
              </div>

              <button type="submit" className={styles.saveButton} disabled={updateOrg.isPending}>
                {updateOrg.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className={cn(styles.section, styles.dangerSection)}>
            <div className={styles.sectionHeader}>
              <h2 className={cn(styles.sectionTitle, styles.dangerTitle)}>Zona de Peligro</h2>
              <p className={styles.sectionDescription}>Acciones irreversibles para esta organización</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className={styles.label} style={{ color: '#dc2626', marginBottom: '4px' }}>
                  Eliminar Organización
                </h3>
                <p className={styles.sectionDescription}>
                  Esto borrará permanentemente la organización y todo su contenido.
                </p>
              </div>
              <button className={styles.deleteButton} onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </section>
        </>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Miembros</h2>
            <p className={styles.sectionDescription}>Gestiona quién tiene acceso a esta organización</p>
          </div>

          <div className={styles.inviteSection}>
            <h3 className={styles.label}>Invitar nuevo miembro</h3>
            <form className={styles.inviteBox} onSubmit={handleInvite}>
              <input
                className={styles.input}
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                required
              />
              <select
                className={styles.select}
                style={{ width: '140px' }}
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as MemberRole)}
              >
                <option value={MemberRole.VIEWER}>Lector</option>
                <option value={MemberRole.EDITOR}>Editor</option>
                <option value={MemberRole.ADMIN}>Admin</option>
              </select>
              <button type="submit" className={styles.saveButton} disabled={inviteUser.isPending}>
                Invitar
              </button>
            </form>
          </div>

          <div style={{ marginTop: '32px' }}>
            {isMembersLoading ? (
              <div className={styles.loadingContainer} style={{ height: '100px' }}>
                <div className={styles.spinner} />
              </div>
            ) : (
              <table className={styles.membersTable}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {members?.map(member => {
                    const isOwner = member.profileId === organization.ownerId;
                    return (
                      <tr key={member.profileId}>
                        <td>
                          <div className={styles.memberInfo}>
                            <div className={styles.avatar}>
                              {member.profile?.name
                                ? member.profile.name.slice(0, 2).toUpperCase()
                                : member.profileId.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className={styles.memberName}>{member.profile?.name || member.profileId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={cn(styles.roleBadge, styles[`role${isOwner ? 'OWNER' : member.role}`])}>
                            {isOwner ? 'PROPIETARIO' : member.role}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {!isOwner && (
                              <>
                                <select
                                  className={styles.select}
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  value={member.role}
                                  onChange={e =>
                                    updateMemberRole.mutate({
                                      id: organizationId!,
                                      memberId: member.profileId,
                                      role: e.target.value as MemberRole,
                                    })
                                  }
                                >
                                  <option value={MemberRole.VIEWER}>Lector</option>
                                  <option value={MemberRole.EDITOR}>Editor</option>
                                  <option value={MemberRole.ADMIN}>Admin</option>
                                </select>
                                <button
                                  className={styles.iconButton}
                                  onClick={() => {
                                    if (confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
                                      removeMember.mutate({
                                        id: organizationId!,
                                        memberId: member.profileId,
                                      });
                                    }
                                  }}
                                >
                                  <UserMinus size={16} color="#ef4444" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Social Channels Tab */}
      {activeTab === 'channels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Active Connections */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Canales Conectados</h2>
              <p className={styles.sectionDescription}>
                Canales sociales activos y autorizados para publicar contenido.
              </p>
            </div>

            {connectedAccounts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {connectedAccounts.map((account: any) => (
                  <div
                    key={account.id || account._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--background)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={
                          (account.profileData?.avatar as string) ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${account.platform}`
                        }
                        alt={account.platform}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: '1px solid var(--border)',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>
                          {(account.profileData?.name as string) || account.platform}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--muted-foreground)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {getPlatformIcon(account.platform, 14)}
                          <span>{(account.profileData?.handle as string) || `@${account.platform.toLowerCase()}`}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisconnectPlatform(account.id || account._id)}
                      className={styles.deleteButton}
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }}
                      disabled={disconnectMutation.isPending}
                    >
                      <Trash2 size={14} />
                      Desconectar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                  color: 'var(--muted-foreground)',
                  fontSize: '14px',
                }}
              >
                No tienes ningún canal social conectado en esta organización.
              </div>
            )}
          </section>

          {/* Connect New Connections */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Conectar Nuevos Canales</h2>
              <p className={styles.sectionDescription}>
                Selecciona una plataforma social para vincularla a tu organización.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {defaultChannels
                .filter(ch => !connectedAccounts?.some((acc: any) => acc.platform.toUpperCase() === ch.key))
                .map(channel => (
                  <button
                    key={channel.key}
                    onClick={() => handleConnectPlatform(channel.key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--background)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                      textAlign: 'center',
                    }}
                    disabled={connectMutation.isPending}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--secondary)',
                      }}
                    >
                      {channel.icon}
                    </div>
                    <div>
                      <div
                        style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px', color: 'var(--foreground)' }}
                      >
                        {channel.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Establecer conexión</div>
                    </div>
                  </button>
                ))}

              {/* Dynamic Custom Platform Card */}
              <button
                onClick={() => setIsCustomModalOpen(true)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '24px 16px',
                  borderRadius: '8px',
                  border: '1px dashed var(--border)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <Plus size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px', color: 'var(--foreground)' }}>
                    Canal Personalizado
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Vincular otra plataforma</div>
                </div>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Glassmorphic Connect Custom Platform Modal */}
      {isCustomModalOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            onClick={() => setIsCustomModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                width: '440px',
                maxWidth: '95vw',
                padding: '28px',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Conectar canal personalizado</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                  Introduce el nombre de la plataforma para establecer una conexión de prueba.
                </p>
              </div>
              <form
                onSubmit={handleConnectCustomPlatform}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Nombre de la Plataforma
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. YouTube, Bluesky, Mastodon..."
                    value={customPlatformName}
                    onChange={e => setCustomPlatformName(e.target.value)}
                    className={styles.input}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConnectingCustom || !customPlatformName.trim()}
                    className={styles.saveButton}
                    style={{ padding: '10px 20px', height: 'auto', alignSelf: 'auto' }}
                  >
                    {isConnectingCustom ? 'Conectando...' : 'Conectar Canal'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
