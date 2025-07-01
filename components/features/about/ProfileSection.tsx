import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Github, Notebook } from 'lucide-react';

const socialLinks = [
  {
    icon: Github,
    href: 'https://github.com/KangBaekGwa',
  },
  {
    icon: Notebook,
    href: 'https://velog.io/@baekgwa/posts',
  },
];

export default function ProfileSection() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <div className="h-36 w-36 overflow-hidden rounded-full">
                <Image
                  src="/images/profile-centered-resized.png"
                  alt="강성욱"
                  width={144}
                  height={144}
                  className="scale-110 object-cover object-top"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold">강성욱</h3>
            <p className="text-primary text-sm">Server Developer</p>
          </div>

          <div className="flex justify-center gap-2">
            {socialLinks.map((item, index) => (
              <Button key={index} variant="ghost" className="bg-primary/10" size="icon" asChild>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <item.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>

          <p className="bg-primary/10 rounded p-2 text-center text-sm">성장형 개발자 🚀</p>
        </div>
      </CardContent>
    </Card>
  );
}
