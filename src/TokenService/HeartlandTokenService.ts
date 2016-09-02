import {Ajax, JsonpRequest} from "../Ajax";
import {Options} from "../types/Options";
import {Util} from "../Util";
import {TokenizationResponse} from "../types/TokenizationResponse";
import {TokenService} from "./TokenService";

export class HeartlandTokenService implements TokenService {
    protected requestData: Options;
    protected type: string;
    protected url: string;
    constructor(url: string, type = "pan") {
        this.url = url;
        this.type = type;
    }
    tokenize(data: Object, callback: (response: TokenizationResponse) => void) {
        this.requestData = data;
        Ajax.jsonp(this.buildRequest(data), (response) => {
            callback(this.deserializeResponseData(response));
        });
    }
    buildRequest(data: Object): JsonpRequest {
        return new JsonpRequest(
            this.url,
            this.serializeRequestData(data)
        );
    }
    serializeRequestData(data: Object): string {
        return Util.getParams(this.type, data);
    }
    deserializeResponseData(data: any): TokenizationResponse {
        if (data.error) {
            return data;
        }

        const cardType = Util.getCardType(this.type, this.requestData);
        const card = data.card || data.encryptedcard;
        const lastfour = card.number.slice(-4);

        data.last_four = lastfour;
        data.card_type = cardType;
        data.exp_month = this.requestData.cardExpMonth;
        data.exp_year = this.requestData.cardExpYear;
        return data;
    }
}
