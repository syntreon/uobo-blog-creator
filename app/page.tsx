"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrlForm } from "@/components/forms/UrlForm"
import { BlogForm } from "@/components/forms/BlogForm"
import { MarkdownViewer } from "@/components/MarkdownViewer"
import { ThemeToggle } from "@/components/theme-toggle"
import { NewBlogForm } from "@/components/forms/NewBlogForm"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react" // ui: double arrow icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HomePage() {
  const [scrapeResult, setScrapeResult] = useState<string>("")
  const [blogResult, setBlogResult] = useState<string>("")
  const [tab, setTab] = useState<string>("blog") // control tabs

  const TAB_LABELS: Record<string, string> = {
    blog: "Create Blog from Competitor",
    newblog: "Create New Blog",
    scrape: "Scrape Blog URL (Beta)",
  }

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
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {/* mobile: dropdown selector */}
          <div className="mb-4 sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{TAB_LABELS[tab]}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--dd-w,18rem)]">
                <DropdownMenuItem onSelect={() => setTab("blog")}>{TAB_LABELS.blog}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTab("newblog")}>{TAB_LABELS.newblog}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTab("scrape")}>{TAB_LABELS.scrape}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* desktop: classic tabs */}
          <TabsList className="w-full mb-6 hidden sm:grid sm:grid-cols-3">
            <TabsTrigger
              value="blog"
              className="text-sm truncate"
            >
              {TAB_LABELS.blog}
            </TabsTrigger>
            <TabsTrigger
              value="newblog"
              className="text-sm truncate"
            >
              {TAB_LABELS.newblog}
            </TabsTrigger>
            <TabsTrigger
              value="scrape"
              className="text-sm truncate"
            >
              {TAB_LABELS.scrape}
            </TabsTrigger>
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
