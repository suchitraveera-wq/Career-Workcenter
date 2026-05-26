'use client'

import { useState } from 'react'
import { StatsOverview } from '@/components/work-center/stats-overview'
import { InspirationalQuote } from '@/components/work-center/inspirational-quote'
import { JobApplicationTracker } from '@/components/work-center/job-application-tracker'
import { ResourceBookmarks } from '@/components/work-center/resource-bookmarks'
import { InspirationalVideos } from '@/components/work-center/inspirational-videos'
import { CertificationArea } from '@/components/work-center/certification-area'
import { ApplicationVisualizations } from '@/components/work-center/application-visualizations'
import { CareerNews } from '@/components/work-center/career-news'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LayoutDashboard, 
  Briefcase, 
  BookMarked, 
  Video, 
  Award,
  Sparkles,
  Menu,
  X,
  BarChart3,
  Newspaper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Job Tracker', icon: Briefcase },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'news', label: 'Career News', icon: Newspaper },
  { id: 'resources', label: 'Resources', icon: BookMarked },
  { id: 'videos', label: 'Inspiration', icon: Video },
  { id: 'certifications', label: 'Certifications', icon: Award },
]

export default function WorkCenterPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PM Work Center</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Career Command Center</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'gap-2',
                  activeTab === item.id && 'bg-primary/10 text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      activeTab === item.id && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="sr-only">
            {navigationItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
              <p className="text-muted-foreground">
                Track your job search progress and stay motivated.
              </p>
            </div>

            <StatsOverview />
            
            <InspirationalQuote />

            {/* Quick Visualizations Preview */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Application Analytics
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('analytics')}>
                    View Full Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ApplicationVisualizations />
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <ResourceBookmarks />
              <CertificationArea />
            </div>

            <InspirationalVideos />
          </TabsContent>

          {/* Jobs View */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Job Application Tracker</h2>
              <p className="text-muted-foreground">
                Manage all your job applications in one place.
              </p>
            </div>

            <StatsOverview />
            <JobApplicationTracker />
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Application Analytics</h2>
              <p className="text-muted-foreground">
                Visualize your job search progress and identify patterns.
              </p>
            </div>

            <StatsOverview />
            <ApplicationVisualizations />
          </TabsContent>

          {/* Career News View */}
          <TabsContent value="news" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Career News & Insights</h2>
              <p className="text-muted-foreground">
                Stay informed about PM job market trends and opportunities.
              </p>
            </div>

            <CareerNews />
          </TabsContent>

          {/* Resources View */}
          <TabsContent value="resources" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Learning Resources</h2>
              <p className="text-muted-foreground">
                Curated training, newsletters, and blogs for Product Managers.
              </p>
            </div>

            <ResourceBookmarks />
          </TabsContent>

          {/* Videos View */}
          <TabsContent value="videos" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Inspiration Hub</h2>
              <p className="text-muted-foreground">
                Motivational videos and speeches to fuel your journey.
              </p>
            </div>

            <InspirationalQuote />
            <InspirationalVideos />
          </TabsContent>

          {/* Certifications View */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Certifications & Events</h2>
              <p className="text-muted-foreground">
                Track certifications, conferences, and professional development opportunities.
              </p>
            </div>

            <CertificationArea />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground lg:px-8">
          <p>PM Work Center &mdash; Your Career Command Center</p>
          <p className="mt-1">Stay focused, stay motivated, land your dream role.</p>
        </div>
      </footer>
    </div>
  )
}
