"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const colors = [
  "rgb(125 211 252)",
  "rgb(249 168 212)",
  "rgb(134 239 172)",
  "rgb(253 224 71)",
  "rgb(252 165 165)",
  "rgb(216 180 254)",
  "rgb(147 197 253)",
  "rgb(165 180 252)",
  "rgb(196 181 253)",
]

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const cells = new Array(36).fill(0)

  return (
    <motion.div
      className={cn("absolute inset-0 overflow-hidden z-0", className)}
      initial={{ opacity: 0.35, scale: 0.95 }}
      animate={{ opacity: [0.35, 0.55, 0.35], rotate: [0, 1.5, 0], scale: [0.95, 1, 0.95] }}
      transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      {...rest}
    >
      <div
        style={{
          transform: "translate(-35%, -40%) skewX(-36deg) skewY(10deg) scale(0.8)",
        }}
        className="absolute left-[40%] top-[40%] grid grid-cols-6 gap-3 w-[140%] max-w-[1200px] h-[140%]"
      >
        {cells.map((_, index) => (
          <motion.div
            key={index}
            className="rounded-3xl border border-white/10"
            animate={{
              backgroundColor: [getRandomColor(), getRandomColor(), getRandomColor()],
              opacity: [0.15, 0.6, 0.15],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 9 + (index % 3),
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: index * 0.08,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export const Boxes = React.memo(BoxesCore)
