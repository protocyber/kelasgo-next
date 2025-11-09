"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModeToggle } from '@/components/theme-toggle';

// Mock API function - replace with your actual API call
async function fetchDashboardData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    stats: [
      { label: "Total Users", value: "1,234" },
      { label: "Active Sessions", value: "567" },
      { label: "Revenue", value: "$12,345" },
      { label: "Growth", value: "+23%" },
    ],
  };
}

export default function DashboardScreen() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-[400px] w-full max-w-4xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        {isLoadingData ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data?.stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
