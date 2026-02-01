import { useEffect, useState } from "react";
import ProfileSection from "../../components/profile/ProfileSection";
import { useScreenMode } from "../../utils/Functions/resizer";
import { useAuth } from "../../context/auth.context";
import { X, Pencil, Camera, HardDrive } from "lucide-react";
import Input from "../../components/elements/input";
import Avatar from "../../components/elements/avtar";
import { updateName, updatePhone, updateUsername, updateDOB, updateGender } from "../../utils/Functions/update";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  return (
    <div className={`${isMobile ? "p-4 space-y-4" : "p-6 space-y-8"}`}>
      <div>
        <h1 className="text-2xl font-bold text-[var(--gray-800)]">Profile</h1>
        <p className="text-sm text-[var(--gray-600)]">
          Manage your personal information and contact details.
        </p>
      </div>

      <ProfileSection title="Profile picture">
        <ProfilePhoto />
      </ProfileSection>

      <ProfileSection title="Basic information">
        <InfoRow
          label="Full name"
          value={user?.name}
          name="name"
          isEditing={editingField === "name"}
          onEdit={() => setEditingField("name")}
          onSave={
            async (value) => {
              const res = await updateName(value);
              setUser(prev => ({ ...prev, name: value.toLowerCase() }));
              return res;
            }}
          onClose={() => setEditingField(null)}
          editable
        />
        <InfoRow label="Username"
          value={user?.username}
          name="username"
          isEditing={editingField === "username"}
          onEdit={() => setEditingField("username")}
          onClose={() => setEditingField(null)}
          editable
          onSave={
            async (value) => {
              const res = await updateUsername(value);
              setUser(prev => ({ ...prev, username: value.toLowerCase() }));
              return res;
            }
          }
        />
        <InfoRow label="Date of birth"
          value={user?.dob} name="dob"
          editable
          isEditing={editingField === "dob"}
          onEdit={() => setEditingField("dob")}
          onClose={() => setEditingField(null)}
          onSave={
            async (value) => {
              const res = await updateDOB(value);
              setUser(prev => ({ ...prev, dob: value }));
              return res;
            }}
        />
        <InfoRow label="Gender"
          value={user?.gender}
          name="gender"
          editable
          isEditing={editingField === "gender"}
          onEdit={() => setEditingField("gender")}
          onClose={() => setEditingField(null)}
          onSave={
            async (value) => {
              const res = await updateGender(value);
              setUser(prev => ({ ...prev, gender: value.toLowerCase() }));
              return res;
            }}
        />
      </ProfileSection>

      {/* CONTACT */}
      <ProfileSection title="Contact information">
        <InfoRow
          label="Email address"
          name="email"
          value={user.email}
        />
        <InfoRow
          label="Phone number"
          name="phone"
          value={user.phone}
          editable isEditing={editingField === "phone"}
          onEdit={() => setEditingField("phone")}
          onClose={() => setEditingField(null)}
          seprator={(
            <InfoRow
              label="Country Code"
              name="pcc"
              value={"+91"}
            />
          )}
          onSave={
            async (value) => {
              const res = await updatePhone(value);
              setUser(prev => ({ ...prev, phone: value.toLowerCase() }));
              return res;
            }}
        />
      </ProfileSection>

      <ProfileSection title="Account">
        <InfoRow
          label="Joined date"
          value={new Date(user.created_at).toDateString()}
        />
        <InfoRow label="Account ID" value={user.id} />
      </ProfileSection>
    </div>
  );
}

function InfoRow({
  label,
  value,
  editable,
  isEditing,
  onEdit,
  onClose,
  onSave,
  setUser,
  seprator
}) {
  const [input, setInput] = useState(value);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setInput(value)
  }, [value])



  const handleClose = () => {
    setInput("");
    setError("");
    setSuccess("");
    setLoader(false);
    onClose();
  };
  const handleBlur = (e) => {
    if (e.relatedTarget) return;
    handleClose();
  };
  const handleSave = async () => {
    if (!onSave) return;

    setLoader(true);
    setError("");
    setSuccess("");

    try {
      const result = await onSave(input);

      if (result?.success || result?.ok) {
        setSuccess(result?.message || "Updated");
        handleClose();
      } else {
        setError(result?.message || "Unknown error");
      }
    } catch (err) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      {!isEditing && (
        <div className="p-4 border border-[var(--border)] rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--gray-500)]">{label}</div>
            <div className="text-sm font-medium text-[var(--gray-900)]">
              {value ? value : "Not set"}
            </div>
          </div>

          {editable && (
            <button className="flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline" onClick={onEdit}>
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <>
          {seprator}
          <Input
            field={{ name: label, value: input }}
            label={`Enter ${label}`}
            handleChange={setInput}
            setBlur={handleBlur}
            setFocus={(s) => { setError(""); }}
            loader={loader}
            error={error}
            success={success}
            fixer={
              <>
                {!loader && (
                  <div className="flex gap-6 mt-2 justify-end">
                    <button onClick={handleClose} className="flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline">
                      <X size={14} /> Cancel
                    </button>

                    <button
                      className="flex items-center gap-1 text-sm text-[var(--blue-600)] hover:underline"
                      onClick={() => {
                        if (!input || input === "") {
                          setError("Enter a valid value")
                          return;
                        };
                        handleSave();
                      }}
                    >
                      <HardDrive size={14} /> Save
                    </button>
                  </div>
                )}
              </>
            }
          />
        </>
      )}
    </div>
  );
}


function ProfilePhoto() {
  return (
    <div className="p-4 border border-[var(--border)] rounded-lg flex items-center justify-between">
      <div>
        <div className="text-sm text-[var(--gray-500)]">Profile photo</div>
        <div className="text-xs text-[var(--gray-400)]">
          This will be visible on your profile
        </div>
      </div>

      <Avatar size={3.5} stable={true} />
    </div>
  );
}