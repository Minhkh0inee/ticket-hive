import { useCountdown } from "@/hooks/useCountDown";
import { Lock } from "lucide-react";
import React from "react";

type CountDownProps = {
  lockExpiresAt: string;
};

const CountDown: React.FC<CountDownProps> = ({ lockExpiresAt }) => {
  const { display, isExpired } = useCountdown(lockExpiresAt);
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
        isExpired
          ? "bg-[oklch(0.18_0.05_25)] border-[oklch(0.35_0.1_25)] text-[oklch(0.7_0.1_25)]"
          : "bg-[oklch(0.17_0.04_250)] border-[oklch(0.3_0.08_250)] text-[oklch(0.7_0.15_250)]"
      }`}
    >
      <Lock size={15} className="shrink-0" />
      {isExpired ? (
        <span className="text-sm font-medium">
          Ghế đã hết thời gian giữ — đang chuyển hướng...
        </span>
      ) : (
        <span className="text-sm">
          Ghế được giữ trong{" "}
          <span className="font-bold tabular-nums">{display}</span>
        </span>
      )}
    </div>
  );
};

export default CountDown;
