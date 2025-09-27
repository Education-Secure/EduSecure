import { useState, useEffect, useRef } from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  PlayCircle, 
  Clock, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Video, 
  Link, 
  X,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

// Quiz data for each course
const courseQuizzes = {
  1: {
    title: 'Advanced Python for Data Science Final Assessment',
    questions: [
      {
        question: "What is the main advantage of NumPy arrays over Python lists?",
        options: ["Better syntax", "Memory efficiency and speed", "More functions", "Easier to use"],
        correct: 1
      },
      {
        question: "Which pandas method is used to handle missing data?",
        options: ["dropna()", "fillna()", "Both A and B", "None of the above"],
        correct: 2
      },
      {
        question: "What does matplotlib.pyplot provide?",
        options: ["Data analysis tools", "Web scraping capabilities", "Plotting and visualization functions", "Database connectivity"],
        correct: 2
      },
      {
        question: "In machine learning, what is overfitting?",
        options: ["Model performs well on training data but poorly on new data", "Model performs poorly on all data", "Model is too simple", "Model has too few parameters"],
        correct: 0
      },
      {
        question: "Which statistical measure indicates the spread of data?",
        options: ["Mean", "Median", "Standard deviation", "Mode"],
        correct: 2
      }
    ]
  },
  2: {
    title: 'Business Tax Planning & Compliance Final Assessment',
    questions: [
      {
        question: "What is the difference between above-the-line and below-the-line deductions?",
        options: ["No difference", "Above-the-line reduces AGI, below-the-line reduces taxable income", "Below-the-line is better", "Above-the-line is only for businesses"],
        correct: 1
      },
      {
        question: "When is the deadline for filing business tax returns?",
        options: ["April 15th", "March 15th", "May 15th", "December 31st"],
        correct: 1
      },
      {
        question: "What expenses can be deducted as business expenses?",
        options: ["Personal meals", "Ordinary and necessary business expenses", "All expenses", "Only office rent"],
        correct: 1
      }
    ]
  },
  3: {
    title: 'React Performance Optimization Final Assessment',
    questions: [
      {
        question: "What does React.memo do?",
        options: ["Stores data in memory", "Prevents unnecessary re-renders of components", "Manages state", "Handles events"],
        correct: 1
      },
      {
        question: "When should you use useMemo?",
        options: ["Always", "For expensive calculations", "Never", "Only with useState"],
        correct: 1
      },
      {
        question: "What is code splitting in React?",
        options: ["Dividing code into multiple files", "Breaking components into smaller parts", "Lazy loading parts of your application", "Writing cleaner code"],
        correct: 2
      },
      {
        question: "What is the purpose of React.lazy?",
        options: ["To make components slower", "To enable dynamic imports and code splitting", "To lazy load data", "To delay rendering"],
        correct: 1
      }
    ]
  }
};

const courseProjects = {
  1: {
    title: 'Build a Data Analysis Dashboard',
    description: 'Create a comprehensive data analysis dashboard using Python, pandas, and matplotlib. Analyze a real dataset and present insights through visualizations.',
    requirements: [
      'Load and clean a dataset using pandas',
      'Perform statistical analysis on the data',
      'Create at least 5 different visualizations',
      'Include machine learning predictions',
      'Write a summary report of findings'
    ],
    estimatedTime: '4-6 hours'
  },
  2: {
    title: 'Small Business Tax Strategy Plan',
    description: 'Develop a comprehensive tax strategy for a fictional small business, including deduction planning and compliance timeline.',
    requirements: [
      'Create a business profile with revenue and expenses',
      'Identify all applicable tax deductions',
      'Develop a quarterly tax payment schedule',
      'Create a tax compliance checklist',
      'Prepare mock tax forms'
    ],
    estimatedTime: '3-4 hours'
  },
  3: {
    title: 'High-Performance React Application',
    description: 'Build a React application implementing all performance optimization techniques learned in the course.',
    requirements: [
      'Implement code splitting and lazy loading',
      'Use React.memo and useMemo appropriately',
      'Optimize bundle size',
      'Implement performance monitoring',
      'Document optimization strategies used'
    ],
    estimatedTime: '5-7 hours'
  }
};

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
    difficulty: 'Advanced',
    schedule: [
      {
        day: 1,
        title: 'Python Fundamentals Review',
        completed: true,
        resources: [
          { type: 'video', title: 'Python Basics Refresher', duration: '45 min' },
          { type: 'document', title: 'Python Cheat Sheet', pages: 5 },
          { type: 'exercise', title: 'Basic Syntax Practice', exercises: 10 }
        ]
      },
      {
        day: 2,
        title: 'NumPy and Pandas Introduction',
        completed: true,
        resources: [
          { type: 'video', title: 'NumPy Arrays Deep Dive', duration: '1.5 hours' },
          { type: 'document', title: 'Pandas Documentation', pages: 12 },
          { type: 'exercise', title: 'Data Manipulation Exercises', exercises: 15 }
        ]
      },
      {
        day: 3,
        title: 'Data Visualization with Matplotlib',
        completed: true,
        resources: [
          { type: 'video', title: 'Creating Charts and Graphs', duration: '1 hour' },
          { type: 'document', title: 'Matplotlib Gallery', pages: 8 },
          { type: 'exercise', title: 'Visualization Challenges', exercises: 12 }
        ]
      },
      {
        day: 4,
        title: 'Statistical Analysis Fundamentals',
        completed: false,
        resources: [
          { type: 'video', title: 'Statistics for Data Science', duration: '2 hours' },
          { type: 'document', title: 'Statistical Methods Guide', pages: 15 },
          { type: 'exercise', title: 'Statistical Analysis Practice', exercises: 20 }
        ]
      },
      {
        day: 5,
        title: 'Machine Learning Basics',
        completed: false,
        resources: [
          { type: 'video', title: 'ML Algorithms Overview', duration: '1.5 hours' },
          { type: 'document', title: 'Scikit-learn Tutorial', pages: 10 },
          { type: 'exercise', title: 'First ML Model', exercises: 8 }
        ]
      }
    ]
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
    difficulty: 'Intermediate',
    schedule: [
      {
        day: 1,
        title: 'Tax Law Fundamentals',
        completed: true,
        resources: [
          { type: 'video', title: 'Introduction to Tax Law', duration: '1 hour' },
          { type: 'document', title: 'Tax Code Basics', pages: 20 },
          { type: 'exercise', title: 'Tax Scenarios Practice', exercises: 5 }
        ]
      },
      {
        day: 2,
        title: 'Business Deductions',
        completed: false,
        resources: [
          { type: 'video', title: 'Maximizing Business Deductions', duration: '1.5 hours' },
          { type: 'document', title: 'Deduction Guidelines', pages: 18 },
          { type: 'exercise', title: 'Deduction Calculations', exercises: 12 }
        ]
      }
    ]
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
    difficulty: 'Advanced',
    schedule: [
      {
        day: 1,
        title: 'React Profiler and DevTools',
        completed: true,
        resources: [
          { type: 'video', title: 'Using React DevTools', duration: '30 min' },
          { type: 'document', title: 'Profiling Guide', pages: 6 },
          { type: 'exercise', title: 'Profile a React App', exercises: 3 }
        ]
      },
      {
        day: 2,
        title: 'Memoization and Optimization',
        completed: true,
        resources: [
          { type: 'video', title: 'React.memo and useMemo', duration: '45 min' },
          { type: 'document', title: 'Optimization Patterns', pages: 8 },
          { type: 'exercise', title: 'Optimize Components', exercises: 6 }
        ]
      },
      {
        day: 3,
        title: 'Bundle Splitting and Lazy Loading',
        completed: false,
        resources: [
          { type: 'video', title: 'Code Splitting Strategies', duration: '1 hour' },
          { type: 'document', title: 'Webpack Configuration', pages: 12 },
          { type: 'exercise', title: 'Implement Lazy Loading', exercises: 4 }
        ]
      }
    ]
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

// Mock AI responses
const getAIResponse = (question) => {
  const responses = {
    default: "I'm here to help you learn! Ask me anything about your current course material, programming concepts, or if you need clarification on any topic.",
    python: "Great question about Python! NumPy arrays are much faster than Python lists because they store data in contiguous memory blocks and use optimized C code underneath. Would you like me to show you some examples?",
    tax: "Tax deductions can be complex! The key is understanding the difference between above-the-line and below-the-line deductions. Above-the-line deductions reduce your adjusted gross income, while itemized deductions reduce your taxable income. Which type would you like to explore?",
    react: "React performance optimization is crucial for user experience! The main strategies include: 1) Using React.memo for component memoization, 2) Implementing useMemo and useCallback for expensive calculations, 3) Code splitting with React.lazy. Which would you like to dive deeper into?"
  };
  
  if (question.toLowerCase().includes('python') || question.toLowerCase().includes('numpy')) {
    return responses.python;
  } else if (question.toLowerCase().includes('tax') || question.toLowerCase().includes('deduction')) {
    return responses.tax;
  } else if (question.toLowerCase().includes('react') || question.toLowerCase().includes('performance')) {
    return responses.react;
  } else {
    return responses.default;
  }
};

const ResourceIcon = ({ type }) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-red-500" />;
    case 'document':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'exercise':
      return <GraduationCap className="h-4 w-4 text-green-500" />;
    default:
      return <BookOpen className="h-4 w-4 text-gray-500" />;
  }
};

function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState(coursesInProgress);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: "Hello! I'm your AI learning assistant. I'm here to help you with any questions about your course material. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showProject, setShowProject] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleDayComplete = (courseId, dayIndex) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedSchedule = [...course.schedule];
          updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], completed: true };
          
          const completedDays = updatedSchedule.filter(day => day.completed).length;
          const totalDays = updatedSchedule.length;
          const newProgress = Math.round((completedDays / totalDays) * 100);
          
          return {
            ...course,
            schedule: updatedSchedule,
            progress: newProgress,
            completedHours: Math.round((completedDays / totalDays) * course.totalHours)
          };
        }
        return course;
      })
    );

    // Update selectedCourse if it's the current one
    if (selectedCourse && selectedCourse.id === courseId) {
      const updatedCourse = courses.find(c => c.id === courseId);
      if (updatedCourse) {
        const updatedSchedule = [...updatedCourse.schedule];
        updatedSchedule[dayIndex] = { ...updatedSchedule[dayIndex], completed: true };
        
        const completedDays = updatedSchedule.filter(day => day.completed).length;
        const totalDays = updatedSchedule.length;
        const newProgress = Math.round((completedDays / totalDays) * 100);
        
        setSelectedCourse({
          ...updatedCourse,
          schedule: updatedSchedule,
          progress: newProgress,
          completedHours: Math.round((completedDays / totalDays) * updatedCourse.totalHours)
        });
      }
    }
  };

  const handleCompleteQuiz = () => {
    if (selectedCourse && courseQuizzes[selectedCourse.id]) {
      setShowCompletion(true);
      setCurrentQuizIndex(0);
      setQuizAnswers([]);
      setQuizCompleted(false);
      setQuizScore(0);
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const nextQuestion = () => {
    const quiz = courseQuizzes[selectedCourse.id];
    if (currentQuizIndex < quiz.questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (quizAnswers[index] === question.correct) {
          score++;
        }
      });
      const percentage = Math.round((score / quiz.questions.length) * 100);
      setQuizScore(percentage);
      setQuizCompleted(true);
    }
  };

  const resetCompletion = () => {
    setShowCompletion(false);
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setQuizScore(0);
    setShowProject(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        message: getAIResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Courses in Progress</h2>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {courses.length} Active Courses
        </Badge>
      </div>

      {/* Active Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.provider}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={course.difficulty === 'Advanced' ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500'}
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
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Interface Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="w-[98vw] h-[98vh] max-w-[98vw] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCourse?.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse?.provider}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCourse(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="schedule" className="flex-1 flex flex-col overflow-hidden px-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Learning Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="tutor" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>AI Tutor</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="space-y-6 pr-4">
                    {/* Progress Overview */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-medium">Overall Progress</span>
                          <span className="text-lg font-bold text-blue-600">{selectedCourse?.progress}%</span>
                        </div>
                        <Progress value={selectedCourse?.progress} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>{selectedCourse?.completedHours}h completed</span>
                          <span>{selectedCourse?.totalHours}h total</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Learning Schedule */}
                    {selectedCourse?.schedule.map((day, index) => (
                      <Card key={day.day} className={`border-l-4 ${day.completed ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {day.completed ? 
                                <CheckCircle2 className="h-7 w-7 text-green-500 flex-shrink-0" /> : 
                                <Circle className="h-7 w-7 text-muted-foreground flex-shrink-0" />
                              }
                              <div>
                                <CardTitle className="text-xl mb-2">Day {day.day}: {day.title}</CardTitle>
                                <Badge variant={day.completed ? "default" : "secondary"} className={day.completed ? "bg-green-500" : ""}>
                                  {day.completed ? 'Completed' : 'In Progress'}
                                </Badge>
                              </div>
                            </div>
                            {!day.completed && (
                              <Button
                                onClick={() => handleDayComplete(selectedCourse.id, index)}
                                variant="outline"
                                size="default"
                                className="flex-shrink-0"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Learning Resources</h4>
                            <div className="grid gap-3">
                              {day.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                  <ResourceIcon type={resource.type} />
                                  <div className="flex-1">
                                    <p className="font-medium text-base">{resource.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {resource.duration || `${resource.pages} pages` || `${resource.exercises} exercises`}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="default">
                                    <Link className="h-5 w-5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Complete Course Button */}
                    {selectedCourse?.progress === 100 && (
                      <Card className="border-2 border-green-500 bg-green-50/50">
                        <CardContent className="p-6 text-center">
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-green-700">Course Complete!</h3>
                              <p className="text-green-600 mt-2">
                                Congratulations! You've finished all course materials. Take the final assessment to earn your certificate.
                              </p>
                            </div>
                            <Button 
                              onClick={handleCompleteQuiz}
                              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                              size="lg"
                            >
                              Take Final Assessment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="tutor" className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4 border rounded-lg mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'ai' 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-muted'
                        }`}>
                          {message.sender === 'ai' ? (
                            <Bot className="h-4 w-4 text-white" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div className={`flex-1 max-w-xs lg:max-w-md ${
                          message.sender === 'user' ? 'text-right' : ''
                        }`}>
                          <div className={`p-3 rounded-lg ${
                            message.sender === 'ai' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask your AI tutor anything about the course..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={sendMessage} size="default" className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quiz and Project Completion Modal */}
          {showCompletion && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Final Assessment</h2>
                  <Button variant="ghost" size="sm" onClick={resetCompletion}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                {!quizCompleted ? (
                  <div className="max-w-3xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {courseQuizzes[selectedCourse.id]?.title}
                        </CardTitle>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Question {currentQuizIndex + 1} of {courseQuizzes[selectedCourse.id]?.questions.length}</span>
                          <div className="flex space-x-2">
                            {Array.from({ length: courseQuizzes[selectedCourse.id]?.questions.length || 0 }).map((_, index) => (
                              <div 
                                key={index} 
                                className={`w-3 h-3 rounded-full ${
                                  index <= currentQuizIndex ? 'bg-blue-500' : 'bg-gray-200'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">
                            {courseQuizzes[selectedCourse.id]?.questions[currentQuizIndex]?.question}
                          </h3>
                          <div className="space-y-3">
                            {courseQuizzes[selectedCourse.id]?.questions[currentQuizIndex]?.options.map((option, index) => (
                              <label 
                                key={index} 
                                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                                  quizAnswers[currentQuizIndex] === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="quiz-answer"
                                  value={index}
                                  checked={quizAnswers[currentQuizIndex] === index}
                                  onChange={() => handleQuizAnswer(index)}
                                  className="text-blue-500"
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            disabled={currentQuizIndex === 0}
                            onClick={() => setCurrentQuizIndex(currentQuizIndex - 1)}
                          >
                            Previous
                          </Button>
                          <Button 
                            onClick={nextQuestion}
                            disabled={quizAnswers[currentQuizIndex] === undefined}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {currentQuizIndex === courseQuizzes[selectedCourse.id]?.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Quiz Results */}
                    <Card className={`border-2 ${quizScore >= 80 ? 'border-green-500 bg-green-50/50' : 'border-orange-500 bg-orange-50/50'}`}>
                      <CardContent className="p-6 text-center">
                        <div className="space-y-4">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                            quizScore >= 80 ? 'bg-green-500' : 'bg-orange-500'
                          }`}>
                            {quizScore >= 80 ? (
                              <CheckCircle2 className="h-10 w-10 text-white" />
                            ) : (
                              <X className="h-10 w-10 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                            <p className="text-lg mt-2">Your Score: {quizScore}%</p>
                            <p className={`text-sm mt-1 ${quizScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                              {quizScore >= 80 ? 'Congratulations! You passed the assessment.' : 'You need 80% to pass. Please review the material and try again.'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Section */}
                    {quizScore >= 80 && courseProjects[selectedCourse.id] && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Optional Capstone Project</CardTitle>
                          <p className="text-muted-foreground">
                            Complete this project to demonstrate your practical skills (Optional but recommended)
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{courseProjects[selectedCourse.id].title}</h4>
                            <p className="text-gray-600 mb-4">{courseProjects[selectedCourse.id].description}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-2">Project Requirements:</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {courseProjects[selectedCourse.id].requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              Estimated Time: {courseProjects[selectedCourse.id].estimatedTime}
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" onClick={() => setShowProject(true)}>
                                Start Project
                              </Button>
                              <Button onClick={resetCompletion} className="bg-green-600 hover:bg-green-700">
                                Complete Course
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-center space-x-4">
                      {quizScore < 80 && (
                        <Button onClick={() => {
                          setQuizCompleted(false);
                          setCurrentQuizIndex(0);
                          setQuizAnswers([]);
                          setQuizScore(0);
                        }} className="bg-blue-600 hover:bg-blue-700">
                          Retake Quiz
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetCompletion}>
                        {quizScore >= 80 ? 'Close Assessment' : 'Exit'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Workspace */}
          {showProject && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Project Workspace</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowProject(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>{courseProjects[selectedCourse.id]?.title}</CardTitle>
                      <p className="text-muted-foreground">{courseProjects[selectedCourse.id]?.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Requirements Checklist:</h4>
                        <div className="space-y-2">
                          {courseProjects[selectedCourse.id]?.requirements.map((req, index) => (
                            <label key={index} className="flex items-center space-x-3">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{req}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Project Submission:</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Project Title</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="Enter your project title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Project Description</label>
                            <textarea 
                              rows={4} 
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="Describe your project and what you learned"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Project Files/Links</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="Add links to your project files (GitHub, Google Drive, etc.)"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowProject(false)}>
                          Save Draft
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                          setShowProject(false);
                          resetCompletion();
                        }}>
                          Submit Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CoursesSection;