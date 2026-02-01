import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/auth.context";
import { updatePhoto } from "../../utils/Functions/update";
import { useNotify } from "../../context/notifyContext";
import DotBounce from "../loader/dotBounce";

export default function Avatar({ size = 3, c = "", disabled = false, stable = false }) {
  const { user, API_BASE, setUser } = useAuth();
  const { notify } = useNotify();

  const [imgLoading, setImgLoading] = useState(true); // 🔥 LOCAL
  const [uploading, setUploading] = useState(false);

  const imgSrc = `${API_BASE}/api/media/${user.username}?v=${user.updated_at || ""}`;
  const Size = typeof size === "number" ? size : 3;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const res = await updatePhoto(file);

    if (!res.success) {
      notify({
        title: "Photo update failed",
        message: res?.message || "Unable to update photo",
        Type: "danger"
      });
      setUploading(false);
      return;
    }

    setUser(prev => ({
      ...prev,
      photo: res.profilePhoto,
      updated_at: res.updated_at
    }));

    setImgLoading(true); // 🔥 new image reload
    setUploading(false);

    notify({
      title: "Photo updated",
      message: "Profile photo uploaded successfully",
      Type: "success"
    });
  };

  return (
    <div className="relative group" style={{ width: `${Size}rem`, height: `${Size}rem` }}>

      {/* Loader */}
      {(imgLoading || uploading) && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
          <DotBounce size={8} speed={0.4} bounce={4} />
        </div>
      )}

      {/* Image */}
      <img
        src={imgSrc}
        alt="Profile"
        className={`rounded-full ${c} ${imgLoading ? "opacity-0" : "opacity-100"}`}
        style={{
          width: `${Size}rem`,
          height: `${Size}rem`,
          minWidth: `${Size}rem`,
          minHeight: `${Size}rem`,
          objectFit: "cover",
          transition: "opacity 0.3s ease"
        }}
        onLoad={() => setImgLoading(false)}
        onError={() => setImgLoading(false)}
      />

      {!disabled && (
        <>
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0
              bg-[var(--theme)] p-1.5 rounded-full shadow
              ${stable ? "opacity-100" : "opacity-0"} group-hover:opacity-100
              transition-opacity cursor-pointer`}
          >
            <Camera
              className="text-[var(--gray-700)]"
              style={{
                width: `${Size / 7}rem`,
                height: `${Size / 7}rem`
              }}
            />
          </label>

          <input
            type="file"
            id="avatar-upload"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
