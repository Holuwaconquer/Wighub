import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "./AdminLayout";
import { createProduct, uploadImages } from "../../store/slices/productSlice";
import { FaCloudUploadAlt, FaTimes, FaPlus } from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Wigs",
    hairType: "",
    texture: "",
    length: "",
    weight: "",
    stock: "",
    sku: "",
    images: [],
    features: [""],
    specifications: {},
    status: "active",
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const invalidTypeFiles = files.filter(
      (file) => !allowedTypes.includes(file.type),
    );
    const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);

    if (invalidTypeFiles.length > 0) {
      setUploadError(
        "Only JPG and PNG images are supported. Please remove the invalid file(s) and try again.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (oversizedFiles.length > 0) {
      setUploadError(
        "Each image must be smaller than 10MB. Please remove the large file(s) and try again.",
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.push(url);
      return { file, url };
    });
    setPreviewImages((prev) => [...prev, ...previews]);

    setUploadError(null);
    setUploadingImages(true);
    try {
      const result = await dispatch(uploadImages(files)).unwrap();
      const newImages = result.map((img) => img.url);
      setUploadedImages((prev) => [...prev, ...newImages]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
      setPreviewImages([]);
    } catch (error) {
      const message =
        error?.message || error || "Upload failed. Please try again.";
      setUploadError(message);
      console.error("Upload failed:", message);
    } finally {
      setUploadingImages(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePreviewImage = (index) => {
    const removedPreview = previewImages[index];
    if (removedPreview) {
      URL.revokeObjectURL(removedPreview.url);
      previewUrlsRef.current = previewUrlsRef.current.filter(
        (url) => url !== removedPreview.url,
      );
    }
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviewImages);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || null,
        stock: parseInt(formData.stock),
        images: formData.images.filter((img) => img.trim() !== ""),
        features: formData.features.filter((f) => f.trim() !== ""),
        specifications: {
          "Hair Type": formData.hairType,
          Texture: formData.texture,
          Length: formData.length,
          Weight: formData.weight,
        },
      };

      await dispatch(createProduct(productData)).unwrap();
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-500 mt-1">
          Add a new product to your inventory
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                >
                  <option value="Wigs">Wigs</option>
                  <option value="Bundles">Bundles</option>
                  <option value="Extensions">Extensions</option>
                  <option value="Closures">Closures</option>
                  <option value="Frontals">Frontals</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hair Type
                </label>
                <select
                  name="hairType"
                  value={formData.hairType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                >
                  <option value="">Select</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="Peruvian">Peruvian</option>
                  <option value="Malaysian">Malaysian</option>
                  <option value="Indian">Indian</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texture
                </label>
                <select
                  name="texture"
                  value={formData.texture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                >
                  <option value="">Select</option>
                  <option value="Straight">Straight</option>
                  <option value="Body Wave">Body Wave</option>
                  <option value="Deep Wave">Deep Wave</option>
                  <option value="Kinky Curly">Kinky Curly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <input
                  type="text"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="e.g., 22 inch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₦)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>

              {/* Image Upload Area */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaCloudUploadAlt className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </label>
                {uploadingImages && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading images… please wait until upload is finished
                    before saving.
                  </div>
                )}
                {!uploadingImages && formData.images.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Upload complete. You can add more images or remove any image
                    below.
                  </div>
                )}
                {uploadError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Image Preview Grid */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {previewImages.map((preview, index) => (
                    <div key={`preview-${index}`} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-34 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={`image-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-34 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add More Images Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-[#8a0fb3] text-sm hover:underline"
                disabled={uploadingImages}
              >
                <FaPlus className="text-xs" />
                Add more images
              </button>
              {uploadingImages && (
                <p className="mt-2 text-sm text-gray-500">
                  Do not save the product while images are still uploading.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Feature"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a0fb3]"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-[#8a0fb3] text-sm hover:underline"
              >
                + Add another feature
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="px-6 py-2 bg-[#8a0fb3] text-white rounded-lg hover:bg-[#b98800] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
