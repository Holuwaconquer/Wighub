const ShippingLocation = require("../models/ShippingLocation");

const createShippingLocation = async (req, res) => {
  try {
    const { name, description, fee, estimatedDays, isActive } = req.body;

    if (!name || fee == null) {
      return res
        .status(400)
        .json({ message: "Shipping location name and fee are required" });
    }

    const location = await ShippingLocation.create({
      name,
      description,
      fee,
      estimatedDays: estimatedDays || "",
      isActive: isActive !== false,
    });

    res.status(201).json(location);
  } catch (error) {
    console.error("Create shipping location error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getShippingLocations = async (req, res) => {
  try {
    const locations = await ShippingLocation.find({ isActive: true }).sort({
      name: 1,
    });
    res.json(locations);
  } catch (error) {
    console.error("Get shipping locations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateShippingLocation = async (req, res) => {
  try {
    const location = await ShippingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Shipping location not found" });
    }

    const { name, description, fee, estimatedDays, isActive } = req.body;
    if (name !== undefined) location.name = name;
    if (description !== undefined) location.description = description;
    if (fee !== undefined) location.fee = fee;
    if (estimatedDays !== undefined)
      location.estimatedDays = estimatedDays || "";
    if (isActive !== undefined) location.isActive = isActive;

    await location.save();
    res.json(location);
  } catch (error) {
    console.error("Update shipping location error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteShippingLocation = async (req, res) => {
  try {
    const location = await ShippingLocation.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Shipping location not found" });
    }

    if (typeof location.deleteOne === "function") {
      await location.deleteOne();
    } else if (typeof location.remove === "function") {
      await location.remove();
    } else {
      await ShippingLocation.deleteOne({ _id: req.params.id });
    }

    res.json({ message: "Shipping location deleted" });
  } catch (error) {
    console.error("Delete shipping location error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createShippingLocation,
  getShippingLocations,
  updateShippingLocation,
  deleteShippingLocation,
};
