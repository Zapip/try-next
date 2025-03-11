import { useState } from "react";

function SplitBill() {
  const [items, setItems] = useState([{ name: "", price: "", payer: "" }]);
  const [discount, setDiscount] = useState(null);
  const [discountType, setDiscountType] = useState(null); // New state for discount type
  const [shipping, setShipping] = useState(null);

  const addItem = () => {
    setItems([...items, { name: "", price: "", payer: "" }]);
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discountValue =
    discountType === "percent" ? total * (discount / 100) : discount;
  const finalTotal = total - discountValue + Number(shipping);

  const payments = items.reduce((acc, item) => {
    if (item.payer) {
      acc[item.payer] = (acc[item.payer] || 0) + Number(item.price || 0);
    }
    return acc;
  }, {});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <article className="flex flex-col sm:flex-row m-4 sm:m-12 gap-4">
      <section className="flex flex-col w-full gap-4">
        <h1 className="text-xl font-bold text-center bg-gray-700 p-4 rounded-xl">
          Input Bill
        </h1>
        <section className="bg-gray-700 p-6 rounded-xl w-full text-black flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-2">
              <section className="flex justify-between gap-2">
                <input
                  type="text"
                  placeholder="Item"
                  className="w-full p-2 rounded-lg"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nama"
                  className="w-full p-2 rounded-lg"
                  value={item.payer}
                  onChange={(e) => updateItem(index, "payer", e.target.value)}
                />
              </section>
              <input
                type="number"
                placeholder="Harga"
                className="w-full p-2 rounded-lg"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={addItem}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md mt-2 font-bold"
          >
            Tambah Item
          </button>
        </section>
        <section className="bg-gray-700 p-6 rounded-xl w-full text-black">
          <div className="mt-4 w-full">
            <label className="text-white">Diskon</label>
            <select
              className="border p-2 w-full mb-2 rounded-lg"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option disabled selected>
                Pilih Jenis Diskon
              </option>
              <option value="price">Harga (Rp)</option>
              <option value="percent">Persen (%)</option>
            </select>
            <input
              type="number"
              placeholder="0"
              className="border p-2 w-full rounded-lg"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="text-white">Ongkir (Rp)</label>
            <input
              type="number"
              placeholder="0"
              className="border p-2 w-full rounded-lg"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>
        </section>
      </section>
      <section className="size-full flex flex-col gap-4">
        <h1 className="text-xl font-bold text-center bg-gray-700 p-4 rounded-xl">
          Preview Split Bill
        </h1>
        <h2 className="text-lg font-bold bg-green-500 p-4 rounded-xl">
          Total: {formatCurrency(finalTotal)}
        </h2>
        <section className="bg-gray-700 p-6 rounded-xl w-full flex flex-col gap-3">
          <h3 className="text-md font-semibold mt-2">Pembagian Biaya:</h3>
          <section className="flex flex-wrap gap-2 justify-center">
            {Object.entries(payments).map(([name, amount]) => (
              <section
                className={`w-fit h-fit p-2 px-4 rounded-lg ${getRandomColor()}`}
                key={name}
              >
                {`${name}: `}
                <span className="font-bold">
                  {formatCurrency((amount / total) * finalTotal)}
                </span>
              </section>
            ))}
          </section>
        </section>
      </section>
    </article>
  );
}

export default SplitBill;
