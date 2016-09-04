import {Ajax, CorsRequest} from "../Ajax";
import {TokenizationResponse} from "../types/TokenizationResponse";
import {JSON2} from "../vendor/json2";
import {TokenService} from "./TokenService";

export class CardinalTokenService implements TokenService {
  protected jwt: string;
  protected sessionId: string;
  protected url: string;

  constructor(url: string, jwt?: string) {
    this.url = url;
    this.jwt = jwt;
  }

  tokenize(data: Object, callback: (response: TokenizationResponse) => void) {
    let request = this.buildRequest(data);
    request.url += "Init";
    Ajax.cors(request, (resp) => {
      request.url = request.url.replace("Init", "Start");
      Ajax.cors(request, (response) => {
        callback(this.deserializeResponseData(response));
      });
    });
  }

  buildRequest(data: Object): CorsRequest {
    return new CorsRequest(
      this.url,
      this.serializeRequestData({
        BrowserPayload: {
          Order: {
            Consumer: {
              Account: {
                AccountNumber: "4000000000000002",
                CardCode: "123",
                ExpirationMonth: "01",
                ExpirationYear: "2099"
              }
            },
            OrderDetails: {
              OrderNumber: "urqghifstlkmxcejbdaozpyvnw"
            }
          },
          PaymentType: "cca"
        },
        ConsumerSessionId: this.sessionId,
        ServerJWT: this.jwt
      })
    );
  }

  serializeRequestData(data: Object): string {
    return JSON2.stringify(data);
  }

  deserializeResponseData(data: any): TokenizationResponse {
    const json = JSON2.parse(data);
    return {
      token_value: json.Token.token
    };
  }
}
