import Link from 'next/link';

const styles = {
  container: {
    minHeight: '100dvh',
    background: 'linear-gradient(to bottom, #000000, #020617, #000000)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    color: 'white',
  },
  title: {
    fontSize: '6rem',
    fontWeight: 700,
    color: 'rgba(6, 182, 212, 0.8)',
    marginBottom: '1rem',
    lineHeight: 1,
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  text: {
    color: '#94a3b8',
    marginBottom: '2rem',
  },
  link: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: 'linear-gradient(to right, #06b6d4, #2563eb)',
    color: 'white',
    fontWeight: 600,
    borderRadius: '0.5rem',
    textDecoration: 'none',
  },
};

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'center' as const, maxWidth: '28rem' }}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Página no encontrada</h2>
        <p style={styles.text}>
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/" style={styles.link}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
