import {useState } from "react";
import { useNavigate } from "react-router-dom";
import FormTop from "../components/loader/formTop";
import { useAuth } from "../context/auth.context"

const Login = () => {
    const navigate = useNavigate();
    const { login, isUser } = useAuth();
    const STEPS = [0, 1, "null"];
    const [step, setStep] = useState(0);
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError(null);
        setSuccess(null);
    };

    const prevStep = (s) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (s && s > 0 && s < STEPS.length) {
                setStep(STEPS[s])
            }
            setStep(STEPS[step - 1])
        }, 3000)

    };
    const Restart = () => {
        if (step === "unknown") {
            setLoading(true);
            setTimeout(() => {
                setStep(0);
                setLoading(false);
            }, 3000)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const sanitizedUsername = form.username?.toLowerCase().trim().split("@")[0];
        if (step === 0) {
            if (!form.username.trim()) {
                setStep(0);
                return setError({ field: "username", msg: "Enter Username" })
            };

            try {
                setLoading(true);
                const data = await isUser(sanitizedUsername);
                if (data.success || data.ok) {
                    setError(null)
                    setStep(s => STEPS[s + 1]);
                    return setState({ username: data?.username || null, profile: data?.profile || null, msg: data?.message || "" });
                }
                if (data.status === 404) {
                    setStep("unknown");
                    setLoading(false);
                    return;
                }
                return setError({ field: data?.field || "global", msg: data?.message || "Please Sign up and try again" })
            } catch (err) {
                setStep("unknown")
                return setError({ field: "gloabl", msg: err?.message || "Somthing is Broken" });
            } finally {
                setLoading(false);
            }
        }
        if (step === 1 && sanitizedUsername) {
            setLoading(true);
            if (!form.password.trim() || form.password.trim() === "") {
                setLoading(false);
                return setError({ field: "password", msg: "Enter password" })
            };
            try {
                const data = await login(sanitizedUsername, form.password.trim());
                if (data.success) {
                    setError(null)
                    setState(null)
                    setSuccess({ field: data?.field || "global", msg: data?.msg || `Logged in as ${data?.user.username}` })
                    return setState({ username: data?.user.username || null, profile: data?.user.profile || null, msg: data?.message || "" });
                }
                return setError({ field: data?.field || "password", msg: data?.message || "Please try again later" })
            } catch (err) {
                setStep("unknown")
                return setError({ field: "gloabl", msg: err?.message || "Somthing is Broken" });
            } finally {
                setLoading(false);
            }
        };
    };

    return (
        <div className="container flex sm:justify-center items-center min-w-full bg-[var(--theme)]">
            <form onSubmit={handleSubmit}
                className="max-w-lg w-full min-h-[100dvh] relative bg-[var(--theme)] px-4 lg:p-6 flex flex-col justify-evenly rounded-lg shadow-md shadow-[var(--border)] "
                style={loading ? FormStyle : {}}>

                {loading && (<FormTop size={16} />)}
                <div className="flex items-start flex-col gap-3">
                    <img className="my-auto" src="favicon.png" alt="Logo" width={30} height={30} />
                    <h1 className="text-3xl font-semibold text-[var(--gray-900)]">
                        {step === 0 && "Sign in"}
                        {step === 1 && <span onClick={() => prevStep(0)}>{state?.username || "Welcome Back"}</span>}
                        {step === "unknown" && "Flow Breakdown"}
                    </h1>
                    <p className="text-[var(--gray-600)] text-base">
                        {step === 0 && "Access More Features with Your Account"}
                        {step === 1 && "Enter Your Account Password to Login"}
                        {step === "unknown" && "something is broken! try again."}
                    </p>

                    {error?.field === "global" && <div className="text-red-400">{error.msg}</div>}
                    {success?.field === "global" && <div className="text-green-600">{success.msg}</div>}
                </div>
                {step === 0 && (
                    <>
                        <div>
                            <div className="floating-field">
                                <input
                                    type="text"
                                    name="username"
                                    autoFocus="true"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder=" "
                                    className="floating-input border-[var(--gray-400)] outline-[var(--blue-600)] text-[var(--gray-700)]"
                                />
                                <label className="floating-label text-[var(--theme)]">Username</label>
                            </div>
                            {error?.field === "username" && <div className="text-red-400">{error.msg}</div>}
                            <div className="w-fit text-blue-600 cursor-pointer">Find Your account?</div>
                        </div>
                        <div className={`flex items-center ${step === 0 ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end `}>
                            <div className="text-blue-700 hover:text-blue-500 cursor-pointer font-semibold py-2 px-4 rounded-lg transition-colors" onClick={() => { navigate("/signup"); }}>
                                Create account
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Next
                            </button>
                        </div>
                        <div className="flex flex-col gap-6 center text-center text-sm text-gray-500">
                            <div>
                                OR sign in with Platforms
                            </div>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-gray-700 transition
                                 hover:bg-[var(--gray-100)] hover:border-[var(--gray-400)] hover:text-[var(--gray-400)]"
                                >
                                    <img
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    Continue with Google
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 rounded-full border border-[#1877F2] px-5 py-2.5 text-sm font-medium text-[#1877F2] transition
                                   hover:bg-[var(--gray-100)] hover:border-[var(--gray-400)] hover:text-[var(--gray-400)]"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.764v2.314h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z" />
                                    </svg>
                                    Continue with Facebook
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-800 px-5 py-2.5 text-sm font-medium text-gray-800 transition
         hover:bg-gray-900 hover:text-white"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
      3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61 
      -.546-1.387-1.333-1.757-1.333-1.757 
      -1.089-.745.084-.729.084-.729 
      1.205.084 1.838 1.236 1.838 1.236 
      1.07 1.835 2.809 1.305 3.495.998 
      .108-.776.418-1.305.762-1.605 
      -2.665-.3-5.466-1.332-5.466-5.93 
      0-1.31.468-2.38 1.235-3.22 
      -.123-.303-.535-1.523.117-3.176 
      0 0 1.008-.322 3.3 1.23 
      .957-.266 1.983-.399 3.003-.404 
      1.02.005 2.047.138 3.006.404 
      2.29-1.552 3.297-1.23 3.297-1.23 
      .653 1.653.241 2.873.118 3.176 
      .77.84 1.233 1.91 1.233 3.22 
      0 4.61-2.804 5.625-5.475 5.92 
      .43.37.823 1.096.823 2.21 
      0 1.595-.014 2.88-.014 3.27 
      0 .32.216.694.825.576 
      C20.565 22.092 24 17.592 24 12.297 
      c0-6.627-5.373-12-12-12"/>
                                    </svg>
                                    Continue with GitHub
                                </button>

                            </div>
                        </div>
                    </>
                )}
                {step === 1 && (
                    <>
                        <div>
                            <div className="floating-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoFocus="true"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder=" "
                                    className="floating-input text-[var(--gray-700)]"
                                />
                                <label className="floating-label text-[var(--theme)]">Password</label>
                            </div>
                            {error?.field === "password" && <div className="text-red-400">{error.msg}</div>}
                            <div className="w-fit text-blue-700 flex justify-center items-center gap-1">
                                <input type="checkbox" name="show_password" id="show_password" onChange={(e) => setShowPassword(e.target.checked)} />
                                <label htmlFor="show_password">Show Password</label>
                            </div>
                        </div>
                        <div className={`flex items-center ${step === 0 ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end `}>
                            <div
                                onClick={() => prevStep()}
                                className="text-slate-500 hover:text-slate-700 font-semibold py-2 cursor-pointer px-4 rounded-lg transition-colors"
                            >
                                Back
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
                {/* 
                {step === 2 && !isUnknownError && (
                    <>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="rememberme"
                                checked={form.rememberme}
                                onChange={handleChange}
                                id="rememberme"
                            />
                            <label htmlFor="rememberme" className="text-gray-700 font-semibold">
                                Remember login
                            </label>
                        </div>
                        <div className={`flex items-center ${step === 0 ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end `}>
                            <div
                                onClick={() => prevStep()}
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Back
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )} */}
                {step !== 0 && step !== "unknown" && (
                    <>
                        <div className="text-center text-sm text-gray-500">
                            OR
                        </div>
                        <button
                            type="button"
                            className="text-blue-600 w-full text-sm hover:underline"
                        >
                            Try another way to sign in?
                        </button>
                    </>
                )}

                {step === "unknown" && (
                    <>
                        <div className={`flex items-center ${step === "unknown" ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end `}>
                            <button
                                onClick={() => Restart()}
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default Login;

const FormStyle = {
    opacity: "0.7",
    transition: "0.2s ease",
    pointerEvents: "none",
    userSelect: "none"
}
