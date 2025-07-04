import ProfileSection from '@/components/features/about/ProfileSection';

export default function About() {
  return (
    <div className="container">
      <div className="space-y-8">
        {/* 섹션 제목 */}
        <h2 className="text-3xl font-bold tracking-tight">소개</h2>
        <ProfileSection />
      </div>
    </div>
  );
}
