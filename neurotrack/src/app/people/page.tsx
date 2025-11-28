import { Header } from "@/components/app/header";
import { PeopleFeature } from "@/components/app/people-feature";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PeoplePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/patient">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Dashboard
                </Link>
            </Button>
        </div>
        <PeopleFeature />
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>SafePath Memory Aid &copy; 2024</p>
      </footer>
    </div>
  );
}
