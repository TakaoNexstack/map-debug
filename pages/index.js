import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  suspense: false,
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.container}>
      <MapComponent />
    </div>
  );
}
