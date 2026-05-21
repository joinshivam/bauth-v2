import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/auth.context";
import { updatePhoto } from "../../utils/Functions/update";
import { useNotify } from "../../context/notifyContext";
import DotBounce from "../loader/dotBounce";
import { API_BASE } from "../../lib/services/api";
export default function Avatar({ size = 3, c = "", disabled = false, stable = false }) {
  const { user, setUser } = useAuth();
  const { notify } = useNotify();

  const [imgLoading, setImgLoading] = useState(true);
  const [img, setImg] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user?.username) return;
    const controller = new AbortController();
    let objectUrl = null;
    const handleImage = async () => {
      setImgLoading(true);
      try {
        const res = await fetch(`${API_BASE}/media/profile/${encodeURIComponent(user.username)}?v=${encodeURIComponent(user.updated_at || Date.now())}`,
          { credentials: "include", signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load profile photo");
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImg(objectUrl);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load resources");
        }
      } finally {
        setImgLoading(false);
      }
    }
    handleImage();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [user?.username, user?.photo, user?.updated_at]);
  const Size = typeof size === "number" ? size : 3;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await updatePhoto(file);

      if (!res.success) {
        notify({
          title: "Photo update failed",
          message: res?.message || "Unable to update photo",
          type: "danger"
        });
        return;
      }
      setUser(prev => ({
        ...prev,
        photo: res.profilePhoto,
        updated_at: res.updated_at || new Date().toISOString()
      }));

      notify({
        title: "Photo updated",
        message: "Profile photo uploaded successfully",
        type: "success"
      });
    } catch (err) {
      notify({
        title: "Photo update failed",
        message: err?.message || "Unable to update photo",
        type: "danger"
      });
    } finally {
      setUploading(false);
    };
  };

  return (
    <div className="relative group" style={{ width: `${Size}rem`, height: `${Size}rem` }}>

      {/* Loader */}
      {(imgLoading || uploading) && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
          <DotBounce size={8} speed={0.4} bounce={4} />
        </div>
      )}

      {/* Image OR SVG */}
      {!imgLoading && img && (
        <img
          src={img}
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
      )}

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
