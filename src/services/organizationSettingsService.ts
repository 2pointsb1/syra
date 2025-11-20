import { supabase } from '../lib/supabase';

export interface OrganizationSettings {
  id: string;
  organization_id: string;
  main_logo_url: string | null;
  collapsed_logo_url: string | null;
  main_logo_dark_url: string | null;
  collapsed_logo_dark_url: string | null;
  email_template_content: string | null;
  email_first_attachment_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getOrganizationSettings(): Promise<OrganizationSettings | null> {
  const { data, error } = await supabase
    .from('organization_settings')
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch organization settings: ${error.message}`);
  }

  return data;
}

export async function updateEmailTemplate(content: string): Promise<void> {
  const settings = await getOrganizationSettings();

  if (!settings) {
    throw new Error('Organization settings not found');
  }

  const { error } = await supabase
    .from('organization_settings')
    .update({
      email_template_content: content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (error) {
    throw new Error(`Failed to update email template: ${error.message}`);
  }
}

export async function uploadEmailAttachment(file: File): Promise<string> {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  const settings = await getOrganizationSettings();
  if (!settings) {
    throw new Error('Organization settings not found');
  }

  if (settings.email_first_attachment_url) {
    await deleteEmailAttachment(settings.email_first_attachment_url);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `email-attachment-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('email-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload attachment: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('email-attachments')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('organization_settings')
    .update({
      email_first_attachment_url: fileName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (updateError) {
    await supabase.storage.from('email-attachments').remove([fileName]);
    throw new Error(`Failed to update attachment reference: ${updateError.message}`);
  }

  return publicUrl;
}

async function deleteEmailAttachment(fileName: string): Promise<void> {
  try {
    await supabase.storage
      .from('email-attachments')
      .remove([fileName]);
  } catch (error) {
    console.error('Failed to delete email attachment:', error);
  }
}

export async function uploadMainLogo(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File size must be less than 2MB');
  }

  const settings = await getOrganizationSettings();
  if (!settings) {
    throw new Error('Organization settings not found');
  }

  if (settings.main_logo_url) {
    await deleteLogo(settings.main_logo_url);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `main-logo-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('organization-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload main logo: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('organization-logos')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('organization_settings')
    .update({
      main_logo_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (updateError) {
    await supabase.storage.from('organization-logos').remove([fileName]);
    throw new Error(`Failed to update main logo reference: ${updateError.message}`);
  }

  return publicUrl;
}

export async function uploadCollapsedLogo(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File size must be less than 2MB');
  }

  const settings = await getOrganizationSettings();
  if (!settings) {
    throw new Error('Organization settings not found');
  }

  if (settings.collapsed_logo_url) {
    await deleteLogo(settings.collapsed_logo_url);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `collapsed-logo-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('organization-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload collapsed logo: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('organization-logos')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('organization_settings')
    .update({
      collapsed_logo_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (updateError) {
    await supabase.storage.from('organization-logos').remove([fileName]);
    throw new Error(`Failed to update collapsed logo reference: ${updateError.message}`);
  }

  return publicUrl;
}

async function deleteLogo(logoUrl: string): Promise<void> {
  try {
    const urlParts = logoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage
      .from('organization-logos')
      .remove([fileName]);
  } catch (error) {
    console.error('Failed to delete logo:', error);
  }
}

export function getEmailAttachmentUrl(fileName: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from('email-attachments')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function uploadMainLogoDark(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File size must be less than 2MB');
  }

  const settings = await getOrganizationSettings();
  if (!settings) {
    throw new Error('Organization settings not found');
  }

  if (settings.main_logo_dark_url) {
    await deleteLogo(settings.main_logo_dark_url);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `main-logo-dark-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('organization-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload dark mode main logo: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('organization-logos')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('organization_settings')
    .update({
      main_logo_dark_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (updateError) {
    await supabase.storage.from('organization-logos').remove([fileName]);
    throw new Error(`Failed to update dark mode main logo reference: ${updateError.message}`);
  }

  return publicUrl;
}

export async function uploadCollapsedLogoDark(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('File size must be less than 2MB');
  }

  const settings = await getOrganizationSettings();
  if (!settings) {
    throw new Error('Organization settings not found');
  }

  if (settings.collapsed_logo_dark_url) {
    await deleteLogo(settings.collapsed_logo_dark_url);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `collapsed-logo-dark-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('organization-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload dark mode collapsed logo: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('organization-logos')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('organization_settings')
    .update({
      collapsed_logo_dark_url: publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', settings.id);

  if (updateError) {
    await supabase.storage.from('organization-logos').remove([fileName]);
    throw new Error(`Failed to update dark mode collapsed logo reference: ${updateError.message}`);
  }

  return publicUrl;
}
