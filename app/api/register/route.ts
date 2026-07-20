import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await req.json();

    const { error } = await supabase
        .from("registrations")
        .insert({
            email: session.user.email,
            full_name: session.user.name,
            college: body.collegeName,
            course: body.course,
            year: body.yearOfStudy,
            location: body.location,
        });


    if (error) {
        if (error.code === "23505") {
            return NextResponse.json(
            {
                error: "You have already registered for this event.",
            },
            { status: 409 }
            );
        }

        return NextResponse.json(
            {
            error: error.message,
            },
            { status: 500 }
        );
    }
 
    return NextResponse.json(
        {
            success: true,
        },
        { status: 201 }
    );
}