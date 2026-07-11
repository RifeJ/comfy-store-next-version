// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   HiOutlineCube,
//   HiOutlineUsers,
//   HiOutlineShoppingBag,
//   HiOutlineArrowLeft,
// } from "react-icons/hi2";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";

// const socket = io("https://comfystorebackend-production.up.railway.app/api");

// const AdminDashboard = () => {
//   const [items, setItems] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [activeTab, setActiveTab] = useState("products");

//   const handleTerminate = async (id) => {
//     if (!window.confirm("TERMINATE UNIT?")) return;
//     const response = await fetch(
//       `https://comfystorebackend-production.up.railway.app/api/products/${id}`,
//       {
//         method: "DELETE",
//         headers: getAuthHeaders(),
//       },
//     );
//     if (response.ok) {
//       toast.success("TERMINATED");
//       loadAll();
//     } else {
//       toast.error("ACCESS_DENIED");
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center font-mono">
//         LOADING_CORE_SYSTEM...
//       </div>
//     );
//   if (!isAdmin)
//     return (
//       <div className="p-10 text-error">
//         ACCESS_DENIED: UNAUTHORIZED_PERSONNEL
//       </div>
//     );

//   return (
//     <div className="flex min-h-screen bg-base-300">
//       <aside className="w-64 bg-base-200 p-6 flex flex-col border-r border-base-content/10">
//         <div className="text-primary font-bold text-xl mb-10">CORE_OS v2.0</div>
//         <nav className="space-y-2">
//           {["products", "customers", "orders"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`w-full p-3 rounded-xl text-sm ${activeTab === tab ? "bg-primary text-primary-content" : "text-base-content/60"}`}>
//               {tab.toUpperCase()}
//             </button>
//           ))}
//         </nav>
//         <Link href="/" className="mt-auto text-sm text-base-content/50">
//           EXIT_TERMINAL
//         </Link>
//       </aside>

//       <main className="flex-1 p-10 overflow-y-auto">
//         {activeTab === "products" && (
//           // Вместо твоего текущего списка в activeTab === "products"
//           <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden">
//             <table className="w-full text-left">
//               <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
//                 <tr>
//                   <th className="px-6 py-4">ID</th>
//                   <th className="px-6 py-4">Model Name</th>
//                   <th className="px-6 py-4">Price</th>
//                   <th className="px-6 py-4 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-base-content/5 text-sm">
//                 {items.map((item) => (
//                   <tr
//                     key={item._id}
//                     className="hover:bg-base-200/30 transition-colors">
//                     <td className="px-6 py-4 font-mono text-xs text-base-content/50">
//                       #{item._id.slice(-6)}
//                     </td>
//                     <td className="px-6 py-4 font-semibold text-base-content">
//                       {item.title}
//                     </td>
//                     <td className="px-6 py-4 font-medium text-primary">
//                       ${item.price / 100}
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button
//                         onClick={() => handleTerminate(item._id)}
//                         className="text-error hover:bg-error/10 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors">
//                         DELETE
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// };

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("https://comfystorebackend-production.up.railway.app/api");

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
  console.log("SENDING_HEADERS:", headers);
  return headers;
};

const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;

    setDisplayedText("");

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));

        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return (
    <h1 className="text-primary font-bold text-2xl tracking-wider uppercase">
      {displayedText}

      <span className="animate-pulse">_</span>
    </h1>
  );
};
const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("products");

  const [newProduct, setNewProduct] = useState({
    title: "",

    price: "",

    category: "",

    description: "",

    company: "",

    image: "",

    images: "",

    colors: "",

    featured: false,

    shipping: false,

    stock: "",
  });

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(
        `https://comfystorebackend-production.up.railway.app/api/${endpoint}`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) throw new Error("Auth failed");
      const result = await response.json();
      setter(result.data);
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchData("products", setItems),
      fetchData("users", setCustomers),
      fetchData("ordersAll", setOrders),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") setIsAdmin(true);
    }
    loadAll();
    socket.on("DATABASE_SYNC_EVENT", loadAll);
    return () => socket.off("DATABASE_SYNC_EVENT");
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("AUTH_ERROR: Missing authorization token");
      return;
    }

    const payload = {
      ...newProduct,
      price: Number(newProduct.price),
      featured: Boolean(newProduct.featured),
      shipping: Boolean(newProduct.shipping),
      colors:
        typeof newProduct.colors === "string"
          ? newProduct.colors.split(",").map((c) => c.trim())
          : newProduct.colors,
    };

    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setItems((prevItems) => [...prevItems, result.data]);
        setNewProduct({
          title: "",
          price: "",
          company: "",
          description: "",
          category: "",
          image: "",
          images: "",
          featured: false,
          shipping: false,
          colors: "",
          stock: "",
        });
        toast.success("SUCCESS: UNIT_SYNCED_WITH_GRID");
      } else {
        toast.error(`REJECTED:${result.error}`);
      }
    } catch (err) {
      toast.error(`CONNECTION_LOST:${err}`);
      console.error(err);
    }
  };

  const handleTerminate = async (id) => {
    const isConfirmed = window.confirm(
      "CRITICAL_ALERT: Are you sure you want to terminate this unit?",
    );

    if (!isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("AUTH_ERROR: Missing authorization token");
      return;
    }

    try {
      const response = await fetch(
        `https://comfystorebackend-production.up.railway.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success(`UNIT_${id.slice(-6)}: TERMINATED`);
      } else {
        toast.error("ACCESS_DENIED: DATABASE_REJECTED_COMMAND");
      }
    } catch (error) {
      console.error("UPLINK_ERROR:", error);
      toast.error("SYSTEM_ERROR: COULD_NOT_REACH_DATABASE");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center text-primary font-mono animate-pulse">
        &gt; CONNECTING_TO_CORE_DATABASE...
      </div>
    );

  if (!isAdmin) return null;

  // ОБЩИЕ СТИЛИ ДЛЯ ИНПУТОВ

  const inputStyles =
    "w-full bg-base-200 border border-primary/20 rounded-xl px-4 py-3 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="flex min-h-screen bg-base-300 text-base-content overflow-hidden">
      {/* SIDEBAR */}

      <aside className="w-64 border-r border-base-content/10 bg-base-200 p-6 flex flex-col z-10 shadow-xl">
        <div className="mb-10 text-primary font-bold text-xl tracking-tighter border-b border-primary/20 pb-4">
          CORE_OS v2.0
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "products"
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
            }`}>
            <HiOutlineCube size={18} /> INVENTORY
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "customers"
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
            }`}>
            <HiOutlineUsers size={18} /> CUSTOMERS
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium text-sm ${
              activeTab === "orders"
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
            }`}>
            <HiOutlineShoppingBag size={18} /> ORDERS
          </button>
        </nav>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-base-content/50 hover:text-error transition-colors mt-auto pt-4 border-t border-base-content/10">
          <HiOutlineArrowLeft /> EXIT_TERMINAL
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}

      <main className="flex-1 p-8 md:p-10 overflow-y-auto z-10 relative">
        <header className="mb-8">
          <Typewriter text="SYSTEM_OVERVIEW" speed={70} />

          <div className="h-1 w-16 bg-primary mt-2 rounded-full shadow-[0_0_10px_var(--color-primary)] opacity-80"></div>
        </header>

        {/* Вкладка: ИНВЕНТАРЬ / ТОВАРЫ */}

        {activeTab === "products" && (
          <div className="space-y-8 animate-fade-in">
            {/* Статистика */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-primary/20 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-base-content/50 uppercase tracking-widest font-semibold mb-1">
                  Total Assets
                </div>

                <div className="text-3xl font-bold text-base-content">
                  {items.length}{" "}
                  <span className="text-sm text-primary font-medium">
                    UNITS
                  </span>
                </div>
              </div>

              <div className="bg-card border border-base-content/10 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-base-content/50 uppercase tracking-widest font-semibold mb-1">
                  Database Link
                </div>

                <div className="text-xl font-bold text-success mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  ACTIVE
                </div>
              </div>
            </div>

            {/* Форма добавления */}

            <div className="bg-card border border-base-content/10 p-6 md:p-8 rounded-3xl shadow-lg">
              <h2 className="text-base-content font-bold mb-6 flex items-center gap-2 uppercase text-sm tracking-widest">
                Initialize New Unit
              </h2>

              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <input
                    placeholder="Product Title"
                    className={inputStyles}
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, title: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Price (USD)"
                    type="number"
                    className={inputStyles}
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Category"
                    className={inputStyles}
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Company"
                    className={inputStyles}
                    value={newProduct.company}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, company: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Main Image URL"
                    className={inputStyles}
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Stock Amount"
                    type="number"
                    className={inputStyles}
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                  />

                  <input
                    placeholder="Colors (comma separated: #fff, #000)"
                    className={inputStyles}
                    value={newProduct.colors}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, colors: e.target.value })
                    }
                  />

                  <input
                    placeholder="Extra Images (comma separated URLs)"
                    className={inputStyles}
                    value={newProduct.images}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, images: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Product Description..."
                    className={`${inputStyles} lg:col-span-2 min-h-[100px] resize-y`}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-8 text-xs font-semibold text-base-content/70 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs rounded border-base-content/30 checked:border-primary checked:bg-primary"
                      checked={newProduct.featured}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured Item
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs rounded border-base-content/30 checked:border-primary checked:bg-primary"
                      checked={newProduct.shipping}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          shipping: e.target.checked,
                        })
                      }
                    />
                    Free Shipping
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-content hover:opacity-90 transition-all font-bold rounded-xl shadow-md uppercase text-sm tracking-wider active:scale-[0.99]">
                    Execute Data Injection
                  </button>
                </div>
              </form>
            </div>

            {/* Таблица товаров */}

            <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-base-200/50 text-base-content/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                    <tr>
                      <th className="px-6 py-4">ID</th>

                      <th className="px-6 py-4">Model Name</th>

                      <th className="px-6 py-4">Category</th>

                      <th className="px-6 py-4">Price</th>

                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-base-content/5 text-sm">
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-base-200/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                          #{item._id.slice(-6)}
                        </td>

                        <td className="px-6 py-4 font-semibold text-base-content">
                          {item.title}
                        </td>

                        <td className="px-6 py-4 text-base-content/70 capitalize">
                          {item.category}
                        </td>

                        <td className="px-6 py-4 font-medium text-primary">
                          ${item.price}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleTerminate(item._id)}
                            className="text-error hover:bg-error/10 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-block">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5 text-sm">
                {customers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                      #{user._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {user.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-primary">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5 text-sm">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-base-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-base-content/70">
                      {order.userId?.email || "Guest"}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${order.totalAmount / 100}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">
                        {order.status || "COMPLETED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
export default AdminDashboard;
