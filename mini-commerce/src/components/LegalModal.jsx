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
        body: "We do not offer refunds. If you are not satisfied with your purchase, we allow exchanges for another product per our exchange policy. Any disputes should be reported to our support team promptly so we can assist you.",
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
  account: {
    title: "Account Help",
    intro:
      "Your Minka account helps you save favorites, track orders, and keep your details ready for a faster checkout.",
    sections: [
      {
        heading: "1. Creating an account",
        body: "You can create an account in seconds using your email address and a secure password. This lets you view past orders and save your shipping details.",
      },
      {
        heading: "2. Updating your profile",
        body: "From your profile, you can update your name, contact details, and shipping preferences whenever your information changes.",
      },
      {
        heading: "3. Managing saved items",
        body: "Your account keeps your wishlist and cart ready, so you can return later and pick up where you left off.",
      },
    ],
  },
  managingDeliveries: {
    title: "Managing Deliveries",
    intro:
      "We make it easy to stay informed about your package from dispatch to delivery, whether you are ordering locally or overseas.",
    sections: [
      {
        heading: "1. Delivery updates",
        body: "You will receive shipping notifications once your order is packed and again when it is on the way.",
      },
      {
        heading: "2. Change requests",
        body: "If your delivery address changes before the package is dispatched, contact us as soon as possible so we can update it.",
      },
      {
        heading: "3. Delivery support",
        body: "If a package is delayed or marked as delivered unexpectedly, our support team can help investigate the issue.",
      },
    ],
  },
  orders: {
    title: "Orders & Checkout",
    intro:
      "Our checkout process is designed to be simple, secure, and clear from the moment you add an item to your cart.",
    sections: [
      {
        heading: "1. Placing an order",
        body: "Select your preferred hair style, size, and shipping option, then confirm your order with secure payment.",
      },
      {
        heading: "2. Order confirmation",
        body: "You will receive an email confirmation with your order summary and tracking details as soon as your purchase is confirmed.",
      },
      {
        heading: "3. Order support",
        body: "If your order needs changes, cancellations, or a status check, our team is available to assist you quickly.",
      },
    ],
  },
  payments: {
    title: "Payments & Security",
    intro:
      "We use secure payment options and protect your transaction details so you can shop with confidence.",
    sections: [
      {
        heading: "1. Accepted methods",
        body: "We support trusted payment methods such as Visa, Mastercard, and bank transfers.",
      },
      {
        heading: "2. Payment confirmation",
        body: "Once your payment is successful, you will receive a confirmation email and your order will move into processing.",
      },
      {
        heading: "3. Security",
        body: "Your financial information is handled securely and is never shared with unauthorized third parties.",
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
              <p className="text-sm leading-6 text-[#4b5563] w-full">
                {section.body}
              </p>
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
