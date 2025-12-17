"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SmoothInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SmoothInput({ value, onChange, placeholder, disabled, className }: SmoothInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [targetCursorPosition, setTargetCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      setCursorPosition((prev) => {
        const diff = targetCursorPosition - prev
        if (Math.abs(diff) < 0.1) return targetCursorPosition
        return prev + diff * 0.25
      })
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [targetCursorPosition])

  useEffect(() => {
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart || 0
      setTargetCursorPosition(selectionStart)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    const selectionStart = e.target.selectionStart || 0
    setTargetCursorPosition(selectionStart)
  }

  const handleClick = () => {
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart || 0
      setTargetCursorPosition(selectionStart)
    }
  }

  const handleKeyUp = () => {
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart || 0
      setTargetCursorPosition(selectionStart)
    }
  }

  const getTextWidth = () => {
    if (!measureRef.current || !inputRef.current) return 0

    // Get computed styles from the actual input element
    const computedStyle = window.getComputedStyle(inputRef.current)
    measureRef.current.style.font = computedStyle.font
    measureRef.current.style.fontSize = computedStyle.fontSize
    measureRef.current.style.fontFamily = computedStyle.fontFamily
    measureRef.current.style.fontWeight = computedStyle.fontWeight
    measureRef.current.style.letterSpacing = computedStyle.letterSpacing

    // Measure the text before the cursor position
    const textBeforeCursor = value.substring(0, Math.round(cursorPosition))
    measureRef.current.textContent = textBeforeCursor
    return measureRef.current.offsetWidth
  }

  const getInputPadding = () => {
    if (!inputRef.current) return 16
    const computedStyle = window.getComputedStyle(inputRef.current)
    return Number.parseFloat(computedStyle.paddingLeft) || 16
  }

  const cursorX = getTextWidth()
  const paddingLeft = getInputPadding()

  return (
    <div className="relative">
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre pointer-events-none"
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onClick={handleClick}
        onKeyUp={handleKeyUp}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={{ caretColor: "transparent" }}
      />
      {isFocused && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[2px] h-5 bg-cyan-400 pointer-events-none animate-pulse"
          style={{
            left: `${paddingLeft + cursorX}px`,
            transition: "left 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)",
          }}
        />
      )}
    </div>
  )
}
