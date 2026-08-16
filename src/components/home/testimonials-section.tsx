"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { HomeMotionSection } from "./home-motion";
import styles from "./home-page.module.css";

const profiles = [
  {
    name: "Maya Perera",
    role: "Agency Delivery Lead",
    type: "Agency workflow",
    description: "Maya checks ownership, deadlines, and revision boundaries before every kickoff.",
    image: "/images/home/profile-maya-perera.webp",
  },
  {
    name: "Adrian Cole",
    role: "Creative Director",
    type: "Client intake",
    description: "Adrian turns vague requests into clear questions before his team estimates the work.",
    image: "/images/home/profile-adrian-cole.webp",
  },
  {
    name: "Lena Park",
    role: "Product Designer",
    type: "Freelance projects",
    description: "Lena reviews every brief for missing deliverables, feedback limits, and approvals.",
    image: "/images/home/profile-lena-park.webp",
  },
  {
    name: "Tomas Reed",
    role: "Technical Project Manager",
    type: "Software delivery",
    description: "Tomas catches unclear dependencies and acceptance criteria before planning begins.",
    image: "/images/home/profile-tomas-reed.webp",
  },
] as const;

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const orderedProfiles = profiles.map((_, offset) => {
    const originalIndex = (activeIndex + offset) % profiles.length;
    return { profile: profiles[originalIndex], originalIndex };
  });

  function goTo(index: number) {
    const nextIndex = (index + profiles.length) % profiles.length;
    setActiveIndex(nextIndex);
  }

  return (
    <HomeMotionSection className={styles.testimonialsSection} id="profiles" aria-labelledby="profiles-heading">
      <div className={styles.testimonialsTop}>
        <div className={styles.sectionIntro}>
          <h2 id="profiles-heading">Built For Teams Who Value Clear Scope</h2>
          <p>See how different roles use a scope check before work begins.</p>
        </div>
        <div className={styles.testimonialControls} aria-label="Profile carousel controls">
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous profile">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next profile">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={styles.testimonialViewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="ScopeSeal user profiles"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(activeIndex - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(activeIndex + 1);
          }
        }}
      >
        <div className={styles.testimonialGrid}>
          {orderedProfiles.map(({ profile, originalIndex }) => (
            <motion.article
              className={styles.testimonialCard}
              key={profile.name}
              layout="position"
              aria-label={`${profile.name}, ${originalIndex + 1} of ${profiles.length}`}
              whileHover={reducedMotion ? undefined : { y: -4 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              <div className={styles.profileHeader}>
                <span className={styles.testimonialAvatar}>
                  <Image src={profile.image} alt="" fill sizes="52px" />
                </span>
                <span>
                  <strong>{profile.name}</strong>
                  <small>{profile.role}</small>
                </span>
              </div>
              <p className={styles.profileDescription}>{profile.description}</p>
              <span className={styles.profileType}>{profile.type}</span>
            </motion.article>
          ))}
        </div>
      </div>
      <div className={styles.testimonialPagination} aria-label="Choose a profile">
        {profiles.map((profile, index) => (
          <button
            key={profile.name}
            type="button"
            aria-label={`Show ${profile.name}`}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Profile {activeIndex + 1} of {profiles.length}</p>
    </HomeMotionSection>
  );
}
