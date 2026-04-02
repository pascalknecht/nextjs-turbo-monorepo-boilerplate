import React from "react";

export default function SettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="bg-white dark:border-neutral-800 dark:bg-transparent rounded-md border">
        <div className="border-b px-4 py-2 sm:px-6 md:py-3 dark:bg-neutral-900/50 bg-neutral-50 rounded-t-md">
          <span className="text-base sm:text-lg font-medium mb-4">
            Manage Subscription
          </span>
        </div>
      </div>
    </>
  );
}
