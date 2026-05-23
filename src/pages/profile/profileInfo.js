import { useCallback, useEffect, useMemo, useState } from "react";
import { X, Pencil, HardDrive } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProfileSection from "../../components/profile/ProfileSection";
import { useScreenMode } from "../../utils/Functions/resizer";
import { useAuth } from "../../context/auth.context";
import Avatar from "../../components/elements/avtar";
import { useFocusFlash } from "../../hooks/useFocusFlash";
import { Helmet } from "react-helmet-async";
import {
  updateName,
  updatePhone,
  updateUsername,
  updateDOB,
  updateGender,
} from "../../utils/Functions/update";

const EDITABLE_FIELDS = new Set(["name", "username", "dob", "gender", "phone"]);

const FIELD_META = {
  name: {
    label: "Full name",
    empty: "Not set",
    normalize: (value) => value.trim(),
    validate: (value) => {
      if (!value.trim()) return "Enter full name";
      if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(value.trim())) return "Invalid name format";
      return "";
    },
    save: updateName,
  },
  username: {
    label: "Username",
    empty: "Not set",
    normalize: (value) => value.trim().toLowerCase().split("@")[0],
    validate: (value) => {
      const username = value.trim().toLowerCase().split("@")[0];
      if (!username) return "Enter username";
      if (!/^[a-z0-9]+(\.[a-z0-9]+)*$/.test(username)) {
        return "Use lowercase letters, numbers, and dots only";
      }
      return "";
    },
    save: updateUsername,
  },
  dob: {
    label: "Date of birth",
    empty: "Not set",
    normalize: (value) => value.replace(/\s+/g, ""),
    validate: (value) => {
      const dob = value.replace(/\s+/g, "");
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return "Use DD/MM/YYYY";
      return "";
    },
    save: updateDOB,
    inputOptions: {
      inputMode: "numeric",
      placeholder: "DD/MM/YYYY",
    },
  },
  gender: {
    label: "Gender",
    empty: "Not set",
    normalize: (value) => value.trim().toLowerCase(),
    validate: (value) => {
      if (!["male", "female", "other"].includes(value.trim().toLowerCase())) {
        return "Select gender";
      }
      return "";
    },
    save: updateGender,
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  phone: {
    label: "Phone number",
    empty: "Not set",
    normalize: (value) => value.replace(/\D/g, ""),
    validate: (value) => {
      const phone = value.replace(/\D/g, "");
      if (!phone) return "Enter phone number";
      if (!/^[6-9][0-9]{9}$/.test(phone)) return "Enter valid 10 digit Indian phone number";
      return "";
    },
    save: updatePhone,
    inputOptions: {
      inputMode: "tel",
      maxLength: 10,
    },
  },
};

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  const focusTarget = searchParams.get("focus");

  const clearFocus = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("focus");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    if (!focusTarget) return;

    if (EDITABLE_FIELDS.has(focusTarget)) {
      setEditingField(focusTarget);
    }
  }, [focusTarget]);

  const saveField = useCallback(
    async (field, rawValue) => {
      const meta = FIELD_META[field];
      if (!meta) return { success: false, message: "Unsupported field" };

      const validationError = meta.validate?.(rawValue);
      if (validationError) {
        return { success: false, message: validationError };
      }

      const value = meta.normalize(rawValue);
      const res = await meta.save(value);

      if (res?.success || res?.ok) {
        setUser((prev) => ({ ...prev, [field]: value }));
      }

      return res;
    },
    [setUser]
  );

  const rows = useMemo(() => ({
    basic: ["name", "username", "dob", "gender"],
    contact: ["phone"],
  }), []);

  if (!user) {
    return (
      <div className="p-6 text-sm text-[var(--gray-600)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "p-4 space-y-4" : "p-6 space-y-8"}`}>
      <Helmet>
        <title>Profile Info - bauth</title>
        <link rel="canonical" href="https://joinshivam-bauth.vercel.app" />
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold text-[var(--gray-800)]">Profile</h1>
        <p className="text-sm text-[var(--gray-600)]">
          Manage your personal information and contact details.
        </p>
      </div>

      <ProfileSection title="Profile picture">
        <ProfilePhoto
          focusTarget={focusTarget}
          onFocusDone={clearFocus}
        />
      </ProfileSection>

      <ProfileSection title="Basic information">
        {rows.basic.map((field) => (
          <InfoRow
            key={field}
            field={field}
            meta={FIELD_META[field]}
            value={user?.[field]}
            focusTarget={focusTarget}
            onFocusDone={clearFocus}
            isEditing={editingField === field}
            onEdit={() => setEditingField(field)}
            onClose={() => setEditingField(null)}
            onSave={(value) => saveField(field, value)}
            editable
          />
        ))}
      </ProfileSection>

      <ProfileSection title="Contact information">
        <InfoRow
          field="email"
          label="Email address"
          value={user?.email}
        />

        {rows.contact.map((field) => (
          <InfoRow
            key={field}
            field={field}
            meta={FIELD_META[field]}
            value={user?.[field]}
            focusTarget={focusTarget}
            onFocusDone={clearFocus}
            isEditing={editingField === field}
            onEdit={() => setEditingField(field)}
            onClose={() => setEditingField(null)}
            onSave={(value) => saveField(field, value)}
            prefix="+91"
            editable
          />
        ))}
      </ProfileSection>

      <ProfileSection title="Account">
        <InfoRow
          field="created_at"
          label="Joined date"
          value={user?.created_at ? new Date(user.created_at).toDateString() : "Not available"}
        />
        <InfoRow field="id" label="Account ID" value={user?.id} />
      </ProfileSection>
    </div>
  );
}

function InfoRow({
  field,
  meta,
  label,
  value,
  editable = false,
  isEditing = false,
  focusTarget,
  onFocusDone,
  onEdit,
  onClose,
  onSave,
  prefix,
}) {
  const rowId = field;
  const rowLabel = label || meta?.label || field;
  const displayValue = value || meta?.empty || "Not set";

  const flash = useFocusFlash(rowId, focusTarget, {
    onDone: onFocusDone,
    autoFocus: isEditing,
  });

  const [input, setInput] = useState(value || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  const resetState = () => {
    setInput(value || "");
    setError("");
    setSuccess("");
    setSaving(false);
  };

  const handleClose = () => {
    resetState();
    onClose?.();
  };

  const handleSave = async () => {
    if (!onSave || saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await onSave(input);

      if (result?.success || result?.ok) {
        setSuccess(result?.message || "Updated");
        onClose?.();
        return;
      }

      setError(result?.message || "Unable to update");
    } catch (err) {
      setError(err?.message || "Unable to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={flash.ref} className={`rounded-lg transition-colors ${flash.className}`}>
      {!isEditing && (
        <div className="p-4 border border-[var(--border)] rounded-lg flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm text-[var(--gray-500)]">{rowLabel}</div>
            <div className="text-sm font-medium text-[var(--gray-900)] truncate">
              {prefix && value ? `${prefix} ${displayValue}` : displayValue}
            </div>
          </div>

          {editable && (
            <button
              type="button"
              className="shrink-0 flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline"
              onClick={onEdit}
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="p-4 border border-[var(--blue-600)] rounded-lg bg-[var(--theme)] space-y-3">
          <div className="text-sm font-medium text-[var(--gray-800)]">
            {rowLabel}
          </div>

          {prefix && (
            <div className="text-xs text-[var(--gray-500)]">
              Country code: {prefix}
            </div>
          )}

          {meta?.type === "select" ? (
            <select
              autoFocus
              value={input || ""}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={saving}
              className="w-full border border-[var(--gray-400)] rounded-md bg-[var(--theme)] text-[var(--gray-700)] px-3 py-3 focus:outline-none focus:border-[var(--blue-600)]"
            >
              <option value="" disabled>
                Select {rowLabel}
              </option>
              {meta.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              autoFocus
              type="text"
              value={input || ""}
              onChange={(e) => {
                const nextValue = field === "phone"
                  ? e.target.value.replace(/\D/g, "")
                  : e.target.value;

                setInput(nextValue);
                setError("");
                setSuccess("");
              }}
              disabled={saving}
              className="w-full px-3 py-3 rounded-md border border-[var(--gray-400)] bg-[var(--theme)] text-[var(--gray-700)] outline-none focus:border-[var(--blue-600)]"
              {...(meta?.inputOptions || {})}
            />
          )}

          {error && <div className="text-sm text-red-400">{error}</div>}
          {success && <div className="text-sm text-green-500">{success}</div>}

          <div className="flex gap-6 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline disabled:opacity-60"
            >
              <X size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline disabled:opacity-60"
            >
              <HardDrive size={14} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePhoto({ focusTarget, onFocusDone }) {
  const flash = useFocusFlash("photo", focusTarget, {
    onDone: onFocusDone,
  });

  return (
    <div
      ref={flash.ref}
      className={`p-4 border border-[var(--border)] rounded-lg flex items-center justify-between gap-4 ${flash.className}`}
    >
      <div className="min-w-0">
        <div className="text-sm text-[var(--gray-500)]">Profile photo</div>
        <div className="text-xs text-[var(--gray-400)]">
          This will be visible on your profile
        </div>
      </div>

      <Avatar size={3.5} stable />
    </div>
  );
}