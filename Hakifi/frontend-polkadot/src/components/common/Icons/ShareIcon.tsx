import React from 'react';

const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3.52 9.63v1.543H1.668V9.63H3.52zM5.372 11.173v1.543H3.52v-1.543h1.852zM7.224 12.716v1.543H5.372v-1.543h1.852zM9.076 14.26v1.543H7.224v-1.544h1.852zM16.483 9.63v3.086h-5.556V9.63h5.556z" fill="#1E2021" />
      <path d="M10.927 8.086v4.63H5.372v-4.63h5.555zM18.335 9.63v4.63h-1.852V9.63h1.852zM16.483 8.086V9.63h-5.556V8.086h5.556zM5.372 8.086V9.63H3.52V8.086h1.852zM7.224 6.543v1.543H5.372V6.543h1.852zM9.076 6.543v1.543H7.224V6.543h1.852zM5.372 9.63v1.543H3.52V9.63h1.852z" fill="#1E2021" />
      <path d="M9.076 12.716v1.543H7.224v-1.543h1.852zM9.076 5v1.543H7.224V5h1.852z" fill="#1E2021" />
    </svg>
  );
};

export default ShareIcon;
