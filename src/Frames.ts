/// <reference path="vars/fields.ts" />
/// <reference path="vars/urls.ts" />
/// <reference path="Events.ts" />
/// <reference path="Messages.ts" />
/// <reference path="SecureSubmit.ts" />
/// <reference path="Styles.ts" />

module Heartland {
  export module Frames {
    // Heartland.Frames.configureIframe
    //
    // Prepares the pages iFrames for communication with the parent window.
    export function configureIframe(hps: HPS) {
      var frame: any;
      var options = hps.options;
      var target: HTMLElement;
      var useDefaultStyles = true;
      hps.Messages = hps.Messages || new Heartland.Messages(hps);

      if (options.env === 'cert') {
        hps.iframe_url = urls.iframeCERT;
      } else {
        hps.iframe_url = urls.iframePROD;
      }

      if (options.fields) {
        Heartland.Frames.makeFieldAndLink(hps);
      }

      if (options.iframeTarget) {
        frame = document.getElementById(options.iframeTarget);
        if (options.targetType === 'myframe') {
          frame = target;
          hps.iframe_url = frame.src;
        } else {
          frame = Heartland.DOM.makeFrame('securesubmit-iframe');
          target.appendChild(frame);
        }

        hps.iframe_url = hps.iframe_url + '#' + encodeURIComponent(document.location.href.split('#')[0]);
        frame.src = hps.iframe_url;

        hps.frames.child = {
          name: 'child',
          frame: window.postMessage ? frame.contentWindow : frame,
          url: hps.iframe_url
        };
      }

      if (options.useDefaultStyles === false) {
        useDefaultStyles = false;
      }

      if (options.buttonTarget) {
        Heartland.Events.addHandler(options.buttonTarget, 'click', function(e) {
          e.preventDefault();
          hps.Messages.post(
            {
              action: 'tokenize',
              message: options.publicKey,
              accumulateData: !!hps.frames.cardNumber
            },
            hps.frames.cardNumber ? 'cardNumber' : 'child'
            );
          return false;
        });
      }

      hps.Messages.receive(function(m: MessageEvent) {
        var fieldFrame: any;

        try {
          fieldFrame = hps.frames[m.source.name];
        } catch (e) { return; }

        switch (m.data.action) {
          case 'onTokenSuccess':
            options.onTokenSuccess(m.data.response);
            break;
          case 'onTokenError':
            options.onTokenError(m.data.response);
            break;
          case 'resize':
            if (fieldFrame) {
              hps.resizeIFrame(fieldFrame.frame, m.data.height);
            } else {
              hps.resizeIFrame(frame, m.data.height);
            }

            break;
          case 'receiveMessageHandlerAdded':
            if (!options.fields && useDefaultStyles) {
              Heartland.Styles.Defaults.body(hps);
              Heartland.Styles.Defaults.labelsAndLegend(hps);
              Heartland.Styles.Defaults.inputsAndSelects(hps);
              Heartland.Styles.Defaults.fieldset(hps);
              Heartland.Styles.Defaults.selects(hps);
              Heartland.Styles.Defaults.selectLabels(hps);
              Heartland.Styles.Defaults.cvvContainer(hps);
              Heartland.Styles.Defaults.cvv(hps);
            }

            if (fieldFrame && fieldFrame.options.placeholder) {
              hps.Messages.post(
                {
                  action: 'setPlaceholder',
                  id: 'heartland-field',
                  text: fieldFrame.options.placeholder
                },
                fieldFrame.name
                );
            }

            Heartland.Events.trigger('securesubmitIframeReady', document);
            break;
          case 'accumulateData':
            var i: string;
            var field: any;

            for (i in hps.frames) {
              if (i === 'cardNumber') continue;
              field = hps.frames[i];
              hps.Messages.post(
                {
                  action: 'getFieldData',
                  id: 'heartland-field'
                },
                field.name
                );
            }
            break;
          case 'passData':
            var cardNumberFieldFrame = hps.frames.cardNumber;
            if (!cardNumberFieldFrame) {
              break;
            }

            hps.Messages.post(
              {
                action: 'setFieldData',
                id: fieldFrame.name,
                value: m.data.value
              },
              cardNumberFieldFrame.name
              );
            break;
        }
      }, '*');


      // monitorFieldEvents(hps, )
    }

    // Heartland.Frames.makeFieldAndLink
    //
    // Creates a set of single field iFrames and stores a reference to
    // them in the parent window's state.
    export function makeFieldAndLink(hps: HPS) {
      var fieldsLength = fields.length;
      var baseUrl = hps.iframe_url.replace('index.html', '') + 'field.html';
      var options = hps.options;

      for (var i = 0; i < fieldsLength; i++) {
        var field = fields[i];
        var fieldOptions = options.fields[field];
        var frame = Heartland.DOM.makeFrame(field);
        var url = baseUrl + '#' + field + ':' + encodeURIComponent(document.location.href.split('#')[0]);
        frame.src = url;

        document
          .getElementById(fieldOptions.target)
          .appendChild(frame);

        hps.frames[field] = {
          name: field,
          frame: frame,
          options: fieldOptions,
          target: fieldOptions.target,
          targetNode: window.postMessage ? frame.contentWindow : frame,
          url: url
        };
      }
    }

    function monitorFieldEvents(hps: HPS, target: string | EventTarget) {
      var events = ['click', 'blur', 'focus', 'change', 'keypress', 'keydown', 'keyup'];
      var i = 0, length = events.length;
      var event: string;

      for (i; i < length; i++) {
        event = events[i];
        Heartland.Events.addHandler(target, event, function(e) {
          hps.Messages.post(
            {
              action: 'fieldEvent',
              event: event,
              eventData: e
            },
            'parent'
          )
        });
      }
    }
  }
}
