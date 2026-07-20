import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPercent,
  FaCalendarAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  createSale,
  deleteSale,
  getProducts,
  getSales,
  updateSale,
} from "../../services/api";

const initialFormState = {
  name: "",
  selectedProducts: [],
  discountPercentage: "",
  salePrice: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salesResponse, productsResponse] = await Promise.all([
        getSales(),
        getProducts({ limit: 100 }),
      ]);
      setSales(salesResponse || []);
      setProducts(productsResponse.products || []);
    } catch (error) {
      console.error("Failed to load sales:", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please give this sale a name");
      return;
    }

    if (!formData.selectedProducts.length) {
      toast.error("Select at least one product");
      return;
    }

    if (!formData.discountPercentage && !formData.salePrice) {
      toast.error("Enter either a discount percentage or a fixed sale price");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        products: formData.selectedProducts,
        discountPercentage:
          formData.discountPercentage === ""
            ? null
            : Number(formData.discountPercentage),
        salePrice:
          formData.salePrice === "" ? null : Number(formData.salePrice),
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };

      if (editingSale) {
        await updateSale(editingSale._id, payload);
        toast.success("Sale updated successfully");
      } else {
        await createSale(payload);
        toast.success("Sale created successfully");
      }

      setShowModal(false);
      setEditingSale(null);
      setFormData(initialFormState);
      await loadData();
    } catch (error) {
      console.error("Failed to save sale:", error);
      toast.error("Failed to save sale");
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      name: sale.name || "",
      selectedProducts: (sale.products || []).map(
        (product) => product._id || product,
      ),
      discountPercentage: sale.discountPercentage ?? "",
      salePrice: sale.salePrice ?? "",
      startDate: sale.startDate?.split("T")[0] || "",
      endDate: sale.endDate?.split("T")[0] || "",
      isActive: sale.isActive !== false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete sale?",
      text: "This will remove the sale and unmark the selected products.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded-lg",
        cancelButton: "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSale(id);
      toast.success("Sale deleted successfully");
      await loadData();
    } catch (error) {
      console.error("Failed to delete sale:", error);
      toast.error("Failed to delete sale");
    }
  };

  const toggleProduct = (productId) => {
    setFormData((current) => ({
      ...current,
      selectedProducts: current.selectedProducts.includes(productId)
        ? current.selectedProducts.filter((id) => id !== productId)
        : [...current.selectedProducts, productId],
    }));
  };

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const isActiveSale = (sale) => {
    if (!sale.isActive) return false;
    const now = new Date();
    return new Date(sale.startDate) <= now && now <= new Date(sale.endDate);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-gray-900">
              Sales
            </h1>
            <p className="text-gray-500 mt-1 font-light">
              Create limited-time product discounts
            </p>
          </div>
          <button
            onClick={() => {
              setEditingSale(null);
              setFormData(initialFormState);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <FaPlus className="text-sm" />
            Create Sale
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <FaTag className="text-purple-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
            <p className="text-xs text-gray-600">Total Sales</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <FaPercent className="text-green-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {sales.filter((sale) => sale.discountPercentage).length}
            </p>
            <p className="text-xs text-gray-600">Discount Sales</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <FaClock className="text-amber-600 text-xl mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {sales.filter((sale) => isActiveSale(sale)).length}
            </p>
            <p className="text-xs text-gray-600">Active Right Now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sales.map((sale) => (
            <div
              key={sale._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {sale.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {sale.products?.length || 0} products included
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isActiveSale(sale) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {isActiveSale(sale) ? "Active" : "Scheduled"}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaPercent className="text-amber-500" />
                  <span>
                    {sale.discountPercentage
                      ? `${sale.discountPercentage}% OFF`
                      : sale.salePrice
                        ? `${formatNaira(sale.salePrice)} fixed price`
                        : "Custom pricing"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-amber-500" />
                  <span>
                    {new Date(sale.startDate).toLocaleDateString()} -{" "}
                    {new Date(sale.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleEdit(sale)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sale._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {sales.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTag className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-light text-gray-800 mb-2">
              No sales created yet
            </h3>
            <p className="text-gray-500 mb-6">
              Launch your first limited-time offer for selected products
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              Create Sale
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5">
                <h2 className="text-2xl font-light text-gray-800">
                  {editingSale ? "Edit Sale" : "Create New Sale"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g. Weekend Flash Sale"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                          salePrice: "",
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Sale Price (₦)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salePrice: e.target.value,
                          discountPercentage: "",
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                  />
                  <label className="text-sm text-gray-700">
                    Activate sale immediately
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Products
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                    {products.map((product) => (
                      <label
                        key={product._id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedProducts.includes(
                            product._id,
                          )}
                          onChange={() => toggleProduct(product._id)}
                          className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                        />
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSale(null);
                      setFormData(initialFormState);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 text-white"
                  >
                    Save Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Sales;
