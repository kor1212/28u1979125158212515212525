import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { StatusBar } from "@/components/status-bar"
import { NotificationContainer } from "@/components/notification-toast"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dream Loader - Game Cheat Manager",
  description: "Professional game cheat loader with advanced features",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              
              document.addEventListener('keydown', function(e) {
                // F12
                if (e.keyCode === 123) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+I (Inspect)
                if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+J (Console)
                if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+U (View Source)
                if (e.ctrlKey && e.keyCode === 85) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+Shift+C (Inspect Element)
                if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+R and F5 (Reload)
                if ((e.ctrlKey && e.keyCode === 82) || e.keyCode === 116) {
                  e.preventDefault();
                  return false;
                }
                // Ctrl+F5 (Hard Reload)
                if (e.ctrlKey && e.keyCode === 116) {
                  e.preventDefault();
                  return false;
                }
              });
              
              document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
              });
              
              document.addEventListener('copy', function(e) {
                e.preventDefault();
                return false;
              });
              
              window.dreamLoader = window.dreamLoader || {
                loadCheat: function(product, licenseKey, brandName) {
                  console.log('[v0] Dream Loader: Sending message', { product, licenseKey: '***' + licenseKey.slice(-4), brandName });
                  
                  if (window.chrome && window.chrome.webview) {
                    const message = {
                      action: 'loadCheat',
                      product: product,
                      licenseKey: licenseKey || '',
                      brandName: brandName || ''
                    };
                    
                    console.log('[v0] 🚀 Sending to C#:', message);
                    window.chrome.webview.postMessage(message);
                    console.log('[v0] ✅ Message sent to C# loader');
                  } else {
                    console.error('[v0] ❌ WebView2 bridge not available');
                    alert('C# loader bridge not available');
                  }
                }
              };
              
              // Debug WebView2 bridge
              window.addEventListener('load', function() {
                if (window.chrome && window.chrome.webview) {
                  console.log('[v0] ✅ WebView2 bridge is available');
                } else {
                  console.log('[v0] ⚠️ Running in browser mode (C# bridge not available)');
                }
              });
              
              // Handle responses from C# loader
              window.handleLoaderResponse = function(response) {
                console.log('[v0] ✅ C# Loader Response:', response);
              };
              
              window.handleLoaderError = function(response) {
                console.log('[v0] ❌ C# Loader Error:', response);
              };
              
              window.handleLoaderInfo = function(response) {
                console.log('[v0] ℹ️ C# Loader Info:', response);
              };
            `,
          }}
        />
        {children}
        <StatusBar />
        <NotificationContainer />
        <Analytics />
      </body>
    </html>
  )
}
