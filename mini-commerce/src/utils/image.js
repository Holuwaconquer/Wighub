export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") {
    return "/placeholder.jpg";
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    dpr = "auto",
  } = options;

  if (url.startsWith("/")) {
    return url;
  }

  if (!url.startsWith("http")) {
    return `/${url.replace(/^\//, "")}`;
  }

  const cloudinaryIndex = url.indexOf("/upload/");
  if (cloudinaryIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, cloudinaryIndex + 8);
  const rest = url.slice(cloudinaryIndex + 8);
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (dpr) transformations.push(`dpr_${dpr}`);

  if (!transformations.length) {
    return url;
  }

  return `${prefix}${transformations.join(",")}/${rest}`;
}

export function getProductImageUrl(url, options = {}) {
  return getOptimizedImageUrl(url, {
    width: 800,
    height: 800,
    quality: "auto",
    format: "auto",
    crop: "fill",
    dpr: "auto",
    ...options,
  });
}
