'use client'

import { useWorkCenterStore, type InspirationalVideo } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, Play, Video, GraduationCap, Users, Heart, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const categoryIcons = {
  commencement: GraduationCap,
  leadership: Users,
  'womens-leadership': Heart,
  'professional-development': Rocket,
  'personal-development': Heart,
}

const categoryColors = {
  commencement: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  leadership: 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'womens-leadership': 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  'professional-development': 'bg-primary/20 text-primary border-primary/30',
  'personal-development': 'bg-accent/20 text-accent border-accent/30',
}

const categoryLabels = {
  commencement: 'Commencement',
  leadership: 'Leadership',
  'womens-leadership': "Women's Leadership",
  'professional-development': 'Professional Dev',
  'personal-development': 'Personal Dev',
}

export function InspirationalVideos() {
  const { inspirationalVideos, addInspirationalVideo, deleteInspirationalVideo } = useWorkCenterStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    url: '',
    category: 'leadership' as InspirationalVideo['category'],
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addInspirationalVideo(formData)
    setIsDialogOpen(false)
    setFormData({ title: '', speaker: '', url: '', category: 'leadership', description: '' })
    toast.success('Video added successfully')
  }

  const handleDelete = (id: string) => {
    deleteInspirationalVideo(id)
    toast.success('Video removed')
  }

  const filteredVideos = inspirationalVideos.filter((video) => {
    if (activeTab === 'all') return true
    return video.category === activeTab
  })

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Inspirational Videos
          </CardTitle>
          <CardDescription>Commencement speeches, leadership, and development</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inspirational Video</DialogTitle>
              <DialogDescription>
                Add a link to an inspirational speech or video.
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
                <Label htmlFor="speaker">Speaker *</Label>
                <Input
                  id="speaker"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Video URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: InspirationalVideo['category']) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commencement">Commencement Speech</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="womens-leadership">Women&apos;s Leadership</SelectItem>
                    <SelectItem value="professional-development">Professional Development</SelectItem>
                    <SelectItem value="personal-development">Personal Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Video</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="commencement">Commencement</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="womens-leadership">Women&apos;s</TabsTrigger>
            <TabsTrigger value="professional-development">Prof Dev</TabsTrigger>
            <TabsTrigger value="personal-development">Personal</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <ScrollArea className="h-[300px]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const Icon = categoryIcons[video.category]
                  const embedUrl = getYouTubeEmbedUrl(video.url)
                  return (
                    <div
                      key={video.id}
                      className="group rounded-lg border border-border/30 bg-secondary/30 overflow-hidden"
                    >
                      {embedUrl ? (
                        <div className="relative aspect-video bg-muted">
                          <iframe
                            src={embedUrl}
                            title={video.title}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex aspect-video items-center justify-center bg-muted hover:bg-muted/80"
                        >
                          <Play className="h-12 w-12 text-primary" />
                        </a>
                      )}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1">{video.title}</h4>
                            <p className="text-sm text-muted-foreground">{video.speaker}</p>
                            {video.description && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                {video.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(video.id)}
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className={`${categoryColors[video.category]} border text-xs`}>
                            <Icon className="mr-1 h-3 w-3" />
                            {categoryLabels[video.category]}
                          </Badge>
                        </div>
                      </div>
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
