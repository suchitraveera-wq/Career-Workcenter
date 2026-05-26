'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Newspaper,
  TrendingUp,
  Building2,
  MapPin,
  ExternalLink,
  RefreshCw,
  Briefcase,
  BarChart3,
  Globe,
  Sparkles,
  Home,
  Star,
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  summary: string
  url: string
  category: 'hiring' | 'industry' | 'trends' | 'local' | 'texas' | 'dfw'
  tags: string[]
}

interface CompanyHiring {
  id: string
  company: string
  logo?: string
  role: string
  location: string
  type: 'full-time' | 'contract' | 'hybrid'
  remote: boolean
  level: 'senior' | 'staff' | 'principal' | 'director' | 'vp' | 'head'
  postedDate: string
  salaryRange?: string
  url: string
  hot?: boolean
}

interface IndustryTrend {
  industry: string
  growth: number
  pmDemand: 'high' | 'medium' | 'low'
  avgSalary: string
  topSkills: string[]
}

// Mock data - In production, this would come from an API
const mockNews: NewsItem[] = [
  // National News
  {
    id: '1',
    title: 'Tech Giants Ramp Up Product Manager Hiring Amid AI Push',
    source: 'TechCrunch',
    date: '2026-05-26',
    summary: 'Major technology companies including Google, Microsoft, and Amazon are significantly expanding their product management teams as they accelerate AI product development.',
    url: 'https://techcrunch.com',
    category: 'hiring',
    tags: ['AI', 'Big Tech', 'Hiring Surge'],
  },
  {
    id: '2',
    title: 'Product Management Salaries Hit Record Highs in 2026',
    source: 'Glassdoor',
    date: '2026-05-25',
    summary: 'Average PM compensation reaches $195,000 as competition for experienced product leaders intensifies across industries.',
    url: 'https://glassdoor.com',
    category: 'trends',
    tags: ['Salary', 'Compensation', 'Market Trends'],
  },
  {
    id: '3',
    title: 'Healthcare Tech Sector Sees 40% Increase in PM Roles',
    source: 'Healthcare IT News',
    date: '2026-05-24',
    summary: 'Digital health transformation drives unprecedented demand for product managers with healthcare domain expertise.',
    url: 'https://healthcareitnews.com',
    category: 'industry',
    tags: ['Healthcare', 'Digital Health', 'Growth'],
  },
  {
    id: '4',
    title: 'Remote-First Companies Lead PM Hiring Trends',
    source: 'Forbes',
    date: '2026-05-23',
    summary: 'Companies with remote-first policies are attracting top product talent by offering flexibility and competitive compensation.',
    url: 'https://forbes.com',
    category: 'trends',
    tags: ['Remote Work', 'Flexibility', 'Work-Life Balance'],
  },
  {
    id: '5',
    title: 'AI Product Management Emerges as Fastest Growing Specialty',
    source: 'Product Coalition',
    date: '2026-05-22',
    summary: 'Demand for PMs with AI/ML expertise grows 150% year-over-year as companies race to implement AI solutions.',
    url: 'https://productcoalition.com',
    category: 'industry',
    tags: ['AI/ML', 'Specialization', 'Career Growth'],
  },
  {
    id: '6',
    title: 'Enterprise Software Companies Post Record PM Openings',
    source: 'Business Insider',
    date: '2026-05-22',
    summary: 'B2B SaaS companies like Salesforce, ServiceNow, and Workday significantly expand product organizations.',
    url: 'https://businessinsider.com',
    category: 'hiring',
    tags: ['Enterprise', 'B2B SaaS', 'Expansion'],
  },
  // DFW Local News
  {
    id: '7',
    title: 'Dallas-Fort Worth Emerges as Top 5 Tech Hub for Product Managers',
    source: 'Dallas Morning News',
    date: '2026-05-26',
    summary: 'DFW metro area ranks among top destinations for PM talent with 35% growth in tech jobs. Companies cite lower cost of living and growing talent pool.',
    url: 'https://dallasnews.com',
    category: 'dfw',
    tags: ['DFW', 'Tech Hub', 'Growth', 'Relocation'],
  },
  {
    id: '8',
    title: 'Toyota Connected Expands Plano Campus, Adding 200 Product Roles',
    source: 'Fort Worth Star-Telegram',
    date: '2026-05-25',
    summary: 'Toyota\'s connected services division announces major expansion in Plano, creating significant opportunities for senior product managers in automotive tech.',
    url: 'https://star-telegram.com',
    category: 'dfw',
    tags: ['Toyota', 'Plano', 'Automotive', 'Expansion'],
  },
  {
    id: '9',
    title: 'Capital One Tech Center in Plano Hiring 150 PMs for AI Initiatives',
    source: 'Dallas Business Journal',
    date: '2026-05-24',
    summary: 'Capital One expands its Plano technology hub with focus on AI/ML product development, seeking experienced product leaders.',
    url: 'https://bizjournals.com/dallas',
    category: 'dfw',
    tags: ['Capital One', 'Plano', 'AI', 'Fintech'],
  },
  {
    id: '10',
    title: 'AT&T Dallas HQ Restructures Product Organization, New Leadership Roles',
    source: 'Dallas Morning News',
    date: '2026-05-23',
    summary: 'AT&T announces restructuring of its product management division with new director and VP positions at Downtown Dallas headquarters.',
    url: 'https://dallasnews.com',
    category: 'dfw',
    tags: ['AT&T', 'Dallas', 'Telecom', 'Leadership'],
  },
  {
    id: '11',
    title: 'Southwest Airlines Invests in Digital Product Team at Dallas HQ',
    source: 'Fort Worth Business Press',
    date: '2026-05-22',
    summary: 'Southwest expands digital product capabilities with new roles focusing on customer experience and mobile applications.',
    url: 'https://fortworthbusiness.com',
    category: 'dfw',
    tags: ['Southwest Airlines', 'Dallas', 'Travel Tech', 'Digital'],
  },
  // Texas State News
  {
    id: '12',
    title: 'Texas Tech Industry Adds 50,000 Jobs, PM Demand Surges',
    source: 'Texas Monthly',
    date: '2026-05-26',
    summary: 'Texas continues to lead nation in tech job growth with Austin, Dallas, and Houston metros driving demand for product management talent.',
    url: 'https://texasmonthly.com',
    category: 'texas',
    tags: ['Texas', 'Job Growth', 'Tech Industry'],
  },
  {
    id: '13',
    title: 'Austin Remains #1 for PM Salaries in Texas, DFW Close Behind',
    source: 'Austin Business Journal',
    date: '2026-05-25',
    summary: 'Austin PM salaries average $205K while DFW reaches $185K. Houston healthcare tech offers competitive packages for specialized PMs.',
    url: 'https://bizjournals.com/austin',
    category: 'texas',
    tags: ['Austin', 'DFW', 'Salary', 'Texas'],
  },
  {
    id: '14',
    title: 'Houston Healthcare Tech Corridor Creates 5,000 PM Opportunities',
    source: 'Houston Chronicle',
    date: '2026-05-24',
    summary: 'Texas Medical Center and surrounding healthtech companies drive unprecedented demand for product managers with healthcare expertise.',
    url: 'https://houstonchronicle.com',
    category: 'texas',
    tags: ['Houston', 'Healthcare', 'Texas Medical Center'],
  },
  {
    id: '15',
    title: 'San Antonio Cybersecurity Hub Seeks Senior Product Leaders',
    source: 'San Antonio Express-News',
    date: '2026-05-23',
    summary: 'Growing cybersecurity sector in San Antonio creates opportunities for PMs with security domain expertise.',
    url: 'https://expressnews.com',
    category: 'texas',
    tags: ['San Antonio', 'Cybersecurity', 'Defense Tech'],
  },
  {
    id: '16',
    title: 'Texas No-Income-Tax Advantage Attracts Remote PM Talent',
    source: 'Texas Tribune',
    date: '2026-05-22',
    summary: 'Product managers relocating to Texas cite no state income tax as major factor, with DFW and Austin seeing highest influx.',
    url: 'https://texastribune.org',
    category: 'texas',
    tags: ['Texas', 'Tax Advantage', 'Relocation', 'Remote'],
  },
]

const mockCompaniesHiring: CompanyHiring[] = [
  // Remote Senior+ Positions
  {
    id: '1',
    company: 'OpenAI',
    role: 'Senior Product Manager - ChatGPT Enterprise',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'senior',
    postedDate: '2026-05-26',
    salaryRange: '$200,000 - $300,000',
    url: 'https://openai.com/careers',
    hot: true,
  },
  {
    id: '2',
    company: 'Anthropic',
    role: 'Staff Product Manager - Claude Platform',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'staff',
    postedDate: '2026-05-26',
    salaryRange: '$250,000 - $350,000',
    url: 'https://anthropic.com/careers',
    hot: true,
  },
  {
    id: '3',
    company: 'Stripe',
    role: 'Director of Product - Payments Platform',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'director',
    postedDate: '2026-05-25',
    salaryRange: '$280,000 - $380,000',
    url: 'https://stripe.com/jobs',
    hot: true,
  },
  {
    id: '4',
    company: 'GitLab',
    role: 'Principal Product Manager - DevSecOps',
    location: 'Remote (All-Remote Company)',
    type: 'full-time',
    remote: true,
    level: 'principal',
    postedDate: '2026-05-25',
    salaryRange: '$210,000 - $280,000',
    url: 'https://gitlab.com/jobs',
    hot: true,
  },
  {
    id: '5',
    company: 'Zapier',
    role: 'Senior Product Manager - AI Automation',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'senior',
    postedDate: '2026-05-25',
    salaryRange: '$180,000 - $240,000',
    url: 'https://zapier.com/jobs',
  },
  {
    id: '6',
    company: 'Notion',
    role: 'Head of Product - Enterprise',
    location: 'Remote US (Occasional SF Travel)',
    type: 'full-time',
    remote: true,
    level: 'head',
    postedDate: '2026-05-24',
    salaryRange: '$320,000 - $420,000',
    url: 'https://notion.so/careers',
    hot: true,
  },
  {
    id: '7',
    company: 'Figma',
    role: 'Staff Product Manager - FigJam',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'staff',
    postedDate: '2026-05-24',
    salaryRange: '$230,000 - $300,000',
    url: 'https://figma.com/careers',
  },
  {
    id: '8',
    company: 'Datadog',
    role: 'VP of Product - Observability',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'vp',
    postedDate: '2026-05-24',
    salaryRange: '$350,000 - $450,000',
    url: 'https://datadog.com/careers',
    hot: true,
  },
  {
    id: '9',
    company: 'Vercel',
    role: 'Senior Product Manager - Developer Experience',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'senior',
    postedDate: '2026-05-24',
    salaryRange: '$190,000 - $250,000',
    url: 'https://vercel.com/careers',
  },
  {
    id: '10',
    company: 'Coinbase',
    role: 'Director of Product - Institutional Trading',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'director',
    postedDate: '2026-05-23',
    salaryRange: '$270,000 - $360,000',
    url: 'https://coinbase.com/careers',
  },
  {
    id: '11',
    company: 'Atlassian',
    role: 'Principal Product Manager - Jira Cloud',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'principal',
    postedDate: '2026-05-23',
    salaryRange: '$220,000 - $290,000',
    url: 'https://atlassian.com/careers',
  },
  {
    id: '12',
    company: 'Twilio',
    role: 'Senior Product Manager - Communications API',
    location: 'Remote US',
    type: 'full-time',
    remote: true,
    level: 'senior',
    postedDate: '2026-05-23',
    salaryRange: '$175,000 - $235,000',
    url: 'https://twilio.com/careers',
  },
  // DFW Area Positions
  {
    id: '13',
    company: 'Capital One',
    role: 'Director of Product - AI/ML Platform',
    location: 'Plano, TX (Hybrid)',
    type: 'full-time',
    remote: false,
    level: 'director',
    postedDate: '2026-05-26',
    salaryRange: '$240,000 - $320,000',
    url: 'https://capitalone.com/careers',
    hot: true,
  },
  {
    id: '14',
    company: 'Toyota Connected',
    role: 'Senior Product Manager - Connected Vehicles',
    location: 'Plano, TX',
    type: 'full-time',
    remote: false,
    level: 'senior',
    postedDate: '2026-05-25',
    salaryRange: '$170,000 - $220,000',
    url: 'https://toyotaconnected.com/careers',
  },
  {
    id: '15',
    company: 'AT&T',
    role: 'VP of Product - Consumer Digital',
    location: 'Dallas, TX',
    type: 'full-time',
    remote: false,
    level: 'vp',
    postedDate: '2026-05-25',
    salaryRange: '$300,000 - $400,000',
    url: 'https://att.jobs',
    hot: true,
  },
  {
    id: '16',
    company: 'Southwest Airlines',
    role: 'Senior Product Manager - Mobile Experience',
    location: 'Dallas, TX (Hybrid)',
    type: 'full-time',
    remote: false,
    level: 'senior',
    postedDate: '2026-05-24',
    salaryRange: '$160,000 - $210,000',
    url: 'https://careers.southwestair.com',
  },
  {
    id: '17',
    company: 'Match Group',
    role: 'Staff Product Manager - Tinder',
    location: 'Dallas, TX',
    type: 'full-time',
    remote: false,
    level: 'staff',
    postedDate: '2026-05-24',
    salaryRange: '$200,000 - $270,000',
    url: 'https://mtch.com/careers',
  },
  {
    id: '18',
    company: 'Charles Schwab',
    role: 'Director of Product - Digital Investing',
    location: 'Westlake, TX',
    type: 'full-time',
    remote: false,
    level: 'director',
    postedDate: '2026-05-23',
    salaryRange: '$230,000 - $300,000',
    url: 'https://schwab.com/careers',
  },
  {
    id: '19',
    company: 'McKesson',
    role: 'Senior Product Manager - Healthcare AI',
    location: 'Irving, TX',
    type: 'full-time',
    remote: false,
    level: 'senior',
    postedDate: '2026-05-23',
    salaryRange: '$165,000 - $215,000',
    url: 'https://mckesson.com/careers',
  },
  {
    id: '20',
    company: 'Salesforce',
    role: 'Principal Product Manager - Slack',
    location: 'Dallas, TX (Hybrid)',
    type: 'full-time',
    remote: false,
    level: 'principal',
    postedDate: '2026-05-22',
    salaryRange: '$220,000 - $290,000',
    url: 'https://salesforce.com/careers',
  },
  // Contract Positions
  {
    id: '21',
    company: 'McKinsey Digital',
    role: 'Senior Product Strategy Consultant',
    location: 'Remote US',
    type: 'contract',
    remote: true,
    level: 'senior',
    postedDate: '2026-05-25',
    salaryRange: '$185/hour',
    url: 'https://mckinsey.com/careers',
  },
  {
    id: '22',
    company: 'Deloitte Digital',
    role: 'Director - Product Transformation',
    location: 'Remote / Dallas, TX',
    type: 'contract',
    remote: true,
    level: 'director',
    postedDate: '2026-05-24',
    salaryRange: '$200/hour',
    url: 'https://deloitte.com/careers',
  },
  {
    id: '23',
    company: 'BCG Digital Ventures',
    role: 'Principal Product Manager (Contract)',
    location: 'Remote US',
    type: 'contract',
    remote: true,
    level: 'principal',
    postedDate: '2026-05-23',
    salaryRange: '$175/hour',
    url: 'https://bcgdv.com/careers',
  },
]

const industryTrends: IndustryTrend[] = [
  {
    industry: 'Artificial Intelligence',
    growth: 45,
    pmDemand: 'high',
    avgSalary: '$225,000',
    topSkills: ['ML/AI', 'Data Products', 'Platform Thinking'],
  },
  {
    industry: 'Healthcare Tech',
    growth: 38,
    pmDemand: 'high',
    avgSalary: '$195,000',
    topSkills: ['HIPAA', 'B2B', 'Regulatory'],
  },
  {
    industry: 'Fintech',
    growth: 32,
    pmDemand: 'high',
    avgSalary: '$210,000',
    topSkills: ['Payments', 'Compliance', 'API Products'],
  },
  {
    industry: 'Enterprise SaaS',
    growth: 28,
    pmDemand: 'medium',
    avgSalary: '$190,000',
    topSkills: ['B2B', 'Enterprise Sales', 'Platform'],
  },
  {
    industry: 'E-commerce',
    growth: 22,
    pmDemand: 'medium',
    avgSalary: '$175,000',
    topSkills: ['Marketplace', 'Consumer', 'Growth'],
  },
  {
    industry: 'Climate Tech',
    growth: 35,
    pmDemand: 'medium',
    avgSalary: '$185,000',
    topSkills: ['Sustainability', 'B2B', 'Hardware'],
  },
]

const levelLabels: Record<string, string> = {
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
  director: 'Director',
  vp: 'VP',
  head: 'Head of',
}

const levelColors: Record<string, string> = {
  senior: 'bg-primary/20 text-primary',
  staff: 'bg-accent/20 text-accent',
  principal: 'bg-purple-500/20 text-purple-400',
  director: 'bg-warning/20 text-warning',
  vp: 'bg-pink-500/20 text-pink-400',
  head: 'bg-destructive/20 text-destructive',
}

export function CareerNews() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeJobFilter, setActiveJobFilter] = useState<string>('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredNews = activeCategory === 'all' 
    ? mockNews 
    : mockNews.filter((n) => n.category === activeCategory)

  const filteredJobs = mockCompaniesHiring.filter((job) => {
    if (activeJobFilter === 'all') return true
    if (activeJobFilter === 'remote') return job.remote
    if (activeJobFilter === 'dfw') return job.location.toLowerCase().includes('tx') || job.location.toLowerCase().includes('texas')
    if (activeJobFilter === 'contract') return job.type === 'contract'
    if (activeJobFilter === 'director+') return ['director', 'vp', 'head'].includes(job.level)
    return true
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const categoryColors: Record<string, string> = {
    hiring: 'bg-accent/20 text-accent',
    industry: 'bg-primary/20 text-primary',
    trends: 'bg-warning/20 text-warning',
    local: 'bg-purple-500/20 text-purple-400',
    dfw: 'bg-blue-500/20 text-blue-400',
    texas: 'bg-orange-500/20 text-orange-400',
  }

  const demandColors: Record<string, string> = {
    high: 'text-accent',
    medium: 'text-warning',
    low: 'text-muted-foreground',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Career News & Market Insights</h3>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="hiring" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">PM Openings</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Industry Trends</span>
          </TabsTrigger>
        </TabsList>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All News' },
              { id: 'dfw', label: 'DFW Local' },
              { id: 'texas', label: 'Texas' },
              { id: 'hiring', label: 'Hiring' },
              { id: 'industry', label: 'Industry' },
              { id: 'trends', label: 'Trends' },
            ].map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? 'bg-primary/10 text-primary' : ''}
              >
                {category.id === 'dfw' && <MapPin className="mr-1 h-3 w-3" />}
                {category.id === 'texas' && <Star className="mr-1 h-3 w-3" />}
                {category.label}
              </Button>
            ))}
          </div>

          {/* DFW Highlight Banner */}
          {(activeCategory === 'all' || activeCategory === 'dfw') && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400">Dallas-Fort Worth Tech Scene</h4>
                  <p className="text-sm text-muted-foreground">
                    DFW ranks #4 in US for tech job growth. Major employers: Capital One, Toyota, AT&T, Southwest Airlines, Match Group
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* News List */}
          <div className="grid gap-4">
            {filteredNews.map((news) => (
              <Card key={news.id} className="border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={categoryColors[news.category]}>
                          {news.category === 'dfw' ? 'DFW' : news.category === 'texas' ? 'Texas' : news.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{news.source}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(news.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium leading-snug">{news.title}</h4>
                      <p className="text-sm text-muted-foreground">{news.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {news.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                      <a href={news.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Companies Hiring Tab */}
        <TabsContent value="hiring" className="space-y-4">
          {/* Job Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Openings', icon: Briefcase },
              { id: 'remote', label: 'Remote', icon: Home },
              { id: 'dfw', label: 'DFW / Texas', icon: MapPin },
              { id: 'director+', label: 'Director+', icon: Star },
              { id: 'contract', label: 'Contract', icon: Building2 },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeJobFilter === filter.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveJobFilter(filter.id)}
                className={activeJobFilter === filter.id ? 'bg-primary/10 text-primary' : ''}
              >
                <filter.icon className="mr-1 h-3 w-3" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Job Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">{mockCompaniesHiring.filter(j => j.remote).length}</div>
                <p className="text-xs text-muted-foreground">Remote Positions</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{mockCompaniesHiring.filter(j => j.location.toLowerCase().includes('tx')).length}</div>
                <p className="text-xs text-muted-foreground">Texas / DFW</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-warning">{mockCompaniesHiring.filter(j => ['director', 'vp', 'head'].includes(j.level)).length}</div>
                <p className="text-xs text-muted-foreground">Director+ Level</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-accent">{mockCompaniesHiring.filter(j => j.hot).length}</div>
                <p className="text-xs text-muted-foreground">Hot Opportunities</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredJobs.map((company) => (
              <Card key={company.id} className="border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{company.company}</h4>
                          {company.hot && (
                            <Badge className="bg-destructive/20 text-destructive">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Hot
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-primary">{company.role}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className={levelColors[company.level]}>
                          {levelLabels[company.level]}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {company.remote && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Home className="h-3 w-3" />
                          Remote
                        </Badge>
                      )}
                      <Badge variant="outline" className={company.type === 'full-time' ? 'border-accent/50 text-accent' : 'border-purple-500/50 text-purple-400'}>
                        {company.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.location}
                      </span>
                      {company.salaryRange && (
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {company.salaryRange}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posted {new Date(company.postedDate).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm" asChild className="gap-2">
                        <a href={company.url} target="_blank" rel="noopener noreferrer">
                          View Job
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Industry Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-primary" />
                Industry Growth & PM Demand
              </CardTitle>
              <CardDescription>
                Year-over-year hiring growth and salary benchmarks for Product Managers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryTrends.map((trend, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{trend.industry}</span>
                        <Badge variant="outline" className={demandColors[trend.pmDemand]}>
                          {trend.pmDemand} demand
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Avg: {trend.avgSalary}</span>
                        <span className="flex items-center gap-1 text-accent">
                          <TrendingUp className="h-3.5 w-3.5" />
                          +{trend.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${trend.growth * 2}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trend.topSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Texas Market Card */}
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-orange-400">
                <Star className="h-4 w-4" />
                Texas PM Market Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">$185K</div>
                  <p className="text-xs text-muted-foreground">Avg DFW PM Salary</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">$205K</div>
                  <p className="text-xs text-muted-foreground">Avg Austin PM Salary</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">+35%</div>
                  <p className="text-xs text-muted-foreground">TX Tech Job Growth YoY</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">0%</div>
                  <p className="text-xs text-muted-foreground">State Income Tax</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">Dallas: 2,500+ PM roles</Badge>
                <Badge variant="secondary">Austin: 3,200+ PM roles</Badge>
                <Badge variant="secondary">Houston: 1,800+ PM roles</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">45%</div>
                <p className="text-sm text-muted-foreground">AI Industry Growth</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-accent">$195K</div>
                <p className="text-sm text-muted-foreground">Avg PM Salary 2026</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-warning">150%</div>
                <p className="text-sm text-muted-foreground">AI PM Demand YoY</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
