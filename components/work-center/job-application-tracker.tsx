'use client'

import { useState } from 'react'
import { useWorkCenterStore, type JobApplication, type ApplicationStatus, type JobType } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Pencil, Trash2, ExternalLink, CheckCircle2, XCircle, Building2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

const statusColors: Record<ApplicationStatus, string> = {
  'interested': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  'applied': 'bg-primary/20 text-primary border-primary/30',
  'interview-scheduled': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'interview-completed': 'bg-accent/20 text-accent border-accent/30',
  'offer': 'bg-green-500/20 text-green-400 border-green-500/30',
  'rejected': 'bg-destructive/20 text-destructive border-destructive/30',
}

const statusLabels: Record<ApplicationStatus, string> = {
  'interested': 'Interested',
  'applied': 'Applied',
  'interview-scheduled': 'Interview Scheduled',
  'interview-completed': 'Interview Completed',
  'offer': 'Offer Received',
  'rejected': 'Rejected',
}

const initialFormState = {
  companyName: '',
  jobTitle: '',
  jobDescription: '',
  dateApplied: '',
  salaryRange: '',
  benefits: '',
  skillsMatched: '',
  skillsMissing: '',
  outreachMessages: '',
  jobType: 'full-time' as JobType,
  status: 'interested' as ApplicationStatus,
  interviewDate: '',
  jobPostingUrl: '',
  notes: '',
}

export function JobApplicationTracker() {
  const { jobApplications, addJobApplication, updateJobApplication, deleteJobApplication } = useWorkCenterStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)
  const [formData, setFormData] = useState(initialFormState)
  const [activeTab, setActiveTab] = useState('all')

  const resetForm = () => {
    setFormData(initialFormState)
    setEditingJob(null)
  }

  const handleOpenDialog = (job?: JobApplication) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        dateApplied: job.dateApplied || '',
        salaryRange: job.salaryRange,
        benefits: job.benefits,
        skillsMatched: job.skillsMatched.join(', '),
        skillsMissing: job.skillsMissing.join(', '),
        outreachMessages: job.outreachMessages,
        jobType: job.jobType,
        status: job.status,
        interviewDate: job.interviewDate || '',
        jobPostingUrl: job.jobPostingUrl || '',
        notes: job.notes || '',
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const jobData = {
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      dateApplied: formData.status === 'interested' ? null : formData.dateApplied || new Date().toISOString().split('T')[0],
      salaryRange: formData.salaryRange,
      benefits: formData.benefits,
      skillsMatched: formData.skillsMatched.split(',').map((s) => s.trim()).filter(Boolean),
      skillsMissing: formData.skillsMissing.split(',').map((s) => s.trim()).filter(Boolean),
      outreachMessages: formData.outreachMessages,
      jobType: formData.jobType,
      status: formData.status,
      interviewDate: formData.interviewDate || undefined,
      jobPostingUrl: formData.jobPostingUrl || undefined,
      notes: formData.notes || undefined,
    }

    if (editingJob) {
      updateJobApplication(editingJob.id, jobData)
      toast.success('Job application updated successfully')
    } else {
      addJobApplication(jobData)
      toast.success('Job application added successfully')
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    deleteJobApplication(id)
    toast.success('Job application deleted')
  }

  const filteredJobs = jobApplications.filter((job) => {
    if (activeTab === 'all') return true
    if (activeTab === 'interested') return job.status === 'interested'
    if (activeTab === 'applied') return job.status === 'applied'
    if (activeTab === 'interviews') return job.status === 'interview-scheduled' || job.status === 'interview-completed'
    if (activeTab === 'full-time') return job.jobType === 'full-time'
    if (activeTab === 'contract') return job.jobType === 'contract'
    return true
  })

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Job Application Tracker
          </CardTitle>
          <CardDescription>Track and manage your job applications</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Application' : 'Add New Application'}</DialogTitle>
              <DialogDescription>
                {editingJob ? 'Update the details of your job application.' : 'Enter the details of the job you want to track.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType} onValueChange={(value: JobType) => setFormData({ ...formData, jobType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: ApplicationStatus) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">Interested (Not Applied)</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="interview-completed">Interview Completed</SelectItem>
                      <SelectItem value="offer">Offer Received</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateApplied">Date Applied</Label>
                  <Input
                    id="dateApplied"
                    type="date"
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Input
                    id="salaryRange"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                    placeholder="$150,000 - $200,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Input
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Health, 401k, Remote"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="skillsMatched">Skills Matched (comma-separated)</Label>
                  <Input
                    id="skillsMatched"
                    value={formData.skillsMatched}
                    onChange={(e) => setFormData({ ...formData, skillsMatched: e.target.value })}
                    placeholder="Product Strategy, Agile, Leadership"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillsMissing">Skills Missing (comma-separated)</Label>
                  <Input
                    id="skillsMissing"
                    value={formData.skillsMissing}
                    onChange={(e) => setFormData({ ...formData, skillsMissing: e.target.value })}
                    placeholder="ML/AI, Specific Domain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobPostingUrl">Job Posting URL</Label>
                <Input
                  id="jobPostingUrl"
                  type="url"
                  value={formData.jobPostingUrl}
                  onChange={(e) => setFormData({ ...formData, jobPostingUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outreachMessages">Outreach Messages / Notes</Label>
                <Textarea
                  id="outreachMessages"
                  value={formData.outreachMessages}
                  onChange={(e) => setFormData({ ...formData, outreachMessages: e.target.value })}
                  rows={2}
                  placeholder="Connected with hiring manager..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingJob ? 'Update' : 'Add'} Application
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="all">All ({jobApplications.length})</TabsTrigger>
            <TabsTrigger value="interested">Interested ({jobApplications.filter(j => j.status === 'interested').length})</TabsTrigger>
            <TabsTrigger value="applied">Applied ({jobApplications.filter(j => j.status === 'applied').length})</TabsTrigger>
            <TabsTrigger value="interviews">Interviews ({jobApplications.filter(j => j.status === 'interview-scheduled' || j.status === 'interview-completed').length})</TabsTrigger>
            <TabsTrigger value="full-time">Full-Time</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Company</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="hidden md:table-cell">Date Applied</TableHead>
                    <TableHead className="hidden lg:table-cell">Salary</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id} className="border-border/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {job.companyName}
                          {job.jobPostingUrl && (
                            <a href={job.jobPostingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.jobType === 'contract' ? 'Contract' : 'Full-Time'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[150px] truncate">{job.jobTitle}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.dateApplied ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(job.dateApplied).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                        {job.interviewDate && (
                          <div className="mt-1 text-xs text-chart-2">
                            Interview: {new Date(job.interviewDate).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">{job.salaryRange || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {job.skillsMatched.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="flex items-center gap-1 border-accent/30 bg-accent/10 text-xs text-accent">
                              <CheckCircle2 className="h-2 w-2" />
                              {skill}
                            </Badge>
                          ))}
                          {job.skillsMissing.slice(0, 1).map((skill) => (
                            <Badge key={skill} variant="outline" className="flex items-center gap-1 border-destructive/30 bg-destructive/10 text-xs text-destructive">
                              <XCircle className="h-2 w-2" />
                              {skill}
                            </Badge>
                          ))}
                          {(job.skillsMatched.length + job.skillsMissing.length > 3) && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skillsMatched.length + job.skillsMissing.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[job.status]} border`}>
                          {statusLabels[job.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(job)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(job.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
