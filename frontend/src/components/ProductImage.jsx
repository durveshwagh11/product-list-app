import { useState } from "react";
import { ImageOffIcon } from "lucide-react";

// image with a placeholder for missing/broken URLs (also used for live previews)
function ProductImage({ src, alt, className = "" }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={`grid place-items-center bg-base-300 text-base-content/25 ${className}`}
        role="img"
        aria-label={alt || "No image"}
      >
        <ImageOffIcon className="size-10" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}
export default ProductImage;
