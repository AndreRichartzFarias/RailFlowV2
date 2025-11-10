// simple permissions helper for frontend
export const DEFAULT_ALLOWED_GROUPS = ['Gestores', 'Maquinistas']

export function userInGroups(user: any, allowedGroups: string[] = DEFAULT_ALLOWED_GROUPS) {
  if (!user) return false
  const groups = user.groups || user.group_names || user.groups_names || []
  if (!Array.isArray(groups)) return false
  return groups.some((g: any) => {
    if (!g) return false
    if (typeof g === 'string') return allowedGroups.includes(g)
    const name = g.name || g.title || g.slug || g.label || ''
    return allowedGroups.includes(name)
  })
}