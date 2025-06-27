// utils/apiHelper.js
export async function extractData(promise) {
  try {
    const res = await promise;
    const payload = res.data;

    if ("success" in payload && !payload.success) {
      throw new Error(payload.message || "Unknown API error");
    }

    return {
      data: payload.data ?? {},
      message: payload.message ?? "",
    };
  } catch (err) {
    console.error("extractData error:", err); // 🔥 Add this if not present
    throw new Error(
      err.response?.data?.message || err.message || "Unexpected error"
    );
  }
}
