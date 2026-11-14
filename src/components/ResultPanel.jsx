import PlayerAvatar from "@/components/PlayerAvatar";

const CONFETTI = [
  { left: "8%", color: "#FFD23F", size: 8, radius: "999px", delay: "0ms", drift: "-18px" },
  { left: "20%", color: "#EF6C4A", size: 10, radius: "2px", delay: "40ms", drift: "10px" },
  { left: "34%", color: "#5DADE2", size: 7, radius: "999px", delay: "80ms", drift: "-8px" },
  { left: "47%", color: "#3CC4BD", size: 9, radius: "2px", delay: "20ms", drift: "16px" },
  { left: "59%", color: "#FFE47A", size: 8, radius: "999px", delay: "90ms", drift: "-14px" },
  { left: "70%", color: "#A855A8", size: 10, radius: "2px", delay: "50ms", drift: "12px" },
  { left: "82%", color: "#FFD23F", size: 7, radius: "999px", delay: "10ms", drift: "-10px" },
  { left: "92%", color: "#EF6C4A", size: 9, radius: "2px", delay: "70ms", drift: "14px" },
];

export default function ResultPanel({
  total,
  finalTotal,
  discountValue,
  shippingValue,
  payerShares,
  error,
  emptyMessage,
  formatCurrency,
  onCopy,
  onShare,
  onRequestReset,
  onCancelReset,
  onConfirmReset,
  resetPending,
  status,
  showConfetti,
}) {
  const hasShares = payerShares.length > 0;
  const actionsDisabled = Boolean(error) || !hasShares;

  return (
    <section className="panel lg:sticky lg:top-6" aria-labelledby="result-title">
      <div className="total-hero">
        <p className="total-label">Total tagihan</p>
        <p className="total-number">{formatCurrency(finalTotal)}</p>

        <div className="mt-5 space-y-1.5 border-t border-white/15 pt-4">
          <div className="breakdown-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          {discountValue > 0 ? (
            <div className="breakdown-row">
              <span>Diskon</span>
              <strong>-{formatCurrency(discountValue)}</strong>
            </div>
          ) : null}
          {shippingValue > 0 ? (
            <div className="breakdown-row">
              <span>Biaya tambahan</span>
              <strong>{formatCurrency(shippingValue)}</strong>
            </div>
          ) : null}
        </div>

        {showConfetti ? (
          <div className="confetti-layer" aria-hidden="true">
            {CONFETTI.map((piece, index) => (
              <span
                key={index}
                className="confetti-piece"
                style={{
                  "--color": piece.color,
                  "--size": `${piece.size}px`,
                  "--radius": piece.radius,
                  "--delay": piece.delay,
                  "--drift": piece.drift,
                  left: piece.left,
                }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
        <h2 id="result-title" className="section-title">
          Hasil
        </h2>
        <span className="text-sm font-bold text-muted">
          {payerShares.length} pembayar
        </span>
      </div>
      <div className="dashed-divider mb-4 mt-2" />

      {error ? (
        <p role="alert" className="status status-error">
          {error}
        </p>
      ) : null}

      {!error && !hasShares ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : null}

      {!error && hasShares ? (
        <ul className="space-y-3">
          {payerShares.map((payer) => (
            <li key={payer.key} className="share-row">
              <div className="flex items-center gap-3">
                <PlayerAvatar name={payer.name} color={payer.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold text-ink">{payer.name}</p>
                  <p className="text-xs font-semibold text-muted">
                    {Math.round(payer.percent)}% dari total
                  </p>
                </div>
                <p className="shrink-0 font-extrabold text-teal-ink">
                  {formatCurrency(payer.amount)}
                </p>
              </div>
              <div
                className="progress-track mt-3"
                role="progressbar"
                aria-label={`Porsi ${payer.name}`}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(payer.percent)}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${payer.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={onCopy}
          disabled={actionsDisabled}
        >
          Salin rincian
        </button>
        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={onShare}
          disabled={actionsDisabled}
        >
          Bagikan rincian
        </button>

        {resetPending ? (
          <div className="rounded-md bg-coral/10 p-3">
            <p className="text-sm font-semibold text-error-ink">
              Hapus semua teman dan item?
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn btn-danger-ghost flex-1"
                onClick={onConfirmReset}
              >
                Ya, kosongkan
              </button>
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={onCancelReset}
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-ghost w-full"
            onClick={onRequestReset}
          >
            Kosongkan semua
          </button>
        )}

        <div role="status" aria-live="polite" className="min-h-[24px]">
          {status ? (
            <p
              className={`status ${
                status.type === "error" ? "status-error" : ""
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
