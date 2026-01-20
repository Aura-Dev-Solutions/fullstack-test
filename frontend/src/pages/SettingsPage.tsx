import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { organizationService, type Organization, notify } from "../services";
import { getFormErrors } from "../utils/validation";

const organizationSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required"),
});

export function SettingsPage() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [touched, setTouched] = useState({ name: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, []);

  async function loadOrganization() {
    try {
      const data = await organizationService.get();
      setOrganization(data);
      setName(data.name);
    } catch (error) {
      console.error("Failed to load organization:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setErrors({});
    const validationErrors = getFormErrors(organizationSchema, { name });
    if (Object.keys(validationErrors).length > 0) {
      setTouched({ name: true });
      setErrors(validationErrors);
      setSaving(false);
      return;
    }
    try {
      const updated = await organizationService.update({ name });
      setOrganization(updated);
      setEditing(false);
      notify.success("The organization was updated successfully");
    } catch (error) {
      console.error("Failed to update organization:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your account and organization
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500">
                Name
              </label>
              <p className="text-slate-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500">
                Email
              </label>
              <p className="text-slate-900">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Organization
            </h2>
            {!editing && (
              <button
                onClick={() => {
                  setEditing(true);
                  setErrors({});
                  setTouched({ name: false });
                }}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setName(nextValue);
                    if (touched.name) {
                      setErrors(
                        getFormErrors(organizationSchema, { name: nextValue }),
                      );
                    }
                  }}
                  onBlur={() => {
                    setTouched({ name: true });
                    setErrors(getFormErrors(organizationSchema, { name }));
                  }}
                  aria-invalid={touched.name && !!errors.name}
                  aria-describedby={
                    touched.name && errors.name
                      ? "organization-name-error"
                      : undefined
                  }
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    touched.name && errors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300"
                  }`}
                />
                {touched.name && errors.name && (
                  <p
                    id="organization-name-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(organization?.name || "");
                    setErrors({});
                    setTouched({ name: false });
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500">
                  Name
                </label>
                <p className="text-slate-900">{organization?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500">
                  Created
                </label>
                <p className="text-slate-900">
                  {organization?.createdAt
                    ? new Date(organization.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
