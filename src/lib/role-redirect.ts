export type UserRole = 'SUPER_ADMIN' | 'COMPANY';

export const getRoleDashboardPath = (roleName: string): string => {
  const roleMap: Record<string, string> = {
    'SUPER_ADMIN': '/superadmin/page/dashboard',
    'COMPANY': '/company',
  };

  return roleMap[roleName] || '/dashboard' ;
};

export const getRolePermissions = (roleName: string) => {
  const permissions: Record<string, string[]> = {
    'SUPER_ADMIN': ['all'],
    'COMPANY': ['read', 'write', 'delete', 'manage_users'],
    'User': ['read'],
  };

  return permissions[roleName] || ['read'];
};