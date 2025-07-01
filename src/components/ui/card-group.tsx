import { ICardGroups, IGroup } from "@/interface";
import { useCardGroupsStyle } from "@/styles/cardgroup.styles";
import { Card, Divider, mergeClasses, Text } from "@fluentui/react-components";

export function CardGroup({
  group,
  selected,
  setSelect,
  readOnly = false,
}: ICardGroups) {
  const style = useCardGroupsStyle();
  const isSelected = selected.includes(group.grupo);

  const toggleSelection = () => {
    if (readOnly) return;
    setSelect((prevSelected) =>
      prevSelected.includes(group.grupo)
        ? prevSelected.filter((id) => id !== group.grupo)
        : [...prevSelected, group.grupo]
    );
  };

  return (
    <Card
      key={group.grupo}
      size="large"
      className={mergeClasses(
        style.cardBase,
        !readOnly && style.cardHoverable,
        isSelected && style.selectCardGrupo
      )}
      onClick={readOnly == true ? undefined : toggleSelection}
      style={{ cursor: !readOnly ? "pointer" : "default" }}
    >
      <div className="flex w-full h-full">
        <div className="w-1/7 flex flex-col gap-6">
          <Text>Grupo: {group.grupo}</Text>
          <span className="text-2xl font-semibold">{group.nombre}</span>
        </div>

        <Divider vertical className={style.divider} />
        <div className="w-6/7 h-full flex flex-col pl-2">
          <div className="w-full h-1/2 flex justify-around">
            <section className="flex flex-col items-center">
              <span>Toneladas</span>
              <span>{group.toneladas}</span>
            </section>
            <section className="flex flex-col items-center">
              <span>Valor Inicial</span>
              <span>{group.valorInicial}</span>
            </section>
            <section className="flex flex-col items-center">
              <span>Valor Final</span>
              <span>{group.valorFinal}</span>
            </section>
            <section className="flex flex-col items-center">
              <span>Valor Agregado</span>
              <span className="text-green-500">{group.valorAgregado}</span>
            </section>
            <section className="flex flex-col items-center">
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
