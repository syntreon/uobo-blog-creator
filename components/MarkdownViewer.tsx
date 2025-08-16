"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface MarkdownViewerProps {
  content: string
  showCopyButton?: boolean
}

export function MarkdownViewer({ content, showCopyButton = false }: MarkdownViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // Simple markdown-to-HTML conversion for basic formatting
  // This handles headings, lists, code blocks, and basic formatting
  const formatMarkdown = (text: string): string => {
    return (
      text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>',
        )
        // Inline code
        .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, "<br>")
    )
  }

  const formattedContent = formatMarkdown(content)

  return (
    <div className="relative">
      {showCopyButton && (
        <div className="sticky top-0 z-10 flex justify-end mb-4 bg-background/80 backdrop-blur-sm py-2">
          <Button onClick={handleCopy} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Content
              </>
            )}
          </Button>
        </div>
      )}

      <div className="prose prose-sm max-w-none">
        <div
          className="text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: `<p class="mb-4">${formattedContent}</p>`,
          }}
        />
      </div>
    </div>
  )
}
