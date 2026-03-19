"use client";

import { useState, useEffect } from 'react';

const getDevice = () => {
  if (typeof window === "undefined") return { isMobile: false, isTablet: false };

  return {
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  };
};

export const useIsMobile = () => {
  const [{ isMobile, isTablet }, setDevice] = useState(getDevice);

  useEffect(() => {
    const checkScreenSize = () => {
      setDevice(getDevice());
    };

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// export const useIsMobile = () => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
//     };

//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
// };

// const getDevice = () => {
//   if (typeof window === "undefined") return { isMobile: false, isTablet: false };

//   return {
//     isMobile: window.innerWidth < 768,
//     isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
//   };
// };

// export const useIsMobile = () => {
//   const [{ isMobile, isTablet }, setDevice] = useState(getDevice);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setDevice(getDevice());
//     };

//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
// };