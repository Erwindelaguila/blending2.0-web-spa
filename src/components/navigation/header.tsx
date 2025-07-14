"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button, Text, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from "@fluentui/react-components";
import { NavigationRegular, SignOutRegular, PersonRegular } from "@fluentui/react-icons";
import { MODULE_BREADCRUMBS, MODULE_NAMES } from "@/config/app.config.client";
import { getSelectedModule } from "@/utils/module-manager";
import { useHeaderStyles } from "@/styles/header.styles";
import { useAuthContext } from "@/providers/auth-provider";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const styles = useHeaderStyles();
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const breadcrumbInfo = useMemo(() => {
    if (pathname === "/") {
      return { breadcrumb: "Dashboard", currentModule: null };
    }

    const selectedModule = getSelectedModule();
    if (!selectedModule) {
      return { breadcrumb: "Dashboard", currentModule: null };
    }

    const moduleBreadcrumbs =
      MODULE_BREADCRUMBS[selectedModule as keyof typeof MODULE_BREADCRUMBS];
    const breadcrumb =
      moduleBreadcrumbs?.[pathname as keyof typeof moduleBreadcrumbs] ||
      "Dashboard";
    const moduleName =
      MODULE_NAMES[selectedModule as keyof typeof MODULE_NAMES];

    return { breadcrumb, currentModule: moduleName || null };
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const getUserDisplayName = () => {
    if (!user?.profile) return "Usuario";
    return user.profile.displayName || user.profile.givenName || "Usuario";
  };

  const getUserRole = () => {
    if (!user?.role) return "";
    const roleNames = {
      admin: "Administrador",
      logistics: "Logística", 
      quality: "Calidad",
      user: "Usuario"
    };
    return roleNames[user.role] || user.role;
  };

  return (
    <header className={`${styles.header} w-full h-1/15 `}>
      <div className={styles.headerLeft}>
        <Button
          appearance="subtle"
          icon={<NavigationRegular />}
          onClick={toggleSidebar}
          className={styles.menuButton}
          aria-label="Toggle navigation menu"
        />
        <Text className={styles.breadcrumb}>{breadcrumbInfo.breadcrumb}</Text>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.userInfo}>
          <div className={styles.userGreeting}>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button appearance="subtle" className="flex items-center gap-2">
                  <PersonRegular className="w-4 h-4" />
                  <div className="text-left">
                    <Text className={styles.userName}>¡Hola {getUserDisplayName()}!</Text>
                    <div className="flex gap-2 items-center">
                      {breadcrumbInfo.currentModule && (
                        <Text className={styles.moduleIndicator}>
                          {breadcrumbInfo.currentModule}
                        </Text>
                      )}
                      {user?.role && (
                        <Text className="text-xs text-gray-500">
                          • {getUserRole()}
                        </Text>
                      )}
                    </div>
                  </div>
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={handleLogout}>
                    <SignOutRegular className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
