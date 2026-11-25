import Preloader from "@/components/Preloader";
import Nav from "@/sections/Nav";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Projects from "@/sections/Projects";
import Process from "@/sections/Process";
import Services from "@/sections/Services";
import Stack from "@/sections/Stack";
import Experience from "@/sections/Experience";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Process />
        <Services />
        <Stack />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
