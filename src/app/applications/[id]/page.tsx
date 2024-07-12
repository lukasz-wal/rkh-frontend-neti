import ApplicationTimeline from "@/components/application-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function ApplicationPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <ApplicationTimeline
          phases={{
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
          }}
        />
      </div>
    </div>
  );
}
