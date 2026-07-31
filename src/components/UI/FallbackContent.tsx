import { useSceneStore } from '../../stores';
import { resume } from '../../data/resume';
import styles from './FallbackContent.module.css';

export function FallbackContent() {
  const { webgl } = useSceneStore();

  return (
    <div className={`${styles.fallbackRoot} ${webgl.supported && webgl.checked ? styles.webglHidden : ''}`}>
      <header className={styles.fbHeader}>
        <div className={styles.fbContainer}>
          <h1>{resume.about.name}</h1>
          <p className={styles.tagline}>{resume.about.role}</p>
          {resume.contact.available && (
            <span className={styles.badge}>Open to opportunities</span>
          )}
        </div>
      </header>

      <main className={styles.fbContainer}>
        <section id="about" aria-labelledby="about-heading">
          <h2 id="about-heading">About Me</h2>
          <p>{resume.about.bio}</p>
          <ul className={styles.factsList}>
            {resume.about.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <div className={styles.links}>
            {resume.about.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className={`${styles.fbLink} ${link.type === 'primary' ? styles.primary : styles.secondary}`}
                rel="noopener"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-heading">
          <h2 id="skills-heading">Skills &amp; Technologies</h2>
          <div className={styles.skillGrid}>
            <article>
              <h3>Frontend</h3>
              <ul>
                {resume.skills.frontend.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>Backend</h3>
              <ul>
                {resume.skills.backend.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>Tools &amp; DevOps</h3>
              <ul>
                {resume.skills.tools.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading">Projects</h2>
          <div className={styles.projectGrid}>
            {resume.projects.map((project) => (
              <article key={project.name} className={styles.projectCard}>
                <h3>{project.name}</h3>
                <p>{project.desc}</p>
                <ul className={styles.techList} aria-label="Technologies used">
                  {project.tech.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                {project.url && (
                  <a href={project.url} rel="noopener" className={styles.projectLink}>View project →</a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Contact</h2>
          <address className={styles.address}>
            <dl className={styles.dl}>
              <dt>Email</dt>
              <dd><a href={`mailto:${resume.contact.email}`}>{resume.contact.email}</a></dd>

              <dt>GitHub</dt>
              <dd><a href={`https://${resume.contact.github}`} rel="noopener">{resume.contact.github}</a></dd>

              <dt>LinkedIn</dt>
              <dd><a href={`https://${resume.contact.linkedin}`} rel="noopener">{resume.contact.linkedin}</a></dd>

              <dt>Twitter</dt>
              <dd>{resume.contact.twitter}</dd>

              <dt>Location</dt>
              <dd>{resume.contact.location}</dd>
            </dl>
          </address>
        </section>
      </main>
    </div>
  );
}
