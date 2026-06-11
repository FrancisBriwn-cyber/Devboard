import { ParticleTextEffect } from "@/components/ui/particle-text-effect"
import { useThemeStore } from "@/store/themeStore"
import { SunIcon, MoonIcon } from "@/components/Icons"

export default function ParticleEffectDemo() {
  const { dark, toggle } = useThemeStore()

  return (
    <div>
      {/* Theme toggle button */}
      <button
        onClick={toggle}
        className={`fixed top-4 right-4 z-50 p-2 rounded-lg transition-all duration-300 ${
          dark 
            ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' 
            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
        }`}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      <ParticleTextEffect 
        words={["DevBoard", "Particles", "Effects", "React", "Tailwind"]}
        particleColor="random"
      />
    </div>
  )
}
