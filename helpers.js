// Buffer helpers for scheduling AGUNA videos to TikTok @useaguna and the YouTube channel.
// Loaded in the publish.buffer.com tab: localStorage __H holds this file; (0,eval)(localStorage.getItem("__H")).
// Route and steps: claude/BUFFER-VIDEO-ROUTE.md. Gate: tools/probe-buffer-helpers.mjs.
window.__ytDesc=(t)=>t.replace(/\n\nGet AGUNA on the App Store[\s\S]*$/,'').replace(/(\s+#[\w]+)+\s*$/,'').replace(/\s*Search AGUNA( AI)? on the App Store\.\s*$/,'').trim()+'\n\nGet AGUNA on the App Store: https://apps.apple.com/app/id6767250053\n\n#shorts #gym #workout #fitness';
window.__g=async(op,query,variables)=>{const r=await fetch('https://graph.buffer.com/?_o='+op,{method:'POST',credentials:'include',headers:{'content-type':'application/json','x-buffer-client-id':'webapp-publishing'},body:JSON.stringify({query,variables})});return r.json();};
window.__TT='6abd02deea19ca0bde32920c';window.__YT='6ac698396a5c39ccb644ff80';window.__IG='6ace7c4b778b240e2ffb7174';
// AI LABEL OFF, EVERY CHANNEL (King, 25 Oct: "NO NEED FOR THE AI LABELS"). This reverses his 14 Oct
// "turn that ai label back on", given after TikTok removed one unlabelled post; his latest word stands.
// THE COVER IS THE MOST SHOW-STOPPING FRAME, NEVER FRAME 0 (King, 18 Oct: "always use the most show stopping parts as
// covers for all the clips"). cover = seconds into the video; thumbnailOffset is in milliseconds.
window.__mk=async({src,file,text,yt,dueAt,ch,cover})=>{const out=[];for(const c of ch){const input={channelId:c,text,dueAt,mode:'customScheduled',schedulingType:'automatic',needsApproval:false,assets:[{video:{url:src,thumbnailUrl:src+'/thumbnail',metadata:{title:file,thumbnailOffset:Math.round(Number(cover)*1000)}}}]};
 if(c===window.__TT)input.metadata={tiktok:{isAiGenerated:false}};
 // Instagram @agunaworkoutapp: REGULAR reels, never trial reels (trial reels fail at publish for this account, 14 to 17 Oct).
 if(c===window.__IG)input.metadata={instagram:{type:'reel',shouldShareToFeed:true,isAiGenerated:false}};
 if(c===window.__YT)input.text=window.__ytDesc(text);
 if(c===window.__YT)input.metadata={youtube:{title:yt,categoryId:'26',privacy:'public',madeForKids:false,notifySubscribers:true,license:'youtube',embeddable:true,isAiGenerated:false}};
 const r=await window.__g('CreatePost','mutation($i:CreatePostInput!){createPost(input:$i){__typename ... on PostActionSuccess{post{id dueAt status}} ... on InvalidInputError{message} ... on UnexpectedError{message} ... on LimitReachedError{message} ... on RestProxyError{message}}}',{i:input});
 out.push(r.errors?{__typename:'ERR',message:r.errors[0].message}:r.data.createPost);}return out;};
window.__fin=async({file,text,yt,dueAt,ch,cover})=>{
 if(!(Number(cover)>0.5))return 'NO COVER for '+file+': pass cover, the seconds of its most show-stopping frame';
 const d=await window.__g('GetDrafts','query($o:OrganizationId!){posts(input:{organizationId:$o,filter:{status:[draft]}},first:20){edges{node{id channelId assets{... on VideoAsset{source video{title}}}}}}}',{o:'6a3f49cdf958f9474cd580c7'});
 const dr=d.data.posts.edges.map(e=>e.node).filter(n=>n.assets?.[0]?.video?.title===file);
 if(!dr.length)return 'NO DRAFT for '+file;
 const src=dr[0].assets[0].source.split('?')[0];
 const res=await window.__mk({src,file,text,yt,dueAt,ch,cover});
 const ok=res.every(r=>r.__typename==='PostActionSuccess');
 if(ok){for(const x of dr)await window.__g('DeletePost','mutation($i:DeletePostInput!){deletePost(input:$i){__typename}}',{i:{id:x.id}});}
 const log=JSON.parse(localStorage.getItem('__BLOG')||'[]');log.push({file,dueAt,ch:ch.length,ok,ids:res.map(r=>r.post?.id)});localStorage.setItem('__BLOG',JSON.stringify(log));
 return (ok?'OK ':'FAIL ')+file+' '+dueAt+' '+JSON.stringify(res.map(r=>r.__typename+(r.message?':'+r.message:'')));};
window.__open=()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='New Post');if(!b)return 'no btn';b.click();return 'clicked';};
window.__waitUp=async()=>{for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,1000));const d=document.querySelector('[role=dialog]');if(!d)return 'nodlg';if(!/\d+(\.\d+)?%/.test(d.innerText))return 'done '+i;}return 'timeout';};
window.__open2=async()=>{window.__open();for(let i=0;i<20;i++){await new Promise(r=>setTimeout(r,500));const b=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.innerText.trim()==='Deselect AGUNA');if(b){b.click();await new Promise(r=>setTimeout(r,800));return [...document.querySelectorAll('[role=dialog] button')].filter(b=>/^Deselect/.test(b.innerText.trim())).map(b=>b.innerText.trim()).join(',');}}return 'no yt btn';};
window.__fin2=async({file,text,yt,dueAt,ch,cover})=>{
 if(!(Number(cover)>0.5))return 'NO COVER for '+file+': pass cover, the seconds of its most show-stopping frame';
 // v2 (13 Oct): refuse stale or ambiguous uploads, and never schedule the same file+slot twice.
 const thumbs=[...new Set([...document.querySelectorAll('[role=dialog] img')].map(i=>(i.currentSrc||i.src).split('?')[0]).filter(u=>/buffer-media-uploads\.s3\.amazonaws\.com\/.+\/thumbnail$/.test(u)))];
 if(!thumbs.length)return 'NO UPLOAD for '+file;
 if(thumbs.length>1)return 'AMBIGUOUS: '+thumbs.length+' uploads in the composer for '+file+'. Reopen it clean.';
 const src=thumbs[0].replace(/\/thumbnail$/,'');
 const log=JSON.parse(localStorage.getItem('__BLOG')||'[]');
 if(log.some(l=>l.src===src))return 'STALE UPLOAD: that video was already used by '+log.find(l=>l.src===src).file+'. Reopen and upload '+file+' again.';
 if(log.some(l=>l.file===file&&l.dueAt===dueAt&&l.ok))return 'ALREADY SCHEDULED '+file+' '+dueAt;
 let after=null;for(let i=0;i<6;i++){const r=await window.__g('Dup','query($o:OrganizationId!,$a:String){posts(input:{organizationId:$o,filter:{status:[scheduled,sent]}},first:100,after:$a){pageInfo{hasNextPage endCursor} edges{node{dueAt assets{... on VideoAsset{source}}}}}}',{o:'6a3f49cdf958f9474cd580c7',a:after});const p=r.data&&r.data.posts;if(!p)break;const hit=p.edges.find(e=>(e.node.assets[0]&&e.node.assets[0].source||'').split('?')[0]===src);if(hit)return 'STALE UPLOAD: that video is already on the post due '+hit.node.dueAt+'. Reopen and upload '+file+' again.';if(!p.pageInfo.hasNextPage)break;after=p.pageInfo.endCursor;}
 const res=await window.__mk({src,file,text,yt,dueAt,ch,cover});
 const ok=res.every(r=>r.__typename==='PostActionSuccess');
 log.push({file,dueAt,ch:ch.length,ok,src,ids:res.map(r=>r.post?.id),via:'thumb2'});localStorage.setItem('__BLOG',JSON.stringify(log));
 return (ok?'OK ':'FAIL ')+file+' '+dueAt+' '+JSON.stringify(res.map(r=>r.__typename+(r.message?':'+r.message:'')));};
'helpers ready';
