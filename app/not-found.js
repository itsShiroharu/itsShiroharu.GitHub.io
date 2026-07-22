'use client';

import Link from 'next/link';
import Header from '/app/header.js';
import Footer from '/app/footer.js';

export default function NotFound() {
  return (
    <main className="tool-page">
      <Header />
      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">404</div>
          <h1>Not Found</h1>
          <p className="lede">
            The page you were looking for doesn't really exist or may have moved.
          </p>
          <div className="cta-row" style={{ marginTop: '24px' }}>
            <Link href="/" className="btn btn-primary">
              Return home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
