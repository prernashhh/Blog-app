import "@/styles/globals.css";
import Layout from "../components/Layout";
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Define routes that should skip the layout
  const noLayoutRoutes = ['/admin/login'];

  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {isNoLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}
