import AdminApp from "@/components/AdminApp";
import { ToastProvider } from "@/components/ToastProvider";

export default function Home() {
  return (
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  );
}
