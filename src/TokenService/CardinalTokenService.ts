import {NullRequest} from "../Ajax";
import {Options} from "../types/Options";
import {TokenizationResponse} from "../types/TokenizationResponse";
import {TokenService} from "./TokenService";

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

export class CardinalTokenService implements TokenService {
  protected jwt: string;
  protected sessionId: string;

  constructor(jwt?: string) {
    this.jwt = jwt;
  }

  tokenize(data: Object, callback: (response: TokenizationResponse) => void) {
    const request = this.buildRequest(data);
    const cardinal = (<any>window).Cardinal;
    const cb = (responseData: CardinalTokenResponse, jwt: string) => {
      responseData.jwt = jwt;
      callback(this.deserializeResponseData(responseData));
    };
    // init only once per frame
    if (!cardinal.__secureSubmitFrameInit) {
      cardinal.setup('init', { jwt: this.jwt });
      cardinal.on('payments.validated', cb);
      cardinal.__secureSubmitFrameInit = true;
    }
    cardinal.trigger('jwt.update', this.jwt);
    cardinal.start('cca', request.payload);
  }

  buildRequest(data: Options): NullRequest {
    return new NullRequest({
      Consumer: {
        Account: {
          AccountNumber: data.cardNumber.replace(/\D/g, ''),
          CardCode: data.cardCvv.replace(/^\s+|\s+$/g, ''),
          ExpirationMonth: data.cardExpMonth.replace(/^\s+|\s+$/g, ''),
          ExpirationYear: data.cardExpYear.replace(/^\s+|\s+$/g, '')
        }
      },
      Options: {
        EnableCCA: false
      },
      OrderDetails: {
        OrderNumber: data.cca.orderNumber
      }
    });
  }

  serializeRequestData(data: Object): Object {
    return data;
  }

  deserializeResponseData(data: CardinalTokenResponse): TokenizationResponse {
    if (typeof data.Token !== "undefined" &&
      data.Token.Token !== "undefined" &&
      data.Token.ReasonCode === "0") {
        return this.deserializeSuccessResponse(data);
    }
    return this.deserializeFailureResponse(data);
  }

  deserializeSuccessResponse(data: CardinalTokenResponse): TokenizationResponse {
    return {
      jwt: data.jwt,
      token_value: data.Token.Token
    };
  }

  deserializeFailureResponse(data: CardinalTokenResponse): TokenizationResponse {
    let message = data.ErrorDescription;
    if (data.Token && data.Token.ReasonDescription !== "") {
        message = data.Token.ReasonDescription;
    }

    return {
      error: {
        message: message
      }
    };
  }
}
