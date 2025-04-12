import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

export function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className="w-full border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={theme === "light" ? "dropit.png" : "dropit-dark.png"}
            alt="DropIt Logo"
            className="h-24"
          />
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/0xrasla/dropit-react"
            className="text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
