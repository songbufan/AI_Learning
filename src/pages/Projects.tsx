import { Helmet } from 'react-helmet-async';
import { resume } from '../data/resume';

export function Projects() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#e8eeff', padding: '80px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Helmet>
        <title>Projects — {resume.about.name} | Interactive 3D Portfolio</title>
        <meta name="description" content={`Selected projects by ${resume.about.name}, a ${resume.about.role}.`} />
      </Helmet>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', color: '#c8d8ff', margin: '0 0 24px' }}>Projects</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {resume.projects.map((project) => (
            <article
              key={project.name}
              style={{
                background: 'rgba(255 255 255 / 0.04)',
                border: '1px solid rgba(255 255 255 / 0.08)',
                borderRadius: 12,
                padding: 22
              }}
            >
              <h3 style={{ color: '#99bbff', margin: '0 0 8px' }}>{project.name}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255 255 255 / 0.7)', margin: '0 0 12px' }}>{project.desc}</p>
              <ul
                style={{
                  margin: '0 0 14px',
                  padding: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6
                }}
              >
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 20,
                      background: 'rgba(100 130 255 / 0.15)',
                      color: '#99bbff',
                      border: '1px solid rgba(100 130 255 / 0.25)'
                    }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              {project.url && (
                <a href={project.url} rel="noopener" style={{ fontSize: 13, color: '#88aaff', textDecoration: 'none' }}>
                  View project →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
