(self.webpackChunkfancy=self.webpackChunkfancy||[]).push([[117],{8117:(e,t,a)=>{"use strict";a.r(t),a.d(t,{setup:()=>Q});var n=a(7198),s=a(319),i=a.n(s),o=a(4575),r=a.n(o),l=a(3913),c=a.n(l),d=a(8585),u=a.n(d),m=a(9754),h=a.n(m),f=a(1506),p=a.n(f),g=a(2205),v=a.n(g),C=a(9713),y=a.n(C),k=a(7294),b=a(4184),w=a.n(b),L=a(6071),N=k.createElement("p",{className:"ltit"},"Add to collections"),S=k.createElement("button",{className:"ly-close",title:"Close"},k.createElement("i",{className:"ic-del-black"})),j=function(e){function t(){var e,a;r()(this,t);for(var s=arguments.length,o=new Array(s),l=0;l<s;l++)o[l]=arguments[l];return a=u()(this,(e=h()(t)).call.apply(e,[this].concat(o))),y()(p()(a),"state",{lists:[],listSearchQuery:"",listCreationQuery:"",listCreating:!1}),y()(p()(a),"handleDialogOpen",(function(){a.setState({lists:[],listSearchQuery:"",listCreationQuery:""}),a.drawUserList(),setTimeout((function(){a.listSearchInput.focus()}),0)})),y()(p()(a),"handleListSearch",(function(e){var t=e.target.value;a.setState({listSearchQuery:t})})),y()(p()(a),"handleListCreation",(function(e){if(e.preventDefault(),!a.state.listCreating&&("keyup"!==e.type||e.which===n.tW.ENTER)){var t=$.trim(a.state.listCreationQuery),s=a.props.objectId;(0,n.xb)(t)||(a.setState({listCreating:!0}),E({objectId:s,createList:t,callback:function(e,o){if(e){var r=a.state.lists;(0,n.MP)("Create New List",{"thing id":s,"list name":t,via:"thing detail"}),a.setState({listCreationQuery:"",listCreating:!1,lists:[].concat(i()(o),i()(r))})}}}))}})),y()(p()(a),"handleListItemToggle",(function(e){e.preventDefault(),e.stopPropagation();var t=e.currentTarget,s=a.props.objectId,i=a.state.lists,o=Number(t.getAttribute("data-listid")),r=i.filter((function(e){return e.id===o}))[0],l=r.added;r.added=!r.added;var c=r.added?"Add to List":"Remove from List";a.setState({lists:i});var d={objectId:s,callback:function(e,t){var i=a.state.lists;e||(i.filter((function(e){return e.id===o}))[0].added=l);a.setState({lists:i}),(0,n.MP)(c,{"thing id":s,"list name":r.name,"list id":r.id,via:"thing detail"})}};r.added?d.checked=[r.id]:d.unchecked=[r.id],E(d)})),y()(p()(a),"handleCreateListQueryChange",(function(e){a.setState({listCreationQuery:e.target.value})})),a}return v()(t,e),c()(t,[{key:"componentDidMount",value:function(){$.dialog(t.popupName).$obj.on("open",this.handleDialogOpen)}},{key:"componentDidUpdate",value:function(e,a){$.dialog(t.popupName).center()}},{key:"drawUserList",value:function(){var e=this;I({objectId:this.props.objectId,callback:function(t){e.setState(t)}})}},{key:"render",value:function(){var e=this,t=this.props.objectId,a=this.state,n=a.lists,s=a.listSearchQuery,i=a.listCreationQuery,o=a.listCreating;return k.createElement(k.Fragment,null,N,k.createElement("fieldset",{className:"search"},k.createElement("input",{type:"text",placeholder:"Search",className:"text",value:s,ref:function(t){e.listSearchInput=t},onChange:this.handleListSearch})),k.createElement("div",{className:"list"},k.createElement("ul",{ref:function(t){e.lists=t}},n&&n.map((function(a,n){var i,o=$.trim(s).toLowerCase();_.isString(o)&&o.length>0&&(i=L.sS.NoneIf(-1===a.name.toLowerCase().indexOf(o.toLowerCase())));"".concat(t,"-").concat(a.id);return k.createElement("li",{key:n,style:i,className:w()({added:a.added})},k.createElement("label",null,a.name),k.createElement("button",{"data-listid":a.id,onClick:e.handleListItemToggle,className:"btns-blue-embo"},a.added?"Remove":"Add"))})))),k.createElement("fieldset",{className:"create"},k.createElement("input",{type:"text",placeholder:"Create new collection",ref:function(t){e.quickCreateList=t},onKeyUp:this.handleListCreation,onChange:this.handleCreateListQueryChange,value:i}),k.createElement("button",{className:w()("btn-create",{loading:o}),style:L.sS.NoneIf(0==$.trim(i).length),onClick:this.handleListCreation},gettext("Create"))),S)}}]),t}(k.Component);function I(e){var t=e.objectId,a=e.callback;$.get("/get_list_checkbox.json",{tid:t}).done((function(e){0==e.status_code&&(n.Kf.alert(e.message||"Please try again later."),(0,n.j4)(j.popupName)),a&&a({lists:e.lists})})).error((function(e){n.Kf.alert("Please try again later."),console.warn(e),(0,n.j4)(j.popupName)}))}function E(e){var t=e.objectId,a=e.checked,s=e.unchecked,i=e.createList,o=e.callback,r={tid:t};a&&(r.add_list_ids=a.join(",")),s&&(r.remove_list_ids=s.join(",")),i&&(r.new_list=i),$.post("/update_list_checkbox.json",r).done((function(e){0==e.status_code?(n.Kf.alert(e.message||"Please try again later."),o(!1,null)):o(!0,e.lists)})).error((function(e){console.warn(e),n.Kf.alert("Please try again later."),o(!1,[])}))}y()(j,"popupName","add-list");function Q(){$((function(){$(document).on("click",".figure-item .menu-container .btn-more",(function(){var e=$(this),t=e.closest(".menu-container");if(t.hasClass("show-list")?t.removeClass("show-list"):t.hasClass("show-share")?t.removeClass("show-share"):t.hasClass("opened")?(t.removeClass("opened").closest("li").removeClass("active"),$(document.body).removeClass("show-more-share")):(t.addClass("opened").closest("li").addClass("active"),$(document.body).addClass("show-more-share")),!e.data("clickoutside")){var a=Math.random(),n="click.action-clickoutside-".concat(a);e.data("clickoutside",n),$(document).on(n,(function(a){if($(a.target).is(e)||$(a.target).closest(t).length)return!0;a.preventDefault(),a.stopPropagation(),e.closest(".menu-container.opened").removeClass("opened").closest("li").removeClass("active"),$(document.body).removeClass("show-more-share"),e.closest(".menu-container").removeClass("show-list"),$(document).off(n),e.data("clickoutside",null)}))}})).on("click",".figure-item .menu-container .add-list",(function(){if(!window.__FancyUser.loggedIn)return window.require_login(),!1;var e=$(this).closest("li").attr("tid");return(0,n.M6)(j,{objectId:e}),!1})).on("click",".figure-item .menu-container .copy-link",(function(){var e,t,a,s=$(this),i=s.closest(".figure-item").data("url");return e=i,t=window.__FancyUser.viewerUsername,a=s,(0,n.vQ)(function(e,t){var a="https://fancy.com".concat(e);if(t){var n=~a.indexOf("?")?"&":"?";a="".concat(a).concat(n,"ref=").concat(t)}return a}(e,t)),a.text("Link copied!"),setTimeout((function(){a.text("Copy link")}),2e3),!1})).on("click",".figure-item .menu-container .share",(function(){return $(this).closest(".menu-container").addClass("show-share"),!1})).on("click",".figure-item .menu-container .ly-close",(function(){return $(this).closest(".menu-container").removeClass("opened"),!1}))}))}}}]);
//# sourceMappingURL=117.42fb1145860943fe44a1.js.map