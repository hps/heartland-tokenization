import {Request} from "../Ajax";
import {TokenizationResponse} from "../types/TokenizationResponse";

export interface TokenService {
    tokenize(data: Object, callback: (response: TokenizationResponse) => void): void;
    buildRequest(data: Object): Request;
    serializeRequestData(data: Object): string;
    deserializeResponseData(data: any): TokenizationResponse;
}
