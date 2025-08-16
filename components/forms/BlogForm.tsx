"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { BlogOutput } from "@/components/BlogOutput"
import { processBlogWebhook } from "@/lib/request"

interface BlogFormProps {
  onResult?: (result: string) => void
}

interface FormData {
  topic: string
  competitorBlog: string
}

const STORAGE_KEY = "blogFormData"

export function BlogForm({ onResult }: BlogFormProps) {
  const [topic, setTopic] = useState("")
  const [competitorBlog, setCompetitorBlog] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState("")

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const formData: FormData = JSON.parse(savedData)
        setTopic(formData.topic || "")
        setCompetitorBlog(formData.competitorBlog || "")
      } catch (error) {
        console.error("Failed to load saved form data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const formData: FormData = { topic, competitorBlog }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [topic, competitorBlog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling that was causing theme changes

    if (!topic.trim() || !competitorBlog.trim()) return

    setLoading(true)
    setError(null)

    console.log("[v0] Blog form submission started", {
      topic: topic.trim(),
      competitorBlogLength: competitorBlog.trim().length,
    })

    try {
      // Prepare payload for webhook
      const payload = {
        type: "blog" as const,
        topic: topic.trim(),
        competitorBlog: competitorBlog.trim(),
      }

      console.log("[v0] Sending blog webhook request", payload)
      const result = await processBlogWebhook(payload)
      console.log("[v0] Blog webhook response received", { resultLength: result.markdown?.length })

      setResponse(result.markdown)
      onResult?.(result.markdown)
    } catch (err) {
      console.log("[v0] Blog webhook error", err)
      setError(err instanceof Error ? err.message : "Failed to create blog content")
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

  const handleReset = () => {
    setResponse("")
    setError(null)
  }

  const handleClearForm = () => {
    setTopic("")
    setCompetitorBlog("")
    setResponse("")
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (response) {
    return <BlogOutput content={response} title="Generated Blog Content" onCreateAnother={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Blog Topic (Optional)</Label>
        <Input
          id="topic"
          type="text"
          placeholder="Enter your blog topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="competitor-blog">Competitor Blog Content*</Label>
        <Textarea
          id="competitor-blog"
          placeholder="Paste competitor blog content here for analysis..."
          value={competitorBlog}
          onChange={(e) => setCompetitorBlog(e.target.value)}
          disabled={loading}
          required
          className="min-h-[200px] w-full resize-y"
        />
        <p className="text-sm text-muted-foreground">Paste the full content of a competitor's blog post for analysis</p>
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

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading || !topic.trim() || !competitorBlog.trim()}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            "Create Blog Content"
          )}
        </Button>

        {(topic || competitorBlog) && !loading && (
          <Button type="button" variant="outline" onClick={handleClearForm} className="px-4 bg-transparent">
            Clear
          </Button>
        )}
      </div>
    </form>
  )
}
