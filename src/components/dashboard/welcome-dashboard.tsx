"use client";

import { useRouter } from "next/navigation";
import { MODULES } from "@/config/app.config.server";
import { MODULE_ICONS } from "@/config/app.config.client";
import { setSelectedModule } from "@/utils/module-manager";
import { useDashboardStyles } from "@/styles/dashboard.styles";

export function WelcomeDashboard() {
  const styles = useDashboardStyles();
  const router = useRouter();

  const selectModule = (moduleId: string) => {
    try {
      console.log(`🚀 Dashboard: Seleccionando módulo ${moduleId}`);

      setSelectedModule(moduleId as any);
      const moduleID = MODULES[moduleId as keyof typeof MODULES];

      if (moduleID) {
        console.log(`🔄 Dashboard: Navegando a ${moduleID.defaultRoute}`);
        router.push(moduleID.defaultRoute);
      }
    } catch (error) {
      console.error("❌ Dashboard: Error al seleccionar módulo:", error);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className={styles.container}>
        <h1 className={styles.welcomeTitle}>¡Bienvenido Juan Pérez!</h1>
        <p className={styles.welcomeSubtitle}>
          Selecciona un módulo para comenzar
        </p>

        <div className={styles.cardsGrid}>
          {Object.values(MODULES).map((module) => {
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
          })}
        </div>
      </div>
    </main>
  );
}
