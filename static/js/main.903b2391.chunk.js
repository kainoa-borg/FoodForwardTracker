(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{25:function(e,t,a){e.exports=a(40)},33:function(e,t,a){},38:function(e,t,a){},39:function(e,t,a){},40:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(21),u=a.n(r),c=(a(33),a(2)),m=function(e){var t=Object(n.useState)(e.meals),a=Object(c.a)(t,2);a[0],a[1];return l.a.createElement("h1",null,"Meal Repository")},o=a(4),i=a(7),d=function(e){var t=e.text;return l.a.createElement("h4",null,t)},s=function(e){var t=Object(n.useState)(e.allergies),a=Object(c.a)(t,2),r=a[0],u=a[1],m=Object(n.useState)({aType:""}),d=Object(c.a)(m,2),s=d[0],p=d[1],g=Object(n.useState)(null),h=Object(c.a)(g,2),E=(h[0],h[1],Object(n.useState)(e.isEditable)),_=Object(c.a)(E,2),f=_[0];_[1];Object(n.useEffect)(function(){u(e.allergies)},[e.allergies]);var b=function(e){return e.length>0?["a_flag",!0]:["a_flag",!1]};return f?l.a.createElement(n.Fragment,null,l.a.createElement("table",null,l.a.createElement("tbody",null,r.map(function(t,a){return l.a.createElement(n.Fragment,null,l.a.createElement("tr",{key:a},l.a.createElement("td",null,t.a_type),l.a.createElement("td",null,l.a.createElement("button",{type:"button",onClick:function(){!function(t){var a=t,n=Object(i.a)(r);n.splice(a,1),u(n);var l=b(n);e.updateEditForm(["allergies",l[0]],[n,l[1]])}(a)}},"delete"))))}),l.a.createElement("tr",null,l.a.createElement("td",null,l.a.createElement("input",{name:"aType",type:"text",onChange:function(e){var t=e.target.getAttribute("name"),a="checkbox"===e.target.type?e.target.checked:e.target.value,n=Object(o.a)({},s);n[t]=a,p(n)},value:s.aType})),l.a.createElement("td",null,l.a.createElement("button",{type:"button",onClick:function(t){t.preventDefault();var a=[].concat(Object(i.a)(r),[s]);u(a),p({a_type:""});var n=b(a);console.log(n),e.updateEditForm(["allergies",n[0]],[a,n[1]])}},"Add")))))):l.a.createElement(n.Fragment,null,l.a.createElement("table",null,l.a.createElement("tbody",null,r.map(function(e,t){return l.a.createElement(n.Fragment,null,l.a.createElement("tr",{key:t},l.a.createElement("td",null,e.a_type)))}))))},p=function(e){var t=Object(n.useState)({hh_name:"",num_adult:0,num_child:0,veg_flag:!1,gf_flag:!1,a_flag:!1,sms_flag:!1,paused_flag:!1,phone:"",street:"",city:"",pcode:"",delivery_notes:"",state:"MI",hh_allergies:[]}),a=Object(c.a)(t,2),r=a[0],u=a[1],m=function(e,t){for(var a=Object(o.a)({},r),n=0;n<e.length;n++)a[e[n]]=t[n],console.log("("+e[n]+", "+t[n]+")",a.aFlag);u(a)},i=function(e){var t=e.target.getAttribute("name"),a="checkbox"===e.target.type?e.target.checked:e.target.value;m([t],[a])};return l.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.addHousehold(r),u({hh_name:"",num_adult:0,num_child:0,veg_flag:!1,gf_flag:!1,a_flag:!1,sms_flag:!1,paused_flag:!1,phone:"",street:"",city:"",pcode:"",delivery_notes:"",state:"MI",hh_allergies:[]})}},l.a.createElement("label",{htmlFor:"hh_name"},"Name: "),l.a.createElement("input",{name:"hh_name",id:"hh_name",type:"text",maxLength:"30",required:!0,value:r.hh_name,onChange:i}),l.a.createElement("label",{htmlFor:"num_adult"},"Number of Adults: "),l.a.createElement("input",{name:"num_adult",id:"num_adult",type:"number",value:r.num_adult,onChange:i}),l.a.createElement("label",{htmlFor:"num_child"},"Number of Children: "),l.a.createElement("input",{name:"num_child",id:"num_child",type:"number",value:r.num_child,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"veg_flag"},"Vegan/Vegetarian: "),l.a.createElement("input",{name:"veg_flag",id:"veg_flag",type:"checkbox",checked:r.veg_flag,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"gf_flag"},"Gluten Free: "),l.a.createElement("input",{name:"gf_flag",id:"gf_flag",type:"checkbox",checked:r.gf_flag,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"a_flag"},"Allergy: "),l.a.createElement("input",{name:"a_flag",id:"a_flag",type:"checkbox",checked:r.a_flag,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"sms_flag"},"Recieving SMS: "),l.a.createElement("input",{name:"sms_flag",id:"sms_flag",type:"checkbox",checked:r.sms_flag,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"paused_flag"},"Is Paused: "),l.a.createElement("input",{name:"paused_flag",id:"paused_flag",type:"checkbox",checked:r.paused_flag,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",{htmlFor:"phone"},"Phone Number: "),l.a.createElement("input",{name:"phone",id:"phone",type:"tel",pattern:"[0-9]{3}-[0-9]{3}-[0-9]{4}",minLength:"12",maxLength:"12",value:r.phone,onChange:i}),l.a.createElement("label",{htmlFor:"street"},"Street: "),l.a.createElement("input",{name:"street",id:"street",maxLength:"50",value:r.street,onChange:i}),l.a.createElement("label",{htmlFor:"city"},"City: "),l.a.createElement("input",{name:"city",id:"city",maxLength:"50",value:r.city,onChange:i}),l.a.createElement("label",{htmlFor:"pcode"},"Postal Code: "),l.a.createElement("input",{name:"pcode",id:"pcode",minLength:"5",maxLength:"5",value:r.pcode,onChange:i}),l.a.createElement("label",{htmlFor:"state"},"State: "),l.a.createElement("input",{name:"state",id:"state",minLength:"2",maxLength:"2",value:r.state,onChange:i}),l.a.createElement("label",{htmlFor:"delivery_notes"},"Delivery Notes: "),l.a.createElement("textarea",{name:"delivery_notes",id:"delivery_notes",maxLength:"255",value:r.delivery_notes,onChange:i}),l.a.createElement("br",null),l.a.createElement("label",null,"Allergies"),l.a.createElement(s,{allergies:r.hh_allergies,isEditable:!0,updateEditForm:m}),l.a.createElement("button",{type:"Submit"},"Add"))},g=a(8),h=function(e){var t=e.handlePageClick,a=Object(n.useState)({username:"",password:""}),r=Object(c.a)(a,2),u=r[0],m=r[1],i=function(e){var t=e.target.name,a=e.target.value,n=Object(o.a)({},u);n[t]=a,m(n)};return l.a.createElement(n.Fragment,null,l.a.createElement("h3",null,"Login Page"),l.a.createElement("form",{onSubmit:function(e){e.preventDefault(),Object(g.a)({method:"POST",url:"",data:u}).then(function(e){var t=e.data;console.log(t)}).catch(function(e){e.response&&(console.log(e.response),console.log(e.response.status),console.log(e.response.headers))}),t("landing")}},l.a.createElement("label",{htmlFor:"username"},"Username: "),l.a.createElement("input",{type:"text",maxLength:"30",name:"username",value:u.username,onChange:i}),l.a.createElement("label",{htmlFor:"username"},"Password: "),l.a.createElement("input",{type:"password",maxLength:"30",name:"password",value:u.password,onChange:i}),l.a.createElement("button",{type:"Submit"},"Login")))},E=function(e){var t=e.thisKey,a=e.editFormData,n=e.updateHousehold,r=e.handleEditFormChange,u=e.handleCancelClick,c=e.updateAllergies,m=e.updateEditForm,o=a,i=t;return l.a.createElement("tr",{key:i},l.a.createElement("td",null,l.a.createElement("input",{type:"text",name:"hh_name",defaultValue:o.hh_name,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{type:"number",name:"num_adult",defaultValue:o.num_adult,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{type:"number",name:"num_child",defaultValue:o.num_child,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"veg_flag",type:"checkbox",checked:o.veg_flag,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"gf_flag",type:"checkbox",checked:o.gf_flag,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"a_flag",type:"checkbox",checked:o.a_flag,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"sms_flag",type:"checkbox",checked:o.sms_flag,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"paused_flag",type:"checkbox",checked:o.paused_flag,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"phone",type:"tel",pattern:"[0-9]{3}-[0-9]{3}-[0-9]{4}",minLength:"12",maxLength:"12",defaultValue:o.phone,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"street",type:"text",defaultValue:o.street,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"city",type:"text",defaultValue:o.city,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"pcode",type:"number",minLength:"5",maxLength:"5",defaultValue:o.pcode,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"state",type:"text",minLength:"2",maxLength:"2",defaultValue:o.state,onChange:r})),l.a.createElement("td",null,l.a.createElement("textarea",{name:"deliveryNotes",defaultValue:o.delivery_notes,onChange:r})),l.a.createElement("td",null,l.a.createElement(s,{allergies:o.hh_allergies,isEditable:!0,updateAllergies:c,updateEditForm:m})),l.a.createElement("td",null),l.a.createElement("td",null,l.a.createElement("button",{type:"Submit",onClick:function(){n(i)}},"Save")),l.a.createElement("td",null,l.a.createElement("button",{onClick:u},"Cancel")))},_=function(e){var t=e.thisKey,a=e.household,n=e.deleteHousehold,r=e.handleEditClick,u=t,c=a;return l.a.createElement("tr",{key:u},l.a.createElement("td",null,c.hh_name),l.a.createElement("td",null,c.num_adult),l.a.createElement("td",null,c.num_child),l.a.createElement("td",null,String(Boolean(c.veg_flag))),l.a.createElement("td",null,String(Boolean(c.gf_flag))),l.a.createElement("td",null,String(Boolean(c.a_flag))),l.a.createElement("td",null,String(Boolean(c.sms_flag))),l.a.createElement("td",null,String(Boolean(c.paused_flag))),l.a.createElement("td",null,c.phone),l.a.createElement("td",null,c.street),l.a.createElement("td",null,c.city),l.a.createElement("td",null,c.pcode),l.a.createElement("td",null,c.state),l.a.createElement("td",null,c.delivery_notes),l.a.createElement("td",null,l.a.createElement(s,{allergies:c.hh_allergies,isEditable:!1})),l.a.createElement("td",null,l.a.createElement("button",{onClick:function(){return r(u)}},"Edit")),l.a.createElement("td",null,l.a.createElement("button",{onClick:function(){return n(u)}},"Delete")))},f=function(e){var t=e.text;return l.a.createElement("h3",{style:{color:"red"}},t)};a(38);function b(){var e=Object(n.useState)(void 0),t=Object(c.a)(e,2),a=t[0],r=t[1],u=Object(n.useState)(null),m=Object(c.a)(u,2),s=m[0],h=m[1],b=Object(n.useState)(null),y=Object(c.a)(b,2),v=y[0],C=y[1],k=Object(n.useState)(null),F=Object(c.a)(k,2),O=F[0],x=F[1],S=Object(n.useState)(null),j=Object(c.a)(S,2),A=j[0],N=j[1],L=function(){x(null)};Object(n.useEffect)(function(){r(D())},[]);var D=function(){console.log("MAKING REQUEST TO DJANGO"),Object(g.a)({method:"GET",url:"http://4.236.185.213:8000/api/households-allergies"}).then(function(e){var t=e.data;r(t)}).catch(function(e){e.response&&(console.log(e.response),console.log(e.response.status),console.log(e.response.headers))})},I=function(e){var t=e,n=Object(i.a)(a);n.splice(t,1),r(n)},P=function(e){a[e];var t=Object(i.a)(a);t[e]=v,h(null),r(t),L()},T=function(e){var t=e.target.getAttribute("name"),a="checkbox"===e.target.type?e.target.checked:e.target.value,n=Object(o.a)({},v);n[t]=a,C(n)},q=function(e,t){for(var a=Object(o.a)({},v),n=0;n<e.length;n++)a[e[n]]=t[n],console.log("("+e[n]+", "+t[n]+")",a.a_flag);C(a)},B=function(e){h(e),C(a[e])},H=function(){h(null),C(null)};return void 0===a?l.a.createElement(l.a.Fragment,null,"loading"):l.a.createElement("div",{className:"table-div"},l.a.createElement("table",{className:"main-table"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Name"),l.a.createElement("th",null,"# Adults"),l.a.createElement("th",null,"# Children"),l.a.createElement("th",null,"Vegan"),l.a.createElement("th",null,"Gluten Free"),l.a.createElement("th",null,"Allergies"),l.a.createElement("th",null,"Receive SMS"),l.a.createElement("th",null,"Paused"),l.a.createElement("th",null,"Phone Number"),l.a.createElement("th",null,"Street"),l.a.createElement("th",null,"City"),l.a.createElement("th",null,"Postal Code"),l.a.createElement("th",null,"State"),l.a.createElement("th",null,"Delivery Notes"),l.a.createElement("th",null,"Allergies"))),l.a.createElement("tbody",null,a.map(function(e,t){var a=t;return l.a.createElement(n.Fragment,null,s===a?l.a.createElement(E,{thisKey:a,editFormData:v,updateHousehold:P,handleEditFormChange:T,updateEditForm:q,handleCancelClick:H}):l.a.createElement(_,{thisKey:a,household:e,deleteHousehold:I,handleEditClick:B}))}))),l.a.createElement("h3",null,"Add A Household"),l.a.createElement(p,{addHousehold:function(e){if(a.find(function(t){return t.hh_name===e.hh_name}))x(l.a.createElement(f,{text:"Household Name already found!"}));else{var t=[].concat(Object(i.a)(a),[e]);r(t),L()}}}),l.a.createElement("button",{onClick:function(){console.log(a),Object(g.a)({method:"POST",url:"http://4.236.185.213:8000/api/households-allergies",data:a}).then(function(e){D()}).catch(function(e){e.response&&(console.log(e.response),console.log(e.response.status),console.log(e.response.headers))}),N(l.a.createElement(d,{msg:"Submitting changes to database!"}))}},"Submit Changes"),O,A)}var y=function(e){var t=Object(n.useState)({i_id:null,ingredient_name:"",pkg_type:"",storage_type:"",in_date:"",in_qty:null,unit:null,exp_date:null,qty_on_hand:null,unit_cost:null,flat_fee:null,isupplier_name:null,pref_isupplier_name:null}),a=Object(c.a)(t,2),r=a[0],u=a[1],m=Object(n.useState)([{s_id:1,supplier_name:"Second Harvest Food Bank"},{s_id:2,supplier_name:"Third Harvest Food Bank"}]),i=Object(c.a)(m,2),d=i[0],s=(i[1],function(e){!function(e,t){for(var a=Object(o.a)({},r),n=0;n<e.length;n++)a[e[n]]=t[n],console.log("("+e[n]+", "+t[n]+")");u(a)}([e.target.getAttribute("name")],["checkbox"===e.target.type?e.target.checked:e.target.value])});return l.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.addIngredient(r),u({i_id:null,ingredient_name:"",pkg_type:"",storage_type:"",in_date:"",in_qty:null,unit:null,exp_date:null,qty_on_hand:null,unit_cost:null,flat_fee:null,isupplier_name:null,pref_isupplier_name:null})}},l.a.createElement("label",{htmlFor:"ingredient_name"},"Ingredient Name: "),l.a.createElement("input",{name:"ingredient_name",type:"text",maxLength:"30",value:r.ingredient_name,onChange:s}),l.a.createElement("label",{htmlFor:"pkg_type"},"Package Type: "),l.a.createElement("input",{name:"pkg_type",type:"text",value:r.pkg_type,onChange:s}),l.a.createElement("label",{htmlFor:"storage_type"},"Storage Type: "),l.a.createElement("input",{name:"storage_type",type:"text",value:r.storage_type,onChange:s}),l.a.createElement("label",{htmlFor:"in_date"},"In Date: "),l.a.createElement("input",{name:"in_date",type:"date",value:r.in_date,onChange:s}),l.a.createElement("label",{htmlFor:"in_qty"},"In Quantity: "),l.a.createElement("input",{name:"in_qty",type:"number",value:r.in_qty,onChange:s}),l.a.createElement("label",{htmlFor:"unit"},"Unit: "),l.a.createElement("input",{name:"unit",type:"text",value:r.unit,onChange:s}),l.a.createElement("label",{htmlFor:"exp_date"},"Exp Date: "),l.a.createElement("input",{name:"exp_date",type:"date",value:r.exp_date,onChange:s}),l.a.createElement("label",{htmlFor:"unit_cost"},"Unit Cost: "),l.a.createElement("input",{name:"unit_cost",type:"number",step:"0.01",value:r.unit_cost,onChange:s}),l.a.createElement("label",{htmlFor:"flat_fee"},"Flat Fee: "),l.a.createElement("input",{name:"flat_fee",type:"number",step:"0.01",value:r.flat_fee,onChange:s}),l.a.createElement("label",{htmlFor:"exp_date"},"Exp Date: "),l.a.createElement("input",{name:"exp_date",type:"date",value:r.exp_date,onChange:s}),l.a.createElement("label",{htmlFor:"isupplier"},"Supplier: "),l.a.createElement("select",{name:"isupplier_id",onChange:s},l.a.createElement("option",{selected:"true"},"N/A"),d.map(function(e,t){return l.a.createElement("option",{name:"isupplier_id",value:e.s_id},e.supplier_name)})),l.a.createElement("label",{htmlFor:"pref_isupplier"},"Supplier: "),l.a.createElement("select",{name:"pref_isupplier_id"},l.a.createElement("option",{selected:"true"},"N/A"),d.map(function(e,t){return l.a.createElement("option",{value:e.s_id},e.supplier_name)})),l.a.createElement("button",{type:"Submit"},"Add"))},v=function(e){var t=e.thisKey,a=e.editFormData,n=e.updateIngredient,r=e.handleEditFormChange,u=e.handleCancelClick,c=(e.updateAllergies,e.updateEditForm,a),m=t;return l.a.createElement("tr",{key:m},l.a.createElement("td",null,c.i_id),l.a.createElement("td",null,l.a.createElement("input",{name:"ingredient_name",type:"text",maxLength:"30",value:c.ingredient_name,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"pkg_type",type:"text",value:c.pkg_type,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"storage_type",type:"text",value:c.storage_type,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"in_date",type:"date",placeholder:c.in_date,value:c.in_date,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"in_qty",type:"number",value:c.in_qty,onChange:r})),l.a.createElement("td",null,"placeholder"),l.a.createElement("td",null,l.a.createElement("input",{name:"unit",type:"text",value:c.unit,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"exp_date",type:"date",value:c.exp_date,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"unit_cost",type:"number",step:"0.01",value:c.unit_cost,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"flat_fee",type:"number",step:"0.01",value:c.flat_fee,onChange:r})),l.a.createElement("td",null,l.a.createElement("input",{name:"exp_date",type:"date",value:c.exp_date,onChange:r})),l.a.createElement("td",null,l.a.createElement("button",{onClick:function(){n(m)}},"Save")),l.a.createElement("td",null,l.a.createElement("button",{onClick:u},"Cancel")))},C=function(e){var t=e.thisKey,a=e.ingredient,n=e.deleteIngredient,r=e.handleEditClick,u=t,c=a;return l.a.createElement("tr",{key:u},l.a.createElement("td",null,c.i_id),l.a.createElement("td",null,c.ingredient_name),l.a.createElement("td",null,c.pkg_type),l.a.createElement("td",null,c.storage_type),l.a.createElement("td",null,String(c.in_date)),l.a.createElement("td",null,String(c.in_qty)),l.a.createElement("td",null,"placeholder"),l.a.createElement("td",null,c.qty_on_hand),l.a.createElement("td",null,String(c.unit)),l.a.createElement("td",null,String(c.unit_cost)),l.a.createElement("td",null,String(c.flat_fee)),l.a.createElement("td",null,c.exp_date),l.a.createElement("td",null,c.isupplier_name),l.a.createElement("td",null,c.pref_isupplier_name),l.a.createElement("td",null,l.a.createElement("button",{onClick:function(){return r(u)}},"Edit")),l.a.createElement("td",null,l.a.createElement("button",{onClick:function(){return n(u)}},"Delete")))};a(39);function k(){var e=Object(n.useState)([{i_id:1,ingredient_name:"Lasagna Noodles",pkg_type:"DRY-BAG",storage_type:"N/A",in_date:"11/20/22",in_qty:10,unit:"lbs",exp_date:"11-20-24",qty_on_hand:10,unit_cost:.75,flat_fee:0,isupplier_name:"Second Harvest Food Bank",pref_isupplier_name:"N/A",usages:[]},{i_id:2,ingredient_name:"Ground Beef",pkg_type:"FROZEN",storage_type:"N/A",in_date:"11/11/22",in_qty:2,unit:"lbs",exp_date:"12-7-22",qty_on_hand:2,unit_cost:.75,flat_fee:0,isupplier_name:"Second Harvest Food Bank",pref_isupplier_name:"N/A",usages:[]},{i_id:3,ingredient_name:"Ground Beef",pkg_type:"FROZEN",storage_type:"N/A",in_date:"11/20/22",in_qty:5,unit:"lbs",exp_date:"12-7-22",qty_on_hand:5,unit_cost:.75,flat_fee:0,isupplier_name:"Second Harvest Food Bank",pref_isupplier_name:"N/A",usages:[{i_usage_id:1,used_date:"11/29/22",used_qty:2}]}]),t=Object(c.a)(e,2),a=t[0],r=t[1],u=Object(n.useState)(null),m=Object(c.a)(u,2),s=m[0],p=m[1],h=Object(n.useState)(null),E=Object(c.a)(h,2),_=E[0],b=E[1],k=Object(n.useState)(null),F=Object(c.a)(k,2),O=F[0],x=F[1],S=Object(n.useState)(null),j=Object(c.a)(S,2),A=j[0],N=j[1],L=function(){x(null)},D=function(e){var t=e,n=Object(i.a)(a);n.splice(t,1),r(n)},I=function(e){var t=a[e].i_id;if(a.find(function(e){return e.i_id===t})){var n=Object(i.a)(a);n[e]=_,p(null),r(n),L()}else"DuplicateKey"==="DuplicateKey"&&x(l.a.createElement(f,{text:"Ingredient ID already found!"}))},P=function(e){var t=e.target.getAttribute("name"),a="checkbox"===e.target.type?e.target.checked:e.target.value,n=Object(o.a)({},_);n[t]=a,b(n)},T=function(e,t){for(var a=Object(o.a)({},_),n=0;n<e.length;n++)a[e[n]]=t[n],console.log("("+e[n]+", "+t[n]+")",a.aFlag);b(a)},q=function(e){p(e),b(a[e])},B=function(){p(null),b(null)};return l.a.createElement("div",{class:"table-div"},l.a.createElement("table",{className:"main-table"},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"ID"),l.a.createElement("th",null,"Ingredient Name"),l.a.createElement("th",null,"Package Type"),l.a.createElement("th",null,"Storage Type"),l.a.createElement("th",null,"Date In"),l.a.createElement("th",null,"Qty In"),l.a.createElement("th",null,"Usages"),l.a.createElement("th",null,"Qty On Hand"),l.a.createElement("th",null,"Unit"),l.a.createElement("th",null,"Unit Cost"),l.a.createElement("th",null,"Flat Fee"),l.a.createElement("th",null,"Expiration Date"),l.a.createElement("th",null,"Supplier"),l.a.createElement("th",null,"Preferred Supplier"))),l.a.createElement("tbody",null,a.map(function(e,t){var a=t;return l.a.createElement(n.Fragment,null,s===a?l.a.createElement(v,{thisKey:a,editFormData:_,updateIngredient:I,handleEditFormChange:P,updateEditForm:T,handleCancelClick:B}):l.a.createElement(C,{thisKey:a,ingredient:e,deleteIngredient:D,handleEditClick:q}))}))),l.a.createElement("h3",null,"Add An Ingredient"),l.a.createElement(y,{addIngredient:function(e){var t=a[a.length-1].i_id;e.i_id=t+1;var n=[].concat(Object(i.a)(a),[e]);r(n),L()}}),l.a.createElement("button",{onClick:function(){Object(g.a)({method:"POST",url:"/ingredients/",data:a}).then(function(e){Object(g.a)({method:"GET",url:"/ingredients/"}).then(function(e){var t=e.data;r(t)}).catch(function(e){e.response&&(console.log(e.response),console.log(e.response.status),console.log(e.response.headers))})}).catch(function(e){e.response&&(console.log(e.response),console.log(e.response.status),console.log(e.response.headers))}),N(l.a.createElement(d,{msg:"Submitting changes to database!"}))}},"Submit Changes"),O,A)}var F=function(){var e=Object(n.useState)(),t=Object(c.a)(e,2),a=t[0],r=t[1],u=function e(t){console.log(t),"householdForm"===t?r(l.a.createElement(p,null)):"loginPage"===t?r(l.a.createElement(h,{handlePageClick:e})):"mealRepositoryTable"===t?r(l.a.createElement(m,null)):"households"===t?r(l.a.createElement(b,null)):"ingredients"===t?r(l.a.createElement(k,null)):"landing"===t?r(l.a.createElement(m,null)):"allergies"===t&&r(l.a.createElement(s,{allergies:[{aType:"Gluten"},{aType:"Peanut"}]}))};return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("h1",null,"Food Forward Tracker"),l.a.createElement("button",{onClick:function(){return u("loginPage")}},"Login Page"),l.a.createElement("button",{onClick:function(){return u("households")}},"Households"),l.a.createElement("button",{onClick:function(){return u("ingredients")}},"Ingredients"),a))},O=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,41)).then(function(t){var a=t.getCLS,n=t.getFID,l=t.getFCP,r=t.getLCP,u=t.getTTFB;a(e),n(e),l(e),r(e),u(e)})};u.a.createRoot(document.getElementById("root")).render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(F,null))),O()}},[[25,1,2]]]);
//# sourceMappingURL=main.903b2391.chunk.js.map