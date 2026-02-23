import { useState, useEffect } from "react";

interface BreedImageProps {
  src: string;
  alt: string;
  breedName: string;
}

export function BreedImage({ src, alt, breedName }: BreedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-100 to-orange-100">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading {breedName}...</p>
          </div>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-3xl font-serif text-gray-800 mb-2">{breedName}</h3>
            <p className="text-sm text-gray-600">Featured Breed</p>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => { setImageLoaded(true); setImageError(false); }}
        onError={() => { setImageError(true); setImageLoaded(false); }}
        loading="eager"
      />
    </div>
  );
}
