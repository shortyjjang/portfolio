// $.jStorage by Andris Reinman, andris.reinman@gmail.com
try{
(function(g){function m(){if(e.jStorage)try{d=n(""+e.jStorage)}catch(a){e.jStorage="{}"}else e.jStorage="{}";j=e.jStorage?(""+e.jStorage).length:0}function h(){try{e.jStorage=o(d),c&&(c.setAttribute("jStorage",e.jStorage),c.save("jStorage")),j=e.jStorage?(""+e.jStorage).length:0}catch(a){}}function i(a){if(!a||"string"!=typeof a&&"number"!=typeof a)throw new TypeError("Key name must be string or numeric");if("__jstorage_meta"==a)throw new TypeError("Reserved key name");return!0}function k(){var a,
b,c,e=Infinity,f=!1;clearTimeout(p);if(d.__jstorage_meta&&"object"==typeof d.__jstorage_meta.TTL){a=+new Date;c=d.__jstorage_meta.TTL;for(b in c)c.hasOwnProperty(b)&&(c[b]<=a?(delete c[b],delete d[b],f=!0):c[b]<e&&(e=c[b]));Infinity!=e&&(p=setTimeout(k,e-a));f&&h()}}if(!g||!g.toJSON&&!Object.toJSON&&!window.JSON)throw Error("jQuery, MooTools or Prototype needs to be loaded before jStorage!");var d={},e={jStorage:"{}"},c=null,j=0,o=g.toJSON||Object.toJSON||window.JSON&&(JSON.encode||JSON.stringify),
n=g.evalJSON||window.JSON&&(JSON.decode||JSON.parse)||function(a){return(""+a).evalJSON()},f=!1,p,l={isXML:function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?"HTML"!==a.nodeName:!1},encode:function(a){if(!this.isXML(a))return!1;try{return(new XMLSerializer).serializeToString(a)}catch(b){try{return a.xml}catch(d){}}return!1},decode:function(a){var b="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(a){var b=new ActiveXObject("Microsoft.XMLDOM");b.async=
"false";b.loadXML(a);return b};if(!b)return!1;a=b.call("DOMParser"in window&&new DOMParser||window,a,"text/xml");return this.isXML(a)?a:!1}};g.jStorage={version:"0.1.7.0",set:function(a,b,c){i(a);c=c||{};l.isXML(b)?b={_is_xml:!0,xml:l.encode(b)}:"function"==typeof b?b=null:b&&"object"==typeof b&&(b=n(o(b)));d[a]=b;isNaN(c.TTL)?h():this.setTTL(a,c.TTL);return b},get:function(a,b){i(a);return a in d?d[a]&&"object"==typeof d[a]&&d[a]._is_xml&&d[a]._is_xml?l.decode(d[a].xml):d[a]:"undefined"==typeof b?
null:b},deleteKey:function(a){i(a);return a in d?(delete d[a],d.__jstorage_meta&&("object"==typeof d.__jstorage_meta.TTL&&a in d.__jstorage_meta.TTL)&&delete d.__jstorage_meta.TTL[a],h(),!0):!1},setTTL:function(a,b){var c=+new Date;i(a);b=Number(b)||0;return a in d?(d.__jstorage_meta||(d.__jstorage_meta={}),d.__jstorage_meta.TTL||(d.__jstorage_meta.TTL={}),0<b?d.__jstorage_meta.TTL[a]=c+b:delete d.__jstorage_meta.TTL[a],h(),k(),!0):!1},flush:function(){d={};h();return!0},storageObj:function(){function a(){}
a.prototype=d;return new a},index:function(){var a=[],b;for(b in d)d.hasOwnProperty(b)&&"__jstorage_meta"!=b&&a.push(b);return a},storageSize:function(){return j},currentBackend:function(){return f},storageAvailable:function(){return!!f},reInit:function(){var a;if(c&&c.addBehavior){a=document.createElement("link");c.parentNode.replaceChild(a,c);c=a;c.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(c);c.load("jStorage");a="{}";try{a=c.getAttribute("jStorage")}catch(b){}e.jStorage=
a;f="userDataBehavior"}m()}};(function(){var a=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),a=!0,window.localStorage.removeItem("_tmptest")}catch(b){}if(a)try{window.localStorage&&(e=window.localStorage,f="localStorage")}catch(d){}else if("globalStorage"in window)try{window.globalStorage&&(e=window.globalStorage[window.location.hostname],f="globalStorage")}catch(g){}else if(c=document.createElement("link"),c.addBehavior){c.style.behavior="url(#default#userData)";
document.getElementsByTagName("head")[0].appendChild(c);c.load("jStorage");a="{}";try{a=c.getAttribute("jStorage")}catch(h){}e.jStorage=a;f="userDataBehavior"}else{c=null;return}m();k()})()})(window.$||window.jQuery);
}catch(e){ jQuery.jStorage = {get:function(){}, set:function(){}, deleteKey:function(){}, flush:function(){}, index:function(){} } }
