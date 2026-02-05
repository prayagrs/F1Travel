import { redirect } from "next/navigation";

/**
 * Settings tab hidden for now. Redirect to Account.
 * Re-enable when real settings (notifications, preferences) exist.
 */
export default function AccountSettingsPage() {
  redirect("/account");
}
