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
import styles from './page.module.css';
import { UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const organizationId = organization?.id || (organization as any)?._id;

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

  // Sync state when org loads
  useEffect(() => {
    if (organization) {
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

      {/* General Settings */}
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

      {/* Members Section */}
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
    </div>
  );
}
