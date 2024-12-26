import { AuthProvider } from "../contexts/authContext";
import { HomeProvider } from "../contexts/homeContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <HomeProvider>{children}</HomeProvider>
    </AuthProvider>
  );
}
