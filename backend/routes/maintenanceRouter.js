// routes/maintenanceRouter.js
import express from "express";
import { runReminderScript } from "../scripts/sendReminderVerificationEmails.js";
import { runDeleteScript } from "../scripts/deleteUnverifiedUsers.js";

const router = express.Router();

router.get("/reminder", async (req, res) => {
  try {
    await runReminderScript();
    res.send("✅ Reminder script executed.");
  } catch (err) {
    console.error("Reminder error:", err);
    res.status(500).send("❌ Reminder script failed.");
  }
});

router.get("/cleanup", async (req, res) => {
  try {
    await runDeleteScript();
    res.send("✅ Cleanup script executed.");
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).send("❌ Cleanup script failed.");
  }
});

export default router;
