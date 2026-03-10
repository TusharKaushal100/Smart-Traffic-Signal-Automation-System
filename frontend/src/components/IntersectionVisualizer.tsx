interface Props {
  signals: any[]
}

export const IntersectionVisualizer = ({ signals }: Props) => {

  const getSignal = (lane: string) => signals.find((s: any) => s.laneId === lane)

  const stateColor: Record<string, { glow: string; active: string; bg: string; text: string }> = {
    RED:    { glow: "shadow-[0_0_18px_4px_rgba(239,68,68,0.7)]",  active: "bg-red-500",    bg: "bg-red-950/40",    text: "text-red-400" },
    YELLOW: { glow: "shadow-[0_0_18px_4px_rgba(234,179,8,0.7)]",  active: "bg-yellow-400", bg: "bg-yellow-950/40", text: "text-yellow-300" },
    GREEN:  { glow: "shadow-[0_0_18px_4px_rgba(34,197,94,0.7)]",  active: "bg-green-500",  bg: "bg-green-950/40",  text: "text-green-400" },
  }

  const TrafficLight = ({ laneId, label }: { laneId: string; label: string }) => {
    const signal = getSignal(laneId)
    const state: string = signal?.currentState ?? "RED"
    const c = stateColor[state] ?? stateColor["RED"]
    const remaining: number = signal?.remainingTime ?? 0
    const isManual: boolean = signal?.manualOverride ?? false

    return (
      <div className="flex flex-col items-center gap-1">

        {/* Direction label */}
        <div className="text-xs font-bold tracking-widest uppercase text-slate-400">{label}</div>

        {/* Lane ID badge — NEW */}
        <div className="text-[10px] font-mono font-bold text-slate-300 bg-slate-700/60 px-2 py-0.5 rounded-full border border-slate-600/40">
          {laneId}
        </div>

        {/* Light housing */}
        <div className={`relative flex flex-col items-center gap-[6px] px-3 py-4 rounded-2xl border border-slate-600/50 ${c.bg} backdrop-blur-sm transition-all duration-500`}>
          {isManual && (
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none z-10">
              M
            </div>
          )}
          {(["RED", "YELLOW", "GREEN"] as const).map((s) => (
            <div
              key={s}
              className={`w-5 h-5 rounded-full transition-all duration-300 ${
                state === s
                  ? `${stateColor[s].active} ${stateColor[s].glow}`
                  : "bg-slate-700/60"
              }`}
            />
          ))}
        </div>

        {/* Countdown */}
        <div className={`text-xl font-black tabular-nums tracking-tight transition-colors duration-300 ${c.text}`}>
          {remaining}s
        </div>

        {/* State badge */}
        <div className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
          state === "RED"    ? "border-red-500/40 text-red-400 bg-red-500/10" :
          state === "YELLOW" ? "border-yellow-400/40 text-yellow-300 bg-yellow-400/10" :
                               "border-green-500/40 text-green-400 bg-green-500/10"
        }`}>
          {state}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center mt-6 px-4">
      <div
        className="relative rounded-3xl overflow-hidden border border-slate-700/60"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)",
          boxShadow: "0 0 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.4)"
        }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />
        <div className="absolute left-0 right-0" style={{ top: "50%", transform: "translateY(-50%)", height: 72 }}>
          <div className="w-full h-full bg-slate-700/60 border-y border-slate-600/30" />
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-slate-500/30" />
          </div>
        </div>
        <div className="absolute top-0 bottom-0" style={{ left: "50%", transform: "translateX(-50%)", width: 72 }}>
          <div className="w-full h-full bg-slate-700/60 border-x border-slate-600/30" />
          <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center">
            <div className="h-full border-l-2 border-dashed border-slate-500/30" />
          </div>
        </div>
        <div
          className="absolute rounded-sm border border-slate-500/20"
          style={{
            top: "50%", left: "50%", width: 72, height: 72,
            transform: "translate(-50%, -50%)",
            background: "rgba(30,41,59,0.9)",
            boxShadow: "0 0 30px rgba(0,0,0,0.5)"
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-2xl select-none">🚦</div>
        </div>

        <div className="absolute flex flex-col items-center" style={{ top: 16, left: "50%", transform: "translateX(-50%)" }}>
          <TrafficLight laneId="L1" label="N" />
        </div>
        <div className="absolute flex flex-col items-center" style={{ bottom: 16, left: "50%", transform: "translateX(-50%)" }}>
          <TrafficLight laneId="L3" label="S" />
        </div>
        <div className="absolute flex flex-col items-center" style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}>
          <TrafficLight laneId="L4" label="W" />
        </div>
        <div className="absolute flex flex-col items-center" style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}>
          <TrafficLight laneId="L2" label="E" />
        </div>
      </div>
    </div>
  )
}