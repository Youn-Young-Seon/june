import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "./login-form"

export const AuthButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-x-blue-500/20
                    rounded-full shadow-none"
                >
                    <UserCircleIcon />
                    Sign in
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>로그인</DialogTitle>
                </DialogHeader>
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}