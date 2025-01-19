import localFont from 'next/font/local';

export const sairaFont = localFont({
  src: [
    {
      path: './Saira/Saira-Medium.ttf',
      weight: '500',
      style: 'medium',
    },
    {
      path: './Saira/Saira-SemiBold.ttf',
      weight: '600',
      style: 'semibold',
    },
  ],
  variable: '--font-saira',
});

export const determinationFont = localFont({
  src: [
    {
      path: './Determination/SVN-Determination.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-determination',
});
