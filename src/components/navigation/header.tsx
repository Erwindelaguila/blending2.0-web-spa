"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button, Text } from "@fluentui/react-components";
import { NavigationRegular, PersonRegular } from "@fluentui/react-icons";
import { useHeaderStyles } from "@/styles/header.styles";
import { useAuth } from "@/hooks/use-auth";
import { useUserMenu } from "@/hooks/use-user-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const styles = useHeaderStyles();
  const pathname = usePathname();
  const { user } = useAuth();
  const { userInfo } = useUserMenu();

  const breadcrumbInfo = useMemo(() => {
    if (pathname === "/") {
      return { breadcrumb: "Dashboard", currentModule: null };
    }

    if (userInfo?.enlaces) {
      for (const enlace of Object.values(userInfo.enlaces)) {
        if (enlace.url === pathname) {
          return { 
            breadcrumb: enlace.title || "Dashboard", 
            currentModule: enlace.grupo ? userInfo.enlaces[enlace.grupo]?.title : null 
          };
        }
      }
    }

    return { breadcrumb: "Dashboard", currentModule: null };
  }, [pathname, userInfo]);

  const getUserDisplayName = () => {
    return userInfo?.name || user?.displayName || "Usuario";
  };

  const getUserRole = () => {
    return userInfo?.roles?.[0] || "";
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
            <div className="flex items-center gap-2">
              <PersonRegular className="w-4 h-4" />
              <div className="text-left">
                <Text className={styles.userName}>¡Hola {getUserDisplayName()}!</Text>
                <div className="flex gap-2 items-center">
                  {breadcrumbInfo.currentModule && (
                    <Text className={styles.moduleIndicator}>
                      {breadcrumbInfo.currentModule}
                    </Text>
                  )}
                  {getUserRole() && (
                    <Text className="text-xs text-gray-500">
                      • {getUserRole()}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
