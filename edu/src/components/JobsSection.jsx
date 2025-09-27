import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, DollarSign, Clock, ExternalLink, Star } from 'lucide-react';

const jobOpportunities = [
  {
    id: 1,
    title: 'Senior Python Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    matchPercentage: 95,
    requiredSkills: ['Python', 'JavaScript', 'SQL'],
    postedDate: '2 days ago',
    remote: true
  },
  {
    id: 2,
    title: 'Full Stack React Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100,000 - $140,000',
    matchPercentage: 88,
    requiredSkills: ['React', 'JavaScript', 'Python'],
    postedDate: '1 week ago',
    remote: false
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'DataDriven Solutions',
    location: 'Austin, TX',
    type: 'Contract',
    salary: '$80,000 - $110,000',
    matchPercentage: 82,
    requiredSkills: ['SQL', 'Data Analysis', 'Python'],
    postedDate: '3 days ago',
    remote: true
  },
  {
    id: 4,
    title: 'Tax Consultant',
    company: 'Financial Advisors LLC',
    location: 'Chicago, IL',
    type: 'Part-time',
    salary: '$60,000 - $80,000',
    matchPercentage: 75,
    requiredSkills: ['Taxation', 'Project Management'],
    postedDate: '5 days ago',
    remote: false
  },
  {
    id: 5,
    title: 'Junior Full Stack Developer',
    company: 'WebTech Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$70,000 - $90,000',
    matchPercentage: 70,
    requiredSkills: ['JavaScript', 'React'],
    postedDate: '1 day ago',
    remote: true
  }
];

function JobsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
          <p className="text-muted-foreground">Positions matching your skills</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {jobOpportunities.length} Matches
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="cursor-pointer">All Jobs</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-skill-primary hover:text-white">Remote</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-skill-primary hover:text-white">Full-time</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-skill-primary hover:text-white">Contract</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-skill-primary hover:text-white">High Match</Badge>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobOpportunities.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-skill-warning text-skill-warning" />
                        <span className="text-sm font-medium">{job.matchPercentage}% match</span>
                      </div>
                      <Button variant="skill" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                      {job.remote && <Badge variant="outline" className="text-xs">Remote</Badge>}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{job.type} • {job.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-muted-foreground">Required skills:</span>
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Opportunities
        </Button>
      </div>
    </div>
  );
}

export default JobsSection;