import { Helmet } from 'react-helmet-async';
import { resume } from '../../data/resume';

const personSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: resume.about.name,
  jobTitle: resume.about.role,
  description: resume.about.bio,
  email: `mailto:${resume.contact.email}`,
  url: 'https://alexmorgan.dev',
  sameAs: [
    `https://${resume.contact.github}`,
    `https://${resume.contact.linkedin}`
  ],
  knowsAbout: [
    ...resume.skills.frontend,
    ...resume.skills.backend,
    ...resume.skills.tools
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: resume.contact.location
  }
});

const creativeWorkSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: `${resume.about.name} — Interactive 3D Portfolio`,
  description: `An interactive 3D resume built with Three.js and React, showcasing ${resume.about.role} skills.`,
  author: { '@type': 'Person', name: resume.about.name },
  url: 'https://alexmorgan.dev',
  keywords: 'frontend developer portfolio, Three.js developer, React portfolio, interactive resume, WebGL resume',
  inLanguage: 'en'
});

const SITE_URL = 'https://alexmorgan.dev';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" />

        {/* Primary SEO */}
        <title>{resume.about.name} — {resume.about.role} | Interactive 3D Portfolio</title>
        <meta name="description" content={`Portfolio of ${resume.about.name}, a ${resume.about.role} based in ${resume.contact.location}. ${resume.about.bio}`} />
        <meta name="keywords" content={`frontend developer portfolio, ${resume.about.name}, Three.js developer, React developer, WebGL portfolio, interactive resume, creative developer, ${resume.skills.frontend.join(', ')}`} />
        <meta name="author" content={resume.about.name} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={`${resume.about.name} — Interactive 3D Portfolio`} />
        <meta property="og:description" content={`${resume.about.bio} Based in ${resume.contact.location}.`} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`Preview of ${resume.about.name}'s interactive 3D portfolio room`} />
        <meta property="og:site_name" content={`${resume.about.name} Portfolio`} />
        <meta property="og:locale" content="en_US" />
        <meta property="profile:first_name" content={resume.about.name.split(' ')[0]} />
        <meta property="profile:last_name" content={resume.about.name.split(' ')[1]} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={resume.contact.twitter} />
        <meta name="twitter:creator" content={resume.contact.twitter} />
        <meta name="twitter:title" content={`${resume.about.name} — Interactive 3D Portfolio`} />
        <meta name="twitter:description" content={resume.about.bio} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Performance hints */}
        <meta name="theme-color" content="#0d0d1a" />
        <meta name="color-scheme" content="dark" />
      </Helmet>

      {/* JSON-LD structured data */}
      <Helmet>
        <script type="application/ld+json">{personSchema}</script>
        <script type="application/ld+json">{creativeWorkSchema}</script>
      </Helmet>

      {children}
    </>
  );
}
