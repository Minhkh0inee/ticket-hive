import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Button } from "../ui/button";
import { fmtPrice } from "@/lib/format";
import { createBookingRequest } from "@/stores/slices/booking.slice";
import type { Event } from "@/types/event.types";
import { useBookingSummary } from "@/hooks/useBookingSummary";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/^0[0-9]{9,10}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;


type PaymentFormProps = {
    isExpired: boolean,
    isCreating: boolean, 
    createError: string | null,  
    currentEvent: Event | null, 
    selectedSeats: string[],
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    isExpired, 
    isCreating, 
    createError, 
    currentEvent, 
    selectedSeats
}) => {
    const dispatch = useAppDispatch()
    const {total} = useBookingSummary()
    
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: "onChange",
    });
    
    const canPay = !isExpired && isValid

    function onSubmit(data: CheckoutFormData) {
        if (isExpired || isCreating || !currentEvent) return;
        dispatch(
        createBookingRequest({
            eventId: currentEvent.id,
            seatIds: selectedSeats,
            attendeeName: data.fullName,
            attendeeEmail: data.email,
            attendeePhone: data.phone,
        }),
        );
    }
    return (
        <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white">
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard size={16} className="text-[oklch(0.6_0.2_250)]" />
            Thông tin thanh toán
            </CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <Label
                    htmlFor="fullName"
                    className="text-[oklch(0.7_0_0)] text-xs"
                >
                    Họ và tên
              </Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                {...register("fullName")}
                className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
              />
              {errors.fullName && (
                <p className="text-[oklch(0.7_0.15_25)] text-xs">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[oklch(0.7_0_0)] text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
                className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
              />
              {errors.email && (
                <p className="text-[oklch(0.7_0.15_25)] text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[oklch(0.7_0_0)] text-xs">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912345678"
              inputMode="tel"
              {...register("phone")}
              className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
            />
            {errors.phone && (
              <p className="text-[oklch(0.7_0.15_25)] text-xs">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-[oklch(0.7_0_0)] text-xs">Số thẻ</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={form.cardNumber}
                      onChange={handleCardNumber}
                      inputMode="numeric"
                      className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10 font-mono tracking-widest"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-[oklch(0.7_0_0)] text-xs">Hạn thẻ (MM/YY)</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={handleExpiry}
                        inputMode="numeric"
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-[oklch(0.7_0_0)] text-xs">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="•••"
                        value={form.cvv}
                        onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        inputMode="numeric"
                        type="password"
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                    </div>
                  </div> */}

          {createError && (
            <p className="text-[oklch(0.7_0.15_25)] text-xs">{createError}</p>
          )}

          <Button
            type="submit"
            disabled={!canPay || isCreating || isExpired}
            className="w-full h-11 rounded-xl font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white disabled:opacity-40 gap-2 mt-2"
          >
            {isCreating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Đang xử lý...
              </>
            ) : isExpired ? (
              "Ghế đã hết hạn"
            ) : (
              <>
                <CreditCard size={15} />
                Thanh toán {total > 0 ? fmtPrice(String(total)) : ""}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
