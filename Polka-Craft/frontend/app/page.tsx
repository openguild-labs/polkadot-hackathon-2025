import { ArrowRight, ArrowRightLeft, Coins, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCurrencyEthereum } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-black relative overflow-hidden">
      {/* Background Pattern - adjusted opacity and spacing */}
      <div className="absolute inset-0 grid grid-cols-12 gap-6 p-6 opacity-[0.04]">
        {Array.from({ length: 120 }).map((_, i) => (
          <IconCurrencyEthereum key={i} size={28} className="text-primary/80" />
        ))}
      </div>

      {/* Main Content - improved spacing */}
      <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="space-y-12 text-center">
          {/* Logo Section - enhanced backdrop blur and glow */}
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-black/30 backdrop-blur-md rounded-2xl border border-primary/30 shadow-lg shadow-primary/5">
            <div className="relative">
              <IconCurrencyEthereum size={52} className="text-primary" />
              <div className="absolute inset-0 blur-2xl bg-primary/20"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-primary text-3xl font-bold tracking-tight">
                ContractCraft
              </span>
              <span className="text-sm font-medium text-muted-foreground/90">
                Build Smart Contracts Visually
              </span>
            </div>
          </div>

          {/* Hero Section - improved typography and spacing */}
          <h1 className="text-7xl sm:text-8xl font-bold text-primary bg-clip-text max-w-4xl mx-auto leading-tight tracking-tight">
            Smart Contracts <br /> Made Visual
          </h1>
          <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Create EVM and Move smart contracts with our intuitive drag-and-drop
            interface. Build, deploy, and innovate without writing a single line
            of code.
          </p>

          {/* CTA Button - enhanced hover effects */}
          <div className="flex justify-center gap-4 pt-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold 
                  px-10 py-7 rounded-xl backdrop-blur-sm flex items-center gap-3 
                  transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
                >
                  Start Building
                  <ArrowRight size={22} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 backdrop-blur-md border border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-8">
                    Choose Your Chain
                  </DialogTitle>
                </DialogHeader>
                {/* Top row with Move and EVM */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-row gap-6">
                    <Link href="/move" className="w-full">
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 text-primary-foreground 
                        text-lg font-bold px-6 py-6 rounded-xl transition-all duration-300 
                        hover:scale-105 hover:shadow-lg hover:shadow-secondary/20"
                      >
                        Move Protocol
                      </Button>
                    </Link>
                    <Link href="/evm" className="w-full">
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-primary-foreground 
                        text-lg font-bold px-6 py-6 rounded-xl transition-all duration-300 
                        hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                      >
                        EVM Chain
                      </Button>
                    </Link>
                  </div>
                  {/* Bottom row with Polkadot */}
                  <div className="flex justify-center">
                    <Link href="/polka" className="w-2/3">
                      <Button 
                        className="w-full bg-pink-500 hover:bg-pink-600 text-primary-foreground 
                        text-lg font-bold px-6 py-6 rounded-xl transition-all duration-300 
                        hover:scale-105 hover:shadow-lg hover:shadow-blue/20"
                      >
                        Polkadot ( Pop Network )
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Features Grid - improved cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-32">
            {[
              {
                title: "Visual Contract Building",
                description:
                  "Create complex smart contracts through an intuitive drag-and-drop interface",
                icon: IconCurrencyEthereum,
                gradient: "from-primary to-primary/70"
              },
              {
                title: "Multi-Chain Support",
                description: "Deploy to EVM chains and Move protocol with ease",
                icon: ArrowRightLeft,
                gradient: "from-secondary to-secondary/70"
              },
              {
                title: "Security First",
                description:
                  "Built-in security checks and best practices for safe contract deployment",
                icon: Shield,
                gradient: "from-primary/90 to-secondary/90"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-primary/20 
                hover:border-primary/40 transition-all duration-300 hover:transform hover:scale-105
                hover:shadow-lg hover:shadow-primary/10"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-lg w-fit mb-6`}>
                  <feature.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground/90 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Integration Section - enhanced visuals */}
          <div className="pt-40">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Powered by Advanced Tech
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built with cutting-edge blockchain technology to ensure smooth
                contract deployment and cross-chain compatibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300">
                <Coins size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-4">Advanced Features</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Multi-chain deployment support
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Visual contract builder
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Real-time contract simulation
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-primary" />
                    Security audit tools
                  </li>
                </ul>
              </div>

              <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <IconCurrencyEthereum size={24} className="text-primary" />
                    <ArrowRight size={24} />
                    <span className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Deploy
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    From visual design to live deployment in minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - improved styling */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <span className="text-muted-foreground/80 font-medium bg-black/20 px-6 py-3 rounded-full backdrop-blur-sm">
          Built for the future of Web3 🌐
        </span>
      </div>
    </div>
  );
};

export default LandingPage;
