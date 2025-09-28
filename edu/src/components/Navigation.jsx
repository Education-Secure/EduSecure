import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { User, Plus, Award, BookOpen, Briefcase, LogOut, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../firebaseConfig';
import { generateRoadmap } from "../APIConfigs/AI";

const skillCategories = [
  { name: 'Programming', skills: ['Python', 'JavaScript', 'React', 'Node.js'] },
  { name: 'Data Science', skills: ['Data Analysis', 'Machine Learning', 'SQL', 'Statistics'] },
  { name: 'Business', skills: ['Taxation', 'Accounting', 'Project Management', 'Marketing'] },
  { name: 'Design', skills: ['UI/UX Design', 'Graphic Design', 'Figma', 'Adobe Creative Suite'] },
];

// Pre-defined roadmaps for faster loading (you can expand this)
const preDefinedRoadmaps = {
  'Python': {
    children: [
      {
        name: "Introduction to Python",
        children: [
          {
            name: "Python Basics",
            children: [
              { name: "Variables and Data Types", children: [] },
              { name: "Control Structures", children: [] },
              { name: "Functions", children: [] }
            ]
          },
          {
            name: "Object-Oriented Programming", 
            children: [
              { name: "Classes and Objects", children: [] },
              { name: "Inheritance", children: [] },
              { name: "Polymorphism", children: [] }
            ]
          }
        ]
      },
      {
        name: "Advanced Python",
        children: [
          {
            name: "Libraries and Frameworks",
            children: [
              { name: "NumPy", children: [] },
              { name: "Pandas", children: [] },
              { name: "Flask/Django", children: [] }
            ]
          }
        ]
      }
    ]
  },
  'JavaScript': {
    children: [
      {
        name: "JavaScript Fundamentals",
        children: [
          {
            name: "Basic Syntax",
            children: [
              { name: "Variables and Scope", children: [] },
              { name: "Functions", children: [] },
              { name: "Objects and Arrays", children: [] }
            ]
          }
        ]
      },
      {
        name: "Modern JavaScript",
        children: [
          {
            name: "ES6+ Features",
            children: [
              { name: "Arrow Functions", children: [] },
              { name: "Promises and Async/Await", children: [] },
              { name: "Modules", children: [] }
            ]
          }
        ]
      }
    ]
  },
  'React': {
    children: [
      {
        name: "React Basics",
        children: [
          {
            name: "Getting Started",
            children: [
              { name: "JSX", children: [] },
              { name: "Components", children: [] },
              { name: "Props and State", children: [] }
            ]
          }
        ]
      },
      {
        name: "Advanced React",
        children: [
          {
            name: "Hooks and Context",
            children: [
              { name: "useState and useEffect", children: [] },
              { name: "Custom Hooks", children: [] },
              { name: "Context API", children: [] }
            ]
          }
        ]
      }
    ]
  }
};

function Navigation({ activeSection, onSectionChange }) {
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skillLoading, setSkillLoading] = useState(null); // Track which skill is being processed
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSkillSelect = async (skill) => {
    if (!user?.email) return;
    
    setSkillLoading(skill); // Show loading for this specific skill
    
    const userRef = doc(db, "userInformation", user.email);

    try {
      // 1️⃣ Check if user already has this skill
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      
      // Check if skill already exists
      const existingSkill = userData?.skills?.find(s => s.name === skill);
      if (existingSkill) {
        setIsSkillModalOpen(false);
        setSkillLoading(null);
        navigate(`/roadmap/${encodeURIComponent(skill)}`);
        return;
      }

      // 2️⃣ Use pre-defined roadmap if available, otherwise generate
      let roadmapData;
      if (preDefinedRoadmaps[skill]) {
        roadmapData = preDefinedRoadmaps[skill];
      } else {
        // Show a more specific loading message
        roadmapData = await generateRoadmap(skill);
      }

      // 3️⃣ Prepare the skill object to save
      const skillData = {
        name: skill,
        roadmap: roadmapData,
        dateAdded: new Date().toISOString(),
        progress: 0
      };

      // 4️⃣ Save to database
      if (userData) {
        await updateDoc(userRef, {
          skills: arrayUnion(skillData),
        });
      } else {
        await setDoc(userRef, {
          skills: [skillData],
          email: user.email,
          displayName: user.displayName || '',
          createdAt: new Date().toISOString()
        });
      }

      // 5️⃣ Navigate to roadmap page
      setIsSkillModalOpen(false);
      navigate(`/roadmap/${encodeURIComponent(skill)}`);
      
    } catch (error) {
      console.error("Error saving skill to Firestore:", error);
      // You might want to show a toast notification here
    } finally {
      setSkillLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(name => name[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return user?.displayName || user?.email || 'User';
  };

  if (loading) {
    return (
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-sm">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Award className="h-8 w-8 text-skill-primary mr-3" />
            <h1 className="text-xl font-bold text-foreground">SkillTracker</h1>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onSectionChange('skills')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'skills'
                  ? 'text-skill-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>My Skills</span>
            </button>

            <button
              onClick={() => onSectionChange('courses')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'courses'
                  ? 'text-skill-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>In Progress</span>
              <Badge variant="secondary" className="ml-1">3</Badge>
            </button>

            <button
              onClick={() => onSectionChange('jobs')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'jobs'
                  ? 'text-skill-primary bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Job Opportunities</span>
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Learn New Skill Button */}
            <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
              <DialogTrigger asChild>
                <Button variant="skill" size="sm" className="hidden sm:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  Learn New Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Choose a Skill Category</DialogTitle>
                </DialogHeader>
                {skillLoading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Setting up {skillLoading}...</p>
                        <p className="text-sm text-blue-600">
                          {preDefinedRoadmaps[skillLoading] ? 
                            "Loading pre-built roadmap..." : 
                            "Generating personalized roadmap with AI..."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {skillCategories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <div className="space-y-2">
                        {category.skills.map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            className="w-full justify-start text-sm hover:bg-skill-primary hover:text-white relative"
                            onClick={() => handleSkillSelect(skill)}
                            disabled={skillLoading === skill}
                          >
                            {skillLoading === skill && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            {skill}
                            {preDefinedRoadmaps[skill] && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                Fast
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Profile Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="profile" size="icon">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-skill-primary text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-skill-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{getUserName()}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || 'Software Developer'}
                      </p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-3" />
                    View Profile
                  </Button>
                  
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Skills Completed</span>
                        <Badge variant="outline">12</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Courses in Progress</span>
                        <Badge variant="outline">3</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Job Matches</span>
                        <Badge variant="outline">8</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t pt-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;