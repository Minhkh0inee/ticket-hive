import { memo, useEffect, useMemo, useState, type ElementType } from "react";
import {
  Calendar,
  Crown,
  Music2,
  Layers,
  Users,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fmtDateRange, fmtPrice } from "@/lib/format";
import type { SeatSection } from "@/types/event.types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  fetchSeatsRequest,
  selectSeat,
  deselectSeat,
} from "@/stores/slices/seat.slice";

const SECTION_CONFIG: Record<
  SeatSection,
  {
    label: string;
    color: string;
    bg: string;
    Icon: ElementType;
  }
> = {
  vip: {
    label: "VIP",
    color: "oklch(0.75 0.18 85)",
    bg: "oklch(0.22 0.04 85)",
    Icon: Crown,
  },
  floor: {
    label: "Sàn",
    color: "oklch(0.6 0.2 250)",
    bg: "oklch(0.2 0.04 250)",
    Icon: Music2,
  },
  balcony: {
    label: "Ban công",
    color: "oklch(0.65 0.18 300)",
    bg: "oklch(0.2 0.04 300)",
    Icon: Layers,
  },
  general: {
    label: "Phổ thông",
    color: "oklch(0.6 0 0)",
    bg: "oklch(0.22 0 0)",
    Icon: Users,
  },
};

const MAX_SEATS = 4;

interface EventScheduleProps {
  eventDate: string;
  endDate?: string;
  eventId: string;
  basePrice: number;
}

export const EventSchedule = memo(function EventSchedule({
  eventDate,
  endDate,
  eventId,
  basePrice,
}: EventScheduleProps) {
  const dateText = useMemo(
    () => fmtDateRange(eventDate, endDate),
    [eventDate, endDate],
  );
  const dispatch = useAppDispatch();
  const { seats, selectedSeats, isLoading } = useAppSelector(
    (state) => state.seat,
  );

  const [selectedSection, setSelectedSection] = useState<SeatSection | null>(
    null,
  );

  useEffect(() => {
    if (eventId) dispatch(fetchSeatsRequest(eventId));
  }, [dispatch, eventId]);

  // Group seats by section
  const sectionSummaries = useMemo(() => {
    const grouped = seats.reduce(
      (acc, seat) => {
        if (!acc[seat.section]) acc[seat.section] = [];
        acc[seat.section].push(seat);
        return acc;
      },
      {} as Record<SeatSection, typeof seats>,
    );

    return (Object.entries(grouped) as [SeatSection, typeof seats][]).map(
      ([section, sectionSeats]) => ({
        section,
        total: sectionSeats.length,
        available: sectionSeats.filter(
          (s) => s.status === "available" && !s.isLocked,
        ).length,
        priceModifier: Number(sectionSeats[0]?.priceModifier ?? 1),
      }),
    );
  }, [seats]);

  // Seats of selected section grouped by row
  const sectionSeats = useMemo(() => {
    if (!selectedSection) return {};
    return seats
      .filter((s) => s.section === selectedSection)
      .reduce(
        (acc, seat) => {
          if (!acc[seat.row]) acc[seat.row] = [];
          acc[seat.row].push(seat);
          return acc;
        },
        {} as Record<string, typeof seats>,
      );
  }, [seats, selectedSection]);

  const totalPrice = useMemo(() => {
    if (!selectedSection) return 0;
    const modifier =
      sectionSummaries.find((s) => s.section === selectedSection)
        ?.priceModifier ?? 1;
    return basePrice * modifier * selectedSeats.length;
  }, [basePrice, selectedSection, selectedSeats, sectionSummaries]);

  function openSeatMap(section: SeatSection) {
    setSelectedSection(section);
  }

  function closeSeatMap() {
    setSelectedSection(null);
  }

  return (
    <>
      <section
        aria-labelledby="schedule-heading"
        className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6"
      >
        <h2
          id="schedule-heading"
          className="text-white font-bold text-base mb-4 flex items-center gap-2"
        >
          <span
            className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block"
            aria-hidden="true"
          />
          Lịch diễn
        </h2>

        {/* Date row */}
        <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-b border-[oklch(0.26_0_0)]">
          <div className="flex items-center gap-2 text-[oklch(0.65_0_0)] text-sm">
            <Calendar size={14} aria-hidden="true" />
            <time dateTime={eventDate}>{dateText}</time>
          </div>
        </div>

        {/* Section list */}
        <div className="mt-4">
          <p className="text-[oklch(0.55_0_0)] text-xs font-semibold uppercase tracking-wider mb-3">
            Khu vực
          </p>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ul className="space-y-0" role="list">
              {sectionSummaries.map(
                ({ section, available, total, priceModifier }) => {
                  const { Icon, label, color, bg } = SECTION_CONFIG[section];
                  const price = basePrice * Number(priceModifier);
                  const soldOut = available === 0;
                  console.log(basePrice);
                  console.log(priceModifier);

                  return (
                    <li
                      key={section}
                      className="flex items-center justify-between gap-3 py-3 border-b border-[oklch(0.23_0_0)] last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
                          style={{ color, backgroundColor: bg }}
                        >
                          <Icon size={10} aria-hidden="true" />
                          {label}
                        </span>
                        <p className="text-[oklch(0.5_0_0)] text-xs">
                          {soldOut
                            ? "Hết vé"
                            : `${available}/${total} ghế trống`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[oklch(0.6_0.2_250)] text-sm font-semibold whitespace-nowrap">
                          {fmtPrice(String(price))}
                        </span>
                        {soldOut ? (
                          <Badge
                            variant="secondary"
                            className="bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] border-0 text-xs"
                          >
                            Hết vé
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => openSeatMap(section)}
                            className="rounded-lg text-xs h-7 bg-[oklch(0.75_0.18_350)] hover:bg-[oklch(0.7_0.18_350)] text-white whitespace-nowrap"
                          >
                            Đặt vé
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                },
              )}
            </ul>
          )}
        </div>
      </section>

      {/* ── Seat map dialog ──────────────────────────────────────────────── */}
      {selectedSection &&
        (() => {
          const { Icon, label, color, bg } = SECTION_CONFIG[selectedSection];
          const modifier =
            sectionSummaries.find((s) => s.section === selectedSection)
              ?.priceModifier ?? 1;
          const price = basePrice * modifier;

          return (
            <Dialog
              open
              onOpenChange={(open) => {
                if (!open) closeSeatMap();
              }}
            >
              <DialogContent className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-lg rounded-2xl p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-5 pt-5 pb-4 pr-12 border-b border-[oklch(0.26_0_0)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"
                      style={{ color, backgroundColor: bg }}
                    >
                      <Icon size={10} aria-hidden="true" />
                      {label}
                    </span>
                    <DialogTitle className="text-white text-sm font-bold">
                      {fmtPrice(String(price))}
                      <span className="text-[oklch(0.5_0_0)] font-normal">
                        {" "}
                        / ghế
                      </span>
                    </DialogTitle>
                  </div>
                  <p className="text-[oklch(0.45_0_0)] text-xs mt-0.5">
                    Chọn tối đa {MAX_SEATS} ghế
                  </p>
                </DialogHeader>

                {/* Seat map */}
                <div className="px-5 pt-4 pb-3 overflow-y-auto max-h-[52vh]">
                  {/* Stage */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-2/3 h-6 rounded-t-full bg-[oklch(0.26_0_0)] flex items-center justify-center">
                      <span className="text-[oklch(0.5_0_0)] text-[10px] uppercase tracking-widest font-semibold">
                        Sân khấu
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col items-center">
                    {Object.entries(
                      seats.reduce(
                        (acc, seat) => {
                          if (!acc[seat.row]) acc[seat.row] = [];
                          acc[seat.row].push(seat);
                          return acc;
                        },
                        {} as Record<string, typeof seats>,
                      ),
                    )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([row, rowSeats]) => (
                        <div key={row} className="flex items-center gap-2">
                          <span className="w-4 text-[oklch(0.45_0_0)] text-[10px] font-bold shrink-0 text-center">
                            {row}
                          </span>
                          <div className="flex gap-1.5">
                            {rowSeats
                              .sort((a, b) => a.number - b.number)
                              .map((seat) => {
                                const isCurrentSection =
                                  seat.section === selectedSection;
                                const isBooked =
                                  seat.status === "booked" || seat.isLocked;
                                const isSelected = selectedSeats.includes(
                                  seat.id,
                                );
                                const isMaxed =
                                  !isSelected &&
                                  selectedSeats.length >= MAX_SEATS;
                                const isDisabledSection = !isCurrentSection;

                                return (
                                  <button
                                    key={seat.id}
                                    onClick={() => {
                                      if (isDisabledSection || isBooked) return;
                                      if (isSelected)
                                        dispatch(deselectSeat(seat.id));
                                      else dispatch(selectSeat(seat.id));
                                    }}
                                    disabled={
                                      isDisabledSection || isBooked || isMaxed
                                    }
                                    aria-label={
                                      isCurrentSection
                                        ? `Ghế ${seat.label}${isBooked ? " (đã đặt)" : isSelected ? " (đang chọn)" : ""}`
                                        : seat.section
                                    }
                                    aria-pressed={isSelected}
                                    className={[
                                      "w-7 h-7 rounded text-[10px] font-bold transition-all duration-150",
                                      isDisabledSection
                                        ? "bg-[oklch(0.16_0_0)] text-[oklch(0.16_0_0)] cursor-not-allowed"
                                        : isBooked
                                          ? "bg-[oklch(0.24_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed"
                                          : isSelected
                                            ? "text-white scale-105 shadow-lg"
                                            : isMaxed
                                              ? "bg-[oklch(0.22_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed"
                                              : "bg-[oklch(0.28_0_0)] text-[oklch(0.65_0_0)] hover:bg-[oklch(0.32_0_0)] hover:text-white cursor-pointer",
                                    ].join(" ")}
                                    style={
                                      isSelected
                                        ? { backgroundColor: color }
                                        : undefined
                                    }
                                  >
                                    {isCurrentSection ? seat.number : ""}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex items-center gap-4 justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-[oklch(0.28_0_0)]" />
                      <span className="text-[oklch(0.5_0_0)] text-[10px]">
                        Còn trống
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[oklch(0.5_0_0)] text-[10px]">
                        Đang chọn
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-[oklch(0.24_0_0)]" />
                      <span className="text-[oklch(0.5_0_0)] text-[10px]">
                        Đã đặt
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary + actions */}
                <div className="border-t border-[oklch(0.26_0_0)] px-5 py-4 space-y-3">
                  {/* Chosen seat chips */}
                  <div className="min-h-[28px] flex flex-wrap gap-1.5 items-center">
                    {selectedSeats.length === 0 ? (
                      <span className="text-[oklch(0.45_0_0)] text-xs">
                        Chưa chọn ghế nào
                      </span>
                    ) : (
                      selectedSeats.map((seatId) => {
                        const seat = seats.find((s) => s.id === seatId);
                        return seat ? (
                          <button
                            key={seatId}
                            onClick={() => dispatch(deselectSeat(seatId))}
                            aria-label={`Bỏ chọn ghế ${seat.label}`}
                            className="flex items-center gap-1 text-[10px] font-bold pl-2 pr-1 py-0.5 rounded-full transition-opacity hover:opacity-75"
                            style={{ backgroundColor: bg, color }}
                          >
                            {seat.label}
                            <X size={9} />
                          </button>
                        ) : null;
                      })
                    )}
                  </div>

                  {/* Price row + confirm */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[oklch(0.5_0_0)] text-[10px]">
                        {selectedSeats.length} ghế × {fmtPrice(String(price))}
                      </p>
                      <p className="text-white font-bold text-base tabular-nums leading-tight">
                        {selectedSeats.length > 0
                          ? fmtPrice(String(totalPrice))
                          : "—"}
                      </p>
                    </div>
                    <Button
                      disabled={selectedSeats.length === 0}
                      className="rounded-xl h-10 px-5 font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white gap-2 disabled:opacity-40"
                    >
                      <Ticket size={14} aria-hidden="true" />
                      Đặt{" "}
                      {selectedSeats.length > 0
                        ? `${selectedSeats.length} ghế`
                        : "vé"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}
    </>
  );
});
