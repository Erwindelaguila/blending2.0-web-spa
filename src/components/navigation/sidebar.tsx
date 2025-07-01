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
import { NAVIGATION_MENU } from "@/config/app.config.client";
import { getSelectedModule, clearSelectedModule } from "@/utils/module-manager";
import { filterNavigationByModule } from "@/utils/navigation";
import { useSidebarStyles } from "@/styles/sidebar.styles";
import type { ModuleId } from "@/config/app.config.server";
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

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null);

  useEffect(() => {
    const moduleSelect = getSelectedModule();
    setSelectedModule(moduleSelect);
  }, [pathname]);

  useEffect(() => {
    if (!selectedModule) return;

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 0) {
      const filteredNav = filterNavigationByModule(
        NAVIGATION_MENU,
        selectedModule
      );
      const mainSegment = segments[0];
      const menuToOpen = filteredNav.find((menuItem) =>
        menuItem.items?.some((subItem) =>
          subItem.href.includes(`/${mainSegment}/`)
        )
      );

      if (menuToOpen) {
        setOpenMenus((prev) => ({ ...prev, [menuToOpen.id]: true }));
      }
    }
  }, [pathname, selectedModule]);

  const filteredNavigation = useMemo(() => {
    if (!selectedModule) return [];
    return filterNavigationByModule(NAVIGATION_MENU, selectedModule);
  }, [selectedModule]);

  const navigationStates = useMemo(() => {
    const isActive = (href: string) => pathname === href;
    const isMenuActive = (menuId: string) =>
      filteredNavigation
        .find((item) => item.id === menuId)
        ?.items?.some((subItem) => pathname === subItem.href);

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

  const handleLogout = useCallback(() => {
    clearSelectedModule();
    router.push("/");
  }, [router]);

  const renderSidebarComponent = () => {
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
          <Image
            src="/icon-tasa-white.svg"
            alt="Descripción de la imagen"
            width={35}
            height={35}
          />
        </div>
        {/* Navegación */}
        <div className="w-full h-13/15 py-2 flex flex-col gap-2 items-center">
          <Tooltip
            content="Inicio"
            withArrow
            positioning={"after"}
            relationship="label"
          >
            <div
              className="w-13 h-13 flex items-center justify-center rounded-xs cursor-pointer hover:bg-[#FFFFFF14]"
              onClick={handleDashboardClick}
            >
              <HomePerson24Filled className="text-white" />
            </div>
          </Tooltip>

          {/* Navegación filtrada por módulo */}
          {filteredNavigation.map((item) => {
            return (
              <div key={item.id}>
                <div>
                  {item.items?.map((subItem) => {
                    const SubIconComponent = subItem.icon;
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
                          onClick={() => handleSubmenuClick(subItem.href)}
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
          <Image
            src="/logo-tasa-white.svg"
            alt="Descripción de la imagen"
            width={90}
            height={90}
          />
        </div>

        {/* Navegación */}
        <div className="w-full h-13/15 py-2">
          {/* Dashboard */}
          <div
            className={mergeClasses(
              styles.menuItem
              //navigationStates.isActive("/") && styles.menuItemActive
            )}
            onClick={handleDashboardClick}
          >
            <div className={styles.menuItemContent}>
              <HomePerson24Filled className={styles.menuIcon} />
              <span className={styles.menuText}>Inicio</span>
            </div>
          </div>

          {/* Navegación filtrada por módulo */}
          {filteredNavigation.map((item) => {
            const IconComponent = item.icon;
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
                    const SubIconComponent = subItem.icon;
                    if (!subItem.href || subItem.href === "#") return null;
                    return (
                      <div
                        key={subItem.id}
                        className={mergeClasses(
                          styles.submenuItem,
                          navigationStates.isActive(subItem.href) &&
                            styles.submenuItemActive
                        )}
                        onClick={() => handleSubmenuClick(subItem.href)}
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

        {/* Footer */}
        <div className="w-full h-1/15 px-2 items-center flex">
          <Button
            appearance="transparent"
            className={styles.signOutButton}
            icon={<DoorArrowLeft24Filled />}
            onClick={handleLogout}
            size="large"
          >
            Cerrar sesión
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
