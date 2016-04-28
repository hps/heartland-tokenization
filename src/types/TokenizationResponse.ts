module Heartland {
  export interface TokenizationResponse {
    error?: {message?: string};
    last_four?: string;
    card_type?: string;
    exp_month?: string;
    exp_year?: string;
    token_value?: string;
  }
}
