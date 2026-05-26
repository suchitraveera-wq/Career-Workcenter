'use client'

import { useState } from 'react'
import { useWorkCenterStore, type Bookmark } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, ExternalLink, BookMarked, GraduationCap, Newspaper, FileText, Bot } from 'lucide-react'
import { toast } from 'sonner'

const categoryIcons = {
  training: GraduationCap,
  newsletter: Newspaper,
  blog: FileText,
  'agentic-ai': Bot,
  other: BookMarked,
}

const categoryColors = {
  training: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  newsletter: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  blog: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  'agentic-ai': 'bg-primary/20 text-primary border-primary/30',
  other: 'bg-muted text-muted-foreground border-muted',
}

const categoryLabels = {
  training: 'Training',
  newsletter: 'Newsletter',
  blog: 'Blog',
  'agentic-ai': 'Agentic AI',
  other: 'Other',
}

export function ResourceBookmarks() {
  const { bookmarks, addBookmark, deleteBookmark } = useWorkCenterStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'blog' as Bookmark['category'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addBookmark(formData)
    setIsDialogOpen(false)
    setFormData({ title: '', url: '', category: 'blog' })
    toast.success('Bookmark added successfully')
  }

  const handleDelete = (id: string) => {
    deleteBookmark(id)
    toast.success('Bookmark deleted')
  }

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (activeTab === 'all') return true
    return bookmark.category === activeTab
  })

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            Resource Bookmarks
          </CardTitle>
          <CardDescription>Training, newsletters, blogs, and AI resources</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bookmark</DialogTitle>
              <DialogDescription>
                Save a link to a training resource, newsletter, or blog.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: Bookmark['category']) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Training Resources</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="agentic-ai">Agentic AI Products</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Bookmark</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletters</TabsTrigger>
            <TabsTrigger value="blog">Blogs</TabsTrigger>
            <TabsTrigger value="agentic-ai">Agentic AI</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredBookmarks.map((bookmark) => {
                  const Icon = categoryIcons[bookmark.category]
                  return (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${categoryColors[bookmark.category].split(' ')[0]}`}>
                          <Icon className={`h-4 w-4 ${categoryColors[bookmark.category].split(' ')[1]}`} />
                        </div>
                        <div>
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-medium hover:text-primary"
                          >
                            {bookmark.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <Badge className={`mt-1 ${categoryColors[bookmark.category]} border text-xs`}>
                            {categoryLabels[bookmark.category]}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(bookmark.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
