// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Centered Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
        <h1>SautiCare</h1>
        <p style={{ fontSize: '18px', marginTop: '20px', color: '#555' }}>
          SautiCare is a speech tutor app for learners with speech impairments. Through simple nutrition and hygiene lessons, it helps students practice speech, gain confidence, and build everyday life skills.
        </p>
        {/* <div style={{ flex: 1 }}>
            <Image
              src="/images/illustration_dashboard.png"
              alt="Dashboard Illustration"
              width={400}
              height={300}
              style={{ borderRadius: '12px' }}
            />
          </div> */}
      </main>
    </div>
  );
}
