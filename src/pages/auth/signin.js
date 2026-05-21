import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormTop from "../../components/loader/formTop";
import { useAuth } from "../../context/auth.context";
import {
  buildSignupFlowPath,
  normalizeAccountCenterReturnTo,
  writeAccountCenterAuthResult,
} from "../../utils/accountCenterFlow";

const DEFAULT_LOGIN_SUCCESS_PATH = "/myaccount";

const STEPS = {
  USERNAME: 0,
  PASSWORD: 1,
};

const INITIAL_FORM = {
  username: "",
  password: "",
};

const usernameRegex = /^[a-z0-9]+(\.[a-z0-9]+)*$/;

function normalizeUsername(value = "") {
  return value.toLowerCase().trim().split("@")[0];
}

function validateLoginStep(step, form) {
  const username = normalizeUsername(form.username);
  const password = form.password.trim();

  if (step === STEPS.USERNAME) {
    if (!username) return { field: "username", msg: "Enter username" };
    if (!usernameRegex.test(username)) {
      return { field: "username", msg: "Use lowercase letters, numbers, and dots only" };
    }
  }

  if (step === STEPS.PASSWORD) {
    if (!password) return { field: "password", msg: "Enter password" };
  }

  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo = normalizeAccountCenterReturnTo(rawReturnTo);

  const { login } = useAuth();

  const [step, setStep] = useState(STEPS.USERNAME);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const username = useMemo(() => normalizeUsername(form.username), [form.username]);

  useEffect(() => {
    if (rawReturnTo && !returnTo) {
      navigate("/serverError", { replace: true });
    }
  }, [navigate, rawReturnTo, returnTo]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const goBack = () => {
    setError(null);
    setStep(STEPS.USERNAME);
  };

  const goSignup = () => {
    navigate(returnTo ? buildSignupFlowPath(returnTo) : "/signup");
  };

  const submitUsername = () => {
    setStep(STEPS.PASSWORD);
  };

  const submitPassword = async () => {
    try {
      setLoading(true);

      const res = await login({
        username,
        password: form.password.trim(),
      });

      if (!res.success) {
        setError({
          field: res.field || "global",
          msg: res.msg || "Invalid credentials",
        });
        return;
      }

      setSuccess({ field: "global", msg: "Login successful" });
      setForm(INITIAL_FORM);
      if (returnTo) {
        writeAccountCenterAuthResult(returnTo, res);
        navigate(returnTo, { replace: true });
        return;
      }
      navigate(DEFAULT_LOGIN_SUCCESS_PATH, { replace: true });
    } catch (err) {
      setError({
        field: "global",
        msg: err?.message || err?.msg || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateLoginStep(step, form);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step === STEPS.USERNAME) {
      submitUsername();
      return;
    }

    await submitPassword();
  };

  return (
    <div className="container flex sm:justify-center items-center min-w-full bg-[var(--theme)]">
      <form
        onSubmit={handleSubmit}
        className={`gpu-safe max-w-lg w-full min-h-[100dvh] relative bg-[var(--theme)] px-4 lg:p-6 flex flex-col justify-evenly rounded-lg shadow-md shadow-[var(--border)] ${loading ? "form-busy" : ""
          }`}
      >
        {loading && (
          <>
            <div className="form-loading-layer" />
            <FormTop size={16} />
          </>
        )}

        <LoginHeader
          step={step}
          username={username}
          error={error}
          success={success}
          onBack={goBack}
        />

        {step === STEPS.USERNAME && (
          <UsernameStep
            value={form.username}
            error={error}
            onChange={handleChange}
            onSignup={goSignup}
          />
        )}

        {step === STEPS.PASSWORD && (
          <PasswordStep
            value={form.password}
            username={username}
            error={error}
            showPassword={showPassword}
            onChange={handleChange}
            onBack={goBack}
            onTogglePassword={setShowPassword}
          />
        )}
      </form>
    </div>
  );
}

function LoginHeader({ step, username, error, success, onBack }) {
  return (
    <div className="flex items-start flex-col gap-3">
      <img className="my-auto" src="/favicon.png" alt="Logo" width={30} height={30} />

      <h1 className="text-3xl font-semibold text-[var(--gray-900)]">
        {step === STEPS.USERNAME && "Sign in"}
        {step === STEPS.PASSWORD && (
          <button type="button" onClick={onBack} className="text-left">
            {username || "Welcome back"}
          </button>
        )}
      </h1>

      <p className="text-[var(--gray-600)] text-base">
        {step === STEPS.USERNAME && "Access more features with your account"}
        {step === STEPS.PASSWORD && "Enter your account password to login"}
      </p>

      {error?.field === "global" && <FieldError>{error.msg}</FieldError>}
      {success?.field === "global" && <div className="text-green-600 text-sm">{success.msg}</div>}
    </div>
  );
}

function UsernameStep({ value, error, onChange, onSignup }) {
  return (
    <>
      <div>
        <FloatingInput
          label="Username"
          name="username"
          value={value}
          autoFocus
          onChange={onChange}
        />

        {error?.field === "username" && <FieldError>{error.msg}</FieldError>}

        <button type="button" className="w-fit text-blue-600 cursor-pointer">
          Find your account?
        </button>
      </div>

      <Actions alignEnd>
        <button
          type="button"
          className="text-blue-700 hover:text-blue-500 font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={onSignup}
        >
          Create account
        </button>

        <PrimaryButton>Next</PrimaryButton>
      </Actions>

      <SocialButtons />
    </>
  );
}

function PasswordStep({ value, error, showPassword, onChange, onBack, onTogglePassword }) {
  return (
    <>
      <div>
        <FloatingInput
          type={showPassword ? "text" : "password"}
          label="Password"
          name="password"
          value={value}
          autoFocus
          onChange={onChange}
        />

        {error?.field === "password" && <FieldError>{error.msg}</FieldError>}

        <label className="w-fit text-blue-700 flex justify-center items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => onTogglePassword(e.target.checked)}
          />
          Show password
        </label>
      </div>

      <Actions>
        <BackButton onClick={onBack} />
        <PrimaryButton>Next</PrimaryButton>
      </Actions>

      <div className="text-center text-sm text-gray-500">OR</div>

      <button type="button" className="text-blue-600 w-full text-sm hover:underline">
        Try another way to sign in?
      </button>
    </>
  );
}

function FloatingInput({ label, type = "text", name, value, onChange, ...props }) {
  return (
    <div className="floating-field">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="floating-input border-[var(--gray-400)] outline-[var(--blue-600)] text-[var(--gray-700)]"
        {...props}
      />
      <label className="floating-label">{label}</label>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="flex flex-col gap-6 text-center text-sm text-gray-500">
      <div>OR sign in with platforms</div>

      <div className="space-y-3">
        <SocialButton
          label="Continue with Google"
          icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        />
        <SocialButton label="Continue with Facebook" />
        <SocialButton label="Continue with GitHub" />
      </div>
    </div>
  );
}

function SocialButton({ label, icon }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--gray-700)] transition hover:bg-[var(--gray-100)] hover:border-[var(--gray-400)]"
    >
      {icon && <img src={icon} alt="" className="w-5 h-5" />}
      {label}
    </button>
  );
}

function Actions({ children, alignEnd = false }) {
  return (
    <div className={`flex items-center ${alignEnd ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end`}>
      {children}
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-slate-500 hover:text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      Back
    </button>
  );
}

function PrimaryButton({ children }) {
  return (
    <button
      type="submit"
      className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}

function FieldError({ children }) {
  return <div className="text-red-400 text-sm">{children}</div>;
}
