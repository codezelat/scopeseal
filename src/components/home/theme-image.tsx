import Image from "next/image";
import styles from "./home-page.module.css";

type ThemeImageProps = {
  alt: string;
  className?: string;
  darkSrc: string;
  lightSrc: string;
  sizes?: string;
};

export function ThemeImage({
  alt,
  className = "",
  darkSrc,
  lightSrc,
  sizes = "(max-width: 800px) calc(100vw - 64px), 560px",
}: ThemeImageProps) {
  return (
    <span
      className={`${styles.themeImage} ${className}`}
      role="img"
      aria-label={alt}
    >
      <Image
        className={styles.themeImageLight}
        src={lightSrc}
        alt=""
        fill
        sizes={sizes}
      />
      <Image
        className={styles.themeImageDark}
        src={darkSrc}
        alt=""
        fill
        sizes={sizes}
      />
    </span>
  );
}
