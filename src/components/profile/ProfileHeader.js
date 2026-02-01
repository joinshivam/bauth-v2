import { useEffect,useRef, useState } from "react";
import { useNotify } from "../../context/notifyContext";
import QuerySearchBar from "./QuerySearchBar"
import { useScreenMode } from "../../utils/Functions/resizer";
import Avatar from "../elements/avtar";
import { useSidebar } from "../../context/sidebar.context";
import { MenuIcon, X, EllipsisVertical, Check } from "lucide-react";

export default function ProfileHeader({ user, log, page }) {

  const badgeRef = useRef(null);
  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (badgeRef.current?.contains(event.target)) {
        return;
      }
      setBadgeShow(false);
    };

   if(!isMobile)  document.addEventListener("mousedown", handleClickOutside);
   if(isMobile)  document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      if(!isMobile)  document.removeEventListener("mousedown", handleClickOutside);
      if(isMobile)  document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);
  const { notify } = useNotify();
  const [showBadge, setBadgeShow] = useState(false);
  const [isCopied, setCopied] = useState(false);
  const { open, toggle } = useSidebar();
  const [spin, setSpin] = useState(true);


  const handleToggle = () => {
    setSpin(true);
    toggle();
    setTimeout(() => setSpin(false), 150);
  };
  if (page === "hmrs" && !isMobile) return;

  const profileUrl = `${window.location.origin}/u/${user.username.split("@")[0]}`;

  const handleClose = (e) => {
    if (!e.relatedTarget) return;
    setBadgeShow(false);

  }

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      notify({
        message: "Profile link copied",
        title: profileUrl,
        type: "success",
        duration: 1000,
      });

      setTimeout(() => {
        setCopied(false);
      }, 1000);

    } catch (err) {
      notify({
        message: "Failed to copy link",
        type: "error",
        duration: 1500,
      });
    }
  };


  return (
    <>
      <div className={`flex w-100 items-center relative bg-[var(--slate-50)] justify-end ${isMobile ? "gap-x-4 py-3 px-4" : "gap-x-12 py-3 px-10"}  border border-[var(--border)] border-b-2 border-t-0 border-x-0 rounded-lg`} onClick={(e) => handleClose(e)}>
        {page !== "hmrs" && (<div className="">
          <QuerySearchBar />
        </div>)}
        <div className="flex items-center gap-6 relative">
          <div className="relative group cursor-pointer" onClick={(e) => {
            setBadgeShow(prev => !prev)
          }}>
            {!isMobile && <Avatar disabled={true} />}
            {isMobile && (<div className="flex items-baseline" ><img src="/favicon.png" alt="logo" width="22rem" height="22rem" /><EllipsisVertical /></div>)}
          </div>
          {isMobile && (
            <div className="cursor-pointer" onClick={handleToggle}>
              <div className={`bg-[var(--theme)] border rounded-full p-2 shadow ${open ? "text-blue-600 border-[var(--gray-800)] " : "text-[var(--gray-800)]"}`}>
                <div className={`transition-transform duration-300  ${open ? "rotate-180" : " rotate-0"}`}>
                  {open ? <X /> : <MenuIcon />}
                </div>
              </div>
            </div>
          )}


          {showBadge && (
            <div className={`absolute translate-y-44 ${isMobile ? "-translate-x-40 w-[200px] px-4 py-2" : "-translate-x-56 w-[250px] px-8 py-4"}  bg-[var(--theme)] shadow-xl shadow-[var(--border)] rounded-xl border border-[var(--border)] border-y-[var(--lime-50)] z-50`} ref={badgeRef}>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-2 text-center items-center">
                <p className="text-[var(--gray-600)]"> {user?.email}</p>
                <Avatar uIMG={user?.photo} onChange={(file) => { }} stable={true} />
                <div>
                  <div className="hidden text-xs lg:block">
                    ╔┓┏╦━━╦┓╔┓╔━━╗
                    ║┗┛║┗━╣┃║┃║╯╰║
                    ║┏┓║┏━╣┗╣┗╣╰╯║
                    ╚┛┗╩━━╩━╩━╩━━╝
                  </div>

                  <div className={isMobile ? "text-xl" : "text-5xl"}>
                    {`${user?.name.split(" ")[0]}` || "User"}
                  </div>
                </div>
              </div>
              <div>
                <div className="buttons flex gap-3 items-center">
                  <button
                    onClick={handleCopy}
                    className={`
    relative flex items-center justify-center
    h-9 w-20 rounded-full
    bg-white/10 hover:bg-white/20
    transition-all duration-200 ease-out
    active:scale-95
    ${isCopied ? "bg-green-500 opacity-80 scale-95" : "opacity-100 scale-100"}
  `}
                  >
                    <span
                      className={`
      absolute transition-all duration-200 ease-out
      ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}
    `}
                    >
                      Share
                    </span>
                    <span
                      className={`
      absolute transition-all duration-200 ease-out
      ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}
    `}
                    >
                      <Check />
                    </span>
                  </button>

                  <div className="button h-9 w-20 flex items-center justify-center text-white rounded-full bg-[var(--brand-pinkorange)] cursor-pointer" onClick={() => log()}>Logout</div>
                </div>
              </div>
            </div>
          </div>)}
        </div>
      </div >
    </>
  );
}
