"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Info } from "lucide-react"

interface Notification {
  id: number
  message: string
  type: "success" | "error" | "info"
}

let notificationId = 0
const notificationCallbacks: Array<(notification: Notification) => void> = []

export const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
  const notification: Notification = {
    id: notificationId++,
    message,
    type,
  }
  notificationCallbacks.forEach((callback) => callback(notification))
}

export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const callback = (notification: Notification) => {
      setNotifications((prev) => [...prev, notification])
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, 5000)
    }

    notificationCallbacks.push(callback)

    // Setup window interface for C#
    if (typeof window !== "undefined") {
      window.dreamLoader = {
        ...(window.dreamLoader || {}),
        showNotification,
      }
    }

    return () => {
      const index = notificationCallbacks.indexOf(callback)
      if (index > -1) {
        notificationCallbacks.splice(index, 1)
      }
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      {notifications.map((notification, index) => {
        const colors = {
          success: {
            bg: "bg-gradient-to-r from-emerald-900/90 to-emerald-800/90",
            border: "border-emerald-500/50",
            text: "text-emerald-400",
            icon: "text-emerald-400",
          },
          error: {
            bg: "bg-gradient-to-r from-red-900/90 to-red-800/90",
            border: "border-red-500/50",
            text: "text-red-400",
            icon: "text-red-400",
          },
          info: {
            bg: "bg-gradient-to-r from-cyan-900/90 to-blue-800/90",
            border: "border-cyan-500/50",
            text: "text-cyan-400",
            icon: "text-cyan-400",
          },
        }

        const colorScheme = colors[notification.type]

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto ${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4 shadow-2xl min-w-[320px] backdrop-blur-md animate-slide-in-right`}
            style={{
              animation: "slideInRight 0.3s ease-out forwards",
              opacity: 0,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="flex items-start gap-3">
              <div className={`${colorScheme.icon} flex-shrink-0`}>
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : notification.type === "error" ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${colorScheme.text}`}>{notification.message}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
