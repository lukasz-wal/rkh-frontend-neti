"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import Account from "@/components/Account";
import ApplicationTimeline from "@/components/application-timeline";

export default function DashboardApplicationPage({ params }: { params: { id: string } }) {  
    return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Applications</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#"># {params.id}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0"></div>
        <Account />
      </header>
      <ApplicationTimeline phases={{
            SUBMISSION: [
              {
                title: "Application Submitted",
                date: "2021-09-30",
                description:
                  "Your application has been received and is currently being reviewed.",
              },
            ],
            KYC: [
              {
                title: "KYC Requested",
                date: "2021-10-01",
                description:
                  "A KYC verification request has been sent to your email.",
              },
              {
                title: "KYC Submitted",
                date: "2021-10-05",
                description:
                  "Your KYC has been submitted and is currently being reviewed.",
              },
              {
                title: "KYC Approved",
                date: "2021-10-07",
                description:
                  "Your KYC has been approved and your identity is now verified.",
              },
            ],
          }} />
    </>
  );
}
