"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Point = { x: number; y: number; t: number }

type SignaturePadProps = {
  value: string | null
  onChange: (val: string | null) => void
  maxHeight?: number
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export default function SignaturePad({
  value,
  onChange,
  maxHeight = 260,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const drawingRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  const hasInkRef = useRef(false)

  const [isEmpty, setIsEmpty] = useState(true)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1

  /* ---------- resize observer ---------- */
  useEffect(() => {
    if (!wrapRef.current) return

    const ro = new ResizeObserver(entries => {
      const rect = entries[0].contentRect
      const w = Math.floor(rect.width)
      const h = clamp(Math.round(w / 2.8), 160, maxHeight)
      setSize({ w, h })
    })

    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [maxHeight])

  /* ---------- canvas setup ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !size.w || !size.h) return

    canvas.width = Math.floor(size.w * dpr)
    canvas.height = Math.floor(size.h * dpr)
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctxRef.current = ctx
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 2.2

    ctx.clearRect(0, 0, size.w, size.h)
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, size.w, size.h)

    hasInkRef.current = false
    setIsEmpty(true)

    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size.w, size.h)
        hasInkRef.current = true
        setIsEmpty(false)
      }
      img.src = value
    }
  }, [size, value, dpr])

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: clamp(e.clientX - rect.left, 0, rect.width),
      y: clamp(e.clientY - rect.top, 0, rect.height),
    }
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current
    if (!ctx) return

    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true

    const p = getPos(e)
    lastPointRef.current = { ...p, t: Date.now() }

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)

    hasInkRef.current = true
    setIsEmpty(false)
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const ctx = ctxRef.current
    if (!ctx) return

    const now = getPos(e)
    const prev = lastPointRef.current
    if (!prev) return

    const midX = (prev.x + now.x) / 2
    const midY = (prev.y + now.y) / 2

    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
    ctx.stroke()

    lastPointRef.current = { ...now, t: Date.now() }
  }

  function end(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = false
    lastPointRef.current = null

    if (hasInkRef.current && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"))
    } else {
      onChange(null)
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  function clear() {
    const ctx = ctxRef.current
    if (!ctx || !size.w || !size.h) return

    ctx.clearRect(0, 0, size.w, size.h)
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, size.w, size.h)

    hasInkRef.current = false
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border bg-white"
        style={{ touchAction: "none" }}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {isEmpty ? "Bitte unterschreiben" : "Unterschrift erfasst"}
        </span>

        <button
          type="button"
          onClick={clear}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Löschen
        </button>
      </div>
    </div>
  )
}
