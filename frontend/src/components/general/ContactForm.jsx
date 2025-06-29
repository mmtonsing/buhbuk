import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add backend endpoint or email service here
    console.log(form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full mx-auto p-6 mt-10 bg-stone-800 text-stone-100 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-orange-400">
        🧡 Send a Message to the Nest
      </h2>
      {submitted ? (
        <p className="text-orange-300 text-center text-lg font-medium">
          Thank you for reaching out! We'll be with you shortly. ☕
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="block mb-1 font-semibold text-stone-300">
              Name
            </Label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <Label className="block mb-1 font-semibold text-stone-300">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <Label className="block mb-1 font-semibold text-stone-300">
              Message
            </Label>
            <Textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition"
          >
            📨 Send Message
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
