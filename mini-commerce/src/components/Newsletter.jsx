import React from "react";

const Newsletter = () => {
  return (
    <div className="w-full bg-gray-50 px-[7%] flex flex-col gap-4 justify-center items-center ">
      <div className="w-full bg-[#8a0fb3] text-white rounded-[20px] py-[36px] px-[20px] md:px-[64px] translate-y-[70px] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-15">
        <div className="w-full text-center md:text-left">
          <h1 className="text-[20px] md:text-[36px] font-bold">
            JOIN THE MINKA VIP LIST
          </h1>
          <p className="mt-3 text-[16px] md:text-[18px] text-white/90">
            Get first access to new arrivals, exclusive bundles, and styling
            updates.
          </p>
        </div>
        <div className="w-full flex justify-center md:justify-end">
          <a
            href="https://wa.me/message/DSAULOSKOI4XG1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#8a0fb3] font-semibold text-[16px] py-[12px] px-[20px] rounded-[62px] hover:bg-gray-100 transition"
          >
            Chat with Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
