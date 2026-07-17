import { redirect } from "next/navigation";

// Middleware resolves "/" to /landing, /academy, or the Events portal
// depending on session/portal cookies. This is the fallback if that
// branching is ever bypassed.
export default function HomePage() {
  redirect("/landing");
}
