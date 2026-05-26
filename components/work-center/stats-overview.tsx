'use client'

import { useWorkCenterStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, FileText, Calendar, CheckCircle2, Clock, Star } from 'lucide-react'

export function StatsOverview() {
  const { jobApplications } = useWorkCenterStore()
  
  const fullTimeApplied = jobApplications.filter(
    (j) => j.jobType === 'full-time' && j.status !== 'interested'
  ).length
  
  const contractApplied = jobApplications.filter(
    (j) => j.jobType === 'contract' && j.status !== 'interested'
  ).length
  
  const interviewsScheduled = jobApplications.filter(
    (j) => j.status === 'interview-scheduled'
  ).length
  
  const interviewsCompleted = jobApplications.filter(
    (j) => j.status === 'interview-completed'
  ).length
  
  const interested = jobApplications.filter(
    (j) => j.status === 'interested'
  ).length
  
  const totalApplied = fullTimeApplied + contractApplied

  const stats = [
    {
      title: 'Total Applications',
      value: totalApplied,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Full-Time Applied',
      value: fullTimeApplied,
      icon: Briefcase,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Contract Applied',
      value: contractApplied,
      icon: Clock,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Interviews Scheduled',
      value: interviewsScheduled,
      icon: Calendar,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Interviews Completed',
      value: interviewsCompleted,
      icon: CheckCircle2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Interested / To Apply',
      value: interested,
      icon: Star,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
