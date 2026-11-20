export type CardRecord = {
  id: string;
  user_id: string;
  template_id: string;
  recipient_name: string | null;
  message: string;
  sender_name: string;
  share_token: string;
  design_options?: { design?: string; attachment?: string | null; wishes?: { message: string; senderName: string }[] } | null;
  card_image_url: string | null;
  created_at: string;
};

export type CardStyle = {
  textColor?: string;
  fontStyle?: "serif" | "sans" | "script";
  textAlign?: "left" | "center";
};

export type CardWish = {
  message: string;
  senderName: string;
};

export type CardDraft = {
  templateId: string;
  recipientName: string;
  message: string;
  senderName: string;
  wishes?: CardWish[];
  photoUrl?: string;
  style?: CardStyle;
};
