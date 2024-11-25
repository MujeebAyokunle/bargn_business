import { ColorSchema } from '@/helper/colorScheme'
import React from 'react'
import { ClipLoader } from 'react-spinners'

function ActivityLoader() {
    return (
        <ClipLoader color={ColorSchema.white} size={18} />
    )
}

export default ActivityLoader