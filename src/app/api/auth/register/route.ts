import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name } = body

        // TODO: 실제 데이터베이스 연동
        // 여기서는 임시로 성공 응답만 반환
        return NextResponse.json(
            { message: "회원가입이 완료되었습니다." },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "회원가입 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
} 