'use client';

import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useUserMenu } from '@/hooks/use-user-menu';
import { PageLoader } from '@/components/ui/page-loader';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, login } = useAuth();
  const { userInfo, isLoading: menuLoading } = useUserMenu();
  const router = useRouter();
  const pathname = usePathname();
  
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [previousValidPath, setPreviousValidPath] = useState<string>('/');


  if (pathname === '/auth/callback') {
    return <>{children}</>;
  }


  const { isPublicRoute, allowedUrls } = useMemo(() => {
    const publicRoutes = ['/', '/dashboard'];
    const isPublic = publicRoutes.includes(pathname);
    
    let urls: string[] = [];
    if (userInfo?.enlaces && userInfo?.permisosUsuario) {
      urls = userInfo.permisosUsuario
        .map(permission => userInfo.enlaces?.[permission]?.url)
        .filter((url): url is string => url && url !== '#' && url !== null);
    }
    
    return { isPublicRoute: isPublic, allowedUrls: urls };
  }, [pathname, userInfo]);


  const checkAccess = useMemo(() => {
    if (isPublicRoute) return true;
    
    return allowedUrls.some(url => 
      url === pathname || pathname.startsWith(url + '/')
    );
  }, [isPublicRoute, allowedUrls, pathname]);

  useEffect(() => {
    if (isLoading || menuLoading) return;

    if (!user?.isAuthenticated) {
      login();
      return;
    }

    if (!userInfo?.enlaces || !userInfo?.permisosUsuario) {
      setHasAccess(null);
      return;
    }

    if (checkAccess) {
      setPreviousValidPath(pathname);
      setHasAccess(true);
    } else {
      setHasAccess(false);
      router.replace(previousValidPath);
    }
  }, [user, userInfo, isLoading, menuLoading, checkAccess, pathname, login, previousValidPath, router]);


  if (isLoading || menuLoading) {
    return <PageLoader isLoading text="Autenticando" />;
  }

  if (!user?.isAuthenticated) {
    return <PageLoader isLoading text="Iniciando autenticación" />;
  }

  if (hasAccess === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-gray-600">Acceso no permitido</p>
          <p className="text-sm text-gray-500">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (hasAccess === true) {
    return <>{children}</>;
  }

  return <PageLoader isLoading text="Verificando permisos" />;
}
