"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, mergeClasses, Tooltip } from "@fluentui/react-components";
import {
  ChevronDownRegular,
  ChevronRightRegular,
  SignOutRegular,
  HomePerson24Filled,
  DoorArrowLeftFilled,
  DoorArrowLeft24Filled,
} from "@fluentui/react-icons";
import { useUserMenu } from "@/hooks/use-user-menu";
import { useAuth } from "@/providers/auth-provider";
import { clearSelectedModule } from "@/utils/module-manager";
import { useSidebarStyles } from "@/styles/sidebar.styles";
import { ICON_MAP } from "@/utils/icon-mapping";
import Image from "next/image";
import { COLORS } from "@/config/app.config.server";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}
export function Sidebar({ collapsed }: SidebarProps) {
  const styles = useSidebarStyles();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // ✅ CORRECTO: Usar el hook para obtener TODA la info desde el backend
  const { 
    menu: dynamicMenu, 
    userInfo, // ✅ Información completa del usuario desde backend
    isLoading: menuLoading, 
    error: menuError 
  } = useUserMenu();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Usar el menú dinámico del backend
  const filteredNavigation = dynamicMenu;

  const navigationStates = useMemo(() => {
    const isActive = (href: string) => pathname === href;
    const isMenuActive = (menuId: string) =>
      filteredNavigation
        .find((item) => item.id === menuId)
        ?.items?.some((subItem) => pathname === subItem.href) || false;

    return { isActive, isMenuActive };
  }, [pathname, filteredNavigation]);

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  }, []);

  const handleDashboardClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleSubmenuClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    try {
      clearSelectedModule();
      await logout(); // Usar el método de logout del contexto de auth
      router.push("/");
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar redirección aunque haya error
      router.push("/");
    }
  }, [logout, router]);

  const renderSidebarComponent = () => {
    // Mostrar loading mientras se obtiene el menú
    if (menuLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-sm">Cargando menú...</div>
        </div>
      );
    }

    // Mostrar error si hay problemas obteniendo el menú
    if (menuError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="text-red-300 text-sm text-center mb-2">
            Error cargando menú
          </div>
          <div className="text-red-200 text-xs text-center">
            {menuError}
          </div>
        </div>
      );
    }

    switch (collapsed) {
      case true:
        return SidebarCollapsed();
      case false:
        return renderSidebar();
      default:
        return null;
    }
  };

  const SidebarCollapsed = () => {
    return (
      <>
        <div className="w-full h-1/15 flex items-center justify-center px-2 border-b-[1.5px] border-gray-500">
          <button
            type="button"
            onClick={handleDashboardClick}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            aria-label="Ir a Bienvenido"
          >
            <Image
              src="/icon-tasa-white.svg"
              alt="Logo TASA"
              width={35}
              height={35}
            />
          </button>
        </div>
        {/* Navegación */}
        <div className="w-full h-13/15 py-2 flex flex-col gap-2 items-center">

          {/* Navegación filtrada por módulo */}
          {filteredNavigation.map((item) => {
            return (
              <div key={item.id}>
                <div>
                  {item.items?.map((subItem) => {
                    const SubIconComponent = subItem.iconName ? ICON_MAP[subItem.iconName] : null;
                    if (!subItem.href || subItem.href === "#") return null;
                    return (
                      <Tooltip
                        content={subItem.label}
                        relationship="label"
                        withArrow
                        positioning={"after"}
                        key={subItem.id}
                      >
                        <div
                          key={subItem.id}
                          className={mergeClasses(
                            "h-13 w-13 rounded-xs justify-center  items-center flex cursor-pointer hover:bg-[#FFFFFF14]",
                            navigationStates.isActive(subItem.href) &&
                              styles.submenuItemActiveCollapsed
                          )}
                          onClick={() => subItem.href && handleSubmenuClick(subItem.href)}
                        >
                          {SubIconComponent && (
                            <SubIconComponent className="text-white" />
                          )}
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-1/15 px-2 items-center flex justify-center">
          <Button
            appearance="transparent"
            className={styles.signOutButton}
            icon={<DoorArrowLeft24Filled className="text-white " />}
            onClick={handleLogout}
            size="large"
          ></Button>
        </div>
      </>
    );
  };

  const renderSidebar = () => {
    return (
      <>
        {/* Logo */}
        <div className="w-full h-1/15 flex items-center px-2 border-b-[1.5px] border-gray-500">
          <button
            type="button"
            onClick={handleDashboardClick}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            aria-label="Ir a Bienvenido"
          >
            <Image
              src="/logo-tasa-white.svg"
              alt="Logo TASA"
              width={90}
              height={90}
            />
          </button>
        </div>

        {/* Navegación */}
        <div className="w-full h-13/15 py-2">


          {/* Navegación filtrada por módulo */}
          {filteredNavigation.map((item) => {
            const IconComponent = item.iconName ? ICON_MAP[item.iconName] : null;
            const isMenuOpen = openMenus[item.id];
            //const isMenuActiveState = navigationStates.isMenuActive(item.id);

            return (
              <div key={item.id}>
                {/* Menú principal */}
                <div
                  className={mergeClasses(styles.menuItem)}
                  onClick={() => toggleMenu(item.id)}
                >
                  <div className={styles.menuItemContent}>
                    {IconComponent && (
                      <IconComponent className={styles.menuIcon} />
                    )}
                    <span className={styles.menuText}>{item.label}</span>
                  </div>

                  <span>
                    {isMenuOpen ? (
                      <ChevronDownRegular />
                    ) : (
                      <ChevronRightRegular />
                    )}
                  </span>
                </div>

                <div
                  className={mergeClasses(
                    isMenuOpen ? styles.submenuOpen : styles.submenuClose
                  )}
                >
                  {item.items?.map((subItem) => {
                    const SubIconComponent = subItem.iconName ? ICON_MAP[subItem.iconName] : null;
                    if (!subItem.href || subItem.href === "#") return null;
                    return (
                      <div
                        key={subItem.id}
                        className={mergeClasses(
                          styles.submenuItem,
                          navigationStates.isActive(subItem.href) &&
                            styles.submenuItemActive
                        )}
                        onClick={() => subItem.href && handleSubmenuClick(subItem.href)}
                      >
                        {SubIconComponent && (
                          <SubIconComponent className={styles.submenuIcon} />
                        )}
                        <span>{subItem.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer con información del usuario */}
        <div className="w-full h-1/15 px-2 items-center flex justify-between">
          <div className="flex flex-col flex-1 min-w-0">
            {/* ✅ CORRECTO: Nombre del usuario desde el backend */}
            {userInfo?.Name && (
              <div className="text-white text-xs font-medium truncate">
                {userInfo.Name}
              </div>
            )}
            {/* Mostrar rol principal */}
            {userInfo?.Roles && userInfo.Roles.length > 0 && (
              <div className="text-gray-300 text-xs truncate">
                {userInfo.Roles[0]} {/* Rol principal */}
              </div>
            )}
          </div>
          
          <Button
            appearance="transparent"
            className={styles.signOutButton}
            icon={<DoorArrowLeft24Filled />}
            onClick={handleLogout}
            size="small"
          >
            Salir
          </Button>
        </div>
      </>
    );
  };

  return (
    <div
      className={`  bg-[${COLORS.primary}] transition-all ${
        !collapsed ? "w-4/23" : "w-1/23"
      }`}
    >
      {renderSidebarComponent()}
    </div>
  );
}
