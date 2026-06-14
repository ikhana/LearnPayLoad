import type { Access } from 'payload'

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  if (!user) return false
  return Boolean((user.roles as string[])?.some((role) => ['admin', 'editor'].includes(role)))
}
