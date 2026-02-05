import Navbar from "@/app/components/LandingPage/Navbar";
import Hero from "@/app/components/LandingPage/Hero";
import Academics from "@/app/components/LandingPage/Academics";
import Facilities from "@/app/components/LandingPage/Facilities";
import Teachers from "@/app/components/LandingPage/Teachers";
import { FadeInSection } from "@/app/components/LandingPage/FadeInSection";
import Footer from "@/app/components/LandingPage/Footer";
import About from "@/app/components/LandingPage/About";
import MeritoriousStudents from "@/app/components/LandingPage/MeritoriusStudents";

export default async function HomePage() {
  return (
    <main className="min-h-screen relative scroll-smooth">
      {/* Navbar */}
      <Navbar />

      <section
        id="home"
      >
        <FadeInSection>
          <div className="px-0 md:px-12 lg:px-5 pb-12">
            <Hero />
          </div>
        </FadeInSection>
      </section>

      {/* Academics Section */}
      <section
        id="academics"
        className="py-12 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-r from-yellow-100 via-green-100 to-cyan-100"
      >
        <FadeInSection>
          <Academics />
        </FadeInSection>
      </section>

      {/* Facilities Section */}
      <section
        id="facilities"
        className="py-12 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50"
      >
        <FadeInSection>
          <Facilities />
        </FadeInSection>
      </section>

      {/* Meritorious Students Section */}
      <section id="meritorious" className="py-12 md:py-20 px-4 sm:px-6 md:px-20">
        <FadeInSection>
          <MeritoriousStudents />
        </FadeInSection>
      </section>

      {/* Teachers Section */}
      <section
        id="teachers"
        className="py-12 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-r from-green-50 via-lime-50 to-yellow-50"
      >
        <FadeInSection>
          <Teachers />
        </FadeInSection>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-12 md:py-20 px-4 sm:px-6 md:px-20 bg-gradient-to-r from-green-50 via-lime-50 to-yellow-50"
      >
        <FadeInSection>
          <About />
        </FadeInSection>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
