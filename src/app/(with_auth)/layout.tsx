// app/dashboard/layout.tsx
'use client'
import Navbar from "@/components/navbar";
import { WithAuth } from "./with_auth";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Navbar>
      {children}
    </Navbar>
  );
}

export default WithAuth(AuthLayout);
