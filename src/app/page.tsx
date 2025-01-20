import { PlataformaSqlIa } from "@/components/plataforma-sql-ia";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <PlataformaSqlIa />
    </ProtectedRoute>
  );
}
