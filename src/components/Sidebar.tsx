"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Bot,
  Gem,
  Megaphone,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Moderation", icon: ShieldCheck, path: "/moderation" },
  { name: "Bots", icon: Bot, path: "/bots" },
  { name: "Premium", icon: Gem, path: "/premium" },
  { name: "Ads", icon: Megaphone, path: "/ads" },
];

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // get current route

  // Detect small screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger (only when mobile + sidebar closed) */}
      {isMobile && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 50,
            background: "black",
            color: "white",
            border: "none",
            padding: "8px 10px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      <aside
        style={{
          width: isMobile ? (expanded ? 200 : 0) : expanded ? 200 : 60,
          background: "black",
          color: "#fff",
          paddingTop: 24,
          transition: "width 0.2s",
          minHeight: "100vh",
          position: "fixed",
          zIndex: 40,
          borderRight: "1px solid #dd487042",
          overflow: "hidden",
        }}
        // Only hover expand on desktop
        onMouseEnter={() => !isMobile && setExpanded(true)}
        onMouseLeave={() => !isMobile && setExpanded(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: 32,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
            marginLeft: expanded ? 16 : 0,
          }}
        >
          {expanded && <span>Admin Panel</span>}
          {/* Close button (mobile only, when open) */}
          {isMobile && expanded && (
            <button
              onClick={() => setExpanded(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                color: "white",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>

        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.path; // check active route
              return (
                <li
                  key={link.name}
                  className={`
    flex items-center mb-[18px] rounded-md cursor-pointer
    ${isActive ? "bg-[#171717] text-[#dd4870]" : "text-white"}
    hover:bg-[#171717] hover:text-[#dd4870]
  `}
                >
                  <a
                    href={link.path}
                    className="flex items-center w-full px-3 py-2 font-medium text-[16px] transition-colors duration-200"
                  >
                    <link.icon
                      size={22}
                      style={{ marginRight: expanded ? 12 : 0 }}
                    />
                    {expanded && <span>{link.name}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
