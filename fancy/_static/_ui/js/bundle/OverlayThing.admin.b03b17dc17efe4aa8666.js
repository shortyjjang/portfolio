(self.webpackChunkfancy=self.webpackChunkfancy||[]).push([[555],{6192:()=>{var e,t,o;function n(e){return new RegExp("(^|[ ;])"+e+"\\s*=\\s*([^\\s;]+)").test(document.cookie)?unescape(RegExp.$2):null}e=window.jQuery,window.XMLHttpRequest&&(t=new window.XMLHttpRequest),o=t&&"upload"in t&&"onprogress"in t.upload&&window.FileReader&&window.FormData?{ajaxFileUpload:function(t){new window.XMLHttpRequest;var o,r,a=new FileReader;t=e.extend({},e.ajaxSettings,t),o=e("#"+t.fileElementId),r=o[0].files[0],a.onload=function(a){var c=new FormData;c.append("csrfmiddlewaretoken",n("csrftoken")),c.append(o.attr("name"),r);var l={url:t.url,type:"POST",data:c,async:!0,cache:!1,processData:!1,contentType:!1,success:t.success||e.noop,error:t.error||e.noop,complete:t.complete||e.noop,xhr:function(){var o=e.ajaxSettings.xhr();return o.upload.onprogress=function(o){var n=0,r=o.loaded||o.position,a=o.total;o.lengthComputable&&(n=Math.ceil(r/a*100),(t.progress||e.noop)(n))},o}};t.dataType&&(l.dataType=t.dataType),e.ajax(l)},a.onerror=function(){t.error&&t.error(),t.complete&&t.complete()},a.readAsArrayBuffer(r)}}:{createUploadIframe:function(t,o){var n,r="jUploadFrame"+t;return n=e('<iframe id="'+r+'" name="'+r+'" />'),window.ActiveXObject&&("boolean"==typeof o?n[0].src="javascript:false":"string"==typeof o&&(n[0].src=o)),n.css({position:"absolute",top:-1e3,left:-1e3}).appendTo("body"),n},createUploadForm:function(t,o){var r="jUploadForm"+t,a="jUploadFile"+t,c="jUploadCSRF"+t,l=e('<form  action="" method="POST" name="'+r+'" id="'+r+'" enctype="multipart/form-data"></form>'),d=e("#"+o),u=d.clone(!0);d.attr("id",a).before(u).appendTo(l);var i=e("#"+c);return i.length||(i=e('<input type="hidden" id="'+c+'" name="csrfmiddlewaretoken">').appendTo(l)),i.val(n("csrftoken")),l.css({position:"absolute",top:-1e3,left:-1e3}).appendTo("body"),l},ajaxFileUpload:function(t){t=e.extend({},e.ajaxSettings,t);var o=(new Date).getTime(),n="jUploadFrame"+o,r=e.createUploadForm(o,t.fileElementId),a=e.createUploadIframe(o,t.secureuri);t.global&&!e.active++&&e.event.trigger("ajaxStart");var c=!1,l={};t.global&&e.event.trigger("ajaxSend",[l,t]);var d=function(o){var d=document.getElementById(n);try{d.contentWindow?(l.responseText=d.contentWindow.document.body?d.contentWindow.document.body.innerHTML:null,l.responseXML=d.contentWindow.document.XMLDocument?d.contentWindow.document.XMLDocument:d.contentWindow.document):d.contentDocument&&(l.responseText=d.contentDocument.document.body?d.contentDocument.document.body.innerHTML:null,l.responseXML=d.contentDocument.document.XMLDocument?d.contentDocument.document.XMLDocument:d.contentDocument.document)}catch(o){e.handleError(t,l,null,o)}if(l||"timeout"==o){var u;c=!0;try{if("error"!=(u="timeout"!=o?"success":"error")){var i=e.uploadHttpData(l,t.dataType);t.success&&t.success(i,u),t.global&&e.event.trigger("ajaxSuccess",[l,t])}else e.handleError(t,l,u)}catch(o){u="error",e.handleError(t,l,u,o)}t.global&&e.event.trigger("ajaxComplete",[l,t]),t.global&&!--jQuery.active&&e.event.trigger("ajaxStop"),t.complete&&t.complete(l,u),a.off(),setTimeout((function(){try{a.remove(),r.remove()}catch(o){e.handleError(t,l,null,o)}}),100),l=null}};t.timeout>0&&setTimeout((function(){c||d("timeout")}),t.timeout);try{r.attr({action:t.url,method:"POST",target:n,enctype:"multipart/form-data"}).submit()}catch(o){e.handleError(t,l,null,o)}return window.attachEvent?document.getElementById(n).attachEvent("onload",d):document.getElementById(n).addEventListener("load",d,!1),{abort:function(){}}},uploadHttpData:function(t,o){var n=o&&"xml"!=o?t.responseText:t.responseXML;return"script"==o&&e.globalEval(n),"json"==o&&(n=e.parseJSON(e(t.responseText).text())),"html"==o&&e("<div>").html(n).evalScripts(),n}},jQuery.extend(o),jQuery.handleError||jQuery.extend({handleError:function(t,o,n,r){t.error&&t.error.call(t.context||window,o,n,r),t.global&&(t.context?e(t.context):e.event).trigger("ajaxError",[o,t,r])}})}}]);
//# sourceMappingURL=OverlayThing.admin.b03b17dc17efe4aa8666.js.map