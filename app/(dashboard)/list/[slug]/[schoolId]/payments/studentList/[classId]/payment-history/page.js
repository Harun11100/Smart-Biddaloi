
import PaymentHistoryClient from "./PaymentHistoryClient";

export default async function StudentPaymentHistoryPage({
  params,
  searchParams,
}) {
  const { slug, schoolId, classId } = params;
  const { studentId } = searchParams; // ✅ FIX

  if (!slug || !schoolId || !classId || !studentId) {
    return (
      <div className="p-6 text-red-500">
        Required parameters are missing
      </div>
    );
  }


  return (
    <PaymentHistoryClient
      schoolId={schoolId}
      classId={classId}
      studentId={studentId}
    />
  );
}
