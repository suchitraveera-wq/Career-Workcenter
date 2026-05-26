'use client'

import { useState } from 'react'
import { useWorkCenterStore, type Certification, type Event } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, ExternalLink, Award, Calendar, FileText, Clock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

const eventTypeColors = {
  conference: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  'paper-submission': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'certification-renewal': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  webinar: 'bg-primary/20 text-primary border-primary/30',
}

const eventTypeLabels = {
  conference: 'Conference',
  'paper-submission': 'Paper Submission',
  'certification-renewal': 'Cert Renewal',
  webinar: 'Webinar',
}

const eventTypeIcons = {
  conference: Calendar,
  'paper-submission': FileText,
  'certification-renewal': Award,
  webinar: Calendar,
}

export function CertificationArea() {
  const { 
    certifications, addCertification, deleteCertification,
    events, addEvent, deleteEvent 
  } = useWorkCenterStore()
  
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    dateEarned: '',
    expiryDate: '',
    renewalRequirements: '',
    credentialId: '',
    credentialUrl: '',
  })
  
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'conference' as Event['type'],
    date: '',
    description: '',
    url: '',
    deadline: '',
  })

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault()
    addCertification({
      ...certForm,
      expiryDate: certForm.expiryDate || undefined,
      renewalRequirements: certForm.renewalRequirements || undefined,
      credentialId: certForm.credentialId || undefined,
      credentialUrl: certForm.credentialUrl || undefined,
    })
    setIsCertDialogOpen(false)
    setCertForm({ name: '', issuer: '', dateEarned: '', expiryDate: '', renewalRequirements: '', credentialId: '', credentialUrl: '' })
    toast.success('Certification added')
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    addEvent({
      ...eventForm,
      url: eventForm.url || undefined,
      deadline: eventForm.deadline || undefined,
    })
    setIsEventDialogOpen(false)
    setEventForm({ title: '', type: 'conference', date: '', description: '', url: '', deadline: '' })
    toast.success('Event added')
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certifications & Events
        </CardTitle>
        <CardDescription>Manage certifications, conferences, and paper submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="certifications">
          <TabsList className="mb-4">
            <TabsTrigger value="certifications">Certifications ({certifications.length})</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications">
            <div className="mb-4 flex justify-end">
              <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Certification</DialogTitle>
                    <DialogDescription>
                      Track your professional certifications and renewal requirements.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCertification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="certName">Certification Name *</Label>
                      <Input
                        id="certName"
                        value={certForm.name}
                        onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="issuer">Issuing Organization *</Label>
                        <Input
                          id="issuer"
                          value={certForm.issuer}
                          onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateEarned">Date Earned *</Label>
                        <Input
                          id="dateEarned"
                          type="date"
                          value={certForm.dateEarned}
                          onChange={(e) => setCertForm({ ...certForm, dateEarned: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={certForm.expiryDate}
                          onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credentialId">Credential ID</Label>
                        <Input
                          id="credentialId"
                          value={certForm.credentialId}
                          onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="renewalRequirements">Renewal Requirements</Label>
                      <Textarea
                        id="renewalRequirements"
                        value={certForm.renewalRequirements}
                        onChange={(e) => setCertForm({ ...certForm, renewalRequirements: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credentialUrl">Credential URL</Label>
                      <Input
                        id="credentialUrl"
                        type="url"
                        value={certForm.credentialUrl}
                        onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsCertDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Certification</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-start justify-between rounded-lg border border-border/30 bg-secondary/30 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{cert.name}</h4>
                          {cert.credentialUrl && (
                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Earned: {new Date(cert.dateEarned).toLocaleDateString()}
                          </Badge>
                          {cert.expiryDate && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                isExpired(cert.expiryDate)
                                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                  : isExpiringSoon(cert.expiryDate)
                                  ? 'border-chart-3/30 bg-chart-3/10 text-chart-3'
                                  : ''
                              }`}
                            >
                              {isExpired(cert.expiryDate) && <AlertTriangle className="mr-1 h-3 w-3" />}
                              {isExpiringSoon(cert.expiryDate) && <Clock className="mr-1 h-3 w-3" />}
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                        {cert.renewalRequirements && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">Renewal: </span>
                            {cert.renewalRequirements}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCertification(cert.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="events">
            <div className="mb-4 flex justify-end">
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogDescription>
                      Add a conference, paper submission deadline, or certification renewal date.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventTitle">Title *</Label>
                      <Input
                        id="eventTitle"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Type</Label>
                        <Select value={eventForm.type} onValueChange={(value: Event['type']) => setEventForm({ ...eventForm, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="paper-submission">Paper Submission</SelectItem>
                            <SelectItem value="certification-renewal">Certification Renewal</SelectItem>
                            <SelectItem value="webinar">Webinar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Date *</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDeadline">Deadline (if different)</Label>
                      <Input
                        id="eventDeadline"
                        type="date"
                        value={eventForm.deadline}
                        onChange={(e) => setEventForm({ ...eventForm, deadline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDescription">Description</Label>
                      <Textarea
                        id="eventDescription"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventUrl">URL</Label>
                      <Input
                        id="eventUrl"
                        type="url"
                        value={eventForm.url}
                        onChange={(e) => setEventForm({ ...eventForm, url: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Event</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const Icon = eventTypeIcons[event.type]
                  const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div
                      key={event.id}
                      className="flex items-start justify-between rounded-lg border border-border/30 bg-secondary/30 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${eventTypeColors[event.type].split(' ')[0]}`}>
                          <Icon className={`h-5 w-5 ${eventTypeColors[event.type].split(' ')[1]}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            {event.url && (
                              <a href={event.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge className={`${eventTypeColors[event.type]} border text-xs`}>
                              {eventTypeLabels[event.type]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </Badge>
                            {daysUntil <= 30 && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  daysUntil <= 7
                                    ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                    : 'border-chart-3/30 bg-chart-3/10 text-chart-3'
                                }`}
                              >
                                {daysUntil} days away
                              </Badge>
                            )}
                            {event.deadline && (
                              <Badge variant="outline" className="text-xs text-destructive">
                                Deadline: {new Date(event.deadline).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEvent(event.id)}
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
