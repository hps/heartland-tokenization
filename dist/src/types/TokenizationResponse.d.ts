export interface TokenizationResponse {
    error?: {
        message?: string;
        code?: string;
        param?: string;
    };
    last_four?: string;
    card_type?: string;
    exp_month?: string;
    exp_year?: string;
    token_value?: string;
    card?: {
        number?: string;
    };
    encryptedcard?: {
        number?: string;
    };
    jwt?: string;
}
