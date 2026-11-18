export type CardRecord = {
  id: string;
  user_id: string;
  template_id: string;
  recipient_name: string | null;
  message: string;
  sender_name: string;
  share_token: string;
  card_image_url: string | null;
  created_at: string;
};

export type CardStyle = {
  textColor?: string;
  fontStyle?: "serif" | "sans" | "script";
  textAlign?: "left" | "center";
};

export type CardDraft = {
  templateId: string;
  recipientName: string;
  message: string;
  senderName: string;
  style?: CardStyle;
};
