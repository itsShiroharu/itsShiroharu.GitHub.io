'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '/app/header.js';
import Footer from '/app/footer.js';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="tool-page">
      <Header />
      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">500</div>
          <h1>Internal Server Error</h1>
          <p className="lede">
            An unexpected error occurred while loading this page. This is because the problem is on our end and not your fault. Please try again or head back home.
          </p>
          <div className="cta-row" style={{ marginTop: '24px' }}>
            <button className="btn btn-primary" onClick={() => reset()}>
              Try again
            </button>
            <Link href="/" className="btn btn-ghost">
              Return home
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
