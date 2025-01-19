import { Button } from "@/components/ui/button";
import { SparklesIcon, Coins, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-8 py-24">
        <div className="text-center mb-24 relative">
          <div className="absolute -top-4 right-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
          <div className="absolute top-8 left-1/3 w-40 h-40 bg-secondary/20 rounded-full blur-xl" />

          <h1 className="text-8xl font-black mb-8 tracking-tight relative">
            <span className="text-primary">The best place to</span>
            <br />
            <span className="text-foreground">transfer</span>{" "}
            <span className="text-primary">crypto</span>
          </h1>

          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover a seamless way to transfer crypto assets with secure,
            time-locked links
          </p>

          <Link href="/dashboard">
            <Button
              size="lg"
              className="blob-button bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-full"
            >
              Get Started
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto relative">
          <div className="absolute -z-10 w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="bg-card/5 backdrop-blur-sm p-12 rounded-3xl border border-primary/10 hover:border-primary/20 transition-all">
            <div className="bg-primary/10 p-6 rounded-2xl inline-block mb-6">
              <SparklesIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Instant Transfers
            </h3>
            <p className="text-lg text-muted-foreground">
              Create transfer links in seconds and share them with anyone
            </p>
          </div>

          <div className="bg-card/5 backdrop-blur-sm p-12 rounded-3xl border border-primary/10 hover:border-primary/20 transition-all">
            <div className="bg-primary/10 p-6 rounded-2xl inline-block mb-6">
              <Coins className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Secure Storage
            </h3>
            <p className="text-lg text-muted-foreground">
              Your crypto assets are safely stored until claimed
            </p>
          </div>

          <div className="bg-card/5 backdrop-blur-sm p-12 rounded-3xl border border-primary/10 hover:border-primary/20 transition-all">
            <div className="bg-primary/10 p-6 rounded-2xl inline-block mb-6">
              <SparklesIcon className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Full Control
            </h3>
            <p className="text-lg text-muted-foreground">
              Set expiration times and reclaim unclaimed transfers
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
