'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWorkCenterStore } from '@/lib/store'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import { TrendingUp, Target, Briefcase, Calendar } from 'lucide-react'

const COLORS = {
  primary: '#22d3ee',
  accent: '#34d399',
  warning: '#fbbf24',
  destructive: '#f87171',
  muted: '#64748b',
  purple: '#a78bfa',
}

const STATUS_COLORS: Record<string, string> = {
  interested: COLORS.muted,
  applied: COLORS.primary,
  'interview-scheduled': COLORS.warning,
  'interview-completed': COLORS.accent,
  offer: '#22c55e',
  rejected: COLORS.destructive,
}

const JOB_TYPE_COLORS = {
  'full-time': COLORS.primary,
  contract: COLORS.purple,
}

export function ApplicationVisualizations() {
  const { jobApplications } = useWorkCenterStore()

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    jobApplications.forEach((job) => {
      counts[job.status] = (counts[job.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value,
      fill: STATUS_COLORS[name] || COLORS.muted,
    }))
  }, [jobApplications])

  const jobTypeData = useMemo(() => {
    const fullTime = jobApplications.filter((j) => j.jobType === 'full-time').length
    const contract = jobApplications.filter((j) => j.jobType === 'contract').length
    return [
      { name: 'Full-Time', value: fullTime, fill: JOB_TYPE_COLORS['full-time'] },
      { name: 'Contract', value: contract, fill: JOB_TYPE_COLORS.contract },
    ]
  }, [jobApplications])

  const applicationTimelineData = useMemo(() => {
    const sortedApps = [...jobApplications]
      .filter((j) => j.dateAdded)
      .sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())

    const dateMap: Record<string, { date: string; applications: number; cumulative: number }> = {}
    let cumulative = 0

    sortedApps.forEach((job) => {
      const date = job.dateAdded
      if (!dateMap[date]) {
        dateMap[date] = { date, applications: 0, cumulative: 0 }
      }
      dateMap[date].applications += 1
      cumulative += 1
      dateMap[date].cumulative = cumulative
    })

    return Object.values(dateMap).slice(-14)
  }, [jobApplications])

  const interviewFunnelData = useMemo(() => {
    const total = jobApplications.length
    const applied = jobApplications.filter((j) => j.status !== 'interested').length
    const interviewed = jobApplications.filter(
      (j) => j.status === 'interview-scheduled' || j.status === 'interview-completed' || j.status === 'offer'
    ).length
    const completed = jobApplications.filter(
      (j) => j.status === 'interview-completed' || j.status === 'offer'
    ).length
    const offers = jobApplications.filter((j) => j.status === 'offer').length

    return [
      { stage: 'Total', count: total, fill: COLORS.muted },
      { stage: 'Applied', count: applied, fill: COLORS.primary },
      { stage: 'Interviews', count: interviewed, fill: COLORS.warning },
      { stage: 'Completed', count: completed, fill: COLORS.accent },
      { stage: 'Offers', count: offers, fill: '#22c55e' },
    ]
  }, [jobApplications])

  const salaryRangeData = useMemo(() => {
    const ranges: Record<string, number> = {
      '< $150k': 0,
      '$150k - $180k': 0,
      '$180k - $200k': 0,
      '$200k - $230k': 0,
      '$230k+': 0,
      'Hourly/Contract': 0,
    }

    jobApplications.forEach((job) => {
      const salary = job.salaryRange.toLowerCase()
      if (salary.includes('/hour') || salary.includes('hourly')) {
        ranges['Hourly/Contract'] += 1
      } else {
        const match = salary.match(/\$?([\d,]+)/g)
        if (match && match.length > 0) {
          const maxSalary = parseInt(match[match.length - 1].replace(/[$,]/g, ''), 10)
          if (maxSalary < 150000) ranges['< $150k'] += 1
          else if (maxSalary <= 180000) ranges['$150k - $180k'] += 1
          else if (maxSalary <= 200000) ranges['$180k - $200k'] += 1
          else if (maxSalary <= 230000) ranges['$200k - $230k'] += 1
          else ranges['$230k+'] += 1
        }
      }
    })

    return Object.entries(ranges)
      .filter(([, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        fill: [COLORS.muted, COLORS.primary, COLORS.accent, COLORS.warning, COLORS.purple, '#f472b6'][index],
      }))
  }, [jobApplications])

  const skillsAnalysis = useMemo(() => {
    const matchedSkills: Record<string, number> = {}
    const missingSkills: Record<string, number> = {}

    jobApplications.forEach((job) => {
      job.skillsMatched.forEach((skill) => {
        matchedSkills[skill] = (matchedSkills[skill] || 0) + 1
      })
      job.skillsMissing.forEach((skill) => {
        missingSkills[skill] = (missingSkills[skill] || 0) + 1
      })
    })

    const topMatched = Object.entries(matchedSkills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill, count]) => ({ skill, count, type: 'matched' }))

    const topMissing = Object.entries(missingSkills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([skill, count]) => ({ skill, count, type: 'missing' }))

    return { topMatched, topMissing }
  }, [jobApplications])

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Status Distribution */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Application Status
            </CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Job Type Distribution */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-accent" />
              Job Types
            </CardTitle>
            <CardDescription>Full-time vs Contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {jobTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Interview Funnel */}
        <Card className="border-border/50 bg-card/50 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-warning" />
              Application Funnel
            </CardTitle>
            <CardDescription>Conversion through stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interviewFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {interviewFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Timeline and Salary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Timeline */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Application Timeline
            </CardTitle>
            <CardDescription>Cumulative applications over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={applicationTimelineData}>
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fill="url(#colorCumulative)"
                    name="Total Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={{ fill: COLORS.accent, r: 4 }}
                    name="New Applications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Salary Distribution */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-accent" />
              Salary Range Distribution
            </CardTitle>
            <CardDescription>Applications by compensation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryRangeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Applications">
                    {salaryRangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Skills Analysis */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Skills Analysis</CardTitle>
          <CardDescription>Your strengths and areas for development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-medium text-accent">Top Matched Skills</h4>
              <div className="space-y-2">
                {skillsAnalysis.topMatched.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.skill}</span>
                        <span className="text-muted-foreground">{item.count} jobs</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${(item.count / jobApplications.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium text-warning">Skills to Develop</h4>
              <div className="space-y-2">
                {skillsAnalysis.topMissing.length > 0 ? (
                  skillsAnalysis.topMissing.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-foreground">{item.skill}</span>
                          <span className="text-muted-foreground">{item.count} jobs</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-warning transition-all"
                            style={{ width: `${(item.count / jobApplications.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skill gaps identified yet.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
