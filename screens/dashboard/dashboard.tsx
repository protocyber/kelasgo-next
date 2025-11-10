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
import { fetchDashboardData } from './dashboard.action';
import CreateTenantModal from './create-tenant';

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
          <h1 className="text-2xl font-bold">Dasbor</h1>
          <div className="flex items-center gap-4">
            <CreateTenantModal />
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Selamat datang kembali, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Berikut adalah ringkasan akun Anda hari ini.
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
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas dan pembaruan terakhir Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Belum ada aktivitas terbaru untuk ditampilkan.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
