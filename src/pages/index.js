import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import BrandMark from "@/components/BrandMark";
import ItemRow from "@/components/ItemRow";
import Panel from "@/components/Panel";
import PlayerAvatar from "@/components/PlayerAvatar";
import ResultPanel from "@/components/ResultPanel";
import { getPlayerColor } from "@/lib/playerColors";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const onlyNumber = (value) => String(value ?? "").replace(/[^\d]/g, "");

const formatCurrency = (value) =>
  currencyFormatter.format(Math.round(Number(value) || 0));

function SplitBill() {
  const [items, setItems] = useState([{ name: "", price: "", payer: "" }]);
  const [payersList, setPayersList] = useState([]);
  const [newPayer, setNewPayer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [shipping, setShipping] = useState(0);
  const [status, setStatus] = useState(null);
  const [resetPending, setResetPending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    };
  }, []);

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discountValue = !discountType
    ? 0
    : discountType === "percent"
      ? total * (Number(discount) / 100)
      : Number(discount) || 0;
  const shippingValue = Number(shipping) || 0;
  const finalTotal = Math.max(0, total - discountValue + shippingValue);

  const payments = {};
  items.forEach((item) => {
    if (item.payer) {
      const key = item.payer.trim().toLowerCase();
      payments[key] = (payments[key] || 0) + Number(item.price || 0);
    }
  });

  const activePayers = payersList
    .map((name, index) => ({
      key: name.trim().toLowerCase(),
      name: name.trim(),
      color: getPlayerColor(index),
    }))
    .filter((payer) =>
      Object.prototype.hasOwnProperty.call(payments, payer.key)
    );

  const shippingPerPayer =
    activePayers.length > 0 ? shippingValue / activePayers.length : 0;
  const distributable = Math.max(0, finalTotal - shippingValue);

  const payerShares = activePayers.map((payer) => {
    const base = total > 0 ? (payments[payer.key] / total) * distributable : 0;
    const amount = base + shippingPerPayer;
    const percent =
      finalTotal > 0
        ? Math.min(100, Math.max(0, (amount / finalTotal) * 100))
        : 0;

    return { ...payer, amount, percent };
  });

  const hasIncompleteItem = items.some((item) => {
    const hasData = Boolean(item.name.trim() || item.price || item.payer);
    return hasData && (!item.name.trim() || !item.payer || !item.price);
  });
  const validationError = hasIncompleteItem
    ? "Lengkapi nama item, harga, dan pembayar."
    : "";

  const emptyMessage =
    payersList.length === 0
      ? "Tambahkan teman dulu, lalu isi item dan pembayar."
      : "Isi minimal satu item dan pilih pembayar.";

  const trimmedNewPayer = newPayer.trim();
  const isDuplicatePayer =
    trimmedNewPayer.length > 0 &&
    payersList.some(
      (name) => name.toLowerCase() === trimmedNewPayer.toLowerCase()
    );

  const payerColorMap = new Map(
    payersList.map((name, index) => [name, getPlayerColor(index)])
  );

  const discountDisplay = !discountType
    ? ""
    : discountType === "percent"
      ? discount
      : discount
        ? formatCurrency(discount)
        : "";

  const addPayer = () => {
    if (!trimmedNewPayer) return;

    if (isDuplicatePayer) {
      setStatus({ type: "error", message: "Nama itu sudah ada di daftar." });
      return;
    }

    setPayersList((current) => [...current, trimmedNewPayer]);
    setNewPayer("");
    setStatus(null);
  };

  const removePayer = (name) => {
    setPayersList((current) => current.filter((payer) => payer !== name));
    setItems((current) =>
      current.map((item) =>
        item.payer === name ? { ...item, payer: "" } : item
      )
    );
    setStatus(null);
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { name: "", price: "", payer: "" },
    ]);
  };

  const removeItem = (index) => {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateItem = (index, key, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [key]: key === "price" ? onlyNumber(value) : value }
          : item
      )
    );
    setStatus(null);
  };

  const handleNewPayerChange = (value) => {
    setNewPayer(value);
    if (status) setStatus(null);
  };

  const getExportText = () => {
    const lines = [
      "Hasil Split Bill",
      "",
      `Total: ${formatCurrency(finalTotal)}`,
    ];

    if (discountValue > 0) {
      lines.push(
        `Diskon: ${
          discountType === "percent"
            ? `${discount}%`
            : formatCurrency(discountValue)
        }`
      );
    }

    if (shippingValue > 0) {
      lines.push(`Biaya tambahan: ${formatCurrency(shippingValue)}`);
    }

    lines.push("", "Pembagian:");
    payerShares.forEach((payer) => {
      lines.push(`- ${payer.name}: ${formatCurrency(payer.amount)}`);
    });

    return lines.join("\n");
  };

  const handleCopy = async () => {
    if (validationError || payerShares.length === 0) return;

    const text = getExportText();

    try {
      if (!navigator.clipboard?.writeText) {
        window.prompt("Salin rincian berikut:", text);
        return;
      }

      await navigator.clipboard.writeText(text);
      setStatus({ type: "success", message: "Rincian disalin." });
      setShowConfetti(true);

      if (confettiTimer.current) clearTimeout(confettiTimer.current);
      confettiTimer.current = setTimeout(() => setShowConfetti(false), 1000);
    } catch {
      setStatus({ type: "error", message: "Gagal menyalin. Coba lagi." });
    }
  };

  const handleShare = async () => {
    if (validationError || payerShares.length === 0) return;

    if (!navigator.share) {
      setStatus({
        type: "error",
        message: "Browser ini belum mendukung bagikan. Salin rincian saja.",
      });
      return;
    }

    try {
      await navigator.share({
        title: "Hasil Split Bill",
        text: getExportText(),
      });
      setStatus({ type: "success", message: "Rincian dibagikan." });
    } catch (error) {
      if (error?.name === "AbortError") return;
      setStatus({
        type: "error",
        message: "Gagal membagikan. Coba salin rincian.",
      });
    }
  };

  const requestReset = () => {
    setResetPending(true);
    setStatus(null);
  };

  const cancelReset = () => {
    setResetPending(false);
  };

  const confirmReset = () => {
    setItems([{ name: "", price: "", payer: "" }]);
    setPayersList([]);
    setNewPayer("");
    setDiscount(0);
    setDiscountType("");
    setShipping(0);
    setResetPending(false);
    setShowConfetti(false);
    setStatus({ type: "success", message: "Data dikosongkan." });
  };

  return (
    <>
      <Head>
        <title>Split Bill: Bagi Tagihan, Ongkir, dan Diskon</title>
        <meta
          name="description"
          content="Bagi item, ongkir, dan diskon ke tiap orang. Hasilnya bisa disalin atau dibagikan."
        />
        <meta
          property="og:title"
          content="Split Bill: Bagi Tagihan, Ongkir, dan Diskon"
        />
        <meta
          property="og:description"
          content="Bagi item, ongkir, dan diskon ke tiap orang. Hasilnya bisa disalin atau dibagikan."
        />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page-shell">
        <BrandMark />

        <main className="tool-grid">
          <div className="flex flex-col gap-5">
            <Panel
              step="01"
              title="Pembayar"
              description="Tambahkan teman yang ikut patungan."
            >
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div>
                  <label htmlFor="new-payer" className="field-label">
                    Nama teman
                  </label>
                  <input
                    id="new-payer"
                    type="text"
                    className="field"
                    placeholder="Tulis nama teman"
                    value={newPayer}
                    onChange={(event) =>
                      handleNewPayerChange(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addPayer();
                      }
                    }}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={addPayer}
                  disabled={!trimmedNewPayer || isDuplicatePayer}
                >
                  Tambah teman
                </button>
              </div>

              {isDuplicatePayer ? (
                <p className="mt-2 text-sm font-semibold text-coral-ink">
                  Nama itu sudah ada.
                </p>
              ) : null}

              <div className="mt-4">
                {payersList.length === 0 ? (
                  <p className="empty-inline">
                    Belum ada teman. Tambahkan satu nama untuk mulai.
                  </p>
                ) : (
                  <ul
                    className="flex flex-wrap gap-2"
                    aria-label="Daftar pembayar"
                  >
                    {payersList.map((name, index) => (
                      <li key={name}>
                        <span className="player-chip">
                          <PlayerAvatar
                            name={name}
                            color={getPlayerColor(index)}
                          />
                          <span className="max-w-[12rem] truncate font-bold text-ink">
                            {name}
                          </span>
                          <button
                            type="button"
                            className="chip-remove"
                            onClick={() => removePayer(name)}
                            aria-label={`Hapus ${name}`}
                          >
                            ×
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Panel>

            <Panel
              step="02"
              title="Item"
              description="Pilih pembayar tiap item. Ongkir dibagi rata ke pembayar yang punya item."
            >
              {payersList.length === 0 ? (
                <p className="mb-4 rounded-md bg-gold/15 px-3 py-2 text-sm font-semibold text-ink">
                  Tambahkan teman dulu supaya item bisa diberi pembayar.
                </p>
              ) : null}

              <div className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <ItemRow
                    key={index}
                    item={item}
                    index={index}
                    payers={payersList}
                    payerColor={
                      item.payer
                        ? payerColorMap.get(item.payer)
                        : "#FFD23F"
                    }
                    canRemove={items.length > 1}
                    formatCurrency={formatCurrency}
                    onChange={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <button
                type="button"
                className="btn btn-secondary mt-4 w-full sm:w-auto"
                onClick={addItem}
              >
                Tambah item
              </button>

              {validationError ? (
                <p role="alert" className="status status-error mt-3">
                  {validationError}
                </p>
              ) : null}
            </Panel>

            <Panel
              step="03"
              title="Diskon dan biaya tambahan"
              description="Diskon mengurangi subtotal. Biaya tambahan dibagi rata."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="discount-type" className="field-label">
                    Jenis diskon
                  </label>
                  <select
                    id="discount-type"
                    className="field"
                    value={discountType}
                    onChange={(event) => {
                      setDiscountType(event.target.value);
                      setStatus(null);
                    }}
                  >
                    <option value="">Tanpa diskon</option>
                    <option value="price">Nominal (Rp)</option>
                    <option value="percent">Persen (%)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="discount-value" className="field-label">
                    Nilai diskon
                  </label>
                  <input
                    id="discount-value"
                    type="text"
                    inputMode="numeric"
                    className="field"
                    placeholder={
                      discountType ? "0" : "Pilih jenis diskon dulu"
                    }
                    value={discountDisplay}
                    onChange={(event) => setDiscount(onlyNumber(event.target.value))}
                    disabled={!discountType}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="shipping" className="field-label">
                    Biaya tambahan
                  </label>
                  <input
                    id="shipping"
                    type="text"
                    inputMode="numeric"
                    className="field"
                    placeholder="Ongkir, pajak, atau biaya lain"
                    value={shipping ? formatCurrency(shipping) : ""}
                    onChange={(event) => setShipping(onlyNumber(event.target.value))}
                  />
                  <p className="mt-1 text-sm font-medium text-muted">
                    Dibagi rata ke pembayar yang punya item.
                  </p>
                </div>
              </div>

              {discountValue > 0 || shippingValue > 0 ? (
                <div className="mt-4 space-y-1 text-sm font-semibold text-muted">
                  {discountValue > 0 ? (
                    <p>Diskon: {formatCurrency(discountValue)}</p>
                  ) : null}
                  {shippingValue > 0 ? (
                    <p>
                      Biaya tambahan dibagi ke {activePayers.length} pembayar.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </Panel>
          </div>

          <div>
            <ResultPanel
              total={total}
              finalTotal={finalTotal}
              discountValue={discountValue}
              shippingValue={shippingValue}
              payerShares={payerShares}
              error={validationError}
              emptyMessage={emptyMessage}
              formatCurrency={formatCurrency}
              onCopy={handleCopy}
              onShare={handleShare}
              onRequestReset={requestReset}
              onCancelReset={cancelReset}
              onConfirmReset={confirmReset}
              resetPending={resetPending}
              status={status}
              showConfetti={showConfetti}
            />
          </div>
        </main>

        <footer className="site-footer">
          <p>
            Dibuat oleh{" "}
            <a
              className="footer-link"
              href="https://github.com/zapip"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zapip
            </a>
          </p>
          <p className="text-xs">
            Data hanya tersimpan di halaman ini. Memuat ulang halaman akan
            mengosongkannya.
          </p>
        </footer>
      </div>
    </>
  );
}

export default SplitBill;
