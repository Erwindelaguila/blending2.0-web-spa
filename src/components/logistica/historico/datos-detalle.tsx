"use client"
import { Button } from "@fluentui/react-components"
import { Dismiss24Regular } from "@fluentui/react-icons"

interface DatosDetalleProps {
  data: {
    nombreArchivo: string
    contrato: string
    paisDestino: string
    lugarDestino: string
    pesoContenedor: string
    cantidadSacos: string
    contenedores: Array<{
      cantidad: number
      capacidad: number
    }>
    combinacionPermitida: string
    cantidadSacosPermitida: string
    parametrosElegidos: string[]
    divisionRutas: Array<{
      ruma: string
      division: string
    }>
  }
}

export function DatosDetalle({ data }: DatosDetalleProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4 bg-white">
      {/* Header */}
      <div className="pb-3" style={{ borderBottom: "1px solid #90a955" }}>
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-gray-700">Nombre archivo:</span>
          <span className="text-blue-600">{data.nombreArchivo}</span>
        </div>
        <div className="flex gap-8 text-sm text-gray-700">
          <div>
            <span>Contrato: </span>
            <span className="font-medium">{data.contrato}</span>
          </div>
          <div>
            <span>Cantidad de Sacos: </span>
            <span className="font-medium">{data.cantidadSacos}</span>
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="border rounded" style={{ borderColor: "#90a955" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#9ca3af" }}>
              <th
                className="px-3 py-1 text-left text-white font-medium text-sm"
                style={{ borderRight: "1px solid #90a955" }}
              >
                Contrato
              </th>
              <th
                className="px-3 py-1 text-left text-white font-medium text-sm"
                style={{ borderRight: "1px solid #90a955" }}
              >
                País destino
              </th>
              <th
                className="px-3 py-1 text-left text-white font-medium text-sm"
                style={{ borderRight: "1px solid #90a955" }}
              >
                Lugar destino
              </th>
              <th className="px-3 py-1 text-left text-white font-medium text-sm">Peso contenedor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white" style={{ borderBottom: "1px solid #90a955" }}>
              <td className="px-3 py-2 text-gray-800 text-sm" style={{ borderRight: "1px solid #90a955" }}>
                {data.contrato}
              </td>
              <td className="px-3 py-2 text-gray-800 text-sm" style={{ borderRight: "1px solid #90a955" }}>
                {data.paisDestino}
              </td>
              <td className="px-3 py-2 text-gray-800 text-sm" style={{ borderRight: "1px solid #90a955" }}>
                {data.lugarDestino}
              </td>
              <td className="px-3 py-2 text-gray-800 text-right text-sm">{data.pesoContenedor}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Contenedores y información adicional */}
      <div className="flex gap-6">
        {/* Tabla de contenedores - más compacta */}
        <div className="flex-shrink-0" style={{ width: "280px" }}>
          <table className="w-full border" style={{ borderColor: "#90a955" }}>
            <thead>
              <tr style={{ backgroundColor: "#9ca3af" }}>
                <th className="px-2 py-1 text-white font-medium text-xs" style={{ borderRight: "1px solid #90a955" }}>
                  Cantidad de contenedores
                </th>
                <th className="px-2 py-1 text-white font-medium text-xs">Capacidad de contenedores</th>
              </tr>
            </thead>
            <tbody>
              {data.contenedores.map((contenedor, index) => (
                <tr
                  key={index}
                  className="bg-white"
                  style={{ borderBottom: index < data.contenedores.length - 1 ? "1px solid #90a955" : "none" }}
                >
                  <td
                    className="px-2 py-1 text-center text-gray-800 text-sm"
                    style={{ borderRight: "1px solid #90a955" }}
                  >
                    {contenedor.cantidad}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-800 text-sm">{contenedor.capacidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Información adicional */}
        <div className="flex-1 space-y-3">
          <div className="bg-green-100 border border-green-300 p-3 rounded text-sm text-gray-800">
            {data.combinacionPermitida}
          </div>
          <div className="bg-blue-100 border border-blue-300 p-3 rounded text-sm text-gray-800">
            {data.cantidadSacosPermitida}
          </div>
          <div className="bg-green-100 border border-green-300 p-3 rounded text-sm text-gray-800">
            Se puede distribuir los contenedores
          </div>
        </div>
      </div>

      {/* Parámetros elegidos - solo lectura */}
      <div>
        <div className="text-sm font-medium mb-3 text-gray-700">Parámetros elegidos:</div>
        <div className="flex gap-2 flex-wrap">
          {data.parametrosElegidos.map((param, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-300 rounded px-3 py-1 flex items-center gap-2 text-sm"
            >
              <span className="text-gray-800">{param}</span>
              <Button
                size="small"
                appearance="subtle"
                icon={<Dismiss24Regular />}
                disabled
                className="w-4 h-4 p-0 text-gray-400 cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* División de runas - tabla más ancha */}
      <div>
        <div className="text-sm font-medium mb-3 text-gray-700">División de runas</div>
        <div className="w-full max-w-lg">
          <table className="w-full border" style={{ borderColor: "#90a955" }}>
            <thead>
              <tr style={{ backgroundColor: "#9ca3af" }}>
                <th
                  className="px-3 py-1 text-left text-white font-medium text-sm"
                  style={{ borderRight: "1px solid #90a955" }}
                >
                  Ruma
                </th>
                <th className="px-3 py-1 text-left text-white font-medium text-sm">División</th>
              </tr>
            </thead>
            <tbody>
              {data.divisionRutas.map((ruta, index) => (
                <tr
                  key={index}
                  className="bg-white"
                  style={{ borderBottom: index < data.divisionRutas.length - 1 ? "1px solid #90a955" : "none" }}
                >
                  <td className="px-3 py-2 text-gray-800 text-sm" style={{ borderRight: "1px solid #90a955" }}>
                    {ruta.ruma}
                  </td>
                  <td className="px-3 py-2 text-gray-800 text-right text-sm">{ruta.division}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
