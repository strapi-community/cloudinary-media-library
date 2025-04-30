export type CloudinaryAsset = {
  public_id: string;
  resource_type: string;
  type: string;
  format: string;
  version: number;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  duration: number | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  access_mode: string;
  access_control: unknown[];
  created_by: unknown | null;
  uploaded_by: unknown | null;
  folder_id: string;
  id: string;
  display_name: string;
  asset_folder: string;
}

export type CloudinaryUploadData = {
  assets: CloudinaryAsset[];
  mlId: string;
}

export type Config = {
  cloud_name: string;
  api_key: string;
}