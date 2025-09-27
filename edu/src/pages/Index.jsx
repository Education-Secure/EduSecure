import { useState } from 'react';
import Navigation from '../components/Navigation';
import SkillsSection from '../components/SkillsSection';
import CoursesSection from '../components/CoursesSection';
import JobsSection from '../components/JobsSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('skills');

  const renderSection = () => {
    switch (activeSection) {
      case 'skills':
        return <SkillsSection />;
      case 'courses':
        return <CoursesSection />;
      case 'jobs':
        return <JobsSection />;
      default:
        return <SkillsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;
