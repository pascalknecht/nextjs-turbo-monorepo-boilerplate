import React from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function Page() {
  return (
    <>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your dashboard
        </p>
      </div>
      <DashboardSkeleton />
    </>
  );
}
