import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormTop from "../../components/loader/formTop";
import Loader from "../../components/loader/dotBounce";
import { useAuth } from "../../context/auth.context";
import api from "../../lib/services/api";
import {
  buildLoginFlowPath,
  normalizeAccountCenterReturnTo,
  writeAccountCenterAuthResult,
} from "../../utils/accountCenterFlow";

const DEFAULT_SIGNUP_SUCCESS_PATH = "/myaccount";

const STEPS = {
  NAME: 0,
  PROFILE: 1,
  USERNAME: 2,
  PASSWORD: 3,
  TERMS: 4,
};

const INITIAL_FORM = {
  name: "",
  dob: "",
  gender: "",
  username: "",
  password: "",
  cpassword: "",
  agreement: false,
};

const STEP_COPY = {
  [STEPS.NAME]: {
    title: "Sign up",
    desc: "Create your BAuth account",
  },
  [STEPS.PROFILE]: {
    title: "Sign up",
    desc: "Age must be greater than 13",
  },
  [STEPS.USERNAME]: {
    title: "Sign up",
    desc: "Username cannot be changed later once registered.",
  },
  [STEPS.PASSWORD]: {
    title: "Sign up",
    desc: "Create a strong password for your account",
  },
  [STEPS.TERMS]: {
    title: "Terms & Conditions",
    desc: "",
  },
};

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const usernameRegex = /^[a-z0-9]+(\.[a-z0-9]+)*$/;
const passwordSpecialRegex = /[@$!%*?&^#()_+\-={}[\]|\\:;"'<>,./?]/;

function normalizeUsername(value = "") {
  return value.toLowerCase().trim().split("@")[0];
}

function formatDob(value = "") {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)} / ${digits.slice(2, 4)} / ${digits.slice(4)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }

  return digits;
}

function getPasswordRules(password = "") {
  return {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: passwordSpecialRegex.test(password),
    length: password.length >= 8,
  };
}

function isStrongPassword(password) {
  return Object.values(getPasswordRules(password)).every(Boolean);
}

function validateDob(value) {
  const normalized = value.replace(/\s+/g, "");
  const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!dobRegex.test(normalized)) {
    return "Invalid DOB format";
  }

  const [dd, mm, yyyy] = normalized.split("/").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const isInvalid =
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd;

  if (isInvalid) return "Invalid DOB";
  if (date > new Date()) return "Date of birth cannot be in the future";

  const today = new Date();
  let age = today.getFullYear() - yyyy;
  const monthDiff = today.getMonth() - (mm - 1);

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dd)) {
    age -= 1;
  }

  return age >= 13 ? "" : "You must be at least 13 years old";
}

function validateStep(step, form, usernameAvailable, isAgreementEnd) {
  const name = form.name.trim();
  const dob = form.dob.trim();
  const gender = form.gender.trim();
  const username = normalizeUsername(form.username);
  const password = form.password.trim();
  const cpassword = form.cpassword.trim();

  if (step === STEPS.NAME) {
    if (!name) return { field: "name", msg: "Enter full name" };
    if (!nameRegex.test(name)) return { field: "name", msg: "Invalid name format" };
  }

  if (step === STEPS.PROFILE) {
    const dobError = validateDob(dob);
    if (dobError) return { field: "dob", msg: dobError };
    if (!["male", "female", "other"].includes(gender)) {
      return { field: "gender", msg: "Select gender" };
    }
  }

  if (step === STEPS.USERNAME) {
    if (!username) return { field: "username", msg: "Enter username" };
    if (!usernameRegex.test(username)) {
      return { field: "username", msg: "Use lowercase letters, numbers, and dots only" };
    }
    if (usernameAvailable.checked && !usernameAvailable.available) {
      return { field: "username", msg: usernameAvailable.msg || "Username not available" };
    }
  }

  if (step === STEPS.PASSWORD) {
    if (!password) return { field: "password", msg: "Enter password" };
    if (!isStrongPassword(password)) return { field: "password", msg: "Weak password" };
    if (cpassword !== password) return { field: "cpassword", msg: "Passwords do not match" };
  }

  if (step === STEPS.TERMS) {
    if (!isAgreementEnd) return { field: "agreement", msg: "Scroll and accept terms" };
  }

  return null;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [searchParams] = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo = normalizeAccountCenterReturnTo(rawReturnTo);
  const contentRef = useRef(null);

  const [step, setStep] = useState(STEPS.NAME);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [isAgreementEnd, setAgreementEnd] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState({
    checked: false,
    available: false,
    msg: "",
  });

  const copy = STEP_COPY[step];
  const passwordRules = useMemo(() => getPasswordRules(form.password), [form.password]);
  const passwordStrong = useMemo(() => isStrongPassword(form.password), [form.password]);
  const passwordMatches = form.cpassword && form.password === form.cpassword;

  useEffect(() => {
    if (rawReturnTo && !returnTo) {
      navigate("/serverError", { replace: true });
    }
  }, [navigate, rawReturnTo, returnTo]);

  useEffect(() => {
    const username = normalizeUsername(form.username);

    setUsernameAvailable({
      checked: false,
      available: false,
      msg: "",
    });

    if (!username || !usernameRegex.test(username)) return;

    const timeout = setTimeout(async () => {
      try {
        setCheckingUsername(true);
        const data = await api.post("/auth/username", { username });
        setUsernameAvailable({
          checked: true,
          available: !!data.available,
          msg: data.message || "",
        });
      } catch (err) {
        setUsernameAvailable({
          checked: true,
          available: false,
          msg: err?.message || "Unable to check username",
        });
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.username]);

  useEffect(() => {
    if (!isAgreementEnd || form.agreement) return;
    setForm((prev) => ({ ...prev, agreement: true }));
  }, [isAgreementEnd, form.agreement]);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: name === "dob" ? formatDob(value) : value,
    }));
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateField(name, type === "checkbox" ? checked : value);
  };

  const handleFocus = (e) => {
    if (e.target.name === "password") setPasswordFocused(true);

    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  };

  const handleTermsScroll = () => {
    const el = contentRef.current;
    if (!el) return;

    const reachedEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    if (reachedEnd) setAgreementEnd(true);
  };

  const goBack = () => {
    setError(null);
    setStep((prev) => Math.max(STEPS.NAME, prev - 1));
  };

  const goNext = () => {
    setError(null);
    setStep((prev) => Math.min(STEPS.TERMS, prev + 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateStep(step, form, usernameAvailable, isAgreementEnd);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step < STEPS.TERMS) {
      goNext();
      return;
    }

    try {
      setLoading(true);

      const res = await signup({
        name: form.name.trim(),
        dob: form.dob.replace(/\s+/g, ""),
        gender: form.gender.trim(),
        username: normalizeUsername(form.username),
        password: form.password.trim(),
        aggrement: true,
      });


      if (res.success) {
        if (returnTo) {
          writeAccountCenterAuthResult(returnTo, res);
          navigate(returnTo, { replace: true });
          return;
        }
        navigate(DEFAULT_SIGNUP_SUCCESS_PATH, { replace: true });
        return;
      }

      setError({
        field: res.field || "global",
        msg: res.msg || res.message || "Signup failed",
      });
    } catch (err) {
      setError({
        field: "global",
        msg: err?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center bg-[var(--theme)] min-w-full h-[100dvh]">
      <form
        onSubmit={handleSubmit}
        className={`max-w-lg w-full relative bg-[var(--theme)] p-6 flex flex-col justify-evenly rounded-lg shadow-md shadow-[var(--border)] ${loading ? "pointer-events-none select-none" : ""
          }`}
      >
        {loading && <FormTop size={16} />}

        <FormHeader title={copy.title} desc={copy.desc} error={error} />

        {step === STEPS.NAME && (
          <NameStep
            value={form.name}
            error={error}
            onChange={handleChange}
            onFocus={handleFocus}
            onLogin={() => {
              navigate(returnTo ? buildLoginFlowPath(returnTo) : "/login");
            }}
          />
        )}

        {step === STEPS.PROFILE && (
          <ProfileStep
            form={form}
            error={error}
            onChange={handleChange}
            onFocus={handleFocus}
            onBack={goBack}
          />
        )}

        {step === STEPS.USERNAME && (
          <UsernameStep
            value={form.username}
            error={error}
            checking={checkingUsername}
            availability={usernameAvailable}
            onChange={handleChange}
            onBack={goBack}
          />
        )}

        {step === STEPS.PASSWORD && (
          <PasswordStep
            form={form}
            error={error}
            rules={passwordRules}
            strong={passwordStrong}
            matches={passwordMatches}
            focused={isPasswordFocused}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => setPasswordFocused(false)}
            onBack={goBack}
          />
        )}

        {step === STEPS.TERMS && (
          <TermsStep
            error={error}
            contentRef={contentRef}
            accepted={isAgreementEnd}
            onScroll={handleTermsScroll}
            onBack={goBack}
          />
        )}
      </form>
    </div>
  );
}

function FormHeader({ title, desc, error }) {
  return (
    <div className="flex items-start flex-col gap-4">
      <img className="my-auto" src="/favicon.png" alt="Logo" width={30} height={30} />
      <h1 className="text-3xl font-semibold text-[var(--gray-900)]">{title}</h1>
      {desc && <p className="text-[var(--gray-600)] text-base">{desc}</p>}
      {error?.field === "global" && <FieldError>{error.msg}</FieldError>}
    </div>
  );
}

function NameStep({ value, error, onChange, onFocus, onLogin }) {
  return (
    <>
      <FloatingInput
        label="Enter Full Name"
        name="name"
        value={value}
        autoFocus
        onFocus={onFocus}
        onChange={onChange}
      />
      {error?.field === "name" && <FieldError>{error.msg}</FieldError>}

      <Actions>
        <button type="button" className="text-blue-700 hover:text-blue-500 font-semibold py-2 px-4" onClick={onLogin}>
          Login
        </button>
        <PrimaryButton>Next</PrimaryButton>
      </Actions>

      <SocialButtons />
    </>
  );
}

function ProfileStep({ form, error, onChange, onFocus, onBack }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <FloatingInput
          label="Date of Birth"
          name="dob"
          value={form.dob}
          inputMode="numeric"
          maxLength={14}
          autoFocus
          onFocus={onFocus}
          onChange={onChange}
        />
        {error?.field === "dob" && <FieldError>{error.msg}</FieldError>}

        <div className="my-1 relative">
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="peer w-full border border-[var(--gray-400)] rounded-md bg-[var(--theme)] text-[var(--gray-700)] px-3 py-3 focus:outline-none focus:border-[var(--blue-600)]"
          >
            <option value="" disabled hidden />
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {!form.gender && (
            <label className="absolute left-3 top-4 text-[var(--gray-500)] text-sm pointer-events-none">
              Select Gender
            </label>
          )}

          {error?.field === "gender" && <FieldError>{error.msg}</FieldError>}
        </div>
      </div>

      <StepActions onBack={onBack} />
    </>
  );
}

function UsernameStep({ value, error, checking, availability, onChange, onBack }) {
  return (
    <>
      <div>
        <div className="floating-field">
          <div className="fake-floating-input flex gap-2">
            <input
              type="text"
              name="username"
              autoFocus
              value={value}
              onChange={onChange}
              placeholder=" "
              className="floating-input2"
              autoComplete="off"
              autoCapitalize="off"
            />
            <label className="floating-label">Create new username</label>
            <span className="w-fit m-auto pr-2 text-gray-500 text-sm pointer-events-none whitespace-nowrap">
              @bauth.com
            </span>
          </div>
        </div>

        {error?.field === "username" && <FieldError>{error.msg}</FieldError>}
        {checking && <div className="text-blue-500 text-sm"><Loader size="6" /></div>}
        {value.trim() && availability.checked && availability.available && (
          <div className="text-green-600 text-sm">Username available</div>
        )}
        {value.trim() && availability.checked && !availability.available && (
          <div className="text-red-500 text-sm">{availability.msg}</div>
        )}
      </div>

      <StepActions onBack={onBack} />
    </>
  );
}

function PasswordStep({ form, error, rules, strong, matches, focused, onChange, onFocus, onBlur, onBack }) {
  return (
    <>
      <div>
        <FloatingInput
          type="password"
          label="Create Password"
          name="password"
          value={form.password}
          autoFocus
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
        />

        {!strong && focused && <PasswordRules rules={rules} />}
        {strong && <div className="text-green-600 text-sm">Strong password</div>}
        {error?.field === "password" && <FieldError>{error.msg}</FieldError>}
      </div>

      <div>
        <FloatingInput
          type="password"
          label="Confirm Password"
          name="cpassword"
          value={form.cpassword}
          onChange={onChange}
        />

        {form.cpassword.trim() && !matches && (
          <div className="text-[var(--brand-pinkorange)] text-sm">Passwords do not match</div>
        )}
        {form.cpassword.trim() && matches && (
          <div className="text-green-600 text-sm">Password matched</div>
        )}
        {error?.field === "cpassword" && <FieldError>{error.msg}</FieldError>}
      </div>

      <StepActions onBack={onBack} />
    </>
  );
}

function TermsStep({ error, contentRef, accepted, onScroll, onBack }) {
  return (
    <>
      <div>
        <div className="max-w-xl w-full mx-auto p-4 space-y-4">
          <div
            ref={contentRef}
            onScroll={onScroll}
            className="border rounded-lg p-4 overflow-y-auto max-h-[50dvh] text-sm text-[var(--gray-700)] space-y-4"
          >
            <TermsText />
          </div>
        </div>

        {accepted && (
          <p className="font-medium text-[var(--gray-800)]">
            By clicking “Agree & Continue”, you confirm acceptance of these terms.
          </p>
        )}

        {error?.field === "agreement" && !accepted && <FieldError>{error.msg}</FieldError>}
      </div>

      <Actions>
        <BackButton onClick={onBack} />
        <button
          type="submit"
          className={`py-2 px-4 rounded-lg font-semibold transition ${accepted
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-200 text-gray-500 cursor-pointer"
            }`}
        >
          {accepted ? "Agree & Continue" : "Continue"}
        </button>
      </Actions>
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
        className="floating-input text-[var(--gray-700)]"
        {...props}
      />
      <label className="floating-label">{label}</label>
    </div>
  );
}

function PasswordRules({ rules }) {
  const list = [
    ["upper", "At least one uppercase letter"],
    ["lower", "At least one lowercase letter"],
    ["number", "At least one number"],
    ["special", "At least one special symbol"],
    ["length", "Minimum 8 characters"],
  ];

  return (
    <div className="relative bg-[var(--theme)] w-full text-[var(--brand-pinkorange)] text-sm p-2 border border-[var(--brand-pinkorange)] rounded shadow">
      Password must contain:
      <ul className="list-disc ml-5 space-y-1">
        {list.map(([key, label]) => !rules[key] && <li key={key}>{label}</li>)}
      </ul>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="flex flex-col gap-6 text-center text-sm text-gray-500">
      <div>OR sign up with platforms</div>

      <div className="space-y-3">
        <SocialButton label="Continue with Google" icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
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
      className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:border-gray-400"
    >
      {icon && <img src={icon} alt="" className="w-5 h-5" />}
      {label}
    </button>
  );
}

function TermsText() {
  return (
    <>
      <p className="text-xs text-gray-500">Last updated: 07/01/2026</p>
      <p>By creating an account on <strong>Bauth</strong>, you agree to the following terms.</p>

      {[
        ["Account Usage", "You are responsible for maintaining account security."],
        ["Data & Privacy", "Only necessary data is collected and handled securely."],
        ["Security", "Report unauthorized access immediately."],
        ["Service Availability", "Services may change or be unavailable without notice."],
        ["Limitation of Liability", "Bauth is provided as is. We are not liable for losses."],
        ["Termination", "Accounts violating terms may be suspended or terminated."],
        ["Updates", "Continued use means acceptance of updated terms."],
      ].map(([title, text], index) => (
        <section key={title}>
          <h3 className="font-semibold">{index + 1}. {title}</h3>
          <p>{text}</p>
        </section>
      ))}
    </>
  );
}

function StepActions({ onBack }) {
  return (
    <Actions>
      <BackButton onClick={onBack} />
      <PrimaryButton>Next</PrimaryButton>
    </Actions>
  );
}

function Actions({ children }) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-6 lg:justify-end">
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
