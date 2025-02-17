import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { ProfileSkeleton } from "@/src/shared/ui/skeletons";

export default function CabinetSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <aside className="w-full md:w-1/4">
          <Card>
            <CardContent className="pt-6">
              <ProfileSkeleton />
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Персональная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileSkeleton />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
