import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatIsKratom from "@/components/WhatIsKratom";
import Branches from "@/components/Branches";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";

export default function Home() {
  return (
    <>
      <AgeGate />
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhatIsKratom />
        <Branches />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
