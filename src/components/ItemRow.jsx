export default function ItemRow({
  item,
  index,
  payers,
  payerColor,
  canRemove,
  formatCurrency,
  onChange,
  onRemove,
}) {
  const hasData = Boolean(item.name || item.price || item.payer);
  const incomplete = hasData && (!item.name || !item.price || !item.payer);

  return (
    <div
      className={`item-card ${incomplete ? "item-card--incomplete" : ""}`}
      style={{ "--accent": payerColor }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-teal-ink">Item {index + 1}</p>
        <button
          type="button"
          className="btn-remove"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          aria-label={`Hapus item ${index + 1}`}
        >
          Hapus
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <label htmlFor={`payer-${index}`} className="field-label">
            Pembayar
          </label>
          <select
            id={`payer-${index}`}
            className={`field ${incomplete && !item.payer ? "field-error" : ""}`}
            value={item.payer}
            onChange={(event) => onChange(index, "payer", event.target.value)}
            disabled={payers.length === 0}
            aria-invalid={incomplete && !item.payer}
          >
            <option value="">Pilih pembayar</option>
            {payers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`name-${index}`} className="field-label">
            Nama item
          </label>
          <input
            id={`name-${index}`}
            type="text"
            className={`field ${incomplete && !item.name ? "field-error" : ""}`}
            placeholder="Contoh: Nasi goreng"
            value={item.name}
            onChange={(event) => onChange(index, "name", event.target.value)}
            disabled={!item.payer}
            autoComplete="off"
            aria-invalid={incomplete && !item.name}
          />
        </div>

        <div>
          <label htmlFor={`price-${index}`} className="field-label">
            Harga
          </label>
          <input
            id={`price-${index}`}
            type="text"
            inputMode="numeric"
            className={`field ${incomplete && !item.price ? "field-error" : ""}`}
            placeholder="0"
            value={item.price ? formatCurrency(item.price) : ""}
            onChange={(event) => onChange(index, "price", event.target.value)}
            disabled={!item.payer}
            aria-invalid={incomplete && !item.price}
          />
        </div>
      </div>

      {!item.payer ? (
        <p className="mt-3 text-sm font-semibold text-coral-ink">
          Pilih pembayar dulu untuk mengisi item ini.
        </p>
      ) : null}
    </div>
  );
}
