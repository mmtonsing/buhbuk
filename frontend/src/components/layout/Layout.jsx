import { Navbar } from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex justify-center w-screen mt-20">
        <Outlet />
      </main>
    </>
  );
}
// mt-[7.5rem] xl:mt-20 //xl+-> mt-20 small to large screen- mt 7.5rem i.e.30
// {/* <main className="flex justify-center w-screen mt-[7.5rem] xl:mt-20 ">

//   /* <main className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 w-full px-1 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto"> */ */}
