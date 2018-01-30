import { JsonpRequest } from "../Ajax";
import { Options } from "../types/Options";
import { TokenizationResponse } from "../types/TokenizationResponse";
import { TokenService } from "./TokenService";
export declare class HeartlandTokenService implements TokenService {
    protected requestData: Options;
    protected type: string;
    protected url: string;
    constructor(url: string, type?: string);
    tokenize(data: Object, callback: (response: TokenizationResponse) => void): void;
    buildRequest(data: Object): JsonpRequest;
    serializeRequestData(data: Object): string;
    deserializeResponseData(data: any): TokenizationResponse;
}
