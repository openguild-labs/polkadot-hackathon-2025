import React from "react";

const CandleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 6.66699H5H8.33333V13.3337H5H2.5V6.66699Z" fill="#768394" />
      <path d="M5 4.16699V6.66699M5 6.66699H2.5V13.3337H5M5 6.66699H8.33333V13.3337H5M5 13.3337V15.8337" stroke="#768394" strokeWidth="1.25" />
      <rect x="5" y="4.16699" width="0.833333" height="11.6667" fill="#768394" />
      <path d="M10.8335 4.58301H13.3335H16.6668V17.083H13.3335H10.8335V4.58301Z" fill="#768394" />
      <path d="M13.3335 0.833008V4.58301M13.3335 4.58301H10.8335V17.083H13.3335M13.3335 4.58301H16.6668V17.083H13.3335M13.3335 17.083V19.583" stroke="#768394" strokeWidth="1.25" />
      <rect x="13.3335" y="0.833008" width="0.833334" height="18.3333" fill="#768394" />
    </svg>

  );
};

export default CandleIcon;
