import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./home-page.module.css";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Project Manager, Nexora Studio",
    quote:
      "We now review every client brief with ScopeSeal. It makes vague requirements clear before our team starts working.",
    image: "/images/home/avatar-sarah.jpg",
  },
  {
    name: "Daniel Lee",
    role: "Creative Director, PixelCraft",
    quote:
      "The risk detection is incredibly useful. We caught unclear payment terms and timeline issues within seconds.",
    image: "/images/home/avatar-daniel.jpg",
  },
  {
    name: "Emma Wilson",
    role: "Freelance UI/UX Designer",
    quote:
      "ScopeSeal gives our team confidence before accepting a project. We know exactly what clarification before work begins.",
    image: "/images/home/avatar-emma.jpg",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection} id="testimonials" aria-labelledby="testimonials-heading">
      <div className={styles.testimonialsTop}>
        <div className={styles.sectionIntro}>
          <h2 id="testimonials-heading">Trusted By Teams Who Value Clear Scope</h2>
          <p>
            See how ScopeSeal helps freelancers, agencies, and software teams prevent unclear
            requirements and costly revisions.
          </p>
        </div>
        <div className={styles.testimonialArrows} aria-hidden="true">
          <ArrowLeft />
          <ArrowRight />
        </div>
      </div>
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial) => (
          <figure className={styles.testimonialCard} key={testimonial.name}>
            <figcaption>
              <Image src={testimonial.image} alt="" width={44} height={44} sizes="44px" />
              <span>
                <strong>{testimonial.name}</strong>
                <small>{testimonial.role}</small>
              </span>
            </figcaption>
            <blockquote>“{testimonial.quote}”</blockquote>
            <div className={styles.stars} aria-label="5 out of 5 stars">
              ★★★★★
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
