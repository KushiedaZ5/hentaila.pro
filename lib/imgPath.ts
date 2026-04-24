/**
 * Convierte rutas de la base de datos (assets/img/...) al formato de Next.js (/img/...).
 * Las imágenes en Next.js se sirven desde la carpeta `public/`.
 */
export function imgPath(dbPath: string | null | undefined): string {
  if (!dbPath) return '/img/portadas/placeholder.jpg'
  return '/' + dbPath.replace(/^assets\//, '')
}
