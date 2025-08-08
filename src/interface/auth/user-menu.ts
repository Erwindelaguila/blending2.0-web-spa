export interface EnlaceItem {
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  color?: string;
  tipo?: string;
  grupo?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  roles: string[];
  groups?: string[];
  enlaces?: Record<string, EnlaceItem>;
  permisosUsuario?: string[];
}

export interface UserMenuData {
  enlaces: Record<string, EnlaceItem>;
  permisosUsuario: string[];
  userInfo: UserInfo;
}
