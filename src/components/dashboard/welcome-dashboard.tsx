"use client";

import { useRouter } from "next/navigation";
import { MODULES } from "@/config/app.config.server";
import { MODULE_ICONS } from "@/config/app.config.client";
import { setSelectedModule } from "@/utils/module-manager";
import { useDashboardStyles } from "@/styles/dashboard.styles";
import { useAuthContext } from "@/providers/auth-provider";

export function WelcomeDashboard() {
  const styles = useDashboardStyles();
  const router = useRouter();
  const { user } = useAuthContext();

  const selectModule = (moduleId: string) => {
    try {
      setSelectedModule(moduleId as any);
      const moduleID = MODULES[moduleId as keyof typeof MODULES];

      if (moduleID) {
        router.push(moduleID.defaultRoute);
      }
    } catch (error) {
      console.error("Error al seleccionar módulo:", error);
    }
  };

  // Filtrar módulos según los permisos del usuario
  const getAccessibleModules = () => {
    if (!user?.isAuthenticated) {
      return []; // Si no está autenticado, no mostrar módulos
    }

    return Object.values(MODULES).filter(module => {
      // Verificar si el usuario tiene acceso a este módulo
      return user.accessibleModules?.includes(module.id) || false;
    });
  };

  const accessibleModules = getAccessibleModules();
  const userName = user?.profile?.displayName || user?.profile?.givenName || "Usuario";

  // Si está autenticado pero no tiene módulos accesibles, mostrar acceso denegado
  if (user?.isAuthenticated && accessibleModules.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Acceso Denegado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tu cuenta no tiene permisos para acceder a ningún módulo del sistema.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Usuario: {userName}</p>
              <p>No perteneces a ningún grupo válido</p>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-center text-sm text-gray-600">
              Contacta al administrador del sistema para solicitar acceso.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className={styles.container}>        
        <h1 className={styles.welcomeTitle}>¡Bienvenido {userName}!</h1>
        <p className={styles.welcomeSubtitle}>
          Selecciona un módulo para comenzar
        </p>

        <div className={styles.cardsGrid}>
          {accessibleModules.length > 0 ? (
            accessibleModules.map((module) => {
              const IconComponent = MODULE_ICONS[module.id];
              return (
                <div
                  key={module.id}
                  className={styles.card}
                  style={{ borderTop: `4px solid ${module.color}` }}
                  onClick={() => selectModule(module.id)}
                >
                  <div className={styles.cardContent}>
                    <div
                      className={styles.iconContainer}
                      style={{
                        backgroundColor: `${module.color}20`,
                        color: module.color,
                      }}
                    >
                      {IconComponent && <IconComponent fontSize={24} />}
                    </div>
                    <div>
                      <h3 className={styles.cardTitle}>{module.name}</h3>
                      <p className={styles.cardDescription}>
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-semibold mb-2">Sin módulos disponibles</h3>
                <p className="text-sm">
                  No tienes permisos para acceder a ningún módulo. 
                  Contacta al administrador para obtener acceso.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default WelcomeDashboard;
