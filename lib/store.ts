import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type JobType = 'full-time' | 'contract'
export type ApplicationStatus = 'interested' | 'applied' | 'interview-scheduled' | 'interview-completed' | 'offer' | 'rejected'

export interface JobApplication {
  id: string
  companyName: string
  jobTitle: string
  jobDescription: string
  dateApplied: string | null
  dateAdded: string
  salaryRange: string
  benefits: string
  skillsMatched: string[]
  skillsMissing: string[]
  outreachMessages: string
  jobType: JobType
  status: ApplicationStatus
  interviewDate?: string
  notes?: string
  jobPostingUrl?: string
}

export interface Bookmark {
  id: string
  title: string
  url: string
  category: 'training' | 'newsletter' | 'blog' | 'agentic-ai' | 'other'
  dateAdded: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  dateEarned: string
  expiryDate?: string
  renewalRequirements?: string
  credentialId?: string
  credentialUrl?: string
}

export interface Event {
  id: string
  title: string
  type: 'conference' | 'paper-submission' | 'certification-renewal' | 'webinar'
  date: string
  description: string
  url?: string
  deadline?: string
}

export interface InspirationalVideo {
  id: string
  title: string
  speaker: string
  url: string
  category: 'commencement' | 'leadership' | 'womens-leadership' | 'professional-development' | 'personal-development'
  description?: string
}

interface WorkCenterStore {
  // Job Applications
  jobApplications: JobApplication[]
  addJobApplication: (job: Omit<JobApplication, 'id' | 'dateAdded'>) => void
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void
  deleteJobApplication: (id: string) => void
  
  // Bookmarks
  bookmarks: Bookmark[]
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'dateAdded'>) => void
  deleteBookmark: (id: string) => void
  
  // Certifications
  certifications: Certification[]
  addCertification: (cert: Omit<Certification, 'id'>) => void
  updateCertification: (id: string, updates: Partial<Certification>) => void
  deleteCertification: (id: string) => void
  
  // Events
  events: Event[]
  addEvent: (event: Omit<Event, 'id'>) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  
  // Inspirational Videos
  inspirationalVideos: InspirationalVideo[]
  addInspirationalVideo: (video: Omit<InspirationalVideo, 'id'>) => void
  deleteInspirationalVideo: (id: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useWorkCenterStore = create<WorkCenterStore>()(
  persist(
    (set) => ({
      // Initial data
      jobApplications: [
        {
          id: '1',
          companyName: 'TechCorp',
          jobTitle: 'Senior Product Manager',
          jobDescription: 'Lead product strategy for B2B SaaS platform',
          dateApplied: '2026-05-20',
          dateAdded: '2026-05-18',
          salaryRange: '$180,000 - $220,000',
          benefits: 'Health, 401k, Stock Options, Remote',
          skillsMatched: ['Product Strategy', 'Roadmap Planning', 'Stakeholder Management', 'Agile'],
          skillsMissing: ['ML/AI Experience'],
          outreachMessages: 'Connected with hiring manager on LinkedIn',
          jobType: 'full-time',
          status: 'interview-scheduled',
          interviewDate: '2026-05-28',
        },
        {
          id: '2',
          companyName: 'StartupXYZ',
          jobTitle: 'Head of Product',
          jobDescription: 'Build and lead product team for AI-powered analytics',
          dateApplied: '2026-05-15',
          dateAdded: '2026-05-10',
          salaryRange: '$200,000 - $250,000 + equity',
          benefits: 'Full benefits, Unlimited PTO',
          skillsMatched: ['Team Leadership', 'Product Vision', 'Data Analytics'],
          skillsMissing: ['Startup Experience'],
          outreachMessages: 'Referred by former colleague',
          jobType: 'full-time',
          status: 'interview-completed',
        },
        {
          id: '3',
          companyName: 'Consulting Partners',
          jobTitle: 'Product Strategy Consultant',
          jobDescription: '6-month engagement for digital transformation',
          dateApplied: null,
          dateAdded: '2026-05-22',
          salaryRange: '$150/hour',
          benefits: 'Flexible schedule',
          skillsMatched: ['Digital Transformation', 'Strategy'],
          skillsMissing: [],
          outreachMessages: '',
          jobType: 'contract',
          status: 'interested',
        },
        {
          id: '4',
          companyName: 'Enterprise Solutions',
          jobTitle: 'Principal Product Manager',
          jobDescription: 'Enterprise software product leadership',
          dateApplied: '2026-05-18',
          dateAdded: '2026-05-12',
          salaryRange: '$190,000 - $230,000',
          benefits: 'Comprehensive package',
          skillsMatched: ['Enterprise Products', 'B2B', 'Cross-functional Leadership'],
          skillsMissing: ['Specific domain knowledge'],
          outreachMessages: 'Applied through company website',
          jobType: 'full-time',
          status: 'applied',
        },
        {
          id: '5',
          companyName: 'AI Innovations',
          jobTitle: 'Contract PM - AI Products',
          jobDescription: '3-month contract for AI product launch',
          dateApplied: '2026-05-21',
          dateAdded: '2026-05-19',
          salaryRange: '$175/hour',
          benefits: 'Remote work',
          skillsMatched: ['Product Launch', 'AI Products'],
          skillsMissing: [],
          outreachMessages: 'Reached out to recruiter',
          jobType: 'contract',
          status: 'applied',
        },
      ],
      
      bookmarks: [
        { id: '1', title: 'Mind the Product', url: 'https://www.mindtheproduct.com', category: 'blog', dateAdded: '2026-05-01' },
        { id: '2', title: 'Lenny\'s Newsletter', url: 'https://www.lennysnewsletter.com', category: 'newsletter', dateAdded: '2026-05-02' },
        { id: '3', title: 'Product School', url: 'https://productschool.com', category: 'training', dateAdded: '2026-05-03' },
        { id: '4', title: 'Reforge', url: 'https://www.reforge.com', category: 'training', dateAdded: '2026-05-04' },
        { id: '5', title: 'Anthropic AI Blog', url: 'https://www.anthropic.com/research', category: 'agentic-ai', dateAdded: '2026-05-05' },
        { id: '6', title: 'OpenAI Blog', url: 'https://openai.com/blog', category: 'agentic-ai', dateAdded: '2026-05-06' },
      ],
      
      certifications: [
        {
          id: '1',
          name: 'Certified Scrum Product Owner (CSPO)',
          issuer: 'Scrum Alliance',
          dateEarned: '2024-03-15',
          expiryDate: '2026-03-15',
          renewalRequirements: '20 SEUs required for renewal',
        },
        {
          id: '2',
          name: 'Product Management Certification',
          issuer: 'Product School',
          dateEarned: '2023-09-01',
          credentialUrl: 'https://productschool.com/certificate',
        },
        {
          id: '3',
          name: 'AWS Cloud Practitioner',
          issuer: 'Amazon Web Services',
          dateEarned: '2024-06-01',
          expiryDate: '2027-06-01',
        },
      ],
      
      events: [
        {
          id: '1',
          title: 'ProductCon 2026',
          type: 'conference',
          date: '2026-09-15',
          description: 'Annual product management conference',
          url: 'https://productcon.com',
        },
        {
          id: '2',
          title: 'AI Product Summit',
          type: 'conference',
          date: '2026-07-20',
          description: 'Focus on AI/ML product development',
        },
        {
          id: '3',
          title: 'CSPO Renewal Deadline',
          type: 'certification-renewal',
          date: '2026-03-15',
          description: 'Complete 20 SEUs before this date',
          deadline: '2026-03-01',
        },
        {
          id: '4',
          title: 'PM Research Paper Submission',
          type: 'paper-submission',
          date: '2026-08-01',
          description: 'Call for papers on product innovation',
          deadline: '2026-07-15',
        },
      ],
      
      inspirationalVideos: [
        {
          id: '1',
          title: 'Stay Hungry, Stay Foolish',
          speaker: 'Steve Jobs',
          url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
          category: 'commencement',
          description: 'Stanford Commencement Speech 2005',
        },
        {
          id: '2',
          title: 'The Power of Vulnerability',
          speaker: 'Brene Brown',
          url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
          category: 'personal-development',
          description: 'TED Talk on embracing vulnerability',
        },
        {
          id: '3',
          title: 'Lean In',
          speaker: 'Sheryl Sandberg',
          url: 'https://www.youtube.com/watch?v=18uDutylDa4',
          category: 'womens-leadership',
          description: 'Women, work, and the will to lead',
        },
        {
          id: '4',
          title: 'How Great Leaders Inspire Action',
          speaker: 'Simon Sinek',
          url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
          category: 'leadership',
          description: 'Start With Why TED Talk',
        },
        {
          id: '5',
          title: 'Your Elusive Creative Genius',
          speaker: 'Elizabeth Gilbert',
          url: 'https://www.youtube.com/watch?v=86x-u-tz0MA',
          category: 'personal-development',
          description: 'On nurturing creativity',
        },
      ],
      
      // Actions
      addJobApplication: (job) =>
        set((state) => ({
          jobApplications: [
            ...state.jobApplications,
            { ...job, id: generateId(), dateAdded: new Date().toISOString().split('T')[0] },
          ],
        })),
      
      updateJobApplication: (id, updates) =>
        set((state) => ({
          jobApplications: state.jobApplications.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        })),
      
      deleteJobApplication: (id) =>
        set((state) => ({
          jobApplications: state.jobApplications.filter((job) => job.id !== id),
        })),
      
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            { ...bookmark, id: generateId(), dateAdded: new Date().toISOString().split('T')[0] },
          ],
        })),
      
      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      
      addCertification: (cert) =>
        set((state) => ({
          certifications: [...state.certifications, { ...cert, id: generateId() }],
        })),
      
      updateCertification: (id, updates) =>
        set((state) => ({
          certifications: state.certifications.map((cert) =>
            cert.id === id ? { ...cert, ...updates } : cert
          ),
        })),
      
      deleteCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),
      
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: generateId() }],
        })),
      
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      
      addInspirationalVideo: (video) =>
        set((state) => ({
          inspirationalVideos: [...state.inspirationalVideos, { ...video, id: generateId() }],
        })),
      
      deleteInspirationalVideo: (id) =>
        set((state) => ({
          inspirationalVideos: state.inspirationalVideos.filter((v) => v.id !== id),
        })),
    }),
    {
      name: 'work-center-storage',
    }
  )
)
