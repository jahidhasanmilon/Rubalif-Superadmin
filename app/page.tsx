import AdminApp from "@/components/AdminApp";
import { ToastProvider } from "@/components/ToastProvider";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  );
}
