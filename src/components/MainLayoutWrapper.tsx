"use client";

import { usePathname } from "next/navigation";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Hide everything enclosed if we are on the login landing page
    if (pathname === "/login") {
        return null;
    }
    
    return <>{children}</>;
}
