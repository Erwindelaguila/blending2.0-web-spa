"use client";

import { OrgColors } from "@/config/app.config.server";
import { makeStyles, Text } from "@fluentui/react-components";
import React from "react";

export const useResultStyles = makeStyles({
  title: {
    fontSize: "1.5em",
    fontWeight: "600",
    textAlign: "left",
    alignSelf: "flex-start",
  },

  subtitle: {
    fontSize: "1em",
    color: "#272727",
    textAlign: "left",
    alignSelf: "flex-start",
  },
});

export function Title({
  title,
  subtitulo,
  color = OrgColors.celeste
}: {
  title: string;
  subtitulo?: string;
  color?: string
}) {
  const styles = useResultStyles();

  return (
    <div className="flex flex-col gap-2">
      <Text style={{color : `${color}`}} className={styles.title} >{title}</Text>
      {subtitulo && <Text className={styles.subtitle}>{subtitulo}</Text>}
    </div>
  );
}
