import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTicket } from "../api/client";

const initialForm = {
  customer_name: "",
  customer_email: "",
  subject: "",
  description: "",
};

export default function NewTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.customer_name.trim()) next.customer_name = "Enter the customer's name.";
    if (!form.customer_email.trim()) {
      next.customer_email = "Enter the customer's email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.customer_email)) {
      next.customer_email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Give the ticket a short title.";
    if (!form.description.trim()) next.description = "Describe the issue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const { data } = await createTicket(form);
      navigate(`/tickets/${data.ticket_id}`);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.error || "Couldn't create the ticket. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All tickets
      </Link>

      <h1 className="font-display text-2xl font-semibold text-ink">
        Log a new ticket
      </h1>
      <p className="mt-1 text-sm text-ink/50">
        A ticket ID is generated automatically once you submit.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-xl border border-line bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Customer name"
            value={form.customer_name}
            onChange={(v) => update("customer_name", v)}
            error={errors.customer_name}
            placeholder="Jordan Lee"
          />
          <Field
            label="Customer email"
            type="email"
            value={form.customer_email}
            onChange={(v) => update("customer_email", v)}
            error={errors.customer_email}
            placeholder="jordan@example.com"
          />
        </div>

        <Field
          label="Issue title"
          value={form.subject}
          onChange={(v) => update("subject", v)}
          error={errors.subject}
          placeholder="Can't reset my password"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What is the customer experiencing? Include any steps they've already tried."
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand ${
              errors.description ? "border-status-open" : "border-line"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-status-open">{errors.description}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-lg border border-status-open/30 bg-status-openBg px-4 py-3 text-sm text-status-open">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
          <Link
            to="/"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/60 hover:text-ink"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand ${
          error ? "border-status-open" : "border-line"
        }`}
      />
      {error && <p className="mt-1 text-xs text-status-open">{error}</p>}
    </div>
  );
}
