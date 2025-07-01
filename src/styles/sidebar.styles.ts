"use client";

import { makeStyles } from "@fluentui/react-components";

export const useSidebarStyles = makeStyles({
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    color: "rgba(255, 255, 255, 0.85)",
    cursor: "pointer",
    textDecoration: "none",
    marginBottom: "4px",
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

  submenuOpen: {
    maxHeight: "500px",
  },

  submenuClose: {
    display: "none",
  },

  submenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    color: "rgba(255, 255, 255, 0.75)",
    textDecoration: "none",
    gap: "12px",
    fontSize: "0.9rem",
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
    borderLeft: "0.35rem solid #60a5fa",
  },

  submenuItemActiveCollapsed: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    fontWeight: "600",
    position: "relative",
    borderBottom: "0.35rem solid #60a5fa",
  },

  submenuIcon: {
    opacity: 0.8,
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    color: "rgba(255, 255, 255, 0.85)",
    width: "100%",
    justifyContent: "flex-start",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
    },
  },
});
