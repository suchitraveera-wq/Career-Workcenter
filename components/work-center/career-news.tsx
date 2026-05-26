'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  summary: string
  url: string
  category: 'hiring' | 'industry' | 'trends' | 'local'
  tags: string[]
}

interface CompanyHiring {
  id: string
  company: string
  logo?: string
  role: string
  location: string
  type: 'full-time' | 'contract' | 'hybrid'
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
    title: 'Bay Area Startups Compete for Senior PM Talent',
    source: 'SF Chronicle',
    date: '2026-05-24',
    summary: 'San Francisco startups are offering increasingly competitive packages to attract experienced product managers amid talent shortage.',
    url: 'https://sfchronicle.com',
    category: 'local',
    tags: ['Bay Area', 'Startups', 'Competition'],
  },
  {
    id: '5',
    title: 'Remote-First Companies Lead PM Hiring Trends',
    source: 'Forbes',
    date: '2026-05-23',
    summary: 'Companies with remote-first policies are attracting top product talent by offering flexibility and competitive compensation.',
    url: 'https://forbes.com',
    category: 'trends',
    tags: ['Remote Work', 'Flexibility', 'Work-Life Balance'],
  },
  {
    id: '6',
    title: 'Fintech Boom Creates PM Opportunities in NYC',
    source: 'Bloomberg',
    date: '2026-05-23',
    summary: 'New York financial technology companies expand product teams as digital banking adoption accelerates.',
    url: 'https://bloomberg.com',
    category: 'local',
    tags: ['Fintech', 'NYC', 'Banking'],
  },
  {
    id: '7',
    title: 'AI Product Management Emerges as Fastest Growing Specialty',
    source: 'Product Coalition',
    date: '2026-05-22',
    summary: 'Demand for PMs with AI/ML expertise grows 150% year-over-year as companies race to implement AI solutions.',
    url: 'https://productcoalition.com',
    category: 'industry',
    tags: ['AI/ML', 'Specialization', 'Career Growth'],
  },
  {
    id: '8',
    title: 'Enterprise Software Companies Post Record PM Openings',
    source: 'Business Insider',
    date: '2026-05-22',
    summary: 'B2B SaaS companies like Salesforce, ServiceNow, and Workday significantly expand product organizations.',
    url: 'https://businessinsider.com',
    category: 'hiring',
    tags: ['Enterprise', 'B2B SaaS', 'Expansion'],
  },
]

const mockCompaniesHiring: CompanyHiring[] = [
  {
    id: '1',
    company: 'OpenAI',
    role: 'Senior Product Manager - ChatGPT',
    location: 'San Francisco, CA',
    type: 'full-time',
    postedDate: '2026-05-25',
    salaryRange: '$200,000 - $300,000',
    url: 'https://openai.com/careers',
    hot: true,
  },
  {
    id: '2',
    company: 'Anthropic',
    role: 'Product Lead - Claude',
    location: 'San Francisco, CA (Hybrid)',
    type: 'full-time',
    postedDate: '2026-05-24',
    salaryRange: '$220,000 - $320,000',
    url: 'https://anthropic.com/careers',
    hot: true,
  },
  {
    id: '3',
    company: 'Stripe',
    role: 'Group Product Manager',
    location: 'Remote US',
    type: 'full-time',
    postedDate: '2026-05-24',
    salaryRange: '$230,000 - $280,000',
    url: 'https://stripe.com/jobs',
    hot: true,
  },
  {
    id: '4',
    company: 'Meta',
    role: 'Product Manager - Reality Labs',
    location: 'Menlo Park, CA',
    type: 'full-time',
    postedDate: '2026-05-23',
    salaryRange: '$180,000 - $250,000',
    url: 'https://metacareers.com',
  },
  {
    id: '5',
    company: 'Notion',
    role: 'Senior PM - AI Features',
    location: 'San Francisco, CA',
    type: 'full-time',
    postedDate: '2026-05-23',
    salaryRange: '$190,000 - $240,000',
    url: 'https://notion.so/careers',
  },
  {
    id: '6',
    company: 'Figma',
    role: 'Product Manager - Enterprise',
    location: 'San Francisco, CA (Hybrid)',
    type: 'full-time',
    postedDate: '2026-05-22',
    salaryRange: '$185,000 - $235,000',
    url: 'https://figma.com/careers',
  },
  {
    id: '7',
    company: 'McKinsey Digital',
    role: 'Product Strategy Consultant',
    location: 'New York, NY',
    type: 'contract',
    postedDate: '2026-05-22',
    salaryRange: '$175/hour',
    url: 'https://mckinsey.com/careers',
  },
  {
    id: '8',
    company: 'Datadog',
    role: 'Director of Product',
    location: 'New York, NY (Hybrid)',
    type: 'full-time',
    postedDate: '2026-05-21',
    salaryRange: '$250,000 - $320,000',
    url: 'https://datadog.com/careers',
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

export function CareerNews() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredNews = activeCategory === 'all' 
    ? mockNews 
    : mockNews.filter((n) => n.category === activeCategory)

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
            <span className="hidden sm:inline">Companies Hiring</span>
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
            {['all', 'hiring', 'industry', 'trends', 'local'].map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? 'bg-primary/10 text-primary' : ''}
              >
                {category === 'all' ? 'All News' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* News List */}
          <div className="grid gap-4">
            {filteredNews.map((news) => (
              <Card key={news.id} className="border-border/50 bg-card/50 transition-colors hover:bg-card/80">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={categoryColors[news.category]}>
                          {news.category}
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
          <div className="grid gap-4 md:grid-cols-2">
            {mockCompaniesHiring.map((company) => (
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
                      <Badge variant="outline" className={company.type === 'full-time' ? 'border-accent text-accent' : 'border-purple-500 text-purple-400'}>
                        {company.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.location}
                      </span>
                      {company.salaryRange && (
                        <span className="flex items-center gap-1">
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
