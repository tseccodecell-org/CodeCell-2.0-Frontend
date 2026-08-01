import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const userEmail = session?.user?.email || body.email;
    const userName = session?.user?.name || body.fullName || body.name || "";

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized: User email required" },
        { status: 401 }
      );
    }

    console.log("[Supabase Register] Inserting payload:", {
      email: userEmail,
      full_name: userName,
      college: body.collegeName || body.college_name || "",
      course: body.course || "",
      year: body.yearOfStudy || body.year_of_study || body.year || "",
      location: body.location || "",
    });

    const { data, error } = await supabase
      .from("registrations")
      .insert({
        email: userEmail,
        full_name: userName,
        college: body.collegeName || body.college_name || "",
        course: body.course || "",
        year: body.yearOfStudy || body.year_of_study || body.year || "",
        location: body.location || "",
      })
      .select();

    if (error) {
      console.error("[Supabase Register Error]:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already registered for this event." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to save registration to Supabase" },
        { status: 500 }
      );
    }

    console.log("[Supabase Register Success]:", data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to process registration";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
