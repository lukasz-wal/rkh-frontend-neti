import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, UserCheckIcon, UsersIcon, KeyIcon, GithubIcon, TwitterIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white dark:bg-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <img className="h-8" src="/filecoin-plus.svg" alt="Fil+ Icon" />
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="https://docs.filecoin.io/basics/how-storage-works/filecoin-plus" target="_blank" rel="noopener noreferrer">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
                Manage Your Fil+ Applications
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Streamline your Filecoin Plus application process with our intuitive dashboard. Track, manage, and optimize your journey to Filecoin Plus certification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/dashboard">
                  <Button size="lg">Visit Dashboard</Button>
                </Link>
                <Link href="https://fil.org/filplus" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-20 md:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Application Phases</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                { icon: ClipboardIcon, title: "Form Submission", description: "Submit your application with required details" },
                { icon: UserCheckIcon, title: "KYC Process", description: "Complete identity verification checks" },
                { icon: UsersIcon, title: "Governance Review", description: "Application assessed by governance team" },
                { icon: KeyIcon, title: "RKH Approvals", description: "Final approval by Root Key Holders" },
              ].map((phase, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg transition-transform hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 text-lg font-bold">
                      {index + 1}
                    </div>
                    <phase.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="join-filecoin-plus" className="w-full py-20 md:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-2xl">
                Join Filecoin Plus
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Unlock enhanced benefits and contribute to the growth of the decentralized web:
              </p>
              <ul className="list-none text-left mx-auto max-w-[600px] space-y-4 mt-6">
                {[
                  "10x boost in storage power for verified deals",
                  "Priority access to storage on the Filecoin network",
                  "Contribute to a more valuable and efficient decentralized storage network",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="https://github.com/filecoin-project/filecoin-plus-client-onboarding#filecoin-plus-client-application-process" target="_blank" rel="noopener noreferrer" className="mt-8">
                <Button size="lg">Apply for Fil+</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t bg-white dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            © {new Date().getFullYear()} Filecoin Plus. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" href="https://github.com/filecoin-project/Allocator-Registry" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" href="https://x.com/Filecoin" target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}