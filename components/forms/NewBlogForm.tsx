"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { BlogOutput } from "@/components/BlogOutput"
import { submitNewBlog } from "@/lib/request"
import { useToast } from "@/hooks/use-toast"

interface NewBlogFormProps {
  onSubmit?: () => void
}

interface FormData {
  topic: string
  additionalDetails: string
  research: boolean
}

const STORAGE_KEY = "newBlogFormData"

export function NewBlogForm({ onSubmit }: NewBlogFormProps) {
  const [topic, setTopic] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [research, setResearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const formData: FormData = JSON.parse(savedData)
        setTopic(formData.topic || "")
        setAdditionalDetails(formData.additionalDetails || "")
        setResearch(formData.research || false)
      } catch (error) {
        console.error("Failed to load saved form data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const formData: FormData = { topic, additionalDetails, research }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  }, [topic, additionalDetails, research])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!topic.trim()) return

    setIsLoading(true)
    setResponse("")
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + 100 / 90 // Increment every second for 90 seconds
      })
    }, 1000)

    try {
      console.log("[v0] Submitting new blog request:", { topic, additionalDetails, research })

      const result = await submitNewBlog({
        topic: topic.trim(),
        additionalDetails: additionalDetails.trim(),
        research,
      })

      console.log("[v0] New blog generated successfully")
      clearInterval(progressInterval)
      setProgress(100)

      setResponse(result.markdown)
      toast({
        title: "Blog Ready!",
        description: "Your blog has been generated successfully.",
        duration: 5000,
      })

      onSubmit?.()
    } catch (error) {
      console.error("[v0] New blog generation error:", error)
      clearInterval(progressInterval)
      setProgress(0)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate blog",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResponse("")
    setProgress(0)
  }

  const handleClearForm = () => {
    setTopic("")
    setAdditionalDetails("")
    setResearch(false)
    setResponse("")
    setProgress(0)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (response) {
    return <BlogOutput content={response} title="Generated Blog" onCreateAnother={handleReset} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Topic *</Label>
        <Input
          id="topic"
          type="text"
          placeholder="Enter your blog topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Additional Details</Label>
        <Textarea
          id="details"
          placeholder="Provide any additional context, requirements, or specific points you'd like covered in the blog..."
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          disabled={isLoading}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="research"
          checked={research}
          onCheckedChange={(checked) => setResearch(checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="research" className="text-sm font-normal">
          Include research and data analysis
        </Label>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Generating blog with deep research...</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Generating Blog...
            </>
          ) : (
            "Create New Blog"
          )}
        </Button>

        {(topic || additionalDetails || research) && !isLoading && (
          <Button type="button" variant="outline" onClick={handleClearForm} className="px-4 bg-transparent">
            Clear
          </Button>
        )}
      </div>
    </form>
  )
}
