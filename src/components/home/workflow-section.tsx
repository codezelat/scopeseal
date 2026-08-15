import { ThemeImage } from "./theme-image";
import styles from "./home-page.module.css";

const steps = [
  {
    number: "01",
    title: "Paste Your Brief",
    description: "Paste a project brief, client email, or proposal",
    darkSrc: "/images/home/workflow-paste-dark.png",
    lightSrc: "/images/home/workflow-paste-light.png",
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "AI checks your brief for missing requirements",
    darkSrc: "/images/home/workflow-analyze-dark.png",
    lightSrc: "/images/home/workflow-analyze-light.png",
  },
  {
    number: "03",
    title: "Clarity Report",
    description: "Get a clear report with your score, improvement.",
    darkSrc: "/images/home/workflow-report-dark.png",
    lightSrc: "/images/home/workflow-report-light.png",
  },
] as const;

export function WorkflowSection() {
  return (
    <section className={styles.workflowSection} id="how-it-works" aria-labelledby="workflow-heading">
      <div className={styles.centeredIntro}>
        <h2 id="workflow-heading">How ScopeSeal Analyzes Your Brief</h2>
        <p>Watch a vague client brief become a project-ready scope</p>
      </div>
      <ol className={styles.workflowGrid}>
        {steps.map((step) => (
          <li key={step.number}>
            <div className={styles.stepHeader}>
              <span>{step.number}</span>
              <i aria-hidden="true" />
            </div>
            <div className={styles.stepCopy}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <ThemeImage
              className={styles.stepImage}
              darkSrc={step.darkSrc}
              lightSrc={step.lightSrc}
              alt={`${step.title} step preview`}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
