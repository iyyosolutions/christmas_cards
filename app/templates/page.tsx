import { TemplateGallery, type GalleryTemplate } from "@/components/gallery/template-gallery";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { templates as designedTemplates } from "@/lib/templates";

const designed: GalleryTemplate[] = designedTemplates.map((template) => ({
  ...template,
  design: template.id,
}));

export default async function TemplatesPage() {
  if (!isSupabaseConfigured()) return <TemplateGallery templates={designed} signedIn={false} />;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("templates")
    .select("id, name, category, description, template_config")
    .eq("is_active", true)
    .order("category");

  const fromDatabase: GalleryTemplate[] = (data ?? []).flatMap((template) => {
    const design = template.template_config?.design;
    if (typeof design !== "string") return [];
    return [{
      id: template.id,
      name: template.name,
      category: template.category,
      tagline: template.description,
      mood: template.category,
      design,
    }];
  });

  const seen = new Set(fromDatabase.map((template) => template.design));
  const templates = [...fromDatabase, ...designed.filter((template) => !seen.has(template.design))];

  return <TemplateGallery templates={templates} signedIn={Boolean(user)} />;
}
