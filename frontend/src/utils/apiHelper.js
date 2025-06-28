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
    const status = err?.response?.status;

    if (status === 401) {
      // ✅ silent for guest
      throw new Error("Unauthorized");
    }

    if (import.meta.env.DEV) {
      console.error("❌ API Error (DEV):", err);
    }

    throw new Error(
      err?.response?.data?.message || err.message || "Unexpected error"
    );
  }
}
