'use client'

import type { DefaultCellComponentProps, SelectFieldClient } from 'payload'

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#fef3c7', text: '#92400e' },
  published: { bg: '#d1fae5', text: '#065f46' },
}

export const StatusCell = ({ cellData }: DefaultCellComponentProps<SelectFieldClient>) => {
  const status = (cellData as string) || 'draft'
  const colors = statusColors[status] || statusColors.draft

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}
