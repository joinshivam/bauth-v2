import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from '../context/notifyContext';
import FormTop from "../components/loader/formTop";
import Loader from "../components/loader/dotBounce"
import { useAuth } from "../context/auth.context";
const Signup = () => {
    const navigate = useNavigate();
    const { signup, isUserExist } = useAuth();
    const { notify } = useNotify();
    const [state, setState] = useState({});
    const STEPS = [0, 1, 2, 3, 4, "final"];
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [passwordFormate, setPasswordFormate] = useState(null);
    const [isPasswordFocused, setPasswordFocussed] = useState(false);
    const [isPasswordMatch, setPasswordMatched] = useState(false);

    const [usernameAvailable, setUsernameAvailable] = useState({
        isValid: false,
        msg: ""
    });
    const [passwordRules, setPasswordRules] = useState({
        upper: false,
        lower: false,
        number: false,
        special: false,
        length: false,
    });

    const [form, setForm] = useState({
        name: "",
        gender: "",
        dob: "",
        username: "",
        password: "",
        cpassword: "",
        agreement: false,
    });
    const inputFocus = (e) => {
        const el = e.target;
        if (e.target.name === "password") {
            setPasswordFocussed(true)
        }

        setTimeout(() => {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            const rect = el.getBoundingClientRect();
            const isCovered =
                rect.bottom > window.innerHeight ||
                rect.top < 0;
            if (isCovered) {
                const offset =
                    rect.top +
                    window.pageYOffset -
                    window.innerHeight / 3;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth",
                });
            }
        }, 300);
    };

    const isValidPassword = (pass) => {
        const rules = {
            upper: /[A-Z]/.test(pass),
            lower: /[a-z]/.test(pass),
            number: /\d/.test(pass),
            special: /[@$!%*?&^#()_+\-={}[\]|\\:;"'<>,./?]/.test(pass),
            length: pass.length >= 8,
        };
        setPasswordRules(rules);
        return Object.values(rules).every(Boolean);
    }
    const isValidUsername = async (username) => {
        try {
            const data = await isUserExist(username);
            setUsernameAvailable({ isValid: data.available, msg: data.message });
        } catch (err) {
            setUsernameAvailable({ isValid: false, msg: "unable to check username!" });
        }
    }

    const isValidName = (Name) => {
        const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        const ValidName = nameRegex.test(Name);
        if (Name.length <= 0) {
            setError({ field: "name", msg: "Enter Full Name" });
            return false;
        }
        else if (!ValidName) {
            setError({ field: "name", msg: "Invalid Name Format" });
            return false;
        }
        setError("");
        return true;
    }
    const dateFormate = (value) => {
        let v = value.replace(/\D/g, "").slice(0, 8);

        if (v.length > 4) {
            return `${v.slice(0, 2)} / ${v.slice(2, 4)} / ${v.slice(4)}`;
        }
        if (v.length > 2) {
            return `${v.slice(0, 2)} / ${v.slice(2)}`;
        }
        return v;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let finalValue = value;
        if (name === "dob") {
            finalValue = dateFormate(value);
        }
        if (type === "checkbox") {
            finalValue = checked;
        }
        setForm((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
        if (name === "name") {
            const validName = isValidName(value.trim());
            if (!validName) return;
        }
        if (name === "username") setUsernameAvailable({ isValid: false, msg: "" });
        if (name === "password") {
            const pwd = e.target.value;
            setPasswordFormate(isValidPassword(pwd));
        };
        if (name === "cpassword") {
            setPasswordMatched(form.password.trim() === value);
        }

        setError(null);
        setSuccess(null);
    };

    const contentRef = useRef(null);
    const [isAgreementEnd, setAgreementEnd] = useState(false);

    const handleScroll = () => {
        const el = contentRef.current;
        if (!el) return;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            setAgreementEnd(true);
        }
    };

    useEffect(() => {
        if (!form.username.trim() || form.username.trim() === "") return;

        const delay = setTimeout(async () => {
            setCheckingUsername(true);
            await isValidUsername(form.username);
            setCheckingUsername(false);
        }, 600);

        return () => clearTimeout(delay);
    }, [form.username]);

    useEffect(() => {
        if (!isAgreementEnd) return;
        setForm((prev) => ({
            ...prev,
            agreement: true,
        }));
    }, [isAgreementEnd, form.agreement]);



    const prevStep = (s) => {
        setLoading(true);
        if (s && s > 0 && s < STEPS.length) {
            setStep(STEPS[s])
        }
        setStep(STEPS[step - 1])
        setLoading(false);

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
    const setThemeColor = (color) => {
        let meta = document.querySelector('meta[name="theme-color"]');

        if (!meta) {
            meta = document.createElement("meta");
            meta.name = "theme-color";
            document.head.appendChild(meta);
        }

        meta.setAttribute("content", color);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const MIN_AGE = 13;
        const el = contentRef.current;
        const sanitizedName = form.name?.toLowerCase().trim();
        const sanitizedDob = form.dob?.trim();
        const sanitizedGender = form.gender?.toLowerCase().trim();
        const sanitizedUsername = form.username?.toLowerCase().trim().split("@")[0];
        const sanitizedPassword = form.password?.trim();
        setLoading(true);
        if (step === 0) {
            setLoading(false);
            const validateName = isValidName(sanitizedName);
            if (!validateName) return;
            setStep(s => STEPS[s + 1]);
            return;

        }
        if (step === 1) {
            setLoading(false);
            if (!sanitizedDob || sanitizedDob === "" || sanitizedDob.length !== 14) {
                setError({ field: "dob", msg: "enter valid (DOB)." });
                return
            }
            if (sanitizedDob.length === 14) {
                const [dd, mm, yyyy] = sanitizedDob.split(" / ").map(Number);
                const date = new Date(yyyy, mm - 1, dd);

                const isInvalid =
                    date.getFullYear() !== yyyy ||
                    date.getMonth() !== mm - 1 ||
                    date.getDate() !== dd;

                if (isInvalid) {
                    setError({ field: "dob", msg: "invalid Date of birth." });
                    return;
                }

                if (date > new Date()) {
                    setError({ field: "dob", msg: "that's great joke. but not a part of signup" });
                    return
                }

                const today = new Date();
                let age = today.getFullYear() - yyyy;

                const m = today.getMonth() - (mm - 1);
                if (m < 0 || (m === 0 && today.getDate() < dd)) {
                    age--;
                }

                if (age < MIN_AGE) {
                    setError({ field: "dob", msg: "you must of age 13 to create account." });
                    return
                }
            }
            if (sanitizedGender === "" || !["male", "female", "other"].includes(sanitizedGender)) {
                setError({ field: "gender", msg: "Please select valid gender" })
                return
            }
            setStep(s => STEPS[s + 1]);
            return;
        }
        if (step === 2) {
            setLoading(false);
            if (sanitizedUsername === "" || !sanitizedUsername) {
                return setUsernameAvailable({ isValid: false, msg: "Enter Username" });
            };
            if (usernameAvailable.isValid === false) {
                return;
            }
            setStep(s => STEPS[s + 1])
            return;
        }
        if (step === 3) {
            setLoading(false);
            if (!sanitizedPassword || sanitizedPassword === "") {
                return setError({ field: "password", error: true, msg: "Enter password" });
            }
            if (!isValidPassword(sanitizedPassword)) {
                return setError({ field: "password", error: true, msg: "Invalid Password" });
            };
            setStep(s => STEPS[s + 1])
            return;
        }
        if (step === 4) {
            setLoading(false);
            if (!el) return;
            if (!isAgreementEnd) {
                el.scrollBy({
                    top: el.clientHeight * 0.4,
                    behavior: "smooth",
                });
                return;
            };
            if (isAgreementEnd) {
                setForm((prev) => ({
                    ...prev,
                    agreement: true,
                }));
            };
            setThemeColor("#111827");
            try {
                const data = await signup(sanitizedName, sanitizedDob, sanitizedGender, sanitizedUsername, sanitizedPassword, form.agreement);
                if (data.ok || data.success) {
                    setSuccess({ field: data?.field || "global", msg: data?.msg || "Signup success" });
                    setError(null)
                    navigate("/");
                    return;
                }
                console.log(data)
                setError({
                    field: `${data?.field || "global"}`, msg: `${data?.msg || "There is an Issue to Signup"}`
                });

            } catch (err) {
                setError({ field: "global", msg: `Err : ${err?.message || "An Unexpected Error Occur"}` });
                setStep("unknown");
                return;
            }

        };

    }

    return (
        <div className="container flex justify-center bg-[var(--theme)] min-w-full h-[100dvh]">
            {!state?.submit && (
                <form
                    onSubmit={handleSubmit}
                    className={`max-w-lg w-full relative bg-[var(--theme)] p-6 flex flex-col justify-evenly rounded-lg shadow-md shadow-[var(--border)] `}
                    style={loading ? FormStyle : {}}>
                    {loading && (<FormTop size={16} />)}
                    <div className="flex items-start flex-col gap-4">
                        <img className="my-auto" src="favicon.png" alt="Logo" width={30} height={30} />
                        <h1 className="text-3xl font-semibold text-[var(--gray-900)]">
                            {(step !== null && step !== 4) && "Sign up"}
                            {step === 4 && "Terms & Conditions"}
                            {step === "unknown" && "Flow Breakdown"}
                        </h1>
                        <p className="text-[var(--gray-600)] text-base">
                            {step === 0 && "Create your bauth account"}
                            {step === 1 && "age must be greater then 13"}
                            {step === 2 && (<><b>Username</b> cannot be change later once registerd!</>)}
                            {step === 3 && "Create Strog password for you account"}
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
                                        name="name"
                                        autoFocus="true"
                                        onFocus={(e) => inputFocus(e)}
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className="floating-input"
                                    />
                                    <label className="floating-label">Enter Full Name</label>
                                </div>
                                {error?.field === "name" && <div className="text-red-400">{error.msg}</div>}
                                <div className="w-fit text-blue-700"></div>
                            </div>
                            <div className={`flex items-center ${step === 0 ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end`}>
                                <div className="text-blue-700 hover:text-blue-500 cursor-pointer font-semibold py-2 px-4 rounded-lg transition-colors" onClick={() => { navigate("/login"); }}>
                                    Login
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
                                    OR sign up with Platforms
                                </div>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition
                                 hover:bg-gray-100 hover:border-gray-400"
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
                                   hover:bg-[#1877F2] hover:text-white"
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
                            <div className="flex flex-col gap-1">
                                <div className="my-1 relative">
                                    <div className="floating-field">
                                        <input
                                            type="text"
                                            name="dob"
                                            value={form.dob}
                                            inputMode="numeric"
                                            autoFocus="true"
                                            onFocus={(e) => inputFocus(e)}
                                            placeholder=" "
                                            maxLength={14}
                                            onChange={handleChange}
                                            className="floating-input text-[var(--gray-700)]"
                                        />

                                        <label
                                            className="floating-label"
                                        >
                                            Date of Birth
                                        </label>
                                    </div>
                                    {error?.field === "dob" && <div className="text-red-400">{error.msg}</div>}
                                </div>
                                <div className="my-1 relative">
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className={`peer w-full border border-[var(--gray-400)] rounded-md bg-[var(--theme)] text-[var(--gray-700)] px-3 py-3
            focus:outline-none focus:border-[var(--blue-600)]`}
                                    >
                                        <option value="" disabled hidden />
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">others</option>
                                    </select>
                                    {!form.gender && (<label
                                        className={`absolute left-3 top-4 text-[var(--gray-500)] text-sm
                                                 transition-all
                                                 peer-placeholder-shown:top-4
                                                 peer-placeholder-shown:text-base
                                                 peer-placeholder-shown:text-[var(--gray-400)]
                                                 peer-focus:top-4
                                                 peer-focus:text-sm
                                                 peer-focus:text-[var(--blue-600)]`}
                                    >
                                        Select Gender
                                    </label>)}
                                    {error?.field === "gender" && <div className="text-red-400">{error.msg}</div>}
                                </div>
                            </div>

                            <div className={`flex items - center ${step === 0 ? "justify-end" : "justify-between"} gap-3 sm:gap-6 lg:justify-end`}>
                                <div onClick={() => prevStep()} className="text-slate-500 hover:text-slate-700 font-semibold py-2 cursor-pointer px-4 rounded-lg transition-colors"
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
                    {step === 2 && (
                        <>
                            <div>
                                <div className="floating-field">
                                    <div className="fake-floating-input flex gap-2">
                                        <input
                                            type="text"
                                            name="username"
                                            autoFocus="true"
                                            value={form.username}
                                            onChange={handleChange}
                                            placeholder=" "
                                            className="floating-input2"
                                            autoComplete="off"
                                            autoCapitalize="off"
                                            autoSave="off"
                                        />
                                        <label className="floating-label">Create new username</label>
                                        <span className="w-fit h-100 m-auto pr-2 text-gray-500 text-sm pointer-events-none whitespace-nowrap">@localhost:3000</span>
                                    </div>
                                </div>
                                {/* {error?.field === "username" && <div className="text-red-400">{error.msg}</div>} */}
                                {checkingUsername && (
                                    <div className="text-blue-500 text-sm"><Loader size="6" /></div>
                                )}

                                {form.username.trim() !== "" && usernameAvailable.isValid === true && (
                                    <div className="text-green-600 text-sm">Username available ✓</div>
                                )}

                                {!usernameAvailable?.isValid && (
                                    <div className="text-red-500">{usernameAvailable.msg}</div>
                                )}

                                {/* <div className="w-fit text-blue-700">auto generate it!</div> */}
                            </div>
                            <div className={`flex items - center ${step === 0 ? "justify-end" : "justify-between"} gap - 3 sm: gap - 6 lg: justify - end`}>
                                <div onClick={() => prevStep()} className="text-slate-500 hover:text-slate-700 font-semibold py-2 cursor-pointer px-4 rounded-lg transition-colors"
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
                    {step === 3 && (
                        <>
                            {/* password */}
                            <div>
                                <div className="floating-field">
                                    <input
                                        type="password"
                                        name="password"
                                        autoFocus="true"
                                        value={form.password}
                                        onChange={handleChange}
                                        onFocus={(e) => inputFocus(e)}
                                        onBlur={() => setPasswordFocussed(false)}
                                        placeholder=" "
                                        className="floating-input"
                                    />
                                    <label className="floating-label">Create Password</label>
                                </div>
                                {!passwordFormate && isPasswordFocused && (
                                    <div className={`
                                relative bg-[var(--theme)] w-full text-[var(--brand-pinkorange)] text-sm p-2 border border-[var(--brand-pinkorange)] rounded shadow
            transition-all duration-500 ease-out transform ${passwordFormate ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"}
            `}>
                                        Password must contain:
                                        <ul className="list-disc ml-5 space-y-1">
                                            {!passwordRules.upper && <li
                                                className={`transition - all duration - 600 ease - out 
                                   ${passwordRules.upper ? "magic-smoke-remove" : ""} `}>
                                                At least one uppercase letter
                                            </li>
                                            }
                                            {!passwordRules.lower && <li
                                                className={`transition - all duration - 600 ease - out 
                                    ${passwordRules.lower ? "magic-smoke-remove" : ""} `}>
                                                At least one lowercase letter
                                            </li>}
                                            {!passwordRules.number && <li
                                                className={`transition - all duration - 600 ease - out 
                                   ${passwordRules.number ? "magic-smoke-remove" : ""} `}>
                                                At least one number
                                            </li>}
                                            {!passwordRules.special && <li
                                                className={`transition - all duration - 600 ease - out 
                                   ${passwordRules.special ? "magic-smoke-remove" : ""} `}>
                                                At least one special symbol
                                            </li>}
                                            {!passwordRules.length && <li
                                                className={`transition - all duration - 600 ease - out 
                                   ${passwordRules.length ? "magic-smoke-remove" : ""} `}>
                                                Minimum 8 characters
                                            </li>}
                                        </ul>
                                    </div>
                                )}

                                {passwordFormate === true && (
                                    <div className="text-green-600 text-sm">
                                        Strong password ✓
                                    </div>
                                )}

                                {error?.field === "password" && <div className="text-red-400">{error.msg}</div>}
                            </div>
                            {/* cpassword */}
                            <div>
                                <div className="floating-field">
                                    <input
                                        type="text"
                                        name="cpassword"
                                        value={form.cpassword}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className="floating-input"
                                    />
                                    <label className="floating-label">Confirm Password</label>
                                </div>
                                {(form.cpassword.trim() !== "" && !isPasswordMatch) && (<div className="text-[var(--brand-pinkorange)] text-sm">
                                    confirm Password and password is not match
                                </div>)}
                                {(form.cpassword.trim() !== "" && isPasswordMatch) && (<div className="text-green-600 text-sm">
                                    Password Matched
                                </div>)}
                            </div>
                            <div className={`flex items - center ${step === 0 ? "justify-end" : "justify-between"} gap - 3 sm: gap - 6 lg: justify - end`}>
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
                    {step === 4 && (
                        <>
                            <div>
                                <div className="max-w-xl w-full mx-auto p-4 space-y-4">
                                    <div
                                        ref={contentRef}
                                        onScroll={handleScroll}
                                        className="
          border rounded-lg p-4
          overflow-y-auto
          max-h-[50dvh]
          text-sm text-gray-700
          space-y-4
        "
                                    >
                                        <p className="text-xs text-gray-500">
                                            Last updated: 07/01/2026
                                        </p>

                                        <p>
                                            By creating an account on <strong>Bauth</strong>, you agree to the
                                            following terms. Please read them carefully.
                                        </p>

                                        <section>
                                            <h3 className="font-semibold">1. Account Usage</h3>
                                            <ul className="list-disc ml-5">
                                                <li>You are responsible for maintaining account security.</li>
                                                <li>Provide accurate and up-to-date information.</li>
                                                <li>No illegal or unauthorized usage.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">2. Data & Privacy</h3>
                                            <ul className="list-disc ml-5">
                                                <li>Only necessary data is collected.</li>
                                                <li>Your data is handled securely.</li>
                                                <li>We never sell personal data.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">3. Security</h3>
                                            <ul className="list-disc ml-5">
                                                <li>You are responsible for account activity.</li>
                                                <li>Report unauthorized access immediately.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">4. Service Availability</h3>
                                            <p>
                                                Services may change or be unavailable without notice.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">5. Limitation of Liability</h3>
                                            <p>
                                                Bauth is provided “as is”. We are not liable for losses.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">6. Termination</h3>
                                            <p>
                                                Accounts violating terms may be suspended or terminated.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="font-semibold">7. Updates</h3>
                                            <p>
                                                Continued use means acceptance of updated terms.
                                            </p>
                                        </section>
                                    </div>
                                </div>
                                {isAgreementEnd && (<p className="font-medium">
                                    By clicking “Agree & Continue”, you confirm acceptance of these terms.
                                </p>)}
                                {(error?.field === "agreement" && !isAgreementEnd) && <div className="text-red-400">{error.msg}</div>}
                            </div>
                            <div className={`flex items - center ${step === 0 ? "justify-end" : "justify-between"} gap - 3 sm: gap - 6 lg: justify - end`}>
                                <div
                                    onClick={() => prevStep()}
                                    className="text-slate-500 hover:text-slate-700 font-semibold py-2 cursor-pointer px-4 rounded-lg transition-colors"
                                >
                                    Back
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className={`w - full py - 2 rounded - lg font - semibold transition ${isAgreementEnd
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-200 text-gray-500 cursor-pointer"
                                        }
            `}>
                                    {isAgreementEnd
                                        ? "Agree & Continue"
                                        : "Continue"
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </form>
            )
            }
            {
                state?.submit && (
                    <div className="w-xlg bg-gray-900 p-6 flex flex-col justify-evenly rounded-lg shadow-md">
                        <div className="relative max-w-xlg w-100 mx-auto">
                            <div
                                className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-xl opacity-70
           group-hover:opacity-100 transition"
                            ></div>

                            <div
                                className="group relative flex items-center gap-4 p-5 rounded-2xl
           bg-white/10 backdrop-blur-xl border border-white/20
           shadow-lg shadow-blue-500/20
           transform transition duration-500
           hover:-translate-y-2 hover:scale-[1.02]
           hover:shadow-blue-500/40"
                            >


                                <a
                                    href="/settings"
                                    className="absolute top-3 right-3 p-2 rounded-full
             bg-white/10 hover:bg-white/20
             text-blue-200 hover:text-white
             transition"
                                    title="Settings"
                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.983 13.764a1.764 1.764 0 100-3.528 1.764 1.764 0 000 3.528z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19.4 15a1.65 1.65 0 01.33 1.82l-.06.13a2 2 0 01-1.73 1h-1.12a6.78 6.78 0 01-.51 1.23l.79.79a2 2 0 01-1.42 3.42h-.13a1.65 1.65 0 01-1.82-.33l-.79-.79a6.78 6.78 0 01-1.23.51v1.12a2 2 0 01-1 1.73l-.13.06a1.65 1.65 0 01-1.82-.33l-.79-.79a6.78 6.78 0 01-1.23.51v1.12a2 2 0 01-1.73 1l-.13-.06a1.65 1.65 0 01-.33-1.82l.79-.79a6.78 6.78 0 01-.51-1.23H5.6a2 2 0 01-1.73-1l-.06-.13a1.65 1.65 0 01.33-1.82l.79-.79a6.78 6.78 0 01-.51-1.23H3.3a2 2 0 01-1-1.73l.06-.13a1.65 1.65 0 011.82-.33l.79.79a6.78 6.78 0 011.23-.51V5.6a2 2 0 011-1.73l.13-.06a1.65 1.65 0 011.82.33l.79.79a6.78 6.78 0 011.23-.51V3.3a2 2 0 011.73-1l.13.06a1.65 1.65 0 01.33 1.82l-.79.79a6.78 6.78 0 01.51 1.23h1.12a6.78 6.78 0 01.51-1.23l-.79-.79a1.65 1.65 0 01.33-1.82l.13-.06a2 2 0 011.73 1v1.12a6.78 6.78 0 011.23.51l.79-.79a1.65 1.65 0 011.82.33l.06.13a2 2 0 01-1 1.73v1.12c.43.15.84.32 1.23.51l.79-.79a1.65 1.65 0 011.82.33l.06.13a2 2 0 01-1 1.73v1.12z" />
                                    </svg>
                                </a>


                                <div className="relative">
                                    <img
                                        src="https://i.pravatar.cc/100"
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full border-2 border-blue-400
               shadow-md shadow-blue-500/50"
                                    />
                                </div>


                                <div className="flex flex-col text-white text-sm">
                                    <span className="text-lg font-semibold">{state?.name}</span>
                                    <span className="text-blue-200">DOB: {state?.dob_gender.dob}</span>
                                    <span className="text-blue-200">Gender: {state?.dob_gender.gender}</span>
                                    <span className="text-blue-300 font-mono">{state?.username}@localhost:3000</span>
                                </div>
                            </div>
                        </div>


                    </div >
                )
            }
            {
                step === "unknown" && (
                    <div className="">
                        <div className="flex items-start flex-col gap-4">
                            <img className="my-auto" src="favicon.png" alt="Logo" width={30} height={30} />
                            <h1 className="text-3xl font-semibold text-gray-900">
                                Flow Breakdown
                            </h1>
                            <p className="text-gray-600 text-base">
                                something is broken! try again
                            </p>
                        </div>
                        <div className={`flex items - center ${step === "unknown" ? "justify-end" : "justify-between"} gap - 3 sm: gap - 6 lg: justify - end`}>
                            <button
                                onClick={() => Restart()}
                                className="bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Signup;

const FormStyle = {
    opacity: "0.7",
    transition: "0.2s ease",
    pointerEvents: "none",
    userSelect: "none"
}
