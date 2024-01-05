import { Toaster } from 'sonner';
import "../styles/globals.css";
import AppBar from '../components/layout/AppBar';
import Footer from '../components/layout/Footer';
import LayoutWrapper from './LayoutWrapper';


require("@solana/wallet-adapter-react-ui/styles.css");

export const metadata = {
  title: 'Superteam Validator',
  description: 'Generated by Next.js',
};

export default async function RootLayout({ children }: any) {

  return (
    <LayoutWrapper >
      <html lang="en">
        <body>
          <AppBar />
          <main className={``}>
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </body>
      </html>
    </LayoutWrapper>

  );
}
