"use client"

import { makeStyles } from "@fluentui/react-components"
import { COLORS, UI_CONFIG } from "@/config/app.config.server"


export const useSidebarStyles = makeStyles({
  sidebar: {
    display: "flex",
    flexDirection: "column",
    width: UI_CONFIG.sidebar.width,
    backgroundColor: COLORS.primary,
    color: "white",
    height: "100vh",
    transition: `width ${UI_CONFIG.sidebar.transitionDuration} ease`,
    overflow: "hidden",
  },
  sidebarCollapsed: {
    width: UI_CONFIG.sidebar.collapsedWidth,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "1rem",
  },
  logoIcon: {
    backgroundColor: "white",
    color: COLORS.primary,
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
    marginRight: "12px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflowY: "auto",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    color: "rgba(255, 255, 255, 0.85)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "white",
    },
  },
  menuItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "white",
    fontWeight: "600",
  },
  menuItemContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  menuIcon: {
    fontSize: "18px",
    minWidth: "20px",
  },
  menuText: {
    fontSize: "14px",
    fontWeight: "500",
  },
  submenu: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    maxHeight: "0",
    transition: "max-height 0.3s ease",
  },
  submenuOpen: {
    maxHeight: "500px",
  },
  submenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    color: "rgba(255, 255, 255, 0.75)",
    textDecoration: "none",
    gap: "12px",
    fontSize: "14px",
    transition: "all 0.2s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "rgba(255, 255, 255, 0.95)",
    },
  },
  submenuItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    fontWeight: "600",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "0",
      top: "0",
      bottom: "0",
      width: "3px",
      backgroundColor: "#60a5fa",
    },
  },
  submenuIcon: {
    fontSize: "16px",
    opacity: 0.8,
  },
  footer: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem",
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "rgba(255, 255, 255, 0.85)",
    width: "100%",
    justifyContent: "flex-start",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
    },
  },
})
