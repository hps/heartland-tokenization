/// <reference path="../types/Options" />

module Heartland {
  export var defaults: Options = {
    publicKey: '',
    success: null,
    error: null,
    object: 'token',
    tokenType: 'supt',
    _method: 'post',
    cardNumber: '',
    cardCvv: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardType: '',
    formId: '',
    track: '',
    trackNumber: '',
    ktb: '',
    pinBlock: '',
    type: 'pan',
    useDefaultStyles: true,
    gatewayUrl: '',
    env: 'prod',
    iframeTarget: '',
    targetType: '',
    fields: [],
    buttonTarget: '',
    onTokenSuccess: null,
    onTokenError: null
  };
}
