"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email({
        message: "올바른 이메일 주소를 입력해주세요.",
    }),
    password: z.string().min(6, {
        message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
})

export const LoginForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "로그인 중 오류가 발생했습니다.")
            }

            router.push("/")
        } catch (err) {
            
        } finally {
            
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@email.com" {...field} />
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
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Sign in
                </Button>
                <div className="text-center text-sm">
                    계정이 없으신가요?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        회원가입
                    </Link>
                </div>
            </form>
        </Form>
    )
} 