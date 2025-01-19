const HotIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path fill="red" d="M6.944 1.667h1.389v1.389H6.944z" />
      <path
        fill="red"
        d="M7.64 3.055h2.778v1.389H7.64zM12.5 2.361h1.389V3.75H12.5zM9.028 4.444h2.778v1.389H9.028z"
      />
      <path fill="red" d="M7.64 5.139h7.639v4.167H7.64z" />
      <path
        fill="red"
        d="M5.556 9.305h10.417v.694H5.556zM4.167 10h12.5v6.944h-12.5z"
      />
      <path
        fill="red"
        d="M6.25 16.25h8.333v1.389H6.25zM7.64 17.639h6.944v.694H7.64z"
      />
      <path
        fill="#FF8000"
        d="M9.723 6.528h4.167V10H9.723zM8.333 10h6.944v6.25H8.333z"
      />
      <path fill="#FF8000" d="M6.944 13.472h6.944v1.389H6.944z" />
      <path
        fill="#FF8000"
        d="M6.25 13.472h7.639v2.778H6.25zM6.944 11.389h6.944v2.083H6.944z"
      />
      <path fill="#F0FC00" d="M7.64 14.166h6.25v3.472H7.64z" />
      <path fill="#FFCF00" d="M8.334 11.389h5.556v3.472H8.334z" />
      <path fill="#FFCF00" d="M8.334 12.083h1.389v4.167H8.334z" />
    </svg>
  );
};

export default HotIcon;
