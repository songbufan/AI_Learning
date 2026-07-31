import { Helmet } from 'react-helmet-async';
import { resume } from '../data/resume';

export function About() {
  const { about, contact } = resume;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#e8eeff', padding: '80px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Helmet>
        <title>About — {about.name} | Interactive 3D Portfolio</title>
        <meta name="description" content={`Learn more about ${about.name}, a ${about.role} based in ${contact.location}. ${about.bio}`} />
      </Helmet>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', color: '#c8d8ff', margin: '0 0 8px' }}>{about.name}</h1>
        <p style={{ color: '#7799ff', fontSize: 20, margin: '0 0 24px' }}>{about.role}</p>
        <p style={{ lineHeight: 1.7, color: 'rgba(255 255 255 / 0.7)', margin: '0 0 24px' }}>{about.bio}</p>

        <h2 style={{ color: '#c8d8ff', fontSize: 22, margin: '40px 0 16px' }}>Quick Facts</h2>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          {about.facts.map((fact) => (
            <li key={fact} style={{ color: 'rgba(255 255 255 / 0.65)' }}>▸ {fact}</li>
          ))}
        </ul>

        <h2 style={{ color: '#c8d8ff', fontSize: 22, margin: '40px 0 16px' }}>Links</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {about.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              rel="noopener"
              style={{
                padding: '8px 20px',
                borderRadius: 24,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                background: link.type === 'primary' ? 'rgba(100 130 255 / 0.25)' : 'rgba(255 255 255 / 0.06)',
                border: `1px solid ${link.type === 'primary' ? 'rgba(100 130 255 / 0.4)' : 'rgba(255 255 255 / 0.15)'}`,
                color: link.type === 'primary' ? '#c8d8ff' : 'rgba(255 255 255 / 0.7)'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
