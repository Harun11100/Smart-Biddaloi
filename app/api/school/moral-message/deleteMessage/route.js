// app/api/school/Message/deleteMessage/route.js
import { NextResponse } from "next/server";
import connectDb from "@/app/utils/db";
import mongoose from "mongoose";
import MoralMessage from "@/app/model/MoralMessage";

export async function DELETE(req) {
  try {
    await connectDb();

    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "messageId is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { success: false, message: "Invalid messageId" },
        { status: 400 }
      );
    }

    const deletedMessage = await MoralMessage.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
      Message: deletedMessage,
    });
  } catch (err) {
    console.error("Error deleting Message:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete Message" },
      { status: 500 }
    );
  }
}
