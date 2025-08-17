"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { processScrapeWebhook } from "@/lib/request"

interface UrlFormProps {
  onResult: (result: string) => void
}

export function UrlForm({ onResult }: UrlFormProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!url.trim()) return

    setLoading(true)
    setError(null)

    console.log("URL form submission started", { url: url.trim() })

    try {
      // Validate and normalize URL - prepend https:// if no protocol
      let normalizedUrl = url.trim()
      if (!normalizedUrl.match(/^https?:\/\//)) {
        normalizedUrl = `https://${normalizedUrl}`
      }

      // Prepare payload for webhook
      const payload = {
        type: "scrape" as const,
        url: normalizedUrl,
        maxPages: 1,
      }

      console.log("Sending scrape webhook request", payload)
      const result = await processScrapeWebhook(payload)
      console.log("Scrape webhook response received", { resultLength: result.markdown?.length })

      onResult(result.markdown)
      setUrl("") // Clear form on success
    } catch (err) {
      console.log("Scrape webhook error", err)
      setError(err instanceof Error ? err.message : "Failed to scrape website")
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    const form = document.querySelector("form")
    if (form) {
      const event = new Event("submit", { bubbles: false, cancelable: true })
      form.dispatchEvent(event)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
        <p className="text-sm text-muted-foreground">Content will be scraped from the first page only</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={handleRetry} disabled={loading}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading || !url.trim()}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Processing...
          </>
        ) : (
          "Scrape Website"
        )}
      </Button>
    </form>
  )
}
