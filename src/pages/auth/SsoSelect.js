import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormTop from "../../components/loader/formTop";

export default function SsoSelect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    navigate(`/account-center?${params.toString()}`, { replace: true });
  }, [navigate, params]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--theme)]">
      <FormTop />
    </div>
  );
}