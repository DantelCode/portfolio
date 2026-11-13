import About from "@/components/About";
import Architecture from "@/components/Architecture";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projects />
      <Timeline />
      <Architecture />
      <About />
      <Footer />
    </>
  );
}
