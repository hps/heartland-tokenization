export interface Options {
    publicKey?: string;
    success?: Function;
    error?: Function;
    object?: string;
    tokenType?: string;
    _method?: string;
    cardNumber?: string;
    cardCvv?: string;
    cardExpMonth?: string;
    cardExpYear?: string;
    cardType?: string;
    formId?: string;
    track?: string;
    trackNumber?: string;
    ktb?: string;
    pinBlock?: string;
    type?: string;
    useDefaultStyles?: boolean;
    gatewayUrl?: string;
    env?: string;
    iframeTarget?: string;
    targetType?: string;
    fields?: any;
    buttonTarget?: string;
    onError?: Function;
    onEvent?: Function;
    onTokenSuccess?: Function;
    onTokenError?: Function;
    style?: Object;
    styleString?: string;
    cca?: {
        orderNumber?: string;
        jwt?: string;
    };
}
