import prismadb from "@/lib/prismadb";
import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import ThemeSwitcher from "./theme-switcher";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const stores = await prismadb.store.findMany({ where: { userId } });
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
