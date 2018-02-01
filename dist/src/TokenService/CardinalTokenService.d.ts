import { NullRequest } from "../Ajax";
import { Options } from "../types/Options";
import { TokenizationResponse } from "../types/TokenizationResponse";
import { TokenService } from "./TokenService";
export interface CardinalTokenResponse {
    ActionCode?: string;
    ErrorDescription?: string;
    ErrorNumber?: number;
    Payment?: {
        ExtendedData?: {
            CAVV?: string;
            ECIFlag?: string;
            Enrolled?: boolean;
            PAResStatus?: string;
            SignatureVerification?: string;
            XID: string;
        };
        Type?: string;
    };
    Token?: {
        ReasonCode?: string;
        ReasonDescription?: string;
        Token?: string;
    };
    Validated?: boolean;
    jwt?: string;
}
export declare class CardinalTokenService implements TokenService {
    protected jwt: string;
    protected sessionId: string;
    constructor(jwt?: string);
    tokenize(data: Object, callback: (response: TokenizationResponse) => void): void;
    buildRequest(data: Options): NullRequest;
    serializeRequestData(data: Object): Object;
    deserializeResponseData(data: CardinalTokenResponse): TokenizationResponse;
    deserializeSuccessResponse(data: CardinalTokenResponse): TokenizationResponse;
    deserializeFailureResponse(data: CardinalTokenResponse): TokenizationResponse;
}
