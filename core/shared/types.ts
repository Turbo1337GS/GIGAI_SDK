// front-end
export interface Message {
  id: string;
  role: "admin" | "user" | "assistant" | "system";
  content: string;
  code?: Code; 
  web?: Web; 
  wait?: any; 
  image_url?: string; 
  ExternID?:string; // ID from api GigaSoft
  model?:string;
}


//backend

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
export interface Choice {
  index: number;
  delta: Delta;
  finish_reason: string;
}

export interface Delta {
  role: string;
  content: string;
}

export interface Web {
  Analyzing_URL?: any;
  Query?: any;
}

export interface Code {
  php_result?: string;
  Python3_result?: string;
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

interface Tool {
  name: ToolName; 
}
export interface ChatOptions {
  model: string;
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