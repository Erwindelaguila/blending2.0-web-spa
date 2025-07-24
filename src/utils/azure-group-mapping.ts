import type { UserRole } from '@/interface/auth';

export const GROUP_IDS = {
  ADMIN: '98b8eed2-ffcd-40fd-9979-39ee06253edf',    
  LOGISTICS: 'c706d3f6-10fa-4a1e-9274-364f60dd3c1f',  
  QUALITY: 'ee48df9c-0dc1-4428-9bf2-55945b50a6be',    
};

export function getUserRolesFromGroups(groups: string[]): UserRole[] {
  const roles: UserRole[] = [];
  
  if (groups.includes(GROUP_IDS.ADMIN)) {
    roles.push('admin');
  }
  if (groups.includes(GROUP_IDS.LOGISTICS)) {
    roles.push('logistics');
  }
  if (groups.includes(GROUP_IDS.QUALITY)) {
    roles.push('quality');
  }
  
  return roles.length > 0 ? roles : [];
}

// Determina el rol principal (el primero en orden de prioridad)
export function getPrimaryRole(roles: UserRole[]): UserRole {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('logistics')) return 'logistics';
  if (roles.includes('quality')) return 'quality';
  return 'user';
}

// Determina qué módulos puede ver el usuario según sus roles
export function getAccessibleModules(roles: UserRole[]): string[] {
  const modules: string[] = [];
  
  if (roles.includes('admin')) {
    modules.push('administrador', "logistica", "calidad");
  } 
  if (roles.includes('logistics')) {
    modules.push('logistica');
  }
  if (roles.includes('quality')) {
    modules.push('calidad');
  }
  
  return modules.length > 0 ? modules : []; 
}

// Determina los permisos según los roles
export function getPermissionsFromRoles(roles: UserRole[]) {
  const isAdmin = roles.includes('admin');
  const hasLogistics = roles.includes('logistics');
  const hasQuality = roles.includes('quality');
  
  return {
    configuraciones: isAdmin,
    consultas: isAdmin || hasLogistics || hasQuality,
    mantenimientos: isAdmin,
    modelos: isAdmin || hasLogistics || hasQuality,
    dashboard: true, // Todos pueden ver el dashboard
  };
}


