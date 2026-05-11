const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images were uploaded' });
    }

    const images = req.files.map((file) => ({
      url: file.path || file.secure_url || file.location,
      publicId: file.filename || file.public_id,
      originalName: file.originalname,
    }));

    res.status(201).json(images);
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
};

module.exports = {
  uploadProductImages,
};
