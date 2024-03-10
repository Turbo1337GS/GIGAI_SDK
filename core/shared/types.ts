// front-end
export interface Message {
  id: string;
  role: "admin" | "user" | "assistant" | "system";
  content: string;
  code?: Code;
  web?: Web;
  wait?: any;
  image_url?: string;
  ExternID?: string; // ID from api GigaSoft
  model?: string;
}

//backend
// **** CHAT ****

export interface ChatChunk {
  id: string;
  object: string;
  created: string;
  model: string;
  choices: Choice[];
  Code: Code;
  Web: Web;
  Wait?: any;
  image_url?: any;
}

interface Choice {
  index: number;
  delta: Delta;
  finish_reason: string;
}

interface Delta {
  role: string;
  content: string;
}

interface Web {
  Analyzing_URL?: any;
  Query?: any;
}

interface Code {
  php_result?: string;
  Python3_result?: string;
}

interface Tool {
  name: ToolName;
}

type ToolName =
  | "qr_creator"
  | "github_api_user_info"
  | "CheckWeather"
  | "GigaGem"
  | "GithubReadME"
  | "php_interpreter"
  | "python3_interpreter"
  | "web";

export interface ChatOptions {
  model: "GigAI-v1" | "GigAI-v1_5" | "Fake" | string;
  messages: Message | Message[] | any;
  max_tokens?: number;
  stream?: boolean;
  style?: string;
  Admin?: Admin;
  image_base?: string; // base64
  tools?: Tool[];
}

export interface Admin {
  content: string;
}

// **** OCR ****
export interface OcrOptions {
  model: "GigAI-OCR";
  image: string; // Base64 or URL for OCR
}
export interface OCRResponse {
  id: string;
  object: string;
  created: string;
  model: string;
  OcrText: string;
}
