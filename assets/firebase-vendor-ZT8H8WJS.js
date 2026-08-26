import{R as gu}from"./vendor--MGgyLnx.js";const ty=()=>{};var Gh={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},ny=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],c=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},jf={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,c=o?r[s+1]:0,u=s+2<r.length,l=u?r[s+2]:0,f=i>>2,p=(i&3)<<4|c>>4;let g=(c&15)<<2|l>>6,R=l&63;u||(R=64,o||(g=64)),n.push(t[f],t[p],t[g],t[R])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray($f(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):ny(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],c=s<r.length?t[r.charAt(s)]:0;++s;const l=s<r.length?t[r.charAt(s)]:64;++s;const p=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||c==null||l==null||p==null)throw new ry;const g=i<<2|c>>4;if(n.push(g),l!==64){const R=c<<4&240|l>>2;if(n.push(R),p!==64){const C=l<<6&192|p;n.push(C)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class ry extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const sy=function(r){const e=$f(r);return jf.encodeByteArray(e,!0)},Oo=function(r){return sy(r).replace(/\./g,"")},zf=function(r){try{return jf.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iy=()=>Gf().__FIREBASE_DEFAULTS__,oy=()=>{if(typeof process>"u"||typeof Gh>"u")return;const r=Gh.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},ay=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&zf(r[1]);return e&&JSON.parse(e)},fa=()=>{try{return ty()||iy()||oy()||ay()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Kf=r=>{var e,t;return(t=(e=fa())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},cy=r=>{const e=Kf(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Wf=()=>{var r;return(r=fa())==null?void 0:r.config},Hf=r=>{var e;return(e=fa())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uy(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Oo(JSON.stringify(t)),Oo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ly(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ae())}function Yf(){var e;const r=(e=fa())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function hy(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function dy(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function fy(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function py(){const r=Ae();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Jf(){return!Yf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Xf(){return!Yf()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function Zf(){try{return typeof indexedDB=="object"}catch{return!1}}function my(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gy="FirebaseError";class jt extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=gy,Object.setPrototypeOf(this,jt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,vi.prototype.create)}}class vi{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?_y(i,n):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new jt(s,c,n)}}function _y(r,e){return r.replace(yy,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const yy=/\{\$([^}]+)}/g;function Iy(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function En(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(Kh(i)&&Kh(o)){if(!En(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function Kh(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Ms(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Fs(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function Ey(r,e){const t=new Ty(r,e);return t.subscribe.bind(t)}class Ty{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");wy(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=mc),s.error===void 0&&(s.error=mc),s.complete===void 0&&(s.complete=mc);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function wy(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function mc(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ss(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function _u(r){return(await fetch(r,{credentials:"include"})).ok}class or{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new Qf;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ry(e))try{this.getOrInitializeService({instanceIdentifier:jn})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=jn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jn){return this.instances.has(e)}getOptions(e=jn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Ay(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=jn){return this.component?this.component.multipleInstances?e:jn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ay(r){return r===jn?void 0:r}function Ry(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new vy(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var X;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(X||(X={}));const by={debug:X.DEBUG,verbose:X.VERBOSE,info:X.INFO,warn:X.WARN,error:X.ERROR,silent:X.SILENT},Sy=X.INFO,Vy={[X.DEBUG]:"log",[X.VERBOSE]:"log",[X.INFO]:"info",[X.WARN]:"warn",[X.ERROR]:"error"},Cy=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=Vy[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yu{constructor(e){this.name=e,this._logLevel=Sy,this._logHandler=Cy,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in X))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?by[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,X.DEBUG,...e),this._logHandler(this,X.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,X.VERBOSE,...e),this._logHandler(this,X.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,X.INFO,...e),this._logHandler(this,X.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,X.WARN,...e),this._logHandler(this,X.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,X.ERROR,...e),this._logHandler(this,X.ERROR,...e)}}const xy=(r,e)=>e.some(t=>r instanceof t);let Wh,Hh;function Dy(){return Wh||(Wh=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ny(){return Hh||(Hh=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ep=new WeakMap,Nc=new WeakMap,tp=new WeakMap,gc=new WeakMap,Iu=new WeakMap;function ky(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(fn(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ep.set(t,r)}).catch(()=>{}),Iu.set(e,r),e}function Oy(r){if(Nc.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});Nc.set(r,e)}let kc={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Nc.get(r);if(e==="objectStoreNames")return r.objectStoreNames||tp.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return fn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Ly(r){kc=r(kc)}function My(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(_c(this),e,...t);return tp.set(n,e.sort?e.sort():[e]),fn(n)}:Ny().includes(r)?function(...e){return r.apply(_c(this),e),fn(ep.get(this))}:function(...e){return fn(r.apply(_c(this),e))}}function Fy(r){return typeof r=="function"?My(r):(r instanceof IDBTransaction&&Oy(r),xy(r,Dy())?new Proxy(r,kc):r)}function fn(r){if(r instanceof IDBRequest)return ky(r);if(gc.has(r))return gc.get(r);const e=Fy(r);return e!==r&&(gc.set(r,e),Iu.set(e,r)),e}const _c=r=>Iu.get(r);function Uy(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),c=fn(o);return n&&o.addEventListener("upgradeneeded",u=>{n(fn(o.result),u.oldVersion,u.newVersion,fn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const By=["get","getKey","getAll","getAllKeys","count"],qy=["put","add","delete","clear"],yc=new Map;function Qh(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(yc.get(e))return yc.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=qy.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||By.includes(t)))return;const i=async function(o,...c){const u=this.transaction(o,s?"readwrite":"readonly");let l=u.store;return n&&(l=l.index(c.shift())),(await Promise.all([l[t](...c),s&&u.done]))[0]};return yc.set(e,i),i}Ly(r=>({...r,get:(e,t,n)=>Qh(e,t)||r.get(e,t,n),has:(e,t)=>!!Qh(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(jy(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function jy(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Oc="@firebase/app",Yh="0.15.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot=new yu("@firebase/app"),zy="@firebase/app-compat",Gy="@firebase/analytics-compat",Ky="@firebase/analytics",Wy="@firebase/app-check-compat",Hy="@firebase/app-check",Qy="@firebase/auth",Yy="@firebase/auth-compat",Jy="@firebase/database",Xy="@firebase/data-connect",Zy="@firebase/database-compat",eI="@firebase/functions",tI="@firebase/functions-compat",nI="@firebase/installations",rI="@firebase/installations-compat",sI="@firebase/messaging",iI="@firebase/messaging-compat",oI="@firebase/performance",aI="@firebase/performance-compat",cI="@firebase/remote-config",uI="@firebase/remote-config-compat",lI="@firebase/storage",hI="@firebase/storage-compat",dI="@firebase/firestore",fI="@firebase/ai",pI="@firebase/firestore-compat",mI="firebase",gI="12.15.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lc="[DEFAULT]",_I={[Oc]:"fire-core",[zy]:"fire-core-compat",[Ky]:"fire-analytics",[Gy]:"fire-analytics-compat",[Hy]:"fire-app-check",[Wy]:"fire-app-check-compat",[Qy]:"fire-auth",[Yy]:"fire-auth-compat",[Jy]:"fire-rtdb",[Xy]:"fire-data-connect",[Zy]:"fire-rtdb-compat",[eI]:"fire-fn",[tI]:"fire-fn-compat",[nI]:"fire-iid",[rI]:"fire-iid-compat",[sI]:"fire-fcm",[iI]:"fire-fcm-compat",[oI]:"fire-perf",[aI]:"fire-perf-compat",[cI]:"fire-rc",[uI]:"fire-rc-compat",[lI]:"fire-gcs",[hI]:"fire-gcs-compat",[dI]:"fire-fst",[pI]:"fire-fst-compat",[fI]:"fire-vertex","fire-js":"fire-js",[mI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=new Map,yI=new Map,Mc=new Map;function Jh(r,e){try{r.container.addComponent(e)}catch(t){Ot.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Ur(r){const e=r.name;if(Mc.has(e))return Ot.debug(`There were multiple attempts to register component ${e}.`),!1;Mc.set(e,r);for(const t of Lo.values())Jh(t,r);for(const t of yI.values())Jh(t,r);return!0}function pa(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function st(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const II={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pn=new vi("app","Firebase",II);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EI{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new or("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is=gI;function TI(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:Lc,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw pn.create("bad-app-name",{appName:String(s)});if(t||(t=Wf()),!t)throw pn.create("no-options");const i=Lo.get(s);if(i){if(En(t,i.options)&&En(n,i.config))return i;throw pn.create("duplicate-app",{appName:s})}const o=new Py(s);for(const u of Mc.values())o.addComponent(u);const c=new EI(t,n,o);return Lo.set(s,c),c}function np(r=Lc){const e=Lo.get(r);if(!e&&r===Lc&&Wf())return TI();if(!e)throw pn.create("no-app",{appName:r});return e}function mn(r,e,t){let n=_I[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ot.warn(o.join(" "));return}Ur(new or(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wI="firebase-heartbeat-database",vI=1,ni="firebase-heartbeat-store";let Ic=null;function rp(){return Ic||(Ic=Uy(wI,vI,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ni)}catch(t){console.warn(t)}}}}).catch(r=>{throw pn.create("idb-open",{originalErrorMessage:r.message})})),Ic}async function AI(r){try{const t=(await rp()).transaction(ni),n=await t.objectStore(ni).get(sp(r));return await t.done,n}catch(e){if(e instanceof jt)Ot.warn(e.message);else{const t=pn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ot.warn(t.message)}}}async function Xh(r,e){try{const n=(await rp()).transaction(ni,"readwrite");await n.objectStore(ni).put(e,sp(r)),await n.done}catch(t){if(t instanceof jt)Ot.warn(t.message);else{const n=pn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Ot.warn(n.message)}}}function sp(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RI=1024,PI=30;class bI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new VI(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Zh();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>PI){const o=CI(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){Ot.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Zh(),{heartbeatsToSend:n,unsentEntries:s}=SI(this._heartbeatsCache.heartbeats),i=Oo(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Ot.warn(t),""}}}function Zh(){return new Date().toISOString().substring(0,10)}function SI(r,e=RI){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),ed(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ed(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class VI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Zf()?my().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await AI(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Xh(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Xh(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function ed(r){return Oo(JSON.stringify({version:2,heartbeats:r})).length}function CI(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xI(r){Ur(new or("platform-logger",e=>new $y(e),"PRIVATE")),Ur(new or("heartbeat",e=>new bI(e),"PRIVATE")),mn(Oc,Yh,r),mn(Oc,Yh,"esm2020"),mn("fire-js","")}xI("");function ip(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const DI=ip,op=new vi("auth","Firebase",ip());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo=new yu("@firebase/auth");function NI(r,...e){Mo.logLevel<=X.WARN&&Mo.warn(`Auth (${is}): ${r}`,...e)}function Io(r,...e){Mo.logLevel<=X.ERROR&&Mo.error(`Auth (${is}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(r,...e){throw Eu(r,...e)}function wt(r,...e){return Eu(r,...e)}function ap(r,e,t){const n={...DI(),[e]:t};return new vi("auth","Firebase",n).create(e,{appName:r.name})}function Dt(r){return ap(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Eu(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return op.create(r,...e)}function G(r,e,...t){if(!r)throw Eu(e,...t)}function Ct(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Io(e),new Error(e)}function Lt(r,e){r||Ct(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fc(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function kI(){return td()==="http:"||td()==="https:"}function td(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(kI()||dy()||"connection"in navigator)?navigator.onLine:!0}function LI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{constructor(e,t){this.shortDelay=e,this.longDelay=t,Lt(t>e,"Short delay should be less than long delay!"),this.isMobile=ly()||fy()}get(){return OI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tu(r,e){Lt(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ct("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ct("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ct("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],UI=new Ri(3e4,6e4);function zt(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function Gt(r,e,t,n,s={}){return up(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const c=Ai({...o,key:r.config.apiKey}).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const l={method:e,headers:u,...i};return hy()||(l.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&ss(r.emulatorConfig.host)&&(l.credentials="include"),cp.fetch()(await lp(r,r.config.apiHost,t,c),l)})}async function up(r,e,t){r._canInitEmulator=!1;const n={...MI,...e};try{const s=new qI(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw co(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const c=i.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw co(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw co(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw co(r,"user-disabled",o);const f=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw ap(r,f,l);ht(r,f)}}catch(s){if(s instanceof jt)throw s;ht(r,"network-request-failed",{message:String(s)})}}async function Pi(r,e,t,n,s={}){const i=await Gt(r,e,t,n,s);return"mfaPendingCredential"in i&&ht(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function lp(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?Tu(r.config,s):`${r.config.apiScheme}://${s}`;return FI.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function BI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class qI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(wt(this.auth,"network-request-failed")),UI.get())})}}function co(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=wt(r,e,n);return s.customData._tokenResponse=t,s}function nd(r){return r!==void 0&&r.enterprise!==void 0}class $I{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return BI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function jI(r,e){return Gt(r,"GET","/v2/recaptchaConfig",zt(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zI(r,e){return Gt(r,"POST","/v1/accounts:delete",e)}async function Fo(r,e){return Gt(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zs(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function GI(r,e=!1){const t=pe(r),n=await t.getIdToken(e),s=wu(n);G(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:zs(Ec(s.auth_time)),issuedAtTime:zs(Ec(s.iat)),expirationTime:zs(Ec(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Ec(r){return Number(r)*1e3}function wu(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Io("JWT malformed, contained fewer than 3 sections"),null;try{const s=zf(t);return s?JSON.parse(s):(Io("Failed to decode base64 JWT payload"),null)}catch(s){return Io("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function rd(r){const e=wu(r);return G(e,"internal-error"),G(typeof e.exp<"u","internal-error"),G(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ri(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof jt&&KI(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function KI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=zs(this.lastLoginAt),this.creationTime=zs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Uo(r){var p;const e=r.auth,t=await r.getIdToken(),n=await ri(r,Fo(e,{idToken:t}));G(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(p=s.providerUserInfo)!=null&&p.length?hp(s.providerUserInfo):[],o=QI(r.providerData,i),c=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),l=c?u:!1,f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Uc(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(r,f)}async function HI(r){const e=pe(r);await Uo(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function QI(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function hp(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YI(r,e){const t=await up(r,{},async()=>{const n=Ai({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await lp(r,s,"/v1/token",`key=${i}`),c=await r._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:c,body:n};return r.emulatorConfig&&ss(r.emulatorConfig.host)&&(u.credentials="include"),cp.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function JI(r,e){return Gt(r,"POST","/v2/accounts:revokeToken",zt(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){G(e.idToken,"internal-error"),G(typeof e.idToken<"u","internal-error"),G(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):rd(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){G(e.length!==0,"internal-error");const t=rd(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(G(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await YI(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new kr;return n&&(G(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(G(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(G(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new kr,this.toJSON())}_performRefresh(){return Ct("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(r,e){G(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class lt{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new WI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Uc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ri(this,this.stsTokenManager.getToken(this.auth,e));return G(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return GI(this,e)}reload(){return HI(this)}_assign(e){this!==e&&(G(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new lt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){G(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Uo(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(st(this.auth.app))return Promise.reject(Dt(this.auth));const e=await this.getIdToken();return await ri(this,zI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,f=t.lastLoginAt??void 0,{uid:p,emailVerified:g,isAnonymous:R,providerData:C,stsTokenManager:O}=t;G(p&&O,e,"internal-error");const L=kr.fromJSON(this.name,O);G(typeof p=="string",e,"internal-error"),en(n,e.name),en(s,e.name),G(typeof g=="boolean",e,"internal-error"),G(typeof R=="boolean",e,"internal-error"),en(i,e.name),en(o,e.name),en(c,e.name),en(u,e.name),en(l,e.name),en(f,e.name);const z=new lt({uid:p,auth:e,email:s,emailVerified:g,displayName:n,isAnonymous:R,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:L,createdAt:l,lastLoginAt:f});return C&&Array.isArray(C)&&(z.providerData=C.map(W=>({...W}))),u&&(z._redirectEventId=u),z}static async _fromIdTokenResponse(e,t,n=!1){const s=new kr;s.updateFromServerResponse(t);const i=new lt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await Uo(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];G(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?hp(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new kr;c.updateFromIdToken(n);const u=new lt({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Uc(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,l),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sd=new Map;function xt(r){Lt(r instanceof Function,"Expected a class definition");let e=sd.get(r);return e?(Lt(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,sd.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}dp.type="NONE";const id=dp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eo(r,e,t){return`firebase:${r}:${e}:${t}`}class Or{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=Eo(this.userKey,s.apiKey,i),this.fullPersistenceKey=Eo("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Fo(this.auth,{idToken:e}).catch(()=>{});return t?lt._fromGetAccountInfoResponse(this.auth,t,e):null}return lt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Or(xt(id),e,n);const s=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let i=s[0]||xt(id);const o=Eo(n,e.config.apiKey,e.name);let c=null;for(const l of t)try{const f=await l._get(o);if(f){let p;if(typeof f=="string"){const g=await Fo(e,{idToken:f}).catch(()=>{});if(!g)break;p=await lt._fromGetAccountInfoResponse(e,g,f)}else p=lt._fromJSON(e,f);l!==i&&(c=p),i=l;break}}catch{}const u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Or(i,e,n):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new Or(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function od(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(gp(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(fp(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(yp(e))return"Blackberry";if(Ip(e))return"Webos";if(pp(e))return"Safari";if((e.includes("chrome/")||mp(e))&&!e.includes("edge/"))return"Chrome";if(_p(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function fp(r=Ae()){return/firefox\//i.test(r)}function pp(r=Ae()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function mp(r=Ae()){return/crios\//i.test(r)}function gp(r=Ae()){return/iemobile/i.test(r)}function _p(r=Ae()){return/android/i.test(r)}function yp(r=Ae()){return/blackberry/i.test(r)}function Ip(r=Ae()){return/webos/i.test(r)}function vu(r=Ae()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function XI(r=Ae()){var e;return vu(r)&&!!((e=window.navigator)!=null&&e.standalone)}function ZI(){return py()&&document.documentMode===10}function Ep(r=Ae()){return vu(r)||_p(r)||Ip(r)||yp(r)||/windows phone/i.test(r)||gp(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tp(r,e=[]){let t;switch(r){case"Browser":t=od(Ae());break;case"Worker":t=`${od(Ae())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${is}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,c)=>{try{const u=e(i);o(u)}catch(u){c(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tE(r,e={}){return Gt(r,"GET","/v2/passwordPolicy",zt(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nE=6;class rE{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??nE,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ad(this),this.idTokenSubscription=new ad(this),this.beforeStateQueue=new eE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=op,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=xt(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted&&(this.persistenceManager=await Or.create(this,e),(n=this._resolvePersistenceManagerAvailable)==null||n.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Fo(this,{idToken:e}),n=await lt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(st(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,c=n==null?void 0:n._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return G(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Uo(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=LI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(st(this.app))return Promise.reject(Dt(this));const t=e?pe(e):null;return t&&G(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&G(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return st(this.app)?Promise.reject(Dt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return st(this.app)?Promise.reject(Dt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(xt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await tE(this),t=new rE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new vi("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await JI(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&xt(e)||this._popupRedirectResolver;G(t,this,"argument-error"),this.redirectPersistenceManager=await Or.create(this,[xt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(G(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return G(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Tp(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(st(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&NI(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function xn(r){return pe(r)}class ad{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ey(t=>this.observer=t)}get next(){return G(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ma={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function iE(r){ma=r}function wp(r){return ma.loadJS(r)}function oE(){return ma.recaptchaEnterpriseScript}function aE(){return ma.gapiScript}function cE(r){return`__${r}${Math.floor(Math.random()*1e6)}`}class uE{constructor(){this.enterprise=new lE}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class lE{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const hE="recaptcha-enterprise",vp="NO_RECAPTCHA",cd="onFirebaseAuthREInstanceReady";class on{constructor(e){this.type=hE,this.auth=xn(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{jI(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const l=new $I(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){const u=window.grecaptcha;nd(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(vp)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new uE().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{n(this.auth).then(async c=>{if(!t&&nd(window.grecaptcha)&&on.scriptInjectionDeferred)await on.scriptInjectionDeferred.promise,s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=oE();u.length!==0&&(u+=c+`&onload=${cd}`),on.scriptInjectionDeferred=new Qf,window[cd]=()=>{var l;(l=on.scriptInjectionDeferred)==null||l.resolve()},wp(u).then(()=>{var l;return(l=on.scriptInjectionDeferred)==null?void 0:l.promise}).then(()=>{s(c,i,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}}on.scriptInjectionDeferred=null;async function ud(r,e,t,n=!1,s=!1){const i=new on(r);let o;if(s)o=vp;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const u=c.phoneEnrollmentInfo.phoneNumber,l=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return n?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function Bo(r,e,t,n,s){var i;if((i=r._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await ud(r,e,t,t==="getOobCode");return n(r,o)}else return n(r,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await ud(r,e,t,t==="getOobCode");return n(r,c)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dE(r,e){const t=pa(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(En(i,e??{}))return s;ht(s,"already-initialized")}return t.initialize({options:e})}function fE(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(xt);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function pE(r,e,t){const n=xn(r);G(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=Ap(e),{host:o,port:c}=mE(e),u=c===null?"":`:${c}`,l={url:`${i}//${o}${u}/`},f=Object.freeze({host:o,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){G(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),G(En(l,n.config.emulator)&&En(f,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=l,n.emulatorConfig=f,n.settings.appVerificationDisabledForTesting=!0,ss(o)?_u(`${i}//${o}${u}`):gE()}function Ap(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function mE(r){const e=Ap(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:ld(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:ld(o)}}}function ld(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function gE(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Au{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ct("not implemented")}_getIdTokenResponse(e){return Ct("not implemented")}_linkToIdToken(e,t){return Ct("not implemented")}_getReauthenticationResolver(e){return Ct("not implemented")}}async function _E(r,e){return Gt(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yE(r,e){return Pi(r,"POST","/v1/accounts:signInWithPassword",zt(r,e))}async function IE(r,e){return Gt(r,"POST","/v1/accounts:sendOobCode",zt(r,e))}async function EE(r,e){return IE(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TE(r,e){return Pi(r,"POST","/v1/accounts:signInWithEmailLink",zt(r,e))}async function wE(r,e){return Pi(r,"POST","/v1/accounts:signInWithEmailLink",zt(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si extends Au{constructor(e,t,n,s=null){super("password",n),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new si(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new si(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Bo(e,t,"signInWithPassword",yE);case"emailLink":return TE(e,{email:this._email,oobCode:this._password});default:ht(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Bo(e,n,"signUpPassword",_E);case"emailLink":return wE(e,{idToken:t,email:this._email,oobCode:this._password});default:ht(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lr(r,e){return Pi(r,"POST","/v1/accounts:signInWithIdp",zt(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vE="http://localhost";class ar extends Au{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ar(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ht("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new ar(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Lr(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Lr(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Lr(e,t)}buildRequest(){const e={requestUri:vE,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ai(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AE(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function RE(r){const e=Ms(Fs(r)).link,t=e?Ms(Fs(e)).deep_link_id:null,n=Ms(Fs(r)).deep_link_id;return(n?Ms(Fs(n)).link:null)||n||t||e||r}class Ru{constructor(e){const t=Ms(Fs(e)),n=t.apiKey??null,s=t.oobCode??null,i=AE(t.mode??null);G(n&&s&&i,"argument-error"),this.apiKey=n,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=RE(e);try{return new Ru(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(){this.providerId=os.PROVIDER_ID}static credential(e,t){return si._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=Ru.parseLink(t);return G(n,"argument-error"),si._fromEmailAndCode(e,n.code,n.tenantId)}}os.PROVIDER_ID="password";os.EMAIL_PASSWORD_SIGN_IN_METHOD="password";os.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rp{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi extends Rp{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an extends bi{constructor(){super("facebook.com")}static credential(e){return ar._fromParams({providerId:an.PROVIDER_ID,signInMethod:an.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return an.credentialFromTaggedObject(e)}static credentialFromError(e){return an.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return an.credential(e.oauthAccessToken)}catch{return null}}}an.FACEBOOK_SIGN_IN_METHOD="facebook.com";an.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn extends bi{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ar._fromParams({providerId:cn.PROVIDER_ID,signInMethod:cn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return cn.credentialFromTaggedObject(e)}static credentialFromError(e){return cn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return cn.credential(t,n)}catch{return null}}}cn.GOOGLE_SIGN_IN_METHOD="google.com";cn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class un extends bi{constructor(){super("github.com")}static credential(e){return ar._fromParams({providerId:un.PROVIDER_ID,signInMethod:un.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return un.credentialFromTaggedObject(e)}static credentialFromError(e){return un.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return un.credential(e.oauthAccessToken)}catch{return null}}}un.GITHUB_SIGN_IN_METHOD="github.com";un.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln extends bi{constructor(){super("twitter.com")}static credential(e,t){return ar._fromParams({providerId:ln.PROVIDER_ID,signInMethod:ln.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ln.credentialFromTaggedObject(e)}static credentialFromError(e){return ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return ln.credential(t,n)}catch{return null}}}ln.TWITTER_SIGN_IN_METHOD="twitter.com";ln.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PE(r,e){return Pi(r,"POST","/v1/accounts:signUp",zt(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await lt._fromIdTokenResponse(e,n,s),o=hd(n);return new cr({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=hd(n);return new cr({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function hd(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo extends jt{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,qo.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new qo(e,t,n,s)}}function Pp(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?qo._fromErrorAndOperation(r,i,e,n):i})}async function bE(r,e,t=!1){const n=await ri(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return cr._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SE(r,e,t=!1){const{auth:n}=r;if(st(n.app))return Promise.reject(Dt(n));const s="reauthenticate";try{const i=await ri(r,Pp(n,s,e,r),t);G(i.idToken,n,"internal-error");const o=wu(i.idToken);G(o,n,"internal-error");const{sub:c}=o;return G(r.uid===c,n,"user-mismatch"),cr._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&ht(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bp(r,e,t=!1){if(st(r.app))return Promise.reject(Dt(r));const n="signIn",s=await Pp(r,n,e),i=await cr._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}async function VE(r,e){return bp(xn(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sp(r){const e=xn(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function ob(r,e,t){const n=xn(r);await Bo(n,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",EE)}async function ab(r,e,t){if(st(r.app))return Promise.reject(Dt(r));const n=xn(r),o=await Bo(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",PE).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Sp(r),u}),c=await cr._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(c.user),c}function cb(r,e,t){return st(r.app)?Promise.reject(Dt(r)):VE(pe(r),os.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Sp(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ub(r,e){return pe(r).setPersistence(e)}function CE(r,e,t,n){return pe(r).onIdTokenChanged(e,t,n)}function xE(r,e,t){return pe(r).beforeAuthStateChanged(e,t)}function lb(r,e,t,n){return pe(r).onAuthStateChanged(e,t,n)}function hb(r){return pe(r).signOut()}const $o="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem($o,"1"),this.storage.removeItem($o),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DE=1e3,NE=10;class Cp extends Vp{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ep(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);ZI()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,NE):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},DE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Cp.type="LOCAL";const kE=Cp;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp extends Vp{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}xp.type="SESSION";const Dp=xp;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OE(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ga{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new ga(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const c=Array.from(o).map(async l=>l(t.origin,i)),u=await OE(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ga.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LE{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{const l=Pu("",20);s.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(p){const g=p;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(g.data.response);break;default:clearTimeout(f),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vt(){return window}function ME(r){vt().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Np(){return typeof vt().WorkerGlobalScope<"u"&&typeof vt().importScripts=="function"}async function FE(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function UE(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function BE(){return Np()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kp="firebaseLocalStorageDb",qE=1,jo="firebaseLocalStorage",Op="fbase_key";class Si{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function _a(r,e){return r.transaction([jo],e?"readwrite":"readonly").objectStore(jo)}function $E(){const r=indexedDB.deleteDatabase(kp);return new Si(r).toPromise()}function Lp(){const r=indexedDB.open(kp,qE);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(jo,{keyPath:Op})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(jo)?e(n):(n.close(),await $E(),e(await Lp()))})})}async function dd(r,e,t){const n=_a(r,!0).put({[Op]:e,value:t});return new Si(n).toPromise()}async function jE(r,e){const t=_a(r,!1).get(e),n=await new Si(t).toPromise();return n===void 0?null:n.value}function fd(r,e){const t=_a(r,!0).delete(e);return new Si(t).toPromise()}const zE=800,GE=3;class Mp{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Lp(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>GE)throw n;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Np()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ga._getInstance(BE()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await FE(),!this.activeServiceWorker)return;this.sender=new LE(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||UE()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await dd(e,$o,"1"),await fd(e,$o)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>dd(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>jE(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>fd(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=_a(s,!1).getAll();return new Si(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),zE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Mp.type="LOCAL";const KE=Mp;new Ri(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WE(r,e){return e?xt(e):(G(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu extends Au{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Lr(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Lr(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Lr(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function HE(r){return bp(r.auth,new bu(r),r.bypassAuthState)}function QE(r){const{auth:e,user:t}=r;return G(t,e,"internal-error"),SE(t,new bu(r),r.bypassAuthState)}async function YE(r){const{auth:e,user:t}=r;return G(t,e,"internal-error"),bE(t,new bu(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return HE;case"linkViaPopup":case"linkViaRedirect":return YE;case"reauthViaPopup":case"reauthViaRedirect":return QE;default:ht(this.auth,"internal-error")}}resolve(e){Lt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Lt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JE=new Ri(2e3,1e4);class Nr extends Fp{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,Nr.currentPopupAction&&Nr.currentPopupAction.cancel(),Nr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return G(e,this.auth,"internal-error"),e}async onExecution(){Lt(this.filter.length===1,"Popup operations only handle one event");const e=Pu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(wt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(wt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Nr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(wt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,JE.get())};e()}}Nr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XE="pendingRedirect",To=new Map;class ZE extends Fp{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=To.get(this.auth._key());if(!e){try{const n=await eT(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}To.set(this.auth._key(),e)}return this.bypassAuthState||To.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function eT(r,e){const t=rT(e),n=nT(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function tT(r,e){To.set(r._key(),e)}function nT(r){return xt(r._redirectPersistence)}function rT(r){return Eo(XE,r.config.apiKey,r.name)}async function sT(r,e,t=!1){if(st(r.app))return Promise.reject(Dt(r));const n=xn(r),s=WE(n,e),o=await new ZE(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iT=600*1e3;class oT{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!aT(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Up(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError(wt(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=iT&&this.cachedEventUids.clear(),this.cachedEventUids.has(pd(e))}saveEventToCache(e){this.cachedEventUids.add(pd(e)),this.lastProcessedEventTime=Date.now()}}function pd(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function Up({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function aT(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Up(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cT(r,e={}){return Gt(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,lT=/^https?/;async function hT(r){if(r.config.emulator)return;const{authorizedDomains:e}=await cT(r);for(const t of e)try{if(dT(t))return}catch{}ht(r,"unauthorized-domain")}function dT(r){const e=Fc(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!lT.test(t))return!1;if(uT.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fT=new Ri(3e4,6e4);function md(){const r=vt().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function pT(r){return new Promise((e,t)=>{var s,i,o;function n(){md(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{md(),t(wt(r,"network-request-failed"))},timeout:fT.get()})}if((i=(s=vt().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=vt().gapi)!=null&&o.load)n();else{const c=cE("iframefcb");return vt()[c]=()=>{gapi.load?n():t(wt(r,"network-request-failed"))},wp(`${aE()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw wo=null,e})}let wo=null;function mT(r){return wo=wo||pT(r),wo}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gT=new Ri(5e3,15e3),_T="__/auth/iframe",yT="emulator/auth/iframe",IT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ET=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function TT(r){const e=r.config;G(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?Tu(e,yT):`https://${r.config.authDomain}/${_T}`,n={apiKey:e.apiKey,appName:r.name,v:is},s=ET.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${Ai(n).slice(1)}`}async function wT(r){const e=await mT(r),t=vt().gapi;return G(t,r,"internal-error"),e.open({where:document.body,url:TT(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:IT,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=wt(r,"network-request-failed"),c=vt().setTimeout(()=>{i(o)},gT.get());function u(){vt().clearTimeout(c),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},AT=500,RT=600,PT="_blank",bT="http://localhost";class gd{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ST(r,e,t,n=AT,s=RT){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const u={...vT,width:n.toString(),height:s.toString(),top:i,left:o},l=Ae().toLowerCase();t&&(c=mp(l)?PT:t),fp(l)&&(e=e||bT,u.scrollbars="yes");const f=Object.entries(u).reduce((g,[R,C])=>`${g}${R}=${C},`,"");if(XI(l)&&c!=="_self")return VT(e||"",c),new gd(null);const p=window.open(e||"",c,f);G(p,r,"popup-blocked");try{p.focus()}catch{}return new gd(p)}function VT(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CT="__/auth/handler",xT="emulator/auth/handler",DT=encodeURIComponent("fac");async function _d(r,e,t,n,s,i){G(r.config.authDomain,r,"auth-domain-config-required"),G(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:is,eventId:s};if(e instanceof Rp){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",Iy(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof bi){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await r._getAppCheckToken(),l=u?`#${DT}=${encodeURIComponent(u)}`:"";return`${NT(r)}?${Ai(c).slice(1)}${l}`}function NT({config:r}){return r.emulator?Tu(r,xT):`https://${r.authDomain}/${CT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc="webStorageSupport";class kT{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Dp,this._completeRedirectFn=sT,this._overrideRedirectResult=tT}async _openPopup(e,t,n,s){var o;Lt((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await _d(e,t,n,Fc(),s);return ST(e,i,Pu())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await _d(e,t,n,Fc(),s);return ME(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Lt(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await wT(e),n=new oT(e);return t.register("authEvent",s=>(G(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Tc,{type:Tc},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[Tc];i!==void 0&&t(!!i),ht(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=hT(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Ep()||pp()||vu()}}const OT=kT;var yd="@firebase/auth",Id="1.13.3";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LT{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){G(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MT(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function FT(r){Ur(new or("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;G(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Tp(r)},l=new sE(n,s,i,u);return fE(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Ur(new or("auth-internal",e=>{const t=xn(e.getProvider("auth").getImmediate());return(n=>new LT(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),mn(yd,Id,MT(r)),mn(yd,Id,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UT=300,BT=Hf("authIdTokenMaxAge")||UT;let Ed=null;const qT=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>BT)return;const s=t==null?void 0:t.token;Ed!==s&&(Ed=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function db(r=np()){const e=pa(r,"auth");if(e.isInitialized())return e.getImmediate();const t=dE(r,{popupRedirectResolver:OT,persistence:[KE,kE,Dp]}),n=Hf("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=qT(i.toString());xE(t,o,()=>o(t.currentUser)),CE(t,c=>o(c))}}const s=Kf("auth");return s&&pE(t,`http://${s}`),t}function $T(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}iE({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=wt("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",$T().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});FT("Browser");var Td=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gn,Bp;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,_){function I(){}I.prototype=_.prototype,T.F=_.prototype,T.prototype=new I,T.prototype.constructor=T,T.D=function(v,w,b){for(var y=Array(arguments.length-2),Ge=2;Ge<arguments.length;Ge++)y[Ge-2]=arguments[Ge];return _.prototype[w].apply(v,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,_,I){I||(I=0);const v=Array(16);if(typeof _=="string")for(var w=0;w<16;++w)v[w]=_.charCodeAt(I++)|_.charCodeAt(I++)<<8|_.charCodeAt(I++)<<16|_.charCodeAt(I++)<<24;else for(w=0;w<16;++w)v[w]=_[I++]|_[I++]<<8|_[I++]<<16|_[I++]<<24;_=T.g[0],I=T.g[1],w=T.g[2];let b=T.g[3],y;y=_+(b^I&(w^b))+v[0]+3614090360&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(w^_&(I^w))+v[1]+3905402710&4294967295,b=_+(y<<12&4294967295|y>>>20),y=w+(I^b&(_^I))+v[2]+606105819&4294967295,w=b+(y<<17&4294967295|y>>>15),y=I+(_^w&(b^_))+v[3]+3250441966&4294967295,I=w+(y<<22&4294967295|y>>>10),y=_+(b^I&(w^b))+v[4]+4118548399&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(w^_&(I^w))+v[5]+1200080426&4294967295,b=_+(y<<12&4294967295|y>>>20),y=w+(I^b&(_^I))+v[6]+2821735955&4294967295,w=b+(y<<17&4294967295|y>>>15),y=I+(_^w&(b^_))+v[7]+4249261313&4294967295,I=w+(y<<22&4294967295|y>>>10),y=_+(b^I&(w^b))+v[8]+1770035416&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(w^_&(I^w))+v[9]+2336552879&4294967295,b=_+(y<<12&4294967295|y>>>20),y=w+(I^b&(_^I))+v[10]+4294925233&4294967295,w=b+(y<<17&4294967295|y>>>15),y=I+(_^w&(b^_))+v[11]+2304563134&4294967295,I=w+(y<<22&4294967295|y>>>10),y=_+(b^I&(w^b))+v[12]+1804603682&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(w^_&(I^w))+v[13]+4254626195&4294967295,b=_+(y<<12&4294967295|y>>>20),y=w+(I^b&(_^I))+v[14]+2792965006&4294967295,w=b+(y<<17&4294967295|y>>>15),y=I+(_^w&(b^_))+v[15]+1236535329&4294967295,I=w+(y<<22&4294967295|y>>>10),y=_+(w^b&(I^w))+v[1]+4129170786&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^w&(_^I))+v[6]+3225465664&4294967295,b=_+(y<<9&4294967295|y>>>23),y=w+(_^I&(b^_))+v[11]+643717713&4294967295,w=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(w^b))+v[0]+3921069994&4294967295,I=w+(y<<20&4294967295|y>>>12),y=_+(w^b&(I^w))+v[5]+3593408605&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^w&(_^I))+v[10]+38016083&4294967295,b=_+(y<<9&4294967295|y>>>23),y=w+(_^I&(b^_))+v[15]+3634488961&4294967295,w=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(w^b))+v[4]+3889429448&4294967295,I=w+(y<<20&4294967295|y>>>12),y=_+(w^b&(I^w))+v[9]+568446438&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^w&(_^I))+v[14]+3275163606&4294967295,b=_+(y<<9&4294967295|y>>>23),y=w+(_^I&(b^_))+v[3]+4107603335&4294967295,w=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(w^b))+v[8]+1163531501&4294967295,I=w+(y<<20&4294967295|y>>>12),y=_+(w^b&(I^w))+v[13]+2850285829&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^w&(_^I))+v[2]+4243563512&4294967295,b=_+(y<<9&4294967295|y>>>23),y=w+(_^I&(b^_))+v[7]+1735328473&4294967295,w=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(w^b))+v[12]+2368359562&4294967295,I=w+(y<<20&4294967295|y>>>12),y=_+(I^w^b)+v[5]+4294588738&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^w)+v[8]+2272392833&4294967295,b=_+(y<<11&4294967295|y>>>21),y=w+(b^_^I)+v[11]+1839030562&4294967295,w=b+(y<<16&4294967295|y>>>16),y=I+(w^b^_)+v[14]+4259657740&4294967295,I=w+(y<<23&4294967295|y>>>9),y=_+(I^w^b)+v[1]+2763975236&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^w)+v[4]+1272893353&4294967295,b=_+(y<<11&4294967295|y>>>21),y=w+(b^_^I)+v[7]+4139469664&4294967295,w=b+(y<<16&4294967295|y>>>16),y=I+(w^b^_)+v[10]+3200236656&4294967295,I=w+(y<<23&4294967295|y>>>9),y=_+(I^w^b)+v[13]+681279174&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^w)+v[0]+3936430074&4294967295,b=_+(y<<11&4294967295|y>>>21),y=w+(b^_^I)+v[3]+3572445317&4294967295,w=b+(y<<16&4294967295|y>>>16),y=I+(w^b^_)+v[6]+76029189&4294967295,I=w+(y<<23&4294967295|y>>>9),y=_+(I^w^b)+v[9]+3654602809&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^w)+v[12]+3873151461&4294967295,b=_+(y<<11&4294967295|y>>>21),y=w+(b^_^I)+v[15]+530742520&4294967295,w=b+(y<<16&4294967295|y>>>16),y=I+(w^b^_)+v[2]+3299628645&4294967295,I=w+(y<<23&4294967295|y>>>9),y=_+(w^(I|~b))+v[0]+4096336452&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~w))+v[7]+1126891415&4294967295,b=_+(y<<10&4294967295|y>>>22),y=w+(_^(b|~I))+v[14]+2878612391&4294967295,w=b+(y<<15&4294967295|y>>>17),y=I+(b^(w|~_))+v[5]+4237533241&4294967295,I=w+(y<<21&4294967295|y>>>11),y=_+(w^(I|~b))+v[12]+1700485571&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~w))+v[3]+2399980690&4294967295,b=_+(y<<10&4294967295|y>>>22),y=w+(_^(b|~I))+v[10]+4293915773&4294967295,w=b+(y<<15&4294967295|y>>>17),y=I+(b^(w|~_))+v[1]+2240044497&4294967295,I=w+(y<<21&4294967295|y>>>11),y=_+(w^(I|~b))+v[8]+1873313359&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~w))+v[15]+4264355552&4294967295,b=_+(y<<10&4294967295|y>>>22),y=w+(_^(b|~I))+v[6]+2734768916&4294967295,w=b+(y<<15&4294967295|y>>>17),y=I+(b^(w|~_))+v[13]+1309151649&4294967295,I=w+(y<<21&4294967295|y>>>11),y=_+(w^(I|~b))+v[4]+4149444226&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~w))+v[11]+3174756917&4294967295,b=_+(y<<10&4294967295|y>>>22),y=w+(_^(b|~I))+v[2]+718787259&4294967295,w=b+(y<<15&4294967295|y>>>17),y=I+(b^(w|~_))+v[9]+3951481745&4294967295,T.g[0]=T.g[0]+_&4294967295,T.g[1]=T.g[1]+(w+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+w&4294967295,T.g[3]=T.g[3]+b&4294967295}n.prototype.v=function(T,_){_===void 0&&(_=T.length);const I=_-this.blockSize,v=this.C;let w=this.h,b=0;for(;b<_;){if(w==0)for(;b<=I;)s(this,T,b),b+=this.blockSize;if(typeof T=="string"){for(;b<_;)if(v[w++]=T.charCodeAt(b++),w==this.blockSize){s(this,v),w=0;break}}else for(;b<_;)if(v[w++]=T[b++],w==this.blockSize){s(this,v),w=0;break}}this.h=w,this.o+=_},n.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var _=1;_<T.length-8;++_)T[_]=0;_=this.o*8;for(var I=T.length-8;I<T.length;++I)T[I]=_&255,_/=256;for(this.v(T),T=Array(16),_=0,I=0;I<4;++I)for(let v=0;v<32;v+=8)T[_++]=this.g[I]>>>v&255;return T};function i(T,_){var I=c;return Object.prototype.hasOwnProperty.call(I,T)?I[T]:I[T]=_(T)}function o(T,_){this.h=_;const I=[];let v=!0;for(let w=T.length-1;w>=0;w--){const b=T[w]|0;v&&b==_||(I[w]=b,v=!1)}this.g=I}var c={};function u(T){return-128<=T&&T<128?i(T,function(_){return new o([_|0],_<0?-1:0)}):new o([T|0],T<0?-1:0)}function l(T){if(isNaN(T)||!isFinite(T))return p;if(T<0)return L(l(-T));const _=[];let I=1;for(let v=0;T>=I;v++)_[v]=T/I|0,I*=4294967296;return new o(_,0)}function f(T,_){if(T.length==0)throw Error("number format error: empty string");if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(T.charAt(0)=="-")return L(f(T.substring(1),_));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const I=l(Math.pow(_,8));let v=p;for(let b=0;b<T.length;b+=8){var w=Math.min(8,T.length-b);const y=parseInt(T.substring(b,b+w),_);w<8?(w=l(Math.pow(_,w)),v=v.j(w).add(l(y))):(v=v.j(I),v=v.add(l(y)))}return v}var p=u(0),g=u(1),R=u(16777216);r=o.prototype,r.m=function(){if(O(this))return-L(this).m();let T=0,_=1;for(let I=0;I<this.g.length;I++){const v=this.i(I);T+=(v>=0?v:4294967296+v)*_,_*=4294967296}return T},r.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(C(this))return"0";if(O(this))return"-"+L(this).toString(T);const _=l(Math.pow(T,6));var I=this;let v="";for(;;){const w=ue(I,_).g;I=z(I,w.j(_));let b=((I.g.length>0?I.g[0]:I.h)>>>0).toString(T);if(I=w,C(I))return b+v;for(;b.length<6;)b="0"+b;v=b+v}},r.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function C(T){if(T.h!=0)return!1;for(let _=0;_<T.g.length;_++)if(T.g[_]!=0)return!1;return!0}function O(T){return T.h==-1}r.l=function(T){return T=z(this,T),O(T)?-1:C(T)?0:1};function L(T){const _=T.g.length,I=[];for(let v=0;v<_;v++)I[v]=~T.g[v];return new o(I,~T.h).add(g)}r.abs=function(){return O(this)?L(this):this},r.add=function(T){const _=Math.max(this.g.length,T.g.length),I=[];let v=0;for(let w=0;w<=_;w++){let b=v+(this.i(w)&65535)+(T.i(w)&65535),y=(b>>>16)+(this.i(w)>>>16)+(T.i(w)>>>16);v=y>>>16,b&=65535,y&=65535,I[w]=y<<16|b}return new o(I,I[I.length-1]&-2147483648?-1:0)};function z(T,_){return T.add(L(_))}r.j=function(T){if(C(this)||C(T))return p;if(O(this))return O(T)?L(this).j(L(T)):L(L(this).j(T));if(O(T))return L(this.j(L(T)));if(this.l(R)<0&&T.l(R)<0)return l(this.m()*T.m());const _=this.g.length+T.g.length,I=[];for(var v=0;v<2*_;v++)I[v]=0;for(v=0;v<this.g.length;v++)for(let w=0;w<T.g.length;w++){const b=this.i(v)>>>16,y=this.i(v)&65535,Ge=T.i(w)>>>16,Mn=T.i(w)&65535;I[2*v+2*w]+=y*Mn,W(I,2*v+2*w),I[2*v+2*w+1]+=b*Mn,W(I,2*v+2*w+1),I[2*v+2*w+1]+=y*Ge,W(I,2*v+2*w+1),I[2*v+2*w+2]+=b*Ge,W(I,2*v+2*w+2)}for(T=0;T<_;T++)I[T]=I[2*T+1]<<16|I[2*T];for(T=_;T<2*_;T++)I[T]=0;return new o(I,0)};function W(T,_){for(;(T[_]&65535)!=T[_];)T[_+1]+=T[_]>>>16,T[_]&=65535,_++}function H(T,_){this.g=T,this.h=_}function ue(T,_){if(C(_))throw Error("division by zero");if(C(T))return new H(p,p);if(O(T))return _=ue(L(T),_),new H(L(_.g),L(_.h));if(O(_))return _=ue(T,L(_)),new H(L(_.g),_.h);if(T.g.length>30){if(O(T)||O(_))throw Error("slowDivide_ only works with positive integers.");for(var I=g,v=_;v.l(T)<=0;)I=te(I),v=te(v);var w=ne(I,1),b=ne(v,1);for(v=ne(v,2),I=ne(I,2);!C(v);){var y=b.add(v);y.l(T)<=0&&(w=w.add(I),b=y),v=ne(v,1),I=ne(I,1)}return _=z(T,w.j(_)),new H(w,_)}for(w=p;T.l(_)>=0;){for(I=Math.max(1,Math.floor(T.m()/_.m())),v=Math.ceil(Math.log(I)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),b=l(I),y=b.j(_);O(y)||y.l(T)>0;)I-=v,b=l(I),y=b.j(_);C(b)&&(b=g),w=w.add(b),T=z(T,y)}return new H(w,T)}r.B=function(T){return ue(this,T).h},r.and=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let v=0;v<_;v++)I[v]=this.i(v)&T.i(v);return new o(I,this.h&T.h)},r.or=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let v=0;v<_;v++)I[v]=this.i(v)|T.i(v);return new o(I,this.h|T.h)},r.xor=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let v=0;v<_;v++)I[v]=this.i(v)^T.i(v);return new o(I,this.h^T.h)};function te(T){const _=T.g.length+1,I=[];for(let v=0;v<_;v++)I[v]=T.i(v)<<1|T.i(v-1)>>>31;return new o(I,T.h)}function ne(T,_){const I=_>>5;_%=32;const v=T.g.length-I,w=[];for(let b=0;b<v;b++)w[b]=_>0?T.i(b+I)>>>_|T.i(b+I+1)<<32-_:T.i(b+I);return new o(w,T.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Bp=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=f,gn=o}).apply(typeof Td<"u"?Td:typeof self<"u"?self:typeof window<"u"?window:{});var uo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qp,Us,$p,vo,Bc,jp,zp,Gp;(function(){var r,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof uo=="object"&&uo];for(var h=0;h<a.length;++h){var d=a[h];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(a,h){if(h)e:{var d=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var P=a[m];if(!(P in d))break e;d=d[P]}a=a[a.length-1],m=d[a],h=h(m),h!=m&&h!=null&&e(d,a,{configurable:!0,writable:!0,value:h})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(h){var d=[],m;for(m in h)Object.prototype.hasOwnProperty.call(h,m)&&d.push([m,h[m]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function u(a,h,d){return a.call.apply(a.bind,arguments)}function l(a,h,d){return l=u,l.apply(null,arguments)}function f(a,h){var d=Array.prototype.slice.call(arguments,1);return function(){var m=d.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function p(a,h){function d(){}d.prototype=h.prototype,a.Z=h.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(m,P,V){for(var U=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)U[Y-2]=arguments[Y];return h.prototype[P].apply(m,U)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function R(a){const h=a.length;if(h>0){const d=Array(h);for(let m=0;m<h;m++)d[m]=a[m];return d}return[]}function C(a,h){for(let m=1;m<arguments.length;m++){const P=arguments[m];var d=typeof P;if(d=d!="object"?d:P?Array.isArray(P)?"array":d:"null",d=="array"||d=="object"&&typeof P.length=="number"){d=a.length||0;const V=P.length||0;a.length=d+V;for(let U=0;U<V;U++)a[d+U]=P[U]}else a.push(P)}}class O{constructor(h,d){this.i=h,this.j=d,this.h=0,this.g=null}get(){let h;return this.h>0?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function L(a){o.setTimeout(()=>{throw a},0)}function z(){var a=T;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class W{constructor(){this.h=this.g=null}add(h,d){const m=H.get();m.set(h,d),this.h?this.h.next=m:this.g=m,this.h=m}}var H=new O(()=>new ue,a=>a.reset());class ue{constructor(){this.next=this.g=this.h=null}set(h,d){this.h=h,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let te,ne=!1,T=new W,_=()=>{const a=Promise.resolve(void 0);te=()=>{a.then(I)}};function I(){for(var a;a=z();){try{a.h.call(a.g)}catch(d){L(d)}var h=H;h.j(a),h.h<100&&(h.h++,a.next=h.g,h.g=a)}ne=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function w(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}w.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,h),o.removeEventListener("test",d,h)}catch{}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Ge(a,h){w.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,h)}p(Ge,w),Ge.prototype.init=function(a,h){const d=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget,h||(d=="mouseover"?h=a.fromElement:d=="mouseout"&&(h=a.toElement)),this.relatedTarget=h,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Ge.Z.h.call(this)},Ge.prototype.h=function(){Ge.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Mn="closure_listenable_"+(Math.random()*1e6|0),v_=0;function A_(a,h,d,m,P){this.listener=a,this.proxy=null,this.src=h,this.type=d,this.capture=!!m,this.ha=P,this.key=++v_,this.da=this.fa=!1}function Wi(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Hi(a,h,d){for(const m in a)h.call(d,a[m],m,a)}function R_(a,h){for(const d in a)h.call(void 0,a[d],d,a)}function zl(a){const h={};for(const d in a)h[d]=a[d];return h}const Gl="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Kl(a,h){let d,m;for(let P=1;P<arguments.length;P++){m=arguments[P];for(d in m)a[d]=m[d];for(let V=0;V<Gl.length;V++)d=Gl[V],Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d])}}function Qi(a){this.src=a,this.g={},this.h=0}Qi.prototype.add=function(a,h,d,m,P){const V=a.toString();a=this.g[V],a||(a=this.g[V]=[],this.h++);const U=Ka(a,h,m,P);return U>-1?(h=a[U],d||(h.fa=!1)):(h=new A_(h,this.src,V,!!m,P),h.fa=d,a.push(h)),h};function Ga(a,h){const d=h.type;if(d in a.g){var m=a.g[d],P=Array.prototype.indexOf.call(m,h,void 0),V;(V=P>=0)&&Array.prototype.splice.call(m,P,1),V&&(Wi(h),a.g[d].length==0&&(delete a.g[d],a.h--))}}function Ka(a,h,d,m){for(let P=0;P<a.length;++P){const V=a[P];if(!V.da&&V.listener==h&&V.capture==!!d&&V.ha==m)return P}return-1}var Wa="closure_lm_"+(Math.random()*1e6|0),Ha={};function Wl(a,h,d,m,P){if(Array.isArray(h)){for(let V=0;V<h.length;V++)Wl(a,h[V],d,m,P);return null}return d=Yl(d),a&&a[Mn]?a.J(h,d,c(m)?!!m.capture:!1,P):P_(a,h,d,!1,m,P)}function P_(a,h,d,m,P,V){if(!h)throw Error("Invalid event type");const U=c(P)?!!P.capture:!!P;let Y=Ya(a);if(Y||(a[Wa]=Y=new Qi(a)),d=Y.add(h,d,m,U,V),d.proxy)return d;if(m=b_(),d.proxy=m,m.src=a,m.listener=d,a.addEventListener)b||(P=U),P===void 0&&(P=!1),a.addEventListener(h.toString(),m,P);else if(a.attachEvent)a.attachEvent(Ql(h.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return d}function b_(){function a(d){return h.call(a.src,a.listener,d)}const h=S_;return a}function Hl(a,h,d,m,P){if(Array.isArray(h))for(var V=0;V<h.length;V++)Hl(a,h[V],d,m,P);else m=c(m)?!!m.capture:!!m,d=Yl(d),a&&a[Mn]?(a=a.i,V=String(h).toString(),V in a.g&&(h=a.g[V],d=Ka(h,d,m,P),d>-1&&(Wi(h[d]),Array.prototype.splice.call(h,d,1),h.length==0&&(delete a.g[V],a.h--)))):a&&(a=Ya(a))&&(h=a.g[h.toString()],a=-1,h&&(a=Ka(h,d,m,P)),(d=a>-1?h[a]:null)&&Qa(d))}function Qa(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[Mn])Ga(h.i,a);else{var d=a.type,m=a.proxy;h.removeEventListener?h.removeEventListener(d,m,a.capture):h.detachEvent?h.detachEvent(Ql(d),m):h.addListener&&h.removeListener&&h.removeListener(m),(d=Ya(h))?(Ga(d,a),d.h==0&&(d.src=null,h[Wa]=null)):Wi(a)}}}function Ql(a){return a in Ha?Ha[a]:Ha[a]="on"+a}function S_(a,h){if(a.da)a=!0;else{h=new Ge(h,this);const d=a.listener,m=a.ha||a.src;a.fa&&Qa(a),a=d.call(m,h)}return a}function Ya(a){return a=a[Wa],a instanceof Qi?a:null}var Ja="__closure_events_fn_"+(Math.random()*1e9>>>0);function Yl(a){return typeof a=="function"?a:(a[Ja]||(a[Ja]=function(h){return a.handleEvent(h)}),a[Ja])}function ke(){v.call(this),this.i=new Qi(this),this.M=this,this.G=null}p(ke,v),ke.prototype[Mn]=!0,ke.prototype.removeEventListener=function(a,h,d,m){Hl(this,a,h,d,m)};function qe(a,h){var d,m=a.G;if(m)for(d=[];m;m=m.G)d.push(m);if(a=a.M,m=h.type||h,typeof h=="string")h=new w(h,a);else if(h instanceof w)h.target=h.target||a;else{var P=h;h=new w(m,a),Kl(h,P)}P=!0;let V,U;if(d)for(U=d.length-1;U>=0;U--)V=h.g=d[U],P=Yi(V,m,!0,h)&&P;if(V=h.g=a,P=Yi(V,m,!0,h)&&P,P=Yi(V,m,!1,h)&&P,d)for(U=0;U<d.length;U++)V=h.g=d[U],P=Yi(V,m,!1,h)&&P}ke.prototype.N=function(){if(ke.Z.N.call(this),this.i){var a=this.i;for(const h in a.g){const d=a.g[h];for(let m=0;m<d.length;m++)Wi(d[m]);delete a.g[h],a.h--}}this.G=null},ke.prototype.J=function(a,h,d,m){return this.i.add(String(a),h,!1,d,m)},ke.prototype.K=function(a,h,d,m){return this.i.add(String(a),h,!0,d,m)};function Yi(a,h,d,m){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();let P=!0;for(let V=0;V<h.length;++V){const U=h[V];if(U&&!U.da&&U.capture==d){const Y=U.listener,we=U.ha||U.src;U.fa&&Ga(a.i,U),P=Y.call(we,m)!==!1&&P}}return P&&!m.defaultPrevented}function V_(a,h){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(h)>2147483647?-1:o.setTimeout(a,h||0)}function Jl(a){a.g=V_(()=>{a.g=null,a.i&&(a.i=!1,Jl(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class C_ extends v{constructor(h,d){super(),this.m=h,this.l=d,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Jl(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ms(a){v.call(this),this.h=a,this.g={}}p(ms,v);var Xl=[];function Zl(a){Hi(a.g,function(h,d){this.g.hasOwnProperty(d)&&Qa(h)},a),a.g={}}ms.prototype.N=function(){ms.Z.N.call(this),Zl(this)},ms.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Xa=o.JSON.stringify,x_=o.JSON.parse,D_=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function eh(){}function th(){}var gs={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Za(){w.call(this,"d")}p(Za,w);function ec(){w.call(this,"c")}p(ec,w);var Fn={},nh=null;function Ji(){return nh=nh||new ke}Fn.Ia="serverreachability";function rh(a){w.call(this,Fn.Ia,a)}p(rh,w);function _s(a){const h=Ji();qe(h,new rh(h))}Fn.STAT_EVENT="statevent";function sh(a,h){w.call(this,Fn.STAT_EVENT,a),this.stat=h}p(sh,w);function $e(a){const h=Ji();qe(h,new sh(h,a))}Fn.Ja="timingevent";function ih(a,h){w.call(this,Fn.Ja,a),this.size=h}p(ih,w);function ys(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},h)}function Is(){this.g=!0}Is.prototype.ua=function(){this.g=!1};function N_(a,h,d,m,P,V){a.info(function(){if(a.g)if(V){var U="",Y=V.split("&");for(let oe=0;oe<Y.length;oe++){var we=Y[oe].split("=");if(we.length>1){const Pe=we[0];we=we[1];const pt=Pe.split("_");U=pt.length>=2&&pt[1]=="type"?U+(Pe+"="+we+"&"):U+(Pe+"=redacted&")}}}else U=null;else U=V;return"XMLHTTP REQ ("+m+") [attempt "+P+"]: "+h+`
`+d+`
`+U})}function k_(a,h,d,m,P,V,U){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+P+"]: "+h+`
`+d+`
`+V+" "+U})}function Ir(a,h,d,m){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+L_(a,d)+(m?" "+m:"")})}function O_(a,h){a.info(function(){return"TIMEOUT: "+h})}Is.prototype.info=function(){};function L_(a,h){if(!a.g)return h;if(!h)return null;try{const V=JSON.parse(h);if(V){for(a=0;a<V.length;a++)if(Array.isArray(V[a])){var d=V[a];if(!(d.length<2)){var m=d[1];if(Array.isArray(m)&&!(m.length<1)){var P=m[0];if(P!="noop"&&P!="stop"&&P!="close")for(let U=1;U<m.length;U++)m[U]=""}}}}return Xa(V)}catch{return h}}var Xi={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},oh={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},ah;function tc(){}p(tc,eh),tc.prototype.g=function(){return new XMLHttpRequest},ah=new tc;function Es(a){return encodeURIComponent(String(a))}function M_(a){var h=1;a=a.split(":");const d=[];for(;h>0&&a.length;)d.push(a.shift()),h--;return a.length&&d.push(a.join(":")),d}function Ht(a,h,d,m){this.j=a,this.i=h,this.l=d,this.S=m||1,this.V=new ms(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ch}function ch(){this.i=null,this.g="",this.h=!1}var uh={},nc={};function rc(a,h,d){a.M=1,a.A=eo(ft(h)),a.u=d,a.R=!0,lh(a,null)}function lh(a,h){a.F=Date.now(),Zi(a),a.B=ft(a.A);var d=a.B,m=a.S;Array.isArray(m)||(m=[String(m)]),vh(d.i,"t",m),a.C=0,d=a.j.L,a.h=new ch,a.g=qh(a.j,d?h:null,!a.u),a.P>0&&(a.O=new C_(l(a.Y,a,a.g),a.P)),h=a.V,d=a.g,m=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(Xl[0]=P.toString()),P=Xl);for(let V=0;V<P.length;V++){const U=Wl(d,P[V],m||h.handleEvent,!1,h.h||h);if(!U)break;h.g[U.key]=U}h=a.J?zl(a.J):{},a.u?(a.v||(a.v="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,h)):(a.v="GET",a.g.ea(a.B,a.v,null,h)),_s(),N_(a.i,a.v,a.B,a.l,a.S,a.u)}Ht.prototype.ba=function(a){a=a.target;const h=this.O;h&&Jt(a)==3?h.j():this.Y(a)},Ht.prototype.Y=function(a){try{if(a==this.g)e:{const Y=Jt(this.g),we=this.g.ya(),oe=this.g.ca();if(!(Y<3)&&(Y!=3||this.g&&(this.h.h||this.g.la()||Ch(this.g)))){this.K||Y!=4||we==7||(we==8||oe<=0?_s(3):_s(2)),sc(this);var h=this.g.ca();this.X=h;var d=F_(this);if(this.o=h==200,k_(this.i,this.v,this.B,this.l,this.S,Y,h),this.o){if(this.U&&!this.L){t:{if(this.g){var m,P=this.g;if((m=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(m)){var V=m;break t}}V=null}if(a=V)Ir(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ic(this,a);else{this.o=!1,this.m=3,$e(12),Un(this),Ts(this);break e}}if(this.R){a=!0;let Pe;for(;!this.K&&this.C<d.length;)if(Pe=U_(this,d),Pe==nc){Y==4&&(this.m=4,$e(14),a=!1),Ir(this.i,this.l,null,"[Incomplete Response]");break}else if(Pe==uh){this.m=4,$e(15),Ir(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else Ir(this.i,this.l,Pe,null),ic(this,Pe);if(hh(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Y!=4||d.length!=0||this.h.h||(this.m=1,$e(16),a=!1),this.o=this.o&&a,!a)Ir(this.i,this.l,d,"[Invalid Chunked Response]"),Un(this),Ts(this);else if(d.length>0&&!this.W){this.W=!0;var U=this.j;U.g==this&&U.aa&&!U.P&&(U.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),fc(U),U.P=!0,$e(11))}}else Ir(this.i,this.l,d,null),ic(this,d);Y==4&&Un(this),this.o&&!this.K&&(Y==4?Mh(this.j,this):(this.o=!1,Zi(this)))}else Z_(this.g),h==400&&d.indexOf("Unknown SID")>0?(this.m=3,$e(12)):(this.m=0,$e(13)),Un(this),Ts(this)}}}catch{}finally{}};function F_(a){if(!hh(a))return a.g.la();const h=Ch(a.g);if(h==="")return"";let d="";const m=h.length,P=Jt(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Un(a),Ts(a),"";a.h.i=new o.TextDecoder}for(let V=0;V<m;V++)a.h.h=!0,d+=a.h.i.decode(h[V],{stream:!(P&&V==m-1)});return h.length=0,a.h.g+=d,a.C=0,a.h.g}function hh(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function U_(a,h){var d=a.C,m=h.indexOf(`
`,d);return m==-1?nc:(d=Number(h.substring(d,m)),isNaN(d)?uh:(m+=1,m+d>h.length?nc:(h=h.slice(m,m+d),a.C=m+d,h)))}Ht.prototype.cancel=function(){this.K=!0,Un(this)};function Zi(a){a.T=Date.now()+a.H,dh(a,a.H)}function dh(a,h){if(a.D!=null)throw Error("WatchDog timer not null");a.D=ys(l(a.aa,a),h)}function sc(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Ht.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(O_(this.i,this.B),this.M!=2&&(_s(),$e(17)),Un(this),this.m=2,Ts(this)):dh(this,this.T-a)};function Ts(a){a.j.I==0||a.K||Mh(a.j,a)}function Un(a){sc(a);var h=a.O;h&&typeof h.dispose=="function"&&h.dispose(),a.O=null,Zl(a.V),a.g&&(h=a.g,a.g=null,h.abort(),h.dispose())}function ic(a,h){try{var d=a.j;if(d.I!=0&&(d.g==a||oc(d.h,a))){if(!a.L&&oc(d.h,a)&&d.I==3){try{var m=d.Ba.g.parse(h)}catch{m=null}if(Array.isArray(m)&&m.length==3){var P=m;if(P[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)io(d),ro(d);else break e;dc(d),$e(18)}}else d.xa=P[1],0<d.xa-d.K&&P[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=ys(l(d.Va,d),6e3));mh(d.h)<=1&&d.ta&&(d.ta=void 0)}else qn(d,11)}else if((a.L||d.g==a)&&io(d),!y(h))for(P=d.Ba.g.parse(h),h=0;h<P.length;h++){let oe=P[h];const Pe=oe[0];if(!(Pe<=d.K))if(d.K=Pe,oe=oe[1],d.I==2)if(oe[0]=="c"){d.M=oe[1],d.ba=oe[2];const pt=oe[3];pt!=null&&(d.ka=pt,d.j.info("VER="+d.ka));const $n=oe[4];$n!=null&&(d.za=$n,d.j.info("SVER="+d.za));const Xt=oe[5];Xt!=null&&typeof Xt=="number"&&Xt>0&&(m=1.5*Xt,d.O=m,d.j.info("backChannelRequestTimeoutMs_="+m)),m=d;const Zt=a.g;if(Zt){const ao=Zt.g?Zt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ao){var V=m.h;V.g||ao.indexOf("spdy")==-1&&ao.indexOf("quic")==-1&&ao.indexOf("h2")==-1||(V.j=V.l,V.g=new Set,V.h&&(ac(V,V.h),V.h=null))}if(m.G){const pc=Zt.g?Zt.g.getResponseHeader("X-HTTP-Session-Id"):null;pc&&(m.wa=pc,le(m.J,m.G,pc))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),m=d;var U=a;if(m.na=Bh(m,m.L?m.ba:null,m.W),U.L){gh(m.h,U);var Y=U,we=m.O;we&&(Y.H=we),Y.D&&(sc(Y),Zi(Y)),m.g=U}else Oh(m);d.i.length>0&&so(d)}else oe[0]!="stop"&&oe[0]!="close"||qn(d,7);else d.I==3&&(oe[0]=="stop"||oe[0]=="close"?oe[0]=="stop"?qn(d,7):hc(d):oe[0]!="noop"&&d.l&&d.l.qa(oe),d.A=0)}}_s(4)}catch{}}var B_=class{constructor(a,h){this.g=a,this.map=h}};function fh(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function ph(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function mh(a){return a.h?1:a.g?a.g.size:0}function oc(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function ac(a,h){a.g?a.g.add(h):a.h=h}function gh(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}fh.prototype.cancel=function(){if(this.i=_h(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function _h(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const d of a.g.values())h=h.concat(d.G);return h}return R(a.i)}var yh=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function q_(a,h){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const m=a[d].indexOf("=");let P,V=null;m>=0?(P=a[d].substring(0,m),V=a[d].substring(m+1)):P=a[d],h(P,V?decodeURIComponent(V.replace(/\+/g," ")):"")}}}function Qt(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let h;a instanceof Qt?(this.l=a.l,ws(this,a.j),this.o=a.o,this.g=a.g,vs(this,a.u),this.h=a.h,cc(this,Ah(a.i)),this.m=a.m):a&&(h=String(a).match(yh))?(this.l=!1,ws(this,h[1]||"",!0),this.o=As(h[2]||""),this.g=As(h[3]||"",!0),vs(this,h[4]),this.h=As(h[5]||"",!0),cc(this,h[6]||"",!0),this.m=As(h[7]||"")):(this.l=!1,this.i=new Ps(null,this.l))}Qt.prototype.toString=function(){const a=[];var h=this.j;h&&a.push(Rs(h,Ih,!0),":");var d=this.g;return(d||h=="file")&&(a.push("//"),(h=this.o)&&a.push(Rs(h,Ih,!0),"@"),a.push(Es(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Rs(d,d.charAt(0)=="/"?z_:j_,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Rs(d,K_)),a.join("")},Qt.prototype.resolve=function(a){const h=ft(this);let d=!!a.j;d?ws(h,a.j):d=!!a.o,d?h.o=a.o:d=!!a.g,d?h.g=a.g:d=a.u!=null;var m=a.h;if(d)vs(h,a.u);else if(d=!!a.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var P=h.h.lastIndexOf("/");P!=-1&&(m=h.h.slice(0,P+1)+m)}if(P=m,P==".."||P==".")m="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){m=P.lastIndexOf("/",0)==0,P=P.split("/");const V=[];for(let U=0;U<P.length;){const Y=P[U++];Y=="."?m&&U==P.length&&V.push(""):Y==".."?((V.length>1||V.length==1&&V[0]!="")&&V.pop(),m&&U==P.length&&V.push("")):(V.push(Y),m=!0)}m=V.join("/")}else m=P}return d?h.h=m:d=a.i.toString()!=="",d?cc(h,Ah(a.i)):d=!!a.m,d&&(h.m=a.m),h};function ft(a){return new Qt(a)}function ws(a,h,d){a.j=d?As(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function vs(a,h){if(h){if(h=Number(h),isNaN(h)||h<0)throw Error("Bad port number "+h);a.u=h}else a.u=null}function cc(a,h,d){h instanceof Ps?(a.i=h,W_(a.i,a.l)):(d||(h=Rs(h,G_)),a.i=new Ps(h,a.l))}function le(a,h,d){a.i.set(h,d)}function eo(a){return le(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function As(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Rs(a,h,d){return typeof a=="string"?(a=encodeURI(a).replace(h,$_),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function $_(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Ih=/[#\/\?@]/g,j_=/[#\?:]/g,z_=/[#\?]/g,G_=/[#\?@]/g,K_=/#/g;function Ps(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function Bn(a){a.g||(a.g=new Map,a.h=0,a.i&&q_(a.i,function(h,d){a.add(decodeURIComponent(h.replace(/\+/g," ")),d)}))}r=Ps.prototype,r.add=function(a,h){Bn(this),this.i=null,a=Er(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(h),this.h+=1,this};function Eh(a,h){Bn(a),h=Er(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function Th(a,h){return Bn(a),h=Er(a,h),a.g.has(h)}r.forEach=function(a,h){Bn(this),this.g.forEach(function(d,m){d.forEach(function(P){a.call(h,P,m,this)},this)},this)};function wh(a,h){Bn(a);let d=[];if(typeof h=="string")Th(a,h)&&(d=d.concat(a.g.get(Er(a,h))));else for(a=Array.from(a.g.values()),h=0;h<a.length;h++)d=d.concat(a[h]);return d}r.set=function(a,h){return Bn(this),this.i=null,a=Er(this,a),Th(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},r.get=function(a,h){return a?(a=wh(this,a),a.length>0?String(a[0]):h):h};function vh(a,h,d){Eh(a,h),d.length>0&&(a.i=null,a.g.set(Er(a,h),R(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(let m=0;m<h.length;m++){var d=h[m];const P=Es(d);d=wh(this,d);for(let V=0;V<d.length;V++){let U=P;d[V]!==""&&(U+="="+Es(d[V])),a.push(U)}}return this.i=a.join("&")};function Ah(a){const h=new Ps;return h.i=a.i,a.g&&(h.g=new Map(a.g),h.h=a.h),h}function Er(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function W_(a,h){h&&!a.j&&(Bn(a),a.i=null,a.g.forEach(function(d,m){const P=m.toLowerCase();m!=P&&(Eh(this,m),vh(this,P,d))},a)),a.j=h}function H_(a,h){const d=new Is;if(o.Image){const m=new Image;m.onload=f(Yt,d,"TestLoadImage: loaded",!0,h,m),m.onerror=f(Yt,d,"TestLoadImage: error",!1,h,m),m.onabort=f(Yt,d,"TestLoadImage: abort",!1,h,m),m.ontimeout=f(Yt,d,"TestLoadImage: timeout",!1,h,m),o.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else h(!1)}function Q_(a,h){const d=new Is,m=new AbortController,P=setTimeout(()=>{m.abort(),Yt(d,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:m.signal}).then(V=>{clearTimeout(P),V.ok?Yt(d,"TestPingServer: ok",!0,h):Yt(d,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(P),Yt(d,"TestPingServer: error",!1,h)})}function Yt(a,h,d,m,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),m(d)}catch{}}function Y_(){this.g=new D_}function uc(a){this.i=a.Sb||null,this.h=a.ab||!1}p(uc,eh),uc.prototype.g=function(){return new to(this.i,this.h)};function to(a,h){ke.call(this),this.H=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}p(to,ke),r=to.prototype,r.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=h,this.readyState=1,Ss(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const h={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(h.body=a),(this.H||o).fetch(new Request(this.D,h)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,bs(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ss(this)),this.g&&(this.readyState=3,Ss(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Rh(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Rh(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.B.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?bs(this):Ss(this),this.readyState==3&&Rh(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,bs(this))},r.Na=function(a){this.g&&(this.response=a,bs(this))},r.ga=function(){this.g&&bs(this)};function bs(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Ss(a)}r.setRequestHeader=function(a,h){this.A.append(a,h)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var d=h.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=h.next();return a.join(`\r
`)};function Ss(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(to.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Ph(a){let h="";return Hi(a,function(d,m){h+=m,h+=":",h+=d,h+=`\r
`}),h}function lc(a,h,d){e:{for(m in d){var m=!1;break e}m=!0}m||(d=Ph(d),typeof a=="string"?d!=null&&Es(d):le(a,h,d))}function me(a){ke.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}p(me,ke);var J_=/^https?$/i,X_=["POST","PUT"];r=me.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,h,d,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():ah.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(V){bh(this,V);return}if(a=d||"",d=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var P in m)d.set(P,m[P]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const V of m.keys())d.set(V,m.get(V));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(d.keys()).find(V=>V.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(X_,h,void 0)>=0)||m||P||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[V,U]of d)this.g.setRequestHeader(V,U);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(V){bh(this,V)}};function bh(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.o=5,Sh(a),no(a)}function Sh(a){a.A||(a.A=!0,qe(a,"complete"),qe(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,qe(this,"complete"),qe(this,"abort"),no(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),no(this,!0)),me.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Vh(this):this.Xa())},r.Xa=function(){Vh(this)};function Vh(a){if(a.h&&typeof i<"u"){if(a.v&&Jt(a)==4)setTimeout(a.Ca.bind(a),0);else if(qe(a,"readystatechange"),Jt(a)==4){a.h=!1;try{const V=a.ca();e:switch(V){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var d;if(!(d=h)){var m;if(m=V===0){let U=String(a.D).match(yh)[1]||null;!U&&o.self&&o.self.location&&(U=o.self.location.protocol.slice(0,-1)),m=!J_.test(U?U.toLowerCase():"")}d=m}if(d)qe(a,"complete"),qe(a,"success");else{a.o=6;try{var P=Jt(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",Sh(a)}}finally{no(a)}}}}function no(a,h){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,h||qe(a,"ready");try{d.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Jt(a){return a.g?a.g.readyState:0}r.ca=function(){try{return Jt(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),x_(h)}};function Ch(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function Z_(a){const h={};a=(a.g&&Jt(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(y(a[m]))continue;var d=M_(a[m]);const P=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const V=h[P]||[];h[P]=V,V.push(d)}R_(h,function(m){return m.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Vs(a,h,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||h}function xh(a){this.za=0,this.i=[],this.j=new Is,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Vs("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Vs("baseRetryDelayMs",5e3,a),this.Za=Vs("retryDelaySeedMs",1e4,a),this.Ta=Vs("forwardChannelMaxRetries",2,a),this.va=Vs("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new fh(a&&a.concurrentRequestLimit),this.Ba=new Y_,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=xh.prototype,r.ka=8,r.I=1,r.connect=function(a,h,d,m){$e(0),this.W=a,this.H=h||{},d&&m!==void 0&&(this.H.OSID=d,this.H.OAID=m),this.F=this.X,this.J=Bh(this,null,this.W),so(this)};function hc(a){if(Dh(a),a.I==3){var h=a.V++,d=ft(a.J);if(le(d,"SID",a.M),le(d,"RID",h),le(d,"TYPE","terminate"),Cs(a,d),h=new Ht(a,a.j,h),h.M=2,h.A=eo(ft(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(h.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=h.A,d=!0),d||(h.g=qh(h.j,null),h.g.ea(h.A)),h.F=Date.now(),Zi(h)}Uh(a)}function ro(a){a.g&&(fc(a),a.g.cancel(),a.g=null)}function Dh(a){ro(a),a.v&&(o.clearTimeout(a.v),a.v=null),io(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function so(a){if(!ph(a.h)&&!a.m){a.m=!0;var h=a.Ea;te||_(),ne||(te(),ne=!0),T.add(h,a),a.D=0}}function ey(a,h){return mh(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=h.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=ys(l(a.Ea,a,h),Fh(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const P=new Ht(this,this.j,a);let V=this.o;if(this.U&&(V?(V=zl(V),Kl(V,this.U)):V=this.U),this.u!==null||this.R||(P.J=V,V=null),this.S)e:{for(var h=0,d=0;d<this.i.length;d++){t:{var m=this.i[d];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(h+=m,h>4096){h=d;break e}if(h===4096||d===this.i.length-1){h=d+1;break e}}h=1e3}else h=1e3;h=kh(this,P,h),d=ft(this.J),le(d,"RID",a),le(d,"CVER",22),this.G&&le(d,"X-HTTP-Session-Id",this.G),Cs(this,d),V&&(this.R?h="headers="+Es(Ph(V))+"&"+h:this.u&&lc(d,this.u,V)),ac(this.h,P),this.Ra&&le(d,"TYPE","init"),this.S?(le(d,"$req",h),le(d,"SID","null"),P.U=!0,rc(P,d,null)):rc(P,d,h),this.I=2}}else this.I==3&&(a?Nh(this,a):this.i.length==0||ph(this.h)||Nh(this))};function Nh(a,h){var d;h?d=h.l:d=a.V++;const m=ft(a.J);le(m,"SID",a.M),le(m,"RID",d),le(m,"AID",a.K),Cs(a,m),a.u&&a.o&&lc(m,a.u,a.o),d=new Ht(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),h&&(a.i=h.G.concat(a.i)),h=kh(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),ac(a.h,d),rc(d,m,h)}function Cs(a,h){a.H&&Hi(a.H,function(d,m){le(h,m,d)}),a.l&&Hi({},function(d,m){le(h,m,d)})}function kh(a,h,d){d=Math.min(a.i.length,d);const m=a.l?l(a.l.Ka,a.l,a):null;e:{var P=a.i;let Y=-1;for(;;){const we=["count="+d];Y==-1?d>0?(Y=P[0].g,we.push("ofs="+Y)):Y=0:we.push("ofs="+Y);let oe=!0;for(let Pe=0;Pe<d;Pe++){var V=P[Pe].g;const pt=P[Pe].map;if(V-=Y,V<0)Y=Math.max(0,P[Pe].g-100),oe=!1;else try{V="req"+V+"_"||"";try{var U=pt instanceof Map?pt:Object.entries(pt);for(const[$n,Xt]of U){let Zt=Xt;c(Xt)&&(Zt=Xa(Xt)),we.push(V+$n+"="+encodeURIComponent(Zt))}}catch($n){throw we.push(V+"type="+encodeURIComponent("_badmap")),$n}}catch{m&&m(pt)}}if(oe){U=we.join("&");break e}}U=void 0}return a=a.i.splice(0,d),h.G=a,U}function Oh(a){if(!a.g&&!a.v){a.Y=1;var h=a.Da;te||_(),ne||(te(),ne=!0),T.add(h,a),a.A=0}}function dc(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=ys(l(a.Da,a),Fh(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Lh(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=ys(l(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,$e(10),ro(this),Lh(this))};function fc(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Lh(a){a.g=new Ht(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var h=ft(a.na);le(h,"RID","rpc"),le(h,"SID",a.M),le(h,"AID",a.K),le(h,"CI",a.F?"0":"1"),!a.F&&a.ia&&le(h,"TO",a.ia),le(h,"TYPE","xmlhttp"),Cs(a,h),a.u&&a.o&&lc(h,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=eo(ft(h)),d.u=null,d.R=!0,lh(d,a)}r.Va=function(){this.C!=null&&(this.C=null,ro(this),dc(this),$e(19))};function io(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Mh(a,h){var d=null;if(a.g==h){io(a),fc(a),a.g=null;var m=2}else if(oc(a.h,h))d=h.G,gh(a.h,h),m=1;else return;if(a.I!=0){if(h.o)if(m==1){d=h.u?h.u.length:0,h=Date.now()-h.F;var P=a.D;m=Ji(),qe(m,new ih(m,d)),so(a)}else Oh(a);else if(P=h.m,P==3||P==0&&h.X>0||!(m==1&&ey(a,h)||m==2&&dc(a)))switch(d&&d.length>0&&(h=a.h,h.i=h.i.concat(d)),P){case 1:qn(a,5);break;case 4:qn(a,10);break;case 3:qn(a,6);break;default:qn(a,2)}}}function Fh(a,h){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*h}function qn(a,h){if(a.j.info("Error code "+h),h==2){var d=l(a.bb,a),m=a.Ua;const P=!m;m=new Qt(m||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||ws(m,"https"),eo(m),P?H_(m.toString(),d):Q_(m.toString(),d)}else $e(2);a.I=0,a.l&&a.l.pa(h),Uh(a),Dh(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),$e(2)):(this.j.info("Failed to ping google.com"),$e(1))};function Uh(a){if(a.I=0,a.ja=[],a.l){const h=_h(a.h);(h.length!=0||a.i.length!=0)&&(C(a.ja,h),C(a.ja,a.i),a.h.i.length=0,R(a.i),a.i.length=0),a.l.oa()}}function Bh(a,h,d){var m=d instanceof Qt?ft(d):new Qt(d);if(m.g!="")h&&(m.g=h+"."+m.g),vs(m,m.u);else{var P=o.location;m=P.protocol,h=h?h+"."+P.hostname:P.hostname,P=+P.port;const V=new Qt(null);m&&ws(V,m),h&&(V.g=h),P&&vs(V,P),d&&(V.h=d),m=V}return d=a.G,h=a.wa,d&&h&&le(m,d,h),le(m,"VER",a.ka),Cs(a,m),m}function qh(a,h,d){if(h&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Aa&&!a.ma?new me(new uc({ab:d})):new me(a.ma),h.Fa(a.L),h}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function $h(){}r=$h.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function oo(){}oo.prototype.g=function(a,h){return new Je(a,h)};function Je(a,h){ke.call(this),this.g=new xh(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.sa&&(a?a["X-WebChannel-Client-Profile"]=h.sa:a={"X-WebChannel-Client-Profile":h.sa}),this.g.U=a,(a=h&&h.Qb)&&!y(a)&&(this.g.u=a),this.A=h&&h.supportsCrossDomainXhr||!1,this.v=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!y(h)&&(this.g.G=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new Tr(this)}p(Je,ke),Je.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Je.prototype.close=function(){hc(this.g)},Je.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Xa(a),a=d);h.i.push(new B_(h.Ya++,a)),h.I==3&&so(h)},Je.prototype.N=function(){this.g.l=null,delete this.j,hc(this.g),delete this.g,Je.Z.N.call(this)};function jh(a){Za.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const d in h){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}p(jh,Za);function zh(){ec.call(this),this.status=1}p(zh,ec);function Tr(a){this.g=a}p(Tr,$h),Tr.prototype.ra=function(){qe(this.g,"a")},Tr.prototype.qa=function(a){qe(this.g,new jh(a))},Tr.prototype.pa=function(a){qe(this.g,new zh)},Tr.prototype.oa=function(){qe(this.g,"b")},oo.prototype.createWebChannel=oo.prototype.g,Je.prototype.send=Je.prototype.o,Je.prototype.open=Je.prototype.m,Je.prototype.close=Je.prototype.close,Gp=function(){return new oo},zp=function(){return Ji()},jp=Fn,Bc={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Xi.NO_ERROR=0,Xi.TIMEOUT=8,Xi.HTTP_ERROR=6,vo=Xi,oh.COMPLETE="complete",$p=oh,th.EventType=gs,gs.OPEN="a",gs.CLOSE="b",gs.ERROR="c",gs.MESSAGE="d",ke.prototype.listen=ke.prototype.J,Us=th,me.prototype.listenOnce=me.prototype.K,me.prototype.getLastError=me.prototype.Ha,me.prototype.getLastErrorCode=me.prototype.ya,me.prototype.getStatus=me.prototype.ca,me.prototype.getResponseJson=me.prototype.La,me.prototype.getResponseText=me.prototype.la,me.prototype.send=me.prototype.ea,me.prototype.setWithCredentials=me.prototype.Fa,qp=me}).apply(typeof uo<"u"?uo:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Se.UNAUTHENTICATED=new Se(null),Se.GOOGLE_CREDENTIALS=new Se("google-credentials-uid"),Se.FIRST_PARTY=new Se("first-party-uid"),Se.MOCK_USER=new Se("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let as="12.15.0";function jT(r){as=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tn=new yu("@firebase/firestore");function Vr(){return Tn.logLevel}function fb(r){Tn.setLogLevel(r)}function D(r,...e){if(Tn.logLevel<=X.DEBUG){const t=e.map(Su);Tn.debug(`Firestore (${as}): ${r}`,...t)}}function ye(r,...e){if(Tn.logLevel<=X.ERROR){const t=e.map(Su);Tn.error(`Firestore (${as}): ${r}`,...t)}}function at(r,...e){if(Tn.logLevel<=X.WARN){const t=e.map(Su);Tn.warn(`Firestore (${as}): ${r}`,...t)}}function Su(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,Kp(r,n,t)}function Kp(r,e,t){let n=`FIRESTORE (${as}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw ye(n),new Error(n)}function k(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||Kp(e,s,n)}function q(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends jt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wp{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class zT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Se.UNAUTHENTICATED)))}shutdown(){}}class GT{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class KT{constructor(e){this.t=e,this.currentUser=Se.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){k(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new At;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new At,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new At)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(k(typeof n.accessToken=="string",31837,{l:n}),new Wp(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return k(e===null||typeof e=="string",2055,{h:e}),new Se(e)}}class WT{constructor(e,t,n){this.T=e,this.P=t,this.R=n,this.type="FirstParty",this.user=Se.FIRST_PARTY,this.I=new Map}A(){return this.R?this.R():null}get headers(){this.I.set("X-Goog-AuthUser",this.T);const e=this.A();return e&&this.I.set("Authorization",e),this.P&&this.I.set("X-Goog-Iam-Authorization-Token",this.P),this.I}}class HT{constructor(e,t,n){this.T=e,this.P=t,this.R=n}getToken(){return Promise.resolve(new WT(this.T,this.P,this.R))}start(e,t){e.enqueueRetryable((()=>t(Se.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class wd{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class QT{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,st(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){k(this.o===void 0,3512);const n=i=>{i.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,D("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new wd(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(k(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new wd(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YT(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=YT(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function K(r,e){return r<e?-1:r>e?1:0}function qc(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return wc(s)===wc(i)?K(s,i):wc(s)?1:-1}return K(r.length,e.length)}const JT=55296,XT=57343;function wc(r){const e=r.charCodeAt(0);return e>=JT&&e<=XT}function Br(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function Hp(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _t="__name__";class mt{constructor(e,t,n){t===void 0?t=0:t>e.length&&B(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&B(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return mt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof mt?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=mt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return K(e.length,t.length)}static compareSegments(e,t){const n=mt.isNumericId(e),s=mt.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?mt.extractNumericId(e).compare(mt.extractNumericId(t)):qc(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return gn.fromString(e.substring(4,e.length-2))}}class J extends mt{construct(e,t,n){return new J(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new J(t)}static emptyPath(){return new J([])}}const ZT=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class he extends mt{construct(e,t,n){return new he(e,t,n)}static isValidIdentifier(e){return ZT.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),he.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_t}static keyField(){return new he([_t])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(n+=c,s++):(i(),s++)}if(i(),o)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new he(t)}static emptyPath(){return new he([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(e){this.path=e}static fromPath(e){return new F(J.fromString(e))}static fromName(e){return new F(J.fromString(e).popFirst(5))}static empty(){return new F(J.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&J.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return J.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new F(new J(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cu(r,e,t){if(!t)throw new N(S.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function ew(r,e,t,n){if(e===!0&&n===!0)throw new N(S.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function vd(r){if(!F.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Ad(r){if(F.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Vi(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function ya(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":B(12329,{type:typeof r})}function je(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ya(r);throw new N(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function tw(r,e){if(e<=0)throw new N(S.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(r,e){const t={typeString:r};return e&&(t.value=e),t}function Ci(r,e){if(!Vi(r))throw new N(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new N(S.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rd=-62135596800,Pd=1e6;class se{static now(){return se.fromMillis(Date.now())}static fromDate(e){return se.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Pd);return new se(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Rd)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Pd}_compareTo(e){return this.seconds===e.seconds?K(this.nanoseconds,e.nanoseconds):K(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:se._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ci(e,se._jsonSchema))return new se(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Rd;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}se._jsonSchemaVersion="firestore/timestamp/1.0",se._jsonSchema={type:Ee("string",se._jsonSchemaVersion),seconds:Ee("number"),nanoseconds:Ee("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${static fromTimestamp(e){return new $(e)}static min(){return new $(new se(0,0))}static max(){return new $(new se(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qr=-1;class zo{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function $c(r){return r.fields.find((e=>e.kind===2))}function zn(r){return r.fields.filter((e=>e.kind!==2))}zo.UNKNOWN_ID=-1;class Ao{constructor(e,t){this.fieldPath=e,this.kind=t}}class ii{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new ii(0,nt.min())}}function Qp(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=$.fromTimestamp(n===1e9?new se(t+1,0):new se(t,n));return new nt(s,F.empty(),e)}function Yp(r){return new nt(r.readTime,r.key,qr)}class nt{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new nt($.min(),F.empty(),qr)}static max(){return new nt($.max(),F.empty(),qr)}}function xu(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=F.comparator(r.documentKey,e.documentKey),t!==0?t:K(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Xp{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dn(r){if(r.code!==S.FAILED_PRECONDITION||r.message!==Jp)throw r;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&B(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new A(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof A?t:A.resolve(t)}catch(t){return A.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):A.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):A.reject(t)}static resolve(e){return new A(((t,n)=>{t(e)}))}static reject(e){return new A(((t,n)=>{n(e)}))}static waitFor(e){return new A(((t,n)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=A.resolve(!1);for(const n of e)t=t.next((s=>s?A.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new A(((n,s)=>{const i=e.length,o=new Array(i);let c=0;for(let u=0;u<i;u++){const l=u;t(e[l]).next((f=>{o[l]=f,++c,c===i&&n(o)}),(f=>s(f)))}}))}static doWhile(e,t){return new A(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze="SimpleDb";class Ia{static open(e,t,n,s){try{return new Ia(t,e.transaction(s,n))}catch(i){throw new Gs(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.v=new At,this.transaction.oncomplete=()=>{this.v.resolve()},this.transaction.onabort=()=>{t.error?this.v.reject(new Gs(e,t.error)):this.v.resolve()},this.transaction.onerror=n=>{const s=Du(n.target.error);this.v.reject(new Gs(e,s))}}get S(){return this.v.promise}abort(e){e&&this.v.reject(e),this.aborted||(D(Ze,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}D(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new rw(t)}}class _n{static delete(e){return D(Ze,"Removing database:",e),Kn(Gf().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!Zf())return!1;if(_n.F())return!0;const e=Ae(),t=_n.O(e),n=0<t&&t<10,s=Zp(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static M(e,t){return e.store(t)}static O(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.L=null,_n.O(Ae())===12.2&&ye("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async B(e){return this.db||(D(Ze,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new Gs(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new N(S.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new N(S.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Gs(e,o))},s.onupgradeneeded=i=>{D(Ze,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.U(o,s.transaction,i.oldVersion,this.version).next((()=>{D(Ze,"Database upgrade to version "+this.version+" complete")}))}}))),this.k&&(this.db.onversionchange=t=>this.k(t)),this.db}q(e){this.k=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.B(e);const c=Ia.open(this.db,e,i?"readonly":"readwrite",n),u=s(c).next((l=>(c.D(),l))).catch((l=>(c.abort(l),A.reject(l)))).toPromise();return u.catch((()=>{})),await c.S,u}catch(c){const u=c,l=u.name!=="FirebaseError"&&o<3;if(D(Ze,"Transaction failed with error:",u.message,"Retrying:",l),this.close(),!l)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Zp(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class nw{constructor(e){this.$=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.$=e}done(){this.K=!0}j(e){this.W=e}delete(){return Kn(this.$.delete())}}class Gs extends N{constructor(e,t){super(S.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Nn(r){return r.name==="IndexedDbTransactionError"}class rw{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(D(Ze,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(D(Ze,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Kn(n)}add(e){return D(Ze,"ADD",this.store.name,e,e),Kn(this.store.add(e))}get(e){return Kn(this.store.get(e)).next((t=>(t===void 0&&(t=null),D(Ze,"GET",this.store.name,e,t),t)))}delete(e){return D(Ze,"DELETE",this.store.name,e),Kn(this.store.delete(e))}count(){return D(Ze,"COUNT",this.store.name),Kn(this.store.count())}H(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new A(((o,c)=>{i.onerror=u=>{c(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.J(i,((c,u)=>{o.push(u)})).next((()=>o))}}Y(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new A(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}Z(e,t){D(Ze,"DELETE ALL",this.store.name);const n=this.options(e,t);n.X=!1;const s=this.cursor(n);return this.J(s,((i,o,c)=>c.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.J(s,t)}te(e){const t=this.cursor({});return new A(((n,s)=>{t.onerror=i=>{const o=Du(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((c=>{c?o.continue():n()})):n()}}))}J(e,t){const n=[];return new A(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void s();const u=new nw(c),l=t(c.primaryKey,c.value,u);if(l instanceof A){const f=l.catch((p=>(u.done(),A.reject(p))));n.push(f)}u.isDone?s():u.G===null?c.continue():c.continue(u.G)}})).next((()=>A.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Kn(r){return new A(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Du(n.target.error);t(s)}}))}let bd=!1;function Du(r){const e=_n.O(Ae());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new N("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return bd||(bd=!0,setTimeout((()=>{throw n}),0)),n}}return r}const Ks="IndexBackfiller";class sw{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){D(Ks,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();D(Ks,`Documents written: ${t}`)}catch(t){Nn(t)?D(Ks,"Ignoring IndexedDB error during index backfill: ",t):await Dn(t)}await this.re(6e4)}))}}class iw{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return A.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return D(Ks,`Processing collection: ${o}`),this._e(e,o,s).next((c=>{s-=c,n.add(o)}));i=!1})))).next((()=>t-s))}_e(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this.oe(s,i))).next((c=>(D(Ks,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c)))).next((()=>o.size))}))))}oe(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=Yp(i);xu(o,n)>0&&(n=o)})),new nt(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Ke.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zn=-1;function Ea(r){return r==null}function $r(r){return r===0&&1/r==-1/0}function em(r){return typeof r=="number"&&Number.isInteger(r)&&!$r(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function ow(r){return typeof r=="string"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Go="";function Fe(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Sd(e)),e=aw(r.get(t),e);return Sd(e)}function aw(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Go:t+="";break;default:t+=i}}return t}function Sd(r){return r+Go+""}function yt(r){const e=r.length;if(k(e>=2,64408,{path:r}),e===2)return k(r.charAt(0)===Go&&r.charAt(1)==="",56145,{path:r}),J.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(Go,i);switch((o<0||o>t)&&B(50515,{path:r}),r.charAt(o+1)){case"":const c=r.substring(i,o);let u;s.length===0?u=c:(s+=c,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:B(61167,{path:r})}i=o+2}return new J(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gn="remoteDocuments",xi="owner",wr="owner",oi="mutationQueues",cw="userId",ut="mutations",Vd="batchId",Jn="userMutationsIndex",Cd=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ro(r,e){return[r,Fe(e)]}function tm(r,e,t){return[r,Fe(e),t]}const uw={},jr="documentMutations",Ko="remoteDocumentsV14",lw=["prefixPath","collectionGroup","readTime","documentId"],Po="documentKeyIndex",hw=["prefixPath","collectionGroup","documentId"],nm="collectionGroupIndex",dw=["collectionGroup","readTime","prefixPath","documentId"],ai="remoteDocumentGlobal",jc="remoteDocumentGlobalKey",zr="targets",rm="queryTargetsIndex",fw=["canonicalId","targetId"],Gr="targetDocuments",pw=["targetId","path"],Nu="documentTargetsIndex",mw=["path","targetId"],Wo="targetGlobalKey",er="targetGlobal",ci="collectionParents",gw=["collectionId","parent"],Kr="clientMetadata",_w="clientId",Ta="bundles",yw="bundleId",wa="namedQueries",Iw="name",ku="indexConfiguration",Ew="indexId",zc="collectionGroupIndex",Tw="collectionGroup",Ws="indexState",ww=["indexId","uid"],sm="sequenceNumberIndex",vw=["uid","sequenceNumber"],Hs="indexEntries",Aw=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],im="documentKeyIndex",Rw=["indexId","uid","orderedDocumentKey"],va="documentOverlays",Pw=["userId","collectionPath","documentId"],Gc="collectionPathOverlayIndex",bw=["userId","collectionPath","largestBatchId"],om="collectionGroupOverlayIndex",Sw=["userId","collectionGroup","largestBatchId"],Ou="globals",Vw="name",am=[oi,ut,jr,Gn,zr,xi,er,Gr,Kr,ai,ci,Ta,wa],Cw=[...am,va],cm=[oi,ut,jr,Ko,zr,xi,er,Gr,Kr,ai,ci,Ta,wa,va],um=cm,Lu=[...um,ku,Ws,Hs],xw=Lu,lm=[...Lu,Ou],Dw=lm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc extends Xp{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function Re(r,e){const t=q(r);return _n.M(t.le,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e,t){this.comparator=e,this.root=t||xe.EMPTY}insert(e,t){return new ae(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,xe.BLACK,null,null))}remove(e){return new ae(this.comparator,this.root.remove(e,this.comparator).copy(null,null,xe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new lo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new lo(this.root,e,this.comparator,!1)}getReverseIterator(){return new lo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new lo(this.root,e,this.comparator,!0)}}class lo{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class xe{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??xe.RED,this.left=s??xe.EMPTY,this.right=i??xe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new xe(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return xe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return xe.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,xe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,xe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw B(43730,{key:this.key,value:this.value});if(this.right.isRed())throw B(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw B(27949);return e+(this.isRed()?0:1)}}xe.EMPTY=null,xe.RED=!0,xe.BLACK=!1;xe.EMPTY=new class{constructor(){this.size=0}get key(){throw B(57766)}get value(){throw B(16141)}get color(){throw B(16727)}get left(){throw B(29726)}get right(){throw B(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new xe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e){this.comparator=e,this.data=new ae(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new xd(this.data.getIterator())}getIteratorFrom(e){return new xd(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof re)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new re(this.comparator);return t.data=e,t}}class xd{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function vr(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.fields=e,e.sort(he.comparator)}static empty(){return new We([])}unionWith(e){let t=new re(he.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new We(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Br(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function kn(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Nw(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function hm(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dm extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new dm("Invalid base64 string: "+i):i}})(e);return new de(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new de(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return K(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}de.EMPTY_BYTE_STRING=new de("");const kw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Mt(r){if(k(!!r,39018),typeof r=="string"){let e=0;const t=kw.exec(r);if(k(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:ce(r.seconds),nanos:ce(r.nanos)}}function ce(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Ft(r){return typeof r=="string"?de.fromBase64String(r):de.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fm="server_timestamp",pm="__type__",mm="__previous_value__",gm="__local_write_time__";function Di(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[pm])==null?void 0:n.stringValue)===fm}function Ni(r){const e=r.mapValue.fields[mm];return Di(e)?Ni(e):e}function Wr(r){const e=Mt(r.mapValue.fields[gm].timestampValue);return new se(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ow{constructor(e,t,n,s,i,o,c,u,l,f,p){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=f,this.apiKey=p}}const Qo="(default)";class ur{constructor(e,t){this.projectId=e,this.database=t||Qo}static empty(){return new ur("","")}get isDefaultDatabase(){return this.database===Qo}isEqual(e){return e instanceof ur&&e.projectId===this.projectId&&e.database===this.database}}function Lw(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ur(r.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mu="__type__",_m="__max__",dn={mapValue:{fields:{__type__:{stringValue:_m}}}},Fu="__vector__",lr="value",Rt={nullValue:"NULL_VALUE"},Qe={booleanValue:!0},Ve={booleanValue:!1};function Te(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Di(r)?4:ym(r)?9007199254740991:dr(r)?10:11:B(28295,{value:r})}function ct(r,e,t){if(r===e)return!0;const n=Te(r);if(n!==Te(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Wr(r).isEqual(Wr(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const c=Mt(i.timestampValue),u=Mt(o.timestampValue);return c.seconds===u.seconds&&c.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,o){return Ft(i.bytesValue).isEqual(Ft(o.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,o){return ce(i.geoPointValue.latitude)===ce(o.geoPointValue.latitude)&&ce(i.geoPointValue.longitude)===ce(o.geoPointValue.longitude)})(r,e);case 2:return(function(i,o,c){if("integerValue"in i&&"integerValue"in o)return ce(i.integerValue)===ce(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=ce(i.doubleValue),l=ce(o.doubleValue);else{if(!(c!=null&&c.Ee))return!1;u=ce(i.integerValue??i.doubleValue),l=ce(o.integerValue??o.doubleValue)}return u===l?!!(c!=null&&c.he)||$r(u)===$r(l):!!(c===void 0||c.Te)&&isNaN(u)&&isNaN(l)})(r,e,t);case 9:return Br(r.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>ct(s,i,t)));case 10:case 11:return(function(i,o,c){const u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(Ho(u)!==Ho(l))return!1;for(const f in u)if(u.hasOwnProperty(f)&&(l[f]===void 0||!ct(u[f],l[f],c)))return!1;return!0})(r,e,t);default:return B(52216,{left:r})}}function ui(r,e){return(r.values||[]).find((t=>ct(t,e)))!==void 0}function Ue(r,e){if(r===e)return 0;const t=Te(r),n=Te(e);if(t!==n)return K(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return K(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const c=ce(i.integerValue||i.doubleValue),u=ce(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(r,e);case 3:return Dd(r.timestampValue,e.timestampValue);case 4:return Dd(Wr(r),Wr(e));case 5:return qc(r.stringValue,e.stringValue);case 6:return(function(i,o){const c=Ft(i),u=Ft(o);return c.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const c=i.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){const f=K(c[l],u[l]);if(f!==0)return f}return K(c.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const c=K(ce(i.latitude),ce(o.latitude));return c!==0?c:K(ce(i.longitude),ce(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Nd(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var g,R,C,O;const c=i.fields||{},u=o.fields||{},l=(g=c[lr])==null?void 0:g.arrayValue,f=(R=u[lr])==null?void 0:R.arrayValue,p=K(((C=l==null?void 0:l.values)==null?void 0:C.length)||0,((O=f==null?void 0:f.values)==null?void 0:O.length)||0);return p!==0?p:Nd(l,f)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===dn.mapValue&&o===dn.mapValue)return 0;if(i===dn.mapValue)return 1;if(o===dn.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),l=o.fields||{},f=Object.keys(l);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const g=qc(u[p],f[p]);if(g!==0)return g;const R=Ue(c[u[p]],l[f[p]]);if(R!==0)return R}return K(u.length,f.length)})(r.mapValue,e.mapValue);default:throw B(23264,{Pe:t})}}function Dd(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return K(r,e);const t=Mt(r),n=Mt(e),s=K(t.seconds,n.seconds);return s!==0?s:K(t.nanos,n.nanos)}function Nd(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Ue(t[s],n[s]);if(i!==void 0&&i!==0)return i}return K(t.length,n.length)}function Hr(r){return Wc(r)}function Wc(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=Mt(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Ft(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return F.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=Wc(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Wc(t.fields[o])}`;return s+"}"})(r.mapValue):B(61005,{value:r})}function bo(r){switch(Te(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ni(r);return e?16+bo(e):16;case 5:return 2*r.stringValue.length;case 6:return Ft(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+bo(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return kn(n.fields,((i,o)=>{s+=i.length+bo(o)})),s})(r.mapValue);default:throw B(13486,{value:r})}}function hr(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function It(r){return!!r&&"integerValue"in r}function Xn(r){return!!r&&"doubleValue"in r}function wn(r){return It(r)||Xn(r)}function vn(r){return!!r&&"arrayValue"in r}function et(r){return!!r&&"nullValue"in r}function Ye(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function tr(r){return!!r&&"mapValue"in r}function dr(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[Mu])==null?void 0:n.stringValue)===Fu}function Hc(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[lr])==null?void 0:t.arrayValue}function Qs(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return kn(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Qs(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Qs(r.arrayValue.values[t]);return e}return{...r}}function ym(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===_m}const Im={mapValue:{fields:{[Mu]:{stringValue:Fu},[lr]:{arrayValue:{}}}}};function Mw(r){return"nullValue"in r?Rt:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?hr(ur.empty(),F.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?dr(r)?Im:{mapValue:{}}:B(35942,{value:r})}function Fw(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?hr(ur.empty(),F.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Im:"mapValue"in r?dr(r)?{mapValue:{}}:dn:B(61959,{value:r})}function kd(r,e){const t=Ue(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function Od(r,e){const t=Ue(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.value=e}static empty(){return new De({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!tr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Qs(t)}setAll(e){let t=he.emptyPath(),n={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=c.popLast()}o?n[c.lastSegment()]=Qs(o):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());tr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ct(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];tr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){kn(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new De(Qs(this.value))}}function Em(r){const e=[];return kn(r.fields,((t,n)=>{const s=new he([t]);if(tr(n)){const i=Em(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new We(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:$r(e)?"-0":e}}function Uu(r){return{integerValue:""+r}}function Bu(r,e,t){return Number.isInteger(e)&&(t!=null&&t.preferIntegers)||em(e)?Uu(e):Aa(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(){this._=void 0}}function Uw(r,e,t){return r instanceof li?(function(s,i){const o={fields:{[pm]:{stringValue:fm},[gm]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Di(i)&&(i=Ni(i)),i&&(o.fields[mm]=i),{mapValue:o}})(t,e):r instanceof Qr?wm(r,e):r instanceof Yr?vm(r,e):r instanceof Jr?(function(s,i){const o=Tm(s,i),c=Yo(o)+Yo(s.Re);return It(o)&&It(s.Re)?Uu(c):Aa(s.serializer,c)})(r,e):r instanceof hi?(function(s,i){return Ld(s,i,Math.min)})(r,e):r instanceof di?(function(s,i){return Ld(s,i,Math.max)})(r,e):void 0}function Bw(r,e,t){return r instanceof Qr?wm(r,e):r instanceof Yr?vm(r,e):t}function Tm(r,e){return r instanceof Jr?wn(e)?e:{integerValue:0}:null}class li extends Ra{}class Qr extends Ra{constructor(e){super(),this.elements=e}}function wm(r,e){const t=Am(e);for(const n of r.elements)t.some((s=>ct(s,n)))||t.push(n);return{arrayValue:{values:t}}}class Yr extends Ra{constructor(e){super(),this.elements=e}}function vm(r,e){let t=Am(e);for(const n of r.elements)t=t.filter((s=>!ct(s,n)));return{arrayValue:{values:t}}}class qu extends Ra{constructor(e,t){super(),this.serializer=e,this.Re=t}}class Jr extends qu{}class hi extends qu{}class di extends qu{}function Ld(r,e,t){if(!wn(e))return r.Re;const n=t(Yo(e),Yo(r.Re));return It(e)&&It(r.Re)?Uu(n):Aa(r.serializer,n)}function Yo(r){return ce(r.integerValue||r.doubleValue)}function Am(r){return vn(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qw{constructor(e,t){this.field=e,this.transform=t}}function $w(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof Qr&&s instanceof Qr||n instanceof Yr&&s instanceof Yr?Br(n.elements,s.elements,ct):n instanceof Jr&&s instanceof Jr||n instanceof hi&&s instanceof hi||n instanceof di&&s instanceof di?ct(n.Re,s.Re):n instanceof li&&s instanceof li})(r.transform,e.transform)}class jw{constructor(e,t){this.version=e,this.transformResults=t}}class Ce{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ce}static exists(e){return new Ce(void 0,e)}static updateTime(e){return new Ce(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function So(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Pa{}function Rm(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new ki(r.key,Ce.none()):new cs(r.key,r.data,Ce.none());{const t=r.data,n=De.empty();let s=new re(he.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Kt(r.key,n,new We(s.toArray()),Ce.none())}}function zw(r,e,t){r instanceof cs?(function(s,i,o){const c=s.value.clone(),u=Fd(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,e,t):r instanceof Kt?(function(s,i,o){if(!So(s.precondition,i))return void i.convertToUnknownDocument(o.version);const c=Fd(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Pm(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Ys(r,e,t,n){return r instanceof cs?(function(i,o,c,u){if(!So(i.precondition,o))return c;const l=i.value.clone(),f=Ud(i.fieldTransforms,u,o);return l.setAll(f),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(r,e,t,n):r instanceof Kt?(function(i,o,c,u){if(!So(i.precondition,o))return c;const l=Ud(i.fieldTransforms,u,o),f=o.data;return f.setAll(Pm(i)),f.setAll(l),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((p=>p.field)))})(r,e,t,n):(function(i,o,c){return So(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(r,e,t)}function Gw(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Tm(n.transform,s||null);i!=null&&(t===null&&(t=De.empty()),t.set(n.field,i))}return t||null}function Md(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Br(n,s,((i,o)=>$w(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class cs extends Pa{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Kt extends Pa{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Pm(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Fd(r,e,t){const n=new Map;k(r.length===t.length,32656,{Ie:t.length,Ae:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,c=e.data.field(i.field);n.set(i.field,Bw(o,c,t[s]))}return n}function Ud(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,Uw(i,o,e))}return n}class ki extends Pa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class bm extends Pa{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e,t){this.position=e,this.inclusive=t}}function Bd(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=F.comparator(F.fromName(o.referenceValue),t.key):n=Ue(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function qd(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ct(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{}class Z extends Sm{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Kw(e,t,n):t==="array-contains"?new Qw(e,n):t==="in"?new km(e,n):t==="not-in"?new Yw(e,n):t==="array-contains-any"?new Jw(e,n):new Z(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Ww(e,n):new Hw(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Ue(t,this.value)):t!==null&&Te(this.value)===Te(t)&&this.matchesComparison(Ue(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return B(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ie extends Sm{constructor(e,t){super(),this.filters=e,this.op=t,this.Ve=null}static create(e,t){return new ie(e,t)}matches(e){return Xr(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Ve!==null||(this.Ve=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Ve}getFilters(){return Object.assign([],this.filters)}}function Xr(r){return r.op==="and"}function Qc(r){return r.op==="or"}function $u(r){return Vm(r)&&Xr(r)}function Vm(r){for(const e of r.filters)if(e instanceof ie)return!1;return!0}function Yc(r){if(r instanceof Z)return r.field.canonicalString()+r.op.toString()+Hr(r.value);if($u(r))return r.filters.map((e=>Yc(e))).join(",");{const e=r.filters.map((t=>Yc(t))).join(",");return`${r.op}(${e})`}}function Cm(r,e){return r instanceof Z?(function(n,s){return s instanceof Z&&n.op===s.op&&n.field.isEqual(s.field)&&ct(n.value,s.value)})(r,e):r instanceof ie?(function(n,s){return s instanceof ie&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,c)=>i&&Cm(o,s.filters[c])),!0):!1})(r,e):void B(19439)}function xm(r,e){const t=r.filters.concat(e);return ie.create(t,r.op)}function Dm(r){return r instanceof Z?(function(t){return`${t.field.canonicalString()} ${t.op} ${Hr(t.value)}`})(r):r instanceof ie?(function(t){return t.op.toString()+" {"+t.getFilters().map(Dm).join(" ,")+"}"})(r):"Filter"}class Kw extends Z{constructor(e,t,n){super(e,t,n),this.key=F.fromName(n.referenceValue)}matches(e){const t=F.comparator(e.key,this.key);return this.matchesComparison(t)}}class Ww extends Z{constructor(e,t){super(e,"in",t),this.keys=Nm("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Hw extends Z{constructor(e,t){super(e,"not-in",t),this.keys=Nm("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Nm(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>F.fromName(n.referenceValue)))}class Qw extends Z{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return vn(t)&&ui(t.arrayValue,this.value)}}class km extends Z{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ui(this.value.arrayValue,t)}}class Yw extends Z{constructor(e,t){super(e,"not-in",t)}matches(e){if(ui(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ui(this.value.arrayValue,t)}}class Jw extends Z{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!vn(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>ui(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fi{constructor(e,t="asc"){this.field=e,this.dir=t}}function Xw(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e,t,n,s,i,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new ge(e,0,$.min(),$.min(),$.min(),De.empty(),0)}static newFoundDocument(e,t,n,s){return new ge(e,1,t,$.min(),n,s,0)}static newNoDocument(e,t){return new ge(e,2,t,$.min(),$.min(),De.empty(),0)}static newUnknownDocument(e,t){return new ge(e,3,t,$.min(),$.min(),De.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual($.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=De.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=De.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=$.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ge&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ge(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zw{constructor(e,t=null,n=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.de=null}}function Jc(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Zw(r,e,t,n,s,i,o)}function Jo(r){const e=q(r);if(e.de===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Yc(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Ea(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>Hr(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>Hr(n))).join(",")),e.de=t}return e.de}function ju(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Xw(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Cm(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!qd(r.startAt,e.startAt)&&qd(r.endAt,e.endAt)}function Vt(r){return!!r.isCorePipeline}function zu(r){return!!r.path&&F.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Xo(r,e){return r.filters.filter((t=>t instanceof Z&&t.field.isEqual(e)))}function $d(r,e,t){let n=Rt,s=!0;for(const i of Xo(r,e)){let o=Rt,c=!0;switch(i.op){case"<":case"<=":o=Mw(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,c=!1;break;case"!=":case"not-in":o=Rt}kd({value:n,inclusive:s},{value:o,inclusive:c})<0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];kd({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function jd(r,e,t){let n=dn,s=!0;for(const i of Xo(r,e)){let o=dn,c=!0;switch(i.op){case">=":case">":o=Fw(i.value),c=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,c=!1;break;case"!=":case"not-in":o=dn}Od({value:n,inclusive:s},{value:o,inclusive:c})>0&&(n=o,s=c)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];Od({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e,t=null,n=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.fe=null,this.me=null,this.pe=null,this.startAt,this.endAt}}function Om(r,e,t,n,s,i,o,c){return new On(r,e,t,n,s,i,o,c)}function Oi(r){return new On(r)}function zd(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function ev(r){return F.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Gu(r){return r.collectionGroup!==null}function Mr(r){const e=q(r);if(e.fe===null){e.fe=[];const t=new Set;for(const i of e.explicitOrderBy)e.fe.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new re(he.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(c=c.add(l.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.fe.push(new fi(i,n))})),t.has(he.keyField().canonicalString())||e.fe.push(new fi(he.keyField(),n))}return e.fe}function tt(r){const e=q(r);return e.me||(e.me=tv(e,Mr(r))),e.me}function tv(r,e){if(r.limitType==="F")return Jc(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new fi(s.field,i)}));const t=r.endAt?new An(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new An(r.startAt.position,r.startAt.inclusive):null;return Jc(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Xc(r,e){const t=r.filters.concat([e]);return new On(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function nv(r,e){const t=r.explicitOrderBy.concat([e]);return new On(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function Zo(r,e,t){return new On(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function rv(r,e){return new On(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,e,r.endAt)}function sv(r,e){return ju(tt(r),tt(e))&&r.limitType===e.limitType}function Js(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>Dm(s))).join(", ")}]`),Ea(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>Hr(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>Hr(s))).join(",")),`Target(${n})`})(tt(r))}; limitType=${r.limitType})`}function ba(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):F.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Mr(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,c,u){const l=Bd(o,c,u);return o.inclusive?l<=0:l<0})(n.startAt,Mr(n),s)||n.endAt&&!(function(o,c,u){const l=Bd(o,c,u);return o.inclusive?l>=0:l>0})(n.endAt,Mr(n),s))})(r,e)}function Ku(r){return(e,t)=>{let n=!1;for(const s of Mr(r)){const i=iv(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function iv(r,e,t){const n=r.field.isKeyField()?F.comparator(e.key,t.key):(function(i,o,c){const u=o.data.field(i),l=c.data.field(i);return u!==null&&l!==null?Ue(u,l):B(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return B(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ov{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ie,ee;function av(r){switch(r){case S.OK:return B(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return B(15467,{code:r})}}function Lm(r){if(r===void 0)return ye("GRPC error has no .code"),S.UNKNOWN;switch(r){case Ie.OK:return S.OK;case Ie.CANCELLED:return S.CANCELLED;case Ie.UNKNOWN:return S.UNKNOWN;case Ie.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case Ie.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case Ie.INTERNAL:return S.INTERNAL;case Ie.UNAVAILABLE:return S.UNAVAILABLE;case Ie.UNAUTHENTICATED:return S.UNAUTHENTICATED;case Ie.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case Ie.NOT_FOUND:return S.NOT_FOUND;case Ie.ALREADY_EXISTS:return S.ALREADY_EXISTS;case Ie.PERMISSION_DENIED:return S.PERMISSION_DENIED;case Ie.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case Ie.ABORTED:return S.ABORTED;case Ie.OUT_OF_RANGE:return S.OUT_OF_RANGE;case Ie.UNIMPLEMENTED:return S.UNIMPLEMENTED;case Ie.DATA_LOSS:return S.DATA_LOSS;default:return B(39323,{code:r})}}(ee=Ie||(Ie={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){kn(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return hm(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cv=new ae(F.comparator);function ve(){return cv}const Mm=new ae(F.comparator);function Wn(...r){let e=Mm;for(const t of r)e=e.insert(t.key,t);return e}function Fm(r){let e=Mm;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function it(){return Xs()}function Um(){return Xs()}function Xs(){return new Wt((r=>r.toString()),((r,e)=>r.isEqual(e)))}const uv=new ae(F.comparator),lv=new re(F.comparator);function Q(...r){let e=lv;for(const t of r)e=e.add(t);return e}const hv=new re(K);function Wu(){return hv}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dv(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fv=new gn([4294967295,4294967295],0);function Gd(r){const e=dv().encode(r),t=new Bp;return t.update(e),new Uint8Array(t.digest())}function Kd(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new gn([t,n],0),new gn([s,i],0)]}class Hu{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Bs(`Invalid padding: ${t}`);if(n<0)throw new Bs(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Bs(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Bs(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.ye=gn.fromNumber(this.ge)}we(e,t,n){let s=e.add(t.multiply(gn.fromNumber(n)));return s.compare(fv)===1&&(s=new gn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.ye).toNumber()}be(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Gd(e),[n,s]=Kd(t);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);if(!this.be(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Hu(i,s,t);return n.forEach((c=>o.insert(c))),o}insert(e){if(this.ge===0)return;const t=Gd(e),[n,s]=Kd(t);for(let i=0;i<this.hashCount;i++){const o=this.we(n,s,i);this.ve(o)}}ve(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Bs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class us{constructor(e,t,n,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,Li.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new us($.min(),s,new ae(K),ve(),ve(),Q())}}class Li{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Li(n,t,Q(),Q(),Q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(e,t,n,s){this.Se=e,this.removedTargetIds=t,this.key=n,this.De=s}}class Bm{constructor(e,t){this.targetId=e,this.xe=t}}class qm{constructor(e,t,n=de.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Wd{constructor(e){this.targetId=e,this.Ce=0,this.Fe=Hd(),this.Oe=de.EMPTY_BYTE_STRING,this.Me=!1,this.Ne=!0}get current(){return this.Me}get resumeToken(){return this.Oe}get Le(){return this.Ce!==0}get Be(){return this.Ne}Ue(e){e.approximateByteSize()>0&&(this.Ne=!0,this.Oe=e)}ke(){let e=Q(),t=Q(),n=Q();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:B(38017,{changeType:i})}})),new Li(this.Oe,this.Me,e,t,n)}qe(){this.Ne=!1,this.Fe=Hd()}$e(e,t){this.Ne=!0,this.Fe=this.Fe.insert(e,t)}Ke(e){this.Ne=!0,this.Fe=this.Fe.remove(e)}We(){this.Ce+=1}Qe(){this.Ce-=1,k(this.Ce>=0,3241,{Ce:this.Ce,targetId:this.targetId})}Ge(){this.Ne=!0,this.Me=!0}}const xs="WatchChangeAggregator";class pv{constructor(e){this.ze=e,this.je=new Map,this.He=ve(),this.Je=ho(),this.Ye=ve(),this.Ze=ho(),this.Xe=new ae(K)}et(e){for(const t of e.Se)e.De&&e.De.isFoundDocument()?this.tt(t,e.De):this.nt(t,e.key,e.De);for(const t of e.removedTargetIds)this.nt(t,e.key,e.De)}rt(e){this.forEachTarget(e,(t=>{const n=this.je.get(t);if(n)switch(e.state){case 0:this.it(t)&&n.Ue(e.resumeToken);break;case 1:n.Qe(),n.Le||n.qe(),n.Ue(e.resumeToken);break;case 2:n.Qe(),n.Le||this.removeTarget(t);break;case 3:this.it(t)&&(n.Ge(),n.Ue(e.resumeToken));break;case 4:this.it(t)&&(this.st(t),n.Ue(e.resumeToken));break;default:B(56790,{state:e.state})}else D(xs,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.je.forEach(((n,s)=>{this.it(s)&&t(s)}))}_t(e){var t;return Vt(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:zu(e)}ot(e){const t=e.targetId,n=e.xe.count,s=this.ut(t);if(s){const i=s.target;if(this._t(i))if(n===0){const o=new F(Vt(i)?J.fromString(i.getPipelineDocuments()[0]):i.path);this.nt(t,o,ge.newNoDocument(o,$.min()))}else k(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.ct(t);if(o!==n){const c=this.lt(e),u=c?this.Et(c,e,o):1;if(u!==0){this.st(t);const l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Xe=this.Xe.insert(t,l)}}}}}lt(e){const t=e.xe.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,c;try{o=Ft(n).toUint8Array()}catch(u){if(u instanceof dm)return at("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Hu(o,s,i)}catch(u){return at(u instanceof Bs?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.ge===0?null:c}Et(e,t,n){return t.xe.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.ze.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.ze.Tt(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.nt(t,i,null),s++)})),s}Rt(e){const t=new Map;this.je.forEach(((i,o)=>{const c=this.ut(o);if(c){if(i.current&&this._t(c.target)){const u=Vt(c.target)?J.fromString(c.target.getPipelineDocuments()[0]):c.target.path,l=new F(u);this.It(l).has(o)||this.At(o,l)||this.nt(o,l,ge.newNoDocument(l,e))}i.Be&&(t.set(o,i.ke()),i.qe())}}));let n=Q();this.Ze.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{const l=this.ut(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(n=n.add(i))})),this.He.forEach(((i,o)=>o.setReadTime(e))),this.Ye.forEach(((i,o)=>o.setReadTime(e)));const s=new us(e,t,this.Xe,this.He,this.Ye,n);return this.He=ve(),this.Je=ho(),this.Ye=ve(),this.Ze=ho(),this.Xe=new ae(K),s}tt(e,t){const n=this.je.get(e);if(!n||!this.it(e))return void D(xs,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.At(e,t.key)?2:0;n.$e(t.key,s),Vt(this.ut(e).target)&&this.ut(e).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(t.key,t):this.He=this.He.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.Ze=this.Ze.insert(t.key,this.Vt(t.key).add(e))}nt(e,t,n){const s=this.je.get(e);s&&this.it(e)?(this.At(e,t)?s.$e(t,1):s.Ke(t),this.Ze=this.Ze.insert(t,this.Vt(t).delete(e)),this.Ze=this.Ze.insert(t,this.Vt(t).add(e)),n&&(Vt(this.ut(e).target)&&this.ut(e).target.getPipelineFlavor()!=="exact"?this.Ye=this.Ye.insert(t,n):this.He=this.He.insert(t,n))):D(xs,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.je.delete(e)}ct(e){const t=this.je.get(e);if(!t)return 0;const n=t.ke();return this.ze.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}We(e){let t=this.je.get(e);t||(D(xs,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Wd(e),this.je.set(e,t)),t.We()}Vt(e){let t=this.Ze.get(e);return t||(t=new re(K),this.Ze=this.Ze.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new re(K),this.Je=this.Je.insert(e,t)),t}it(e){const t=this.ut(e)!==null;return t||D(xs,"Detected inactive target",e),t}ut(e){const t=this.je.get(e);return t===void 0||t.Le?null:this.ze.dt(e)}st(e){this.je.set(e,new Wd(e)),this.ze.getRemoteKeysForTarget(e).forEach((t=>{this.nt(e,t,null)}))}At(e,t){return this.ze.getRemoteKeysForTarget(e).has(t)}}function ho(){return new ae(F.comparator)}function Hd(){return new ae(F.comparator)}const mv={asc:"ASCENDING",desc:"DESCENDING"},gv={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},_v={and:"AND",or:"OR"};class yv{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Zc(r,e){return r.useProto3Json||Ea(e)?e:{value:e}}function Zr(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Qu(r){const e=Mt(r);return new se(e.seconds,e.nanos)}function $m(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Co(r,e){return Zr(r,e.toTimestamp())}function ze(r){return k(!!r,49232),$.fromTimestamp(Qu(r))}function Yu(r,e){return eu(r,e).canonicalString()}function eu(r,e){const t=(function(s){return new J(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function jm(r){const e=J.fromString(r);return k(Zm(e),10190,{key:e.toString()}),e}function pi(r,e){return Yu(r.databaseId,e.path)}function nr(r,e){const t=jm(e);if(t.get(1)!==r.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new F(Km(t))}function zm(r,e){return Yu(r.databaseId,e)}function Gm(r){const e=jm(r);return e.length===4?J.emptyPath():Km(e)}function tu(r){return new J(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Km(r){return k(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Qd(r,e,t){return{name:pi(r,e),fields:t.value.mapValue.fields}}function Iv(r,e,t){const n=nr(r,e.name),s=ze(e.updateTime),i=e.createTime?ze(e.createTime):$.min(),o=new De({mapValue:{fields:e.fields}}),c=ge.newFoundDocument(n,s,i,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function Ev(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:B(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,f){return l.useProto3Json?(k(f===void 0||typeof f=="string",58123),de.fromBase64String(f||"")):(k(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),de.fromUint8Array(f||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(l){const f=l.code===void 0?S.UNKNOWN:Lm(l.code);return new N(f,l.message||"")})(o);t=new qm(n,s,i,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=nr(r,n.document.name),i=ze(n.document.updateTime),o=n.document.createTime?ze(n.document.createTime):$.min(),c=new De({mapValue:{fields:n.document.fields}}),u=ge.newFoundDocument(s,i,o,c),l=n.targetIds||[],f=n.removedTargetIds||[];t=new Vo(l,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=nr(r,n.document),i=n.readTime?ze(n.readTime):$.min(),o=ge.newNoDocument(s,i),c=n.removedTargetIds||[];t=new Vo([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=nr(r,n.document),i=n.removedTargetIds||[];t=new Vo([],i,s,null)}else{if(!("filter"in e))return B(11601,{ft:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ov(s,i),c=n.targetId;t=new Bm(c,o)}}return t}function ea(r,e){let t;if(e instanceof cs)t={update:Qd(r,e.key,e.value)};else if(e instanceof ki)t={delete:pi(r,e.key)};else if(e instanceof Kt)t={update:Qd(r,e.key,e.data),updateMask:Pv(e.fieldMask)};else{if(!(e instanceof bm))return B(16599,{gt:e.type});t={verify:pi(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const c=o.transform;if(c instanceof li)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Qr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Yr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Jr)return{fieldPath:o.field.canonicalString(),increment:c.Re};if(c instanceof hi)return{fieldPath:o.field.canonicalString(),minimum:c.Re};if(c instanceof di)return{fieldPath:o.field.canonicalString(),maximum:c.Re};throw B(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Co(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:B(27497)})(r,e.precondition)),t}function nu(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?Ce.updateTime(ze(i.updateTime)):i.exists!==void 0?Ce.exists(i.exists):Ce.none()})(e.currentDocument):Ce.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,c){let u=null;if("setToServerValue"in c)k(c.setToServerValue==="REQUEST_TIME",16630,{proto:c}),u=new li;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new Qr(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new Yr(f)}else"increment"in c?u=new Jr(o,c.increment):"minimum"in c?u=new hi(o,c.minimum):"maximum"in c?u=new di(o,c.maximum):B(16584,{proto:c});const l=he.fromServerFormat(c.fieldPath);return new qw(l,u)})(r,s))):[];if(e.update){e.update.name;const s=nr(r,e.update.name),i=new De({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const l=u.fieldPaths||[];return new We(l.map((f=>he.fromServerFormat(f))))})(e.updateMask);return new Kt(s,i,o,t,n)}return new cs(s,i,t,n)}if(e.delete){const s=nr(r,e.delete);return new ki(s,t)}if(e.verify){const s=nr(r,e.verify);return new bm(s,t)}return B(1463,{proto:e})}function Tv(r,e){return r&&r.length>0?(k(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?ze(s.updateTime):ze(i);return o.isEqual($.min())&&(o=ze(i)),new jw(o,s.transformResults||[])})(t,e)))):[]}function Wm(r,e){return{documents:[zm(r,e.path)]}}function Hm(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=zm(r,s);const i=(function(l){if(l.length!==0)return Xm(ie.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(l){if(l.length!==0)return l.map((f=>(function(g){return{field:Cr(g.field),direction:vv(g.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Zc(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{yt:t,parent:s}}function Qm(r){let e=Gm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){k(n===1,65062);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=(function(p){const g=Jm(p);return g instanceof ie&&$u(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((g=>(function(C){return new fi(xr(C.field),(function(L){switch(L){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(C.direction))})(g)))})(t.orderBy));let c=null;t.limit&&(c=(function(p){let g;return g=typeof p=="object"?p.value:p,Ea(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(p){const g=!!p.before,R=p.values||[];return new An(R,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(p){const g=!p.before,R=p.values||[];return new An(R,g)})(t.endAt)),Om(e,s,o,i,c,"F",u,l)}function wv(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return B(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Ym(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(r)))}}}}function Jm(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=xr(t.unaryFilter.field);return Z.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=xr(t.unaryFilter.field);return Z.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=xr(t.unaryFilter.field);return Z.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=xr(t.unaryFilter.field);return Z.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return B(61313);default:return B(60726)}})(r):r.fieldFilter!==void 0?(function(t){return Z.create(xr(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return B(58110);default:return B(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return ie.create(t.compositeFilter.filters.map((n=>Jm(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return B(1026)}})(t.compositeFilter.op))})(r):B(30097,{filter:r})}function vv(r){return mv[r]}function Av(r){return gv[r]}function Rv(r){return _v[r]}function Cr(r){return{fieldPath:r.canonicalString()}}function xr(r){return he.fromServerFormat(r.fieldPath)}function Xm(r){return r instanceof Z?(function(t){if(t.op==="=="){if(Ye(t.value))return{unaryFilter:{field:Cr(t.field),op:"IS_NAN"}};if(et(t.value))return{unaryFilter:{field:Cr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ye(t.value))return{unaryFilter:{field:Cr(t.field),op:"IS_NOT_NAN"}};if(et(t.value))return{unaryFilter:{field:Cr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Cr(t.field),op:Av(t.op),value:t.value}}})(r):r instanceof ie?(function(t){const n=t.getFilters().map((s=>Xm(s)));return n.length===1?n[0]:{compositeFilter:{op:Rv(t.op),filters:n}}})(r):B(54877,{filter:r})}function Pv(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Zm(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function eg(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function mi(r,e){const t={fields:{}};return e.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)})),{mapValue:t}}function tg(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(r){return new yv(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e){this._byteString=e}static fromBase64String(e){try{return new ot(de.fromBase64String(e))}catch(t){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new ot(de.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:ot._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ci(e,ot._jsonSchema))return ot.fromBase64String(e.bytes)}}ot._jsonSchemaVersion="firestore/bytes/1.0",ot._jsonSchema={type:Ee("string",ot._jsonSchemaVersion),bytes:Ee("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new he(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function bv(){return new Mi(_t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return K(this._lat,e._lat)||K(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Pt._jsonSchemaVersion}}static fromJSON(e){if(Ci(e,Pt._jsonSchema))return new Pt(e.latitude,e.longitude)}}function ng(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Pt._jsonSchemaVersion="firestore/geoPoint/1.0",Pt._jsonSchema={type:Ee("string",Pt._jsonSchemaVersion),latitude:Ee("number"),longitude:Ee("number")};class Sv{bt(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd="ConnectivityMonitor";class Jd{constructor(){this.vt=()=>this.St(),this.Dt=()=>this.xt(),this.Ct=[],this.Ft()}bt(e){this.Ct.push(e)}shutdown(){window.removeEventListener("online",this.vt),window.removeEventListener("offline",this.Dt)}Ft(){window.addEventListener("online",this.vt),window.addEventListener("offline",this.Dt)}St(){D(Yd,"Network connectivity changed: AVAILABLE");for(const e of this.Ct)e(0)}xt(){D(Yd,"Network connectivity changed: UNAVAILABLE");for(const e of this.Ct)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fo=null;function ru(){return fo===null?fo=(function(){return 268435456+Math.round(2147483648*Math.random())})():fo++,"0x"+fo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vc="RestConnection",Vv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Cv{get Ot(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Mt=t+"://"+e.host,this.Nt=`projects/${n}/databases/${s}`,this.Lt=this.databaseId.database===Qo?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Bt(e,t,n,s,i){const o=ru(),c=this.Ut(e,t.toUriEncodedString());D(vc,`Sending RPC '${e}' ${o}:`,c,n);const u={"google-cloud-resource-prefix":this.Nt,"x-goog-request-params":this.Lt};this.kt(u,s,i);const{host:l}=new URL(c),f=ss(l);return this.qt(e,c,u,n,f).then((p=>(D(vc,`Received RPC '${e}' ${o}: `,p),p)),(p=>{throw at(vc,`RPC '${e}' ${o} failed with error: `,p,"url: ",c,"request:",n),p}))}$t(e,t,n,s,i,o){return this.Bt(e,t,n,s,i)}kt(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+as})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}Ut(e,t){const n=Vv[e];let s=`${this.Mt}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv{constructor(e){this.Kt=e.Kt,this.Wt=e.Wt}Qt(e){this.Gt=e}zt(e){this.jt=e}Ht(e){this.Jt=e}onMessage(e){this.Yt=e}close(){this.Wt()}send(e){this.Kt(e)}Zt(){this.Gt()}Xt(){this.jt()}en(e){this.Jt(e)}tn(e){this.Yt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oe="WebChannelConnection",Ds=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Fr extends Cv{constructor(e){super(e),this.nn=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static rn(){if(!Fr.sn){const e=zp();Ds(e,jp.STAT_EVENT,(t=>{t.stat===Bc.PROXY?D(Oe,"STAT_EVENT: detected buffering proxy"):t.stat===Bc.NOPROXY&&D(Oe,"STAT_EVENT: detected no buffering proxy")})),Fr.sn=!0}}qt(e,t,n,s,i){const o=ru();return new Promise(((c,u)=>{const l=new qp;l.setWithCredentials(!0),l.listenOnce($p.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case vo.NO_ERROR:const p=l.getResponseJson();D(Oe,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),c(p);break;case vo.TIMEOUT:D(Oe,`RPC '${e}' ${o} timed out`),u(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case vo.HTTP_ERROR:const g=l.getStatus();if(D(Oe,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let R=l.getResponseJson();Array.isArray(R)&&(R=R[0]);const C=R==null?void 0:R.error;if(C&&C.status&&C.message){const O=(function(z){const W=z.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(W)>=0?W:S.UNKNOWN})(C.status);u(new N(O,C.message))}else u(new N(S.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new N(S.UNAVAILABLE,"Connection failed."));break;default:B(9055,{_n:e,streamId:o,an:l.getLastErrorCode(),un:l.getLastError()})}}finally{D(Oe,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(s);D(Oe,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",f,n,15)}))}cn(e,t,n){const s=ru(),i=[this.Mt,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.kt(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const l=i.join("");D(Oe,`Creating RPC '${e}' stream ${s}: ${l}`,c);const f=o.createWebChannel(l,c);this.En(f);let p=!1,g=!1;const R=new xv({Kt:C=>{g?D(Oe,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(p||(D(Oe,`Opening RPC '${e}' stream ${s} transport.`),f.open(),p=!0),D(Oe,`RPC '${e}' stream ${s} sending:`,C),f.send(C))},Wt:()=>f.close()});return Ds(f,Us.EventType.OPEN,(()=>{g||(D(Oe,`RPC '${e}' stream ${s} transport opened.`),R.Zt())})),Ds(f,Us.EventType.CLOSE,(()=>{g||(g=!0,D(Oe,`RPC '${e}' stream ${s} transport closed`),R.en(),this.hn(f))})),Ds(f,Us.EventType.ERROR,(C=>{g||(g=!0,at(Oe,`RPC '${e}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),R.en(new N(S.UNAVAILABLE,"The operation could not be completed")))})),Ds(f,Us.EventType.MESSAGE,(C=>{var O;if(!g){const L=C.data[0];k(!!L,16349);const z=L,W=(z==null?void 0:z.error)||((O=z[0])==null?void 0:O.error);if(W){D(Oe,`RPC '${e}' stream ${s} received error:`,W);const H=W.status;let ue=(function(T){const _=Ie[T];if(_!==void 0)return Lm(_)})(H),te=W.message;H==="NOT_FOUND"&&te.includes("database")&&te.includes("does not exist")&&te.includes(this.databaseId.database)&&at(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ue===void 0&&(ue=S.INTERNAL,te="Unknown error status: "+H+" with message "+W.message),g=!0,R.en(new N(ue,te)),f.close()}else D(Oe,`RPC '${e}' stream ${s} received:`,L),R.tn(L)}})),Fr.rn(),setTimeout((()=>{R.Xt()}),0),R}terminate(){this.nn.forEach((e=>e.close())),this.nn=[]}En(e){this.nn.push(e)}hn(e){this.nn=this.nn.filter((t=>t===e))}kt(e,t,n){super.kt(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Gp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dv(r){return new Fr(r)}Fr.sn=!1;class rg{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Tn=e,this.timerId=t,this.Pn=n,this.Rn=s,this.In=i,this.An=0,this.Vn=null,this.dn=Date.now(),this.reset()}reset(){this.An=0}fn(){this.An=this.In}mn(e){this.cancel();const t=Math.floor(this.An+this.pn()),n=Math.max(0,Date.now()-this.dn),s=Math.max(0,t-n);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.An} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Vn=this.Tn.enqueueAfterDelay(this.timerId,s,(()=>(this.dn=Date.now(),e()))),this.An*=this.Rn,this.An<this.Pn&&(this.An=this.Pn),this.An>this.In&&(this.An=this.In)}gn(){this.Vn!==null&&(this.Vn.skipDelay(),this.Vn=null)}cancel(){this.Vn!==null&&(this.Vn.cancel(),this.Vn=null)}pn(){return(Math.random()-.5)*this.An}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xd="PersistentStream";class sg{constructor(e,t,n,s,i,o,c,u){this.Tn=e,this.yn=n,this.wn=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.bn=0,this.vn=null,this.Sn=null,this.stream=null,this.Dn=0,this.xn=new rg(e,t)}Cn(){return this.state===1||this.state===5||this.Fn()}Fn(){return this.state===2||this.state===3}start(){this.Dn=0,this.state!==4?this.auth():this.On()}async stop(){this.Cn()&&await this.close(0)}Mn(){this.state=0,this.xn.reset()}Nn(){this.Fn()&&this.vn===null&&(this.vn=this.Tn.enqueueAfterDelay(this.yn,6e4,(()=>this.Ln())))}Bn(e){this.Un(),this.stream.send(e)}async Ln(){if(this.Fn())return this.close(0)}Un(){this.vn&&(this.vn.cancel(),this.vn=null)}kn(){this.Sn&&(this.Sn.cancel(),this.Sn=null)}async close(e,t){this.Un(),this.kn(),this.xn.cancel(),this.bn++,e!==4?this.xn.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(ye(t.toString()),ye("Using maximum backoff delay to prevent overloading the backend."),this.xn.fn()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.qn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ht(t)}qn(){}auth(){this.state=1;const e=this.$n(this.bn),t=this.bn;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.bn===t&&this.Kn(n,s)}),(n=>{e((()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+n.message);return this.Wn(s)}))}))}Kn(e,t){const n=this.$n(this.bn);this.stream=this.Qn(e,t),this.stream.Qt((()=>{n((()=>this.listener.Qt()))})),this.stream.zt((()=>{n((()=>(this.state=2,this.Sn=this.Tn.enqueueAfterDelay(this.wn,1e4,(()=>(this.Fn()&&(this.state=3),Promise.resolve()))),this.listener.zt())))})),this.stream.Ht((s=>{n((()=>this.Wn(s)))})),this.stream.onMessage((s=>{n((()=>++this.Dn==1?this.Gn(s):this.onNext(s)))}))}On(){this.state=5,this.xn.mn((async()=>{this.state=0,this.start()}))}Wn(e){return D(Xd,`close with error: ${e}`),this.stream=null,this.close(4,e)}$n(e){return t=>{this.Tn.enqueueAndForget((()=>this.bn===e?t():(D(Xd,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Nv extends sg{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}Qn(e,t){return this.connection.cn("Listen",e,t)}Gn(e){return this.onNext(e)}onNext(e){this.xn.reset();const t=Ev(this.serializer,e),n=(function(i){if(!("targetChange"in i))return $.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?$.min():o.readTime?ze(o.readTime):$.min()})(e);return this.listener.zn(t,n)}jn(e){const t={};t.database=tu(this.serializer),t.addTarget=(function(i,o){let c;const u=o.target;if(c=Vt(u)?{pipelineQuery:Ym(i,u)}:zu(u)?{documents:Wm(i,u)}:{query:Hm(i,u).yt},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=$m(i,o.resumeToken);const l=Zc(i,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo($.min())>0){c.readTime=Zr(i,o.snapshotVersion.toTimestamp());const l=Zc(i,o.expectedCount);l!==null&&(c.expectedCount=l)}return c})(this.serializer,e);const n=wv(this.serializer,e);n&&(t.labels=n),this.Bn(t)}Hn(e){const t={};t.database=tu(this.serializer),t.removeTarget=e,this.Bn(t)}}class kv extends sg{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Jn(){return this.Dn>0}start(){this.lastStreamToken=void 0,super.start()}qn(){this.Jn&&this.Yn([])}Qn(e,t){return this.connection.cn("Write",e,t)}Gn(e){return k(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,k(!e.writeResults||e.writeResults.length===0,55816),this.listener.Zn()}onNext(e){k(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.xn.reset();const t=Tv(e.writeResults,e.commitTime),n=ze(e.commitTime);return this.listener.Xn(n,t)}er(){const e={};e.database=tu(this.serializer),this.Bn(e)}Yn(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>ea(this.serializer,n)))};this.Bn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ov{}class Lv extends Ov{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.tr=!1}nr(){if(this.tr)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Bt(e,t,n,s){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Bt(e,eu(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new N(S.UNKNOWN,i.toString())}))}$t(e,t,n,s,i){return this.nr(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.$t(e,eu(t,n),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())}))}terminate(){this.tr=!0,this.connection.terminate()}}function Mv(r,e,t,n){return new Lv(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fv="ComponentProvider",Zd=new Map;function Uv(r,e,t,n,s){return new Ow(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,ng(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ef={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},ig=41943040;class Le{static withCacheSize(e){return new Le(e,Le.DEFAULT_COLLECTION_PERCENTILE,Le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}Le.DEFAULT_COLLECTION_PERCENTILE=10,Le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Le.DEFAULT=new Le(ig,Le.DEFAULT_COLLECTION_PERCENTILE,Le.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Le.DISABLED=new Le(-1,0,0);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf="LruGarbageCollector",og=1048576;function nf([r,e],[t,n]){const s=K(r,t);return s===0?K(e,n):s}class Bv{constructor(e){this.rr=e,this.buffer=new re(nf),this.ir=0}sr(){return++this.ir}_r(e){const t=[e,this.sr()];if(this.buffer.size<this.rr)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();nf(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class ag{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.ur(6e4)}stop(){this.ar&&(this.ar.cancel(),this.ar=null)}get started(){return this.ar!==null}ur(e){D(tf,`Garbage collection scheduled in ${e}ms`),this.ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Nn(t)?D(tf,"Ignoring IndexedDB error during garbage collection: ",t):await Dn(t)}await this.ur(3e5)}))}}class qv{constructor(e,t){this.cr=e,this.params=t}calculateTargetCount(e,t){return this.cr.lr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return A.resolve(Ke.ce);const n=new Bv(t);return this.cr.forEachTarget(e,(s=>n._r(s.sequenceNumber))).next((()=>this.cr.Er(e,(s=>n._r(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.cr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.cr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(ef)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),ef):this.hr(e,t)))}getCacheSize(e){return this.cr.getCacheSize(e)}hr(e,t){let n,s,i,o,c,u,l;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),s=this.params.maximumSequenceNumbersToCollect):s=p,o=Date.now(),this.nthSequenceNumber(e,s)))).next((p=>(n=p,c=Date.now(),this.removeTargets(e,n,t)))).next((p=>(i=p,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((p=>(l=Date.now(),Vr()<=X.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(l-u)+`ms
Total Duration: ${l-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:p}))))}}function cg(r,e){return new qv(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ug="firestore.googleapis.com",rf=!0;class sf{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ug,this.ssl=rf}else this.host=e.host,this.ssl=e.ssl??rf;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=ig;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<og)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ew("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ng(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Fi{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new sf({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new sf(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new zT;switch(n.type){case"firstParty":return new HT(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=Zd.get(t);n&&(D(Fv,"Removing Datastore"),Zd.delete(t),n.terminate())})(this),Promise.resolve()}}function $v(r,e,t,n={}){var l;r=je(r,Fi);const s=ss(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},c=`${e}:${t}`;s&&_u(`https://${c}`),i.host!==ug&&i.host!==c&&at("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:c,ssl:s,emulatorOptions:n};if(!En(u,o)&&(r._setSettings(u),n.mockUserToken)){let f,p;if(typeof n.mockUserToken=="string")f=n.mockUserToken,p=Se.MOCK_USER;else{f=uy(n.mockUserToken,(l=r._app)==null?void 0:l.options.projectId);const g=n.mockUserToken.sub||n.mockUserToken.user_id;if(!g)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new Se(g)}r._authCredentials=new GT(new Wp(f,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new dt(this.firestore,e,this._query)}}class fe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new yn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fe(this.firestore,e,this._key)}toJSON(){return{type:fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Ci(t,fe._jsonSchema))return new fe(e,n||null,new F(J.fromString(t.referencePath)))}}fe._jsonSchemaVersion="firestore/documentReference/1.0",fe._jsonSchema={type:Ee("string",fe._jsonSchemaVersion),referencePath:Ee("string")};class yn extends dt{constructor(e,t,n){super(e,t,Oi(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new fe(this.firestore,null,new F(e))}withConverter(e){return new yn(this.firestore,e,this._path)}}function mb(r,e,...t){if(r=pe(r),Cu("collection","path",e),r instanceof Fi){const n=J.fromString(e,...t);return Ad(n),new yn(r,null,n)}{if(!(r instanceof fe||r instanceof yn))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(J.fromString(e,...t));return Ad(n),new yn(r.firestore,null,n)}}function gb(r,e){if(r=je(r,Fi),Cu("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new dt(r,null,(function(n){return new On(J.emptyPath(),n)})(e))}function _b(r,e,...t){if(r=pe(r),arguments.length===1&&(e=Vu.newId()),Cu("doc","path",e),r instanceof Fi){const n=J.fromString(e,...t);return vd(n),new fe(r,null,new F(n))}{if(!(r instanceof fe||r instanceof yn))throw new N(S.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(J.fromString(e,...t));return vd(n),new fe(r.firestore,r instanceof yn?r.converter:null,new F(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:He._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ci(e,He._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new He(e.vectorValues);throw new N(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}He._jsonSchemaVersion="firestore/vectorValue/1.0",He._jsonSchema={type:Ee("string",He._jsonSchemaVersion),vectorValues:Ee("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv=/^__.*__$/;class zv{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms):new cs(e,this.data,t,this.fieldTransforms)}}class lg{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Kt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function hg(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw B(40011,{dataSource:r})}}class Xu{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new Xu({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return ta(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(hg(this.dataSource)&&jv.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class Gv{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Sa(e)}createContext(e,t,n,s=!1){return new Xu({dataSource:e,methodName:t,targetDoc:n,path:he.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ui(r){const e=r._freezeSettings(),t=Sa(r._databaseId);return new Gv(r._databaseId,!!e.ignoreUndefinedProperties,t)}function dg(r,e,t,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);Zu("Data must be an object, but it was:",o,n);const c=gg(n,o);let u,l;if(i.merge)u=new We(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const p of i.mergeFields){const g=Ut(e,p,t);if(!o.contains(g))throw new N(S.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Ig(f,g)||f.push(g)}u=new We(f),l=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,l=o.fieldTransforms;return new zv(new De(c),u,l)}class Va extends Ju{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Va}}function fg(r,e,t,n){const s=r.createContext(1,e,t);Zu("Data must be an object, but it was:",s,n);const i=[],o=De.empty();kn(n,((u,l)=>{const f=yg(e,u,t);l=pe(l);const p=s.childContextForFieldPath(f);if(l instanceof Va)i.push(f);else{const g=Rn(l,p);g!=null&&(i.push(f),o.set(f,g))}}));const c=new We(i);return new lg(o,c,s.fieldTransforms)}function pg(r,e,t,n,s,i){const o=r.createContext(1,e,t),c=[Ut(e,n,t)],u=[s];if(i.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(Ut(e,i[g])),u.push(i[g+1]);const l=[],f=De.empty();for(let g=c.length-1;g>=0;--g)if(!Ig(l,c[g])){const R=c[g];let C=u[g];C=pe(C);const O=o.childContextForFieldPath(R);if(C instanceof Va)l.push(R);else{const L=Rn(C,O);L!=null&&(l.push(R),f.set(R,L))}}const p=new We(l);return new lg(f,p,o.fieldTransforms)}function mg(r,e,t,n=!1){return Rn(t,r.createContext(n?4:3,e))}function Rn(r,e,t){if(_g(r=pe(r)))return Zu("Unsupported field value:",e,r),gg(r,e);if(r instanceof Ju)return(function(s,i){if(!hg(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let c=0;for(const u of s){let l=Rn(u,i.childContextForArray(c));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),c++}return{arrayValue:{values:o}}})(r,e)}return(function(s,i,o){if((s=pe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Bu(i.serializer,s,o);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const c=se.fromDate(s);return{timestampValue:Zr(i.serializer,c)}}if(s instanceof se){const c=new se(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Zr(i.serializer,c)}}if(s instanceof Pt)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof ot)return{bytesValue:$m(i.serializer,s._byteString)};if(s instanceof fe){const c=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(c))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:Yu(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof He)return(function(u,l){const f=u instanceof He?u.toArray():u;return{mapValue:{fields:{[Mu]:{stringValue:Fu},[lr]:{arrayValue:{values:f.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return Aa(l.serializer,g)}))}}}}}})(s,i);if(eg(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${ya(s)}`)})(r,e,t)}function gg(r,e){const t={};return hm(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):kn(r,((n,s)=>{const i=Rn(s,e.childContextForField(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function _g(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof se||r instanceof Pt||r instanceof ot||r instanceof fe||r instanceof Ju||r instanceof He||eg(r))}function Zu(r,e,t){if(!_g(t)||!Vi(t)){const n=ya(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function Ut(r,e,t){if((e=pe(e))instanceof Mi)return e._internalPath;if(typeof e=="string")return yg(r,e);throw ta("Field path arguments must be of type string or ",r,!1,void 0,t)}const Kv=new RegExp("[~\\*/\\[\\]]");function yg(r,e,t){if(e.search(Kv)>=0)throw ta(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new Mi(...e.split("."))._internalPath}catch{throw ta(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function ta(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new N(S.INVALID_ARGUMENT,c+r+u)}function Ig(r,e){return r.some((t=>t.isEqual(e)))}function Eg(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=De.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let c;i.nestedOptions&&Vi(o)?c={mapValue:{fields:new Be(i.nestedOptions).getOptionsProto(t,o)}}:o&&(c=Rn(o,t)??void 0),c&&n.set(he.fromServerFormat(i.serverName),c)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(Nw(n,((o,c)=>[he.fromServerFormat(c),o!==void 0?Rn(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wv(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Vi(t.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(r.pipelineValue)))}function Hv(r){return new He(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(r){let e;return r instanceof mr?r:(e=Vi(r)?Zv(r):r instanceof Array?eA(r):Tg(r,void 0),e)}function Ac(r){if(r instanceof mr)return r;if(r instanceof He)return gi(r);if(Array.isArray(r))return gi(Hv(r));throw new Error("Unsupported value: "+typeof r)}function el(r){return ow(r)?xo(r):M(r)}class mr{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,M(e)],"add")}asBoolean(){if(this instanceof Pn)return this;if(this instanceof _r)return new vg(this);if(this instanceof gr)return new Xv(this);if(this instanceof x)return new wg(this);throw new N("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,M(e)],"subtract")}multiply(e){return new x("multiply",[this,M(e)],"multiply")}divide(e){return new x("divide",[this,M(e)],"divide")}mod(e){return new x("mod",[this,M(e)],"mod")}equal(e){return new x("equal",[this,M(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,M(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,M(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,M(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,M(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,M(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map((s=>M(s)));return new x("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,M(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new qs(e.map(M),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new qs(e.map(M),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new qs(e.map(M),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new qs(e.map(M),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,M(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,M(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,M(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,M(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,M(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,M(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,M(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,M(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(M(e)),new x("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(M(e)),new x("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(M(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,gi(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map(M);return new x("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,M(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,M(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,M(e),M(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,M(e),M(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map(M);return new x("concat",[this,...n],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,M(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,M(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new x("array_transform",[this,M(e),M(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,M(e)];return t!==void 0&&n.push(M(t)),new x("array_slice",n,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,M(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,M(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,M(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,M(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,M(e),M("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,M(e),M("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,M(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,gi(e)],"mapGet")}mapSet(e,t,...n){const s=[this,M(e),M(t),...n.map(M)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,M(e)],"get_field")}count(){return Xe._create("count",[this],"count")}sum(){return Xe._create("sum",[this],"sum")}average(){return Xe._create("average",[this],"average")}minimum(){return Xe._create("minimum",[this],"minimum")}maximum(){return Xe._create("maximum",[this],"maximum")}first(){return Xe._create("first",[this],"first")}last(){return Xe._create("last",[this],"last")}arrayAgg(){return Xe._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Xe._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Xe._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new x("maximum",[this,...n.map(M)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new x("minimum",[this,...n.map(M)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,Ac(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,Ac(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,Ac(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,M(e),M(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,M(e),M(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,el(e),M(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,M(e)];return t&&n.push(M(t)),new x("timestamp_extract",n,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){const n=M(e);return new x("substring",t===void 0?[this,n]:[this,n,M(t)],"substring")}arrayGet(e){return new x("array_get",[this,M(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){const t=new x("if_error",[this,M(e)],"ifError");return e instanceof Pn?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,M(e)],"mapRemove")}mapMerge(e,...t){const n=M(e),s=t.map(M);return new x("map_merge",[this,n,...s],"mapMerge")}pow(e){return new x("pow",[this,M(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,M(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,M(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,M(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,M(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,M(e),...t.map(M)],"coalesce")}join(e){return new x("join",[this,M(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,M(e)])}timestampTruncate(e,t){const n=[this,M(e)];return t&&n.push(M(t)),new x("timestamp_trunc",n)}ascending(){return tA(this)}descending(){return nA(this)}as(e){return new Yv(this,e,"as")}}class Xe{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new Xe(e,t);return s._methodName=n,s}as(e){return new Qv(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class Qv{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class Yv{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class qs extends mr{constructor(e,t){super(),this.Rr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.Rr.map((t=>t._toProto(e)))}}}_readUserData(e){this.Rr.forEach((t=>t._readUserData(e)))}}class gr extends mr{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,M(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function xo(r){return Jv(r,"field")}function Jv(r,e){return new gr(typeof r=="string"?_t===r?bv()._internalPath:Ut("field",r):r._internalPath,e)}class _r extends mr{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new _r(e,void 0);return t._protoValue=e,t}_toProto(e){return k(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,Wv(this._protoValue)||(this._protoValue=Rn(this.value,e))}}function gi(r,e){return Tg(r,"constant")}function Tg(r,e){const t=new _r(r,e);return typeof r=="boolean"?new vg(t):t}class x extends mr{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new Be({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class Pn extends mr{get _methodName(){return this._expr._methodName}countIf(){return Xe._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){const t=M(e),n=new x("if_error",[this,t],"ifError");return t instanceof Pn?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class wg extends Pn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class vg extends Pn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class Xv extends Pn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function Zv(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(gi(n)),t.push(M(s))}return new x("map",t,"map")}function eA(r){return(function(t,n){return new x("array",t.map((s=>M(s))),n)})(r,"array")}function tA(r){return new tl(el(r),"ascending","ascending")}function nA(r){return new tl(el(r),"descending","descending")}class tl{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:tg(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Ag extends rt{get _name(){return"add_fields"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[mi(e,this.fields)]}}_readUserData(e){super._readUserData(e),Sn(this.fields,e)}}class Rg extends rt{get _name(){return"aggregate"}get _optionsUtil(){return new Be({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[mi(e,this.accumulators),mi(e,this.groups)]}}_readUserData(e){super._readUserData(e),Sn(this.groups,e),Sn(this.accumulators,e)}}class Pg extends rt{get _name(){return"distinct"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[mi(e,this.groups)]}}_readUserData(e){super._readUserData(e),Sn(this.groups,e)}}class Bi extends rt{get _name(){return"collection"}get _optionsUtil(){return new Be({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Vr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Vr}]}}_readUserData(e){super._readUserData(e)}}class qi extends rt{get _name(){return"collection_group"}get _optionsUtil(){return new Be({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class Ca extends rt{get _name(){return"database"}get _optionsUtil(){return new Be({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class xa extends rt{get _name(){return"documents"}get _optionsUtil(){return new Be({})}constructor(e,t){if(super(t),!e||e.length===0)throw new N(S.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new N(S.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.dr=n,this.mr=s}_toProto(e){return{...super._toProto(e),args:this.dr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class $i extends rt{get _name(){return"where"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Sn(this.condition,e)}}class bn extends rt{get _name(){return"limit"}get _optionsUtil(){return new Be({})}constructor(e,t){k(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Bu(e,this.limit)]}}}class of extends rt{get _name(){return"offset"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Bu(e,this.offset)]}}}class rA extends rt{get _name(){return"select"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[mi(e,this.selections)]}}_readUserData(e){super._readUserData(e),Sn(this.selections,e)}}class Et extends rt{get _name(){return"sort"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),Sn(this.orderings,e)}}class nl extends rt{get _name(){return"replace_with"}get _optionsUtil(){return new Be({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),tg(nl.pr)]}}_readUserData(e){super._readUserData(e),Sn(this.map,e)}}nl.pr="full_replace";function Sn(r,e){return Eg(r)?r._readUserData(e):Array.isArray(r)?r.forEach((t=>t._readUserData(e))):r instanceof Map?r.forEach((t=>t._readUserData(e))):Object.values(r).forEach((t=>t._readUserData(e))),r}// Copyright 2024 Google LLC* @license
class Me{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return ji(this)}getPipelineCollectionGroup(){return rl(this)}getPipelineCollectionId(){return bg(this)}getPipelineDocuments(){return na(this)}getPipelineFlavor(){return(function(t){let n="exact";return t.stages.forEach(((s,i)=>{s._name!==Pg.name&&s._name!==Rg.name||(n="keyless"),s._name===rA.name&&n==="exact"&&(n="augmented"),s._name===Ag.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return Nt(this)}}function Nt(r){const e=r.stages[0];return e instanceof Bi||e instanceof qi||e instanceof Ca||e instanceof xa?e._name:"unknown"}function ji(r){if(Nt(r)==="collection")return r.stages[0].Vr}function rl(r){if(Nt(r)==="collection_group")return r.stages[0].collectionId}function bg(r){switch(Nt(r)){case"collection":return J.fromString(ji(r)).lastSegment();case"collection_group":return rl(r);default:return}}function na(r){if(Nt(r)==="documents")return r.stages[0].dr}class Zs{constructor(e,t,n,s){this._db=e,this.userDataReader=t,this._userDataWriter=n,this.stages=s}wr(e,t){const n=this.userDataReader.createContext(3,e);return Eg(t)?t._readUserData(n):Array.isArray(t)?t.forEach((s=>s._readUserData(n))):t.forEach((s=>s._readUserData(n))),t}where(e){const t=this.stages.map((n=>n));return this.wr("where",e),t.push(new $i(e,{})),new Zs(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((n=>n));return t.push(new bn(e,{})),new Zs(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const n=this.stages.map((s=>s));return"orderings"in e?n.push(new Et(this.wr("sort",e.orderings),{})):n.push(new Et(this.wr("sort",[e,...t]),{})),new Zs(this._db,this.userDataReader,this._userDataWriter,n)}br(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class E{constructor(e,t){this.type=e,this.value=t}static vr(){return new E("ERROR",void 0)}static Sr(){return new E("UNSET",void 0)}static Dr(){return new E("NULL",Rt)}static newValue(e){return et(e)?new E("NULL",Rt):(function(n){return!!n&&"booleanValue"in n})(e)?new E("BOOLEAN",e):It(e)?new E("INT",e):Xn(e)?new E("DOUBLE",e):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(e)?new E("TIMESTAMP",e):(function(n){return!!n&&"stringValue"in n})(e)?new E("STRING",e):(function(n){return!!n&&"bytesValue"in n})(e)?new E("BYTES",e):e.referenceValue?new E("REFERENCE",e):e.geoPointValue?new E("GEO_POINT",e):vn(e)?new E("ARRAY",e):dr(e)?new E("VECTOR",e):tr(e)?new E("MAP",e):new E("ERROR",void 0)}Cr(){return this.type==="ERROR"||this.type==="UNSET"}Fr(){return this.type==="NULL"}}function ei(r){if(!r.Cr())return r.value}function Sg(r){return r instanceof Pn?r._expr:r}function j(r){if((r=Sg(r))instanceof gr)return new sA(r);if(r instanceof _r)return new iA(r);if(r instanceof qs)return new oA(r);if(r instanceof x){if(r.name==="add")return new uA(r);if(r.name==="subtract")return new lA(r);if(r.name==="multiply")return new hA(r);if(r.name==="divide")return new dA(r);if(r.name==="mod")return new fA(r);if(r.name==="and")return new pA(r);if(r.name==="equal")return new PA(r);if(r.name==="not_equal")return new bA(r);if(r.name==="less_than")return new SA(r);if(r.name==="less_than_or_equal")return new VA(r);if(r.name==="greater_than")return new CA(r);if(r.name==="greater_than_or_equal")return new xA(r);if(r.name==="array_concat")return new DA(r);if(r.name==="array_reverse")return new NA(r);if(r.name==="array_contains")return new kA(r);if(r.name==="array_contains_all")return new OA(r);if(r.name==="array_contains_any")return new LA(r);if(r.name==="array_length")return new MA(r);if(r.name==="array_element")return new FA(r);if(r.name==="equal_any")return new Vg(r);if(r.name==="not_equal_any")return new gA(r);if(r.name==="is_nan")return new _A(r);if(r.name==="is_not_nan")return new yA(r);if(r.name==="is_null")return new IA(r);if(r.name==="is_not_null")return new EA(r);if(r.name==="is_error")return new TA(r);if(r.name==="exists")return new wA(r);if(r.name==="not")return new Da(r);if(r.name==="or")return new mA(r);if(r.name==="xor")return new sl(r);if(r.name==="conditional")return new vA(r);if(r.name==="maximum")return new AA(r);if(r.name==="minimum")return new RA(r);if(r.name==="reverse")return new UA(r);if(r.name==="replace_first")return new BA(r);if(r.name==="replace_all")return new qA(r);if(r.name==="char_length")return new $A(r);if(r.name==="byte_length")return new jA(r);if(r.name==="like")return new zA(r);if(r.name==="regex_contains")return new GA(r);if(r.name==="regex_match")return new KA(r);if(r.name==="string_contains")return new WA(r);if(r.name==="starts_with")return new HA(r);if(r.name==="ends_with")return new QA(r);if(r.name==="to_lower")return new YA(r);if(r.name==="to_upper")return new JA(r);if(r.name==="trim")return new XA(r);if(r.name==="string_concat")return new ZA(r);if(r.name==="map_get")return new eR(r);if(r.name==="cosine_distance")return new tR(r);if(r.name==="dot_product")return new nR(r);if(r.name==="euclidean_distance")return new rR(r);if(r.name==="vector_length")return new sR(r);if(r.name==="unix_micros_to_timestamp")return new uR(r);if(r.name==="timestamp_to_unix_micros")return new dR(r);if(r.name==="unix_millis_to_timestamp")return new lR(r);if(r.name==="timestamp_to_unix_millis")return new fR(r);if(r.name==="unix_seconds_to_timestamp")return new hR(r);if(r.name==="timestamp_to_unix_seconds")return new pR(r);if(r.name==="timestamp_add")return new mR(r);if(r.name==="timestamp_subtract")return new gR(r)}throw new Error(`Unknown Expr : ${r}`)}class sA{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===_t)return E.newValue({referenceValue:pi(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return E.newValue({timestampValue:Co(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return E.newValue({timestampValue:Co(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?Di(n)?E.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Co(i.serializer,$.fromTimestamp(Wr(o)))};if(i.serverTimestampBehavior==="previous"){const c=Ni(o);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,n)):E.newValue(n):E.Sr()}}class iA{constructor(e){this.expr=e}evaluate(e,t){return E.newValue(this.expr._getValue())}}class oA{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.Rr.map((s=>j(s).evaluate(e,t)));return n.some((s=>s.Cr()))?E.vr():E.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function Ne(r){return Xn(r)?Number(r.doubleValue):Number(r.integerValue)}function bt(r){return BigInt(r.integerValue)}const aA=BigInt("0x7fffffffffffffff"),cA=-BigInt("0x8000000000000000");class zi{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length>=2,24778);const n=j(this.expr.params[0]).evaluate(e,t),s=j(this.expr.params[1]).evaluate(e,t);let i=this.Or(n,s);for(const o of this.expr.params.slice(2)){const c=j(o).evaluate(e,t);i=this.Or(i,c)}return i}Or(e,t){if(e.Cr()||t.Cr())return E.vr();if(e.Fr()||t.Fr())return E.Dr();const n=e.value,s=t.value;if(!Xn(n)&&!It(n)||!Xn(s)&&!It(s))return E.vr();if(Xn(n)||Xn(s)){const i=this.Mr(n,s);return i?E.newValue(i):E.vr()}if(It(n)&&It(s)){const i=this.Nr(n,s);return i===void 0?E.vr():typeof i=="number"?E.newValue({doubleValue:i}):i<cA||i>aA?E.vr():E.newValue({integerValue:`${i}`})}return E.vr()}}function Bt(r,e){return Te(r)!==Te(e)?"TYPE_MISMATCH":Ye(r)||Ye(e)?"NOT_EQ":et(r)&&et(e)?"EQ":et(r)||et(e)?"NULL":vn(r)&&vn(e)?(function(n,s){var o,c,u;if(((o=n.values)==null?void 0:o.length)!==((c=s.values)==null?void 0:c.length))return"NOT_EQ";let i=!1;for(let l=0;l<(((u=n.values)==null?void 0:u.length)??0);l++){const f=n.values[l],p=s.values[l];switch(Bt(f,p)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:B(44609,{Lr:f,Br:p})}}return i?"NULL":"EQ"})(r.arrayValue,e.arrayValue):dr(r)&&dr(e)||tr(r)&&tr(e)?(function(n,s){const i=n.fields||{},o=s.fields||{};if(Ho(i)!==Ho(o))return"NOT_EQ";let c=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(Bt(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(r.mapValue,e.mapValue):(function(n,s){return ct(n,s,{Te:!1,Ee:!0,he:!0})})(r,e)?"EQ":"NOT_EQ"}class uA extends zi{Nr(e,t){return bt(e)+bt(t)}Mr(e,t){return{doubleValue:Ne(e)+Ne(t)}}}class lA extends zi{constructor(e){super(e),this.expr=e}Nr(e,t){return bt(e)-bt(t)}Mr(e,t){return{doubleValue:Ne(e)-Ne(t)}}}class hA extends zi{constructor(e){super(e),this.expr=e}Nr(e,t){return bt(e)*bt(t)}Mr(e,t){return{doubleValue:Ne(e)*Ne(t)}}}class dA extends zi{constructor(e){super(e),this.expr=e}Nr(e,t){const n=bt(t);if(n!==BigInt(0))return bt(e)/n}Mr(e,t){const n=Ne(t);return n===0?{doubleValue:$r(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Ne(e)/n}}}class fA extends zi{constructor(e){super(e),this.expr=e}Nr(e,t){const n=bt(t);if(n!==BigInt(0))return bt(e)%n}Mr(e,t){const n=Ne(t);if(n!==0)return{doubleValue:Ne(e)%n}}}class pA{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const c=j(o).evaluate(e,t);switch(c.type){case"BOOLEAN":if(!((i=c.value)!=null&&i.booleanValue))return E.newValue(Ve);break;case"NULL":s=!0;break;default:n=!0}}return n?E.vr():s?E.Dr():E.newValue(Qe)}}class Da{constructor(e){this.expr=e}evaluate(e,t){var s;k(this.expr.params.length===1,9634);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return E.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return E.Dr();default:return E.vr()}}}class mA{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const c=j(o).evaluate(e,t);switch(c.type){case"BOOLEAN":if((i=c.value)!=null&&i.booleanValue)return E.newValue(Qe);break;case"NULL":s=!0;break;default:n=!0}}return n?E.vr():s?E.Dr():E.newValue(Ve)}}class sl{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const c=j(o).evaluate(e,t);switch(c.type){case"BOOLEAN":n=sl.xor(n,!!((i=c.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return E.vr()}}return s?E.Dr():E.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class Vg{constructor(e){this.expr=e}evaluate(e,t){var o,c;k(this.expr.params.length===2,55094);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return E.vr()}if(n)return E.Dr();for(const u of((c=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:c.values)??[])switch(et(s.value)&&et(u)?"EQ":Bt(s.value,u)){case"EQ":return E.newValue(Qe);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:B(44608,{value:s.value,candidate:u})}return n?E.Dr():E.newValue(Ve)}}class gA{constructor(e){this.expr=e}evaluate(e,t){return new Da(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}}class _A{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===1,23322);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return E.newValue(Ve);case"DOUBLE":return E.newValue({booleanValue:isNaN(Ne(n.value))});case"NULL":return E.Dr();default:return E.vr()}}}class yA{constructor(e){this.expr=e}evaluate(e,t){return k(this.expr.params.length===1,50406),new Da(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}}class IA{constructor(e){this.expr=e}evaluate(e,t){switch(k(this.expr.params.length===1,23123),j(this.expr.params[0]).evaluate(e,t).type){case"NULL":return E.newValue(Qe);case"UNSET":case"ERROR":return E.vr();default:return E.newValue(Ve)}}}class EA{constructor(e){this.expr=e}evaluate(e,t){return k(this.expr.params.length===1,23167),new Da(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}}class TA{constructor(e){this.expr=e}evaluate(e,t){return k(this.expr.params.length===1,5228),j(this.expr.params[0]).evaluate(e,t).type==="ERROR"?E.newValue(Qe):E.newValue(Ve)}}class wA{constructor(e){this.expr=e}evaluate(e,t){switch(k(this.expr.params.length===1,6877),j(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return E.vr();case"UNSET":return E.newValue(Ve);default:return E.newValue(Qe)}}}class vA{constructor(e){this.expr=e}evaluate(e,t){var s;k(this.expr.params.length===3,11706);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?j(this.expr.params[1]).evaluate(e,t):j(this.expr.params[2]).evaluate(e,t);case"NULL":return j(this.expr.params[2]).evaluate(e,t);default:return E.vr()}}}class AA{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>j(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||Ue(i.value,s.value)>0?i:s}return s===void 0?E.Dr():s}}class RA{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>j(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||Ue(i.value,s.value)<0?i:s}return s===void 0?E.Dr():s}}class ls{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return E.vr()}const s=j(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return E.vr()}return this.Ur(n,s)}}class PA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){if(e.Fr()&&t.Fr())return E.newValue(Qe);if(e.Fr()||t.Fr()||Ye(e.value)||Ye(t.value)||Te(e.value)!==Te(t.value))return E.newValue(Ve);switch(Bt(e.value,t.value)){case"EQ":return E.newValue(Qe);case"NOT_EQ":return E.newValue(Ve);case"NULL":return E.Dr();default:B(44615,{left:e,right:t})}}}class bA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){switch(Bt(e.value,t.value)){case"EQ":return E.newValue(Ve);case"NOT_EQ":case"TYPE_MISMATCH":return E.newValue(Qe);case"NULL":return E.Dr();default:B(44614,{left:e,right:t})}}}class SA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){return Te(e.value)!==Te(t.value)||Ye(e.value)||Ye(t.value)?E.newValue(Ve):E.newValue({booleanValue:Ue(e.value,t.value)<0})}}class VA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){return Te(e.value)!==Te(t.value)||Ye(e.value)||Ye(t.value)?E.newValue(Ve):Bt(e.value,t.value)==="EQ"?E.newValue(Qe):E.newValue({booleanValue:Ue(e.value,t.value)<0})}}class CA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){return Te(e.value)!==Te(t.value)||Ye(e.value)||Ye(t.value)?E.newValue(Ve):E.newValue({booleanValue:Ue(e.value,t.value)>0})}}class xA extends ls{constructor(e){super(e),this.expr=e}Ur(e,t){return Te(e.value)!==Te(t.value)||Ye(e.value)||Ye(t.value)?E.newValue(Ve):Bt(e.value,t.value)==="EQ"?E.newValue(Qe):E.newValue({booleanValue:Ue(e.value,t.value)>0})}}class DA{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class NA{constructor(e){this.expr=e}evaluate(e,t){var s;k(this.expr.params.length===1,216);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return E.Dr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return E.newValue({arrayValue:{values:[...i].reverse()}})}default:return E.vr()}}}class kA{constructor(e){this.expr=e}evaluate(e,t){return k(this.expr.params.length===2,52884),new Vg(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class OA{constructor(e){this.expr=e}evaluate(e,t){var u,l,f,p;k(this.expr.params.length===2,1392);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return E.vr()}if(n)return E.Dr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],c=((p=(f=s.value)==null?void 0:f.arrayValue)==null?void 0:p.values)??[];for(const g of o){let R=!1;n=!1;for(const C of c){switch(et(g)&&et(C)?"EQ":Bt(g,C)){case"EQ":R=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:B(44613,{value:C,search:g})}if(R)break}if(!R)return E.newValue(Ve)}return E.newValue(Qe)}}class LA{constructor(e){this.expr=e}evaluate(e,t){var u,l,f,p;k(this.expr.params.length===2,2680);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return E.vr()}if(n)return E.Dr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],c=((p=(f=s.value)==null?void 0:f.arrayValue)==null?void 0:p.values)??[];for(const g of c)for(const R of o)switch(et(g)&&et(R)?"EQ":Bt(g,R)){case"EQ":return E.newValue(Qe);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:B(44608,{value:g,search:R})}return n?E.Dr():E.newValue(Ve)}}class MA{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;k(this.expr.params.length===1,38605);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return E.Dr();case"ARRAY":return E.newValue({integerValue:`${((o=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return E.vr()}}}class FA{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class UA{constructor(e){this.expr=e}evaluate(e,t){var s,i;k(this.expr.params.length===1,1508);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return E.Dr();case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const c=de.fromBase64String(o).toUint8Array();return c.reverse(),E.newValue({bytesValue:de.fromUint8Array(c).toBase64()})}return E.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=n.value)==null?void 0:i.stringValue,c=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(c,(l=>l.segment)).reverse();return E.newValue({stringValue:u.join("")})}default:return E.vr()}}}class BA{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class qA{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class $A{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===1,19400);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return E.Dr();case"STRING":{const s=(function(o){let c=0;for(let u=0;u<o.length;u++){const l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){const f=o.codePointAt(u+1);f!==void 0&&f>=56320&&f<=57343?(c+=1,u++):c+=1}else c+=1;else c+=1;else{if(!(l<=1114111))return;c+=1,u++}}return c})(n.value.stringValue);return s===void 0?E.vr():E.newValue({integerValue:s})}default:return E.vr()}}}class jA{constructor(e){this.expr=e}evaluate(e,t){var s,i;k(this.expr.params.length===1,8486);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;return typeof o=="string"?E.newValue({integerValue:de.fromBase64String(o).toUint8Array().length}):E.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(u){let l=0;for(let f=0;f<u.length;f++){const p=u.codePointAt(f);if(p===void 0)return;if(p>=55296&&p<=57343){if(!(p<=56319))return;{const g=u.codePointAt(f+1);if(g===void 0||!(g>=56320&&g<=57343))return;l+=4,f++}}else if(p<=127)l+=1;else if(p<=2047)l+=2;else if(p<=65535)l+=3;else{if(!(p<=1114111))return;l+=4,f++}}return l})((i=n.value)==null?void 0:i.stringValue);return o===void 0?E.vr():E.newValue({integerValue:o})}case"NULL":return E.Dr();default:return E.vr()}}}class hs{constructor(e){this.expr=e}evaluate(e,t){var o,c;k(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return E.vr()}return n?E.Dr():this.kr((o=s.value)==null?void 0:o.stringValue,(c=i.value)==null?void 0:c.stringValue)}}class zA extends hs{kr(e,t){try{const n=(function(o){let c="";for(let u=0;u<o.length;u++){const l=o.charAt(u);switch(l){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+l;break;default:c+=l}}return"^"+c+"$"})(t),s=gu.compile(n);return E.newValue({booleanValue:s.matches(e)})}catch(n){return at(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),E.vr()}}}class GA extends hs{kr(e,t){try{const n=gu.compile(t);return E.newValue({booleanValue:n.matcher(e).find()})}catch{return at(`Invalid regex pattern found in regex_contains: ${t}, returning error`),E.vr()}}}class KA extends hs{kr(e,t){try{return E.newValue({booleanValue:gu.compile(t).matches(e)})}catch{return at(`Invalid regex pattern found in regex_match: ${t}, returning error`),E.vr()}}}class WA extends hs{kr(e,t){return E.newValue({booleanValue:e.includes(t)})}}class HA extends hs{kr(e,t){return E.newValue({booleanValue:e.startsWith(t)})}}class QA extends hs{kr(e,t){return E.newValue({booleanValue:e.endsWith(t)})}}class YA{constructor(e){this.expr=e}evaluate(e,t){var s,i;k(this.expr.params.length===1,29079);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return E.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return E.Dr();default:return E.vr()}}}class JA{constructor(e){this.expr=e}evaluate(e,t){var s,i;k(this.expr.params.length===1,60487);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return E.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return E.Dr();default:return E.vr()}}}class XA{constructor(e){this.expr=e}evaluate(e,t){var s,i;k(this.expr.params.length===1,28544);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return E.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return E.Dr();default:return E.vr()}}}class ZA{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((o=>j(o).evaluate(e,t)));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return E.vr()}return i?E.Dr():E.newValue({stringValue:s})}}class eR{constructor(e){this.expr=e}evaluate(e,t){var o,c,u,l;k(this.expr.params.length===2,4483);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return E.Sr();case"MAP":break;default:return E.vr()}const s=j(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return E.vr();const i=(l=(c=(o=n.value)==null?void 0:o.mapValue)==null?void 0:c.fields)==null?void 0:l[(u=s.value)==null?void 0:u.stringValue];return i===void 0?E.Sr():E.newValue(i)}}class il{constructor(e){this.expr=e}evaluate(e,t){var l,f;k(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return E.vr()}if(n)return E.Dr();const o=Hc(s.value),c=Hc(i.value);if(o===void 0||c===void 0||((l=o.values)==null?void 0:l.length)!==((f=c.values)==null?void 0:f.length))return E.vr();const u=this.qr(o,c);return u===void 0||isNaN(u)?E.vr():E.newValue({doubleValue:u})}}class tR extends il{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,o=0,c=0;for(let l=0;l<n.length;l++){if(!wn(n[l])||!wn(s[l]))return;const f=Ne(n[l]),p=Ne(s[l]);i+=f*p,o+=f*f,c+=p*p}const u=Math.sqrt(o)*Math.sqrt(c);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class nR extends il{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!wn(n[o])||!wn(s[o]))return;i+=Ne(n[o])*Ne(s[o])}return i}}class rR extends il{qr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!wn(n[o])||!wn(s[o]))return;const c=Ne(n[o]),u=Ne(s[o]);i+=Math.pow(c-u,2)}return Math.sqrt(i)}}class sR{constructor(e){this.expr=e}evaluate(e,t){var s;k(this.expr.params.length===1,39044);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=Hc(n.value);return E.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return E.Dr();default:return E.vr()}}}const _i=BigInt(-62135596800),yi=BigInt(253402300799),ra=BigInt(1e3),In=BigInt(1e6),iR=_i*ra,oR=yi*ra+BigInt(999),aR=_i*In,cR=yi*In+BigInt(999999);function ol(r){return r>=aR&&r<=cR}function Cg(r){return r>=_i&&r<=yi}function Ii(r,e){const t=BigInt(r);return!(t<_i||t>yi)&&!(e<0||e>=1e9)&&(t!==_i||e===0)&&!(t===yi&&e>999999999)}function xg(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function al(r){return BigInt(r.seconds)*In+BigInt(Math.trunc(r.nanoseconds/1e3))}class cl{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return E.Dr();default:return E.vr()}}}class uR extends cl{toTimestamp(e){if(!ol(e))return E.vr();let t=Number(e/In),n=Number(e%In*BigInt(1e3));const s=xg(t,n);return t=s.seconds,n=s.nanos,Ii(t,n)?E.newValue({timestampValue:{seconds:t,nanos:n}}):E.vr()}}class lR extends cl{toTimestamp(e){if(!(function(o){return o>=iR&&o<=oR})(e))return E.vr();let t=Number(e/ra),n=Number(e%ra*BigInt(1e6));const s=xg(t,n);return t=s.seconds,n=s.nanos,Ii(t,n)?E.newValue({timestampValue:{seconds:t,nanos:n}}):E.vr()}}class hR extends cl{toTimestamp(e){if(!Cg(e))return E.vr();const t=Number(e);return E.newValue({timestampValue:{seconds:t,nanos:0}})}}class ul{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=j(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return E.Dr();default:return E.vr()}const s=Qu(n.value.timestampValue);return Ii(s.seconds,s.nanoseconds)?this.$r(s):E.vr()}}class dR extends ul{$r(e){const t=al(e);return ol(t)?E.newValue({integerValue:`${t.toString()}`}):E.vr()}}class fR extends ul{$r(e){const t=al(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?E.newValue({integerValue:n.toString()}):E.newValue({integerValue:(n-BigInt(1)).toString()})}}class pR extends ul{$r(e){const t=BigInt(e.seconds);return Cg(t)?E.newValue({integerValue:t.toString()}):E.vr()}}class Dg{constructor(e){this.expr=e}evaluate(e,t){k(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return E.vr()}const i=j(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(W){switch(W){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return E.vr();break;case"NULL":n=!0;break;default:return E.vr()}const c=j(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":n=!0;break;default:return E.vr()}if(n)return E.Dr();const u=BigInt(c.value.integerValue);let l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return E.vr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Kr(o)))return E.vr()}catch(z){return at(`Error during timestamp arithmetic: ${z}`),E.vr()}const f=Qu(s.value.timestampValue);if(!Ii(f.seconds,f.nanoseconds))return E.vr();const p=al(f),g=this.Wr(p,l);if(!ol(g))return E.vr();const R=Number(g/In),C=g%In,O=Number((C<0?C+In:C)*BigInt(1e3)),L=C<0?R-1:R;return Ii(L,O)?E.newValue({timestampValue:{seconds:L,nanos:O}}):E.vr()}Kr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class mR extends Dg{Wr(e,t){return e+t}}class gR extends Dg{Wr(e,t){return e-t}}function Ei(r){if((r=Sg(r))instanceof gr)return`fld(${r.fieldName})`;if(r instanceof _r)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof fe?`ref(${t.path})`:t instanceof He?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(r.value)})`;if(r instanceof x)return`fn(${r.name},[${r.params.map(Ei).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.Rr.map(Ei).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function _R(r){if(r instanceof Ag)return`${r._name}(${po(r.fields)})`;if(r instanceof Rg){let e=`${r._name}(${po(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${po(r.groups)})`),e}if(r instanceof Pg)return`${r._name}(${po(r.groups)})`;if(r instanceof Bi)return`${r._name}(${r.Vr})`;if(r instanceof qi)return`${r._name}(${r.collectionId})`;if(r instanceof Ca)return`${r._name}()`;if(r instanceof xa)return`${r._name}(${r.dr.sort()})`;if(r instanceof $i)return`${r._name}(${Ei(r.condition)})`;if(r instanceof bn)return`${r._name}(${r.limit})`;if(r instanceof Et)return`${r._name}(${(function(t){return t.map((n=>`${Ei(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function po(r){return`${Array.from(r.entries()).sort().map((([e,t])=>`${e}=${Ei(t)}`)).join(",")}`}function kt(r){return r.stages.map((e=>_R(e))).join("|")}function Ng(r,e){return kt(r)===kt(e)}function _e(r){return r instanceof Me}function af(r){return _e(r)?kt(r):Js(r)}function kg(r){return _e(r)?kt(r):(function(t){return`${Jo(tt(t))}|lt:${t.limitType}`})(r)}function Na(r,e){return r instanceof Me&&e instanceof Me?Ng(r,e):!(r instanceof Me&&!(e instanceof Me)||!(r instanceof Me)&&e instanceof Me)&&sv(r,e)}function ka(r){return Vt(r)?kt(r):Jo(r)}function ll(r,e){return r instanceof Me&&e instanceof Me?Ng(r,e):!(r instanceof Me&&!(e instanceof Me)||!(r instanceof Me)&&e instanceof Me)&&ju(r,e)}function yR(r,e){const t=(function(s){let i=!1;const o=[];for(const c of s)if(c instanceof Et)if(i=!0,c.orderings.some((u=>u.expr instanceof gr&&u.expr.fieldName===_t)))o.push(c);else{const u=c.orderings.map((l=>l));u.push(xo(_t).ascending()),o.push(new Et(u,{}))}else c instanceof bn&&(i||(o.push(new Et([xo(_t).ascending()],{})),i=!0)),o.push(c);return i||o.push(new Et([xo(_t).ascending()],{})),o})(r.stages);if(r.userDataReader){const n=r.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(n)))}return new Me(r.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&zw(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Ys(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Ys(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Um();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;const u=Rm(o,c);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument($.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Q())}isEqual(e){return this.batchId===e.batchId&&Br(this.mutations,e.mutations,((t,n)=>Md(t,n)))&&Br(this.baseMutations,e.baseMutations,((t,n)=>Md(t,n)))}}class dl{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){k(e.mutations.length===n.length,58842,{Qr:e.mutations.length,Gr:n.length});let s=(function(){return uv})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new dl(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e,t,n,s,i=$.min(),o=$.min(),c=de.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Tt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Tt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Og{constructor(e){this.zr=e}}function IR(r,e){let t;if(e.document)t=Iv(r.zr,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=F.fromSegments(e.noDocument.path),s=pr(e.noDocument.readTime);t=ge.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return B(56709);{const n=F.fromSegments(e.unknownDocument.path),s=pr(e.unknownDocument.version);t=ge.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new se(s[0],s[1]);return $.fromTimestamp(i)})(e.readTime)),t}function cf(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:sa(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:pi(i,o.key),fields:o.data.value.mapValue.fields,updateTime:Zr(i,o.version.toTimestamp()),createTime:Zr(i,o.createTime.toTimestamp())}})(r.zr,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:fr(e.version)};else{if(!e.isUnknownDocument())return B(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:fr(e.version)}}return n}function sa(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function fr(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function pr(r){const e=new se(r.seconds,r.nanoseconds);return $.fromTimestamp(e)}function Hn(r,e){const t=(e.baseMutations||[]).map((i=>nu(r.zr,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const c=e.mutations[i+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>nu(r.zr,i))),s=se.fromMillis(e.localWriteTimeMs);return new hl(e.batchId,s,t,n)}function $s(r,e){const t=pr(e.readTime),n=e.lastLimboFreeSnapshotVersion!==void 0?pr(e.lastLimboFreeSnapshotVersion):$.min();let s;return s=(function(o){return o.structuredPipeline!==void 0})(e.query)?(function(o,c){var f,p;const u=o.structuredPipeline;k((((f=u==null?void 0:u.pipeline)==null?void 0:f.stages)??[]).length>0,1845);const l=(p=u==null?void 0:u.pipeline)==null?void 0:p.stages.map(ER);return new Me(c,l)})(e.query,r.zr):(function(o){return o.documents!==void 0})(e.query)?(function(o){const c=o.documents.length;return k(c===1,1966,{count:c}),tt(Oi(Gm(o.documents[0])))})(e.query):(function(o){return tt(Qm(o))})(e.query),new Tt(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,de.fromBase64String(e.resumeToken))}function Lg(r,e){const t=fr(e.snapshotVersion),n=fr(e.lastLimboFreeSnapshotVersion);let s;s=Vt(e.target)?Ym(r.zr,e.target):zu(e.target)?Wm(r.zr,e.target):Hm(r.zr,e.target).yt;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:ka(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Mg(r){const e=Qm({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Zo(e,e.limit,"L"):e}function mo(r,e){return new fl(e.largestBatchId,nu(r.zr,e.overlayMutation))}function uf(r,e){const t=e.path.lastSegment();return[r,Fe(e.path.popLast()),t]}function lf(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:fr(n.readTime),documentKey:Fe(n.documentKey.path),largestBatchId:n.largestBatchId}}function ER(r){switch(r.name){case"collection":return new Bi(r.args[0].referenceValue,{});case"collection_group":return new qi(r.args[1].stringValue,{});case"database":return new Ca({});case"documents":return new xa(r.args.map((e=>e.referenceValue)),{});case"where":return new $i(su(r.args[0]),{});case"limit":{const e=r.args[0].integerValue??r.args[0].doubleValue;return new bn(typeof e=="number"?e:Number(e),{})}case"sort":return new Et(r.args.map((e=>(function(n){var i,o;const s=(i=n.mapValue)==null?void 0:i.fields;return new tl(su(s.expression),(o=s.direction)==null?void 0:o.stringValue,"orderingFromProto")})(e))),{});default:throw new Error(`Stage type: ${r.name} not supported.`)}}function su(r){return r.fieldReferenceValue?new gr(Ut("_exprFromProto",r.fieldReferenceValue),"_exprFromProto"):r.functionValue?(function(t){var n;return new x(t.functionValue.name,((n=t.functionValue.args)==null?void 0:n.map(su))||[])})(r):_r._fromProto(r)}class TR{getBundleMetadata(e,t){return hf(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:pr(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return hf(e).put((function(s){return{bundleId:s.id,createTime:fr(ze(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return df(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Mg(i.bundledQuery),readTime:pr(i.readTime)}})(n)}))}saveNamedQuery(e,t){return df(e).put((function(s){return{name:s.name,readTime:fr(ze(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function hf(r){return Re(r,Ta)}function df(r){return Re(r,wa)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(e,t){this.serializer=e,this.userId=t}static jr(e,t){const n=t.uid||"";return new Oa(e,n)}getOverlay(e,t){return Ar(e).get(uf(this.userId,t)).next((n=>n?mo(this.serializer,n):null))}getOverlays(e,t){const n=it();return A.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=it();return Ar(e).ee(((s,i)=>{const o=mo(this.serializer,i);o.largestBatchId>t&&n.set(o.getKey(),o)})).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const c=new fl(t,o);s.push(this.Hr(e,c))})),A.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(Fe(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Ar(e).Z(Gc,c))})),A.waitFor(i)}getOverlaysForCollection(e,t,n){const s=it(),i=Fe(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Ar(e).H(Gc,o).next((c=>{for(const u of c){const l=mo(this.serializer,u);s.set(l.getKey(),l)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=it();let o;const c=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Ar(e).ee({index:om,range:c},((u,l,f)=>{const p=mo(this.serializer,l);i.size()<s||p.largestBatchId===o?(i.set(p.getKey(),p),o=p.largestBatchId):f.done()})).next((()=>i))}Hr(e,t){return Ar(e).put((function(s,i,o){const[c,u,l]=uf(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:l,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:ea(s.zr,o.mutation)}})(this.serializer,this.userId,t))}}function Ar(r){return Re(r,va)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wR{Jr(e){return Re(e,Ou)}getSessionToken(e){return this.Jr(e).get("sessionToken").next((t=>{const n=t==null?void 0:t.value;return n?de.fromUint8Array(n):de.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Jr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qn{constructor(){}Yr(e,t){this.Zr(e,t),t.Xr()}Zr(e,t){if("nullValue"in e)this.ei(t,5);else if("booleanValue"in e)this.ei(t,10),t.ti(e.booleanValue?1:0);else if("integerValue"in e)this.ei(t,15),t.ti(ce(e.integerValue));else if("doubleValue"in e){const n=ce(e.doubleValue);isNaN(n)?this.ei(t,13):(this.ei(t,15),$r(n)?t.ti(0):t.ti(n))}else if("timestampValue"in e){let n=e.timestampValue;this.ei(t,20),typeof n=="string"&&(n=Mt(n)),t.ni(`${n.seconds||""}`),t.ti(n.nanos||0)}else if("stringValue"in e)this.ri(e.stringValue,t),this.ii(t);else if("bytesValue"in e)this.ei(t,30),t.si(Ft(e.bytesValue)),this.ii(t);else if("referenceValue"in e)this._i(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.ei(t,45),t.ti(n.latitude||0),t.ti(n.longitude||0)}else"mapValue"in e?ym(e)?this.ei(t,Number.MAX_SAFE_INTEGER):dr(e)?this.oi(e.mapValue,t):(this.ai(e.mapValue,t),this.ii(t)):"arrayValue"in e?(this.ui(e.arrayValue,t),this.ii(t)):B(19022,{ci:e})}ri(e,t){this.ei(t,25),this.li(e,t)}li(e,t){t.ni(e)}ai(e,t){const n=e.fields||{};this.ei(t,55);for(const s of Object.keys(n))this.ri(s,t),this.Zr(n[s],t)}oi(e,t){var o,c;const n=e.fields||{};this.ei(t,53);const s=lr,i=((c=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:c.length)||0;this.ei(t,15),t.ti(ce(i)),this.ri(s,t),this.Zr(n[s],t)}ui(e,t){const n=e.values||[];this.ei(t,50);for(const s of n)this.Zr(s,t)}_i(e,t){this.ei(t,37),F.fromName(e).path.forEach((n=>{this.ei(t,60),this.li(n,t)}))}ei(e,t){e.ti(t)}ii(e){e.ti(2)}}Qn.Ei=new Qn;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr=255;function vR(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function ff(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=vR(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class AR{constructor(){this.buffer=new Uint8Array(1024),this.position=0}hi(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ti(n.value),n=t.next();this.Pi()}Ri(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ii(n.value),n=t.next();this.Ai()}Vi(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ti(n);else if(n<2048)this.Ti(960|n>>>6),this.Ti(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ti(480|n>>>12),this.Ti(128|63&n>>>6),this.Ti(128|63&n);else{const s=t.codePointAt(0);this.Ti(240|s>>>18),this.Ti(128|63&s>>>12),this.Ti(128|63&s>>>6),this.Ti(128|63&s)}}this.Pi()}di(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ii(n);else if(n<2048)this.Ii(960|n>>>6),this.Ii(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ii(480|n>>>12),this.Ii(128|63&n>>>6),this.Ii(128|63&n);else{const s=t.codePointAt(0);this.Ii(240|s>>>18),this.Ii(128|63&s>>>12),this.Ii(128|63&s>>>6),this.Ii(128|63&s)}}this.Ai()}fi(e){const t=this.mi(e),n=ff(t);this.pi(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}gi(e){const t=this.mi(e),n=ff(t);this.pi(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}yi(){this.wi(Rr),this.wi(255)}bi(){this.Si(Rr),this.Si(255)}reset(){this.position=0}seed(e){this.pi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Di(){return this.buffer.slice(0,this.position)}mi(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ti(e){const t=255&e;t===0?(this.wi(0),this.wi(255)):t===Rr?(this.wi(Rr),this.wi(0)):this.wi(t)}Ii(e){const t=255&e;t===0?(this.Si(0),this.Si(255)):t===Rr?(this.Si(Rr),this.Si(0)):this.Si(e)}Pi(){this.wi(0),this.wi(1)}Ai(){this.Si(0),this.Si(1)}wi(e){this.pi(1),this.buffer[this.position++]=e}Si(e){this.pi(1),this.buffer[this.position++]=~e}pi(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class RR{constructor(e){this.xi=e}si(e){this.xi.hi(e)}ni(e){this.xi.Vi(e)}ti(e){this.xi.fi(e)}Xr(){this.xi.yi()}}class PR{constructor(e){this.xi=e}si(e){this.xi.Ri(e)}ni(e){this.xi.di(e)}ti(e){this.xi.gi(e)}Xr(){this.xi.bi()}}class Ns{constructor(){this.xi=new AR,this.ascending=new RR(this.xi),this.descending=new PR(this.xi)}seed(e){this.xi.seed(e)}Ci(e){return e===0?this.ascending:this.descending}Di(){return this.xi.Di()}reset(){this.xi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e,t,n,s){this.Fi=e,this.Oi=t,this.Mi=n,this.Ni=s}Li(){const e=this.Ni.length,t=e===0||this.Ni[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.Ni,0),t!==e?n.set([0],this.Ni.length):++n[n.length-1],new Yn(this.Fi,this.Oi,this.Mi,n)}Bi(e,t,n){return{indexId:this.Fi,uid:e,arrayValue:Do(this.Mi),directionalValue:Do(this.Ni),orderedDocumentKey:Do(t),documentKey:n.path.toArray()}}Ui(e,t,n){const s=this.Bi(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function tn(r,e){let t=r.Fi-e.Fi;return t!==0?t:(t=pf(r.Mi,e.Mi),t!==0?t:(t=pf(r.Ni,e.Ni),t!==0?t:F.comparator(r.Oi,e.Oi)))}function pf(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function Do(r){return Xf()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function mf(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class gf{constructor(e){this.ki=new re(((t,n)=>he.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.qi=e.orderBy,this.$i=[];for(const t of e.filters){const n=t;n.isInequality()?this.ki=this.ki.add(n):this.$i.push(n)}}get Ki(){return this.ki.size>1}Wi(e){if(k(e.collectionGroup===this.collectionId,49279),this.Ki)return!1;const t=$c(e);if(t!==void 0&&!this.Qi(t))return!1;const n=zn(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.Qi(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.ki.size>0){const c=this.ki.getIterator().getNext();if(!s.has(c.field.canonicalString())){const u=n[i];if(!this.Gi(c,u)||!this.zi(this.qi[o++],u))return!1}++i}for(;i<n.length;++i){const c=n[i];if(o>=this.qi.length||!this.zi(this.qi[o++],c))return!1}return!0}ji(){if(this.Ki)return null;let e=new re(he.comparator);const t=[];for(const n of this.$i)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Ao(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Ao(n.field,0))}for(const n of this.qi)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Ao(n.field,n.dir==="asc"?0:1)));return new zo(zo.UNKNOWN_ID,this.collectionId,t,ii.empty())}Qi(e){for(const t of this.$i)if(this.Gi(t,e))return!0;return!1}Gi(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}zi(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fg(r){var t,n;if(k(r instanceof Z||r instanceof ie,20012),r instanceof Z){if(r instanceof km){const s=((n=(t=r.value.arrayValue)==null?void 0:t.values)==null?void 0:n.map((i=>Z.create(r.field,"==",i))))||[];return ie.create(s,"or")}return r}const e=r.filters.map((s=>Fg(s)));return ie.create(e,r.op)}function bR(r){if(r.getFilters().length===0)return[];const e=au(Fg(r));return k(Ug(e),7391),iu(e)||ou(e)?[e]:e.getFilters()}function iu(r){return r instanceof Z}function ou(r){return r instanceof ie&&$u(r)}function Ug(r){return iu(r)||ou(r)||(function(t){if(t instanceof ie&&Qc(t)){for(const n of t.getFilters())if(!iu(n)&&!ou(n))return!1;return!0}return!1})(r)}function au(r){if(k(r instanceof Z||r instanceof ie,34018),r instanceof Z)return r;if(r.filters.length===1)return au(r.filters[0]);const e=r.filters.map((n=>au(n)));let t=ie.create(e,r.op);return t=ia(t),Ug(t)?t:(k(t instanceof ie,64498),k(Xr(t),40251),k(t.filters.length>1,57927),t.filters.reduce(((n,s)=>pl(n,s))))}function pl(r,e){let t;return k(r instanceof Z||r instanceof ie,38388),k(e instanceof Z||e instanceof ie,25473),t=r instanceof Z?e instanceof Z?(function(s,i){return ie.create([s,i],"and")})(r,e):_f(r,e):e instanceof Z?_f(e,r):(function(s,i){if(k(s.filters.length>0&&i.filters.length>0,48005),Xr(s)&&Xr(i))return xm(s,i.getFilters());const o=Qc(s)?s:i,c=Qc(s)?i:s,u=o.filters.map((l=>pl(l,c)));return ie.create(u,"or")})(r,e),ia(t)}function _f(r,e){if(Xr(e))return xm(e,r.getFilters());{const t=e.filters.map((n=>pl(r,n)));return ie.create(t,"or")}}function ia(r){if(k(r instanceof Z||r instanceof ie,11850),r instanceof Z)return r;const e=r.getFilters();if(e.length===1)return ia(e[0]);if(Vm(r))return r;const t=e.map((s=>ia(s))),n=[];return t.forEach((s=>{s instanceof Z?n.push(s):s instanceof ie&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:ie.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SR{constructor(){this.Hi=new ml}addToCollectionParentIndex(e,t){return this.Hi.add(t),A.resolve()}getCollectionParents(e,t){return A.resolve(this.Hi.getEntries(t))}addFieldIndex(e,t){return A.resolve()}deleteFieldIndex(e,t){return A.resolve()}deleteAllFieldIndexes(e){return A.resolve()}createTargetIndexes(e,t){return A.resolve()}getDocumentsMatchingTarget(e,t){return A.resolve(null)}getIndexType(e,t){return A.resolve(0)}getFieldIndexes(e,t){return A.resolve([])}getNextCollectionGroupToUpdate(e){return A.resolve(null)}getMinOffset(e,t){return A.resolve(nt.min())}getMinOffsetFromCollectionGroup(e,t){return A.resolve(nt.min())}updateCollectionGroup(e,t,n){return A.resolve()}updateIndexEntries(e,t){return A.resolve()}}class ml{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new re(J.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new re(J.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yf="IndexedDbIndexManager",go=new Uint8Array(0);class VR{constructor(e,t){this.databaseId=t,this.Ji=new ml,this.Yi=new Wt((n=>Jo(n)),((n,s)=>ju(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Ji.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Ji.add(t)}));const i={collectionId:n,parent:Fe(s)};return If(e).put(i)}return A.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Hp(t),""],!1,!0);return If(e).H(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(yt(o.parent))}return n}))}addFieldIndex(e,t){const n=ks(e),s=(function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=br(e);return i.next((c=>{o.put(lf(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=ks(e),s=br(e),i=Pr(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=ks(e),n=Pr(e),s=br(e);return t.Z().next((()=>n.Z())).next((()=>s.Z()))}createTargetIndexes(e,t){return A.forEach(this.Zi(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new gf(n).ji();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=Pr(e);let s=!0;const i=new Map;return A.forEach(this.Zi(t),(o=>this.Xi(e,o).next((c=>{s&&(s=!!c),i.set(o,c)})))).next((()=>{if(s){let o=Q();const c=[];return A.forEach(i,((u,l)=>{D(yf,`Using index ${(function(H){return`id=${H.indexId}|cg=${H.collectionGroup}|f=${H.fields.map((ue=>`${ue.fieldPath}:${ue.kind}`)).join(",")}`})(u)} to execute ${Jo(t)}`);const f=(function(H,ue){const te=$c(ue);if(te===void 0)return null;for(const ne of Xo(H,te.fieldPath))switch(ne.op){case"array-contains-any":return ne.value.arrayValue.values||[];case"array-contains":return[ne.value]}return null})(l,u),p=(function(H,ue){const te=new Map;for(const ne of zn(ue))for(const T of Xo(H,ne.fieldPath))switch(T.op){case"==":case"in":te.set(ne.fieldPath.canonicalString(),T.value);break;case"not-in":case"!=":return te.set(ne.fieldPath.canonicalString(),T.value),Array.from(te.values())}return null})(l,u),g=(function(H,ue){const te=[];let ne=!0;for(const T of zn(ue)){const _=T.kind===0?$d(H,T.fieldPath,H.startAt):jd(H,T.fieldPath,H.startAt);te.push(_.value),ne&&(ne=_.inclusive)}return new An(te,ne)})(l,u),R=(function(H,ue){const te=[];let ne=!0;for(const T of zn(ue)){const _=T.kind===0?jd(H,T.fieldPath,H.endAt):$d(H,T.fieldPath,H.endAt);te.push(_.value),ne&&(ne=_.inclusive)}return new An(te,ne)})(l,u),C=this.es(u,l,g),O=this.es(u,l,R),L=this.ts(u,l,p),z=this.ns(u.indexId,f,C,g.inclusive,O,R.inclusive,L);return A.forEach(z,(W=>n.Y(W,t.limit).next((H=>{H.forEach((ue=>{const te=F.fromSegments(ue.documentKey);o.has(te)||(o=o.add(te),c.push(te))}))}))))})).next((()=>c))}return A.resolve(null)}))}Zi(e){let t=this.Yi.get(e);return t||(e.filters.length===0?t=[e]:t=bR(ie.create(e.filters,"and")).map((n=>Jc(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Yi.set(e,t),t)}ns(e,t,n,s,i,o,c){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),l=u/(t!=null?t.length:1),f=[];for(let p=0;p<u;++p){const g=t?this.rs(t[p/l]):go,R=this.ss(e,g,n[p%l],s),C=this._s(e,g,i[p%l],o),O=c.map((L=>this.ss(e,g,L,!0)));f.push(...this.createRange(R,C,O))}return f}ss(e,t,n,s){const i=new Yn(e,F.empty(),t,n);return s?i:i.Li()}_s(e,t,n,s){const i=new Yn(e,F.empty(),t,n);return s?i.Li():i}Xi(e,t){const n=new gf(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const c of i)n.Wi(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o}))}getIndexType(e,t){let n=2;const s=this.Zi(t);return A.forEach(s,(i=>this.Xi(e,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let l=new re(he.comparator),f=!1;for(const p of u.filters)for(const g of p.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?f=!0:l=l.add(g.field));for(const p of u.orderBy)p.field.isKeyField()||(l=l.add(p.field));return l.size+(f?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}us(e,t){const n=new Ns;for(const s of zn(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Ci(s.kind);Qn.Ei.Yr(i,o)}return n.Di()}rs(e){const t=new Ns;return Qn.Ei.Yr(e,t.Ci(0)),t.Di()}cs(e,t){const n=new Ns;return Qn.Ei.Yr(hr(this.databaseId,t),n.Ci((function(i){const o=zn(i);return o.length===0?0:o[o.length-1].kind})(e))),n.Di()}ts(e,t,n){if(n===null)return[];let s=[];s.push(new Ns);let i=0;for(const o of zn(e)){const c=n[i++];for(const u of s)if(this.ls(t,o.fieldPath)&&vn(c))s=this.Es(s,o,c);else{const l=u.Ci(o.kind);Qn.Ei.Yr(c,l)}}return this.hs(s)}es(e,t,n){return this.ts(e,t,n.position)}hs(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Di();return t}Es(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const c of s){const u=new Ns;u.seed(c.Di()),Qn.Ei.Yr(o,u.Ci(t.kind)),i.push(u)}return i}ls(e,t){return!!e.filters.find((n=>n instanceof Z&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=ks(e),s=br(e);return(t?n.H(zc,IDBKeyRange.bound(t,t)):n.H()).next((i=>{const o=[];return A.forEach(i,(c=>s.get([c.indexId,this.uid]).next((u=>{o.push((function(f,p){const g=p?new ii(p.sequenceNumber,new nt(pr(p.readTime),new F(yt(p.documentKey)),p.largestBatchId)):ii.empty(),R=f.fields.map((([C,O])=>new Ao(he.fromServerFormat(C),O)));return new zo(f.indexId,f.collectionGroup,R,g)})(c,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:K(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=ks(e),i=br(e);return this.Ts(e).next((o=>s.H(zc,IDBKeyRange.bound(t,t)).next((c=>A.forEach(c,(u=>i.put(lf(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return A.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?A.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((c=>(n.set(s.collectionGroup,c),A.forEach(c,(u=>this.Ps(e,s,u).next((l=>{const f=this.Rs(i,u);return l.isEqual(f)?A.resolve():this.Is(e,i,u,l,f)})))))))}))}As(e,t,n,s){return Pr(e).put(s.Bi(this.uid,this.cs(n,t.key),t.key))}Vs(e,t,n,s){return Pr(e).delete(s.Ui(this.uid,this.cs(n,t.key),t.key))}Ps(e,t,n){const s=Pr(e);let i=new re(tn);return s.ee({index:im,range:IDBKeyRange.only([n.indexId,this.uid,Do(this.cs(n,t))])},((o,c)=>{i=i.add(new Yn(n.indexId,t,mf(c.arrayValue),mf(c.directionalValue)))})).next((()=>i))}Rs(e,t){let n=new re(tn);const s=this.us(t,e);if(s==null)return n;const i=$c(t);if(i!=null){const o=e.data.field(i.fieldPath);if(vn(o))for(const c of o.arrayValue.values||[])n=n.add(new Yn(t.indexId,e.key,this.rs(c),s))}else n=n.add(new Yn(t.indexId,e.key,go,s));return n}Is(e,t,n,s,i){D(yf,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,l,f,p,g){const R=u.getIterator(),C=l.getIterator();let O=vr(R),L=vr(C);for(;O||L;){let z=!1,W=!1;if(O&&L){const H=f(O,L);H<0?W=!0:H>0&&(z=!0)}else O!=null?W=!0:z=!0;z?(p(L),L=vr(C)):W?(g(O),O=vr(R)):(O=vr(R),L=vr(C))}})(s,i,tn,(c=>{o.push(this.As(e,t,n,c))}),(c=>{o.push(this.Vs(e,t,n,c))})),A.waitFor(o)}Ts(e){let t=1;return br(e).ee({index:sm,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,c)=>tn(o,c))).filter(((o,c,u)=>!c||tn(o,u[c-1])!==0));const s=[];s.push(e);for(const o of n){const c=tn(o,e),u=tn(o,t);if(c===0)s[0]=e.Li();else if(c>0&&u<0)s.push(o),s.push(o.Li());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.ds(s[o],s[o+1]))return[];const c=s[o].Ui(this.uid,go,F.empty()),u=s[o+1].Ui(this.uid,go,F.empty());i.push(IDBKeyRange.bound(c,u))}return i}ds(e,t){return tn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Ef)}getMinOffset(e,t){return A.mapArray(this.Zi(t),(n=>this.Xi(e,n).next((s=>s||B(44426))))).next(Ef)}}function If(r){return Re(r,ci)}function Pr(r){return Re(r,Hs)}function ks(r){return Re(r,ku)}function br(r){return Re(r,Ws)}function Ef(r){k(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;xu(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new nt(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bg(r,e,t){const n=r.store(ut),s=r.store(jr),i=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=n.ee({range:o},((f,p,g)=>(c++,g.delete())));i.push(u.next((()=>{k(c===1,47070,{batchId:t.batchId})})));const l=[];for(const f of t.mutations){const p=tm(e,f.key.path,t.batchId);i.push(s.delete(p)),l.push(f.key)}return A.waitFor(i).next((()=>l))}function oa(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw B(14731);e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.fs={}}static jr(e,t,n,s){k(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new La(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return nn(e).ee({index:Jn,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=Dr(e),o=nn(e);return o.add({}).next((c=>{k(typeof c=="number",49019);const u=new hl(c,t,n,s),l=(function(R,C,O){const L=O.baseMutations.map((W=>ea(R.zr,W))),z=O.mutations.map((W=>ea(R.zr,W)));return{userId:C,batchId:O.batchId,localWriteTimeMs:O.localWriteTime.toMillis(),baseMutations:L,mutations:z}})(this.serializer,this.userId,u),f=[];let p=new re(((g,R)=>K(g.canonicalString(),R.canonicalString())));for(const g of s){const R=tm(this.userId,g.key.path,c);p=p.add(g.key.path.popLast()),f.push(o.put(l)),f.push(i.put(R,uw))}return p.forEach((g=>{f.push(this.indexManager.addToCollectionParentIndex(e,g))})),e.addOnCommittedListener((()=>{this.fs[c]=u.keys()})),A.waitFor(f).next((()=>u))}))}lookupMutationBatch(e,t){return nn(e).get(t).next((n=>n?(k(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),Hn(this.serializer,n)):null))}ps(e,t){return this.fs[t]?A.resolve(this.fs[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.fs[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return nn(e).ee({index:Jn,range:s},((o,c,u)=>{c.userId===this.userId&&(k(c.batchId>=n,47524,{gs:n}),i=Hn(this.serializer,c)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Zn;return nn(e).ee({index:Jn,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Zn],[this.userId,Number.POSITIVE_INFINITY]);return nn(e).H(Jn,t).next((n=>n.map((s=>Hn(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Ro(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Dr(e).ee({range:s},((o,c,u)=>{const[l,f,p]=o,g=yt(f);if(l===this.userId&&t.path.isEqual(g))return nn(e).get(p).next((R=>{if(!R)throw B(61480,{ys:o,batchId:p});k(R.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:R.userId,batchId:p}),i.push(Hn(this.serializer,R))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(K);const s=[];return t.forEach((i=>{const o=Ro(this.userId,i.path),c=IDBKeyRange.lowerBound(o),u=Dr(e).ee({range:c},((l,f,p)=>{const[g,R,C]=l,O=yt(R);g===this.userId&&i.path.isEqual(O)?n=n.add(C):p.done()}));s.push(u)})),A.waitFor(s).next((()=>this.ws(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=Ro(this.userId,n),o=IDBKeyRange.lowerBound(i);let c=new re(K);return Dr(e).ee({range:o},((u,l,f)=>{const[p,g,R]=u,C=yt(g);p===this.userId&&n.isPrefixOf(C)?C.length===s&&(c=c.add(R)):f.done()})).next((()=>this.ws(e,c)))}ws(e,t){const n=[],s=[];return t.forEach((i=>{s.push(nn(e).get(i).next((o=>{if(o===null)throw B(35274,{batchId:i});k(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(Hn(this.serializer,o))})))})),A.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return Bg(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.bs(t.batchId)})),A.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}bs(e){delete this.fs[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return A.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return Dr(e).ee({range:n},((i,o,c)=>{if(i[0]===this.userId){const u=yt(i[1]);s.push(u)}else c.done()})).next((()=>{k(s.length===0,56720,{vs:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return qg(e,this.userId,t)}Ss(e){return $g(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:Zn,lastStreamToken:""}))}}function qg(r,e,t){const n=Ro(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Dr(r).ee({range:i,X:!0},((c,u,l)=>{const[f,p,g]=c;f===e&&p===s&&(o=!0),l.done()})).next((()=>o))}function nn(r){return Re(r,ut)}function Dr(r){return Re(r,jr)}function $g(r){return Re(r,oi)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e){this.Ds=e}next(){return this.Ds+=2,this.Ds}static xs(){return new qt(0)}static Cs(){return new qt(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CR{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Fs(e).next((t=>{const n=new qt(t.highestTargetId);return t.highestTargetId=n.next(),this.Os(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.Fs(e).next((t=>$.fromTimestamp(new se(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.Fs(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.Fs(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.Os(e,s))))}addTargetData(e,t){return this.Ms(e,t).next((()=>this.Fs(e).next((n=>(n.targetCount+=1,this.Ns(t,n),this.Os(e,n))))))}updateTargetData(e,t){return this.Ms(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>Sr(e).delete(t.targetId))).next((()=>this.Fs(e))).next((n=>(k(n.targetCount>0,8065),n.targetCount-=1,this.Os(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return Sr(e).ee(((o,c)=>{const u=$s(this.serializer,c);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>A.waitFor(i))).next((()=>s))}forEachTarget(e,t){return Sr(e).ee(((n,s)=>{const i=$s(this.serializer,s);t(i)}))}Fs(e){return Tf(e).get(Wo).next((t=>(k(t!==null,2888),t)))}Os(e,t){return Tf(e).put(Wo,t)}Ms(e,t){return Sr(e).put(Lg(this.serializer,t))}Ns(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.Fs(e).next((t=>t.targetCount))}getTargetData(e,t){const n=ka(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Sr(e).ee({range:s,index:rm},((o,c,u)=>{const l=$s(this.serializer,c);ll(t,l.target)&&(i=l,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=hn(e);return t.forEach((o=>{const c=Fe(o.path);s.push(i.put({targetId:n,path:c})),s.push(this.referenceDelegate.addReference(e,n,o))})),A.waitFor(s)}removeMatchingKeys(e,t,n){const s=hn(e);return A.forEach(t,(i=>{const o=Fe(i.path);return A.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=hn(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=hn(e);let i=Q();return s.ee({range:n,X:!0},((o,c,u)=>{const l=yt(o[1]),f=new F(l);i=i.add(f)})).next((()=>i))}containsKey(e,t){const n=Fe(t.path),s=IDBKeyRange.bound([n],[Hp(n)],!1,!0);let i=0;return hn(e).ee({index:Nu,X:!0,range:s},(([o,c],u,l)=>{o!==0&&(i++,l.done())})).next((()=>i>0))}dt(e,t){return Sr(e).get(t).next((n=>n?$s(this.serializer,n):null))}}function Sr(r){return Re(r,zr)}function Tf(r){return Re(r,er)}function hn(r){return Re(r,Gr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xR{constructor(e,t){this.db=e,this.garbageCollector=cg(this,t)}lr(e){const t=this.Ls(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Ls(e){let t=0;return this.Er(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Er(e,t){return this.Bs(e,((n,s)=>t(s)))}addReference(e,t,n){return _o(e,n)}removeReference(e,t,n){return _o(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return _o(e,t)}Us(e,t){return(function(s,i){let o=!1;return $g(s).te((c=>qg(s,c,i).next((u=>(u&&(o=!0),A.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Bs(e,((o,c)=>{if(c<=t){const u=this.Us(e,o).next((l=>{if(!l)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,$.min()),hn(e).delete((function(p){return[0,Fe(p.path)]})(o)))))}));s.push(u)}})).next((()=>A.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return _o(e,t)}Bs(e,t){const n=hn(e);let s,i=Ke.ce;return n.ee({index:Nu},(([o,c],{path:u,sequenceNumber:l})=>{o===0?(i!==Ke.ce&&t(new F(yt(s)),i),i=l,s=u):i=Ke.ce})).next((()=>{i!==Ke.ce&&t(new F(yt(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function _o(r,e){return hn(r).put((function(n,s){return{targetId:0,path:Fe(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function jg(r,e){var n;let t=e;for(const s of r.stages)t=DR({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function Ma(r,e){return jg(r,[e]).length>0}function zg(r,e){return _e(r)?Ma(r,e):ba(r,e)}function DR(r,e,t){if(e instanceof Bi)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.Vr))})(0,e,t);if(e instanceof $i)return(function(s,i,o){return o.filter((c=>{const u=ei(j(i.condition).evaluate(s,c));return u!==void 0&&ct(u,Qe)}))})(r,e,t);if(e instanceof qi)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Ca)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof xa)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&i.mr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof bn)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof Et)return(function(s,i,o){const c=i.orderings.map((u=>({ks:j(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(const{ks:f,direction:p}of c){const g=ei(f.evaluate(s,u)),R=ei(f.evaluate(s,l)),C=Ue(g??Rt,R??Rt);if(C!==0)return p==="ascending"?C:-C}return 0}))})(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function cu(r){const e=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof Et)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(t,n)=>{for(const s of e){const i=ei(j(s.expr).evaluate({serializer:r.serializer},t)),o=ei(j(s.expr).evaluate({serializer:r.serializer},n)),c=Ue(i||Rt,o||Rt);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function Rc(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof bn)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gg{constructor(){this.changes=new Wt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ge.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?A.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NR{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return rn(e).put(n)}removeEntry(e,t,n){return rn(e).delete((function(i,o){const c=i.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],sa(o),c[c.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.qs(e,n))))}getEntry(e,t){let n=ge.newInvalidDocument(t);return rn(e).ee({index:Po,range:IDBKeyRange.only(Os(t))},((s,i)=>{n=this.$s(t,i)})).next((()=>n))}Ks(e,t){let n={size:0,document:ge.newInvalidDocument(t)};return rn(e).ee({index:Po,range:IDBKeyRange.only(Os(t))},((s,i)=>{n={document:this.$s(t,i),size:oa(i)}})).next((()=>n))}getEntries(e,t){let n=ve();return this.Ws(e,t,((s,i)=>{const o=this.$s(s,i);n=n.insert(s,o)})).next((()=>n))}getAllEntries(e){let t=ve();return rn(e).ee(((n,s)=>{const i=this.$s(F.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)})).next((()=>t))}Qs(e,t){let n=ve(),s=new ae(F.comparator);return this.Ws(e,t,((i,o)=>{const c=this.$s(i,o);n=n.insert(i,c),s=s.insert(i,oa(o))})).next((()=>({documents:n,Gs:s})))}Ws(e,t,n){if(t.isEmpty())return A.resolve();let s=new re(Af);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(Os(s.first()),Os(s.last())),o=s.getIterator();let c=o.getNext();return rn(e).ee({index:Po,range:i},((u,l,f)=>{const p=F.fromSegments([...l.prefixPath,l.collectionGroup,l.documentId]);for(;c&&Af(c,p)<0;)n(c,null),c=o.getNext();c&&c.isEqual(p)&&(n(c,l),c=o.hasNext()?o.getNext():null),c?f.j(Os(c)):f.done()})).next((()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=_e(t)?J.fromString(ji(t)):t.path,c=[o.popLast().toArray(),o.lastSegment(),sa(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return rn(e).H(IDBKeyRange.bound(c,u,!0)).next((l=>{i==null||i.incrementDocumentReadCount(l.length);let f=ve();for(const p of l){const g=this.$s(F.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);g.isFoundDocument()&&(zg(t,g)||s.has(g.key))&&(f=f.insert(g.key,g))}return f}))}getAllFromCollectionGroup(e,t,n,s){let i=ve();const o=vf(t,n),c=vf(t,nt.max());return rn(e).ee({index:nm,range:IDBKeyRange.bound(o,c,!0)},((u,l,f)=>{const p=this.$s(F.fromSegments(l.prefixPath.concat(l.collectionGroup,l.documentId)),l);i=i.insert(p.key,p),i.size===s&&f.done()})).next((()=>i))}newChangeBuffer(e){return new kR(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return wf(e).get(jc).next((t=>(k(!!t,20021),t)))}qs(e,t){return wf(e).put(jc,t)}$s(e,t){if(t){const n=IR(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual($.min())))return n}return ge.newInvalidDocument(e)}}function Kg(r){return new NR(r)}class kR extends Gg{constructor(e,t){super(),this.zs=e,this.trackRemovals=t,this.js=new Wt((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new re(((i,o)=>K(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const c=this.js.get(i);if(t.push(this.zs.removeEntry(e,i,c.readTime)),o.isValidDocument()){const u=cf(this.zs.serializer,o);s=s.add(i.path.popLast());const l=oa(u);n+=l-c.size,t.push(this.zs.addEntry(e,i,u))}else if(n-=c.size,this.trackRemovals){const u=cf(this.zs.serializer,o.convertToNoDocument($.min()));t.push(this.zs.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.zs.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.zs.updateMetadata(e,n)),A.waitFor(t)}getFromCache(e,t){return this.zs.Ks(e,t).next((n=>(this.js.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.zs.Qs(e,t).next((({documents:n,Gs:s})=>(s.forEach(((i,o)=>{this.js.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function wf(r){return Re(r,ai)}function rn(r){return Re(r,Ko)}function Os(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function vf(r,e){const t=e.documentKey.path.toArray();return[r,sa(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Af(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=K(t[i],n[i]),s)return s;return s=K(t.length,n.length),s||(s=K(t[t.length-2],n[n.length-2]),s||K(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OR{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&Ys(n.mutation,s,We.empty(),se.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,Q()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=Q()){const s=it();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Wn();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=it();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,Q())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,n,s){let i=ve();const o=Xs(),c=(function(){return Xs()})();return t.forEach(((u,l)=>{const f=n.get(l.key);s.has(l.key)&&(f===void 0||f.mutation instanceof Kt)?i=i.insert(l.key,l):f!==void 0?(o.set(l.key,f.mutation.getFieldMask()),Ys(f.mutation,l,f.mutation.getFieldMask(),se.now())):o.set(l.key,We.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,f)=>o.set(l,f))),t.forEach(((l,f)=>c.set(l,new OR(f,o.get(l)??null)))),c)))}recalculateAndSaveOverlays(e,t){const n=Xs();let s=new ae(((o,c)=>o-c)),i=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const c of o)c.keys().forEach((u=>{const l=t.get(u);if(l===null)return;let f=n.get(u)||We.empty();f=c.applyToLocalView(l,f),n.set(u,f);const p=(s.get(c.batchId)||Q()).add(u);s=s.insert(c.batchId,p)}))})).next((()=>{const o=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),l=u.key,f=u.value,p=Um();f.forEach((g=>{if(!i.has(g)){const R=Rm(t.get(g),n.get(g));R!==null&&p.set(g,R),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,p))}return A.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return _e(t)?this.getDocumentsMatchingPipeline(e,t,n,s):ev(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Gu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):A.resolve(it());let c=qr,u=i;return o.next((l=>A.forEach(l,((f,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),i.get(f)?A.resolve():this.remoteDocumentCache.getEntry(e,f).next((g=>{u=u.insert(f,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,Q()))).next((f=>({batchId:c,changes:Fm(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new F(t)).next((n=>{let s=Wn();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Wn();return this.indexManager.getCollectionParents(e,i).next((c=>A.forEach(c,(u=>{const l=(function(p,g){return new On(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,n,s).next((f=>{f.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>ba(t,c)))))}getDocumentsMatchingPipeline(e,t,n,s){if(Nt(t)==="collection_group"){const i=rl(t);let o=Wn();return this.indexManager.getCollectionParents(e,i).next((c=>A.forEach(c,(u=>{const l=(function(p,g){const R=p.stages.map((C=>C instanceof qi?new Bi(g.canonicalString(),{}):C));return new Me(p.serializer,R)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,n,s).next((f=>{f.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next((o=>{switch(i=o,Nt(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let c=Q();for(const u of na(t))c=c.add(F.fromPath(u));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new N("invalid-argument",`Invalid pipeline source to execute offline: ${kt(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>Ma(t,c)))))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach(((i,o)=>{const c=o.getKey();t.get(c)===null&&(t=t.insert(c,ge.newInvalidDocument(c)))}));let s=Wn();return t.forEach(((i,o)=>{const c=e.get(i);c!==void 0&&Ys(c.mutation,o,We.empty(),se.now()),n(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,n){switch(Nt(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,J.fromString(ji(t)),n);case"collection_group":throw new N("invalid-argument",`Unexpected collection group pipeline: ${kt(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,na(t).map((s=>F.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new N("invalid-argument",`Failed to get overlays for pipeline: ${kt(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LR{constructor(e){this.serializer=e,this.Hs=new Map,this.Js=new Map}getBundleMetadata(e,t){return A.resolve(this.Hs.get(t))}saveBundleMetadata(e,t){return this.Hs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ze(s.createTime)}})(t)),A.resolve()}getNamedQuery(e,t){return A.resolve(this.Js.get(t))}saveNamedQuery(e,t){return this.Js.set(t.name,(function(s){return{name:s.name,query:Mg(s.bundledQuery),readTime:ze(s.readTime)}})(t)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MR{constructor(){this.overlays=new ae(F.comparator),this.Ys=new Map}getOverlay(e,t){return A.resolve(this.overlays.get(t))}getOverlays(e,t){const n=it();return A.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=it();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&n.set(s,i)})),A.resolve(n)}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.Hr(e,t,i)})),A.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Ys.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Ys.delete(n)),A.resolve()}getOverlaysForCollection(e,t,n){const s=it(),i=t.length+1,o=new F(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return A.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new ae(((l,f)=>l-f));const o=this.overlays.getIterator();for(;o.hasNext();){const l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>n){let f=i.get(l.largestBatchId);f===null&&(f=it(),i=i.insert(l.largestBatchId,f)),f.set(l.getKey(),l)}}const c=it(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,f)=>c.set(l,f))),!(c.size()>=s)););return A.resolve(c)}Hr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Ys.get(s.largestBatchId).delete(n.key);this.Ys.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new fl(t,n));let i=this.Ys.get(t);i===void 0&&(i=Q(),this.Ys.set(t,i)),this.Ys.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FR{constructor(){this.sessionToken=de.EMPTY_BYTE_STRING}getSessionToken(e){return A.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,A.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(){this.Zs=new re(be.Xs),this.e_=new re(be.t_)}isEmpty(){return this.Zs.isEmpty()}addReference(e,t){const n=new be(e,t);this.Zs=this.Zs.add(n),this.e_=this.e_.add(n)}n_(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.r_(new be(e,t))}i_(e,t){e.forEach((n=>this.removeReference(n,t)))}s_(e){const t=new F(new J([])),n=new be(t,e),s=new be(t,e+1),i=[];return this.e_.forEachInRange([n,s],(o=>{this.r_(o),i.push(o.key)})),i}__(){this.Zs.forEach((e=>this.r_(e)))}r_(e){this.Zs=this.Zs.delete(e),this.e_=this.e_.delete(e)}o_(e){const t=new F(new J([])),n=new be(t,e),s=new be(t,e+1);let i=Q();return this.e_.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new be(e,0),n=this.Zs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class be{constructor(e,t){this.key=e,this.a_=t}static Xs(e,t){return F.comparator(e.key,t.key)||K(e.a_,t.a_)}static t_(e,t){return K(e.a_,t.a_)||F.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.gs=1,this.u_=new re(be.Xs)}checkEmpty(e){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.gs;this.gs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new hl(i,t,n,s);this.mutationQueue.push(o);for(const c of s)this.u_=this.u_.add(new be(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return A.resolve(o)}lookupMutationBatch(e,t){return A.resolve(this.c_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.l_(n),i=s<0?0:s;return A.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?Zn:this.gs-1)}getAllMutationBatches(e){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new be(t,0),s=new be(t,Number.POSITIVE_INFINITY),i=[];return this.u_.forEachInRange([n,s],(o=>{const c=this.c_(o.a_);i.push(c)})),A.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new re(K);return t.forEach((s=>{const i=new be(s,0),o=new be(s,Number.POSITIVE_INFINITY);this.u_.forEachInRange([i,o],(c=>{n=n.add(c.a_)}))})),A.resolve(this.E_(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;F.isDocumentKey(i)||(i=i.child(""));const o=new be(new F(i),0);let c=new re(K);return this.u_.forEachWhile((u=>{const l=u.key.path;return!!n.isPrefixOf(l)&&(l.length===s&&(c=c.add(u.a_)),!0)}),o),A.resolve(this.E_(c))}E_(e){const t=[];return e.forEach((n=>{const s=this.c_(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){k(this.h_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.u_;return A.forEach(t.mutations,(s=>{const i=new be(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.u_=n}))}bs(e){}containsKey(e,t){const n=new be(t,0),s=this.u_.firstAfterOrEqual(n);return A.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,A.resolve()}h_(e,t){return this.l_(e)}l_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}c_(e){const t=this.l_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BR{constructor(e){this.T_=e,this.docs=(function(){return new ae(F.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.T_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return A.resolve(n?n.document.mutableCopy():ge.newInvalidDocument(t))}getEntries(e,t){let n=ve();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ge.newInvalidDocument(s))})),A.resolve(n)}getAllEntries(e){let t=ve();return this.docs.forEach(((n,s)=>{t=t.insert(n,s.document)})),A.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,o;_e(t)?(i=J.fromString(ji(t)),o=f=>Ma(t,f)):(i=t.path,o=f=>ba(t,f));let c=ve();const u=new F(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:f,value:{document:p}}=l.getNext();if(!i.isPrefixOf(f.path))break;f.path.length>i.length+1||xu(Yp(p),n)<=0||(s.has(p.key)||o(p))&&(c=c.insert(p.key,p.mutableCopy()))}return A.resolve(c)}getAllFromCollectionGroup(e,t,n,s){B(9500)}P_(e,t){return A.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new qR(this)}getSize(e){return A.resolve(this.size)}}class qR extends Gg{constructor(e){super(),this.zs=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.zs.addEntry(e,s)):this.zs.removeEntry(n)})),A.waitFor(t)}getFromCache(e,t){return this.zs.getEntry(e,t)}getAllFromCache(e,t){return this.zs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $R{constructor(e){this.persistence=e,this.R_=new Wt((t=>ka(t)),ll),this.lastRemoteSnapshotVersion=$.min(),this.highestTargetId=0,this.I_=0,this.A_=new gl,this.targetCount=0,this.V_=qt.xs()}forEachTarget(e,t){return this.R_.forEach(((n,s)=>t(s))),A.resolve()}getLastRemoteSnapshotVersion(e){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return A.resolve(this.I_)}allocateTargetId(e){return this.highestTargetId=this.V_.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.I_&&(this.I_=t),A.resolve()}Ms(e){this.R_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.V_=new qt(t),this.highestTargetId=t),e.sequenceNumber>this.I_&&(this.I_=e.sequenceNumber)}addTargetData(e,t){return this.Ms(t),this.targetCount+=1,A.resolve()}updateTargetData(e,t){return this.Ms(t),A.resolve()}removeTargetData(e,t){return this.R_.delete(t.target),this.A_.s_(t.targetId),this.targetCount-=1,A.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.R_.forEach(((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.R_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),A.waitFor(i).next((()=>s))}getTargetCount(e){return A.resolve(this.targetCount)}getTargetData(e,t){const n=this.R_.get(t)||null;return A.resolve(n)}addMatchingKeys(e,t,n){return this.A_.n_(t,n),A.resolve()}removeMatchingKeys(e,t,n){this.A_.i_(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),A.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.A_.s_(t),A.resolve()}getMatchingKeysForTargetId(e,t){const n=this.A_.o_(t);return A.resolve(n)}containsKey(e,t){return A.resolve(this.A_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e,t){this.d_={},this.overlays={},this.f_=new Ke(0),this.m_=!1,this.m_=!0,this.p_=new FR,this.referenceDelegate=e(this),this.g_=new $R(this),this.indexManager=new SR,this.remoteDocumentCache=(function(s){return new BR(s)})((n=>this.referenceDelegate.y_(n))),this.serializer=new Og(t),this.w_=new LR(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.m_=!1,Promise.resolve()}get started(){return this.m_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new MR,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.d_[e.toKey()];return n||(n=new UR(t,this.referenceDelegate),this.d_[e.toKey()]=n),n}getGlobalsCache(){return this.p_}getTargetCache(){return this.g_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.w_}runTransaction(e,t,n){D("MemoryPersistence","Starting transaction:",e);const s=new jR(this.f_.next());return this.referenceDelegate.b_(),n(s).next((i=>this.referenceDelegate.v_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}S_(e,t){return A.or(Object.values(this.d_).map((n=>()=>n.containsKey(e,t))))}}class jR extends Xp{constructor(e){super(),this.currentSequenceNumber=e}}class Fa{constructor(e){this.persistence=e,this.D_=new gl,this.x_=null}static C_(e){return new Fa(e)}get F_(){if(this.x_)return this.x_;throw B(60996)}addReference(e,t,n){return this.D_.addReference(n,t),this.F_.delete(n.toString()),A.resolve()}removeReference(e,t,n){return this.D_.removeReference(n,t),this.F_.add(n.toString()),A.resolve()}markPotentiallyOrphaned(e,t){return this.F_.add(t.toString()),A.resolve()}removeTarget(e,t){this.D_.s_(t.targetId).forEach((s=>this.F_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.F_.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}b_(){this.x_=new Set}v_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.F_,(n=>{const s=F.fromPath(n);return this.O_(e,s).next((i=>{i||t.removeEntry(s,$.min())}))})).next((()=>(this.x_=null,t.apply(e))))}updateLimboDocument(e,t){return this.O_(e,t).next((n=>{n?this.F_.delete(t.toString()):this.F_.add(t.toString())}))}y_(e){return 0}O_(e,t){return A.or([()=>A.resolve(this.D_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.S_(e,t)])}}class aa{constructor(e,t){this.persistence=e,this.M_=new Wt((n=>Fe(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=cg(this,t)}static C_(e,t){return new aa(e,t)}b_(){}v_(e){return A.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}lr(e){const t=this.Ls(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Ls(e){let t=0;return this.Er(e,(n=>{t++})).next((()=>t))}Er(e,t){return A.forEach(this.M_,((n,s)=>this.Us(e,n,s).next((i=>i?A.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.P_(e,(o=>this.Us(e,o,t).next((c=>{c||(n++,i.removeEntry(o,$.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.M_.set(t,e.currentSequenceNumber),A.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.M_.set(n,e.currentSequenceNumber),A.resolve()}removeReference(e,t,n){return this.M_.set(n,e.currentSequenceNumber),A.resolve()}updateLimboDocument(e,t){return this.M_.set(t,e.currentSequenceNumber),A.resolve()}y_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=bo(e.data.value)),t}Us(e,t,n){return A.or([()=>this.persistence.S_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.M_.get(t);return A.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zR{constructor(e){this.serializer=e}U(e,t,n,s){const i=new Ia("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(xi)})(e),(function(u){u.createObjectStore(oi,{keyPath:cw}),u.createObjectStore(ut,{keyPath:Vd,autoIncrement:!0}).createIndex(Jn,Cd,{unique:!0}),u.createObjectStore(jr)})(e),Rf(e),(function(u){u.createObjectStore(Gn)})(e));let o=A.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(Gr),u.deleteObjectStore(zr),u.deleteObjectStore(er)})(e),Rf(e)),o=o.next((()=>(function(u){const l=u.store(er),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:$.min().toTimestamp(),targetCount:0};return l.put(Wo,f)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,l){return l.store(ut).H().next((p=>{u.deleteObjectStore(ut),u.createObjectStore(ut,{keyPath:Vd,autoIncrement:!0}).createIndex(Jn,Cd,{unique:!0});const g=l.store(ut),R=p.map((C=>g.put(C)));return A.waitFor(R)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(Kr,{keyPath:_w})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.N_(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(ai)})(e),this.L_(i))))),n<7&&s>=7&&(o=o.next((()=>this.B_(i)))),n<8&&s>=8&&(o=o.next((()=>this.U_(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.k_(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(Ta,{keyPath:yw})})(e),(function(u){u.createObjectStore(wa,{keyPath:Iw})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const l=u.createObjectStore(va,{keyPath:Pw});l.createIndex(Gc,bw,{unique:!1}),l.createIndex(om,Sw,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const l=u.createObjectStore(Ko,{keyPath:lw});l.createIndex(Po,hw),l.createIndex(nm,dw)})(e))).next((()=>this.q_(e,i))).next((()=>e.deleteObjectStore(Gn)))),n<14&&s>=14&&(o=o.next((()=>this.K_(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(ku,{keyPath:Ew,autoIncrement:!0}).createIndex(zc,Tw,{unique:!1}),u.createObjectStore(Ws,{keyPath:ww}).createIndex(sm,vw,{unique:!1}),u.createObjectStore(Hs,{keyPath:Aw}).createIndex(im,Rw,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(Ws).clear()})).next((()=>{t.objectStore(Hs).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(Ou,{keyPath:Vw})})(e)}))),n<18&&s>=18&&Xf()&&(o=o.next((()=>{t.objectStore(Ws).clear()})).next((()=>{t.objectStore(Hs).clear()}))),o}L_(e){let t=0;return e.store(Gn).ee(((n,s)=>{t+=oa(s)})).next((()=>{const n={byteSize:t};return e.store(ai).put(jc,n)}))}N_(e){const t=e.store(oi),n=e.store(ut);return t.H().next((s=>A.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,Zn],[i.userId,i.lastAcknowledgedBatchId]);return n.H(Jn,o).next((c=>A.forEach(c,(u=>{k(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const l=Hn(this.serializer,u);return Bg(e,i.userId,l).next((()=>{}))}))))}))))}B_(e){const t=e.store(Gr),n=e.store(Gn);return e.store(er).get(Wo).next((s=>{const i=[];return n.ee(((o,c)=>{const u=new J(o),l=(function(p){return[0,Fe(p)]})(u);i.push(t.get(l).next((f=>f?A.resolve():(p=>t.put({targetId:0,path:Fe(p),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>A.waitFor(i)))}))}U_(e,t){e.createObjectStore(ci,{keyPath:gw});const n=t.store(ci),s=new ml,i=o=>{if(s.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:Fe(u)})}};return t.store(Gn).ee({X:!0},((o,c)=>{const u=new J(o);return i(u.popLast())})).next((()=>t.store(jr).ee({X:!0},(([o,c,u],l)=>{const f=yt(c);return i(f.popLast())}))))}k_(e){const t=e.store(zr);return t.ee(((n,s)=>{const i=$s(this.serializer,s),o=Lg(this.serializer,i);return t.put(o)}))}q_(e,t){const n=t.store(Gn),s=[];return n.ee(((i,o)=>{const c=t.store(Ko),u=(function(p){return p.document?new F(J.fromString(p.document.name).popFirst(5)):p.noDocument?F.fromSegments(p.noDocument.path):p.unknownDocument?F.fromSegments(p.unknownDocument.path):B(36783)})(o).path.toArray(),l={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(c.put(l))})).next((()=>A.waitFor(s)))}K_(e,t){const n=t.store(ut),s=Kg(this.serializer),i=new _l(Fa.C_,this.serializer.zr);return n.H().next((o=>{const c=new Map;return o.forEach((u=>{let l=c.get(u.userId)??Q();Hn(this.serializer,u).keys().forEach((f=>l=l.add(f))),c.set(u.userId,l)})),A.forEach(c,((u,l)=>{const f=new Se(l),p=Oa.jr(this.serializer,f),g=i.getIndexManager(f),R=La.jr(f,this.serializer,g,i.referenceDelegate);return new Wg(s,R,p,g).recalculateAndSaveOverlaysForDocumentKeys(new Kc(t,Ke.ce),u).next()}))}))}}function Rf(r){r.createObjectStore(Gr,{keyPath:pw}).createIndex(Nu,mw,{unique:!0}),r.createObjectStore(zr,{keyPath:"targetId"}).createIndex(rm,fw,{unique:!0}),r.createObjectStore(er)}const sn="IndexedDbPersistence",Pc=18e5,bc=5e3,Sc="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",GR="main";class yl{constructor(e,t,n,s,i,o,c,u,l,f,p=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Tn=i,this.window=o,this.document=c,this.W_=l,this.Q_=f,this.G_=p,this.f_=null,this.m_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.z_=null,this.inForeground=!1,this.j_=null,this.H_=null,this.J_=Number.NEGATIVE_INFINITY,this.Y_=g=>Promise.resolve(),!yl.C())throw new N(S.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new xR(this,s),this.Z_=t+GR,this.serializer=new Og(u),this.X_=new _n(this.Z_,this.G_,new zR(this.serializer)),this.p_=new wR,this.g_=new CR(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Kg(this.serializer),this.w_=new TR,this.window&&this.window.localStorage?this.eo=this.window.localStorage:(this.eo=null,f===!1&&ye(sn,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.no().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new N(S.FAILED_PRECONDITION,Sc);return this.ro(),this.io(),this.so(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.g_.getHighestSequenceNumber(e)))})).then((e=>{this.f_=new Ke(e,this.W_)})).then((()=>{this.m_=!0})).catch((e=>(this.X_&&this.X_.close(),Promise.reject(e))))}_o(e){return this.Y_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.X_.q((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Tn.enqueueAndForget((async()=>{this.started&&await this.no()})))}no(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>yo(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.oo(e).next((t=>{t||(this.isPrimary=!1,this.Tn.enqueueRetryable((()=>this.Y_(!1))))}))})).next((()=>this.ao(e))).next((t=>this.isPrimary&&!t?this.uo(e).next((()=>!1)):!!t&&this.co(e).next((()=>!0)))))).catch((e=>{if(Nn(e))return D(sn,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return D(sn,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Tn.enqueueRetryable((()=>this.Y_(e))),this.isPrimary=e}))}oo(e){return Ls(e).get(wr).next((t=>A.resolve(this.lo(t))))}Eo(e){return yo(e).delete(this.clientId)}async ho(){if(this.isPrimary&&!this.To(this.J_,Pc)){this.J_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=Re(t,Kr);return n.H().next((s=>{const i=this.Po(s,Pc),o=s.filter((c=>i.indexOf(c)===-1));return A.forEach(o,(c=>n.delete(c.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.eo)for(const t of e)this.eo.removeItem(this.Ro(t.clientId))}}so(){this.H_=this.Tn.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.no().then((()=>this.ho())).then((()=>this.so()))))}lo(e){return!!e&&e.ownerId===this.clientId}ao(e){return this.Q_?A.resolve(!0):Ls(e).get(wr).next((t=>{if(t!==null&&this.To(t.leaseTimestampMs,bc)&&!this.Io(t.ownerId)){if(this.lo(t)&&this.networkEnabled)return!0;if(!this.lo(t)){if(!t.allowTabSynchronization)throw new N(S.FAILED_PRECONDITION,Sc);return!1}}return!(!this.networkEnabled||!this.inForeground)||yo(e).H().next((n=>this.Po(n,bc).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,c=this.networkEnabled===s.networkEnabled;if(i||o&&c)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&D(sn,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.m_=!1,this.Ao(),this.H_&&(this.H_.cancel(),this.H_=null),this.Vo(),this.fo(),await this.X_.runTransaction("shutdown","readwrite",[xi,Kr],(e=>{const t=new Kc(e,Ke.ce);return this.uo(t).next((()=>this.Eo(t)))})),this.X_.close(),this.mo()}Po(e,t){return e.filter((n=>this.To(n.updateTimeMs,t)&&!this.Io(n.clientId)))}po(){return this.runTransaction("getActiveClients","readonly",(e=>yo(e).H().next((t=>this.Po(t,Pc).map((n=>n.clientId))))))}get started(){return this.m_}getGlobalsCache(){return this.p_}getMutationQueue(e,t){return La.jr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.g_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new VR(e,this.serializer.zr.databaseId)}getDocumentOverlayCache(e){return Oa.jr(this.serializer,e)}getBundleCache(){return this.w_}runTransaction(e,t,n){D(sn,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?Dw:u===17?lm:u===16?xw:u===15?Lu:u===14?um:u===13?cm:u===12?Cw:u===11?am:void B(60245)})(this.G_);let o;return this.X_.runTransaction(e,s,i,(c=>(o=new Kc(c,this.f_?this.f_.next():Ke.ce),t==="readwrite-primary"?this.oo(o).next((u=>!!u||this.ao(o))).next((u=>{if(!u)throw ye(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Tn.enqueueRetryable((()=>this.Y_(!1))),new N(S.FAILED_PRECONDITION,Jp);return n(o)})).next((u=>this.co(o).next((()=>u)))):this.yo(o).next((()=>n(o)))))).then((c=>(o.raiseOnCommittedEvent(),c)))}yo(e){return Ls(e).get(wr).next((t=>{if(t!==null&&this.To(t.leaseTimestampMs,bc)&&!this.Io(t.ownerId)&&!this.lo(t)&&!(this.Q_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new N(S.FAILED_PRECONDITION,Sc)}))}co(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Ls(e).put(wr,t)}static C(){return _n.C()}uo(e){const t=Ls(e);return t.get(wr).next((n=>this.lo(n)?(D(sn,"Releasing primary lease."),t.delete(wr)):A.resolve()))}To(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(ye(`Detected an update time that is in the future: ${e} > ${n}`),!1))}ro(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.j_=()=>{this.Tn.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.no())))},this.document.addEventListener("visibilitychange",this.j_),this.inForeground=this.document.visibilityState==="visible")}Vo(){this.j_&&(this.document.removeEventListener("visibilitychange",this.j_),this.j_=null)}io(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.z_=()=>{this.Ao();const t=/(?:Version|Mobile)\/1[456]/;Jf()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.Tn.enterRestrictedMode(!0),this.Tn.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.z_))}fo(){this.z_&&(this.window.removeEventListener("pagehide",this.z_),this.z_=null)}Io(e){var t;try{const n=((t=this.eo)==null?void 0:t.getItem(this.Ro(e)))!==null;return D(sn,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ye(sn,"Failed to get zombied client id.",n),!1}}Ao(){if(this.eo)try{this.eo.setItem(this.Ro(this.clientId),String(Date.now()))}catch(e){ye("Failed to set zombie client id.",e)}}mo(){if(this.eo)try{this.eo.removeItem(this.Ro(this.clientId))}catch{}}Ro(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Ls(r){return Re(r,xi)}function yo(r){return Re(r,Kr)}function Hg(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.wo=n,this.bo=s}static vo(e,t){let n=Q(),s=Q();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Il(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KR(r,e){return F.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WR{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg{constructor(){this.So=!1,this.Do=!1,this.xo=100,this.Co=(function(){return Jf()?8:Zp(Ae())>0?6:4})()}initialize(e,t){this.Fo=e,this.indexManager=t,this.So=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.Oo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Mo(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new WR;return this.No(e,t,o).next((c=>{if(i.result=c,this.Do)return this.Lo(e,t,o,c.size)}))})).next((()=>i.result))}Lo(e,t,n,s){return _e(t)?A.resolve():n.documentReadCount<this.xo?(Vr()<=X.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",Js(t),"since it only creates cache indexes for collection contains","more than or equal to",this.xo,"documents"),A.resolve()):(Vr()<=X.DEBUG&&D("QueryEngine","Query:",Js(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Co*s?(Vr()<=X.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",Js(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,tt(t))):A.resolve())}Oo(e,t){if(_e(t))return A.resolve(null);let n=t;if(zd(n))return A.resolve(null);let s=tt(n);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=Zo(n,null,"F"),s=tt(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const c=Q(...o);return this.Fo.getDocuments(e,c).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{const f=this.Bo(n,u);return this.Uo(n,f,c,l.readTime)?this.Oo(e,Zo(n,null,"F")):this.ko(e,f,n,l)}))))})))))}Mo(e,t,n,s){return(_e(t)?(function(o){for(const c of o.stages){if(c instanceof bn||c instanceof of)return!1;if(c instanceof $i){if(c.condition instanceof wg&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof gr&&c.condition._expr.params[0].fieldName===_t)continue;return!1}}return!0})(t):zd(t))||s.isEqual($.min())?A.resolve(null):this.Fo.getDocuments(e,n).next((i=>{const o=this.Bo(t,i);return this.Uo(t,o,n,s)?A.resolve(null):(Vr()<=X.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),af(t)),this.ko(e,o,t,Qp(s,qr)).next((c=>c)))}))}Bo(e,t){let n,s;return _e(e)?(n=new re(KR),s=i=>Ma(e,i)):(n=new re(Ku(e)),s=i=>ba(e,i)),t.forEach(((i,o)=>{s(o)&&(n=n.add(o))})),n}Uo(e,t,n,s){if(_e(e))return(function(c){return c.stages.some((u=>u instanceof bn||u instanceof of))})(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}No(e,t,n){return Vr()<=X.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",af(t)),this.Fo.getDocumentsMatchingQuery(e,t,nt.min(),n)}ko(e,t,n,s){return this.Fo.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const El="LocalStore",HR=3e8;class QR{constructor(e,t,n,s){this.persistence=e,this.qo=t,this.serializer=s,this.$o=new ae(K),this.Ko=new Wt((i=>ka(i)),ll),this.Wo=new Map,this.Qo=e.getRemoteDocumentCache(),this.g_=e.getTargetCache(),this.w_=e.getBundleCache(),this.Go(n)}Go(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Wg(this.Qo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Qo.setIndexManager(this.indexManager),this.qo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.$o)))}}function Yg(r,e,t,n){return new QR(r,e,t,n)}async function Jg(r,e){const t=q(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Go(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],c=[];let u=Q();for(const l of s){o.push(l.batchId);for(const f of l.mutations)u=u.add(f.key)}for(const l of i){c.push(l.batchId);for(const f of l.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(n,u).next((l=>({zo:l,removedBatchIds:o,addedBatchIds:c})))}))}))}function YR(r,e){const t=q(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Qo.newChangeBuffer({trackRemovals:!0});return(function(c,u,l,f){const p=l.batch,g=p.keys();let R=A.resolve();return g.forEach((C=>{R=R.next((()=>f.getEntry(u,C))).next((O=>{const L=l.docVersions.get(C);k(L!==null,48541),O.version.compareTo(L)<0&&(p.applyToRemoteDocument(O,l),O.isValidDocument()&&(O.setReadTime(l.commitVersion),f.addEntry(O)))}))})),R.next((()=>c.mutationQueue.removeMutationBatch(u,p)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(c){let u=Q();for(let l=0;l<c.mutationResults.length;++l)c.mutationResults[l].transformResults.length>0&&(u=u.add(c.batch.mutations[l].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Xg(r){const e=q(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.g_.getLastRemoteSnapshotVersion(t)))}function JR(r,e){const t=q(r),n=e.snapshotVersion;let s=t.$o;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Qo.newChangeBuffer({trackRemovals:!0});s=t.$o;const c=[];e.targetChanges.forEach(((f,p)=>{const g=s.get(p);if(!g)return;c.push(t.g_.removeMatchingKeys(i,f.removedDocuments,p).next((()=>t.g_.addMatchingKeys(i,f.addedDocuments,p))));let R=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(p)!==null?R=R.withResumeToken(de.EMPTY_BYTE_STRING,$.min()).withLastLimboFreeSnapshotVersion($.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,n)),s=s.insert(p,R),(function(O,L,z){return O.resumeToken.approximateByteSize()===0||L.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=HR?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0})(g,R,f)&&c.push(t.g_.updateTargetData(i,R))}));let u=ve(),l=Q();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(XR(i,o,e.documentUpdates).next((f=>{u=f.jo,l=f.Ho}))),!n.isEqual($.min())){const f=t.g_.getLastRemoteSnapshotVersion(i).next((p=>t.g_.setTargetsMetadata(i,i.currentSequenceNumber,n)));c.push(f)}return A.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.$o=s,i)))}function XR(r,e,t){let n=Q(),s=Q();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=ve();return t.forEach(((c,u)=>{const l=i.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual($.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):D(El,"Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)})),{jo:o,Ho:s}}))}function ZR(r,e){const t=q(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=Zn),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function ca(r,e){const t=q(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.g_.getTargetData(n,e).next((i=>i?(s=i,A.resolve(s)):t.g_.allocateTargetId(n).next((o=>(s=new Tt(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.g_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.$o.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.$o=t.$o.insert(n.targetId,n),t.Ko.set(e,n.targetId)),n}))}async function es(r,e,t){const n=q(r),s=n.$o.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Nn(o))throw o;D(El,`Failed to update sequence numbers for target ${e}: ${o}`)}n.$o=n.$o.remove(e),n.Ko.delete(s.target)}function uu(r,e,t){const n=q(r);let s=$.min(),i=Q();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,f){const p=q(u),g=p.Ko.get(f);return g!==void 0?A.resolve(p.$o.get(g)):p.g_.getTargetData(l,f)})(n,o,_e(e)?e:tt(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,n.g_.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>n.qo.getDocumentsMatchingQuery(o,e,t?s:$.min(),t?i:Q()))).next((c=>(e_(n,c),{documents:c,Jo:i})))))}function Zg(r,e){const t=q(r),n=q(t.g_),s=t.$o.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",(i=>n.dt(i,e).next((o=>(o==null?void 0:o.target)??null))))}function lu(r,e){const t=q(r),n=t.Wo.get(e)||$.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Qo.getAllFromCollectionGroup(s,e,Qp(n,qr),Number.MAX_SAFE_INTEGER))).then((s=>(e_(t,s),s)))}function e_(r,e){e.forEach(((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Wo.get(s)||$.min();n.readTime.compareTo(i)>0&&r.Wo.set(s,n.readTime)}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_="firestore_clients";function Pf(r,e){return`${t_}_${r}_${e}`}const n_="firestore_mutations";function bf(r,e,t){let n=`${n_}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const r_="firestore_targets";function Vc(r,e){return`${r_}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gt="SharedClientState";class ua{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static ea(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new N(s.error.code,s.error.message))),o?new ua(e,t,s.state,i):(ye(gt,`Failed to parse mutation state for ID '${t}': ${n}`),null)}ta(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ti{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static ea(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new N(n.error.code,n.error.message))),i?new ti(e,n.state,s):(ye(gt,`Failed to parse target state for ID '${e}': ${t}`),null)}ta(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class la{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static ea(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Wu();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=em(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new la(e,i):(ye(gt,`Failed to parse client data for instance '${e}': ${t}`),null)}}class Tl{constructor(e,t){this.clientId=e,this.onlineState=t}static ea(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Tl(t.clientId,t.onlineState):(ye(gt,`Failed to parse online state: ${e}`),null)}}class hu{constructor(){this.activeTargetIds=Wu()}na(e){this.activeTargetIds=this.activeTargetIds.add(e)}ra(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ta(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Cc{constructor(e,t,n,s,i){this.window=e,this.Tn=t,this.persistenceKey=n,this.ia=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.sa=this._a.bind(this),this.oa=new ae(K),this.started=!1,this.aa=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.ua=Pf(this.persistenceKey,this.ia),this.ca=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.oa=this.oa.insert(this.ia,new hu),this.la=new RegExp(`^${t_}_${o}_([^_]*)$`),this.Ea=new RegExp(`^${n_}_${o}_(\\d+)(?:_(.*))?$`),this.ha=new RegExp(`^${r_}_${o}_(\\d+)$`),this.Ta=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.Pa=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.sa)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.po();for(const n of e){if(n===this.ia)continue;const s=this.getItem(Pf(this.persistenceKey,n));if(s){const i=la.ea(n,s);i&&(this.oa=this.oa.insert(i.clientId,i))}}this.Ra();const t=this.storage.getItem(this.Ta);if(t){const n=this.Ia(t);n&&this.Aa(n)}for(const n of this.aa)this._a(n);this.aa=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.ca,JSON.stringify(e))}getAllActiveQueryTargets(){return this.Va(this.oa)}isActiveQueryTarget(e){let t=!1;return this.oa.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.da(e,"pending")}updateMutationState(e,t,n){this.da(e,t,n),this.fa(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(Vc(this.persistenceKey,e));if(s){const i=ti.ea(e,s);i&&(n=i.state)}}return t&&this.ma.na(e),this.Ra(),n}removeLocalQueryTarget(e){this.ma.ra(e),this.Ra()}isLocalQueryTarget(e){return this.ma.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Vc(this.persistenceKey,e))}updateQueryState(e,t,n){this.pa(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.fa(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.ga(e)}notifyBundleLoaded(e){this.ya(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.sa),this.removeItem(this.ua),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return D(gt,"READ",e,t),t}setItem(e,t){D(gt,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){D(gt,"REMOVE",e),this.storage.removeItem(e)}_a(e){const t=e;if(t.storageArea===this.storage){if(D(gt,"EVENT",t.key,t.newValue),t.key===this.ua)return void ye("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Tn.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.la.test(t.key)){if(t.newValue==null){const n=this.wa(t.key);return this.ba(n,null)}{const n=this.va(t.key,t.newValue);if(n)return this.ba(n.clientId,n)}}else if(this.Ea.test(t.key)){if(t.newValue!==null){const n=this.Sa(t.key,t.newValue);if(n)return this.Da(n)}}else if(this.ha.test(t.key)){if(t.newValue!==null){const n=this.xa(t.key,t.newValue);if(n)return this.Ca(n)}}else if(t.key===this.Ta){if(t.newValue!==null){const n=this.Ia(t.newValue);if(n)return this.Aa(n)}}else if(t.key===this.ca){const n=(function(i){let o=Ke.ce;if(i!=null)try{const c=JSON.parse(i);k(typeof c=="number",30636,{Fa:i}),o=c}catch(c){ye(gt,"Failed to read sequence number from WebStorage",c)}return o})(t.newValue);n!==Ke.ce&&this.sequenceNumberHandler(n)}else if(t.key===this.Pa){const n=this.Oa(t.newValue);await Promise.all(n.map((s=>this.syncEngine.Ma(s))))}}}else this.aa.push(t)}))}}get ma(){return this.oa.get(this.ia)}Ra(){this.setItem(this.ua,this.ma.ta())}da(e,t,n){const s=new ua(this.currentUser,e,t,n),i=bf(this.persistenceKey,this.currentUser,e);this.setItem(i,s.ta())}fa(e){const t=bf(this.persistenceKey,this.currentUser,e);this.removeItem(t)}ga(e){const t={clientId:this.ia,onlineState:e};this.storage.setItem(this.Ta,JSON.stringify(t))}pa(e,t,n){const s=Vc(this.persistenceKey,e),i=new ti(e,t,n);this.setItem(s,i.ta())}ya(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Pa,t)}wa(e){const t=this.la.exec(e);return t?t[1]:null}va(e,t){const n=this.wa(e);return la.ea(n,t)}Sa(e,t){const n=this.Ea.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return ua.ea(new Se(i),s,t)}xa(e,t){const n=this.ha.exec(e),s=Number(n[1]);return ti.ea(s,t)}Ia(e){return Tl.ea(e)}Oa(e){return JSON.parse(e)}async Da(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Na(e.batchId,e.state,e.error);D(gt,`Ignoring mutation for non-active user ${e.user.uid}`)}Ca(e){return this.syncEngine.La(e.targetId,e.state,e.error)}ba(e,t){const n=t?this.oa.insert(e,t):this.oa.remove(e),s=this.Va(this.oa),i=this.Va(n),o=[],c=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||c.push(u)})),this.syncEngine.Ba(o,c).then((()=>{this.oa=n}))}Aa(e){this.oa.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}Va(e){let t=Wu();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class s_{constructor(){this.Ua=new hu,this.ka={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Ua.na(e),this.ka[e]||"not-current"}updateQueryState(e,t,n){this.ka[e]=t}removeLocalQueryTarget(e){this.Ua.ra(e)}isLocalQueryTarget(e){return this.Ua.activeTargetIds.has(e)}clearQueryState(e){delete this.ka[e]}getAllActiveQueryTargets(){return this.Ua.activeTargetIds}isActiveQueryTarget(e){return this.Ua.activeTargetIds.has(e)}start(){return this.Ua=new hu,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i_(){return typeof window<"u"?window:null}function No(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eP{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.qa=0,this.$a=null,this.Ka=!0}Wa(){this.qa===0&&(this.Qa("Unknown"),this.$a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.$a=null,this.Ga("Backend didn't respond within 10 seconds."),this.Qa("Offline"),Promise.resolve()))))}za(e){this.state==="Online"?this.Qa("Unknown"):(this.qa++,this.qa>=1&&(this.ja(),this.Ga(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.Qa("Offline")))}set(e){this.ja(),this.qa=0,e==="Online"&&(this.Ka=!1),this.Qa(e)}Qa(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}Ga(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Ka?(ye(t),this.Ka=!1):D("OnlineStateTracker",t)}ja(){this.$a!==null&&(this.$a.cancel(),this.$a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="RemoteStore";class tP{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ha=[],this.Ja=new Map,this.Ya=new Map,this.Za=new Map,this.Xa=new qt(1e3),this.eu=new qt(1001),this.tu=new Set,this.nu=[],this.ru=i,this.ru.bt((o=>{n.enqueueAndForget((async()=>{yr(this)&&(D(St,"Restarting streams for network reachability change."),await(async function(u){const l=q(u);l.tu.add(4),await Gi(l),l.iu.set("Unknown"),l.tu.delete(4),await Ua(l)})(this))}))})),this.iu=new eP(n,s)}}async function Ua(r){if(yr(r))for(const e of r.nu)await e(!0)}async function Gi(r){for(const e of r.nu)await e(!1)}function du(r,e){return r.Ya.get(e)||void 0}function Ba(r,e){const t=q(r),n=du(t,e.targetId);if(n!==void 0&&t.Ja.has(n))return;const s=(function(c,u){const l=du(c,u);l!==void 0&&c.Za.delete(l);const f=(function(g,R){return R%2!=0?g.eu.next():g.Xa.next()})(c,u);return c.Ya.set(u,f),c.Za.set(f,u),f})(t,e.targetId);D(St,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Tt(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ja.set(s,i),Al(t)?vl(t):fs(t).Fn()&&wl(t,i)}function ts(r,e){const t=q(r),n=fs(t),s=du(t,e);D(St,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ja.delete(s),t.Ya.delete(e),t.Za.delete(s),n.Fn()&&o_(t,s),t.Ja.size===0&&(n.Fn()?n.Nn():yr(t)&&t.iu.set("Unknown"))}function wl(r,e){if(r.su.We(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo($.min())>0){const t=r.Za.get(e.targetId);if(t===void 0)return void D(St,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}fs(r).jn(e)}function o_(r,e){r.su.We(e),fs(r).Hn(e)}function vl(r){r.su=new pv({getRemoteKeysForTarget:e=>{const t=r.Za.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):Q()},dt:e=>r.Ja.get(e)||null,Tt:()=>r.datastore.serializer.databaseId}),fs(r).start(),r.iu.Wa()}function Al(r){return yr(r)&&!fs(r).Cn()&&r.Ja.size>0}function yr(r){return q(r).tu.size===0}function a_(r){r.su=void 0}async function nP(r){r.iu.set("Online")}async function rP(r){r.Ja.forEach(((e,t)=>{wl(r,e)}))}async function sP(r,e){a_(r),Al(r)?(r.iu.za(e),vl(r)):r.iu.set("Unknown")}async function iP(r,e,t){if(r.iu.set("Online"),e instanceof qm&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const c of i.targetIds){if(s.Ja.has(c)){const u=s.Za.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.Ya.delete(u),s.Za.delete(c)),s.Ja.delete(c)}s.su.removeTarget(c)}})(r,e)}catch(n){D(St,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await ha(r,n)}else if(e instanceof Vo?r.su.et(e):e instanceof Bm?r.su.ot(e):r.su.rt(e),!t.isEqual($.min()))try{const n=await Xg(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const c=i.su.Rt(o);c.targetChanges.forEach(((l,f)=>{if(l.resumeToken.approximateByteSize()>0){const p=i.Ja.get(f);p&&i.Ja.set(f,p.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,f)=>{const p=i.Ja.get(l);if(!p)return;i.Ja.set(l,p.withResumeToken(de.EMPTY_BYTE_STRING,p.snapshotVersion)),o_(i,l);const g=new Tt(p.target,l,f,p.sequenceNumber);wl(i,g)}));const u=(function(f,p){const g=new Map;p.targetChanges.forEach(((C,O)=>{const L=f.Za.get(O);L!==void 0&&g.set(L,C)}));let R=new ae(K);return p.targetMismatches.forEach(((C,O)=>{const L=f.Za.get(C);L!==void 0&&(R=R.insert(L,O))})),new us(p.snapshotVersion,g,R,p.documentUpdates,p.augmentedDocumentUpdates,p.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){D(St,"Failed to raise snapshot:",n),await ha(r,n)}}async function ha(r,e,t){if(!Nn(e))throw e;r.tu.add(1),await Gi(r),r.iu.set("Offline"),t||(t=()=>Xg(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{D(St,"Retrying IndexedDB access"),await t(),r.tu.delete(1),await Ua(r)}))}function c_(r,e){return e().catch((t=>ha(r,t,e)))}async function ds(r){const e=q(r),t=Vn(e);let n=e.Ha.length>0?e.Ha[e.Ha.length-1].batchId:Zn;for(;oP(e);)try{const s=await ZR(e.localStore,n);if(s===null){e.Ha.length===0&&t.Nn();break}n=s.batchId,aP(e,s)}catch(s){await ha(e,s)}u_(e)&&l_(e)}function oP(r){return yr(r)&&r.Ha.length<10}function aP(r,e){r.Ha.push(e);const t=Vn(r);t.Fn()&&t.Jn&&t.Yn(e.mutations)}function u_(r){return yr(r)&&!Vn(r).Cn()&&r.Ha.length>0}function l_(r){Vn(r).start()}async function cP(r){Vn(r).er()}async function uP(r){const e=Vn(r);for(const t of r.Ha)e.Yn(t.mutations)}async function lP(r,e,t){const n=r.Ha.shift(),s=dl.from(n,e,t);await c_(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await ds(r)}async function hP(r,e){e&&Vn(r).Jn&&await(async function(n,s){if((function(o){return av(o)&&o!==S.ABORTED})(s.code)){const i=n.Ha.shift();Vn(n).Mn(),await c_(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await ds(n)}})(r,e),u_(r)&&l_(r)}async function Sf(r,e){const t=q(r);t.asyncQueue.verifyOperationInProgress(),D(St,"RemoteStore received new credentials");const n=yr(t);t.tu.add(3),await Gi(t),n&&t.iu.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.tu.delete(3),await Ua(t)}async function fu(r,e){const t=q(r);e?(t.tu.delete(2),await Ua(t)):e||(t.tu.add(2),await Gi(t),t.iu.set("Unknown"))}function fs(r){return r._u||(r._u=(function(t,n,s){const i=q(t);return i.nr(),new Nv(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:nP.bind(null,r),zt:rP.bind(null,r),Ht:sP.bind(null,r),zn:iP.bind(null,r)}),r.nu.push((async e=>{e?(r._u.Mn(),Al(r)?vl(r):r.iu.set("Unknown")):(await r._u.stop(),a_(r))}))),r._u}function Vn(r){return r.ou||(r.ou=(function(t,n,s){const i=q(t);return i.nr(),new kv(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Qt:()=>Promise.resolve(),zt:cP.bind(null,r),Ht:hP.bind(null,r),Zn:uP.bind(null,r),Xn:lP.bind(null,r)}),r.nu.push((async e=>{e?(r.ou.Mn(),await ds(r)):(await r.ou.stop(),r.Ha.length>0&&(D(St,`Stopping write stream with ${r.Ha.length} pending writes`),r.Ha=[]))}))),r.ou}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new At,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,c=new Rl(e,t,o,s,i);return c.start(n),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Pl(r,e){if(ye("AsyncQueue",`${e}: ${r}`),Nn(r))return new N(S.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{static emptySet(e){return new rr(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||F.comparator(t.key,n.key):(t,n)=>F.comparator(t.key,n.key),this.keyedMap=Wn(),this.sortedSet=new ae(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof rr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new rr;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf{constructor(){this.au=new ae(F.comparator)}track(e){const t=e.doc.key,n=this.au.get(t);n?e.type!==0&&n.type===3?this.au=this.au.insert(t,e):e.type===3&&n.type!==1?this.au=this.au.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.au=this.au.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.au=this.au.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.au=this.au.remove(t):e.type===1&&n.type===2?this.au=this.au.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.au=this.au.insert(t,{type:2,doc:e.doc}):B(63341,{ft:e,uu:n}):this.au=this.au.insert(t,e)}cu(){const e=[];return this.au.inorderTraversal(((t,n)=>{e.push(n)})),e}}class ns{constructor(e,t,n,s,i,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new ns(e,t,rr.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Na(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dP{constructor(){this.lu=void 0,this.Eu=[]}hu(){return this.Eu.some((e=>e.Tu()))}}class fP{constructor(){this.queries=Cf(),this.onlineState="Unknown",this.Pu=new Set}terminate(){(function(t,n){const s=q(t),i=s.queries;s.queries=Cf(),i.forEach(((o,c)=>{for(const u of c.Eu)u.onError(n)}))})(this,new N(S.ABORTED,"Firestore shutting down"))}}function Cf(){return new Wt((r=>kg(r)),Na)}async function bl(r,e){const t=q(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.hu()&&e.Tu()&&(n=2):(i=new dP,n=e.Tu()?0:1);try{switch(n){case 0:i.lu=await t.onListen(s,!0);break;case 1:i.lu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const c=Pl(o,`Initialization of query '${_e(e.query)?kt(e.query):Js(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.Eu.push(e),e.Ru(t.onlineState),i.lu&&e.Iu(i.lu)&&Vl(t)}async function Sl(r,e){const t=q(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.Eu.indexOf(e);o>=0&&(i.Eu.splice(o,1),i.Eu.length===0?s=e.Tu()?0:1:!i.hu()&&e.Tu()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function pP(r,e){const t=q(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const c of o.Eu)c.Iu(s)&&(n=!0);o.lu=s}}n&&Vl(t)}function mP(r,e,t){const n=q(r),s=n.queries.get(e);if(s)for(const i of s.Eu)i.onError(t);n.queries.delete(e)}function Vl(r){r.Pu.forEach((e=>{e.next()}))}var pu;(function(r){r.Default="default",r.Cache="cache"})(pu||(pu={}));class Cl{constructor(e,t,n){this.query=e,this.Au=t,this.Vu=!1,this.du=null,this.onlineState="Unknown",this.options=n||{}}Iu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new ns(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Vu?this.fu(e)&&(this.Au.next(e),t=!0):this.mu(e,this.onlineState)&&(this.pu(e),t=!0),this.du=e,t}onError(e){this.Au.error(e)}Ru(e){this.onlineState=e;let t=!1;return this.du&&!this.Vu&&this.mu(this.du,e)&&(this.pu(this.du),t=!0),t}mu(e,t){if(!e.fromCache||!this.Tu())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}fu(e){if(e.docChanges.length>0)return!0;const t=this.du&&this.du.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}pu(e){e=ns.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Vu=!0,this.Au.next(e)}Tu(){return this.options.source!==pu.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(e){this.key=e}}class d_{constructor(e){this.key=e}}class gP{constructor(e,t){this.query=e,this.Ou=t,this.Mu=null,this.hasCachedResults=!1,this.current=!1,this.Nu=Q(),this.mutatedKeys=Q(),this.Lu=_e(e)?cu(e):Ku(e),this.Bu=new rr(this.Lu)}get Uu(){return this.Ou}ku(e,t){const n=t?t.qu:new Vf,s=t?t.Bu:this.Bu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1;const[u,l]=this.$u(this.query,s);e.inorderTraversal(((p,g)=>{const R=s.get(p),C=zg(this.query,g)?g:null,O=!!R&&this.mutatedKeys.has(R.key),L=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let z=!1;R&&C?R.data.isEqual(C.data)?O!==L&&(n.track({type:3,doc:C}),z=!0):this.Ku(R,C)||(n.track({type:2,doc:C}),z=!0,(u&&this.Lu(C,u)>0||l&&this.Lu(C,l)<0)&&(c=!0)):!R&&C?(n.track({type:0,doc:C}),z=!0):R&&!C&&(n.track({type:1,doc:R}),z=!0,(u||l)&&(c=!0)),z&&(C?(o=o.add(C),i=L?i.add(p):i.delete(p)):(o=o.delete(p),i=i.delete(p)))}));const f=this.Wu(this.query);if(f)if(_e(this.query)){const p=[];o.forEach((C=>p.push(C)));const g=jg(this.query,p);let R=new rr(cu(this.query));for(const C of g)R=R.add(C);o.forEach((C=>{R.has(C.key)||(i=i.delete(C.key),n.track({type:1,doc:C}))})),o=R}else{const p=this.Qu(this.query);for(;o.size>f;){const g=p==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),n.track({type:1,doc:g})}}return{Bu:o,qu:n,Uo:c,mutatedKeys:i}}Wu(e){var t;return _e(e)?(t=Rc(e))==null?void 0:t.limit:e.limit||void 0}Qu(e){if(_e(e)){const t=Rc(e);return t&&t.limit<0?"L":"F"}return e.limitType}$u(e,t){var n;if(_e(e)){const s=(n=Rc(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.Wu(this.query)?t.last():null,e.limitType==="L"&&t.size===this.Wu(this.query)?t.first():null]}Ku(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Bu;this.Bu=e.Bu,this.mutatedKeys=e.mutatedKeys;const o=e.qu.cu();o.sort(((f,p)=>(function(R,C){const O=L=>{switch(L){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return B(20277,{ft:L})}};return O(R)-O(C)})(f.type,p.type)||this.Lu(f.doc,p.doc))),this.Gu(n),s=s??!1;const c=t&&!s?this.zu():[],u=this.Nu.size===0&&this.current&&!s?1:0,l=u!==this.Mu;return this.Mu=u,o.length!==0||l?{snapshot:new ns(this.query,e.Bu,i,o,e.mutatedKeys,u===0,l,!1,!!n&&n.resumeToken.approximateByteSize()>0),ju:c}:{ju:c}}Ru(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Bu:this.Bu,qu:new Vf,mutatedKeys:this.mutatedKeys,Uo:!1},!1)):{ju:[]}}Hu(e){return!this.Ou.has(e)&&!!this.Bu.has(e)&&!this.Bu.get(e).hasLocalMutations}Gu(e){e&&(e.addedDocuments.forEach((t=>this.Ou=this.Ou.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ou=this.Ou.delete(t))),this.current=e.current)}zu(){if(!this.current)return[];const e=this.Nu;this.Nu=Q(),this.Bu.forEach((n=>{this.Hu(n.key)&&(this.Nu=this.Nu.add(n.key))}));const t=[];return e.forEach((n=>{this.Nu.has(n)||t.push(new d_(n))})),this.Nu.forEach((n=>{e.has(n)||t.push(new h_(n))})),t}Ju(e){this.Ou=e.Jo,this.Nu=Q();const t=this.ku(e.documents);return this.applyChanges(t,!0)}Yu(){return ns.fromInitialDocuments(this.query,this.Bu,this.mutatedKeys,this.Mu===0,this.hasCachedResults)}}const ps="SyncEngine";class _P{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class yP{constructor(e){this.key=e,this.Zu=!1}}class IP{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Xu={},this.ec=new Wt((c=>kg(c)),Na),this.tc=new Map,this.nc=new Set,this.rc=new ae(F.comparator),this.sc=new Map,this._c=new gl,this.oc={},this.ac=new Map,this.uc=qt.Cs(),this.onlineState="Unknown",this.cc=void 0}get isPrimaryClient(){return this.cc===!0}}async function EP(r,e,t=!0){const n=qa(r);let s;const i=n.ec.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Yu()):s=await f_(n,e,t,!0),s}async function TP(r,e){const t=qa(r);await f_(t,e,!0,!1)}async function f_(r,e,t,n){const s=await ca(r.localStore,_e(e)?e:tt(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let c;return n&&(c=await xl(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Ba(r.remoteStore,s),c}async function xl(r,e,t,n,s){r.lc=(p,g,R)=>(async function(O,L,z,W){let H=L.view.ku(z);H.Uo&&(H=await uu(O.localStore,L.query,!1).then((({documents:T})=>L.view.ku(T,H))));const ue=W&&W.targetChanges.get(L.targetId),te=W&&W.targetMismatches.get(L.targetId)!=null,ne=L.view.applyChanges(H,O.isPrimaryClient,ue,te);return mu(O,L.targetId,ne.ju),ne.snapshot})(r,p,g,R);const i=await uu(r.localStore,e,!0),o=new gP(e,i.Jo),c=o.ku(i.documents),u=Li.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),l=o.applyChanges(c,r.isPrimaryClient,u);mu(r,t,l.ju);const f=new _P(e,t,o);return r.ec.set(e,f),r.tc.has(t)?r.tc.get(t).push(e):r.tc.set(t,[e]),l.snapshot}async function wP(r,e,t){const n=q(r),s=n.ec.get(e),i=n.tc.get(s.targetId);if(i.length>1)return n.tc.set(s.targetId,i.filter((o=>!Na(o,e)))),void n.ec.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await es(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&ts(n.remoteStore,s.targetId),rs(n,s.targetId)})).catch(Dn)):(rs(n,s.targetId),await es(n.localStore,s.targetId,!0))}async function vP(r,e){const t=q(r),n=t.ec.get(e),s=t.tc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),ts(t.remoteStore,n.targetId))}async function AP(r,e,t){const n=Ol(r);try{const s=await(function(o,c){const u=q(o),l=se.now(),f=c.reduce(((R,C)=>R.add(C.key)),Q());let p,g;return u.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let C=ve(),O=Q();return u.Qo.getEntries(R,f).next((L=>{C=L,C.forEach(((z,W)=>{W.isValidDocument()||(O=O.add(z))}))})).next((()=>u.localDocuments.getOverlayedDocuments(R,C))).next((L=>{p=L;const z=[];for(const W of c){const H=Gw(W,p.get(W.key).overlayedDocument);H!=null&&z.push(new Kt(W.key,H,Em(H.value.mapValue),Ce.exists(!0)))}return u.mutationQueue.addMutationBatch(R,l,z,c)})).next((L=>{g=L;const z=L.applyToLocalDocumentSet(p,O);return u.documentOverlayCache.saveOverlays(R,L.batchId,z)}))})).then((()=>({batchId:g.batchId,changes:Fm(p)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,c,u){let l=o.oc[o.currentUser.toKey()];l||(l=new ae(K)),l=l.insert(c,u),o.oc[o.currentUser.toKey()]=l})(n,s.batchId,t),await Ln(n,s.changes),await ds(n.remoteStore)}catch(s){const i=Pl(s,"Failed to persist write");t.reject(i)}}async function p_(r,e){const t=q(r);try{const n=await JR(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.sc.get(i);o&&(k(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Zu=!0:s.modifiedDocuments.size>0?k(o.Zu,14607):s.removedDocuments.size>0&&(k(o.Zu,42227),o.Zu=!1))})),await Ln(t,n,e)}catch(n){await Dn(n)}}function xf(r,e,t){const n=q(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.ec.forEach(((i,o)=>{const c=o.view.Ru(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){const u=q(o);u.onlineState=c;let l=!1;u.queries.forEach(((f,p)=>{for(const g of p.Eu)g.Ru(c)&&(l=!0)})),l&&Vl(u)})(n.eventManager,e),s.length&&n.Xu.zn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function RP(r,e,t){const n=q(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.sc.get(e),i=s&&s.key;if(i){let o=new ae(F.comparator);o=o.insert(i,ge.newNoDocument(i,$.min()));const c=Q().add(i),u=new us($.min(),new Map,new ae(K),o,ve(),c);await p_(n,u),n.rc=n.rc.remove(i),n.sc.delete(e),kl(n)}else await es(n.localStore,e,!1).then((()=>rs(n,e,t))).catch(Dn)}async function PP(r,e){const t=q(r),n=e.batch.batchId;try{const s=await YR(t.localStore,e);Nl(t,n,null),Dl(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Ln(t,s)}catch(s){await Dn(s)}}async function bP(r,e,t){const n=q(r);try{const s=await(function(o,c){const u=q(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(l=>{let f;return u.mutationQueue.lookupMutationBatch(l,c).next((p=>(k(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(l,p)))).next((()=>u.mutationQueue.performConsistencyCheck(l))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(l,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(l,f))).next((()=>u.localDocuments.getDocuments(l,f)))}))})(n.localStore,e);Nl(n,e,t),Dl(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Ln(n,s)}catch(s){await Dn(s)}}function Dl(r,e){(r.ac.get(e)||[]).forEach((t=>{t.resolve()})),r.ac.delete(e)}function Nl(r,e,t){const n=q(r);let s=n.oc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.oc[n.currentUser.toKey()]=s}}function rs(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.tc.get(e))r.ec.delete(n),t&&r.Xu.Ec(n,t);r.tc.delete(e),r.isPrimaryClient&&r._c.s_(e).forEach((n=>{r._c.containsKey(n)||m_(r,n)}))}function m_(r,e){r.nc.delete(e.path.canonicalString());const t=r.rc.get(e);t!==null&&(ts(r.remoteStore,t),r.rc=r.rc.remove(e),r.sc.delete(t),kl(r))}function mu(r,e,t){for(const n of t)n instanceof h_?(r._c.addReference(n.key,e),SP(r,n)):n instanceof d_?(D(ps,"Document no longer in limbo: "+n.key),r._c.removeReference(n.key,e),r._c.containsKey(n.key)||m_(r,n.key)):B(19791,{hc:n})}function SP(r,e){const t=e.key,n=t.path.canonicalString();r.rc.get(t)||r.nc.has(n)||(D(ps,"New document in limbo: "+t),r.nc.add(n),kl(r))}function kl(r){for(;r.nc.size>0&&r.rc.size<r.maxConcurrentLimboResolutions;){const e=r.nc.values().next().value;r.nc.delete(e);const t=new F(J.fromString(e)),n=r.uc.next();r.sc.set(n,new yP(t)),r.rc=r.rc.insert(t,n),Ba(r.remoteStore,new Tt(tt(Oi(t.path)),n,"TargetPurposeLimboResolution",Ke.ce))}}async function Ln(r,e,t){const n=q(r),s=[],i=[],o=[];n.ec.isEmpty()||(n.ec.forEach(((c,u)=>{o.push(n.lc(u,e,t).then((l=>{var f;if((l||t)&&n.isPrimaryClient){const p=l?!l.fromCache:(f=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(l){s.push(l);const p=Il.vo(u.targetId,l);i.push(p)}})))})),await Promise.all(o),n.Xu.zn(s),await(async function(u,l){const f=q(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>A.forEach(l,(g=>A.forEach(g.wo,(R=>f.persistence.referenceDelegate.addReference(p,g.targetId,R))).next((()=>A.forEach(g.bo,(R=>f.persistence.referenceDelegate.removeReference(p,g.targetId,R)))))))))}catch(p){if(!Nn(p))throw p;D(El,"Failed to update sequence numbers: "+p)}for(const p of l){const g=p.targetId;if(!p.fromCache){const R=f.$o.get(g),C=R.snapshotVersion,O=R.withLastLimboFreeSnapshotVersion(C);f.$o=f.$o.insert(g,O)}}})(n.localStore,i))}async function VP(r,e){const t=q(r);if(!t.currentUser.isEqual(e)){D(ps,"User change. New user:",e.toKey());const n=await Jg(t.localStore,e);t.currentUser=e,(function(i,o){i.ac.forEach((c=>{c.forEach((u=>{u.reject(new N(S.CANCELLED,o))}))})),i.ac.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Ln(t,n.zo)}}function CP(r,e){const t=q(r),n=t.sc.get(e);if(n&&n.Zu)return Q().add(n.key);{let s=Q();const i=t.tc.get(e);if(!i)return s;for(const o of i??[]){const c=t.ec.get(o);s=s.unionWith(c.view.Uu)}return s}}async function xP(r,e){const t=q(r),n=await uu(t.localStore,e.query,!0),s=e.view.Ju(n);return t.isPrimaryClient&&mu(t,e.targetId,s.ju),s}async function DP(r,e){const t=q(r);return lu(t.localStore,e).then((n=>Ln(t,n)))}async function NP(r,e,t,n){const s=q(r),i=await(function(c,u){const l=q(c),f=q(l.mutationQueue);return l.persistence.runTransaction("Lookup mutation documents","readonly",(p=>f.ps(p,u).next((g=>g?l.localDocuments.getDocuments(p,g):A.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await ds(s.remoteStore):t==="acknowledged"||t==="rejected"?(Nl(s,e,n||null),Dl(s,e),(function(c,u){q(q(c).mutationQueue).bs(u)})(s.localStore,e)):B(6720,"Unknown batchState",{Tc:t}),await Ln(s,i)):D(ps,"Cannot apply mutation batch with id: "+e)}async function kP(r,e){const t=q(r);if(qa(t),Ol(t),e===!0&&t.cc!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await Df(t,n.toArray());t.cc=!0,await fu(t.remoteStore,!0);for(const i of s)Ba(t.remoteStore,i)}else if(e===!1&&t.cc!==!1){const n=[];let s=Promise.resolve();t.tc.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(rs(t,o),es(t.localStore,o,!0)))),ts(t.remoteStore,o)})),await s,await Df(t,n),(function(o){const c=q(o);c.sc.forEach(((u,l)=>{ts(c.remoteStore,l)})),c._c.__(),c.sc=new Map,c.rc=new ae(F.comparator)})(t),t.cc=!1,await fu(t.remoteStore,!1)}}async function Df(r,e,t){const n=q(r),s=[],i=[];for(const o of e){let c;const u=n.tc.get(o);if(u&&u.length!==0){c=await ca(n.localStore,_e(u[0])?u[0]:tt(u[0]));for(const l of u){const f=n.ec.get(l),p=await xP(n,f);p.snapshot&&i.push(p.snapshot)}}else{const l=await Zg(n.localStore,o);c=await ca(n.localStore,l),await xl(n,g_(l),o,!1,c.resumeToken)}s.push(c)}return n.Xu.zn(i),s}function g_(r){return Vt(r)?r:Om(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function OP(r){return(function(t){return q(q(t).persistence).po()})(q(r).localStore)}async function LP(r,e,t,n){const s=q(r);if(s.cc)return void D(ps,"Ignoring unexpected query state notification.");const i=s.tc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let o;if(_e(i[0]))switch(Nt(i[0])){case"collection_group":case"collection":o=await lu(s.localStore,bg(i[0]));break;case"documents":o=await(function(l,f){const p=q(l),g=Q(...na(f).map((R=>F.fromPath(R))));return p.persistence.runTransaction("Get documents for pipeline","readonly",(R=>p.Qo.getEntries(R,g))).then((R=>R))})(s.localStore,i[0]);break;default:at(""),o=Wn()}else o=await lu(s.localStore,(function(l){return l.collectionGroup||(l.path.length%2==1?l.path.lastSegment():l.path.get(l.path.length-2))})(i[0]));const c=us.createSynthesizedRemoteEventForCurrentChange(e,t==="current",de.EMPTY_BYTE_STRING);await Ln(s,o,c);break}case"rejected":await es(s.localStore,e,!0),rs(s,e,n);break;default:B(64155,t)}}async function MP(r,e,t){const n=qa(r);if(n.cc){for(const s of e){if(n.tc.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){D(ps,"Adding an already active target "+s);continue}const i=await Zg(n.localStore,s),o=await ca(n.localStore,i);await xl(n,g_(i),o.targetId,!1,o.resumeToken),Ba(n.remoteStore,o)}for(const s of t)n.tc.has(s)&&await es(n.localStore,s,!1).then((()=>{ts(n.remoteStore,s),rs(n,s)})).catch(Dn)}}function qa(r){const e=q(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=p_.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=CP.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=RP.bind(null,e),e.Xu.zn=pP.bind(null,e.eventManager),e.Xu.Ec=mP.bind(null,e.eventManager),e}function Ol(r){const e=q(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=PP.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=bP.bind(null,e),e}class Ti{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Sa(e.databaseInfo.databaseId),this.sharedClientState=this.Rc(e),this.persistence=this.Ic(e),await this.persistence.start(),this.localStore=this.Ac(e),this.gcScheduler=this.Vc(e,this.localStore),this.indexBackfillerScheduler=this.dc(e,this.localStore)}Vc(e,t){return null}dc(e,t){return null}Ac(e){return Yg(this.persistence,new Qg,e.initialUser,this.serializer)}Ic(e){return new _l(Fa.C_,this.serializer)}Rc(e){return new s_}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ti.provider={build:()=>new Ti};class FP extends Ti{constructor(e){super(),this.cacheSizeBytes=e}Vc(e,t){k(this.persistence.referenceDelegate instanceof aa,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new ag(n,e.asyncQueue,t)}Ic(e){const t=this.cacheSizeBytes!==void 0?Le.withCacheSize(this.cacheSizeBytes):Le.DEFAULT;return new _l((n=>aa.C_(n,t)),this.serializer)}}class __ extends Ti{constructor(e,t,n){super(),this.fc=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.fc.initialize(this,e),await Ol(this.fc.syncEngine),await ds(this.fc.remoteStore),await this.persistence._o((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Ac(e){return Yg(this.persistence,new Qg,e.initialUser,this.serializer)}Vc(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new ag(n,e.asyncQueue,t)}dc(e,t){const n=new iw(t,this.persistence);return new sw(e.asyncQueue,n)}Ic(e){const t=Hg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Le.withCacheSize(this.cacheSizeBytes):Le.DEFAULT;return new yl(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,i_(),No(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Rc(e){return new s_}}class UP extends __{constructor(e,t){super(e,t,!1),this.fc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.fc.syncEngine;this.sharedClientState instanceof Cc&&(this.sharedClientState.syncEngine={Na:NP.bind(null,t),La:LP.bind(null,t),Ba:MP.bind(null,t),po:OP.bind(null,t),Ma:DP.bind(null,t)},await this.sharedClientState.start()),await this.persistence._o((async n=>{await kP(this.fc.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Rc(e){const t=i_();if(!Cc.C(t))throw new N(S.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Hg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Cc(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class wi{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>xf(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=VP.bind(null,this.syncEngine),await fu(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new fP})()}createDatastore(e){const t=Sa(e.databaseInfo.databaseId),n=Dv(e.databaseInfo);return Mv(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,c){return new tP(n,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>xf(this.syncEngine,t,0)),(function(){return Jd.C()?new Jd:new Sv})())}createSyncEngine(e,t){return(function(s,i,o,c,u,l,f){const p=new IP(s,i,o,c,u,l);return f&&(p.cc=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=q(s);D(St,"RemoteStore shutting down."),i.tu.add(5),await Gi(i),i.ru.shutdown(),i.iu.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}wi.provider={build:()=>new wi};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.mc(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.mc(this.observer.error,e):ye("Uncaught Error in snapshot listener:",e.toString()))}gc(){this.muted=!0}mc(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn="FirestoreClient";class BP{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=Se.UNAUTHENTICATED,this.clientId=Vu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{D(Cn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(D(Cn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new At;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Pl(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function xc(r,e){r.asyncQueue.verifyOperationInProgress(),D(Cn,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await Jg(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function Nf(r,e){r.asyncQueue.verifyOperationInProgress();const t=await qP(r);D(Cn,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Sf(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>Sf(e.remoteStore,s))),r._onlineComponents=e}async function qP(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){D(Cn,"Using user provided OfflineComponentProvider");try{await xc(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;at("Error using user provided cache. Falling back to memory cache: "+t),await xc(r,new Ti)}}else D(Cn,"Using default OfflineComponentProvider"),await xc(r,new FP(void 0));return r._offlineComponents}async function y_(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(D(Cn,"Using user provided OnlineComponentProvider"),await Nf(r,r._uninitializedComponentsProvider._online)):(D(Cn,"Using default OnlineComponentProvider"),await Nf(r,new wi))),r._onlineComponents}function $P(r){return y_(r).then((e=>e.syncEngine))}async function da(r){const e=await y_(r),t=e.eventManager;return t.onListen=EP.bind(null,e.syncEngine),t.onUnlisten=wP.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=TP.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=vP.bind(null,e.syncEngine),t}function jP(r,e,t,n){const s=new Ll(n),i=new Cl(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>bl(await da(r),i))),()=>{s.gc(),r.asyncQueue.enqueueAndForget((async()=>Sl(await da(r),i)))}}function zP(r,e,t={}){const n=new At;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){const f=new Ll({next:g=>{f.gc(),o.enqueueAndForget((()=>Sl(i,p)));const R=g.docs.has(c);!R&&g.fromCache?l.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&g.fromCache&&u&&u.source==="server"?l.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),p=new Cl(Oi(c.path),f,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return bl(i,p)})(await da(r),r.asyncQueue,e,t,n))),n.promise}function GP(r,e,t={}){const n=new At;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){const f=new Ll({next:g=>{f.gc(),o.enqueueAndForget((()=>Sl(i,p))),g.fromCache&&u.source==="server"?l.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),p=new Cl(c instanceof Zs?yR(c):c,f,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return bl(i,p)})(await da(r),r.asyncQueue,e,t,n))),n.promise}function KP(r,e){const t=new At;return r.asyncQueue.enqueueAndForget((async()=>AP(await $P(r),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf="AsyncQueue";class Of{constructor(e=Promise.resolve()){this.qc=[],this.$c=!1,this.Kc=[],this.Wc=null,this.Qc=!1,this.Gc=!1,this.zc=[],this.xn=new rg(this,"async_queue_retry"),this.jc=()=>{const n=No();n&&D(kf,"Visibility state changed to "+n.visibilityState),this.xn.gn()},this.Hc=e;const t=No();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.jc)}get isShuttingDown(){return this.$c}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Jc(),this.Yc(e)}enterRestrictedMode(e){if(!this.$c){this.$c=!0,this.Gc=e||!1;const t=No();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.jc)}}enqueue(e){if(this.Jc(),this.$c)return new Promise((()=>{}));const t=new At;return this.Yc((()=>this.$c&&this.Gc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.qc.push(e),this.Zc())))}async Zc(){if(this.qc.length!==0){try{await this.qc[0](),this.qc.shift(),this.xn.reset()}catch(e){if(!Nn(e))throw e;D(kf,"Operation failed with retryable error: "+e)}this.qc.length>0&&this.xn.mn((()=>this.Zc()))}}Yc(e){const t=this.Hc.then((()=>(this.Qc=!0,e().catch((n=>{throw this.Wc=n,this.Qc=!1,ye("INTERNAL UNHANDLED ERROR: ",Lf(n)),n})).then((n=>(this.Qc=!1,n))))));return this.Hc=t,t}enqueueAfterDelay(e,t,n){this.Jc(),this.zc.indexOf(e)>-1&&(t=0);const s=Rl.createAndSchedule(this,e,t,n,(i=>this.Xc(i)));return this.Kc.push(s),s}Jc(){this.Wc&&B(47125,{el:Lf(this.Wc)})}verifyOperationInProgress(){}async tl(){let e;do e=this.Hc,await e;while(e!==this.Hc)}nl(e){for(const t of this.Kc)if(t.timerId===e)return!0;return!1}rl(e){return this.tl().then((()=>{this.Kc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.Kc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.tl()}))}il(e){this.zc.push(e)}Xc(e){const t=this.Kc.indexOf(e);this.Kc.splice(t,1)}}function Lf(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class $t extends Fi{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Of,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Of(e),this._firestoreClient=void 0,await e}}}function yb(r,e,t){t||(t=Qo);const n=pa(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(En(i,e))return s;throw new N(S.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new N(S.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<og)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&ss(e.host)&&_u(e.host),n.initialize({options:e,instanceIdentifier:t})}function Ib(r,e){const t=typeof r=="object"?r:np(),n=typeof r=="string"?r:e,s=pa(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=cy("firestore");i&&$v(s,...i)}return s}function Ki(r){if(r._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||WP(r),r._firestoreClient}function WP(r){var n,s,i,o;const e=r._freezeSettings(),t=Uv(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new BP(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(u){const l=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(l),_online:l}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HP{convertValue(e,t="none"){switch(Te(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ft(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw B(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return kn(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[lr].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>ce(o.doubleValue)));return new He(t)}convertGeoPoint(e){return new Pt(ce(e.latitude),ce(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ni(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Wr(e));default:return null}}convertTimestamp(e){const t=Mt(e);return new se(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=J.fromString(e);k(Zm(n),9688,{name:e});const s=new ur(n.get(1),n.get(3)),i=new F(n.popFirst(5));return s.isEqual(t)||ye(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ml extends HP{constructor(e){super(),this.firestore=e}convertBytes(e){return new ot(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new fe(this.firestore,null,t)}}const Mf="@firebase/firestore",Ff="4.16.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uf(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new QP(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Ut("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class QP extends Fl{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I_(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ul{}class $a extends Ul{}function Eb(r,e,...t){let n=[];e instanceof Ul&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof Bl)).length,c=i.filter((u=>u instanceof ja)).length;if(o>1||o>0&&c>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class ja extends $a{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ja(e,t,n)}_apply(e){const t=this._parse(e);return E_(e._query,t),new dt(e.firestore,e.converter,Xc(e._query,t))}_parse(e){const t=Ui(e.firestore);return(function(i,o,c,u,l,f,p){let g;if(l.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){qf(p,f);const C=[];for(const O of p)C.push(Bf(u,i,O));g={arrayValue:{values:C}}}else g=Bf(u,i,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||qf(p,f),g=mg(c,o,p,f==="in"||f==="not-in");return Z.create(l,f,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Tb(r,e,t){const n=e,s=Ut("where",r);return ja._create(s,n,t)}class Bl extends Ul{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Bl(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:ie.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const c=i.getFlattenedFilters();for(const u of c)E_(o,u),o=Xc(o,u)})(e._query,t),new dt(e.firestore,e.converter,Xc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ql extends $a{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ql(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new fi(i,o)})(e._query,this._field,this._direction);return new dt(e.firestore,e.converter,nv(e._query,t))}}function wb(r,e="asc"){const t=e,n=Ut("orderBy",r);return ql._create(n,t)}class $l extends $a{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new $l(e,t,n)}_apply(e){return new dt(e.firestore,e.converter,Zo(e._query,this._limit,this._limitType))}}function vb(r){return tw("limit",r),$l._create("limit",r,"F")}class jl extends $a{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new jl(e,t,n)}_apply(e){const t=YP(e,this.type,this._docOrFields,this._inclusive);return new dt(e.firestore,e.converter,rv(e._query,t))}}function Ab(...r){return jl._create("startAfter",r,!1)}function YP(r,e,t,n){if(t[0]=pe(t[0]),t[0]instanceof Fl)return(function(i,o,c,u,l){if(!u)throw new N(S.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const f=[];for(const p of Mr(i))if(p.field.isKeyField())f.push(hr(o,u.key));else{const g=u.data.field(p.field);if(Di(g))throw new N(S.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+p.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const R=p.field.canonicalString();throw new N(S.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${R}' (used as the orderBy) does not exist.`)}f.push(g)}return new An(f,l)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Ui(r.firestore);return(function(o,c,u,l,f,p){const g=o.explicitOrderBy;if(f.length>g.length)throw new N(S.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const R=[];for(let C=0;C<f.length;C++){const O=f[C];if(g[C].field.isKeyField()){if(typeof O!="string")throw new N(S.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof O}`);if(!Gu(o)&&O.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${O}' contains a slash.`);const L=o.path.child(J.fromString(O));if(!F.isDocumentKey(L))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${L}' is not because it contains an odd number of segments.`);const z=new F(L);R.push(hr(c,z))}else{const L=mg(u,l,O);R.push(L)}}return new An(R,p)})(r._query,r.firestore._databaseId,s,e,t,n)}}function Bf(r,e,t){if(typeof(t=pe(t))=="string"){if(t==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Gu(e)&&t.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(J.fromString(t));if(!F.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return hr(r,new F(n))}if(t instanceof fe)return hr(r,t._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ya(t)}.`)}function qf(r,e){if(!Array.isArray(r)||r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function E_(r,e){const t=(function(s,i){for(const o of s)for(const c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function T_(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class JP{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=eb(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function Rb(r){return new JP(r)}class XP{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=wi.provider,this._offlineComponentProvider={build:t=>new __(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class ZP{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=wi.provider,this._offlineComponentProvider={build:t=>new UP(t,e==null?void 0:e.cacheSizeBytes)}}}function eb(r){return new XP(r==null?void 0:r.forceOwnership)}function Pb(){return new ZP}class js{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class sr extends Fl{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ko(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Ut("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=sr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}sr._jsonSchemaVersion="firestore/documentSnapshot/1.0",sr._jsonSchema={type:Ee("string",sr._jsonSchemaVersion),bundleSource:Ee("string","DocumentSnapshot"),bundleName:Ee("string"),bundle:Ee("string")};class ko extends sr{data(e={}){return super.data(e)}}class ir{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new js(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new ko(this._firestore,this._userDataWriter,n.key,n,new js(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{_e(s._snapshot.query)?cu(s._snapshot.query):Ku(s.query._query);const u=new ko(s._firestore,s._userDataWriter,c.doc.key,c.doc,new js(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new ko(s._firestore,s._userDataWriter,c.doc.key,c.doc,new js(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let l=-1,f=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:tb(c.type),doc:u,oldIndex:l,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ir._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Vu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function tb(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return B(61501,{type:r})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ir._jsonSchemaVersion="firestore/querySnapshot/1.0",ir._jsonSchema={type:Ee("string",ir._jsonSchemaVersion),bundleSource:Ee("string","QuerySnapshot"),bundleName:Ee("string"),bundle:Ee("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nb{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ui(e)}set(e,t,n){this._verifyNotCommitted();const s=Dc(e,this._firestore),i=T_(s.converter,t,n),o=dg(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,Ce.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=Dc(e,this._firestore);let o;return o=typeof(t=pe(t))=="string"||t instanceof Mi?pg(this._dataReader,"WriteBatch.update",i._key,t,n,s):fg(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,Ce.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Dc(e,this._firestore);return this._mutations=this._mutations.concat(new ki(t._key,Ce.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Dc(r,e){if((r=pe(r)).firestore!==e)throw new N(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bb(r){r=je(r,fe);const e=je(r.firestore,$t),t=Ki(e);return zP(t,r._key).then((n=>w_(e,r,n)))}function Sb(r){r=je(r,dt);const e=je(r.firestore,$t),t=Ki(e),n=new Ml(e);return I_(r._query),GP(t,r._query).then((s=>new ir(e,n,r,s)))}function Vb(r,e,t){r=je(r,fe);const n=je(r.firestore,$t),s=T_(r.converter,e,t),i=Ui(n);return za(n,[dg(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Ce.none())])}function Cb(r,e,t,...n){r=je(r,fe);const s=je(r.firestore,$t),i=Ui(s);let o;return o=typeof(e=pe(e))=="string"||e instanceof Mi?pg(i,"updateDoc",r._key,e,t,n):fg(i,"updateDoc",r._key,e),za(s,[o.toMutation(r._key,Ce.exists(!0))])}function xb(r){return za(je(r.firestore,$t),[new ki(r._key,Ce.none())])}function Db(r,...e){var l,f,p;r=pe(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Uf(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Uf(e[n])){const g=e[n];e[n]=(l=g.next)==null?void 0:l.bind(g),e[n+1]=(f=g.error)==null?void 0:f.bind(g),e[n+2]=(p=g.complete)==null?void 0:p.bind(g)}let i,o,c;if(r instanceof fe)o=je(r.firestore,$t),c=Oi(r._key.path),i={next:g=>{e[n]&&e[n](w_(o,r,g))},error:e[n+1],complete:e[n+2]};else{const g=je(r,dt);o=je(g.firestore,$t),c=g._query;const R=new Ml(o);i={next:C=>{e[n]&&e[n](new ir(o,R,g,C))},error:e[n+1],complete:e[n+2]},I_(r._query)}const u=Ki(o);return jP(u,c,s,i)}function za(r,e){const t=Ki(r);return KP(t,e)}function w_(r,e,t){const n=t.docs.get(e._key),s=new Ml(r);return new sr(r,s,e._key,n,new js(t.hasPendingWrites,t.fromCache),e.converter)}function Nb(r){return r=je(r,$t),Ki(r),new nb(r,(e=>za(r,e)))}(function(e,t=!0){jT(is),Ur(new or("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),c=new $t(new KT(n.getProvider("auth-internal")),new QT(o,n.getProvider("app-check-internal")),Lw(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),mn(Mf,Ff,e),mn(Mf,Ff,"esm2020")})();var rb="firebase",sb="12.15.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mn(rb,sb,"app");export{Cb as A,ab as B,cb as C,ob as D,yb as a,Pb as b,fb as c,Ib as d,kE as e,_b as f,db as g,xb as h,TI as i,Vb as j,bb as k,mb as l,Sb as m,Db as n,lb as o,Rb as p,Eb as q,hb as r,ub as s,gb as t,Tb as u,bv as v,Nb as w,vb as x,Ab as y,wb as z};
