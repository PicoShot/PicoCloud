import { Outlet } from "react-router-dom";
import { X, Minus } from "lucide-react";
import Particles from "@renderer/components/particles";

export default function Layout() {
  const handleClose = () => {
    window.electron.ipcRenderer.send("close");
  };

  const handleHide = () => {
    window.electron.ipcRenderer.send("hide");
  };

  return (
    <div className="flex flex-col h-screen select-none">
      {/* Control Bar */}
      <div className="flex items-center justify-between h-6 text-gray-200 cursor-auto drag ml-2">
        {/* Draggable Region */}
        <div className="flex-1 cursor-grab drag bg-gradient-to-r from-purple-500 to-purple-600 text-transparent bg-clip-text font-extrabold">
          PicoCloud
        </div>
        {/* Window Controls */}
        <div className="flex space-x-1 no-drag">
          <button
            id="minimize"
            className="w-8 flex items-center justify-center hover:bg-zinc-200 hover:text-black"
            onClick={handleHide}
          >
            <Minus />
          </button>
          <button
            id="close"
            className="w-8 flex items-center justify-center hover:bg-red-600"
            onClick={handleClose}
          >
            <X />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <Particles
          className="absolute inset-0 w-full h-full z-0"
          quantity={70}
          staticity={60}
          size={0.05}
        />
        <Outlet />
      </div>
    </div>
  );
}