/**********************************************************
IEWebGL support routines
You can copy, use, modify, distribute this file.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS

"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
**********************************************************/

var WebGLHelper = {

  'pluginInstallerURL': 'http://iewebgl.com/releases/iewebgl.exe',

  'splashScreen': '' +
      '<div style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:#e9e9e9">' +
          '<div style="height:45%"></div>' +
          '<div style="width:100%;text-align:center">' +
              '<p style="font-family:Verdana,Arial,sans-serif;font-size:12px;line-height:17px;color:#777777">' +
                  'MSG_TEXT' +
              '</p>' +
          '</div>' +
      '</div>',

  'manualLoadScreenMsg': 'Please install <a style="color:#497daf;" href="PLUGIN_INSTALL_URL">IEWebGL plugin</a> and refresh the page.',
  'notSupportWebGLMsg': 'Sorry, your browser does not support WebGL.<br/>Please install latest Firefox, Chrome or IEWebGL plugin.',
  'notSupportCanvasMsg': 'Your browser does not support &lt;canvas&.',

  'IsIE': function () {
    return navigator.userAgent.indexOf("MSIE") >= 0;
  },

  'GetGLContext': function (cnv, attributes) {
    var ctxNames = ["webgl", "experimental-webgl"];
    var glCtx = null;
    for (var i = 0; i < ctxNames.length && glCtx == null; ++i) {
      try {
        glCtx = cnv.getContext(ctxNames[i], attributes);
      }
      catch (e) { }
    }

    return glCtx;
  },

  'ShowMessage': function (el, text) {
    var s = WebGLHelper.splashScreen;
    s = s.replace("MSG_TEXT", text);
    try {
      el.innerHTML = s;
    }
    catch (e) { /* IE8 workaround */
      el.altHtml = s;
    }
  },

  'CreateNativeCanvas': function (element, id, replace, okHandler, failHandler) {
    try {
      var container = document.createElement("div");
      container.style.cssText = "position:relative;width:100%;height:100%";

      var cnv = document.createElement("canvas");
      container.appendChild(cnv);

      if (replace) {
        element.parentNode.replaceChild(container, element);
      }
      else {
        element.appendChild(container);
      }

      WebGLHelper.ShowMessage(cnv, WebGLHelper.notSupportCanvasMsg);

      cnv.id = id;
      if (okHandler) {
        okHandler(cnv, id);
      }
      return cnv;
    }
    catch (e) {
      if (failHandler) {
        failHandler(e, id);
      }
      return null;
    }
  },

  'CreatePluginCanvas': function (element, id, replace, okHandler, failHandler) {
    var container = document.createElement("div");
    container.style.cssText = "position:relative;width:100%;height:100%";

    var obj = document.createElement("object");

    if (replace) {
      element.parentNode.replaceChild(container, element);
    }
    else {
      element.appendChild(container);
    }

    WebGLHelper.ShowMessage(obj, WebGLHelper.manualLoadScreenMsg.replace("PLUGIN_INSTALL_URL", WebGLHelper.pluginInstallerURL));

    var loadTimeOverlay = container.childNodes[0];

    var showPlugin = function () {
      if (loadTimeOverlay && loadTimeOverlay.parentNode) {
        loadTimeOverlay.parentNode.removeChild(loadTimeOverlay);
      }
      obj.style.visibility = "visible";
    };

    var errorHandler = function (e) {
      showPlugin();
      obj.onreadystatechange = null;
      if (failHandler) {
        e.noPluginInstalled = true;
        failHandler(e, id);
      }
    }

    var successHandler = function () {
      showPlugin();
      if (okHandler)
        okHandler(obj, id);
    }

    container.appendChild(obj);

    obj.style.visibility = "hidden";
    obj.onreadystatechange = successHandler;
    obj.onerror = errorHandler;
    obj.id = id;
    obj.type = "application/x-webgl";
    return obj;
  },

  'CreateGLCanvas': function (el, id, replace, okHandler, failHandler) {
    if (WebGLHelper.IsIE()) {
      var usePlugin;
      try {
        usePlugin = WebGLRenderingContext.hasOwnProperty('iewebgl');
      } catch (e) {
        usePlugin = true;
      }

      if (usePlugin) {
        return WebGLHelper.CreatePluginCanvas(el, id, replace, okHandler, failHandler);
      }
      else {
        return WebGLHelper.CreateNativeCanvas(el, id, replace, okHandler, failHandler);
      }
    }
    else {
      return WebGLHelper.CreateNativeCanvas(el, id, replace, okHandler, failHandler);
    }
  },

  'CreateGLCanvasInline': function (id, okHandler, failHandler) {
    var placeHolder = document.getElementById("WebGLCanvasCreationScript");
    WebGLHelper.CreateGLCanvas(placeHolder, id, true, okHandler, failHandler);
  }
}