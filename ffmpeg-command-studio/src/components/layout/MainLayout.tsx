// components/layout/MainLayout.tsx
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import MainContent from './MainContent';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-darkest">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        <MainContent />
        <SidebarRight />
      </div>
      <Footer />
    </div>
  );
}
