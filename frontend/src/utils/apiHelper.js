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
    const status = err.response?.status;
    const url = err.config?.url;

    if (status === 401 && import.meta.env.DEV) {
      console.info(`🔐 Skipped 401 for guest request(only dev): ${url}`);
    } else {
      console.error("❌ API Error:(only dev)", err);
    }
    // console.error("extractData error:", err); // 🔥 Add this if not present
    throw new Error(
      err.response?.data?.message || err.message || "Unexpected error"
    );
  }
}
