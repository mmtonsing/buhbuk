import { Navbar } from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex justify-center w-screen mt-20 pb-[4.5rem] md:pb-0">
        <Outlet />
      </main>
      {/* Global Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} BuhBuk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
// mt-[7.5rem] xl:mt-20 //xl+-> mt-20 small to large screen- mt 7.5rem i.e.30
// {/* <main className="flex justify-center w-screen mt-[7.5rem] xl:mt-20 ">

//   /* <main className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 w-full px-1 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto"> */ */}
