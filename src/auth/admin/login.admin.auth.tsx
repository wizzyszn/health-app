"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "@/lib/validation-schemas";
import { useMutation } from "@tanstack/react-query";
import { signInAdminWithCredReq } from "@/config/service/auth.service";
import { GeneralReturnInt, UserType, RejectedPayload } from "@/lib/types";
import useNavigateToPage from "@/shared/hooks/use-navigate-to-page";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/config/stores/store";
import { setUser } from "@/config/stores/slices/auth.slice";
// import ButtonSpinner from "@/shared/components/BtnSpinner";

export default function AdminSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigateToPage({
    path: "/admin/dashboard",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { mutate, isPending } = useMutation<
    GeneralReturnInt<UserType>,
    RejectedPayload,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: (variables) => signInAdminWithCredReq(variables),
    onSuccess: (response) => {
      dispatch(setUser(response.data));
      toast.success(response.response_description);
      navigate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: AdminLoginFormValues) {
    // Handle form submission
    mutate(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#3784a6] to-[#1d4e5f] px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#3784a6] hover:bg-[#2d6a85]"
                disabled={isPending}
              >
                {isPending ? "......." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/admin/sign-up"
              className="font-medium text-[#3784a6] hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
