"use client";

import { OrgColors } from "@/config/app.config.server";
import { IDrawerBase } from "@/interface";
import { useButtonsStyles } from "@/styles/button.styles";
import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Button,
  useRestoreFocusSource,
  useRestoreFocusTarget,
  DrawerFooter,
  Divider,
} from "@fluentui/react-components";
import {
  Checkmark24Regular,
  Dismiss24Regular,
  PresenceBlocked20Regular,
} from "@fluentui/react-icons";

export const DrawerBase = ({
  isOpen,
  setIsOpen,
  title,
  children,
  buttonAction,
  buttonText = "Aceptar",
  zise = "medium",
  position = "start",
  BtnAccion = true,
}: IDrawerBase) => {
  const style = useButtonsStyles();
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const restoreFocusSourceAttributes = useRestoreFocusSource();

  return (
    <div>
      <OverlayDrawer
        as="aside"
        size={zise}
        position={position}
        {...restoreFocusSourceAttributes}
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsOpen(false)}
              />
            }
          >
            <span
              style={{ color: OrgColors.celeste }}
              className="font-semibold"
            >
              {title}
            </span>
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <>{children}</>
        </DrawerBody>

        {BtnAccion && (
          <>
            <DrawerFooter className=" flex flex-col">
              <Divider
                style={{
                  height: "0.2rem", // Grosor
                  backgroundColor: "#ccc", // Color opcional
                }}
              ></Divider>

              <div className="flex  gap-3 w-full pt-3">
                <Button
                  {...restoreFocusTargetAttributes}
                  size="large"
                  icon={<Checkmark24Regular></Checkmark24Regular>}
                  className={style.buttonCelesteBase}
                  onClick={buttonAction}
                >
                  {buttonText}
                </Button>
                <Button
                  {...restoreFocusTargetAttributes}
                  size="large"
                  className={style.buttonGrisBase}
                  icon={<PresenceBlocked20Regular></PresenceBlocked20Regular>}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </OverlayDrawer>
    </div>
  );
};
