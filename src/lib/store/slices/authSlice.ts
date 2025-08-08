import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, MenuItem } from '@/interface/auth/auth-state';
import { AuthService } from '@/services/auth.service';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  accessToken: null,
  menu: [],
  userInfo: null,
  isMenuLoading: false,
  menuError: null,
  isAppLoading: true,
  isProcessingCallback: false,
  callbackPhase: 'idle', 
};

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.initialize();
      const token = await AuthService.refreshToken();
      if (!token) return rejectWithValue('No se pudo refrescar el token');
      return token;
    } catch (e) {
      return rejectWithValue('Error al refrescar el token');
    }
  }
);

export const handleAuthCallback = createAsyncThunk(
  'auth/handleCallback',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.initialize();
      const result = await AuthService.handleRedirectResponse();
      if (result.user) return result;

      const existing = await AuthService.getExistingUser();
      return existing;
    } catch (e) {
      return rejectWithValue('Error en callback de autenticación');
    }
  }
);
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.initialize();
      
      const redirectResult = await AuthService.handleRedirectResponse();
      if (redirectResult.user) {
        return redirectResult;
      }

      const existingResult = await AuthService.getExistingUser();
      return existingResult;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al inicializar auth');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.login();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al hacer login');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al hacer logout');
    }
  }
);

export const loadUserMenu = createAsyncThunk(
  'auth/loadMenu',
  async (_, { rejectWithValue }) => {
    try {
      const { UserMenuServiceAPI } = await import('@/services/user-menu-service-api');
      const response = await UserMenuServiceAPI.getUserMenu();
      if (response.succeeded) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Error al cargar el menú');
      }
    } catch (error) {
      return rejectWithValue('Error al cargar el menú del usuario');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAppLoadingComplete: (state) => {
      state.isAppLoading = false;
    },
    completeCallback: (state) => {
      state.isProcessingCallback = false;
      state.callbackPhase = 'complete';
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.isAppLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAppLoading = false;
        state.error = action.payload as string;
      })
      // Callback Auth
      .addCase(handleAuthCallback.pending, (state) => {
        state.isProcessingCallback = true;
        state.callbackPhase = 'processing';
      })
      .addCase(handleAuthCallback.fulfilled, (state, action) => {
        state.isProcessingCallback = false;
        state.callbackPhase = 'complete';
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isInitialized = true;
      })
      .addCase(handleAuthCallback.rejected, (state, action) => {
        state.isProcessingCallback = false;
        state.callbackPhase = 'idle';
        state.error = action.payload as string;
      })
      // Login User
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh token
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.accessToken = action.payload as string;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
      })
      // Load User Menu
      .addCase(loadUserMenu.pending, (state) => {
        state.isMenuLoading = true;
        state.menuError = null;
      })
      .addCase(loadUserMenu.fulfilled, (state, action) => {
        state.isMenuLoading = false;
        state.isAppLoading = false;
        if (action.payload) {
          const { enlaces, permisosUsuario, userInfo } = action.payload;
          state.userInfo = {
            ...userInfo,
            enlaces,
            permisosUsuario,
          };

          const grupos: Record<string, MenuItem> = {};
          const itemsSinGrupo: MenuItem[] = [];

            // Construcción de grupos e items
          permisosUsuario.forEach((permiso) => {
            const enlace = enlaces[permiso];
            if (!enlace || !enlace.url || enlace.url === '#') return;

            if (enlace.grupo) {
              if (!grupos[enlace.grupo]) {
                grupos[enlace.grupo] = {
                  id: enlace.grupo,
                  label: enlaces[enlace.grupo]?.title || enlace.grupo,
                  iconName: enlaces[enlace.grupo]?.icon || 'Box',
                  items: [],
                };
              }
              if (!grupos[enlace.grupo].items!.some(item => item.id === permiso)) {
                grupos[enlace.grupo].items!.push({
                  id: permiso,
                  label: enlace.title || permiso,
                  href: enlace.url,
                  iconName: enlace.icon || 'Box',
                });
              }
            } else {
              if (!itemsSinGrupo.some(item => item.id === permiso)) {
                itemsSinGrupo.push({
                  id: permiso,
                  label: enlace.title || permiso,
                  href: enlace.url,
                  iconName: enlace.icon || 'Box',
                });
              }
            }
          });
          const groupIds = new Set(Object.keys(grupos));
          const groupChildIds = new Set<string>();
          const groupChildLabels = new Set<string>();
          Object.values(grupos).forEach(g => g.items?.forEach(i => { groupChildIds.add(i.id); groupChildLabels.add(i.label.trim().toLowerCase()); }));
          const groupLabels = new Set(Object.values(grupos).map(g => g.label.trim().toLowerCase()));

          const itemsSinGrupoFiltrados = itemsSinGrupo.filter(item => {
            const normLabel = item.label.trim().toLowerCase();
            return !groupIds.has(item.id) && !groupChildIds.has(item.id) && !groupLabels.has(normLabel) && !groupChildLabels.has(normLabel);
          });

          const menuGrupos = Object.values(grupos).filter(grupo => grupo.items && grupo.items.length > 0);
          state.menu = [
            ...menuGrupos,
            ...itemsSinGrupoFiltrados
          ];
        }
      })
      .addCase(loadUserMenu.rejected, (state, action) => {
        state.isMenuLoading = false;
        state.isAppLoading = false;
        state.menuError = action.payload as string;
      });
  },
});

export const { clearError, setAppLoadingComplete, completeCallback } = authSlice.actions;
export default authSlice.reducer;
