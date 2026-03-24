'use client';

import { memo } from 'react';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Footer } from '@/shared/components';
import { GSAPGlowBlob } from '@/shared/components/GSAPGlowBlob';

import {
  HeroSection,
  AreasSection,
  FeaturesSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection,
} from '@/features/home/components';

const GLOW_EFFECTS = [
  {
    position: 'top-1/3 left-1/4',
    size: 'w-96 h-96',
    color: 'bg-blue-500/30',
    delay: 0,
  },
  {
    position: 'bottom-1/3 right-1/4',
    size: 'w-96 h-96',
    color: 'bg-purple-500/30',
    delay: 1,
  },
  {
    position: 'top-2/3 left-3/4',
    size: 'w-72 h-72',
    color: 'bg-indigo-500/20',
    delay: 0.5,
  },
];

const HomePageDesktopComponent = ({
  expandedFaq,
  setExpandedFaq,
  onDemoAccess,
}: {
  expandedFaq: number | null;
  setExpandedFaq: React.Dispatch<React.SetStateAction<number | null>>;
  onDemoAccess: () => void;
}) => {
  // Scroll animation refs
  const areasSection = useScrollAnimation();
  const whyChooseSection = useScrollAnimation();
  const testimonialSection = useScrollAnimation();
  const faqSection = useScrollAnimation();

  return (
    <div className="min-h-dvh overflow-x-hidden bg-linear-to-b from-black via-slate-950 to-black text-white">
      {/* Background glow effects with improved visuals */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden lg:px-20"
        role="presentation"
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/50" />
        {GLOW_EFFECTS.map((effect, index) => (
          <GSAPGlowBlob
            key={`glow-${index}`}
            className={`absolute ${effect.position} ${effect.size} ${effect.color} rounded-full blur-3xl`}
            delay={effect.delay}
          />
        ))}
        {/* Radial gradient overlay */}
        <div className="radial-gradient pointer-events-none absolute inset-0" />
      </div>

      {/* Main Content with improved spacing and transitions */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-0">
          <HeroSection onDemoAccess={onDemoAccess} />
        </section>

        {/* Areas Section with visual separator */}
        <section className="relative overflow-hidden py-8 md:py-12">
          <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
          <AreasSection areasSection={areasSection} />
        </section>

        {/* Features Section */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <FeaturesSection whyChooseSection={whyChooseSection} />
        </section>

        {/* Testimonials Section with visual separator */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
          <TestimonialsSection testimonialSection={testimonialSection} />
        </section>

        {/* FAQ Section */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <FAQSection
            faqSection={faqSection}
            expandedFaq={expandedFaq}
            setExpandedFaq={setExpandedFaq}
          />
        </section>

        {/* Final CTA Section */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
          <FinalCTASection />
        </section>

        <Footer />
      </div>
    </div>
  );
};

export const HomePageDesktop = memo(HomePageDesktopComponent);
