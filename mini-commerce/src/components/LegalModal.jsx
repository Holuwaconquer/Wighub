import React from "react";

const modalContent = {
  terms: {
    title: "Terms & Conditions",
    intro:
      "These terms govern your use of Minka Luxury Hair. By browsing, placing an order, or communicating with us, you agree to the rules below.",
    sections: [
      {
        heading: "1. Use of the site",
        body: "You may use our website for lawful purposes only. You agree not to misuse the site, scrape content, or attempt to interfere with its operation.",
      },
      {
        heading: "2. Product information",
        body: "We strive to provide accurate product descriptions, pricing, and availability. However, colors, textures, and measurements may vary slightly due to screen settings or natural hair differences.",
      },
      {
        heading: "3. Orders and payments",
        body: "All orders are subject to confirmation and payment verification. We reserve the right to cancel orders if stock becomes unavailable or if fraud or suspicious activity is detected.",
      },
      {
        heading: "4. Returns and disputes",
        body: "Please review our return and exchange policy before purchasing. Any disputes should be reported to our support team promptly so we can assist you.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "We respect your privacy and are committed to protecting your personal information while you shop with us.",
    sections: [
      {
        heading: "1. Information we collect",
        body: "We collect information such as your name, email, shipping address, phone number, and payment details needed to process your order.",
      },
      {
        heading: "2. How we use your information",
        body: "Your information is used to process orders, contact you about your purchases, improve our services, and send relevant updates or promotions.",
      },
      {
        heading: "3. Data protection",
        body: "We take reasonable steps to keep your information secure and only share it with trusted service providers necessary to fulfill orders and provide support.",
      },
      {
        heading: "4. Your choices",
        body: "You may contact us to update, access, or remove your personal data where permitted by law.",
      },
    ],
  },
  delivery: {
    title: "Delivery Details",
    intro:
      "We make every effort to deliver your products quickly and safely, whether you are ordering locally or internationally.",
    sections: [
      {
        heading: "1. Shipping time",
        body: "Delivery times vary depending on your location and selected shipping method. Standard delivery usually takes several business days, while express options may be faster.",
      },
      {
        heading: "2. Tracking and updates",
        body: "Once your order has shipped, you will receive tracking information so you can follow its progress.",
      },
      {
        heading: "3. International deliveries",
        body: "International orders may be subject to customs clearance, local import duties, or additional carrier delays beyond our control.",
      },
      {
        heading: "4. Delivery issues",
        body: "If your package is delayed, damaged, or missing, please contact us immediately so we can help resolve the issue as quickly as possible.",
      },
    ],
  },
};

const LegalModal = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const content = modalContent[type];

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-[#8a0fb3] px-3 py-1 text-sm font-semibold text-[#8a0fb3] transition hover:bg-[#8a0fb3] hover:text-white"
          aria-label="Close legal information"
        >
          Close
        </button>

        <div className="space-y-4">
          <h2
            id="legal-modal-title"
            className="text-2xl font-bold text-[#8a0fb3]"
          >
            {content.title}
          </h2>
          <p className="text-sm leading-6 text-[#4b5563]">{content.intro}</p>

          {content.sections.map((section, index) => (
            <div key={index} className="space-y-1 w-full">
              <h3 className="text-base font-semibold text-[#111827]">
                {section.heading}
              </h3>
              <p className="text-sm leading-6 text-[#4b5563] w-full">{section.body}</p>
            </div>
          ))}

          <div className="pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#8a0fb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#866a91]"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
