"use client"

import { makeStyles } from "@fluentui/react-components"
import { COLORS } from "@/config/app.config.server"

export const useDashboardStyles = makeStyles({
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  welcomeTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "0.5rem",
    color: COLORS.text,
    lineHeight: "1.2",
  },
  welcomeSubtitle: {
    fontSize: "1.125rem",
    textAlign: "center",
    marginBottom: "3rem",
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    },
  },
  cardContent: {
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  iconContainer: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: "0.875rem",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: "1.5",
  },
})
