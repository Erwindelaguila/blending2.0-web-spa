"use client"

import { makeStyles } from "@fluentui/react-components"
import { COLORS } from "@/config/app.config.server"

export const useHeaderStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1.5rem",
    backgroundColor: COLORS.surface,
    borderBottom: "1px solid #e2e8f0",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  breadcrumb: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: COLORS.primary,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userGreeting: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  userName: {
    fontWeight: "500",
    fontSize: "14px",
    color: COLORS.text,
  },
  moduleIndicator: {
    fontSize: "12px",
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: "2px",
  },
  menuButton: {
    color: COLORS.primary,
  },
})
