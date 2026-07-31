import { Helmet } from 'react-helmet-async';
import { resume } from '../data/resume';

export function Contact() {
  const { contact, about } = resume;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#e8eeff', padding: '80px 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Helmet>
        <title>Contact — {about.name} | Interactive 3D Portfolio</title>
        <meta name="description" content={`Get in touch with ${about.name}, a ${about.role} based in ${contact.location}.`} />
      </Helmet>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', color: '#c8d8ff', margin: '0 0 8px' }}>Contact</h1>
        <p style={{ color: '#7799ff', fontSize: 20, margin: '0 0 24px' }}>{about.role}</p>

        {contact.available && (
          <span style={{
            display: 'inline-block',
            marginBottom: 24,
            padding: '4px 12px',
            borderRadius: 20,
            background: 'rgba(80 200 120 / 0.15)',
            color: '#80e8a0',
            border: '1px solid rgba(80 200 120 / 0.3)',
            fontSize: 13,
            fontWeight: 600
          }}>
            Open to opportunities
          </span>
        )}

        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', fontSize: 15 }}>
          <dt style={{ fontWeight: 600, color: 'rgba(255 255 255 / 0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>Email</dt>
          <dd style={{ margin: 0, color: 'rgba(255 255 255 / 0.8)' }}><a href={`mailto:${contact.email}`} style={{ color: '#88aaff', textDecoration: 'none' }}>{contact.email}</a></dd>

          <dt style={{ fontWeight: 600, color: 'rgba(255 255 255 / 0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>GitHub</dt>
          <dd style={{ margin: 0, color: 'rgba(255 255 255 / 0.8)' }}><a href={`https://${contact.github}`} rel="noopener" style={{ color: '#88aaff', textDecoration: 'none' }}>{contact.github}</a></dd>

          <dt style={{ fontWeight: 600, color: 'rgba(255 255 255 / 0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>LinkedIn</dt>
          <dd style={{ margin: 0, color: 'rgba(255 255 255 / 0.8)' }}><a href={`https://${contact.linkedin}`} rel="noopener" style={{ color: '#88aaff', textDecoration: 'none' }}>{contact.linkedin}</a></dd>

          <dt style={{ fontWeight: 600, color: 'rgba(255 255 255 / 0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>Twitter</dt>
          <dd style={{ margin: 0, color: 'rgba(255 255 255 / 0.8)' }}>{contact.twitter}</dd>

          <dt style={{ fontWeight: 600, color: 'rgba(255 255 255 / 0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>Location</dt>
          <dd style={{ margin: 0, color: 'rgba(255 255 255 / 0.8)' }}>{contact.location}</dd>
        </dl>
      </div>
    </div>
  );
}
