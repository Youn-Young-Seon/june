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
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    email: z.string().email({
        message: "올바른 이메일 주소를 입력해주세요.",
    }),
    password: z.string().min(6, {
        message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
    confirmPassword: z.string().min(6, {
        message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
})

export const RegisterForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
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
                throw new Error(data.message || "회원가입 중 오류가 발생했습니다.")
            }

            router.push("/")
        } catch (err) {
            setError(err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>이메일</FormLabel>
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
                            <FormLabel>비밀번호</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>비밀번호 확인</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                >
                    {isLoading ? "처리중..." : "회원가입"}
                </Button>
            </form>
        </Form>
    )
} 