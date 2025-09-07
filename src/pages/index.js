import { useState, useEffect } from "react";
import Head from "next/head";

function SplitBill() {
  // Fungsi untuk generate hasil split bill dalam format teks
  const getExportText = () => {
    let text = `Hasil Split Bill\n\n`;
    text += `Total: ${formatCurrency(finalTotal)}\n`;
    if (discountType && Number(discount) > 0) {
      text += `Diskon: ${
        discountType === "percent" ? discount + "%" : formatCurrency(discount)
      }\n`;
    }
    if (shippingValue > 0) {
      text += `Biaya Tambahan: ${formatCurrency(shippingValue)}\n`;
    }
    text += `\nPembagian:\n`;
    payers.forEach((key) => {
      text += `- ${payerDisplayNames[key]}: ${formatCurrency(
        (payments[key] / total) * (finalTotal - shippingValue) +
          shippingPerPayer
      )}\n`;
    });
    return text;
  };

  // Export ke clipboard
  const handleExport = () => {
    const text = getExportText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Hasil split bill berhasil disalin ke clipboard!");
    } else {
      // fallback lama
      window.prompt("Salin hasil berikut:", text);
    }
  };

  // Share via Web Share API
  const handleShare = () => {
    const text = getExportText();
    if (navigator.share) {
      navigator.share({
        title: "Hasil Split Bill",
        text,
      });
    } else {
      alert("Fitur share tidak didukung di browser ini.");
    }
  };
  const [items, setItems] = useState([{ name: "", price: "", payer: "" }]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [shipping, setShipping] = useState(0);
  const [error, setError] = useState("");

  const addItem = () => {
    setItems([...items, { name: "", price: "", payer: "" }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Format dan unformat currency
  const toCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };
  const onlyNumber = (value) => value.replace(/[^\d]/g, "");

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    if (key === "price") {
      newItems[index][key] = onlyNumber(value);
    } else {
      newItems[index][key] = value;
    }
    setItems(newItems);
  };

  // Validasi input hanya saat aksi
  const validate = () => {
    for (const item of items) {
      if (!item.name || !item.payer || !item.price) {
        return "Semua kolom item harus diisi!";
      }
      if (Number(item.price) < 0) {
        return "Harga tidak boleh negatif!";
      }
    }
    return "";
  };

  // Jalankan validasi setiap kali items berubah
  useEffect(() => {
    setError(validate());
    // eslint-disable-next-line
  }, [items, discount, discountType, shipping]);

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discountValue =
    discountType === "percent"
      ? total * (Number(discount) / 100)
      : Number(discount);
  const shippingValue = Number(shipping) || 0;
  const finalTotal = Math.max(0, total - discountValue + shippingValue);

  // Hitung total per orang (case-insensitive, simpan nama asli pertama)
  const payments = {};
  const payerDisplayNames = {};
  items.forEach((item) => {
    if (item.payer) {
      const key = item.payer.trim().toLowerCase();
      if (!payerDisplayNames[key]) {
        payerDisplayNames[key] = item.payer.trim();
      }
      payments[key] = (payments[key] || 0) + Number(item.price || 0);
    }
  });

  // Bagi ongkir rata ke semua orang
  const payers = Object.keys(payments).filter((name) => name.trim() !== "");
  const shippingPerPayer =
    payers.length > 0 ? shippingValue / payers.length : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Math.round(value));
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-cyan-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Head>
        <title>
          Split Bill  - Buat Pembagian Tagihan Otomatis & Mudah
        </title>
        <meta
          name="description"
          content="Aplikasi split bill modern untuk membagi tagihan, ongkir, pajak, dan diskon secara otomatis. Mudah, cepat, dan bisa export hasil!"
        />
        <meta
          name="keywords"
          content="split bill, aplikasi split bill, bagi tagihan, patungan, pembagian biaya, export hasil, zapip"
        />
        <meta
          property="og:title"
          content="Split Bill Modern - Buat Pembagian Tagihan Otomatis & Mudah"
        />
        <meta
          property="og:description"
          content="Aplikasi split bill modern untuk membagi tagihan, ongkir, pajak, dan diskon secara otomatis. Mudah, cepat, dan bisa export hasil!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://your-domain.com" />
      </Head>
      <article className="flex flex-col sm:flex-row m-4 sm:m-12 gap-4">
        <section className="flex flex-col w-full gap-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-400 to-pink-500 text-white p-4 rounded-xl shadow-lg">
            Split Bill
          </h1>
          <section className="bg-white p-6 rounded-xl w-full shadow flex flex-col gap-4 border border-gray-200">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 relative group">
                <section className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama Item (misal: Ayam Goreng)"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 text-black"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Nama Pembayar (misal: Budi)"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 text-black"
                    value={item.payer}
                    onChange={(e) => updateItem(index, "payer", e.target.value)}
                  />
                  <button
                    className="ml-2 bg-red-500 text-white hover:bg-red-600 font-bold text-lg px-2 rounded"
                    title="Hapus Item"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    Hapus
                  </button>
                </section>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Harga (misal: 15.000)"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 text-black"
                  value={toCurrency(item.price)}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                />
              </div>
            ))}
            <button
              onClick={addItem}
              className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-4 py-2 rounded-md mt-2 font-bold shadow"
            >
              + Tambah Item
            </button>
            {error && (
              <div className="text-red-600 font-semibold text-center mt-2">
                {error}
              </div>
            )}
          </section>
          <section className="bg-white p-6 rounded-xl w-full shadow border border-gray-200">
            <div className="mt-4 w-full flex flex-col gap-2">
              <label className="text-gray-700 font-semibold">Diskon</label>
              <select
                className="text-black border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-orange-400"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="" disabled>
                  Pilih Jenis Diskon
                </option>
                <option value="price">Harga (Rp)</option>
                <option value="percent">Persen (%)</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                placeholder={
                  discountType === "percent" ? "Diskon (%)" : "Diskon (Rp)"
                }
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
                value={
                  discountType === "percent" ? discount : toCurrency(discount)
                }
                min={0}
                onChange={(e) => {
                  if (discountType === "percent") {
                    setDiscount(onlyNumber(e.target.value));
                  } else {
                    setDiscount(onlyNumber(e.target.value));
                  }
                }}
                disabled={!discountType}
              />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="text-gray-700 font-semibold">
                Biaya Tambahan (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Biaya tambahan (ongkir, pajak, dll)"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-orange-400 text-black"
                value={toCurrency(shipping)}
                min={0}
                onChange={(e) => setShipping(onlyNumber(e.target.value))}
              />
            </div>
          </section>
        </section>
        <section className="size-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl shadow-lg">
            Hasil Split Bill
          </h1>
          <h2 className="text-lg font-bold bg-green-500 p-4 rounded-xl text-white shadow">
            Total: {formatCurrency(finalTotal)}
          </h2>
          <section className="bg-white p-6 rounded-xl w-full flex flex-col gap-3 shadow border border-gray-200">
            <h3 className="text-md font-semibold mt-2 text-gray-700">
              Pembagian Biaya (sudah termasuk ongkir):
            </h3>
            <section className="flex flex-wrap gap-2 justify-start">
              {!error &&
                payers.map((key) => (
                  <section
                    className={`w-fit h-fit p-2 px-4 rounded-lg text-white font-semibold shadow ${getRandomColor()}`}
                    key={key}
                  >
                    {`${payerDisplayNames[key]}: `}
                    <span className="font-bold">
                      {formatCurrency(
                        (payments[key] / total) * (finalTotal - shippingValue) +
                          shippingPerPayer
                      )}
                    </span>
                  </section>
                ))}
            </section>
            <div className="flex gap-2 justify-start mt-4">
              <button
                onClick={handleExport}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold shadow"
              >
                Export/Salin Hasil
              </button>
              <button
                onClick={handleShare}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold shadow"
              >
                Share
              </button>
            </div>
          </section>
        </section>
        <footer className="mt-8 text-center text-gray-500 text-sm">
          Dibuat dengan ❤️ oleh{" "}
          <span className="font-bold text-orange-500">Zapip</span>
        </footer>
      </article>
    </>
  );
}

export default SplitBill;
