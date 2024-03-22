"use strict";
// src/package/backend/gigasoft.ts
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
exports.Gigasoft = void 0;
//const URL: string = "https://main.gigasoft.com.pl/v2/chat/completions";
const URL = "https://main.gigasoft.com.pl/v2/chat/completions";
class Gigasoft {
    constructor(options = {}) {
        this.API_KEY = options.API_KEY || process.env.GIGAI || "";
    }
    ocr(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.API_KEY) {
                throw new Error("Error: Unable to read API key or API key not provided");
            }
            if (!options.model) {
                throw new Error("Model name not provided! Check the list of models at https://main.gigasoft.com.pl/v2/chat/completions");
            }
            if (!options.image) {
                throw new Error('Image is required');
            }
            const response = yield fetch(`${URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.API_KEY}`,
                },
                body: JSON.stringify({
                    model: options.model,
                    url: options.image,
                }),
            });
            if (response.status === 200) {
                return (yield response.json());
            }
            else {
                // alpha handle errors
                const error = yield response.json();
                throw new Error(error);
            }
        });
    }
    chat(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.API_KEY) {
                throw new Error("Error: Unable to read API key or API key not provided");
            }
            if (!Array.isArray(options.messages)) {
                throw new Error("Error: Message data must be in array format");
            }
            if (options.max_tokens === undefined) {
                console.log("Warning: max_tokens parameter not provided; setting to 4000");
            }
            if (!options.model) {
                throw new Error("Model name not provided! Check the list of models at https://main.gigasoft.com.pl/v2/chat/completions");
            }
            const apiResponse = yield fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.API_KEY}`,
                },
                body: JSON.stringify(Object.assign(Object.assign(Object.assign(Object.assign({ model: options.model }, (options.Admin && { admin: options.Admin })), { stream: options.stream, messages: options.messages }), (options.image_base && { image_url: options.image_base })), { functions: options.tools })),
            });
            if (apiResponse.status !== 200) {
                //TODO Complete hadnel Error's
                const body = yield apiResponse.text();
                return body;
            }
            if (options.stream === true) {
                const stream = new ReadableStream({
                    start(controller) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const reader = apiResponse.body.getReader();
                            while (true) {
                                const { done, value } = yield reader.read();
                                if (done) {
                                    controller.close();
                                    break;
                                }
                                controller.enqueue(value);
                            }
                        });
                    },
                });
                return stream;
            }
            else {
                return yield apiResponse.text();
            }
        });
    }
}
exports.Gigasoft = Gigasoft;
