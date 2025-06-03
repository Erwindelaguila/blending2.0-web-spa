import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
const MODULE_ROUTES = {
  logistica: ["/modelos/contenedores", "/consultas/historico-contenedores"],
  calidad: ["/modelos/harina", "/consultas/historico-harina"],
  administrador: [
    "/mantenimientos/plantas",
    "/mantenimientos/calidades",
    "/mantenimientos/parametros",
    "/configuraciones/valores-calidad",
    "/configuraciones/aplicacion",
  ],
} as const

const PUBLIC_ROUTES = ["/", "/api", "/_next", "/favicon.ico", "/logo.png"] as const

const DEFAULT_ROUTES = {
  logistica: "/modelos/contenedores",
  calidad: "/modelos/harina",
  administrador: "/mantenimientos/plantas",
} as const

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

function getSelectedModule(request: NextRequest): string | null {
  return request.cookies.get("selectedModule")?.value || null
}

function hasRouteAccess(pathname: string, selectedModule: string): boolean {
  const moduleRoutes = MODULE_ROUTES[selectedModule as keyof typeof MODULE_ROUTES]
  if (!moduleRoutes) return false
  return moduleRoutes.some((route) => pathname.startsWith(route))
}

function getDefaultRoute(selectedModule: string): string {
  return DEFAULT_ROUTES[selectedModule as keyof typeof DEFAULT_ROUTES] || "/"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas izi
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const selectedModule = getSelectedModule(request)


  if (!selectedModule) {
    console.log(`🚫 Middleware: Sin módulo, redirigiendo a dashboard desde: ${pathname}`)
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }


  if (!hasRouteAccess(pathname, selectedModule)) {
    console.log(`🚫 Middleware: ${selectedModule} sin acceso a ${pathname}`)


    const defaultRoute = getDefaultRoute(selectedModule)
    const url = request.nextUrl.clone()
    url.pathname = defaultRoute

    console.log(`🔄 Middleware: Reescribiendo ${pathname} → ${defaultRoute}`)
    return NextResponse.rewrite(url)
  }

  console.log(`✅ Middleware: ${selectedModule} acceso permitido a ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
}
