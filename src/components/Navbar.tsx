// src/app/components/Navbar.tsx
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar() {
  return (
    <nav 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 20px', 
        height: '60px',
        backgroundColor: '#f5f5f5', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}
    >
      {/* Home icon on the left */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
        <HomeIcon fontSize="large" /> 
      </Link>

      {/* Links on the right */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
          Features
        </Link>
        <Link href="/properties/" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
          Impact
        </Link>
        <Link href="/googlereviews" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
          How it works 
        </Link>
         <Link href="/googlereviews" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
          Contact
        </Link>
         <Link href="/googlereviews" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>
          Get started
        </Link>
      </div>
    </nav>
  );
}
