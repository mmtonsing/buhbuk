import { useState } from "react";
import { SectionTitle, PageParagraph } from "@/components/customUI/Typography";

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
    <div className="max-w-xl mx-auto p-6 mt-10 bg-stone-800 text-stone-100 rounded-2xl shadow-lg">
      <SectionTitle className="text-orange-600 text-center mb-6">
        🧡 Send a Message to BuhBuk
      </SectionTitle>

      {submitted ? (
        <PageParagraph className="text-orange-300 text-center text-lg font-medium">
          Thank you for reaching out! We'll be with you shortly. ☕
        </PageParagraph>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-stone-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-stone-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-stone-300">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-lg px-3 py-2 bg-stone-700 text-stone-100 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button type="submit" className="btn-buhbuk w-full py-2 rounded-xl">
            📨 Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
