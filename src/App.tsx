import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, type PageId } from './components/layout/Sidebar';
import { Philosophy5SModal } from './components/modals/Philosophy5SModal';
import { EthicsModal } from './components/modals/EthicsModal';

// Modules
import { HomeModule } from './components/modules/HomeModule';
import { TutorModule } from './components/modules/TutorModule';
import { WorkAnalysisModule } from './components/modules/WorkAnalysisModule';
import { CreativeWorkshopModule } from './components/modules/CreativeWorkshopModule';
import { MindmapModule } from './components/modules/MindmapModule';
import { CritiqueCouncilModule } from './components/modules/CritiqueCouncilModule';
import { RoleplayModule } from './components/modules/RoleplayModule';
import { GamesModule } from './components/modules/GamesModule';
import { LibraryModule } from './components/modules/LibraryModule';
import { ClassroomModule } from './components/modules/ClassroomModule';
import { ProgressModule } from './components/modules/ProgressModule';
import { CompetitionDossierModule } from './components/modules/CompetitionDossierModule';

import { StorageService } from './services/storageService';
import type { GradeLevel, LiteraryWork, StudentSubmission, UserRole } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => StorageService.getRole());
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(8);
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [is5SModalOpen, setIs5SModalOpen] = useState(false);
  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState(false);

  // Transition data between modules
  const [critiqueInitialText, setCritiqueInitialText] = useState<string>('');
  const [critiqueInitialTitle, setCritiqueInitialTitle] = useState<string>('');

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    StorageService.setRole(role);
    // If student was on a teacher-only page, redirect to home
    if (role === 'student' && (currentPage === 'classroom' || currentPage === 'competition')) {
      setCurrentPage('home');
    }
  };

  const handleGradeChange = (grade: GradeLevel) => {
    setSelectedGrade(grade);
  };

  const handleGoToCritique = (text: string, title: string) => {
    setCritiqueInitialText(text);
    setCritiqueInitialTitle(title);
    setCurrentPage('critique');
  };

  const handleSelectWorkForTask = (work: LiteraryWork) => {
    setCurrentPage('classroom');
  };

  const handleViewSubmission = (sub: StudentSubmission) => {
    setCritiqueInitialText(sub.versions[sub.versions.length - 1]?.text || '');
    setCritiqueInitialTitle(sub.taskTitle);
    setCurrentPage('critique');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedGrade={selectedGrade}
        onGradeChange={handleGradeChange}
        onOpen5SModal={() => setIs5SModalOpen(true)}
        onOpenEthicsModal={() => setIsEthicsModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
          currentRole={currentRole}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Center Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentPage === 'home' && (
            <HomeModule
              onNavigate={(page) => setCurrentPage(page)}
              selectedGrade={selectedGrade}
              currentRole={currentRole}
              onOpen5SModal={() => setIs5SModalOpen(true)}
            />
          )}

          {currentPage === 'tutor' && (
            <TutorModule
              selectedGrade={selectedGrade}
              onGradeChange={handleGradeChange}
            />
          )}

          {currentPage === 'explore' && (
            <WorkAnalysisModule selectedGrade={selectedGrade} />
          )}

          {currentPage === 'write' && (
            <CreativeWorkshopModule
              selectedGrade={selectedGrade}
              onGoToCritique={handleGoToCritique}
            />
          )}

          {currentPage === 'mindmap' && (
            <MindmapModule selectedGrade={selectedGrade} />
          )}

          {currentPage === 'critique' && (
            <CritiqueCouncilModule
              selectedGrade={selectedGrade}
              currentRole={currentRole}
              initialText={critiqueInitialText}
              initialTitle={critiqueInitialTitle}
            />
          )}

          {currentPage === 'roleplay' && (
            <RoleplayModule selectedGrade={selectedGrade} />
          )}

          {currentPage === 'games' && (
            <GamesModule selectedGrade={selectedGrade} />
          )}

          {currentPage === 'library' && (
            <LibraryModule
              selectedGrade={selectedGrade}
              currentRole={currentRole}
              onSelectWorkForTask={handleSelectWorkForTask}
            />
          )}

          {currentPage === 'classroom' && (
            <ClassroomModule
              selectedGrade={selectedGrade}
              onViewSubmission={handleViewSubmission}
            />
          )}

          {currentPage === 'progress' && (
            <ProgressModule
              selectedGrade={selectedGrade}
              currentRole={currentRole}
            />
          )}

          {currentPage === 'competition' && (
            <CompetitionDossierModule currentRole={currentRole} />
          )}
        </main>
      </div>

      {/* Philosophy 5S Modal */}
      <Philosophy5SModal
        isOpen={is5SModalOpen}
        onClose={() => setIs5SModalOpen(false)}
        onGoToModule={(moduleId) => setCurrentPage(moduleId as PageId)}
      />

      {/* Ethics & Safety Modal */}
      <EthicsModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
      />
    </div>
  );
}
