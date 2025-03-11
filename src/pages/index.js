import { useState } from "react";

function SplitBill() {
  const [items, setItems] = useState([{ name: "", price: "", payer: "" }]);
  const [discount, setDiscount] = useState(null);
  const [discountType, setDiscountType] = useState("price"); // New state for discount type
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

  return (
    <article className="m-12 flex gap-4">
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-center bg-gray-700 p-4 rounded-xl">
          Input Bill
        </h1>
        <section className="bg-gray-700 p-6 rounded-xl w-fit text-black">
          <table className="w-full mb-4">
            <thead className="text-white">
              <tr>
                <th className=" bg-gray-800 p-2">Item</th>
                <th className=" bg-gray-800 p-2">Harga</th>
                <th className="bg-gray-800 p-2">Nama</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="">
                    <input
                      type="text"
                      placeholder="Item"
                      className="w-full p-2"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="">
                    <input
                      type="number"
                      placeholder="Harga"
                      className="w-full p-2"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                    />
                  </td>
                  <td className="">
                    <input
                      type="text"
                      placeholder="Nama"
                      className="w-full p-2"
                      value={item.payer}
                      onChange={(e) =>
                        updateItem(index, "payer", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className="bg-orange-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Tambah Item
          </button>
        </section>
        <section className="bg-gray-700 p-6 rounded-xl w-full text-black">
          <div className="mt-4 ">
            <label className="block text-white">Diskon</label>
            <select
              className="border p-2 w-full mb-2"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="price">Harga (Rp)</option>
              <option value="percent">Persen (%)</option>
            </select>
            <input
              type="number"
              className="border p-2 w-full"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-white">Ongkir (Rp)</label>
            <input
              type="number"
              placeholder="0"
              className="border p-2 w-full"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            />
          </div>
        </section>
      </section>
      <section className="size-full">
        <h1 className="text-xl font-bold text-center bg-gray-700 p-4 rounded-xl">
          Preview Split Bill
        </h1>
        <h2 className="text-lg font-bold mt-4">
          Total: {formatCurrency(finalTotal)}
        </h2>
        <h3 className="text-md font-semibold mt-2">Pembagian Biaya:</h3>
        <ul className="list-disc pl-5">
          {Object.entries(payments).map(([name, amount]) => (
            <li key={name}>
              {name}: {formatCurrency((amount / total) * finalTotal)}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export default SplitBill;
