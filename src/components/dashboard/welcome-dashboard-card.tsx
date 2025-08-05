"use client";
import { useAuth } from "@/providers/auth-provider";
import { Card } from "@fluentui/react-components";
import { PuzzleCube24Filled } from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WelcomeDashboardCard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 64 }}>
      <h1 style={{ fontSize: 36, fontWeight: "bold", marginBottom: 48 }}>
        ¡Bienvenido {user?.profile?.displayName || ""}!
      </h1>
      <Card
        style={{
          minWidth: 400,
          maxWidth: 500,
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
        onClick={() => router.push("/modelos/contenedores")}
      >
        <div style={{ height: 8, background: "#4caf1b" }} />
        <div style={{ padding: 32, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <PuzzleCube24Filled style={{ fontSize: 36 }} />
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5, textAlign: "left", lineHeight: 1.1 }}>
              Hogenización de<br />Contenedores
            </span>
          </div>
          <div style={{ fontSize: 18, color: "#222", marginTop: 24 }}>
            Distribución óptima de rumas.
          </div>
        </div>
      </Card>
    </div>
  );
}