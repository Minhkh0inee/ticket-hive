import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

type EventDetailErrorProps={
    detailError: string
}

const EventDetailError: React.FC<EventDetailErrorProps> = ({detailError}) => {
    const navigate = useNavigate()
    return (
            <div className="min-h-screen bg-[oklch(0.145_0_0)] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">{detailError}</p>
        <Button
            onClick={() => navigate('/events')}
            className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white rounded-xl"
        >
            ← Quay lại danh sách
        </Button>
        </div>
    )
}

export default EventDetailError