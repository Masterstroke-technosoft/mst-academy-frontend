/** Runs before paint to apply persisted theme and avoid flash. */
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("mst-academy-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
