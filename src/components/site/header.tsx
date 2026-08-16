import { HomeHeader } from "@/components/home/home-header";
import styles from "@/components/home/home-page.module.css";

export function Header() {
  return (
    <div className={styles.home}>
      <HomeHeader />
    </div>
  );
}
