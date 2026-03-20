import Header from "@/components/Header"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html>
      <body className="bg-gray-100">
        <Header />
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>

      </body>
    </html>
  )
}