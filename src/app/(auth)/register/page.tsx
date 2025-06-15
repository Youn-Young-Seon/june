import { RegisterForm } from "@/modules/auth/ui/components/register-form"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6 p-6">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        회원가입
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        계정을 생성하고 서비스를 이용해보세요
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
} 