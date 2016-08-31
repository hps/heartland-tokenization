import {HPS} from "./HPS";

/**
 * @namespace Heartland.Styles
 */
export module Styles {
  /**
   * Heartland.Styles.Defaults
   *
   * Collection of helper functions for applying default styles to a child
   * window's fields. Serves as an example of these methods' use in merchant
   * modifications. Each function expects a `Heartland.HPS` object to be passed
   * as an argument.
   */
  export var Defaults = {
    body: function (hps: HPS) {
      hps.setStyle('heartland-body',
        'margin: 0;' +
        'font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;' +
        'color: #666;'
      );
    },
    cvv: function (hps: HPS) {
      hps.appendStyle('heartland-cvv', 'width: 110px;');
    },
    cvvContainer: function (hps: HPS) {
      hps.setStyle('heartland-cvv-container',
        'width: 110px;' +
        'display: inline-block;' +
        'float: left;'
      );
    },
    fieldset: function (hps: HPS) {
      hps.setStyle('heartland-expiration-date-container',
        'border: 0;' +
        'margin: 0 25px 0px 1px;' +
        'padding: 0;' +
        'width: 173px;' +
        'display: inline-block;' +
        'float:  left;'
      );
    },
    inputsAndSelects: function (hps: HPS) {
      var ids = [
        'heartland-card-number',
        'heartland-expiration-month',
        'heartland-expiration-year',
        'heartland-cvv'
      ];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'width: 309px;' +
          'padding: 5px;' +
          'font-size: 14px;' +
          'margin: 3px 0px 15px 0px;' +
          'border: 1px #ccc solid;' +
          /* IE10 Consumer Preview */
          'background-image: -ms-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Mozilla Firefox */
          'background-image: -moz-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Opera */
          'background-image: -o-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* Webkit (Safari/Chrome 10) */
          'background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0, #F7F7F7), color-stop(1, #EFEFEF));' +
          /* Webkit (Chrome 11+) */
          'background-image: -webkit-linear-gradient(bottom, #F7F7F7 0%, #EFEFEF 100%);' +
          /* W3C Markup, IE10 Release Preview */
          'background-image: linear-gradient(to top, #F7F7F7 0%, #EFEFEF 100%);'
        );
      }
    },
    labelsAndLegend: function (hps: HPS) {
      var ids = [
        'heartland-card-number-label',
        'heartland-expiration-date-legend',
        'heartland-expiration-month-label',
        'heartland-expiration-year-label',
        'heartland-cvv-label'
      ];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'font-size: 13px;' +
          'text-transform: uppercase;' +
          'font-weight: bold;' +
          'display: block;' +
          'width: 100%;' +
          'clear: both;'
        );
      }
    },
    selectLabels: function (hps: HPS) {
      var ids = ['heartland-expiration-month-label', 'heartland-expiration-year-label'];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.setStyle(ids[i],
          'position:absolute;' +
          'width:1px;' +
          'height:1px;' +
          'padding:0;' +
          'margin:-1px;' +
          'overflow:hidden;' +
          'clip:rect(0,0,0,0);' +
          'border:0;'
        );
      }
    },
    selects: function (hps: HPS) {
      var ids = ['heartland-expiration-month', 'heartland-expiration-year'];
      var i = 0, length = ids.length;
      for (i; i < length; i++) {
        hps.appendStyle(ids[i],
          'border: 0;' +
          'outline: 1px solid #ccc;' +
          'height: 28px;' +
          'width: 80px;' +
          '-webkit-appearance: none;' +
          '-moz-appearance: none;' +
          '-webkit-border-radius: 0px;' +
          /* tslint:disable:max-line-length */
          'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzA5MTZFN0RFMDY2MTFFNEIyODZFMURFRTA3REUxMjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzA5MTZFN0VFMDY2MTFFNEIyODZFMURFRTA3REUxMjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMDkxNkU3QkUwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMDkxNkU3Q0UwNjYxMUU0QjI4NkUxREVFMDdERTEyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvMrdUAAAABiSURBVHjaYkxLS3vNwMAgwoAfvGUCEjkMhEE285kzZ65u2bLlJ5DjgkNRxUwgYPz//z+Yl56ePhNIpaEpAqnJADGYkASzgHgnEn8HyEoYB24i1FReILUPynUEmvYFJgcQYACYah+uDhpKGAAAAABJRU5ErkJggg==);' +
          /* tslint:enable:max-line-length */
          'background-position: 65px 12px;' +
          'background-repeat: no-repeat;' +
          'background-color:  #F7F7F7;' +
          'float: left;' +
          'margin-right: 6px'
        );
      }
    }
  };
}
