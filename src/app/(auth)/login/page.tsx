import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const logo = PlaceHolderImages.find((img) => img.id === 'logo');
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center items-center">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={64}
            height={64}
            data-ai-hint={logo.imageHint}
            className="rounded-md mb-4"
          />
        )}
        <CardTitle className="text-2xl font-headline">Mirje Tea Depot</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
