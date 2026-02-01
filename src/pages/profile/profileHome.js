import QuerySearchBar from "../../components/profile/QuerySearchBar";
import { useAuth } from "../../context/auth.context";
import Avatar from "../../components/elements/avtar";
import { useScreenMode } from "../../utils/Functions/resizer";


function getGreeting({
  input = Date.now(),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  guest = "user",
}) {
  const date = new Date(input);

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    }).format(date)
  );

  const label =
    hour < 12
      ? "Good morning"
      : hour < 16
        ? "Good afternoon"
        : hour < 21
          ? "Good evening"
          : "Good night";

  return (
    <>
      {label},{" "}
      <span className="font-semibold capitalize">{guest}</span>
    </>
  );
}

export default function Home() {
  const { user } = useAuth();
  const mode = useScreenMode();
  const isMobile = mode === "mobile";

  return (
    <div className={`${isMobile ? "min-h-[79dvh]" : "min-h-[70dvh]"} bg-[var(--gray-50)] flex items-center justify-center`}>
      <div className={`${isMobile && "w-screen"} flex flex-col justify-center space-y-6`}>
        {/* AVATAR */}
        <div className="mx-auto"><Avatar size={8} onChange={(file) => { }} /></div>
        {/* GREETING */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl text-[var(--gray-900)]">
            {getGreeting({ guest: user?.name?.split(" ")[0] })}
          </h2>
          <p className="text-sm text-[var(--gray-600)]">@{user?.username}</p>
        </div>

        {/* PRIMARY ACTION */}
        <div className={`mx-auto ${isMobile ? "w-full px-8" : "w-96"}`}>
          <div className=""><QuerySearchBar /></div>
        </div>
      </div>
    </div>
  );
}
