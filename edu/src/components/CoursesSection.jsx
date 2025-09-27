import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { PlayCircle, Clock, Calendar, BookOpen } from 'lucide-react';

const coursesInProgress = [
  {
    id: 1,
    title: 'Advanced Python for Data Science',
    provider: 'TechEdu',
    progress: 65,
    totalHours: 40,
    completedHours: 26,
    estimatedCompletion: '2 weeks',
    category: 'Programming',
    difficulty: 'Advanced'
  },
  {
    id: 2,
    title: 'Business Tax Planning & Compliance',
    provider: 'BusinessAcademy',
    progress: 30,
    totalHours: 24,
    completedHours: 7,
    estimatedCompletion: '1 month',
    category: 'Taxation',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'React Performance Optimization',
    provider: 'DevMasters',
    progress: 80,
    totalHours: 16,
    completedHours: 13,
    estimatedCompletion: '3 days',
    category: 'Frontend',
    difficulty: 'Advanced'
  }
];

const recommendedCourses = [
  {
    title: 'Machine Learning Fundamentals',
    provider: 'AI Institute',
    duration: '32 hours',
    rating: 4.8,
    students: 15420
  },
  {
    title: 'Advanced SQL Queries',
    provider: 'DataCamp',
    duration: '18 hours',
    rating: 4.9,
    students: 8350
  }
];

function CoursesSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courses in Progress</h2>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {coursesInProgress.length} Active Courses
        </Badge>
      </div>

      {/* Active Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {coursesInProgress.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.provider}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={course.difficulty === 'Advanced' ? 'border-skill-warning text-skill-warning' : 'border-skill-secondary text-skill-secondary'}
                >
                  {course.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.completedHours}/{course.totalHours}h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{course.estimatedCompletion}</span>
                </div>
              </div>

              {/* Category & Actions */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{course.category}</Badge>
                <Button variant="skill" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CoursesSection;