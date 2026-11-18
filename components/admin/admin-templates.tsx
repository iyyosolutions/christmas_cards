"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTemplate, saveTemplate, setTemplateActive } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { designIds } from "@/lib/templates";

export type AdminTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_image: string | null;
  design: string;
  is_active: boolean;
};

export function AdminTemplates({ templates }: { templates: AdminTemplate[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminTemplate | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function onSave(formData: FormData) {
    setNote(null);
    const result = await saveTemplate(formData);
    if (result.error) {
      setNote(result.error);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {templates.map((template) => (
          <article key={template.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-ink/10 bg-cream p-4">
            <div>
              <h2 className="font-serif text-2xl text-pine">{template.name}</h2>
              <p className="text-xs uppercase tracking-[0.14em] text-ink/50">{template.category} · {template.is_active ? "Active" : "Hidden"}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(template)}>Edit</Button>
              <Button type="button" size="sm" variant="outline" onClick={async () => { await setTemplateActive(template.id, !template.is_active); router.refresh(); }}>
                {template.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={async () => {
                if (!confirm(`Delete ${template.name}?`)) return;
                const result = await deleteTemplate(template.id);
                setNote(result.error ?? "Template deleted.");
                router.refresh();
              }}>Delete</Button>
            </div>
          </article>
        ))}
      </div>
      <form key={editing?.id ?? "new"} action={onSave} className="space-y-3 rounded-[28px] border border-ink/10 bg-cream p-5 lg:sticky lg:top-24">
        <h2 className="font-serif text-3xl text-pine">{editing ? "Edit template" : "Add template"}</h2>
        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={editing?.name} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={editing?.category} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={editing?.description} required />
        </div>
        <div>
          <Label htmlFor="design">Artwork</Label>
          <select id="design" name="design" defaultValue={editing?.design ?? designIds[0]} className="h-12 w-full rounded-2xl border border-ink/10 bg-cream px-4 text-sm">
            {designIds.map((design) => (
              <option key={design} value={design}>{design}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="preview">Preview image</Label>
          <Input id="preview" name="preview" type="file" accept="image/png,image/jpeg,image/webp" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={editing?.is_active ?? true} />
          Active
        </label>
        {note && <p className="text-sm text-berry">{note}</p>}
        <Button type="submit">{editing ? "Save changes" : "Add template"}</Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel edit</Button>
        )}
      </form>
    </div>
  );
}
