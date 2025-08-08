"use client";
import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserMenu } from '@/hooks/use-user-menu';
import { Card } from "@fluentui/react-components";
import { useRouter } from "next/navigation";
import { ICON_MAP } from "@/utils/icon-mapping";

interface EnlaceItem {
  title?: string;
  description?: string;
  url?: string;
  icon?: string;
  color?: string;
  grupo?: string;
}

interface EnlaceCardComponentProps {
  enlace: EnlaceItem & { id: string };
  onClick: () => void;
}

export function WelcomeDashboardCard() {
  const { user } = useAuth();
  const { userInfo } = useUserMenu();
  const router = useRouter();

  const availableCards = useMemo(() => {
    if (!userInfo?.enlaces || !userInfo?.permisosUsuario) return [];
    
    const { enlaces, permisosUsuario } = userInfo;
    
    return permisosUsuario
      .filter(enlaceId => enlaceId.startsWith('card-'))
      .map(enlaceId => {
        const enlace = enlaces[enlaceId];
        if (!enlace) return null;
        
        return {
          id: enlaceId,
          ...enlace
        };
      })
      .filter((enlace): enlace is (EnlaceItem & { id: string }) => enlace !== null);
  }, [userInfo]);

  const handleCardClick = (url: string) => {
    router.push(url || "/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 64 }}>
      <h1 style={{ fontSize: 36, fontWeight: "bold", marginBottom: 48 }}>
        ¡Bienvenido {user?.displayName || ""}!
      </h1>
      
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 24, 
        justifyContent: "center",
        maxWidth: 1200 
      }}>
        {availableCards.map((enlace) => (
          <EnlaceCardComponent 
            key={enlace.id}
            enlace={enlace}
            onClick={() => handleCardClick(enlace.url || "/")}
          />
        ))}
      </div>
      
      {availableCards.length === 0 && (
        <div style={{ 
          fontSize: 18, 
          color: "#666", 
          textAlign: "center",
          marginTop: 32 
        }}>
          No tienes acceso a ningún módulo. Contacta al administrador.
        </div>
      )}
    </div>
  );
}

function EnlaceCardComponent({ enlace, onClick }: EnlaceCardComponentProps) {
  const [hovered, setHovered] = useState(false);
  
  const IconComponent = enlace.icon && ICON_MAP[enlace.icon] ? ICON_MAP[enlace.icon] : null;

  return (
    <Card
      style={{
        minWidth: 380,
        maxWidth: 380,
        borderRadius: 8,
        border: "1.5px solid #bdbdbd",
        boxShadow: hovered ? "0 4px 24px #0002" : "0 2px 8px #0001",
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: "box-shadow 0.2s, transform 0.2s"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ height: 8, background: enlace.color || "#2196F3" }} />
      
      <div style={{ padding: 32, textAlign: "center" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 16, 
          marginBottom: 16 
        }}>
          {IconComponent && (
            <div style={{ color: enlace.color || "#2196F3" }}>
              <IconComponent fontSize={36} />
            </div>
          )}
          
          <span style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            letterSpacing: 0.5, 
            textAlign: "left", 
            lineHeight: 1.1,
            whiteSpace: "pre-line" 
          }}>
            {enlace.title || "Sin título"}
          </span>
        </div>
        
        <div style={{ fontSize: 18, color: "#222", marginTop: 24 }}>
          {enlace.description || "Sin descripción"}
        </div>
      </div>
    </Card>
  );
}