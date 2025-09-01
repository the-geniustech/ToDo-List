import Image from "next/image";
import React, { useState } from "react";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${
        className ?? ""
      }`}
      style={style}
    >
      <div className="flex justify-center items-center w-full h-full">
        <Image
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={src}
          width={500}
          height={500}
        />
      </div>
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
      width={500}
      height={500}
    />
  );
}

// import Image from "next/image";
// import React, { useState } from "react";

// interface ImageWithFallbackProps
//   extends React.ImgHTMLAttributes<HTMLImageElement> {
//   src: string;
//   alt: string;
//   fallback?: string;
//   className?: string;
// }

// export function ImageWithFallback({
//   src,
//   alt,
//   fallback,
//   className = "",
//   ...props
// }: ImageWithFallbackProps) {
//   const [imgSrc, setImgSrc] = useState(src);
//   const [isError, setIsError] = useState(false);

//   const handleError = () => {
//     if (!isError) {
//       setIsError(true);
//       if (fallback) {
//         setImgSrc(fallback);
//       } else {
//         // Use a default fallback or placeholder
//         setImgSrc(
//           "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=="
//         );
//       }
//     }
//   };

//   return (
//     <Image
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       onError={handleError}
//       {...props}
//       width={500}
//       height={500}
//     />
//   );
// }
