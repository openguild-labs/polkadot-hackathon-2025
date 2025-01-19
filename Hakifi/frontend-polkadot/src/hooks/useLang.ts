"use client"

import { useParams } from 'next/navigation';

const useLang = () => {
  const { lang } = useParams();

  return (lang as string) || "en";
};

export default useLang;
