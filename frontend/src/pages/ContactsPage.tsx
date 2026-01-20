import { useEffect, useState } from "react";
import { z } from "zod";
import { contactService, type Contact } from "../services";
import { getFormErrors } from "../utils/validation";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[+\d\s()-]{7,}$/.test(value), {
      message: "Enter a valid phone number",
    }),
});

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setFormData({ name: "", email: "", phone: "" });
    setErrors({});
    setTouched({ name: false, email: false, phone: false });
    setEditingContact(null);
    setShowForm(true);
  }

  function openEditForm(contact: Contact) {
    setFormData({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
    });
    setErrors({});
    setTouched({ name: false, email: false, phone: false });
    setEditingContact(contact);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const validationErrors = getFormErrors(contactSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setTouched({ name: true, email: true, phone: true });
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      if (editingContact) {
        await contactService.update(editingContact.id, formData);
      } else {
        await contactService.create(formData);
      }
      await loadContacts();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save contact:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactService.delete(id);
      await loadContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage your contacts</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors"
        >
          Add Contact
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingContact ? "Edit Contact" : "New Contact"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const nextFormData = { ...formData, name: e.target.value };
                  setFormData(nextFormData);
                  if (touched.name) {
                    setErrors(getFormErrors(contactSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, name: true }));
                  setErrors(getFormErrors(contactSchema, formData));
                }}
                required
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={
                  touched.name && errors.name ? "contact-name-error" : undefined
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  touched.name && errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
              />
              {touched.name && errors.name && (
                <p
                  id="contact-name-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const nextFormData = { ...formData, email: e.target.value };
                  setFormData(nextFormData);
                  if (touched.email) {
                    setErrors(getFormErrors(contactSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors(getFormErrors(contactSchema, formData));
                }}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={
                  touched.email && errors.email
                    ? "contact-email-error"
                    : undefined
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  touched.email && errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
              />
              {touched.email && errors.email && (
                <p
                  id="contact-email-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const nextFormData = { ...formData, phone: e.target.value };
                  setFormData(nextFormData);
                  if (touched.phone) {
                    setErrors(getFormErrors(contactSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, phone: true }));
                  setErrors(getFormErrors(contactSchema, formData));
                }}
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={
                  touched.phone && errors.phone
                    ? "contact-phone-error"
                    : undefined
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  touched.phone && errors.phone
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
              />
              {touched.phone && errors.phone && (
                <p
                  id="contact-phone-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No contacts yet. Add your first contact!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {contact.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {contact.phone || "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditForm(contact)}
                      className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-500 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
