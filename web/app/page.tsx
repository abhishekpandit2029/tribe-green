import { CatalogueSection } from "../components/catalogue/CatalogueSection";
import {
  HomeClosingSections,
  HomeHero,
  PromiseBand,
} from "../components/home/HomeSections";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <PromiseBand />
      <CatalogueSection />
      <HomeClosingSections />
    </main>
  );
}
