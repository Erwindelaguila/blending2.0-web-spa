import { OrgColors } from "@/config/app.config.server";
import { IGroup } from "@/interface";
import {
  Card,
  Divider,
  makeStyles,
  mergeClasses,
  Text,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  cardBase: {
    padding: "1rem",
    width: "100%",
    height: "8rem",
    borderRadius: "0rem",
    border: "0.1rem solid #eee",
    borderLeft: "0.7rem solid #808080",
    boxShadow: "none",
    // Ya no va el ":hover" aquí
  },

  cardHoverable: {
    ":hover": {
      backgroundColor: "#fff",
    },
  },

  selectCardGrupo: {
    backgroundColor: "#fdfff8",
    borderLeftColor: OrgColors.verde,
    boxShadow: "0 3.2px 7.2px rgba(0,0,0,0.16), 0 0.7px 2.1px rgba(0,0,0,0.14)",
  },

  divider: {
    width: "0.2rem",
    backgroundColor: "#ccc",
  },

  dividerHorizontal: {
    height: "0.1rem",
    backgroundColor: "#ccc",
  },
});

export function CardGroup({
  group,
  selected,
  setSelect,
  readOnly = false,
}: {
  group: IGroup;
  selected: number | null;
  setSelect: React.Dispatch<React.SetStateAction<number | null>>;
  readOnly?: boolean;
}) {
  const style = useStyles();
  const isSelected = selected === group.grupo;
  return (
    <Card
      key={group.grupo}
      size="large"
      className={mergeClasses(
        style.cardBase,
        !readOnly && style.cardHoverable, 
        isSelected && style.selectCardGrupo
      )}
      onClick={!readOnly ? () => setSelect(group.grupo) : undefined} 
      style={{ cursor: !readOnly ? "pointer" : "default" }}
    >
      <div className="flex w-full h-full">
        <div className="w-1/7  flex flex-col gap-6">
          <Text>Grupo: {group.grupo}</Text>
          <span className="text-2xl font-semibold">{group.nombre}</span>
        </div>

        <Divider vertical className={style.divider} />
        <div className="w-6/7 h-full flex flex-col pl-2">
          <div className="w-full h-1/2  flex justify-around">
            <section className="flex  flex-col items-center">
              <span>Toneladas</span>
              <span>{group.toneladas}</span>
            </section>
            <section className="flex  flex-col items-center">
              <span>Valor Inicial</span>
              <span>{group.valorInicial}</span>
            </section>
            <section className="flex  flex-col items-center">
              <span>Valor Final</span>
              <span>{group.valorFinal}</span>
            </section>
            <section className="flex  flex-col items-center">
              <span>Valor Agregado</span>
              <span className="text-green-500">{group.valorAgregado}</span>
            </section>
            <section className="flex  flex-col items-center">
              <span>Costo total</span>
              <span>{group.costoTotal}</span>
            </section>
          </div>
          <Divider className={style.dividerHorizontal} />

          <div className="w-full h-1/2 flex justify-around items-center">
            {group.calidadesUtil.map((e) => (
              <div key={e}>{e}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
