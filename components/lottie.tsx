"use client"

import Lottie from "lottie-react";
import { useRef } from "react";

export default function LottieComponent({ animationData, width, height }: { animationData: any, width?: number, height?: number}) {
  const lottieRef = useRef(null);

  return (
    <Lottie 
      lottieRef={lottieRef}
      animationData={animationData} 
      width={width} 
      height={height} 
      loop={false}
      onEnterFrame={(e: any) => {
        let time = Math.floor(e.currentTime);


        if (time === 390) {
          // @ts-ignore
          lottieRef.current?.pause();
        }
      }}
    />
  )
}
