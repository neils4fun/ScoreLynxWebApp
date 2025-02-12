export interface SkinsMeta {
  type: string;
  description: string;
}

export interface SkinsMetaResponse {
  status: {
    code: number;
    message: string;
  };
  skinsMetaList: SkinsMeta[];
} 