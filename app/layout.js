import './globals.css';

export const metadata = {
  metadataBase: new URL('https://shiroharu.eu.org'),
  title: 'Shengwei Xiong – Junior Developer',
  description:
    "I'm Shengwei Xiong. Known online as Shiroharu and itsShiroharu. I am a Junior Developer. I'm passionate about creating simple–yet efficient and user-friendly web applications.",
  keywords: [
    'Junior Developer',
    'Full-Stack Developer',
    'Web Developer',
    'Portfolio',
    'Personal Website',
    'Next.js v14',
    'React v18',
    'JavaScript',
    'Shiroharu',
    'Shir0haru',
    'itsShiroharu',
    'Chris Xiong',
    'Shengwei Xiong',
    '熊聖偉',
    'Chris',
    'Shengwei',
    '聖偉',
    'Xiong',
    '熊',
    'Tools',
    'Minecraft',
    'Stardew Valley',
  ],
  authors: [{ name: 'Shengwei Xiong', url: 'https://shiroharu.eu.org' }],
  creator: 'Shengwei Xiong',
  publisher: 'Shengwei Xiong',
  robots: 'index, follow',
  openGraph: {
    title: 'Shengwei Xiong – Junior Developer',
    description:
      "I'm Shengwei Xiong. Known online as Shiroharu and itsShiroharu. I am a Junior Developer. I'm passionate about creating simple–yet efficient and user-friendly web applications.",
    url: 'https://shiroharu.eu.org',
    type: 'website',
    images: [{ url: 'https://shiroharu.eu.org/images/profile.webp' }],
    email: 'contact@shiroharu.eu.org',
    phone: '+1-807-799-8998',
    locale: 'en_US',
  },
  twitter: {
    title: 'Shengwei Xiong – Junior Developer',
    description:
      "I'm Shengwei Xiong. Known online as Shiroharu and itsShiroharu. I am a Junior Developer. I'm passionate about creating simple–yet efficient and user-friendly web applications.",
    images: ['https://shiroharu.eu.org/images/profile.webp'],
    creator: '@Shengwei_Xiong',
    site: '@Shengwei_Xiong',
  },
  alternates: {
    canonical: 'https://shiroharu.eu.org',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#35A597" />
        <meta name="author" content="Shengwei Xiong, contact@shiroharu.eu.org" />
        <meta name="owner" content="Shengwei Xiong, contact@shiroharu.eu.org" />
        <meta name="url" content="https://shiroharu.eu.org" />
        <meta name="identifier-URL" content="https://shiroharu.eu.org" />
        <meta name="pagename" content="Shengwei Xiong – Junior Developer" />
        <meta name="category" content="Website" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name='og:latitude' content='48.4866459' />
        <meta name='og:longitude' content='-89.2419698' />
        <meta name='og:street-address' content='587 Onion Lake Road' />
        <meta name='og:locality' content='Thunder Bay' />
        <meta name='og:region' content='ON' />
        <meta name='og:postal-code' content='P7G 2B9' />
        <meta name='og:country-name' content='Canada' />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <script type = "application/ld+json" dangerouslySetInnerHTML = {{__html: JSON.stringify({'@context': 'https://schema.org', '@type': 'WebSite', name: 'Shengwei Xiong – Junior Developer', alternateName: 'Shiroharu', url: 'https://shiroharu.eu.org/',}),}} />
      </head>
      <body>
        {children}
        <a rel="me" href="https://mstdn.ca/@shiroharu" style={{ display: "none" }}>Mastodon</a>
      </body>
    </html>
  );
}
