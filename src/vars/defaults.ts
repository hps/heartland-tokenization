/// <reference path="../types/Options" />

module Heartland {
  export var defaults: Options = {
    _method: 'post',
    buttonTarget: '',
    cardCvv: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardNumber: '',
    cardType: '',
    env: 'prod',
    error: null,
    fields: [],
    formId: '',
    gatewayUrl: '',
    iframeTarget: '',
    ktb: '',
    object: 'token',
    onTokenError: null,
    onTokenSuccess: null,
    pinBlock: '',
    publicKey: '',
    success: null,
    targetType: '',
    tokenType: 'supt',
    track: '',
    trackNumber: '',
    type: 'pan',
    useDefaultStyles: true
  };
}
