import type { CSSProperties } from "react";
import styles from "./home-page.module.css";

type ThemeImageProps = {
  alt: string;
  className?: string;
  darkSrc: string;
  lightSrc: string;
};

type ThemeImageStyle = CSSProperties & {
  "--image-dark": string;
  "--image-light": string;
};

export function ThemeImage({ alt, className = "", darkSrc, lightSrc }: ThemeImageProps) {
  const style: ThemeImageStyle = {
    "--image-dark": `url("${darkSrc}")`,
    "--image-light": `url("${lightSrc}")`,
  };

  return (
    <span
      className={`${styles.themeImage} ${className}`}
      role="img"
      aria-label={alt}
      style={style}
    />
  );
}
