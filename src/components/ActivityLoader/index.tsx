import { ColorSchema } from '@/helper/colorScheme'
import React from 'react'
import { ClipLoader } from 'react-spinners'

function ActivityLoader({ color = null }: { color?: string | null }) {
    return (
        <ClipLoader color={color || ColorSchema.white} size={18} />
    )
}

export default ActivityLoader