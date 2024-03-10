"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useGigaAI({ api = "api/chat", additionalData, initialMessages, }) {
    const [messages, setMessages] = (0, react_1.useState)(initialMessages);
    const [isLoading, setLoading] = (0, react_1.useState)(false);
    const [input, setInput] = (0, react_1.useState)("");
    const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const handleInputChange = (0, react_1.useCallback)((event) => {
        setInput(event.target.value);
    }, []);
    const handleSubmit = (0, react_1.useCallback)((event) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        const userMessageWithId = {
            id: generateId(),
            role: "user",
            content: input,
        };
        setMessages((oldMessages) => [...oldMessages, userMessageWithId]);
        setLoading(true);
        setInput("");
        const messagesToSend = messages.map(({ role, content }) => {
            return { role, content };
        });
        messagesToSend.push({ role: "user", content: userMessageWithId.content });
        const assistantMessageId = generateId();
        try {
            const response = yield fetch(`${api}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: messagesToSend,
                    additionalData,
                    stream: true,
                }),
            });
            const transferEncoding = response.headers.get("Transfer-Encoding");
            const Text = response.headers.get("Content-Type");
            if (Text && Text.includes("text/plain")) {
                let RawRes = yield response.text();
                if (!RawRes.startsWith("data")) // check for raw response, from api!
                 {
                    setMessages((oldMessages) => [
                        ...oldMessages,
                        {
                            id: assistantMessageId,
                            role: "assistant",
                            content: RawRes,
                        },
                    ]);
                    setLoading(false);
                }
                if (RawRes.startsWith("data")) {
                    let RawJson = RawRes.substring("data: ".length);
                    const Ocr = JSON.parse(RawJson);
                    if (Ocr) {
                        setMessages((oldMessages) => [
                            ...oldMessages,
                            {
                                id: Ocr.id,
                                role: "assistant",
                                content: Ocr.OcrText,
                                ExternID: Ocr.id,
                            },
                        ]);
                        setLoading(false);
                    }
                }
            }
            if (transferEncoding && transferEncoding.includes("chunked")) {
                const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                let decoder = new TextDecoder();
                let buffer = "";
                if (reader) {
                    while (true) {
                        const { value, done } = yield reader.read();
                        if (done) {
                            setLoading(false);
                            break;
                        }
                        buffer += decoder.decode(value, { stream: true });
                        while (buffer.includes("\n")) {
                            const splitPoint = buffer.indexOf("\n");
                            const chunk = buffer.substring(0, splitPoint);
                            buffer = buffer.substring(splitPoint + 1);
                            if (chunk.startsWith("data: ")) {
                                const jsonStr = chunk.substring("data: ".length);
                                try {
                                    const parsedData = JSON.parse(jsonStr);
                                    const messageContents = parsedData.choices
                                        .map((choice) => choice.delta.content)
                                        .join("\n");
                                    setMessages((oldMessages) => {
                                        var _a, _b, _c, _d, _e;
                                        const otherMessages = oldMessages.filter((msg) => msg.id !== assistantMessageId);
                                        const existingAssistantMsg = oldMessages.find((msg) => msg.id === assistantMessageId);
                                        const updatedContent = existingAssistantMsg
                                            ? existingAssistantMsg.content + messageContents
                                            : messageContents;
                                        const updatedWeb = Object.assign(Object.assign({}, existingAssistantMsg === null || existingAssistantMsg === void 0 ? void 0 : existingAssistantMsg.web), { Analyzing_URL: parsedData.Web.Analyzing_URL, Query: ((_a = existingAssistantMsg === null || existingAssistantMsg === void 0 ? void 0 : existingAssistantMsg.web) === null || _a === void 0 ? void 0 : _a.Query) ||
                                                parsedData.Web.Query });
                                        const updateCode = Object.assign(Object.assign({}, existingAssistantMsg === null || existingAssistantMsg === void 0 ? void 0 : existingAssistantMsg.code), { php_result: ((_b = parsedData.Code) === null || _b === void 0 ? void 0 : _b.php_result) ||
                                                ((_c = existingAssistantMsg === null || existingAssistantMsg === void 0 ? void 0 : existingAssistantMsg.code) === null || _c === void 0 ? void 0 : _c.php_result), Python3_result: ((_d = parsedData.Code) === null || _d === void 0 ? void 0 : _d.Python3_result) ||
                                                ((_e = existingAssistantMsg === null || existingAssistantMsg === void 0 ? void 0 : existingAssistantMsg.code) === null || _e === void 0 ? void 0 : _e.Python3_result) });
                                        return [
                                            ...otherMessages,
                                            {
                                                id: assistantMessageId,
                                                role: "assistant",
                                                content: updatedContent,
                                                code: updateCode,
                                                web: updatedWeb,
                                                wait: parsedData.Wait,
                                                image_url: parsedData.image_url,
                                                ExternID: parsedData.id,
                                                model: parsedData.model,
                                            },
                                        ];
                                    });
                                }
                                catch (error) {
                                    console.error("Error parsing stream chunk:", error);
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error("Fetching error: ", error);
            setLoading(false);
        }
    }), [api, additionalData, input, messages]);
    return {
        messages,
        isLoading,
        handleSubmit,
        input,
        setInput,
        handleInputChange,
    };
}
exports.default = useGigaAI;
