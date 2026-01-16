import { useState } from "react";
import { FcMenu } from "react-icons/fc";
import Navbar from "./Navbar";

export default function MainLayout({ children, expanded, setExpanded }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background-100">
      <Navbar
        expanded={expanded}
        setExpanded={setExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className={`
  flex-1 p-4 transition-all duration-300
  /* No Mobile: Margem 0. No Desktop (md): Margem dinâmica */
  ml-0 
  ${expanded ? "md:ml-64" : "md:ml-20"}
  
  /* Garante que o conteúdo não 'vaze' horizontalmente */
  max-w-full overflow-x-hidden
`}>
        {/* Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <button onClick={() => setMobileOpen(true)} className="p-2 bg-white rounded-lg shadow-md active:scale-95 transition-transform">
            <FcMenu size={24} />
          </button>


          <span className="font-bold text-slate-700">DIAG HELPER</span>
        </div>

        {children}
      </main>
    </div>
  );
}

