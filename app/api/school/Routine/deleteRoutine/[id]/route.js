// app/api/school/routine/delete/[id]/route.js
import Routine from "@/app/model/Routine";
import connectDb from "@/app/utils/db";

export async function DELETE(req) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();
    await connectDb();

    const routine = await Routine.findById(id);
    if (!routine) {
      return new Response(JSON.stringify({ success: false, message: "Routine not found" }), { status: 404 });
    }

    await routine.deleteOne();

    return new Response(JSON.stringify({ success: true, message: "Routine deleted" }), { status: 200 });
  } catch (err) {
    console.error("Delete routine error:", err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
