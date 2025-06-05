"use client"
export function AppSkeleton() {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <SidebarSkeleton />
      <MainContentSkeleton />
    </div>
  )
}

/**
 * Skeleton del sidebar lateral.
 */
function SidebarSkeleton() {
  return (
    <div className="w-[280px] bg-[#1e4a72] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded animate-pulse" />
          <div className="h-6 bg-white/20 rounded w-16 animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <NavigationItemSkeleton />
        <MenuGroupSkeleton />
        <MenuGroupSkeleton />
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
          <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton del contenido principal.
 */
function MainContentSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <HeaderSkeleton />
      <PageContentSkeleton />
    </div>
  )
}

/**
 * Skeleton del header superior.
 */
function HeaderSkeleton() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Skeleton del contenido de página.
 */
function PageContentSkeleton() {
  return (
    <div className="flex-1 bg-[#f8fafc] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <TitleSkeleton />
        <ContentCardSkeleton />
        <GridCardsSkeleton />
      </div>
    </div>
  )
}

/**
 * Skeleton de item de navegación simple.
 */
function NavigationItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded">
      <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
      <div className="h-4 bg-white/20 rounded w-20 animate-pulse" />
    </div>
  )
}

/**
 * Skeleton de grupo de menú con submenús.
 */
function MenuGroupSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 rounded">
        <div className="w-5 h-5 bg-white/20 rounded animate-pulse" />
        <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
        <div className="ml-auto w-4 h-4 bg-white/20 rounded animate-pulse" />
      </div>
      <div className="ml-8 space-y-2">
        <SubMenuItemSkeleton />
        <SubMenuItemSkeleton />
      </div>
    </div>
  )
}

/**
 * Skeleton de item de submenú.
 */
function SubMenuItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="w-4 h-4 bg-white/15 rounded animate-pulse" />
      <div className="h-3 bg-white/15 rounded w-28 animate-pulse" />
    </div>
  )
}

/**
 * Skeleton del título de página.
 */
function TitleSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-8 bg-white rounded w-64 animate-pulse" />
      <div className="h-4 bg-white rounded w-96 animate-pulse" />
    </div>
  )
}

/**
 * Skeleton de tarjeta de contenido principal.
 */
function ContentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="h-6 bg-gray-100 rounded w-48 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
      </div>
      <FormElementsSkeleton />
      <ButtonsSkeleton />
    </div>
  )
}

/**
 * Skeleton de elementos de formulario.
 */
function FormElementsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Skeleton de botones.
 */
function ButtonsSkeleton() {
  return (
    <div className="flex gap-3 mt-6">
      <div className="h-10 bg-blue-100 rounded w-24 animate-pulse" />
      <div className="h-10 bg-gray-100 rounded w-20 animate-pulse" />
    </div>
  )
}

/**
 * Skeleton de grid de tarjetas adicionales.
 */
function GridCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((card) => (
        <div key={card} className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="h-5 bg-gray-100 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
