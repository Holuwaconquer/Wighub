const Sale = require("../models/Sale");
const Product = require("../models/Product");

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("products")
      .sort({ startDate: -1 });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getActiveSalesProducts = async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      status: "active",
      isOnSale: true,
      saleStartDate: { $lte: now },
      saleEndDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSale = async (req, res) => {
  try {
    const {
      name,
      products,
      discountPercentage,
      salePrice,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Select at least one product for the sale." });
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please select a start and end date." });
    }

    const sale = await Sale.create({
      name: name || "Special Sale",
      products,
      discountPercentage: discountPercentage ?? null,
      salePrice: salePrice ?? null,
      startDate,
      endDate,
      isActive: isActive !== false,
    });

    const productIds = products.map((id) => id.toString());
    const selectedProducts = await Product.find({ _id: { $in: productIds } });

    const now = new Date();
    const isCurrentlyActive =
      sale.isActive && new Date(startDate) <= now && now <= new Date(endDate);

    const bulkUpdate = selectedProducts.map((product) => {
      const basePrice = Number(product.price || 0);
      const fallbackDiscount =
        discountPercentage != null && discountPercentage !== ""
          ? Number(discountPercentage)
          : null;
      const fallbackSalePrice =
        salePrice != null && salePrice !== "" ? Number(salePrice) : null;

      const computedSalePrice =
        fallbackSalePrice ??
        (fallbackDiscount != null
          ? Math.round(basePrice * (1 - fallbackDiscount / 100))
          : null);

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              saleId: sale._id,
              saleName: name || "Special Sale",
              salePrice: computedSalePrice,
              saleDiscountPercentage: fallbackDiscount,
              saleStartDate: new Date(startDate),
              saleEndDate: new Date(endDate),
              isOnSale: isCurrentlyActive,
              originalPrice: product.originalPrice ?? basePrice,
            },
          },
        },
      };
    });

    if (bulkUpdate.length > 0) {
      await Product.bulkWrite(bulkUpdate);
    }

    await Product.updateMany(
      { _id: { $nin: productIds }, saleId: sale._id },
      {
        $set: {
          saleId: null,
          saleName: "",
          salePrice: null,
          saleDiscountPercentage: null,
          saleStartDate: null,
          saleEndDate: null,
          isOnSale: false,
        },
      },
    );

    const populatedSale = await Sale.findById(sale._id).populate("products");
    res.status(201).json(populatedSale);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const {
      name,
      products,
      discountPercentage,
      salePrice,
      startDate,
      endDate,
      isActive,
    } = req.body;

    sale.name = name || sale.name;
    sale.products = products || sale.products;
    sale.discountPercentage = discountPercentage ?? sale.discountPercentage;
    sale.salePrice = salePrice ?? sale.salePrice;
    sale.startDate = startDate ? new Date(startDate) : sale.startDate;
    sale.endDate = endDate ? new Date(endDate) : sale.endDate;
    sale.isActive = isActive !== undefined ? isActive : sale.isActive;

    const updatedSale = await sale.save();

    const productIds = (sale.products || []).map((id) => id.toString());
    const now = new Date();
    const isCurrentlyActive =
      updatedSale.isActive &&
      new Date(updatedSale.startDate) <= now &&
      now <= new Date(updatedSale.endDate);

    const selectedProducts = await Product.find({ _id: { $in: productIds } });
    const bulkUpdate = selectedProducts.map((product) => {
      const basePrice = Number(product.price || 0);
      const fallbackDiscount =
        updatedSale.discountPercentage != null &&
        updatedSale.discountPercentage !== ""
          ? Number(updatedSale.discountPercentage)
          : null;
      const fallbackSalePrice =
        updatedSale.salePrice != null && updatedSale.salePrice !== ""
          ? Number(updatedSale.salePrice)
          : null;
      const computedSalePrice =
        fallbackSalePrice ??
        (fallbackDiscount != null
          ? Math.round(basePrice * (1 - fallbackDiscount / 100))
          : null);

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              saleId: updatedSale._id,
              saleName: updatedSale.name || "Special Sale",
              salePrice: computedSalePrice,
              saleDiscountPercentage: fallbackDiscount,
              saleStartDate: updatedSale.startDate,
              saleEndDate: updatedSale.endDate,
              isOnSale: isCurrentlyActive,
              originalPrice: product.originalPrice ?? basePrice,
            },
          },
        },
      };
    });

    if (bulkUpdate.length > 0) {
      await Product.bulkWrite(bulkUpdate);
    }

    await Product.updateMany(
      { _id: { $nin: productIds }, saleId: updatedSale._id },
      {
        $set: {
          saleId: null,
          saleName: "",
          salePrice: null,
          saleDiscountPercentage: null,
          saleStartDate: null,
          saleEndDate: null,
          isOnSale: false,
        },
      },
    );

    const populatedSale = await Sale.findById(updatedSale._id).populate(
      "products",
    );
    res.status(200).json(populatedSale);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    await Product.updateMany(
      { saleId: sale._id },
      {
        $set: {
          saleId: null,
          saleName: "",
          salePrice: null,
          saleDiscountPercentage: null,
          saleStartDate: null,
          saleEndDate: null,
          isOnSale: false,
        },
      },
    );

    await Sale.findByIdAndDelete(sale._id);
    res.status(200).json({ message: "Sale removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSales,
  getActiveSalesProducts,
  createSale,
  updateSale,
  deleteSale,
};
