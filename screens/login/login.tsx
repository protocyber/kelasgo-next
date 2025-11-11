"use client";

import LoadingButton from '@/components/loading-button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLoginAction } from "./login.action";

export default function LoginScreen() {

  const { register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
    error,
  } = useLoginAction();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Selamat datang kembali</CardTitle>
          <CardDescription>
            Masuk ke akun Anda untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex w-full flex-col gap-3 mt-4">
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
            >
              Masuk
            </LoadingButton>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun? <Link href="/registration" className="underline">Buat akun</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
