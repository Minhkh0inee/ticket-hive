import React from 'react'
import { Button } from '../ui/button'

type ExpireModalProps = {
    showModal: boolean
    handleBack: () => void
}

const ExpireModal: React.FC<ExpireModalProps> = ({handleBack, showModal}) => {
  return showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h2 className="text-white font-semibold text-lg">Ghế đã hết thời gian giữ</h2>
            <p className="text-[oklch(0.55_0_0)] text-sm">
              Thời gian giữ ghế đã hết. Vui lòng quay lại và chọn ghế mới.
            </p>
            <Button  onClick={handleBack} className="w-full h-10 bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)]">
              Chọn lại ghế
            </Button>
          </div>
        </div>
  )
}

export default ExpireModal