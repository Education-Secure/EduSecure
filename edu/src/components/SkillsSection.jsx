import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Award, TrendingUp, Target } from 'lucide-react';
import skillsHero from '../assets/skills-hero.jpg';

const skillsData = [
  { name: 'JavaScript', level: 85, category: 'Programming', certified: true },
  { name: 'Python', level: 90, category: 'Programming', certified: true },
  { name: 'React', level: 80, category: 'Frontend', certified: false },
  { name: 'SQL', level: 75, category: 'Database', certified: true },
  { name: 'Project Management', level: 70, category: 'Business', certified: false },
  { name: 'Data Analysis', level: 65, category: 'Analytics', certified: false },
];

const categories = ['All', 'Programming', 'Frontend', 'Database', 'Business', 'Analytics'];

function SkillsSection() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-lg overflow-hidden">
        <img 
          src={skillsHero} 
          alt="Skills development illustration" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-skill-primary/90 to-skill-secondary/90 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Your Skills Portfolio</h2>
            <p className="text-lg opacity-90">Track your progress and showcase your expertise</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Professional certifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Skills</CardTitle>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={category === 'All' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-skill-primary hover:text-white"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsData.map((skill) => (
              <div key={skill.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{skill.name}</span>
                    {skill.certified && (
                      <Badge variant="outline" className="text-xs bg-skill-success text-white border-skill-success">
                        Certified
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    {skill.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {skill.level >= 80 ? 'Expert' : skill.level >= 60 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SkillsSection;