import { useNavigate } from "react-router-dom";

export function ExploreRedirectButton({ label, to, onClick }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      className="w-full text-left px-3 py-2 text-sm hover:bg-stone-700 rounded-md"
    >
      {label}
    </button>
  );
}

//WITH AUTHENTICATION REQUIRED
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// export function ExploreRedirectButton({
//   to = "/",
//   label = "Explore",
//   onClick,
// }) {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleAction = () => {
//     onClick?.(); // Close dropdown/popup
//     setTimeout(() => {
//       if (user) {
//         navigate(to);
//       } else {
//         navigate("/auth", { state: { from: to } });
//       }
//     }, 10);
//   };

//   return (
//     <button
//       onClick={handleAction}
//       className="flex items-center justify-center text-sm px-3 py-2 rounded-lg hover:bg-gradient-to-r from-[#4b2e2b] to-[#6b4226] hover:text-white w-full transition"
//     >
//       {label}
//     </button>
//   );
// }
