/* esm.sh - esbuild bundle(markdown-it-bracketed-spans@1.0.1) es2022 production */
var c=Object.create;var u=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var b=(p,n)=>()=>(n||p((n={exports:{}}).exports,n),n.exports);var k=(p,n,o,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let e of x(n))!m.call(p,e)&&e!==o&&u(p,e,{get:()=>n[e],enumerable:!(r=_(n,e))||r.enumerable});return p};var v=(p,n,o)=>(o=p!=null?c(h(p)):{},k(n||!p||!p.__esModule?u(o,"default",{value:p,enumerable:!0}):o,p));var i=b((C,a)=>{"use strict";a.exports=function(n){function o(r){var e=r.posMax;if(r.src.charCodeAt(r.pos)!==91)return!1;var f=r.pos+1,s=r.md.helpers.parseLinkLabel(r,r.pos,!0);if(s<0)return!1;var l=s+1;return l<e&&r.src.charCodeAt(l)===123?(r.pos=f,r.posMax=s,r.push("span_open","span",1),r.md.inline.tokenize(r),r.push("span_close","span",-1),r.pos=l,r.posMax=e,!0):!1}n.inline.ruler.push("bracketed-spans",o)}});var M=v(i()),{default:d,...A}=M,L=d!==void 0?d:A;export{L as default};
