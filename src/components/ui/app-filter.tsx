import {
  Button,
  Card,
  Divider,
  Input,
  Label,
} from "@fluentui/react-components";
import { Title } from "./title";
import { AppCombobox } from "./app-combobox";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrgColors } from "@/config/app.config.server";
import { Search24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";

export function Filter({
  title_filter = "Filtro",
  title_input = "Codigo",
  moreCamps = true,
  text_input = true,
  select=true,
  date_picker=true
}: {
  title_filter?: string;
  title_input?: string;
  moreCamps?: boolean;
  text_input?: boolean
  select?: boolean
  date_picker?:boolean

}) {
  const stylebtn = useButtonsStyles();
  const comboOptions = ["Cat", "Dog", "Ferret", "Fish", "Hamster", "Snake"];
  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full">
          <div className="w-full h-full">
            <div className="w-full h-1/5">
              <Title title={title_filter}></Title>
            </div>

            <div className="w-full flex h-4/5 justify-between">
            
              <div className="w-1/4 h-full pr-4 flex items-center ">
                <div className="flex flex-col justify-start w-full">
                  <Label>{title_input}</Label>
                  <Input
                    style={{
                      width: "100%",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                    }}
                  />
                </div>
              </div>

              <Divider vertical appearance="default"></Divider>

              {moreCamps == true ? (
                <>
                  <div className="w-3/4 h-full flex items-center pl-4">
                    <div className="w-1/2 flex gap-3 h-full items-center">
                      <AppCombobox
                        label="Estado"
                        labelRequired={false}
                        size="medium"
                        options={comboOptions}
                        value={""}
                        onChange={() => {}}
                        grayBorder={true}
                      />

                      <div className="flex flex-col">
                        <Label size="medium" htmlFor="Centro de Ubicación">
                          Fecha
                        </Label>
                        <DatePicker
                          size="medium"
                          style={{
                            border: ` 2px solid ${OrgColors.serotGris}`,
                          }}
                          placeholder="Elija una fecha"
                        />
                      </div>
                    </div>

                    <div className="w-1/2 flex justify-end items-center pt-3 h-full">
                      <Button
                        size="large"
                        icon={<Search24Regular></Search24Regular>}
                        className={`w-[13rem] ${stylebtn.buttonAzulOscuroBase} `}
                      >
                        Filtrar
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-1/2 flex justify-end items-center pt-3 h-full">
                  <Button
                    size="large"
                    icon={<Search24Regular></Search24Regular>}
                    className={`w-[13rem] ${stylebtn.buttonAzulOscuroBase} `}
                  >
                    Filtrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
