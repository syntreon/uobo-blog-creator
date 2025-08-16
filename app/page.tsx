"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrlForm } from "@/components/forms/UrlForm"
import { BlogForm } from "@/components/forms/BlogForm"
import { MarkdownViewer } from "@/components/MarkdownViewer"
import { ThemeToggle } from "@/components/theme-toggle"
import { NewBlogForm } from "@/components/forms/NewBlogForm"

export default function HomePage() {
  const [scrapeResult, setScrapeResult] = useState<string>("")
  const [blogResult, setBlogResult] = useState<string>("")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Uobo Blog Creator</h1>
          <p className="text-muted-foreground">Scrape blogs and create blog content</p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="blog">Create Blog from Competitor</TabsTrigger>
            <TabsTrigger value="newblog">Create New Blog</TabsTrigger>
            <TabsTrigger value="scrape">Scrape Blog URL (Beta)</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Creator</CardTitle>
                <CardDescription>Create blog content based on a topic and competitor analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <BlogForm onResult={setBlogResult} />
              </CardContent>
            </Card>

            {blogResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Blog Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownViewer content={blogResult} showCopyButton={true} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="newblog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>New Blog Creator</CardTitle>
                <CardDescription>Create a new blog post from scratch with optional research</CardDescription>
              </CardHeader>
              <CardContent>
                <NewBlogForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scrape" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Scraper (In Development)</CardTitle>
                <CardDescription>Enter a URL to scrape content from the first page</CardDescription>
              </CardHeader>
              <CardContent>
                <UrlForm onResult={setScrapeResult} />
              </CardContent>
            </Card>

            {scrapeResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Scraped Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownViewer content={scrapeResult} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
