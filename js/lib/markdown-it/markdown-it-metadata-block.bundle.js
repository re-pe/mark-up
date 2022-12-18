/* esm.sh - esbuild bundle(markdown-it-metadata-block@1.0.2) es2022 production */
var i=/^-{3}\s*$/,m=/^(?:\.{3}|-{3})\s*$/,b=(s,r)=>{s.block.ruler.before("table","metadata_block",(e,n,f,u)=>{e.env.meta||(e.env.meta=r?.meta||{});let d=e.getLines(n,n+1,0,!1);if(i.test(d)&&(n==0||e.isEmpty(n-1))){let o=e.getLines(n+1,f,0,!1).split(`
`),c=o.findIndex(t=>m.test(t));if(c>=0)try{let t=o.slice(0,c).join(`
`),l=r?.parseMetadata(o.slice(0,c).join(`
`));if(typeof l=="object"){if(u)return!0;Object.assign(e.env.meta,l);let a=e.push("metadata_block","",0);return a.meta=l,a.markup="---",a.content=e.getLines(n+1,n+1+c,0,!1),e.line=n+c+2,!0}}catch{return!1}}return!1}),s.renderer.rules.metadata_block=()=>""},p=b;export{p as default};
