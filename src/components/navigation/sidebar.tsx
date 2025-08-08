"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, mergeClasses, Tooltip } from "@fluentui/react-components";
import { ChevronDownRegular, ChevronRightRegular, DoorArrowLeft24Filled } from "@fluentui/react-icons";
import { useUserMenu } from "@/hooks/use-user-menu";
import { useAuth } from "@/hooks/use-auth";
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
  const { menu: dynamicMenu } = useUserMenu();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!pathname || pathname === '/') return;
    
    const activeMenuId = dynamicMenu.find((item) =>
      item.items?.some((subItem) => {
        if (!subItem.href) return false;
        return pathname === subItem.href || pathname.startsWith(subItem.href);
      })
    )?.id;

    if (activeMenuId) {
      setOpenMenus((prev) => ({ ...prev, [activeMenuId]: true }));
    }
  }, [pathname, dynamicMenu]);

  const isActive = useCallback((href: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href);
  }, [pathname]);

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  }, []);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      clearSelectedModule();
      await logout();
      router.push("/");
    } catch (error) {
      console.error('Error durante logout:', error);
      router.push("/");
    }
  }, [logout, router]);

  const renderMenuItem = useCallback((item: any) => {
    const IconComponent = item.iconName ? ICON_MAP[item.iconName] : null;
    const isMenuOpen = openMenus[item.id];

    return (
      <div key={item.id}>
        <div className={mergeClasses(styles.menuItem)} onClick={() => toggleMenu(item.id)}>
          <div className={styles.menuItemContent}>
            {IconComponent && <IconComponent className={styles.menuIcon} />}
            <span className={styles.menuText}>{item.label}</span>
          </div>
          <span>
            {isMenuOpen ? <ChevronDownRegular /> : <ChevronRightRegular />}
          </span>
        </div>

        <div className={mergeClasses(isMenuOpen ? styles.submenuOpen : styles.submenuClose)}>
          {item.items?.map((subItem: any) => {
            const SubIconComponent = subItem.iconName ? ICON_MAP[subItem.iconName] : null;
            if (!subItem.href || subItem.href === "#") return null;
            
            return (
              <div
                key={subItem.id}
                className={mergeClasses(
                  styles.submenuItem,
                  isActive(subItem.href) && styles.submenuItemActive
                )}
                onClick={() => handleNavigation(subItem.href)}
              >
                {SubIconComponent && <SubIconComponent className={styles.submenuIcon} />}
                <span>{subItem.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [openMenus, isActive, styles, toggleMenu, handleNavigation]);

  const SidebarCollapsed = () => (
    <>
      <div className="w-full h-1/15 flex items-center justify-center px-2 border-b-[1.5px] border-gray-500">
        <button
          type="button"
          onClick={() => handleNavigation("/")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          aria-label="Ir a Bienvenido"
        >
          <Image src="/icon-tasa-white.svg" alt="Logo TASA" width={35} height={35} />
        </button>
      </div>

      <div className="w-full h-13/15 py-2 flex flex-col gap-2 items-center">
        {dynamicMenu.map((item) =>
          item.items?.map((subItem) => {
            const SubIconComponent = subItem.iconName ? ICON_MAP[subItem.iconName] : null;
            if (!subItem.href || subItem.href === "#") return null;
            
            return (
              <Tooltip
                content={subItem.label}
                relationship="label"
                withArrow
                positioning="after"
                key={subItem.id}
              >
                <div
                  className={mergeClasses(
                    "h-13 w-13 rounded-xs justify-center items-center flex cursor-pointer hover:bg-[#FFFFFF14]",
                    isActive(subItem.href) && styles.submenuItemActiveCollapsed
                  )}
                  onClick={() => subItem.href && handleNavigation(subItem.href)}
                >
                  {SubIconComponent && <SubIconComponent className="text-white" />}
                </div>
              </Tooltip>
            );
          })
        )}
      </div>

      <div className="w-full h-1/15 px-2 items-center flex justify-center">
        <Button
          appearance="transparent"
          className={styles.signOutButton}
          icon={<DoorArrowLeft24Filled className="text-white" />}
          onClick={handleLogout}
          size="large"
        />
      </div>
    </>
  );

  const SidebarExpanded = () => (
    <>
      <div className="w-full h-1/15 flex items-center px-2 border-b-[1.5px] border-gray-500">
        <button
          type="button"
          onClick={() => handleNavigation("/")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          aria-label="Ir a Bienvenido"
        >
          <Image src="/logo-tasa-white.svg" alt="Logo TASA" width={90} height={90} />
        </button>
      </div>

      <div className="w-full h-13/15 py-2">
        {dynamicMenu.map(renderMenuItem)}
      </div>

      <div className="w-full h-1/15 px-2 items-center flex justify-between">
        <Button
          appearance="transparent"
          className={styles.signOutButton}
          icon={<DoorArrowLeft24Filled />}
          onClick={handleLogout}
          size="small"
        >
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <div className={`bg-[${COLORS.primary}] transition-all ${collapsed ? "w-1/23" : "w-4/23"}`}>
      {collapsed ? <SidebarCollapsed /> : <SidebarExpanded />}
    </div>
  );
}
