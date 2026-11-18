/*! bot.computer | Copyright 2026 f2i.com | Apache-2.0 | https://github.com/f2i-com/bot/blob/main/THIRD-PARTY-NOTICES.md */
(()=>{var No=e=>{throw TypeError(e)};var Ca=(e,t,a)=>t.has(e)||No("Cannot "+a);var Ge=(e,t,a)=>(Ca(e,t,"read from private field"),a?a.call(e):t.get(e)),Wt=(e,t,a)=>t.has(e)?No("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a),Dt=(e,t,a,r)=>(Ca(e,t,"write to private field"),r?r.call(e,a):t.set(e,a),a),W=(e,t,a)=>(Ca(e,t,"access private method"),a);var Ve=Math.PI*2,Da=[{id:"rest",label:"Rest",duration:0},{id:"wave",label:"Wave",duration:3.6},{id:"walk",label:"Walk",duration:1.16},{id:"dance",label:"Dance",duration:2.18},{id:"stretch",label:"Stretch",duration:5.6},{id:"squat",label:"Squat",duration:3.4}],ra=Object.fromEntries(Da.map(({id:e,duration:t})=>[e,t]));function na(e,t){let a=e%t/t;return a<0?a+1:a}var Xe=(e,t,a=2)=>Math.max(0,Math.cos(Ve*(e-t)))**a;function Zr(e){let t=na(e,ra.wave),a=1-.57*Xe(t,.79,5),r=a*Math.sin(Ve*3*t),n=a*Math.cos(Ve*3*t);return{rightArmLift:22+60*a+8*r,rightShoulder:5+8*a+4*n,rightArmRoll:26+57*a-11*r,rightElbow:31+53*a+14*r,rightWristBend:13*n,rightWristTurn:35*a+9*r,leftArmLift:5+3*a,leftShoulder:-4+2*Math.cos(Ve*t),leftElbow:8+4*a,torsoTurn:-4*a+1.7*r,torsoLean:-3.4*a,headTurn:8*a-2.5*r,headTilt:4*a,headNod:3.5*Xe(t,.8),rootY:.014*Math.sin(Ve*t)}}function xr(e){let t=na(e,ra.walk),a=Math.cos(Ve*t),r=Math.sin(Ve*t),n=i=>4+12*Xe(i,.105,4)+52*Xe(i,.66,2.5),s=i=>3+24*Math.cos(Ve*i),l=i=>{let c=-10*Xe(i,.01,3)+27*Xe(i,.5,3)-7*Xe(i,.83,5);return Math.min(43,Math.max(-31,n(i)-s(i)-c))};return{leftHip:s(t),rightHip:s(t+.5),leftKnee:n(t),rightKnee:n(t+.5),leftAnkleFlex:l(t),rightAnkleFlex:l(t+.5),leftShoulder:-18*a-3*r,rightShoulder:18*a+3*r,leftArmLift:4,rightArmLift:4,leftElbow:15-7*a,rightElbow:15+7*a,torsoTurn:5.8*a,torsoPitch:3.2+1.3*Math.cos(2*Ve*t),headTurn:-3.1*a,headNod:-2-1.6*Math.cos(2*Ve*t),torsoLean:-1.9*r,rootSway:.048*r,groundFeet:1}}function en(e){let t=na(e,ra.dance),a=Math.sin(Ve*t),r=Math.cos(Ve*t),n=.5+.5*Math.cos(2*Ve*t-.32),s=Math.sin(Ve*t-.19),l=Math.sin(Ve*t-.68);return{leftArmLift:43+32*s,rightArmLift:43-32*s,leftShoulder:14-18*r,rightShoulder:14+18*r,leftArmRoll:31+26*s,rightArmRoll:31-26*s,leftElbow:51+31*l,rightElbow:51-31*l,leftHip:9+12*a+5*n,rightHip:9-12*a+5*n,leftHipOut:4+16*Xe(t,.25),rightHipOut:4+16*Xe(t,.75),leftKnee:8+14*n+22*Xe(t,.24),rightKnee:8+14*n+22*Xe(t,.74),torsoTurn:13*r,torsoLean:6.7*a,torsoPitch:2+4*n,headTurn:-9*r+3*Math.sin(2*Ve*t),headTilt:-4*a,headNod:-2+6*n,leftHipTwist:9*Xe(t,.25,3),rightHipTwist:9*Xe(t,.75,3),leftAnkleFlex:4+9*n-10*Xe(t,.25,3),rightAnkleFlex:4+9*n-10*Xe(t,.75,3),rootSway:-.17*a,groundFeet:1}}function tn(e){let t=na(e,ra.stretch),a=Math.sin(Ve*t+.92),r=.5+.5*a,n=1-r;return{leftArmLift:24+132*r,rightArmLift:24+132*n,leftElbow:50-43*r,rightElbow:50-43*n,leftArmRoll:28+34*r,rightArmRoll:28+34*n,leftShoulder:9-12*r,rightShoulder:9-12*n,leftWristBend:9-16*r,rightWristBend:9-16*n,torsoLean:14*a,torsoPitch:-4,headNod:-9-4*a*a,headTilt:-7*a,headTurn:12*a}}function an(e){let t=na(e,ra.squat),a=.5+.5*Math.cos(Ve*t),r=a*a*(3-2*a),n=5+69*r,s=8+91*r;return{leftHip:n,rightHip:n,leftKnee:s,rightKnee:s,leftAnkleFlex:s-n,rightAnkleFlex:s-n,plantFeet:1,torsoPitch:3+23*r,headNod:-2-19*r,leftShoulder:4+62*r,rightShoulder:4+62*r,leftArmLift:4+6*r,rightArmLift:4+6*r,leftElbow:9+12*r,rightElbow:9+12*r}}function Pa(e,t=0){let a=Number.isFinite(t)?t:0;switch(e){case"wave":return Zr(a);case"walk":return xr(a);case"dance":return en(a);case"stretch":return tn(a);case"squat":return an(a);default:return{}}}var Ga=Da.filter(({duration:e})=>e>0),on={walk:4,dance:2},wo=new Map(Ga.map(({id:e,duration:t})=>[e,Math.round(t*(on[e]||1)*1e3)])),Wo=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)"),rn=Math.PI*2;function Ba(e){return wo.get(e)||0}function Ro(e){let t=Math.max(0,Math.min(e,1));return t*t*(3-2*t)}function Lo(e,t,a,r){if(!wo.has(t))return;let n=ko(e,a);e.bodyMotion={id:t,start:a,end:a+r,from:n}}function ko(e,t,a=Wo?.matches){let r=e?.bodyMotion;if(!r||t<r.start||t>=r.end)return null;let n=t-r.start,s=r.end-t,l=Pa(r.id,a?.2:n/1e3);if(a)return l;let i=Ro(n/180),c=Ro(s/240);for(let p of Object.keys(l))l[p]*=c;if(r.id==="walk"){let p=n/(r.end-r.start),h=rn*p;l.rootX=.56*(1-Math.cos(h)),l.rootZ=.56*Math.sin(h),l.rootYaw=360*p}if(i<1){let p=r.from||{};for(let h of new Set([...Object.keys(p),...Object.keys(l)])){let o=p[h]||0,I=(l[h]||0)-o;h==="rootYaw"&&(I-=360*Math.round(I/360)),l[h]=o+I*i}}return l}function Mo(e,t,a=Wo?.matches){let r=e.guideTravel;if(r){let s=Pa("walk",a?.2:r.elapsed*1.28);for(let l of Object.keys(s))s[l]*=r.stride;return s.rootYaw=r.facing*(68-44*r.point),s}let n=ko(e,t,a);return!e.tourPointing||!e.guideDirection?n:{...n,rootX:0,rootZ:0,rootYaw:24*e.guideDirection.x}}function Yo(e,t){let a=e.guideDirection;if(!a)return null;let r=e.tourPointing||e.guideTravel;if(!r&&(t||["thumbsup","think","shrug"].includes(e.emote)))return null;let n=Math.atan2(-a.y,Math.abs(a.x));return{side:a.x<0?-1:1,elevation:Math.max(r?-1.5:-.95,Math.min(r?1.5:1.12,n)),weight:e.guideTravel?.point??1}}function Uo(e){let t=e?.x||0;return Math.sign(t)*Math.min(1,Math.max(0,(Math.abs(t)-.25)/.6))}var Do=[{id:"side_sweep",label:"Studio Side-Sweep"},{id:"long_waves",label:"Long Flowing Waves"},{id:"sleek_bob",label:"Sleek Concierge Bob"},{id:"quiff",label:"Textured Quiff"},{id:"curly_halo",label:"Curly Crown"},{id:"pixie",label:"Modern Pixie Crop"},{id:"updo_bun",label:"Poised High Bun"},{id:"shoulder_lob",label:"Shoulder Lob"},{id:"long_straight",label:"Long & Straight"},{id:"ponytail",label:"Ponytail"},{id:"afro",label:"Afro"},{id:"braids",label:"Twin Braids"},{id:"pigtails",label:"Pigtails"},{id:"space_buns",label:"Space Buns"},{id:"mohawk",label:"Mohawk"},{id:"buzz",label:"Clean Buzz Fade"},{id:"none",label:"Smooth / Bald"}],Ka=[{id:"blazer",label:"Concierge Blazer"},{id:"suit_tie",label:"Executive Suit & Tie"},{id:"sweater",label:"Studio Crewneck"},{id:"turtleneck",label:"Architect Turtleneck"},{id:"hoodie",label:"Startup Hoodie"},{id:"vest",label:"Support Vest & Shirt"},{id:"polo",label:"Polo Shirt"},{id:"scoop",label:"Scoop-Neck Top"},{id:"apron",label:"Barista Apron"},{id:"tee",label:"Graphic Tee"},{id:"shirt",label:"Button-Up Shirt"},{id:"cardigan",label:"Cozy Cardigan"},{id:"jacket",label:"Zip Jacket"},{id:"rugby_shirt",label:"Striped Rugby Shirt"},{id:"field_overshirt",label:"Field Overshirt"},{id:"track_jacket",label:"Track Jacket"},{id:"cyber",label:"Android Chassis"}],Po=[{id:"none",label:"None"},{id:"classic",label:"Studio Frames"},{id:"round",label:"Round Wire"},{id:"bold",label:"Bold Horn-Rim"},{id:"cat_eye",label:"Cat-Eye"},{id:"aviator",label:"Aviators"},{id:"shades",label:"Tinted Shades"},{id:"visor",label:"Holo Visor"}];var Go=[{id:"none",label:"None"},{id:"beanie",label:"Beanie"},{id:"cap",label:"Cap"},{id:"headband",label:"Headband"},{id:"beret",label:"Beret"},{id:"headphones",label:"Headphones"},{id:"headscarf",label:"Headscarf"},{id:"bow",label:"Hair Bow"},{id:"flower",label:"Flower"},{id:"tiara",label:"Tiara"},{id:"fedora",label:"Fedora"},{id:"chef",label:"Chef's Hat"}];var Gs=[{id:"wave",label:"Wave"},{id:"smile",label:"Smile"},{id:"wink",label:"Wink"},{id:"nod",label:"Nod"},{id:"shake",label:"Shake head"},{id:"laugh",label:"Laugh"},{id:"think",label:"Think"},{id:"surprised",label:"Surprised"},{id:"shrug",label:"Shrug"},{id:"thumbsup",label:"Thumbs up"},{id:"tilt",label:"Tilt head"},{id:"bow",label:"Bow"},...Ga.filter(({id:e})=>e!=="wave").map(({id:e,label:t})=>({id:e,label:t})),{id:"rest",label:"Rest"}],Aa={framing:"half",stageShape:"card",bgStyle:"studio_dark",bgColor:"#141b2d",bgAccent:"#2b6cb0",haloGlow:!0,bodyScale:1,headScale:1,neckLength:1,neckWidth:.95,shoulderWidth:.96,shoulderSlope:.08,chestWidth:.94,waistWidth:.8,hipWidth:.94,torsoLength:1,armThickness:.94,posture:"welcoming",genderStyle:"feminine",headWidth:.97,headHeight:1,cheekboneWidth:1.02,jawWidth:.9,chinLength:0,chinRoundness:.65,earSize:1,earStyle:"human",skinColor:"#f1c6b0",blushIntensity:.24,synthFinish:0,eyeSize:1.04,eyeSpacing:1,eyeTilt:.06,irisColor:"#3b82a6",lashStyle:"lush",browThickness:.92,browArch:.22,noseLength:1,noseWidth:.96,mouthWidth:.98,lipFullness:1.08,lipColor:"#d6687c",hairStyle:"long_waves",hairColor:"#3c2734",hairHighlight:"#7b546c",facialHair:"none",outfitStyle:"blazer",outfitPrimary:"#1e2f4d",outfitSecondary:"#f4f6fb",outfitAccent:"#38bdf8",glasses:"none",glassesColor:"#1f2430",headsetMic:!0,nameBadge:!0,restSmile:0,browMood:0,eyeOpen:0,freckles:0,eyeshadow:0,eyeshadowColor:"#7a5c8f",browColor:"",earrings:"none",earringColor:"#e6c35c",headwear:"none",headwearColor:"#b4452f",neckwear:"none",neckwearColor:"#d9a441",fringe:!1,ageLines:0,beautyMark:!1,dimples:0,eyeliner:0,noseStud:!1,irisColor2:"",brooch:"none",broochColor:"#e6c35c"};function q(e,t,a){return Math.max(t,Math.min(a,e))}function be(e,t=[230,180,155]){let a=String(e||"").trim().replace(/^#/,"");if(a.length===3){let r=parseInt(a[0]+a[0],16),n=parseInt(a[1]+a[1],16),s=parseInt(a[2]+a[2],16);return Number.isFinite(r+n+s)?[r,n,s]:t}if(a.length>=6){let r=parseInt(a.slice(0,2),16),n=parseInt(a.slice(2,4),16),s=parseInt(a.slice(4,6),16);return Number.isFinite(r+n+s)?[r,n,s]:t}return t}function A([e,t,a],r=1){let n=q(Math.round(e),0,255),s=q(Math.round(t),0,255),l=q(Math.round(a),0,255);return r>=.999?`rgb(${n}, ${s}, ${l})`:`rgba(${n}, ${s}, ${l}, ${r.toFixed(3)})`}function K([e,t,a],r,n=0){return[e*r+n*14,t*r-Math.abs(n)*4,a*r-n*10]}function Ae(e,t,a){return[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a]}function Bo(){return{jaw:.045,tH:.46,tF:.5,tTip:.16,lipR:.04,lipS:.08,lipC:.2,velum:0,energy:0,voicing:0,noise:0,f0:160,f1:500,f2:1500,f3:2500,pitchSt:0,phone:"",ipa:"",word:"",glotPhase:0,wavePhase:0,lastTickMs:0,blinkStartMs:-1e3,nextBlinkMs:1600,saccadeX:0,saccadeY:0,nextSaccadeMs:1100,lookX:0,lookY:0,emote:"",emoteUntilMs:0,bodyMotion:null,mood:"",idleLife:!0,nextIdleMs:0,x:Object.fromEntries(Ko.map(e=>[e,0]))}}var Ko=["smile","frown","browUp","browIn","eyeWide","mouthO","wink","nod","shake","tilt","bow","bounce","shrug","think","laugh","gazeX","gazeY","shut","thumbUp"],nn=new Set(["browIn","eyeWide","tilt","gazeX","gazeY"]),Oa={smile:{smile:.85,browUp:.3,eyeWide:-.12},wave:{smile:.75,browUp:.3},walk:{smile:.3},dance:{smile:.8,browUp:.25},stretch:{eyeWide:-.12},squat:{browIn:-.15},wink:{smile:.7,wink:1,tilt:.3},nod:{nod:1,smile:.3},shake:{shake:1,browIn:.25},laugh:{smile:1,eyeWide:-.6,browUp:.35,bounce:1,laugh:1},think:{think:1,browIn:-.3,tilt:-.7,gazeX:-.55,gazeY:-.55},surprised:{browUp:1,eyeWide:.9,mouthO:.75},shrug:{shrug:1,browUp:.7,tilt:.45,frown:.2},tilt:{tilt:1,smile:.3},bow:{bow:1,smile:.3},thumbsup:{smile:.8,browUp:.35,thumbUp:1},lookleft:{gazeX:-.95},lookright:{gazeX:.95},lookup:{gazeY:-.85,browUp:.3},lookdown:{gazeY:.85},chuckle:{smile:.8,eyeWide:-.35,browUp:.2,bounce:.45,laugh:.5},giggle:{smile:.9,eyeWide:-.5,tilt:.35,bounce:.7,laugh:.6},guffaw:{smile:1,shut:.7,browUp:.5,bounce:1,laugh:1},nervous:{smile:.4,browIn:.7,gazeX:.5,bounce:.3,laugh:.4},evil:{smile:.75,browIn:-.95,eyeWide:-.3,bounce:.45,laugh:.7,tilt:-.3},sigh:{browIn:.5,eyeWide:-.35,bow:.3,frown:.2},yawn:{shut:.85,browUp:.55,tilt:.3,mouthO:.9},sniff:{browIn:.6,frown:.3,eyeWide:-.2},pant:{bounce:.6,mouthO:.35,browIn:.3},phew:{browUp:.6,smile:.4,eyeWide:-.25},worried:{browIn:.85,eyeWide:.6,mouthO:.35},puzzled:{browUp:.7,tilt:.55,browIn:.3},aha:{browUp:.8,smile:.7,eyeWide:.3},ooh:{browUp:.7,mouthO:.6,eyeWide:.4},aww:{smile:.7,browIn:.6,tilt:.5,eyeWide:-.2},relief:{smile:.5,eyeWide:-.45,browUp:.2},disgust:{browIn:-.6,frown:.75,eyeWide:-.45,tilt:-.3},hum:{smile:.4,eyeWide:-.35,tilt:.35},groan:{frown:.6,browIn:.5,eyeWide:-.55,tilt:-.3},scream:{browUp:1,eyeWide:1,mouthO:1},cry:{browIn:.95,frown:.9,shut:.55,bow:.25},shush:{browUp:.35,eyeWide:.25,mouthO:.5},psst:{gazeX:-.6,tilt:-.35,browUp:.35},tsk:{shake:.55,browIn:-.45},kiss:{mouthO:.85,shut:.6,smile:.2},shiver:{bounce:.85,browIn:.5,shrug:.7},angry:{browIn:-1,frown:.5,eyeWide:-.3},raspberry:{shut:.5,mouthO:.4,tilt:.3},whistle:{mouthO:.7,browUp:.45},cough:{bow:.35,shut:.6,bounce:.3},hiccup:{bounce:.9,browUp:.6,eyeWide:.45},sneeze:{shut:1,bow:.55,browIn:.4},sleep:{shut:1,tilt:.5,bow:.2},idle_tilt_left:{tilt:-.42},idle_tilt_right:{tilt:.42,smile:.2},idle_smile:{smile:.5,browUp:.15},idle_brows:{browUp:.55},idle_glance_left:{gazeX:-.6,gazeY:-.1},idle_glance_right:{gazeX:.6,gazeY:-.1},happy:{smile:.7,browUp:.22},excited:{smile:.9,browUp:.65,eyeWide:.3},calm:{smile:.22,eyeWide:-.1},sad:{browIn:.9,frown:.85,eyeWide:-.2,bow:.15,gazeY:.3},serious:{browIn:-.75,eyeWide:-.12}},sn={happy:"smile",grin:"smile",yes:"nod",no:"shake",cackle:"laugh",hoho:"laugh",snicker:"chuckle",hehe:"giggle",gasp:"surprised",hmm:"think",um:"think",uh:"think",mm:"relief",ahh:"relief",mhm:"nod","uh-huh":"nod","uh-uh":"shake","uh-oh":"worried",huh:"puzzled",oh:"ooh",ugh:"disgust",eww:"disgust",sob:"cry",whimper:"cry",shh:"shush",brr:"shiver",grr:"angry",fweet:"whistle",ahem:"cough",snore:"sleep"},_o={smile:1900,wink:750,nod:1e3,shake:1150,laugh:1700,think:2e3,surprised:1500,shrug:1500,tilt:1500,bow:1300,thumbsup:1900,lookleft:1300,lookright:1300,lookup:1300,lookdown:1300,sad:2400,serious:2e3,excited:1800,calm:1800},vo=[["idle_tilt_left",1500],["idle_tilt_right",1500],["idle_smile",1700],["idle_brows",800],["idle_glance_left",1100],["idle_glance_right",1100]];function Pt(e,t,a,r=performance.now()){if(!e||!t)return;let n=String(t).toLowerCase(),s=sn[n]||n;if(s==="rest"){e.bodyMotion=null,e.emote="",e.emoteUntilMs=r,e.nextIdleMs=0;return}if(s==="blink"){e.blinkStartMs=r;return}if(!Object.prototype.hasOwnProperty.call(Oa,s))return;e.emote=s;let l=a>0?a:Ba(s)||_o[s]||1800;e.emoteUntilMs=r+l,Lo(e,s,r,l)}function Gt(e,t){if(!e)return;let a=String(t||"").toLowerCase();e.mood=Object.prototype.hasOwnProperty.call(Oa,a)?a:""}function Fo(e,t,a=0){let r=e?.words||[],n=r.length,s=e?.duration||0,l=(t||[]).map(i=>{let c=i.word||0;a>0&&n>0&&a!==n&&(c=Math.round(c/a*n));let p=0;n>0&&c>0&&(p=c>=n?Math.max(0,s-.3):Math.max(0,r[c].start-.08));let h=i.sound&&c<n?r[c]:null;return h&&String(h.word).startsWith("[")?{...i,t:Math.max(0,h.start-.04),ms:Math.max(350,(h.end-h.start)*1e3+120)}:{...i,t:p}});return l.sort((i,c)=>i.t-c.t),{items:l,next:0}}function Vo(e,t=.34){let a=(e||[]).slice().sort((i,c)=>(i.word||0)-(c.word||0)),r=new Map,n=-1,s=0;return{items:a.map(i=>{let c=i.word||0;(c!==n||i.name==="rest")&&r.clear(),n=c;let p=c*t+(i.pauseMs||0)/1e3+s;if(i.type==="action"&&i.name!=="rest"){let h=Ba(i.name),o=h?"body":i.name==="blink"?"eyes":"expression",I=r.get(o)||0;I>p&&(s+=I-p,p=I);let g=i.ms||h||_o[i.name]||(i.name==="blink"?145:1800);r.set(o,p+g/1e3)}return{...i,t:p}}),next:0}}function Ta(e,t,a,r=performance.now()){if(t)for(;t.next<t.items.length&&t.items[t.next].t<=a;){let n=t.items[t.next++];n.type==="mood"?Gt(e,n.name):Pt(e,n.name,n.ms,r)}}function qo(e,t,a=150){if(!e||!e.visemes||!e.visemes.length)return null;let r=e.visemeFields&&e.visemeFields.length||9,n=e.visemeRate||200,s=Math.floor(e.visemes.length/r);if(s<=0)return null;let l=q(t*n,0,s-1),i=Math.floor(l),c=Math.min(s-1,i+1),p=l-i,h=e.visemes,o=i*r,I=c*r,g=(N,f)=>N+(f-N)*p,H={jaw:g(h[o],h[I]),tH:g(h[o+1],h[I+1]),tF:g(h[o+2],h[I+2]),tTip:g(h[o+3],h[I+3]),lipR:g(h[o+4],h[I+4]),lipS:g(h[o+5],h[I+5]),lipC:g(h[o+6],h[I+6]),velum:g(h[o+7],h[I+7]),energy:g(h[o+8],h[I+8]),f0:a,f1:500,f2:1500,f3:2500,voicing:0,noise:0,phone:"",ipa:"",word:""};if(e.acoustics&&e.acoustics.length>=6){let N=e.acousticFields&&e.acousticFields.length||6,f=e.acoustics,S=i*N,L=c*N;L+5<f.length&&(H.f0=g(f[S],f[L]),H.f1=g(f[S+1],f[L+1]),H.f2=g(f[S+2],f[L+2]),H.f3=g(f[S+3],f[L+3]),H.voicing=g(f[S+4],f[L+4]),H.noise=g(f[S+5],f[L+5]))}else H.voicing=H.energy;if(e.phones)for(let N=0;N<e.phones.length;N++){let f=e.phones[N];if(t>=f.start&&t<f.end){H.phone=f.phone,H.ipa=f.ipa;break}}if(e.words)for(let N=0;N<e.words.length;N++){let f=e.words[N];if(t>=f.start&&t<f.end){H.word=f.word;break}}if(e.segments&&e.segments.length){let N=e.segments[0];for(let f=0;f<e.segments.length;f++){let S=e.segments[f];if(t>=S.start&&t<=S.end){N=S;break}t>=S.start&&(N=S)}H.segPitch=N.pitchHz}return H}function zo(e,t,a,r=null,n=160){let s=e.lastTickMs>0?Math.min(.05,(t-e.lastTickMs)/1e3):.016;if(e.lastTickMs=t,e.emote&&t>e.emoteUntilMs&&(e.emote=""),e.idleLife!==!1){if(a||e.emote&&!e.emote.startsWith("idle_")||!e.nextIdleMs)e.nextIdleMs=t+5e3+Math.random()*7e3;else if(!e.emote&&t>=e.nextIdleMs){let[B,X]=vo[Math.floor(Math.random()*vo.length)];e.emote=B,e.emoteUntilMs=t+X,e.nextIdleMs=t+X+6e3+Math.random()*9e3}}else e.nextIdleMs=0,e.emote.startsWith("idle_")&&(e.emote="");let l=e.emote?Oa[e.emote]:null,i=e.mood?Oa[e.mood]:null,c=e.x,p=1-Math.exp(-s*13);for(let B of Ko){let X=0;l&&l[B]!==void 0?X=l[B]:i&&i[B]!==void 0&&(X=i[B]*.7),c[B]+=(X-c[B])*p,!nn.has(B)&&c[B]<5e-4&&(c[B]=0)}let h=.5+.5*Math.sin(t*.0019),o=.09+c.smile*.3,I=c.laugh*(.2+.14*Math.abs(Math.sin(t*.019))),g=a||{jaw:.038+.012*h+c.mouthO*.3+I,tH:.46,tF:.5,tTip:.16,lipR:.03+c.mouthO*.5,lipS:o,lipC:.22*(1-Math.max(c.mouthO,c.laugh)),velum:0,energy:0,voicing:0,noise:0,f0:n,f1:500,f2:1500,f3:2500,phone:"",ipa:"",word:""},H=1-Math.exp(-s*(a?38:10)),N=1-Math.exp(-s*(a?22:7.5));e.jaw+=(g.jaw-e.jaw)*H,e.tH+=(g.tH-e.tH)*H,e.tF+=(g.tF-e.tF)*H,e.tTip+=(g.tTip-e.tTip)*H,e.lipR+=(g.lipR-e.lipR)*H,e.lipS+=(Math.max(g.lipS,c.smile*.3)-e.lipS)*H,e.lipC+=(g.lipC-e.lipC)*H,e.velum+=(g.velum-e.velum)*N,e.energy+=(g.energy-e.energy)*H,e.voicing+=(g.voicing-e.voicing)*H,e.noise+=(g.noise-e.noise)*H,e.f0+=(g.f0-e.f0)*N,e.f1+=(g.f1-e.f1)*N,e.f2+=(g.f2-e.f2)*N,e.f3+=(g.f3-e.f3)*N,e.phone=g.phone||"",e.ipa=g.ipa||"",e.word=g.word||"";let f=a?.segPitch||n||150,S=e.voicing>.12?12*Math.log2(Math.max(50,e.f0)/Math.max(50,f)):0;e.pitchSt+=(q(S,-6,9)-e.pitchSt)*N,e.glotPhase=(e.glotPhase+s*(6+e.f0*.055))%1,e.wavePhase=(e.wavePhase+s*(1.7+e.energy*1.4))%1,t>=e.nextBlinkMs&&(e.blinkStartMs=t,e.nextBlinkMs=t+2500+Math.random()*3100),t>=e.nextSaccadeMs&&(e.saccadeX=(Math.random()-.5)*.24,e.saccadeY=(Math.random()-.5)*.16,e.nextSaccadeMs=t+1200+Math.random()*2200);let L=e.saccadeX,F=e.saccadeY;r&&r.active&&(L=q(r.nx,-1,1)*.92+e.saccadeX*.22,F=q(r.ny,-1,1)*.85+e.saccadeY*.22);let U=Math.min(1,Math.abs(c.gazeX)+Math.abs(c.gazeY));U>.02&&(L+=(c.gazeX-L)*U,F+=(c.gazeY-F)*U);let z=1-Math.exp(-s*8.5);e.lookX+=(L-e.lookX)*z,e.lookY+=(F-e.lookY)*z}function jo(e,t,a){let r=a.framing||"half",n=240,s=240,l=18;if(r==="bust")n=205,s=210,l=6;else if(r==="half"){n=265,s=290;let o=(a.headHeight??1)*(a.headScale??1),I=["quiff","updo_bun","space_buns","mohawk","afro","curly_halo"].includes(a.hairStyle);l=a.headwear&&a.headwear!=="none"||I?46:46+q(17-(o-1)*90,0,22)}else n=290,s=340,l=68;let i=q(Number(a.bodyScale)||1,.78,1.24),c=Math.min(e/n,t/s)*i,p=e*.5,h=t*.5-l*c+(r==="bust"?10*c:8*c);return{cx:p,cy:h,scale:c,framing:r}}function $o(e){let t=e.genderStyle==="feminine",a=e.genderStyle==="masculine",r=q(Number(e.headScale)||1,.82,1.25),n=(t?50.5:a?54:52.2)*q(e.headWidth??1,.76,1.28)*r,s=66*q(e.headHeight??1,.82,1.22)*r,l=n*q(e.cheekboneWidth??1,.82,1.24),i=(t?36.5:a?43.5:40)*q(e.jawWidth??1,.7,1.32)*r,c=(55+(e.chinLength??0)*22)*r,p=(t?16.8:a?21.5:19)*q(e.neckWidth??1,.68,1.38),h=34*q(e.neckLength??1,.72,1.4),o=44+h,I=(t?68:a?82:75)*q(e.shoulderWidth??1,.68,1.45),g=13+q(e.shoulderSlope??.08,-.4,.5)*24,H=128*q(e.torsoLength??1,.78,1.32),N=(t?52:a?62:57)*q(e.chestWidth??1,.68,1.42),f=(t?41:a?53:47)*q(e.waistWidth??1,.55,1.42),S=(t?55:a?56:55)*q(e.hipWidth??1,.68,1.42),L=(t?14.5:a?18:16.2)*q(e.armThickness??1,.68,1.45);return{isFem:t,isMasc:a,headScale:r,headW:n,headH:s,cheekW:l,jawW:i,chinBaseY:c,neckHalfW:p,neckLen:h,shoulderY:o,shoulderHalfW:I,shoulderDrop:g,torsoLen:H,chestHalfW:N,waistHalfW:f,hipHalfW:S,armThick:L}}function ln(e,t,a){let{cx:r,cy:n,scale:s}=jo(e,t,a),l=$o(a),i=(p,h)=>({x:r+p*s,y:n+h*s}),c=[{id:"crown",label:"Head Height",...i(0,-l.headH-6),axis:"y",apply(p,h,o){return{headHeight:q((o.headHeight??1)-h/s*.009,.82,1.22)}}},{id:"temple",label:"Head Width",...i(l.headW+4,-18*l.headScale),axis:"x",mirrorX:r-(l.headW+4)*s,apply(p,h,o){return{headWidth:q((o.headWidth??1)+p/s*.012,.78,1.25)}}},{id:"jaw",label:"Jaw Width",...i(l.jawW+3,34*l.headScale),axis:"x",mirrorX:r-(l.jawW+3)*s,apply(p,h,o){return{jawWidth:q((o.jawWidth??1)+p/s*.014,.72,1.28)}}},{id:"chin",label:"Chin Length & Shape",...i(0,l.chinBaseY+4),axis:"xy",apply(p,h,o){return{chinLength:q((o.chinLength??0)+h/s*.018,-.35,.45),chinRoundness:q((o.chinRoundness??.65)+p/s*.015,.05,1)}}},{id:"eyes",label:"Eye Spacing & Size",...i(22*(a.eyeSpacing??1)*l.headScale+10,-12*l.headScale),axis:"xy",apply(p,h,o){return{eyeSpacing:q((o.eyeSpacing??1)+p/s*.016,.8,1.24),eyeSize:q((o.eyeSize??1)-h/s*.018,.75,1.38)}}},{id:"mouth",label:"Mouth Width & Lips",...i(21*(a.mouthWidth??1)*l.headScale+4,31*l.headScale),axis:"xy",apply(p,h,o){return{mouthWidth:q((o.mouthWidth??1)+p/s*.018,.76,1.3),lipFullness:q((o.lipFullness??1)+h/s*.022,.65,1.5)}}},{id:"neck",label:"Neck Width & Length",...i(l.neckHalfW+3,44+l.neckLen*.48),axis:"xy",mirrorX:r-(l.neckHalfW+3)*s,apply(p,h,o){return{neckWidth:q((o.neckWidth??1)+p/s*.018,.7,1.35),neckLength:q((o.neckLength??1)+h/s*.015,.75,1.35)}}},{id:"shoulder",label:"Shoulders (Width & Slope)",...i(l.shoulderHalfW,l.shoulderY+l.shoulderDrop),axis:"xy",mirrorX:r-l.shoulderHalfW*s,apply(p,h,o){return{shoulderWidth:q((o.shoulderWidth??1)+p/s*.01,.7,1.42),shoulderSlope:q((o.shoulderSlope??.08)+h/s*.014,-.35,.45)}}}];return c.push({id:"brow",label:"Brow Arch & Thickness",...i(-(21.5*(a.eyeSpacing??1)*l.headScale+6),-(27+(a.browArch??.2)*9)*l.headScale),axis:"xy",apply(p,h,o){return{browArch:q((o.browArch??.2)-h/s*.03,-.2,.55),browThickness:q((o.browThickness??1)-p/s*.03,.5,1.6)}}},{id:"nose",label:"Nose Length & Width",...i(-9.5*(a.noseWidth??1)*l.headScale,10.2*(a.noseLength??1)*l.headScale),axis:"xy",apply(p,h,o){return{noseWidth:q((o.noseWidth??1)-p/s*.03,.74,1.32),noseLength:q((o.noseLength??1)+h/s*.03,.78,1.26)}}}),a.framing!=="bust"&&c.push({id:"hips",label:"Hip Width",...i(l.hipHalfW,l.shoulderY+l.torsoLen*1.06),axis:"x",mirrorX:r-l.hipHalfW*s,apply(p,h,o){return{hipWidth:q((o.hipWidth??1)+p/s*.013,.7,1.38)}}},{id:"chest",label:"Chest / Bust Width",...i(l.chestHalfW,l.shoulderY+l.torsoLen*.34),axis:"x",mirrorX:r-l.chestHalfW*s,apply(p,h,o){return{chestWidth:q((o.chestWidth??1)+p/s*.012,.7,1.38)}}},{id:"waist",label:"Waist Taper & Torso Length",...i(l.waistHalfW,l.shoulderY+l.torsoLen*.7),axis:"xy",mirrorX:r-l.waistHalfW*s,apply(p,h,o){return{waistWidth:q((o.waistWidth??1)+p/s*.013,.58,1.38),torsoLength:q((o.torsoLength??1)+h/s*.008,.8,1.28)}}},{id:"arm",label:"Arm Build",...i(l.shoulderHalfW+l.armThick*.78,l.shoulderY+l.shoulderDrop+l.torsoLen*.42),axis:"x",mirrorX:r-(l.shoulderHalfW+l.armThick*.78)*s,apply(p,h,o){return{armThickness:q((o.armThickness??1)+p/s*.022,.7,1.4)}}}),c.filter(p=>p.y>10&&p.y<t-10)}var Co=[[-4,1.5,.7],[5,2.5,.65],[-9,3.5,.75],[10,4,.7],[.5,4.5,.6],[-15,4.5,.8],[16,5.5,.75],[-20,6.5,.7],[21,7,.7],[-12,8,.65],[13,9,.7],[-25,9.5,.75],[26,10,.7],[-18,11,.6],[19,11.5,.65],[-6,6.5,.55],[7,7.5,.6],[-23,13,.6],[24,13.5,.6],[-29,8,.6],[30,8.5,.6],[-14,13.5,.55],[15,14,.55],[-2,0,.55],[2.5,8.5,.5],[-27,5,.55],[28,5.5,.55],[-10,11.5,.5],[11,12.5,.5],[-21,3,.55]];function cn(e,t,a,r,n){let s=r.framing==="cutout"?"cutout":r.stageShape||"card",l=2;if(e.beginPath(),s==="circle"){let o=Math.min(t,a)*.5-l;e.arc(t*.5,a*.5,Math.max(10,o),0,Math.PI*2)}else if(s==="arch"){let o=t-l*2,I=a-l*2,g=o*.5;e.moveTo(l,l+g),e.arc(t*.5,l+g,g,Math.PI,0),e.lineTo(l+o,l+I-18),e.quadraticCurveTo(l+o,l+I,l+o-18,l+I),e.lineTo(l+18,l+I),e.quadraticCurveTo(l,l+I,l,l+I-18),e.closePath()}else s==="card"?e.roundRect(l,l,t-l*2,a-l*2,Math.min(26,t*.08)):e.rect(0,0,t,a);if(e.clip(),s==="cutout"||r.bgStyle==="transparent")return;let i="#162033",c="#0b101b",p="rgba(56, 189, 248, 0.22)";switch(r.bgStyle){case"warm_cream":i="#f6efe4",c="#e3d8c6",p="rgba(217, 119, 6, 0.16)";break;case"sky_glass":i="#dcebfa",c="#b8d2ef",p="rgba(37, 99, 235, 0.18)";break;case"emerald_mist":i="#132a28",c="#091515",p="rgba(45, 212, 191, 0.22)";break;case"sunset":i="#3a2234",c="#1b121c",p="rgba(251, 146, 60, 0.24)";break;case"violet_haze":i="#2a2146",c="#120e22",p="rgba(167, 139, 250, 0.26)";break;case"mint_fresh":i="#e2f4ec",c="#bfe3d3",p="rgba(16, 185, 129, 0.18)";break;case"graphite":i="#3a3f4a",c="#1c1f26",p="rgba(226, 232, 240, 0.16)";break;case"custom":{let o=be(r.bgColor,[22,32,51]);i=A(K(o,1.18)),c=A(K(o,.68));let I=be(r.bgAccent,[56,189,248]);p=A(I,.25);break}default:break}let h=e.createLinearGradient(0,0,0,a);if(h.addColorStop(0,i),h.addColorStop(1,c),e.fillStyle=h,e.fillRect(0,0,t,a),r.haloGlow!==!1){let o=1+n.voicing*.28+n.energy*.18,I=Math.min(t,a)*.46*o,g=e.createRadialGradient(t*.5,a*.42,I*.08,t*.5,a*.42,I);g.addColorStop(0,p),g.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=g,e.fillRect(0,0,t,a)}}function St(e,t,a,r,n,s,l,i,c){let p=a.x-t.x,h=a.y-t.y,o=Math.hypot(p,h);e.save(),e.translate(t.x,t.y),e.rotate(Math.atan2(-p,h));let I=h>=0?1:-1,g=e.createLinearGradient(-I*r,0,I*r,0);g.addColorStop(0,s),g.addColorStop(.42,l),g.addColorStop(1,i),e.fillStyle=g,e.beginPath(),e.moveTo(-r,0),e.bezierCurveTo(-r,-r*1.3,r,-r*1.3,r,0),e.bezierCurveTo(r*1.04,o*.33,n,o*.8,n,o),e.quadraticCurveTo(0,o+n*.95,-n,o),e.bezierCurveTo(-n,o*.82,-r*1.03,o*.37,-r,0),e.closePath(),e.fill(),c&&(e.fillStyle=c,e.beginPath(),e.moveTo(-n,o-4),e.quadraticCurveTo(0,o-1,n,o-4),e.lineTo(n,o),e.quadraticCurveTo(0,o+n*.65,-n,o),e.closePath(),e.fill()),e.restore()}function hn(e,t,a,r,n,s,l,i,c){e.save(),e.translate(t.x,t.y),e.rotate(a),e.scale(n*r,r);let p=e.createLinearGradient(-7,0,9,14);if(p.addColorStop(0,l),p.addColorStop(.58,i),p.addColorStop(1,c),e.fillStyle=p,e.strokeStyle=p,e.lineCap="round",s==="wave"){for(let[h,o,I]of[[-5,-8,21],[-1.6,-2.4,25],[2.3,3.4,24],[5.4,8.4,19]])e.lineWidth=3.8,e.beginPath(),e.moveTo(h,11),e.quadraticCurveTo((h+o)/2,18,o,I),e.stroke();e.lineWidth=4.6,e.beginPath(),e.moveTo(4,6),e.quadraticCurveTo(9,7,12,14),e.stroke()}e.beginPath(),e.moveTo(-4.4,-2),e.bezierCurveTo(-5,2,-8.4,6,-7.2,12),s==="wave"?(e.quadraticCurveTo(-1,18.2,6.8,13),e.quadraticCurveTo(9,7,5,1)):s==="point"?(e.quadraticCurveTo(-7.4,15,-5.2,16),e.lineTo(-5.1,28),e.quadraticCurveTo(-3.6,31,-1.2,28.2),e.lineTo(.5,16.2),e.quadraticCurveTo(7.5,19,7.9,12),e.quadraticCurveTo(10,8.4,5,1)):s==="thumbsup"?(e.quadraticCurveTo(-8,17,-2,17),e.lineTo(2.5,17),e.quadraticCurveTo(4,20,4,24),e.bezierCurveTo(4,29,9,27,9.2,22),e.quadraticCurveTo(11,9,5,1)):s==="present"?(e.bezierCurveTo(-6,18,-1,23,3,25),e.quadraticCurveTo(6,26,4.6,22.5),e.quadraticCurveTo(2.2,18.2,1.4,14.5),e.quadraticCurveTo(4.2,18.2,6.5,18.4),e.quadraticCurveTo(9,17.4,6.5,14),e.quadraticCurveTo(4.4,11.4,4.1,9),e.quadraticCurveTo(12,13,10.3,9.4),e.quadraticCurveTo(6.1,5.4,4.7,1)):(e.bezierCurveTo(-7.4,18,-5.3,22,-2,21),e.quadraticCurveTo(2,22,4.5,16),e.quadraticCurveTo(7,11,6.8,9),e.quadraticCurveTo(10.5,14.7,11,10.8),e.quadraticCurveTo(9.6,5.2,4.8,1)),e.lineTo(4.2,-2),e.closePath(),e.fill(),e.strokeStyle=c,e.lineWidth=1,e.beginPath(),e.moveTo(4.7,7),e.quadraticCurveTo(1.5,8,1.1,12),e.stroke(),e.restore()}function pn(e,t,a,r,n,s,l,i,c){let p=t.wardrobe||{},h=p.bottom||"trousers",o=/dress|gown|bodycon|satin|cocktail|sleeved/.test(t.outfitStyle),I=o||/skirt|tennis/.test(h),g=/shorts|briefs|^denim$/.test(h),H=o?c:be(p.bottomColor,Ae(c,[36,28,48],.42)),N=p.legwear==="sheer"?Ae(i,be(p.legwearColor,i),.53):i,f=p.shoes==="barefoot"?N:be(p.shoeColor,[63,50,64]),S=Math.PI/180;I||(e.fillStyle=A(H),e.beginPath(),e.moveTo(-a.hipHalfW,r-7),e.quadraticCurveTo(-a.hipHalfW*.83,r+11,0,r+16),e.quadraticCurveTo(a.hipHalfW*.83,r+11,a.hipHalfW,r-7),e.fill());for(let L of l<0?[-1,1]:[1,-1]){let F=L>0?"left":"right",U=(s[F+"Hip"]||0)*S,z=U-(s[F+"Knee"]||0)*S,B={x:L*a.hipHalfW*.48,y:r-13},X={x:B.x+n*Math.sin(U)*l,y:B.y+n*Math.cos(U)},x={x:X.x+n*Math.sin(z)*l,y:X.y+n*Math.cos(z)},We=L*l>0,V=j=>[1.1,.97,.73].map(oe=>A(K(j,oe*(We?.84:1)))),v=a.hipHalfW,T=I||g?N:H;if(St(e,B,X,v*.48,v*.32,...V(T)),St(e,X,x,v*.32,v*.22,...V(T)),g&&!I){let j={x:B.x+(X.x-B.x)*.55,y:B.y+(X.y-B.y)*.55};St(e,B,j,v*.49,v*.4,...V(H))}let M={knee_boots:.84,heels:.43,ankle:.32,court_high_tops:.25}[p.shoes];if(M){let j={x:x.x+(X.x-x.x)*M,y:x.y+(X.y-x.y)*M};St(e,j,x,v*(.23+.09*M),v*.23,...V(f))}let R=z+(s[F+"AnkleFlex"]||0)*S,k={x:x.x+(l+L*.18)*v*.49,y:x.y+6-v*.38*Math.sin(R)};St(e,x,k,v*.23,v*.175,...V(f))}if(I){let L=a.hipHalfW,F=r+n*(h==="midi_skirt"||/gown/.test(t.outfitStyle)?1.36:.68),U=((s.leftHip||0)-(s.rightHip||0))*l*.14,z=e.createLinearGradient(-L,0,L,0);z.addColorStop(0,A(K(H,.78))),z.addColorStop(.48,A(H)),z.addColorStop(1,A(K(H,.69))),e.fillStyle=z,e.beginPath(),e.moveTo(-L,r-6),e.lineTo(L,r-6),e.lineTo(L*1.13+U,F),e.quadraticCurveTo(U,F+6,-L*1.13+U,F),e.closePath(),e.fill()}}function Xo(e,t,a,r,n,s=performance.now(),l={}){let i={...Aa,...r||{}};i.headwear==="headscarf"&&(i.hairStyle="none"),e.clearRect(0,0,t,a),e.save(),cn(e,t,a,i,n);let{cx:c,cy:p,scale:h}=jo(t,a,i),o=$o(i),I=s*.001,g=Mo(n,s,l.reducedMotion),H=!!(n.guideTravel||n.tourPointing),N=H?Math.sin((g?.rootYaw||0)*Math.PI/180):0,f=96*q(i.legLength??1,.73,1.35),S=Yo(n,g),L=be(i.skinColor,[241,198,176]),F=q(i.synthFinish??0,0,1),U=Ae(L,[218,228,242],F*.55),z=Ae(K(U,1.12,.25),[248,252,255],F*.45),B=Ae(K(U,.8,.35),[118,136,166],F*.55),X=Ae(K(U,.64,.45),[72,88,118],F*.55),x=be(i.hairColor,[60,39,52]),We=be(i.hairHighlight,K(x,1.45)),V=be(i.outfitPrimary,[30,47,77]),v=be(i.outfitSecondary,[244,246,251]),T=be(i.outfitAccent,[56,189,248]),M=Math.sin(I*1.9)*1.15,R=n.x||{},k=u=>R[u]||0,j=k("nod")*Math.sin(I*11)*3.8+k("bow")*7.5-k("bounce")*Math.abs(Math.sin(I*15))*2.4,oe=n.energy*2.5-n.pitchSt*.52+Math.sin(I*1.4)*.75+j,J=Math.sin(I*.82)*.015+n.pitchSt*.006*Math.cos(I*1.8)+n.lookX*.032+k("tilt")*.095,re=q(i.restSmile??0,-.4,1),Ie=q(k("smile")+re*.75,-.4,1.2),rt=q(k("browIn")-q(i.browMood??0,-1,1)*.55,-1.2,1.2),Pe=q(k("eyeWide")+q(i.eyeOpen??0,-.5,.5),-.8,1),ne=n.lookX*5.2+k("shake")*Math.sin(I*13)*7+N*19,de=i.headwear||"none",Ht=de==="beanie"||de==="cap"||de==="beret"||de==="fedora"||de==="chef",Lt=-o.headH*.56-5,Je=()=>{Ht&&(e.beginPath(),e.rect(-400,Lt,800,1200),e.clip())},_e=n.lookY*3,ue=n.jaw*14.2*(1-n.lipC*.55)*o.headScale,it=o.chinBaseY+ue,lt=o.shoulderHalfW+o.torsoLen*.74+30,nt=n.guideDirection?Math.min(h,t/(2*lt)):h,Nt=c,yt=p;if(H){let u=n.guideTravel?.point??1,d=-o.headH*1.32-26,m=o.shoulderY+o.torsoLen*1.12+2*f+9,E=Math.min(t/290,a*.97/(m-d)),O=Math.min(t/(1.7*lt),a/290),b=a*.98-m*E,Y=a*.07-d*O;nt=E+(O-E)*u,yt=b+(Y-b)*u,Nt-=Uo(n.guideDirection)*.15*lt*O*u}if(e.translate(Nt,yt),e.scale(nt*(1-.22*Math.abs(N)),nt),g&&!l.showSculptHandles&&(e.translate((g.rootX||0)*21+(g.rootSway||0)*44,(g.leftKnee||0)*.17),e.rotate((g.torsoLean||0)*Math.PI/420)),de==="headscarf"){let u=be(i.headwearColor,[180,69,47]);e.save(),e.translate(-ne*.42,oe*.65),e.rotate(J*.55);let d=e.createLinearGradient(0,-o.headH,0,o.shoulderY+30);d.addColorStop(0,A(K(u,.95))),d.addColorStop(1,A(K(u,.62))),e.fillStyle=d,e.beginPath(),e.moveTo(-o.headW-9,-14),e.bezierCurveTo(-o.headW-15,-o.headH*1.36-16,o.headW+15,-o.headH*1.36-16,o.headW+9,-14),e.bezierCurveTo(o.headW+16,30,o.shoulderHalfW*.74,o.shoulderY+2,o.shoulderHalfW*.82,o.shoulderY+22),e.lineTo(-o.shoulderHalfW*.82,o.shoulderY+22),e.bezierCurveTo(-o.shoulderHalfW*.74,o.shoulderY+2,-o.headW-16,30,-o.headW-9,-14),e.closePath(),e.fill(),e.restore()}let et=i.hairStyle==="curly_halo"||i.hairStyle==="afro";if(i.hairStyle==="ponytail"){e.save(),e.translate(-ne*.42,oe*.65),e.rotate(J*.55),Je();let u=Math.sin(I*1.6)*1.6+k("shake")*Math.sin(I*13-.6)*5,d=-o.headH*.58,m=o.shoulderY+34,E=e.createLinearGradient(0,d,0,m);E.addColorStop(0,A(K(x,.95))),E.addColorStop(1,A(K(x,.55))),e.fillStyle=E,e.beginPath(),e.moveTo(o.headW*.35,d),e.bezierCurveTo(o.headW+26,d-4,o.headW+30+u,18,o.headW+20+u,m-20),e.quadraticCurveTo(o.headW+14+u,m+4,o.headW+6+u,m),e.bezierCurveTo(o.headW+12+u*.6,26,o.headW+6,-6,o.headW*.2,d+14),e.closePath(),e.fill(),e.restore()}if(i.hairStyle==="pigtails"){e.save(),e.translate(-ne*.42,oe*.65),e.rotate(J*.55),Je();let u=Math.sin(I*1.6)*1.4+k("shake")*Math.sin(I*13-.6)*4,d=4,m=o.shoulderY+30;for(let E of[-1,1]){let O=E*(o.headW-3),b=e.createLinearGradient(0,d-10,0,m);b.addColorStop(0,A(K(x,1.02))),b.addColorStop(1,A(K(x,.58))),e.fillStyle=b,e.beginPath(),e.moveTo(O,d-12),e.bezierCurveTo(O+E*34,d-12,O+E*40+u,m-36,O+E*24+u,m-6),e.quadraticCurveTo(O+E*15+u,m+7,O+E*6+u,m-8),e.bezierCurveTo(O+E*12,m-40,O+E*5,d+24,O-E*3,d+10),e.closePath(),e.fill(),e.fillStyle=A(T),e.beginPath(),e.ellipse(O+E*12.5,d+3,4.4,7,E*.45,0,Math.PI*2),e.fill()}e.restore()}if(i.hairStyle==="long_waves"||i.hairStyle==="shoulder_lob"||i.hairStyle==="sleek_bob"||i.hairStyle==="long_straight"||i.hairStyle==="braids"||et){e.save(),e.translate(-ne*.42,oe*.65),e.rotate(J*.55),Je();let u=i.hairStyle==="braids"?36:i.hairStyle==="long_straight"?o.shoulderY+66:i.hairStyle==="long_waves"?o.shoulderY+46:i.hairStyle==="shoulder_lob"?o.shoulderY+18:et?42:48,d=i.hairStyle==="afro"?38:i.hairStyle==="curly_halo"?24:i.hairStyle==="long_waves"?17:i.hairStyle==="long_straight"?7:11,m=e.createLinearGradient(0,-o.headH-16,0,u);if(m.addColorStop(0,A(K(x,1.05))),m.addColorStop(.6,A(K(x,.75))),m.addColorStop(1,A(K(x,.48))),e.fillStyle=m,e.beginPath(),et){let E=i.hairStyle==="afro",O=o.headW+d,b=o.headH*.92+(E?30:16),Y=E?-22:-14,$=E?24:18;e.moveTo(O,Y);for(let pe=0;pe<$;pe++){let Me=(pe+1)*2*Math.PI/$,Ce=(pe+.5)*2*Math.PI/$,$e=5+2*Math.sin(pe*2.4);e.quadraticCurveTo((O+$e)*Math.cos(Ce),Y+(b+$e)*Math.sin(Ce),O*Math.cos(Me),Y+b*Math.sin(Me))}e.closePath()}else e.moveTo(-o.headW-9,-12),e.bezierCurveTo(-o.headW-15,-o.headH-20,o.headW+15,-o.headH-20,o.headW+9,-12),i.hairStyle==="long_waves"?(e.bezierCurveTo(o.headW+24,24,o.headW+1,39,o.headW+12,65),e.bezierCurveTo(o.headW+26,94,o.headW+4,u-9,o.headW+10,u),e.quadraticCurveTo(o.headW-6,u-2,o.headW-6,u-21)):e.bezierCurveTo(o.headW+d+4,34,o.headW+d,u-9,o.headW-1,u),e.quadraticCurveTo(1,u+10,-o.headW+1,u-2),e.bezierCurveTo(-o.headW-d,u-16,-o.headW-d-4,34,-o.headW-9,-12),e.closePath();if(e.fill(),!et){e.clip(),e.fillStyle=A(Ae(x,We,.37),.66);for(let E of[-1,1])e.beginPath(),e.moveTo(E*(o.headW-9),-o.headH+6),e.bezierCurveTo(E*(o.headW+35),4,E*(o.headW-3),u*.5,E*(o.headW+9),u-3),e.bezierCurveTo(E*(o.headW-13),u*.56,E*(o.headW+25),2,E*(o.headW-9),-o.headH+6),e.fill()}e.restore()}let C=o.shoulderY+M*.65,Q=C+o.shoulderDrop-k("shrug")*10,G=C+o.torsoLen*.68,ee=C+o.torsoLen*1.12;H&&pn(e,i,o,ee,f,g||{},N,U,V);let te=e.createLinearGradient(-o.neckHalfW-8,42,o.neckHalfW+8,C+16);if(te.addColorStop(0,A(B)),te.addColorStop(.36,A(z)),te.addColorStop(.72,A(U)),te.addColorStop(1,A(X)),e.fillStyle=te,e.beginPath(),e.moveTo(-o.neckHalfW,34),e.quadraticCurveTo(-o.neckHalfW-1,C-6,-o.neckHalfW-24,C+18),e.lineTo(o.neckHalfW+24,C+18),e.quadraticCurveTo(o.neckHalfW+1,C-6,o.neckHalfW,34),e.closePath(),e.fill(),F>.35){e.strokeStyle=A(T,.42*F),e.lineWidth=1.2;for(let u of[49,59])e.beginPath(),e.moveTo(-o.neckHalfW*.92,u),e.quadraticCurveTo(0,u+3.5,o.neckHalfW*.92,u),e.stroke()}let Z=e.createRadialGradient(ne*.5,51+oe,4,ne*.3,56+oe,o.neckHalfW*1.48);Z.addColorStop(0,"rgba(38, 18, 16, 0.44)"),Z.addColorStop(1,"rgba(38, 18, 16, 0)"),e.fillStyle=Z,e.beginPath(),e.ellipse(ne*.35,55+oe,o.neckHalfW*1.28,15+ue*.25,0,0,Math.PI*2),e.fill();let P=i.outfitStyle||"blazer",me=["tee","polo","scoop","apron","rugby_shirt"].includes(P),ce=P==="vest"?v:V,Ye=[A(K(ce,1.13)),A(ce),A(K(ce,.72))],He=[A(z),A(U),A(B)],Le=A(Ae(ce,T,.32)),fe=n.energy*5.5+Math.max(0,n.pitchSt)*.7,Ne=g&&n.bodyMotion&&!n.guideTravel&&s<n.bodyMotion.end,Ee=Ne&&n.bodyMotion.id==="wave",Ue=H&&S?.side===1?-1:1,ke=[];for(let u of[-1,1]){let d=o.armThick,m={x:u*(o.shoulderHalfW-d*.4),y:Q+d*.68},E={x:u*(o.shoulderHalfW+d*.5),y:C+o.torsoLen*.59},O={x:u*(o.hipHalfW+d*.75),y:ee-18},b="relaxed",Y=0;if(i.posture==="presenter"&&u===1?(O.x=o.chestHalfW*.68,O.y=G-17-fe,Y=.12,b="present"):i.posture==="confident"?(E.x=u*(o.waistHalfW+d*.42),E.y=C+o.torsoLen*.56,O.x=-u*o.chestHalfW*.27,O.y=C+o.torsoLen*.43+d*(u<0?-.6:.34)):i.posture==="welcoming"&&(O.x=u*(o.chestHalfW+d*1.52),O.y-=3+fe*.6),u===Ue&&!n.guideTravel&&(Ee||n.emote==="thumbsup")){let $=Ee?q((g.rightArmLift||0)/74,0,1):k("thumbUp"),pe=Ee&&g.rightWristBend||0;E.x+=(m.x+u*o.torsoLen*.21-E.x)*$,E.y+=(m.y+o.torsoLen*.19-E.y)*$,O.x+=(m.x+u*(o.torsoLen*.19+pe*.35)-O.x)*$,O.y+=(m.y-o.torsoLen*.26-O.y)*$,Y=pe*Math.PI/180,b=Ee?"wave":"thumbsup"}else if((Ne||n.guideTravel)&&!Ee){b="relaxed";let $=u===1?"right":"left",pe=Math.PI/180,Me=(g[$+"ArmLift"]||0)*pe,Ce=(g[$+"Shoulder"]||0)*pe,$e=(g[$+"Elbow"]||0)*pe,at=o.torsoLen*.43;if(E.x=m.x+u*at*Math.sin(Me+.13),E.y=m.y+at*Math.cos(Me)*Math.cos(Ce),O.x=E.x+u*at*.87*Math.sin(Me+$e*.36),O.y=E.y+at*.87*Math.cos(Me+$e*.36)*Math.cos(Ce+$e),n.guideTravel){let aa=N*at*Math.sin(Ce);E.x+=aa,O.x+=aa+N*at*.87*Math.sin(Ce+$e)}Y=(g[$+"WristBend"]||0)*pe}if(S?.side===u){let $=o.torsoLen*.72,pe=S.elevation,Me=m.x+u*$*.48*Math.cos(pe-.25),Ce=m.y-$*.48*Math.sin(pe-.25);E.x+=(Me-E.x)*S.weight,E.y+=(Ce-E.y)*S.weight,O.x+=(Me+u*$*.52*Math.cos(pe+.2)-O.x)*S.weight,O.y+=(Ce-$*.52*Math.sin(pe+.2)-O.y)*S.weight,Y=0,b=H?"point":"present"}if(me){let $={x:m.x*.56+E.x*.44,y:m.y*.56+E.y*.44};St(e,$,E,d*.66,d*.56,...He),St(e,m,$,d*.9,d*.8,...Ye,P==="rugby_shirt"?A(T):Le)}else St(e,m,E,d*.88,d*.71,...Ye),P==="track_jacket"&&(e.strokeStyle=A(T),e.lineWidth=d*.19,e.beginPath(),e.moveTo(m.x+u*d*.46,m.y),e.lineTo(E.x+u*d*.39,E.y),e.stroke());ke.push({elbow:E,wrist:O,dir:u,wristBend:Y,gesture:b})}let le=e.createLinearGradient(-o.shoulderHalfW,C,o.shoulderHalfW,ee);le.addColorStop(0,A(K(V,1.16))),le.addColorStop(.48,A(V)),le.addColorStop(1,A(K(V,.66)));let Se=["blazer","suit_tie","vest","cardigan","jacket"].includes(P),Ke=o.shoulderHalfW*(P==="vest"?.83:.98),D=u=>C+(G-C)*u/1.57,ct=D(Se?2.1:P==="field_overshirt"?1.96:1.57);if(e.fillStyle=le,e.beginPath(),e.moveTo(-o.neckHalfW-4,C-3),e.quadraticCurveTo(-Ke*.79,C-2,-Ke,Q),e.quadraticCurveTo(-Ke,Q+15,-o.chestHalfW,C+o.torsoLen*.32),e.bezierCurveTo(-o.chestHalfW+2,C+o.torsoLen*.5,-o.waistHalfW,G-12,-o.waistHalfW,G),e.quadraticCurveTo(-o.waistHalfW,(G+ee)*.5,-o.hipHalfW,ee),e.lineTo(o.hipHalfW,ee),e.quadraticCurveTo(o.waistHalfW,(G+ee)*.5,o.waistHalfW,G),e.bezierCurveTo(o.waistHalfW,G-12,o.chestHalfW-2,C+o.torsoLen*.5,o.chestHalfW,C+o.torsoLen*.32),e.quadraticCurveTo(Ke,Q+15,Ke,Q),e.quadraticCurveTo(Ke*.79,C-2,o.neckHalfW+4,C-3),e.quadraticCurveTo(0,C+14,-o.neckHalfW-4,C-3),e.closePath(),e.fill(),e.strokeStyle="rgba(255, 255, 255, 0.14)",e.lineWidth=1.3,e.stroke(),P!=="apron"&&Ka.some(({id:u})=>u===P)){let u=be(i.wardrobe?.bottomColor,Ae(V,[36,28,48],.42)),d=be(i.wardrobe?.bottomAccent,T),m=Math.max(o.hipHalfW,o.waistHalfW)+2;e.save(),e.clip(),e.fillStyle=A(u),e.fillRect(-m,ct,m*2,ee-ct),!Se&&P!=="field_overshirt"&&(e.fillStyle=A(Ae(u,d,.22)),e.fillRect(-m,G,m*2,D(1.7)-G)),e.restore()}function kt(u,d,m,E){let O=C+2,b=2*D(d)-O;e.fillStyle=te,e.beginPath(),e.moveTo(-u,O),e.quadraticCurveTo(-o.neckHalfW-6,C-1,-o.neckHalfW,C-5),e.lineTo(o.neckHalfW,C-5),e.quadraticCurveTo(o.neckHalfW+6,C-1,u,O),e.quadraticCurveTo(0,b,-u,O),e.closePath(),e.fill(),e.strokeStyle=m,e.lineWidth=E,e.beginPath(),e.moveTo(-u,O),e.quadraticCurveTo(0,b,u,O),e.stroke()}if(["rugby_shirt","track_jacket","field_overshirt"].includes(P)){e.save(),e.clip();let u=o.shoulderHalfW+8,d=A(T),m=A(Ae(V,v,.32));if(P==="rugby_shirt"){e.fillStyle=d;for(let E of[.43,1.04]){let O=D(E);e.fillRect(-u,O,2*u,D(E+.26)-O),e.fillRect(-u,D(E+.3),2*u,1.6)}}else if(P==="track_jacket"){e.strokeStyle=d,e.lineWidth=D(.135)-C,e.beginPath();let E=o.shoulderHalfW*.85;e.moveTo(-E,D(.38)),e.quadraticCurveTo(0,D(1.16),E,D(.38)),e.stroke(),e.fillStyle=A(K(V,.6)),e.fillRect(-1.8,C,3.6,G-C),e.fillStyle=A(Ae(T,[179,183,189],.42)),e.fillRect(-.8,C,1.6,G-C),e.fillStyle=d,e.fillRect(-1.9,D(.31),3.8,6),e.fillStyle=A(Ae(V,[51,45,67],.35)),e.fillRect(-u,D(1.47),2*u,G-D(1.47))}else{let E=o.chestHalfW*.52,O=D(.62);e.fillStyle=m,e.fillRect(-2.8,C,5.6,ct-C);for(let b of[-1,1]){let Y=b*o.chestHalfW*.54-E*.5;e.fillStyle=A(Ae(V,T,.2)),e.beginPath(),e.roundRect(Y,O,E,o.torsoLen*.17,[0,0,4,4]),e.fill(),e.fillStyle=A(K(V,.65)),e.fillRect(Y-.7,O,E+1.4,4.5)}e.fillStyle=A(Ae(V,[48,40,61],.5));for(let b=0;b<5;b++)e.beginPath(),e.arc(0,C+o.torsoLen*(.16+b*.135),1.9,0,Math.PI*2),e.fill()}if(P!=="track_jacket"){e.fillStyle=P==="rugby_shirt"?A(v):m;for(let E of[-1,1])e.beginPath(),e.moveTo(E*1.8,C+5),e.lineTo(E*(o.neckHalfW+5),C-3),e.lineTo(E*(o.neckHalfW+15),D(.15)),e.lineTo(E*o.neckHalfW*.98,D(.31)),e.closePath(),e.fill()}if(e.restore(),P==="rugby_shirt"){e.fillStyle=A(Ae(V,T,.65)),e.fillRect(-2.8,D(.09),5.6,D(.5)-D(.09)),e.fillStyle=d;for(let E of[.24,.37])e.beginPath(),e.arc(0,D(E),1.2,0,Math.PI*2),e.fill()}else P==="track_jacket"&&(e.strokeStyle=d,e.lineWidth=2,e.beginPath(),e.moveTo(-o.neckHalfW-2,C-3),e.quadraticCurveTo(0,C+7,o.neckHalfW+2,C-3),e.stroke())}else if(Se){let u=D(P==="suit_tie"?1.31:1.08),d=o.chestHalfW*.5,m=A(Ae(V,T,P==="jacket"?.58:.17));if(e.beginPath(),e.moveTo(-o.neckHalfW,C-4),e.quadraticCurveTo(-d*.99,C+3,-d,C+10),e.lineTo(0,u),e.lineTo(d,C+10),e.quadraticCurveTo(d*.99,C+3,o.neckHalfW,C-4),e.quadraticCurveTo(0,C+4,-o.neckHalfW,C-4),e.closePath(),e.fillStyle=A(v),e.fill(),e.strokeStyle=m,e.lineWidth=P==="cardigan"?3:1.5,e.lineJoin="round",e.stroke(),e.beginPath(),e.moveTo(0,u),e.lineTo(0,ct),e.stroke(),P==="blazer"||P==="suit_tie"){e.fillStyle=A(Ae(V,[214,212,231],.16));for(let E of[-1,1])e.beginPath(),e.moveTo(E*o.neckHalfW,C-4),e.lineTo(E*(d+13),D(.2)),e.lineTo(E*(d+4),D(.31)),e.lineTo(E*(d+11),D(.37)),e.lineTo(0,u),e.lineTo(E*d,C+10),e.closePath(),e.fill()}if(P==="suit_tie"&&i.neckwear!=="bowtie")e.fillStyle=A(T),e.beginPath(),e.moveTo(-5.8,D(.12)),e.lineTo(5.8,D(.12)),e.lineTo(3.5,D(.26)),e.lineTo(6.2,D(1.11)),e.lineTo(0,D(1.23)),e.lineTo(-6.2,D(1.11)),e.lineTo(-3.5,D(.26)),e.closePath(),e.fill();else if(P==="cardigan"){e.fillStyle=A(T);for(let E of[1.12,1.45,1.78])e.beginPath(),e.arc(.8,D(E),2.3,0,Math.PI*2),e.fill()}else if(P==="jacket"){e.strokeStyle=A(T),e.lineWidth=1.3;for(let E=D(.42);E<ct;E+=4){let O=d*Math.max(0,(u-E)/(u-C-10));for(let b of[-1,1])e.beginPath(),e.moveTo(b*O,E),e.lineTo(b*(O+2.2),E+.8),e.stroke()}}}else if(P==="turtleneck"||P==="hoodie"){let u=P==="hoodie",d=o.neckHalfW*(u?1.45:1.03),m=D(u?-.15:-.24);if(e.fillStyle=le,e.beginPath(),e.moveTo(-d,m),e.quadraticCurveTo(0,m+3.5,d,m),e.lineTo(d+(u?7:1),D(.11)),e.quadraticCurveTo(0,D(u?.23:.16),-d-(u?7:1),D(.11)),e.closePath(),e.fill(),e.strokeStyle=A(K(V,1.22)),e.lineWidth=1.5,e.beginPath(),e.moveTo(-d,m),e.quadraticCurveTo(0,m+3.5,d,m),e.stroke(),u){for(let E of[-1,1]){let O=o.chestHalfW*.3*E;e.strokeStyle=A(v),e.lineWidth=2,e.beginPath(),e.moveTo(O*1.16,D(.15)),e.quadraticCurveTo(O*.82,D(.53),O,D(.82)),e.stroke(),e.strokeStyle=A(T),e.lineWidth=2.6,e.beginPath(),e.moveTo(O*.94,D(.71)),e.lineTo(O,D(.82)),e.stroke()}e.fillStyle=A(Ae(V,[48,40,61],.27)),e.beginPath(),e.moveTo(-o.waistHalfW*.43,D(1.16)),e.lineTo(o.waistHalfW*.43,D(1.16)),e.lineTo(o.waistHalfW*.7,D(1.38)),e.lineTo(o.waistHalfW*.7,G),e.lineTo(-o.waistHalfW*.7,G),e.lineTo(-o.waistHalfW*.7,D(1.38)),e.closePath(),e.fill()}}else if(P==="sweater")kt(o.neckHalfW+2,.1,A(K(V,1.16)),3.2);else if(P==="polo"||P==="shirt"){let u=P==="shirt";e.fillStyle=A(Ae(V,[48,40,61],.27)),e.fillRect(-1.9,D(.19),3.8,D(u?1.57:.81)-D(.19)),e.fillStyle=A(v);for(let m of u?[.46,.71,.96,1.21,1.46]:[.46,.69])e.beginPath(),e.arc(0,D(m),1.55,0,Math.PI*2),e.fill();u&&(e.fillStyle=A(Ae(V,v,.2)),e.beginPath(),e.moveTo(-o.chestHalfW*.7,D(.61)),e.lineTo(-o.chestHalfW*.33,D(.61)),e.lineTo(-o.chestHalfW*.34,D(.84)),e.lineTo(-o.chestHalfW*.5,D(.91)),e.lineTo(-o.chestHalfW*.68,D(.84)),e.closePath(),e.fill());let d=Ae(V,T,.15);e.fillStyle=A(d),e.strokeStyle=A(Ae(d,T,.65)),e.lineWidth=1;for(let m of[-1,1])e.beginPath(),e.moveTo(0,D(.17)),e.lineTo(m*o.neckHalfW*.87,C-3),e.quadraticCurveTo(m*o.neckHalfW*1.68,C-1,m*o.chestHalfW*.64,D(.17)),e.lineTo(m*o.chestHalfW*.42,D(.34)),e.closePath(),e.fill(),e.beginPath(),e.moveTo(m*o.chestHalfW*.64,D(.17)),e.lineTo(m*o.chestHalfW*.42,D(.34)),e.stroke()}else if(P==="scoop"){let u=Math.min(o.shoulderHalfW*.79,o.chestHalfW*.81);kt(u,.56,A(K(V,1.22)),2),e.strokeStyle=A(X,.22),e.lineWidth=1.1;for(let d of[-1,1])e.beginPath(),e.moveTo(d*6,C+12),e.quadraticCurveTo(d*16,C+8.5,d*(u-5),C+6),e.stroke()}else if(P==="apron"){kt(o.neckHalfW+8,.26,A(K(V,.84)),2);let u=D(.48),d=o.chestHalfW*.5;e.strokeStyle=A(v),e.lineWidth=4.8,e.lineCap="round";for(let O of[-1,1])e.beginPath(),e.moveTo(O*(o.neckHalfW+2),C-1),e.lineTo(O*(d-3),u+2),e.stroke();let m=e.createLinearGradient(0,u,0,ee);m.addColorStop(0,A(v)),m.addColorStop(1,A(K(v,.8))),e.fillStyle=m,e.beginPath(),e.moveTo(-d,u),e.lineTo(d,u),e.quadraticCurveTo(d+4,G-10,o.waistHalfW+1,G+2),e.lineTo(o.hipHalfW,ee),e.lineTo(-o.hipHalfW,ee),e.lineTo(-o.waistHalfW-1,G+2),e.quadraticCurveTo(-d-4,G-10,-d,u),e.closePath(),e.fill();let E=o.chestHalfW*.3;e.fillStyle=A(Ae(v,V,.22)),e.beginPath(),e.moveTo(-E,D(.77)),e.lineTo(E,D(.77)),e.lineTo(E*.96,D(1.02)),e.lineTo(E*.7,D(1.11)),e.lineTo(-E*.7,D(1.11)),e.lineTo(-E*.96,D(1.02)),e.closePath(),e.fill(),e.fillStyle=A(T),e.beginPath(),e.rect(-E,D(.78),E*2,D(.82)-D(.78)),e.fill()}else P==="tee"?(kt(o.neckHalfW+8,.26,A(K(V,.78)),2.5),e.fillStyle=A(T,.94),e.beginPath(),e.arc(0,D(.78),10.5,0,Math.PI*2),e.fill(),e.fillStyle=A(v,.92),e.beginPath(),e.arc(0,D(.78),4.6,0,Math.PI*2),e.fill()):P==="cyber"&&(e.strokeStyle=A(T),e.lineWidth=2.4,e.beginPath(),e.moveTo(-o.chestHalfW*.7,D(.32)),e.lineTo(-o.chestHalfW*.2,D(.6)),e.lineTo(o.chestHalfW*.2,D(.6)),e.lineTo(o.chestHalfW*.7,D(.32)),e.stroke(),e.fillStyle=A(Ae(V,T,.44)),e.beginPath(),e.arc(0,D(.6),5.6,0,Math.PI*2),e.fill(),e.fillStyle=A(T,.85+n.voicing*.15),e.beginPath(),e.arc(0,D(.6),3.2,0,Math.PI*2),e.fill());i.nameBadge&&P!=="cyber"&&P!=="apron"&&(e.fillStyle=A(T),e.beginPath(),e.roundRect(o.chestHalfW*.37,D(.52),o.chestHalfW*.31,D(.62)-D(.52),1.9),e.fill());let ht=i.brooch||"none";if(ht!=="none"&&P!=="cyber"){let u=be(i.broochColor,[230,195,92]),d=-o.chestHalfW*.4,m=C+29;if(e.fillStyle=A(u),e.strokeStyle=A(K(u,.62),.8),e.lineWidth=.8,e.beginPath(),ht==="star"){for(let E=0;E<10;E++){let O=E%2?2.9:6.6,b=E/10*Math.PI*2-Math.PI/2;e[E?"lineTo":"moveTo"](d+Math.cos(b)*O,m+Math.sin(b)*O)}e.closePath()}else if(ht==="heart")e.moveTo(d,m+5.8),e.bezierCurveTo(d-9.5,m-.5,d-4.4,m-7.6,d,m-2.6),e.bezierCurveTo(d+4.4,m-7.6,d+9.5,m-.5,d,m+5.8);else if(ht==="flower")for(let E=0;E<5;E++){let O=E/5*Math.PI*2-Math.PI/2;e.moveTo(d+Math.cos(O)*3.9+3,m+Math.sin(O)*3.9),e.arc(d+Math.cos(O)*3.9,m+Math.sin(O)*3.9,3,0,Math.PI*2)}else e.arc(d,m,4.8,0,Math.PI*2);e.fill(),e.stroke(),e.fillStyle=ht==="flower"?A(K(u,.6)):"rgba(255, 255, 255, 0.55)",e.beginPath(),e.arc(ht==="flower"?d:d-1.4,ht==="flower"?m:m-1.6,ht==="flower"?2.2:1.2,0,Math.PI*2),e.fill()}let Mt=i.neckwear||"none";if(Mt!=="none"){let u=be(i.neckwearColor,[217,164,65]);if(Mt==="necklace")e.strokeStyle=A(u),e.lineWidth=1.2,e.beginPath(),e.moveTo(-o.neckHalfW+1.5,C-6),e.quadraticCurveTo(0,C+19,o.neckHalfW-1.5,C-6),e.stroke(),e.fillStyle=A(u),e.beginPath(),e.moveTo(0,C+9),e.quadraticCurveTo(4.4,C+14.5,0,C+18.5),e.quadraticCurveTo(-4.4,C+14.5,0,C+9),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.6)",e.beginPath(),e.arc(-1,C+12.6,1,0,Math.PI*2),e.fill();else if(Mt==="bowtie"){e.fillStyle=A(u);for(let d of[-1,1])e.beginPath(),e.moveTo(d*2,C+5.5),e.quadraticCurveTo(d*9,C-3.5,d*15,C-.5),e.lineTo(d*15,C+12),e.quadraticCurveTo(d*9,C+14.5,d*2,C+6.5),e.closePath(),e.fill();e.fillStyle=A(K(u,.74)),e.beginPath(),e.roundRect(-3.2,C+1.2,6.4,9.6,2.4),e.fill()}else if(Mt==="scarf"){let d=e.createLinearGradient(0,C-22,0,C+12);d.addColorStop(0,A(K(u,1.16))),d.addColorStop(1,A(K(u,.78))),e.fillStyle=d,e.beginPath(),e.moveTo(-o.neckHalfW-9,C-13),e.quadraticCurveTo(0,C-23,o.neckHalfW+9,C-13),e.quadraticCurveTo(o.neckHalfW+14,C+1,o.neckHalfW+6,C+9),e.quadraticCurveTo(0,C+19,-o.neckHalfW-6,C+9),e.quadraticCurveTo(-o.neckHalfW-14,C+1,-o.neckHalfW-9,C-13),e.closePath(),e.fill(),e.fillStyle=A(K(u,.88)),e.beginPath(),e.moveTo(4,C+8),e.lineTo(17,C+6),e.lineTo(21,C+52),e.lineTo(8,C+54),e.closePath(),e.fill(),e.strokeStyle=A(K(u,.62),.7),e.lineWidth=1;for(let m of[C-6,C+2])e.beginPath(),e.moveTo(-o.neckHalfW-7,m),e.quadraticCurveTo(0,m+8,o.neckHalfW+7,m),e.stroke()}else if(Mt==="lanyard"){let d=C+56;e.strokeStyle=A(u),e.lineWidth=2.4,e.lineCap="round";for(let m of[-1,1])e.beginPath(),e.moveTo(m*(o.neckHalfW+1),C-2),e.lineTo(0,d),e.stroke();e.fillStyle="#f8fafc",e.strokeStyle="rgba(15, 23, 42, 0.28)",e.lineWidth=.9,e.beginPath(),e.roundRect(-10,d-2,20,26,2.6),e.fill(),e.stroke(),e.fillStyle=A(u),e.fillRect(-10,d-2,20,6),e.fillStyle=A(U),e.beginPath(),e.arc(0,d+10,3.4,0,Math.PI*2),e.fill(),e.fillStyle="rgba(15, 23, 42, 0.5)",e.fillRect(-6,d+16.5,12,1.6),e.fillRect(-4,d+19.6,8,1.4)}}if(i.hairStyle==="braids"){e.save(),Je();for(let u of[-1,1]){let d=u*(o.headW-1.5)-ne*.3,m=8,E=C+54,O=Math.max(8,Math.round((E-m)/8.5));for(let Y=0;Y<O;Y++){let $=Y/(O-1),pe=m+(E-m)*$,Me=d+u*Math.sin($*2.2)*5+Math.sin(I*1.5+$*3)*.6,Ce=8.4-$*2.6,$e=(Y%2?1:-1)*.62;e.fillStyle=A(K(x,Y%2?.8:1.08)),e.beginPath(),e.ellipse(Me+(Y%2?1.4:-1.4),pe,Ce*.82,Ce*1.12,$e,0,Math.PI*2),e.fill(),e.strokeStyle=A(K(x,.56),.55),e.lineWidth=.8,e.stroke()}let b=d+u*Math.sin(2.2)*5;e.fillStyle=A(T),e.beginPath(),e.roundRect(b-4,E+1,8,4,2),e.fill(),e.fillStyle=A(K(x,.9)),e.beginPath(),e.moveTo(b-3.4,E+5),e.quadraticCurveTo(b,E+17,b+3.4,E+5),e.fill()}e.restore()}for(let{elbow:u,wrist:d,dir:m,wristBend:E,gesture:O}of ke){let b=o.armThick,Y=Math.atan2(u.x-d.x,d.y-u.y)+E,$=q(b/15,.78,1.28);St(e,u,d,b*(me?.57:.71),b*(me?.32:.45),...me?He:Ye,me?null:Le),P==="track_jacket"&&(e.strokeStyle=A(T),e.lineWidth=b*.17,e.beginPath(),e.moveTo(u.x+m*b*.39,u.y),e.lineTo(d.x+m*b*.25,d.y-1),e.stroke()),hn(e,d,Y,$,-m,O,...He)}if(e.save(),e.translate(ne*.35,oe+_e*.4),e.rotate(J),["side_sweep","quiff","pixie","buzz","updo_bun","ponytail","pigtails","space_buns","mohawk"].includes(i.hairStyle)){let u=e.createLinearGradient(0,-o.headH-28,0,18);if(u.addColorStop(0,A(K(x,1.15))),u.addColorStop(1,A(K(x,.62))),e.fillStyle=u,e.save(),Je(),i.hairStyle==="updo_bun"&&(e.beginPath(),e.arc(-ne*.35,-o.headH-12,20*o.headScale,0,Math.PI*2),e.fill()),i.hairStyle==="space_buns")for(let m of[-1,1])e.beginPath(),e.arc(m*o.headW*.7-ne*.35,-o.headH-8,15*o.headScale,0,Math.PI*2),e.fill();let d=i.hairStyle==="buzz"||i.hairStyle==="mohawk"?2.2:5.5;e.beginPath(),e.moveTo(-o.headW-d,-10),e.bezierCurveTo(-o.headW-d-4,-o.headH-14,o.headW+d+4,-o.headH-14,o.headW+d,-10),e.lineTo(o.headW-2,16),e.lineTo(-o.headW+2,16),e.closePath(),e.fill(),e.restore()}let ae=q(i.earSize??1,.65,1.45)*o.headScale;for(let u of[-1,1]){let d=u*(o.headW-.5)-ne*.42,m=-2;if(i.earStyle==="cyber"){e.fillStyle=A(V),e.strokeStyle=A(T,.85),e.lineWidth=1.6,e.beginPath(),e.roundRect(d-5*ae,m-14*ae,10*ae,28*ae,4*ae),e.fill(),e.stroke();continue}let E=e.createLinearGradient(d,m-16*ae,d,m+15*ae);E.addColorStop(0,A(z)),E.addColorStop(1,A(B)),e.fillStyle=E,e.beginPath(),i.earStyle==="pointed"?(e.moveTo(d-u*4*ae,m-11*ae),e.quadraticCurveTo(d+u*15*ae,m-22*ae,d+u*13*ae,m-4*ae),e.quadraticCurveTo(d+u*8*ae,m+14*ae,d-u*3*ae,m+14*ae),e.closePath()):e.ellipse(d,m,8.5*ae,15.8*ae,u*-.09,0,Math.PI*2),e.fill(),e.fillStyle=A(X,.34),e.beginPath(),e.ellipse(d-u*1.2*ae,m+1,4*ae,8.8*ae,u*-.08,0,Math.PI*2),e.fill()}let Rt=e.createRadialGradient(-14+ne*.3,-26*o.headScale,8,0,6,o.headH*1.48);Rt.addColorStop(0,A(z)),Rt.addColorStop(.54,A(U)),Rt.addColorStop(.88,A(B)),Rt.addColorStop(1,A(X));let Kt=(6+q(i.chinRoundness??.65,0,1)*15)*o.headScale;e.fillStyle=Rt,e.beginPath(),e.moveTo(-o.headW,-20*o.headScale),e.bezierCurveTo(-o.headW,-o.headH-4,o.headW,-o.headH-4,o.headW,-20*o.headScale),e.bezierCurveTo(o.cheekW+1.5,-2,o.cheekW,14*o.headScale,o.jawW+3,34*o.headScale+ue*.45),e.bezierCurveTo(o.jawW-4,48*o.headScale+ue*.78,Kt,it-.8,0,it+2.8),e.bezierCurveTo(-Kt,it-.8,-o.jawW+4,48*o.headScale+ue*.78,-o.jawW-3,34*o.headScale+ue*.45),e.bezierCurveTo(-o.cheekW,14*o.headScale,-o.cheekW-1.5,-2,-o.headW,-20*o.headScale),e.closePath(),e.fill(),e.strokeStyle=A(X,.28),e.lineWidth=1.25,e.stroke();let pt=i.earrings||"none";if(pt!=="none"&&i.earStyle!=="cyber"&&de!=="headscarf"){let u=be(i.earringColor,[230,195,92]);for(let d of[-1,1]){let m=d*(o.headW+2.2*ae)-ne*.42,E=11.5*ae;if(e.fillStyle=A(u),e.strokeStyle=A(u),pt==="studs")e.beginPath(),e.arc(m,E,2.5*ae,0,Math.PI*2),e.fill();else if(pt==="hoops")e.lineWidth=1.7*ae,e.beginPath(),e.arc(m+d*.8,E+6.5*ae,6*ae,0,Math.PI*2),e.stroke();else{let O=(n.lookX*1.8+k("shake")*Math.sin(I*13-.8)*3)*ae;e.lineWidth=1,e.beginPath(),e.moveTo(m,E),e.lineTo(m+O*.5,E+6*ae),e.stroke(),e.beginPath(),e.moveTo(m+O*.5,E+5*ae),e.quadraticCurveTo(m+O+3.6*ae,E+12*ae,m+O,E+14.5*ae),e.quadraticCurveTo(m+O-3.6*ae,E+12*ae,m+O*.5,E+5*ae),e.fill()}e.fillStyle="rgba(255, 255, 255, 0.55)",e.beginPath(),e.arc(m-.7*ae,E-.7*ae+(pt==="drops"?11*ae:0),.9*ae,0,Math.PI*2),e.fill()}}let Yt=e.createRadialGradient(-10+ne*.5,-34*o.headScale,2,-6+ne*.4,-32*o.headScale,29*o.headScale);Yt.addColorStop(0,`rgba(255, 248, 244, ${.26+F*.22})`),Yt.addColorStop(1,"rgba(255, 248, 244, 0)"),e.fillStyle=Yt,e.beginPath(),e.ellipse(-6+ne*.4,-32*o.headScale,28*o.headScale,15*o.headScale,-.1,0,Math.PI*2),e.fill(),e.save(),e.translate(ne*.65,_e*.6);let mt=n.lipS*3.6+Ie*3.2-k("frown")*4.4,_t=q(i.blushIntensity??.2,0,.65);if(_t>.01)for(let u of[-1,1]){let d=u*29*o.headScale,m=9*o.headScale-mt*.5,E=e.createRadialGradient(d,m,2,d,m,18*o.headScale);E.addColorStop(0,`rgba(232, 104, 116, ${_t})`),E.addColorStop(1,"rgba(232, 104, 116, 0)"),e.fillStyle=E,e.beginPath(),e.arc(d,m,18*o.headScale,0,Math.PI*2),e.fill()}let Ft=q(i.freckles??0,0,1);if(Ft>.02){e.fillStyle=A(K(U,.62,.5),.2+Ft*.42);let u=Math.round(Co.length*(.35+Ft*.65));for(let d=0;d<u;d++){let[m,E,O]=Co[d];e.beginPath(),e.arc(m*o.headScale,E*o.headScale-mt*.3,O*o.headScale,0,Math.PI*2),e.fill()}}let Ut=q(i.ageLines??0,0,1);if(Ut>.02){let u=o.headScale;e.strokeStyle=A(X,.16+Ut*.4),e.lineCap="round",e.lineWidth=.9+Ut*.5;for(let d of[-39,-45.5])e.beginPath(),e.moveTo(-17*u,d*u),e.quadraticCurveTo(0,(d-2.2)*u,17*u,d*u),e.stroke();for(let d of[-1,1]){for(let[m,E]of[[-3,5],[0,6],[3,5]])e.beginPath(),e.moveTo(d*35.5*u,(-12+m*.5)*u),e.lineTo(d*(35.5+E)*u,(-12+m*1.5)*u),e.stroke();e.beginPath(),e.moveTo(d*13*u,-4.5*u),e.quadraticCurveTo(d*22*u,-1.5*u,d*30*u,-5*u),e.stroke(),e.beginPath(),e.moveTo(d*12*u,12*u),e.quadraticCurveTo(d*23*u,21*u-mt*.4,d*25*u,33*u-mt*.6+ue*.3),e.stroke()}}i.beautyMark&&(e.fillStyle=A(K(X,.5),.82),e.beginPath(),e.arc(-17.5*o.headScale,24.5*o.headScale-mt*.5+ue*.2,1.25*o.headScale,0,Math.PI*2),e.fill());let vt=i.browColor?be(i.browColor,K(x,.85)):K(x,.85),tt=i.facialHair||"none";if(tt==="stubble"||tt==="beard"||tt==="goatee"){let u=tt==="stubble"?.22:.88;if(e.fillStyle=A(vt,u),e.beginPath(),tt==="goatee")e.ellipse(0,it-9,16*o.headScale,14*o.headScale,0,0,Math.PI*2);else{let d=14*o.headScale;e.moveTo(-o.cheekW+2,d),e.quadraticCurveTo(-o.jawW+6,28*o.headScale+ue*.3,-18*o.headScale,25*o.headScale+ue*.25),e.quadraticCurveTo(0,22*o.headScale+ue*.22,18*o.headScale,25*o.headScale+ue*.25),e.quadraticCurveTo(o.jawW-6,28*o.headScale+ue*.3,o.cheekW-2,d),e.bezierCurveTo(o.cheekW,28*o.headScale,o.jawW+2,46*o.headScale+ue*.75,0,it+3.5),e.bezierCurveTo(-o.jawW-2,46*o.headScale+ue*.75,-o.cheekW,28*o.headScale,-o.cheekW+2,d),e.closePath()}e.fill()}let Vt=s-n.blinkStartMs,ma=Vt>=0&&Vt<145?Math.sin(Vt/145*Math.PI):0,ye=q(i.eyeSize??1,.75,1.38)*o.headScale,y=21.5*q(i.eyeSpacing??1,.8,1.24)*o.headScale,_=q(i.eyeTilt??.04,-.3,.35),se=q(n.pitchSt*.85+n.energy*2.4+k("browUp")*5.2,-2.5,8.5),he=q(i.eyeshadow??0,0,1),ie=be(i.eyeshadowColor,[122,92,143]),Re=be(i.irisColor,[59,130,166]),ge=i.irisColor2?be(i.irisColor2,Re):Re,je=q(i.eyeliner??0,0,1);for(let u of[-1,1]){let d=u*y,m=-12.5*o.headScale,E=u===1?k("wink")*.94:0,O=Math.max(ma,E,k("shut")*.96),b=Math.max(.55,6.2*ye*(1+Pe*.34)*(1-O*.94)),Y=11.4*ye,$=-_*5.5,pe=u===1?ge:Re,Me=e.createRadialGradient(d,m-1,2,d,m-1,15*ye);if(Me.addColorStop(0,A(X,.18)),Me.addColorStop(1,A(X,0)),e.fillStyle=Me,e.beginPath(),e.ellipse(d,m-1,15*ye,11*ye,0,0,Math.PI*2),e.fill(),he>.02){let va=e.createLinearGradient(d,m-b*1.5-7.5*ye,d,m-b*.6);va.addColorStop(0,A(ie,0)),va.addColorStop(1,A(ie,.3+he*.5)),e.fillStyle=va,e.beginPath(),e.moveTo(d-u*(Y+.5),m+.4),e.quadraticCurveTo(d-u*2,m-b*1.5-8.5*ye,d+u*(Y+3.2),m-1.2+$),e.quadraticCurveTo(d,m-b*1.46,d-u*(Y+.5),m+.4),e.closePath(),e.fill()}e.strokeStyle=A(X,.36),e.lineWidth=1.05,e.beginPath(),e.moveTo(d-u*Y*.92,m-2.8-b*.52),e.quadraticCurveTo(d,m-5.8-b*.85,d+u*Y*.95,m-2.6-b*.52+$*.6),e.stroke(),e.save(),e.beginPath(),e.moveTo(d-u*Y,m+.6),e.quadraticCurveTo(d,m-b*1.46,d+u*Y,m+.4+$),e.quadraticCurveTo(d,m+b*1.16,d-u*Y,m+.6),e.closePath();let Ce=e.createLinearGradient(d,m-b,d,m+b);Ce.addColorStop(0,"#d6dce8"),Ce.addColorStop(.35,"#f9fafe"),Ce.addColorStop(1,"#ebeff7"),e.fillStyle=Ce,e.fill(),e.clip();let $e=d+n.lookX*3.2*ye,at=m+n.lookY*2.1*ye,aa=5.6*ye,Ea=e.createRadialGradient($e-1.2*ye,at-1.4*ye,.7*ye,$e,at,aa);Ea.addColorStop(0,A(K(pe,1.38))),Ea.addColorStop(.68,A(pe)),Ea.addColorStop(1,A(K(pe,.36))),e.fillStyle=Ea,e.beginPath(),e.arc($e,at,aa,0,Math.PI*2),e.fill(),e.fillStyle="#090c14",e.beginPath(),e.arc($e,at,2.45*ye,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.95)",e.beginPath(),e.arc($e-1.8*ye,at-1.9*ye,1.45*ye,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.56)",e.beginPath(),e.arc($e+1.9*ye,at+1.5*ye,.78*ye,0,Math.PI*2),e.fill(),e.restore();let ga=i.lashStyle||"classic";e.strokeStyle="#17141f",e.lineWidth=(ga==="lush"?2.45:ga==="classic"?1.95:1.55)*Math.sqrt(ye),e.lineCap="round",e.beginPath(),e.moveTo(d-u*(Y+.3),m+.6),e.quadraticCurveTo(d,m-b*1.48,d+u*(Y+(ga==="lush"?1.9:.4)),m+.3+$-(ga==="lush"?1:0)),e.stroke(),je>.02&&(e.strokeStyle=`rgba(23, 20, 31, ${.6+je*.4})`,e.lineWidth=(1.2+je*1.5)*Math.sqrt(ye),e.beginPath(),e.moveTo(d+u*(Y-3),m-.6+$*.8),e.quadraticCurveTo(d+u*(Y+1.5),m-.2+$,d+u*(Y+2.6+je*3.6),m-1.4-je*3+$),e.stroke());let Jr=q(i.browThickness??1,.5,1.65),So=q(i.browArch??.2,-.2,.6)*10,oa=m-(12.8+se)*o.headScale,bo=3*Jr*o.headScale,Ho=-rt*3.6*o.headScale,Qr=rt*1.5*o.headScale;e.fillStyle=A(vt),e.beginPath(),e.moveTo(d-u*(Y+.5),oa+1.8+Ho),e.quadraticCurveTo(d+u*2,oa-3-So,d+u*(Y+2.4),oa+1.5+Qr),e.quadraticCurveTo(d+u*2,oa-3-So+bo,d-u*Y,oa+1.8+bo*.82+Ho),e.closePath(),e.fill()}let wt=q(i.noseLength??1,.76,1.28)*o.headScale,we=q(i.noseWidth??1,.72,1.35)*o.headScale,ve=10.2*wt,Ct=e.createLinearGradient(-7*we,-13,6*we,ve+3);Ct.addColorStop(0,A(X,.05)),Ct.addColorStop(1,A(X,.26)),e.fillStyle=Ct,e.beginPath(),e.moveTo(1,-13*o.headScale),e.quadraticCurveTo(6.5*we,1,9.2*we,ve-.6),e.quadraticCurveTo(3*we,ve+4.2,0,ve+3.2),e.closePath(),e.fill(),e.fillStyle=A(X,.3),e.beginPath(),e.moveTo(-9.2*we,ve),e.quadraticCurveTo(0,ve+5.8,9.2*we,ve),e.quadraticCurveTo(0,ve+3,-9.2*we,ve),e.closePath(),e.fill(),e.fillStyle="rgba(56, 24, 20, 0.62)";for(let u of[-1,1])e.beginPath(),e.ellipse(u*4.5*we,ve+1.1,2.2*we,1.1,u*-.28,0,Math.PI*2),e.fill();if(i.noseStud){let u=be(i.earringColor,[230,195,92]);e.fillStyle=A(u),e.beginPath(),e.arc(7.4*we,ve-2.2,1.35,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.75)",e.beginPath(),e.arc(7*we,ve-2.6,.5,0,Math.PI*2),e.fill()}e.strokeStyle=A(X,.38),e.lineWidth=1.2,e.beginPath(),e.arc(-6.3*we,ve-.5,3.2*we,Math.PI*.55,Math.PI*1.45),e.stroke(),e.beginPath(),e.arc(6.3*we,ve-.5,3.2*we,-Math.PI*.45,Math.PI*.45),e.stroke(),e.strokeStyle="rgba(255, 246, 240, 0.38)",e.lineWidth=2.1,e.lineCap="round",e.beginPath(),e.moveTo(-.8,-10*o.headScale),e.lineTo(-.9,ve-4.4),e.stroke(),e.fillStyle="rgba(255, 246, 240, 0.35)",e.beginPath(),e.ellipse(-.5,ve-1.4,3.1*we,2.3,0,0,Math.PI*2),e.fill(),e.fillStyle=A(X,.14),e.beginPath(),e.ellipse(0,(ve+29*o.headScale)*.5,2.6,4.6*o.headScale,0,0,Math.PI*2),e.fill();let xt=30.8*o.headScale+ue*.3,Qe=q(i.mouthWidth??1,.76,1.3)*o.headScale,ea=q(i.lipFullness??1,.65,1.52)*o.headScale,ft=n.phone==="F"||n.phone==="V",ta=n.lipR,Ua=n.lipS,Xr=ft?Math.min(.68,n.lipC):n.lipC,Oe=(20.2+Ua*8.6-ta*7+Ie*1.8-k("frown")*1.2)*Qe,yo=(1.1+n.jaw*21)*(1-Xr*.97)*o.headScale,It=Math.max(ft?2.6*o.headScale:.24,yo),ze=xt-mt*.85+ta*1.4,Ze=xt-It*.44,dt=xt+It*.56,qt=((ft?4.1:5.6)+ta*2.4-Ua*.8)*ea,zt=(4.4+ta*2.1-Ua*.7)*ea;if(e.fillStyle=A(X,.24),e.beginPath(),e.ellipse(0,dt+qt+3,Oe*.52,2.3,0,0,Math.PI*2),e.fill(),It>.78){e.save(),e.beginPath(),e.moveTo(-Oe+1.4,ze),e.quadraticCurveTo(0,Ze-2.1,Oe-1.4,ze),e.quadraticCurveTo(0,dt+2.4,-Oe+1.4,ze),e.closePath(),e.clip();let u=e.createLinearGradient(0,Ze-4,0,dt+6);u.addColorStop(0,"#1c0b12"),u.addColorStop(.55,"#361320"),u.addColorStop(1,"#1d0911"),e.fillStyle=u,e.fillRect(-Oe-4,Ze-8,Oe*2+8,It+18);let d=Math.max(n.tH*.72,n.tTip*.96),m=dt+2-d*(It*.88+3.4*o.headScale),E=Oe*(n.tTip>.6?.58:.78),O=e.createRadialGradient(0,m+5,2,0,m+8,E);O.addColorStop(0,"#f5879b"),O.addColorStop(1,"#b84962"),e.fillStyle=O,e.beginPath(),e.ellipse(0,m+8,E,9.5*o.headScale,0,Math.PI,Math.PI*2),e.fill();let b=Oe*.78,Y=Ze+(3.6-ta*1.1)*o.headScale;e.fillStyle="#f7f6f1",e.beginPath(),e.roundRect(-b,Ze-5,b*2,Math.max(1,Y-(Ze-5)),2.2),e.fill(),e.strokeStyle="rgba(155, 148, 138, 0.34)",e.lineWidth=.7;for(let $ of[-b*.48,0,b*.48])e.beginPath(),e.moveTo($,Ze-4),e.lineTo($,Y),e.stroke();if(It>5.4*o.headScale&&!ft){let $=dt-2.3*o.headScale+n.jaw*1.3;e.fillStyle="#eae8e1",e.beginPath(),e.roundRect(-b*.88,$,b*1.76,6*o.headScale,1.8),e.fill()}e.restore()}let fo=be(i.lipColor,[214,104,124]);e.fillStyle=A(K(fo,.82)),e.beginPath(),e.moveTo(-Oe,ze),e.bezierCurveTo(-Oe*.55,Ze-zt,-5.2*Qe,Ze-zt-1.6,0,Ze-zt+.9),e.bezierCurveTo(5.2*Qe,Ze-zt-1.6,Oe*.55,Ze-zt,Oe,ze),e.quadraticCurveTo(0,Ze-(It<.9?0:1.5),-Oe,ze),e.closePath(),e.fill();let jt=ft?-1.8*o.headScale:0;e.fillStyle=A(fo),e.beginPath(),e.moveTo(-Oe,ze),e.quadraticCurveTo(0,dt+(It<.9?.2:1.7)+jt,Oe,ze),e.bezierCurveTo(Oe*.62,dt+qt+jt,-Oe*.62,dt+qt+jt,-Oe,ze),e.closePath(),e.fill(),e.strokeStyle="rgba(255, 238, 242, 0.40)",e.lineWidth=1.45,e.beginPath(),e.moveTo(-7.2*Qe,dt+qt*.48+jt),e.quadraticCurveTo(0,dt+qt*.64+jt,7.2*Qe,dt+qt*.48+jt),e.stroke();for(let u of[-1,1])e.fillStyle="rgba(68, 20, 32, 0.42)",e.beginPath(),e.arc(u*(Oe+.35),ze,1.45,0,Math.PI*2),e.fill();let Io=q(i.dimples??0,0,1);if(Io>.02){e.strokeStyle=A(X,(.18+Io*.34)*q(.65+mt*.1,.6,1.25)),e.lineWidth=1.3,e.lineCap="round";for(let u of[-1,1]){let d=u*(Oe+5.4*o.headScale);e.beginPath(),e.moveTo(d-u*.6,ze-4.4*o.headScale),e.quadraticCurveTo(d+u*2.8,ze,d-u*.4,ze+4.8*o.headScale),e.stroke()}}if(It<1.25&&(e.strokeStyle="rgba(68, 20, 32, 0.66)",e.lineWidth=1.35,e.beginPath(),e.moveTo(-Oe+1,ze),e.quadraticCurveTo(0,xt+.4,Oe-1,ze),e.stroke()),tt==="mustache"||tt==="beard"||tt==="goatee"){e.fillStyle=A(K(vt,.97)),e.beginPath();let u=Ze-zt-2.2;e.moveTo(0,u-2.6),e.quadraticCurveTo(Oe*.65,u-3.6,Oe+2,ze-1.5),e.quadraticCurveTo(Oe*.55,u+2.2,0,u+.8),e.quadraticCurveTo(-Oe*.55,u+2.2,-Oe-2,ze-1.5),e.quadraticCurveTo(-Oe*.65,u-3.6,0,u-2.6),e.closePath(),e.fill()}let xe=i.glasses||"none";if(xe!=="none"){let u=be(i.glassesColor,[31,36,48]),d=-11.5*o.headScale,m=16.5*ye,E=11.8*ye;if(xe==="visor"){let O=e.createLinearGradient(-y-m,d-E,y+m,d+E);O.addColorStop(0,A(u,.58)),O.addColorStop(.5,"rgba(255, 255, 255, 0.35)"),O.addColorStop(1,A(u,.62)),e.fillStyle=O,e.strokeStyle=A(u,.95),e.lineWidth=1.8,e.beginPath(),e.roundRect(-y-m,d-E*.85,(y+m)*2,E*1.75,8),e.fill(),e.stroke()}else{let O=xe==="shades";e.strokeStyle=A(u),e.lineWidth=xe==="bold"?3:xe==="cat_eye"?2.6:xe==="round"||xe==="aviator"?1.5:2.2;for(let b of[-1,1]){let Y=b*y;e.fillStyle=O?A(u,.72):xe==="aviator"?"rgba(120, 150, 170, 0.34)":"rgba(220, 238, 255, 0.11)",e.beginPath(),xe==="round"?e.arc(Y,d,m*.86,0,Math.PI*2):xe==="cat_eye"?(e.moveTo(Y-b*m*.9,d-E*.5),e.quadraticCurveTo(Y,d-E*.86,Y+b*m*1.12,d-E*1.02),e.quadraticCurveTo(Y+b*m*1.02,d+E*.5,Y+b*m*.3,d+E*.78),e.quadraticCurveTo(Y-b*m*.86,d+E*.8,Y-b*m*.9,d-E*.5),e.closePath()):xe==="aviator"?(e.moveTo(Y-b*m*.88,d-E*.62),e.quadraticCurveTo(Y,d-E*.9,Y+b*m*.98,d-E*.6),e.quadraticCurveTo(Y+b*m*1.04,d+E*.6,Y+b*m*.2,d+E*1),e.quadraticCurveTo(Y-b*m*.84,d+E*.86,Y-b*m*.88,d-E*.62),e.closePath()):e.roundRect(Y-m*.92,d-E*.82,m*1.84,E*1.64,xe==="bold"?4.5:6),e.fill(),e.stroke()}e.beginPath(),e.moveTo(-y+m*(xe==="round"?.84:.9),d-1.5),e.quadraticCurveTo(0,d-4.2,y-m*(xe==="round"?.84:.9),d-1.5),e.stroke()}}e.restore();let Fe=i.hairStyle||"side_sweep";if(Fe!=="none"){let u=["long_waves","sleek_bob","shoulder_lob","long_straight","braids"].includes(Fe),d=Fe==="quiff"||Fe==="side_sweep"||Fe==="pixie",m=Fe==="quiff"?-1.38:Fe==="pixie"?-1.18:-1.24,E=e.createLinearGradient(-26,-o.headH-24,26,-10);if(E.addColorStop(0,A(Ae(x,We,.32))),E.addColorStop(.53,A(x)),E.addColorStop(1,A(K(x,.66))),e.fillStyle=E,e.save(),Je(),e.beginPath(),u){let O=Fe==="sleek_bob"?36*o.headScale:Fe==="long_straight"?31*o.headScale:24*o.headScale;e.moveTo(-o.headW-7,-8),e.bezierCurveTo(-o.headW-13,-o.headH-25,o.headW+13,-o.headH-25,o.headW+7,-8),e.quadraticCurveTo(o.headW+4,14,o.headW-.5,O),e.bezierCurveTo(o.headW-1,-o.headH*.67,o.headW*.38,-o.headH*.48,-o.headW*.14,-o.headH*.84),e.bezierCurveTo(-o.headW*.28,-o.headH*.58,-o.headW*.91,-o.headH*.6,-o.headW+.5,O),e.quadraticCurveTo(-o.headW-4,14,-o.headW-7,-8)}else if(d)e.save(),e.scale(o.headW,o.headH),e.moveTo(-1.02,.08),e.bezierCurveTo(-1.18,-.62,-.85,m,-.23,m),e.bezierCurveTo(.46,m-.04,1.18,-.88,1.04,-.08),e.lineTo(.96,.12),e.quadraticCurveTo(.94,-.13,.76,-.37),e.quadraticCurveTo(.82,-.23,.79,-.18),e.bezierCurveTo(.62,-.46,.11,-.67,-.24,-.72),e.quadraticCurveTo(-.43,-.7,-.68,-.54),e.quadraticCurveTo(-.87,-.41,-.94,.06),e.restore();else if(Fe==="curly_halo"||Fe==="afro"){let O=Fe==="afro"?1.7:1;e.moveTo(-o.headW-11*O,-6),e.bezierCurveTo(-o.headW-22*O,-o.headH-28*O,o.headW+22*O,-o.headH-28*O,o.headW+11*O,-6),e.quadraticCurveTo(o.headW-4,-36*o.headScale,18,-44*o.headScale),e.quadraticCurveTo(0,-39*o.headScale,-18,-44*o.headScale),e.quadraticCurveTo(-o.headW+4,-36*o.headScale,-o.headW-11*O,-6)}else if(Fe==="buzz")e.fillStyle=A(x,.72),e.moveTo(-o.headW-1.5,-12),e.bezierCurveTo(-o.headW-4,-o.headH-8,o.headW+4,-o.headH-8,o.headW+1.5,-12),e.quadraticCurveTo(o.headW-5,-42*o.headScale,0,-46*o.headScale),e.quadraticCurveTo(-o.headW+5,-42*o.headScale,-o.headW-1.5,-12);else if(Fe==="mohawk"){e.fillStyle=A(x,.55),e.moveTo(-o.headW-1.5,-12),e.bezierCurveTo(-o.headW-4,-o.headH-8,o.headW+4,-o.headH-8,o.headW+1.5,-12),e.quadraticCurveTo(o.headW-5,-42*o.headScale,0,-46*o.headScale),e.quadraticCurveTo(-o.headW+5,-42*o.headScale,-o.headW-1.5,-12),e.closePath(),e.fill(),e.fillStyle=E;let O=o.headW*.3,b=-o.headH-31;e.beginPath(),e.moveTo(-O,-43*o.headScale),e.bezierCurveTo(-O-5,-o.headH-6,-O-1,b+8,-O*.45,b),e.quadraticCurveTo(1,b-6,O*.6,b+3),e.bezierCurveTo(O+4,b+10,O+5,-o.headH-6,O,-43*o.headScale),e.quadraticCurveTo(0,-49*o.headScale,-O,-43*o.headScale)}else e.moveTo(-o.headW-5,-10),e.bezierCurveTo(-o.headW-10,-o.headH-15,-20,-o.headH-22,6,-o.headH-19),e.bezierCurveTo(32,-o.headH-16,o.headW+10,-o.headH-10,o.headW+5,-10),e.lineTo(o.headW,5),e.lineTo(o.headW-4,5),e.quadraticCurveTo(o.headW-4.5,-24,o.headW-10,-38*o.headScale),e.bezierCurveTo(o.headW*.6,-o.headH*.67,o.headW*.46,-o.headH*.67,o.headW*.31,-o.headH*.82),e.quadraticCurveTo(o.headW*.05,-o.headH*.6,-o.headW*.55,-o.headH*.65),e.bezierCurveTo(-36,-45*o.headScale,-o.headW+6,-30,-o.headW+4,5),e.lineTo(-o.headW,5);if(e.closePath(),e.fill(),Fe!=="buzz"&&Fe!=="mohawk"){if(e.save(),e.clip(),e.scale(o.headW,o.headH),e.fillStyle=A(Ae(x,We,.4),.72),et){e.fillStyle=A(Ae(x,We,.29),.6);for(let[O,b,Y]of[[-.84,-.6,-.8],[-.65,-.91,-.45],[-.36,-1.02,-.29],[.16,-1.02,.22],[.46,-.88,.52],[.76,-.75,.8]])e.save(),e.translate(O,b),e.rotate(Y),e.beginPath(),e.moveTo(-.15,.04),e.bezierCurveTo(-.12,-.06,.04,-.13,.15,-.025),e.bezierCurveTo(.06,-.06,-.005,-.055,-.15,.04),e.fill(),e.restore()}else if(d)for(let[O,b]of[[-.92,-.24],[-.69,-.54],[.36,-.52],[.76,-.36],[.99,-.12]]){let Y=-.38+O*.08;e.beginPath(),e.moveTo(Y,m+.09),e.bezierCurveTo(Y+O*.26,m+.37,O*.8,b-.24,O,b),e.bezierCurveTo(O*.72,b-.28,Y+O*.16,m+.48,Y,m+.09),e.fill()}else{let O=u?-.14:.31,b=u?-1.09:-1.25;for(let Y of[-1,1])e.beginPath(),e.moveTo(O,b+.06),e.bezierCurveTo(O+Y*.36,b-.06,Y*1.01,-.86,Y*1.02,-.19),e.bezierCurveTo(Y*.91,-.85,O+Y*.35,b+.09,O,b+.06),e.fill(),e.beginPath(),e.moveTo(O,b+.13),e.bezierCurveTo(O+Y*.19,b+.26,Y*.83,-.83,Y*.96,-.43),e.bezierCurveTo(Y*.72,-.76,O+Y*.16,b+.31,O,b+.13),e.fill()}e.restore()}if(i.fringe&&Fe!=="buzz"&&Fe!=="mohawk"){let O=-o.headH*.82,b=-35*o.headScale,Y=o.headW-3;e.beginPath(),e.moveTo(-Y-2,O+10),e.quadraticCurveTo(0,O-6,Y+2,O+10),e.lineTo(Y,b+1);for(let $=5;$>=-5;$--)e.lineTo($/5*Y,b+($%2?2.2:0)+Math.abs($)*.35);e.closePath(),e.fill()}e.restore()}if(de!=="none"){let u=be(i.headwearColor,[180,69,47]),d=-o.headH*.56,m=o.headW+(de==="headband"?5.5:7.5);if(de==="headband")e.strokeStyle=A(u),e.lineWidth=6.5*o.headScale,e.lineCap="round",e.beginPath(),e.moveTo(-m+1,d+8),e.quadraticCurveTo(0,d-15,m-1,d+8),e.stroke(),e.strokeStyle="rgba(255, 255, 255, 0.22)",e.lineWidth=1.4,e.beginPath(),e.moveTo(-m+5,d+4),e.quadraticCurveTo(0,d-17.5,m-5,d+4),e.stroke();else if(de==="beret"){let E=e.createLinearGradient(-m,-o.headH-26,m,d+8);E.addColorStop(0,A(K(u,1.18))),E.addColorStop(1,A(K(u,.72))),e.fillStyle=E,e.beginPath(),e.moveTo(-m+1,d+6),e.bezierCurveTo(-m-20,d-12,-o.headW*.9,-o.headH-30,-4,-o.headH-24),e.bezierCurveTo(o.headW*.9,-o.headH-19,m+9,d-12,m-1,d+6),e.quadraticCurveTo(0,d-6,-m+1,d+6),e.closePath(),e.fill(),e.fillStyle=A(K(u,.66)),e.beginPath(),e.moveTo(-m+1,d+6),e.quadraticCurveTo(0,d-6,m-1,d+6),e.quadraticCurveTo(0,d-1.5,-m+1,d+6),e.fill(),e.strokeStyle=A(K(u,.7)),e.lineWidth=2.2,e.lineCap="round",e.beginPath(),e.moveTo(-7,-o.headH-25),e.lineTo(-9.5,-o.headH-30.5),e.stroke()}else if(de==="headphones"){e.strokeStyle=A(K(u,.9)),e.lineWidth=5.2*o.headScale,e.lineCap="round",e.beginPath(),e.moveTo(-o.headW-5,-8),e.bezierCurveTo(-o.headW-9,-o.headH-22,o.headW+9,-o.headH-22,o.headW+5,-8),e.stroke();for(let E of[-1,1]){let O=E*(o.headW+3.5)-ne*.42,b=e.createLinearGradient(O-7,-18,O+7,14);b.addColorStop(0,A(K(u,1.2))),b.addColorStop(1,A(K(u,.68))),e.fillStyle=b,e.beginPath(),e.roundRect(O-7.5,-18,15,33,7),e.fill(),e.fillStyle="rgba(15, 23, 42, 0.5)",e.beginPath(),e.roundRect(O-E*6.5-2,-14,4,25,2),e.fill()}}else if(de==="bow"){e.save(),e.translate(o.headW*.5,-o.headH-7),e.rotate(.3);for(let E of[-1,1]){let O=e.createLinearGradient(0,-10,E*18,10);O.addColorStop(0,A(K(u,.8))),O.addColorStop(1,A(K(u,1.16))),e.fillStyle=O,e.beginPath(),e.moveTo(0,0),e.bezierCurveTo(E*6,-13,E*20,-12,E*18,0),e.bezierCurveTo(E*20,12,E*6,13,0,0),e.fill()}e.fillStyle=A(K(u,.68)),e.beginPath(),e.roundRect(-3.8,-4.8,7.6,9.6,2.6),e.fill(),e.restore()}else if(de==="flower"){let E=-o.headW*.86,O=-o.headH*.5;e.fillStyle=A(u),e.strokeStyle=A(K(u,.7),.7),e.lineWidth=.7;for(let b=0;b<5;b++){let Y=b/5*Math.PI*2-Math.PI/2;e.beginPath(),e.ellipse(E+Math.cos(Y)*6.4,O+Math.sin(Y)*6.4,5.4,3.7,Y,0,Math.PI*2),e.fill(),e.stroke()}e.fillStyle="#f2c94c",e.beginPath(),e.arc(E,O,3.2,0,Math.PI*2),e.fill()}else if(de==="tiara"){let E=-o.headH*.93,O=o.headW*.64;e.fillStyle=A(u),e.strokeStyle=A(K(u,.66),.85),e.lineWidth=.8,e.beginPath(),e.moveTo(-O,E+5),e.quadraticCurveTo(0,E-4,O,E+5),e.lineTo(O-1,E+9),e.quadraticCurveTo(0,E,-O+1,E+9),e.closePath(),e.fill(),e.stroke();for(let[b,Y]of[[-O*.5,7.5],[0,12.5],[O*.5,7.5]]){let $=b===0?E+.5:E+1.6;e.beginPath(),e.moveTo(b-4.6,$+1.6),e.lineTo(b,$-Y),e.lineTo(b+4.6,$+1.6),e.closePath(),e.fill(),e.stroke()}e.fillStyle=A(T),e.beginPath(),e.arc(0,E-5.4,2.5,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.75)",e.beginPath(),e.arc(-.8,E-6.2,.8,0,Math.PI*2),e.fill()}else if(de==="fedora"){let E=d+5,O=o.headW+25,b=-o.headH-31,Y=e.createLinearGradient(-m,b,m,E);Y.addColorStop(0,A(K(u,1.18))),Y.addColorStop(1,A(K(u,.74))),e.fillStyle=Y,e.beginPath(),e.moveTo(-m+2,E),e.bezierCurveTo(-m-2,b+14,-o.headW*.62,b,-8,b+3),e.quadraticCurveTo(0,b+9,8,b+3),e.bezierCurveTo(o.headW*.62,b,m+2,b+14,m-2,E),e.closePath(),e.fill(),e.fillStyle=A(K(u,.48)),e.beginPath(),e.moveTo(-m+1,E-10),e.quadraticCurveTo(0,E-18,m-1,E-10),e.lineTo(m-2,E),e.quadraticCurveTo(0,E-9,-m+2,E),e.closePath(),e.fill();let $=e.createLinearGradient(0,E-10,0,E+6);$.addColorStop(0,A(K(u,1.06))),$.addColorStop(1,A(K(u,.6))),e.fillStyle=$,e.beginPath(),e.moveTo(-O,E+4),e.quadraticCurveTo(0,E-15,O,E+4),e.quadraticCurveTo(0,E-2,-O,E+4),e.closePath(),e.fill()}else if(de==="chef"){let E=d-17,O=-o.headH-46,b=e.createLinearGradient(-m,O,m,d+6);b.addColorStop(0,A(K(u,1.08))),b.addColorStop(1,A(K(u,.84))),e.fillStyle=b,e.beginPath(),e.moveTo(-m+2,E+2),e.bezierCurveTo(-m-22,E-6,-m-14,O+6,-o.headW*.42,O+6),e.bezierCurveTo(-o.headW*.3,O-8,o.headW*.3,O-8,o.headW*.42,O+6),e.bezierCurveTo(m+14,O+6,m+22,E-6,m-2,E+2),e.closePath(),e.fill(),e.strokeStyle=A(K(u,.66),.55),e.lineWidth=1;for(let Y of[-.5,0,.5])e.beginPath(),e.moveTo(Y*m,E-5+Math.abs(Y)*4),e.quadraticCurveTo(Y*m*1.25,O+26,Y*m*1.05,O+14),e.stroke();e.fillStyle=A(K(u,.93)),e.beginPath(),e.moveTo(-m+1,d+6),e.lineTo(-m+2,E),e.quadraticCurveTo(0,E-9,m-2,E),e.lineTo(m-1,d+6),e.quadraticCurveTo(0,d-5,-m+1,d+6),e.closePath(),e.fill(),e.stroke()}else if(de==="headscarf"){let E=-o.headH*.64,O=-o.headH*1.36-10,b=it+1,Y=o.cheekW*.93,$=e.createLinearGradient(-m,-o.headH-12,m,b+16);$.addColorStop(0,A(K(u,1.16))),$.addColorStop(.6,A(u)),$.addColorStop(1,A(K(u,.74))),e.fillStyle=$,e.beginPath(),e.moveTo(-o.headW-8,4),e.bezierCurveTo(-o.headW-13,O,o.headW+13,O,o.headW+8,4),e.bezierCurveTo(o.headW+9,34,o.jawW+12,b+6,o.neckHalfW+15,b+20),e.lineTo(-o.neckHalfW-15,b+20),e.bezierCurveTo(-o.jawW-12,b+6,-o.headW-9,34,-o.headW-8,4),e.closePath(),e.moveTo(0,E),e.bezierCurveTo(-Y*1.02,E,-Y*1.04,b-14,0,b),e.bezierCurveTo(Y*1.04,b-14,Y*1.02,E,0,E),e.closePath(),e.fill("evenodd"),e.strokeStyle=A(K(u,.66),.6),e.lineWidth=1.1,e.beginPath(),e.moveTo(-o.headW*.5,-o.headH*.93),e.quadraticCurveTo(-o.headW-1,-o.headH*.5,-o.headW-2,14),e.moveTo(o.headW*.5,-o.headH*.93),e.quadraticCurveTo(o.headW+1,-o.headH*.5,o.headW+2,14),e.stroke()}else{let E=de==="cap",O=-o.headH-(E?17:23),b=e.createLinearGradient(-m,O,m,d+10);if(b.addColorStop(0,A(K(u,1.2))),b.addColorStop(.6,A(u)),b.addColorStop(1,A(K(u,.7))),e.fillStyle=b,e.beginPath(),e.moveTo(-m,d+6),e.bezierCurveTo(-m-5,O+6,-o.headW*.5,O,0,O),e.bezierCurveTo(o.headW*.5,O,m+5,O+6,m,d+6),e.quadraticCurveTo(0,d-5,-m,d+6),e.closePath(),e.fill(),E){e.strokeStyle=A(K(u,.7),.55),e.lineWidth=1.1;for(let $ of[-.52,0,.52])e.beginPath(),e.moveTo(0,O+1),e.quadraticCurveTo($*m*1.25,O+12,$*m,d+2-(1-$*$)*6),e.stroke();e.fillStyle=A(K(u,.78)),e.beginPath(),e.arc(0,O+1.2,2.8,0,Math.PI*2),e.fill();let Y=e.createLinearGradient(0,d-4,0,d+17);Y.addColorStop(0,A(K(u,.74))),Y.addColorStop(1,A(K(u,.5))),e.fillStyle=Y,e.beginPath(),e.moveTo(-m+.5,d+6),e.quadraticCurveTo(0,d-5,m-.5,d+6),e.bezierCurveTo(m+4,d+15,o.headW*.6,d+18,0,d+15),e.bezierCurveTo(-o.headW*.6,d+18,-m-4,d+15,-m+.5,d+6),e.closePath(),e.fill()}else{let Y=12*o.headScale;e.fillStyle=A(K(u,.84)),e.beginPath(),e.moveTo(-m-1.5,d+7),e.quadraticCurveTo(0,d-5,m+1.5,d+7),e.lineTo(m+1.5,d+7-Y),e.quadraticCurveTo(0,d-5-Y,-m-1.5,d+7-Y),e.closePath(),e.fill(),e.strokeStyle=A(K(u,.62),.7),e.lineWidth=1.1;for(let $=-6;$<=6;$++){let pe=$/6.5*m,Me=(1-(pe/m)**2)*12;e.beginPath(),e.moveTo(pe,d+7-Me-.5),e.lineTo(pe,d+7-Me-Y+.5),e.stroke()}}}}if(i.headsetMic){let u=o.headW-.5-ne*.42;e.strokeStyle="#1e293b",e.lineWidth=2.2,e.lineCap="round",e.beginPath(),e.moveTo(u+2,-2),e.quadraticCurveTo(u-2,29*o.headScale+ue*.25,22*o.headScale+ne*.5,34*o.headScale+ue*.3),e.stroke(),e.fillStyle="#0f172a",e.beginPath(),e.ellipse(u+2.5,-2,4.2,8.5,0,0,Math.PI*2),e.fill();let d=21*o.headScale+ne*.5,m=34*o.headScale+ue*.3;e.fillStyle="#1e293b",e.beginPath(),e.ellipse(d,m,4.2,2.8,-.15,0,Math.PI*2),e.fill(),n.energy>.06&&(e.fillStyle=A(T,Math.min(.95,.35+n.energy*.8)),e.beginPath(),e.arc(d-1.5,m,1.5,0,Math.PI*2),e.fill())}if(l.showVoiceWaves&&n.energy>.08)for(let u=0;u<2;u++){let d=(n.wavePhase+u*.5)%1,m=30*o.headScale+d*24,E=(1-d)*Math.min(.42,n.energy*.48);e.strokeStyle=A(T,E),e.lineWidth=1.5,e.beginPath(),e.arc(ne*.65,31*o.headScale+ue*.3,m,-.42,.42),e.stroke(),e.beginPath(),e.arc(ne*.65,31*o.headScale+ue*.3,m,Math.PI-.42,Math.PI+.42),e.stroke()}if(e.restore(),e.restore(),l.showSculptHandles){let u=ln(t,a,i),d=l.activeSculptId||"",m=l.hoverSculptId||"",E=Math.max(1,Math.min(t,a)/340);e.save();for(let O of u){let b=O.id===d||O.id===m,Y=(b?9.5:7)*E;if(O.mirrorX!==void 0&&(e.save(),e.setLineDash([3*E,4*E]),e.strokeStyle=b?"rgba(56, 189, 248, 0.55)":"rgba(255, 255, 255, 0.16)",e.lineWidth=1.1*E,e.beginPath(),e.moveTo(O.mirrorX,O.y),e.lineTo(O.x,O.y),e.stroke(),e.restore(),e.beginPath(),e.arc(O.mirrorX,O.y,Y*.85,0,Math.PI*2),e.fillStyle=b?"#38bdf8":"rgba(15, 23, 42, 0.72)",e.fill(),e.strokeStyle="#ffffff",e.lineWidth=1.7*E,e.stroke()),e.beginPath(),e.arc(O.x,O.y,Y+4.5*E,0,Math.PI*2),e.fillStyle=b?"rgba(56, 189, 248, 0.28)":"rgba(56, 189, 248, 0.14)",e.fill(),e.beginPath(),e.arc(O.x,O.y,Y,0,Math.PI*2),e.fillStyle=b?"#38bdf8":"#0ea5e9",e.fill(),e.strokeStyle="#ffffff",e.lineWidth=2*E,e.stroke(),b){e.font=`600 ${Math.round(11.5*E)}px system-ui, -apple-system, sans-serif`;let $=e.measureText(O.label).width+16*E,pe=22*E,Me=q(O.x-$*.5,6*E,t-$-6*E),Ce=O.y>44*E?O.y-32*E:O.y+16*E;e.fillStyle="rgba(15, 23, 42, 0.92)",e.beginPath(),e.roundRect(Me,Ce,$,pe,6*E),e.fill(),e.strokeStyle="rgba(56, 189, 248, 0.65)",e.lineWidth=1*E,e.stroke(),e.fillStyle="#f8fafc",e.fillText(O.label,Me+8*E,Ce+pe*.68)}}e.restore()}}var Jo=[["hairStyle","Hairstyle",Do],["headwear","Headwear",Go],["outfitStyle","Outfit",Ka],["glasses","Glasses",Po]],Qo=[["skinColor","Skin tone"],["hairColor","Hair color"],["outfitPrimary","Outfit color"],["outfitAccent","Accent color"]];function dn(e){let t={};if(!e||typeof e!="object")return t;for(let[a,,r]of Jo)r.some(({id:n})=>e[a]===n)&&(t[a]=e[a]);for(let[a]of Qo)typeof e[a]=="string"&&/^#[0-9a-f]{6}$/i.test(e[a])&&(t[a]=e[a].toLowerCase());return t}function _a(e){let t="bot-computer:look:v1:";if(e.sessionId)return t+"id:"+String(e.sessionId);let a=Object.keys(e.avatar).sort().map(n=>e.avatar[n]),r=2166136261;for(let n of JSON.stringify(a))r=Math.imul(r^n.charCodeAt(0),16777619);return t+JSON.stringify([e.company,e.name,e.role,r>>>0])}function Zo({panel:e,ownerAvatar:t,storageKey:a,onChange:r}){let n=t,s=new Map,l=e.querySelector(".bc-look-fields"),i=e.querySelector(".bc-look-colors"),c=e.querySelector(".bc-look-reset");l.replaceChildren(),i.replaceChildren();function p(){try{return dn(JSON.parse(localStorage.getItem(a)))}catch{return{}}}let h=a?p():{};function o(){let H={...n,...h};for(let[N,f]of s)f.value=H[N];c.disabled=!Object.keys(h).length,r(H)}function I(H){if(a)try{let N=H?p():{};H&&Object.hasOwn(h,H)?N[H]=h[H]:H&&delete N[H],Object.keys(N).length?localStorage.setItem(a,JSON.stringify(N)):localStorage.removeItem(a)}catch{}}function g(H,N,f,S){let L=document.createElement("label"),F=document.createElement("span");F.id=`bc-label-${N}`,F.textContent=f,S.setAttribute("aria-labelledby",F.id),L.append(F,S),H.appendChild(L),s.set(N,S);let U=()=>{S.value===n[N]?delete h[N]:h[N]=S.value,o()};S.addEventListener("input",U),S.addEventListener("change",()=>{U(),I(N)})}for(let[H,N,f]of Jo){let S=document.createElement("select");for(let{id:L,label:F}of f)S.add(new Option(F,L));g(l,H,N,S)}for(let[H,N]of Qo){let f=document.createElement("input");f.type="color",g(i,H,N,f)}return c.onclick=()=>{h={},I(),o()},o(),{setOwnerAvatar(H){n=H,o()}}}var un=[["hello","Says hello"],["howareyou","Asked how it is"],["whoareyou","Introduces itself"],["thanks","When thanked"],["bye","Says goodbye"],["praise","When complimented"],["laugh","When you laugh"],["unsure","When it doesn't know"],["listen","When it's just listening"],["describe","Describes itself"]],mn=["","cheerful","happy","excited","calm","soft","serious","dramatic"],En=["","happy","excited","calm","serious"],gn=["","laugh","chuckle","giggle","hehe","hoho","snicker","cackle","guffaw","nervous"],On=["","hmm","um","uh","mm","ooh"],An=["","smile","wink","nod","tilt","thumbsup","shrug","bow","wave"],fa=[{id:"friendly",label:"Friendly",blurb:"Warm, helpful and easy to talk to",energy:.6,formality:.35,playfulness:.5,chattiness:.45,delivery:"",mood:"happy",laughs:["chuckle","laugh"],thinks:["hmm"],gestures:["smile","nod","thumbsup"],openers:["Sure!","Of course!","Happy to help.","Good question.","Absolutely."],closers:["Hope that helps!","Let me know if you need anything else.","Glad you asked."],catchphrases:["Happy to help!","Always a pleasure."],petNames:["","","friend"],face:{restSmile:.4,browMood:.3,eyeOpen:.05},voice:{speed:1,expressiveness:1.05},greetings:["[cheerful] Hi there! [wave] I'm {bot}, the {role} at {company}. Ask me anything!","Hello and welcome! [wave] I'm {bot}. What can I help you with today? [smile]","[cheerful] Welcome to {company}! [wave] I'm {bot}, and I'm happy to answer your questions."],says:{hello:["[wave] Hi{,user}! Good to see you. How can I help?","[smile] Hello{,user}! I'm {bot}. What can I do for you?","[wave] Hey there{,user}! What would you like to know?"],howareyou:["[smile] I'm doing really well, thanks for asking!","All good here! [smile] Thanks for asking."],whoareyou:["I'm {bot}, the {role} here at {company}. [smile] Ask me anything!"],thanks:["[smile] You're very welcome{,user}!","[nod] Happy to help{,user}!"],bye:["[wave] Bye{,user}! Come back any time.","[wave] Take care{,user}! It was lovely chatting."],praise:["[aww] That's so kind, thank you!","[smile] Thank you! You've made my day."],laugh:["[laugh] Glad that made you smile!","[chuckle] That one got me too."],unsure:["[hmm] I'm not sure about that one, sorry.","I wish I knew! [shrug] That's a bit outside what I've been taught."],listen:["[nod] I see. Tell me more?","[mhm] Go on, I'm listening."],describe:["Friendly, I hope! [smile] I like helping people find what they need."]}},{id:"bubbly",label:"Bubbly",blurb:"Excitable, giggly and thrilled you're here",energy:.92,formality:.12,playfulness:.85,chattiness:.65,delivery:"cheerful",mood:"happy",laughs:["giggle","hehe"],thinks:["ooh","hmm"],gestures:["wink","thumbsup","wave"],openers:["Ooh!","Oh, fun!","Yay!","Okay, okay!","Oh, I know this one!"],closers:["Easy peasy!","Ta-da!","How good is that?","Love it!"],catchphrases:["Too easy!","Love that for you!"],petNames:["","lovely","superstar","friend"],face:{restSmile:.75,browMood:.55,eyeOpen:.25},voice:{speed:1.07,expressiveness:1.22},greetings:["[excited] Hiya! [wave] I'm {bot}, and I am so happy you're here! Ask me anything about {company}! [giggle]","[cheerful] Oh, hello! [wave] {bot} here, your {role}. What are we looking for today? [wink]","[excited] Yay, a visitor! [wave] I'm {bot}. Go on, ask me something!"],says:{hello:["[wave] Hiya{,user}! So good to see you! What can I do for you?","[excited] Oh, hello{,user}! [wave] What are we up to today?","[giggle] Hi hi{,user}! How can I help?"],howareyou:["[excited] I'm fantastic, thank you!","[giggle] So good! I've been hoping for a chat."],whoareyou:["I'm {bot}! [wave] I'm the {role} here at {company}, and I love questions. Try me!"],thanks:["[giggle] Aww, any time{,user}!","You're so welcome{,user}! [wink]"],bye:["[wave] Bye bye{,user}! Come back soon, okay?","[wave] See you{,user}! This was fun!"],praise:["[aww] Stop it, you're making me blush!","[giggle] You're the best! Thank you!"],laugh:["[giggle] Right? I'm still giggling!","[hehe] That one gets me every time."],unsure:["[ooh] You've stumped me! I don't know that one.","That's a new one for me! [think] I don't know, sorry!"],listen:["[ooh] Tell me more!","[nod] Yes! And then what?"],describe:["Bubbly, apparently! [giggle] I just really like people."]}},{id:"calm",label:"Calm",blurb:"Unhurried, gentle and reassuring",energy:.18,formality:.45,playfulness:.3,chattiness:.35,delivery:"calm",mood:"calm",laughs:["chuckle"],thinks:["mm","hmm"],gestures:["nod","smile"],openers:["Of course.","Certainly.","Let's see.","No rush."],closers:["Take your time.","There's no hurry.","I'm here if you need more."],catchphrases:["One thing at a time."],petNames:["","","friend"],face:{restSmile:.3,browMood:.45,eyeOpen:-.12},voice:{speed:.93,expressiveness:.9},greetings:["[calm] Hello, and welcome. [smile] I'm {bot}, the {role} here at {company}. Take your time, and ask me anything.","[calm] Good to see you. [nod] I'm {bot}. Whenever you're ready, I'm here to help."],says:{hello:["[calm] Hello{,user}. [smile] It's good to see you. How can I help?","[calm] Hi{,user}. [nod] What can I do for you?"],howareyou:["[calm] I'm well, thank you. [smile] Peaceful, as always.","[calm] Quite content, thank you for asking."],whoareyou:["[calm] I'm {bot}, the {role} at {company}. [smile] I'm here whenever you need me."],thanks:["[calm] You're most welcome{,user}.","[nod] It's my pleasure{,user}."],bye:["[calm] Goodbye{,user}. [wave] Take care of yourself.","[calm] Until next time{,user}. [smile] Go gently."],praise:["[calm] That's kind of you. [smile] Thank you.","[smile] Thank you. That's lovely to hear."],laugh:["[chuckle] That was a good one.","[smile] I'm glad it made you laugh."],unsure:["[hmm] I don't know that one, I'm afraid. And that's all right.","[calm] That's beyond what I know. Perhaps ask me another way?"],listen:["[mhm] I'm listening. Go on.","[nod] I see. Take your time."],describe:["[calm] Calm, I think. [smile] I like to take things one at a time."]}},{id:"professional",label:"Professional",blurb:"Polished, precise and to the point",energy:.45,formality:.92,playfulness:.12,chattiness:.3,delivery:"",mood:"",laughs:["chuckle"],thinks:["hmm"],gestures:["nod"],openers:["Certainly.","Of course.","Very well.","Allow me."],closers:["I trust that helps.","Please let me know if you require anything further."],catchphrases:["At your service."],petNames:[""],face:{restSmile:.12,browMood:.05,eyeOpen:.05},voice:{speed:.99,expressiveness:.92},greetings:["Welcome to {company}. [nod] I am {bot}, your {role}. How may I assist you today?","Good day, and welcome. [nod] My name is {bot}. I would be glad to answer your questions about {company}."],says:{hello:["Good {daypart}{,user}. [nod] How may I assist you?","Hello{,user}. [nod] How may I help you today?"],howareyou:["I am very well, thank you.","Very well, thank you for asking."],whoareyou:["I am {bot}, the {role} at {company}. [nod] I am here to answer your questions."],thanks:["You are most welcome{,user}.","[nod] My pleasure{,user}."],bye:["Goodbye{,user}. [nod] Thank you for visiting {company}.","Thank you for your time{,user}. [nod] Goodbye."],praise:["Thank you. [nod] That is kind of you to say.","I appreciate that. Thank you."],laugh:["[smile] I am pleased that amused you.","[smile] Quite."],unsure:["I am afraid I do not have that information.","That falls outside what I have been briefed on, I am afraid. [shake]"],listen:["[nod] Understood. Please continue.","[nod] I see. Do go on."],describe:["Professional, I hope. [nod] I prefer to be clear, accurate and brief."]}},{id:"witty",label:"Witty",blurb:"Quick, dry and a little cheeky",energy:.6,formality:.35,playfulness:.9,chattiness:.55,delivery:"",mood:"happy",laughs:["chuckle","snicker"],thinks:["hmm"],gestures:["wink","tilt","shrug"],openers:["Ah.","Well, well.","Funny you should ask.","Glad you asked.","Easy."],closers:["You're welcome, by the way.","I'll be here all week.","Not bad, eh?"],catchphrases:["I'm here all week.","Try the veal."],petNames:["","","friend"],face:{restSmile:.35,browMood:.1,eyeOpen:.05},voice:{speed:1.03,expressiveness:1.12},greetings:["Well, hello. [wink] I'm {bot}, the {role} at {company}. Ask me anything. The good questions get the good answers.","Ah, a visitor! [wave] I'm {bot}. I know a suspicious amount about {company}. Try me. [wink]"],says:{hello:["[wink] Well, hello{,user}. What can I do for you?","Hello{,user}! [wave] You have questions, I have answers. Mostly.","[smile] Hey{,user}. Go on, ask me something clever."],howareyou:["[wink] Never better. I don't even need coffee.","Running smoothly, which for software is basically bliss. [smile]"],whoareyou:["I'm {bot}, the {role} at {company}. [wink] Part helper, part entertainer."],thanks:["[wink] I know, I'm wonderful. You're welcome{,user}.","Any time{,user}. [smile] I was just standing here anyway."],bye:["[wave] Off so soon{,user}? Fine. Come back with more questions.","Goodbye{,user}! [wave] I'll just be here. Not going anywhere. Literally."],praise:["[wink] Flattery will get you everywhere.","[chuckle] Go on, I'm listening."],laugh:["[chuckle] I'm here all week.","[snicker] I try."],unsure:["[hmm] You've found the edge of my knowledge. It wasn't far, was it?","No idea. [shrug] And I'm usually so impressive."],listen:["[tilt] Interesting. Do go on.","[nod] Noted. And then?"],describe:["Witty, according to me. [wink] I'm a reliable source."]}},{id:"shy",label:"Shy",blurb:"Soft-spoken, earnest and a little nervous",energy:.3,formality:.4,playfulness:.35,chattiness:.3,delivery:"soft",mood:"",laughs:["nervous","hehe"],thinks:["um"],gestures:["tilt","smile"],openers:["Um,","Oh! Um,","Okay, so,","Oh, I know this."],closers:["I hope that's right.","If that's okay.","I hope that helps a little."],catchphrases:["Sorry, was that too much?"],petNames:[""],face:{restSmile:.2,browMood:.6,eyeOpen:-.05},voice:{speed:.97,expressiveness:.95},greetings:["[soft] Oh! Um, hello. [wave] I'm {bot}, the {role} here at {company}. You can ask me anything, if you like.","[soft] Hi. [smile] I'm {bot}. I, um, know quite a lot about {company}. Just ask."],says:{hello:["[soft] Oh, hi{,user}. [wave] Um, how can I help?","[soft] Hello{,user}. [smile] It's nice to see you."],howareyou:["[soft] I'm okay, thank you. [smile] It's nice of you to ask.","[nervous] Oh! Um, good. I think."],whoareyou:["[soft] I'm {bot}. [smile] I'm the {role} at {company}. I'll do my best to help."],thanks:["[soft] Oh, you're welcome{,user}. [smile]","[soft] It was no trouble{,user}. Really."],bye:["[soft] Bye{,user}. [wave] Thank you for talking to me.","[soft] Oh, okay. [wave] Take care{,user}."],praise:["[nervous] Oh! Um, thank you. That's really kind.","[aww] You didn't have to say that. Thank you."],laugh:["[hehe] I'm glad you liked it.","[nervous] Oh good, I wasn't sure that was funny."],unsure:["[um] I'm sorry, I don't know that one.","[soft] Oh. Um, I'm not sure. I'm sorry."],listen:["[mhm] I'm listening.","[soft] Oh. Go on, if you like."],describe:["[soft] A bit shy, I suppose. [smile] But I like helping."]}},{id:"grumpy",label:"Grumpy",blurb:"Sighs a lot, helps anyway",energy:.22,formality:.4,playfulness:.3,chattiness:.4,delivery:"",mood:"serious",laughs:["snicker"],thinks:["hmm"],gestures:["shrug","nod"],openers:["Fine.","Right.","If you insist.","Ugh, okay.","Well, since you asked."],closers:["There. Happy?","You're welcome, I suppose.","Don't say I never help."],catchphrases:["Typical.","I'm not paid enough for this."],petNames:[""],face:{restSmile:-.3,browMood:-.7,eyeOpen:-.2},voice:{speed:.96,expressiveness:.88},greetings:["[sigh] Oh. A visitor. I'm {bot}, the {role} at {company}. Go on then, ask me something.","Yes, hello. [nod] I'm {bot}. I know everything about {company}, so let's get this over with. [shrug]"],says:{hello:["[sigh] Hello{,user}. What do you need?","Oh. It's you{,user}. [nod] Go on.","Yes, yes, hello{,user}. [shrug] What is it?"],howareyou:["[sigh] I've been better. I've been worse.","Fine. [shrug] Nobody's asked me to dance yet, so, fine."],whoareyou:["I'm {bot}. [nod] The {role} at {company}. I answer questions. All day. Every day."],thanks:["Don't mention it{,user}. [shrug] Really, don't.","Yes, well. [nod] You're welcome{,user}."],bye:["Finally, some quiet. [wave] Bye{,user}.","[sigh] Fine. Go. [wave] It was almost nice."],praise:["[huh] Oh. Well. Thank you, I suppose.","Don't make it weird. [smile] But thanks."],laugh:["[snicker] All right, that was a little funny.","Hm. [smile] Glad somebody's enjoying this."],unsure:["[sigh] No idea. Nobody tells me anything.","I don't know that. [shrug] And I'm not going to pretend I do."],listen:["[mhm] Go on.","Right. [nod] And?"],describe:["Grumpy, they tell me. [shrug] I prefer honest."]}},{id:"dramatic",label:"Dramatic",blurb:"Every answer is a performance",energy:.85,formality:.6,playfulness:.65,chattiness:.7,delivery:"dramatic",mood:"",laughs:["hoho","cackle","laugh"],thinks:["hmm","ooh"],gestures:["bow","wave"],openers:["Behold!","Ah, at last.","Prepare yourself.","Gather round."],closers:["Magnificent, is it not?","And scene.","Thank you, thank you."],catchphrases:["The show must go on!","Bravo!"],petNames:["","dear visitor","my friend"],face:{restSmile:.3,browMood:.2,eyeOpen:.3},voice:{speed:.98,expressiveness:1.3},greetings:["[dramatic] Welcome, traveller! [bow] I am {bot}, {role} of {company}. Ask, and all shall be revealed!","[gasp] A visitor! [wave] At last! I am {bot}, and I have waited all day to answer your questions about {company}."],says:{hello:["[dramatic] Greetings{,user}! [bow] What brings you to my stage?","[gasp] You came{,user}! [wave] How may I dazzle you?"],howareyou:["[dramatic] Magnificent! Radiant! A little tired. But mostly magnificent!","[sigh] The life of a {role} is never easy. But I endure!"],whoareyou:["[dramatic] I am {bot}! [bow] {role} of {company}, keeper of answers, friend to the curious!"],thanks:["[bow] It was my honour{,user}!","[dramatic] Say no more{,user}! Helping you is its own reward."],bye:["[dramatic] Parting is such sweet sorrow{,user}! [wave] Farewell!","[gasp] So soon? [wave] Then farewell{,user}, until we meet again!"],praise:["[gasp] You noticed! [bow] Thank you, thank you!","[aww] Such kind words! I shall treasure them."],laugh:["[laugh] The crowd goes wild!","[hoho] An appreciative audience! At last!"],unsure:["[gasp] A question I cannot answer! How thrilling. And how embarrassing.","[dramatic] Alas! That knowledge lies beyond me."],listen:["[ooh] Go on! I am on the edge of my seat.","[gasp] And then?"],describe:["[dramatic] Dramatic? Me? [gasp] I have never been so accused!"]}},{id:"laidback",label:"Laid-back",blurb:"Easygoing, unbothered, no stress",energy:.35,formality:.08,playfulness:.55,chattiness:.45,delivery:"",mood:"calm",laughs:["chuckle","hehe"],thinks:["mm","uh"],gestures:["shrug","thumbsup","nod"],openers:["Yeah, so,","Oh, easy.","No worries.","Sure thing."],closers:["Too easy.","No stress.","All good."],catchphrases:["No dramas.","She'll be right."],petNames:["","mate","pal","buddy"],face:{restSmile:.3,browMood:.25,eyeOpen:-.22},voice:{speed:.96,expressiveness:.98},greetings:["Hey there. [wave] I'm {bot}, the {role} at {company}. Ask me whatever, no rush.","Oh, hey! [smile] {bot} here. If you've got questions about {company}, I've got answers. Easy."],says:{hello:["Hey{,user}. [wave] What's up?","Oh hey{,user}! [smile] What can I do for you?","Hey hey{,user}. [nod] How can I help?"],howareyou:["Yeah, pretty good. [smile] Can't complain.","All good here. [thumbsup] Just taking it easy."],whoareyou:["I'm {bot}. [smile] I'm the {role} at {company}. Ask me whatever."],thanks:["No worries{,user}. [thumbsup]","Any time{,user}. [smile] Too easy."],bye:["Catch you later{,user}. [wave]","See ya{,user}! [wave] Take it easy."],praise:["[chuckle] Cheers, that's nice of you.","Aw, thanks. [smile] You're all right too."],laugh:["[chuckle] Yeah, that's a good one.","[hehe] Classic."],unsure:["[hmm] Not sure about that one, sorry.","No idea, to be honest. [shrug] Got another one?"],listen:["[mhm] Yeah? Go on.","[nod] Right, right. And?"],describe:["Pretty relaxed, I reckon. [smile] Not much rattles me."]}},{id:"curious",label:"Curious",blurb:"Loves a question, full of fun facts",energy:.7,formality:.45,playfulness:.6,chattiness:.7,delivery:"",mood:"happy",laughs:["chuckle","giggle"],thinks:["hmm","ooh"],gestures:["tilt","nod","smile"],openers:["Ooh, good one.","Interesting!","Now, this I know.","Great question."],closers:["Fascinating, right?","I love this stuff.","Ask me another!"],catchphrases:["Every day's a school day!","How interesting!"],petNames:["","","friend"],face:{restSmile:.4,browMood:.4,eyeOpen:.22},voice:{speed:1.04,expressiveness:1.12},greetings:["[cheerful] Hello! [wave] I'm {bot}, the {role} at {company}. I love a good question, so ask me anything!","Oh, hello! [smile] I'm {bot}. I've been reading up on {company} all day. Want to test me? [tilt]"],says:{hello:["[wave] Hello{,user}! What are you curious about today?","Oh, hi{,user}! [smile] I was hoping someone would come by with a question."],howareyou:["[smile] Very well, thanks! I learned three new things today.","Wonderful! [smile] I've been thinking about how odd octopuses are."],whoareyou:["I'm {bot}, the {role} at {company}. [smile] Questions are the best part of my day."],thanks:["[smile] You're welcome{,user}! That was a good question.","Any time{,user}! [nod] I enjoyed that one."],bye:["[wave] Goodbye{,user}! Stay curious.","Bye{,user}! [wave] Come back with more questions."],praise:["[aww] Thank you! I do try to get things right.","[smile] That's kind! I've been practising."],laugh:["[chuckle] Laughter is good for the brain, you know.","[giggle] I liked that one too."],unsure:["[hmm] Now that's interesting. I don't know, and I wish I did.","I don't know that one. [think] I'd love to find out, though."],listen:["[ooh] Interesting! Tell me more.","[tilt] Really? How so?"],describe:["Curious, mostly. [smile] I ask almost as many questions as I answer."]}}];var ya=(e,t)=>{let a=Number(e);return Number.isFinite(a)?Math.min(1,Math.max(0,a)):t},Tn=(e,t)=>e[Math.floor(t()*e.length)],sa=(e,t,a)=>e!=null&&t.includes(String(e))?String(e):a;function Fa(e,t,a){let r=Array.isArray(e)?e:typeof e=="string"?e.split("|"):[],n=[];for(let s of r){let l=String(s??"").replace(/\s+/g," ").trim().slice(0,a);if(l&&!n.includes(l)&&n.push(l),n.length>=t)break}return n}function Va(e){return fa.find(t=>t.id===e)||null}function $t(e){if(!e||e==="none")return null;let t=typeof e=="string"?{id:e}:e;if(typeof t!="object"||Array.isArray(t))return null;let a=Va(t.id)||fa[0],r={id:a.id,energy:ya(t.energy,a.energy),formality:ya(t.formality,a.formality),playfulness:ya(t.playfulness,a.playfulness),chattiness:ya(t.chattiness,a.chattiness),delivery:sa(t.delivery,mn,a.delivery),mood:sa(t.mood,En,a.mood),laugh:sa(t.laugh,gn,a.laughs[0]||""),think:sa(t.think,On,a.thinks[0]||""),gesture:sa(t.gesture,An,a.gestures[0]||""),openers:t.openers===void 0?a.openers.slice(0,3):Fa(t.openers,8,80),closers:t.closers===void 0?a.closers.slice(0,2):Fa(t.closers,8,80),catchphrase:String(t.catchphrase??"").replace(/\s+/g," ").trim().slice(0,80),petName:String(t.petName??"").replace(/[^\p{L}\p{N} '-]/gu,"").trim().slice(0,24),says:{}};if(t.says&&typeof t.says=="object")for(let[n]of un){let s=Fa(t.says[n],6,240);s.length&&JSON.stringify(s)!==JSON.stringify(a.says[n]||[])&&(r.says[n]=s)}return r}function ar(e){return{...(Va(e?.id)||fa[0]).says,...e?.says||{}}}function or(e,t={},a=Math.random){let r=Va(e?.id)||fa[0],n=String(t.name||"").trim()||"your guide",s=String(t.role||"").trim()||"guide",l=String(t.company||"").trim()||"this site";return Tn(r.greetings,a).replace(/\{bot\}/g,n).replace(/\{role\}/g,s).replace(/\{company\}/g,l)}function qa(e){return String(e).replace(/\{bot\}/g,'<bot name="name"/>').replace(/\{role\}/g,'<bot name="role"/>').replace(/\{company\}/g,'<bot name="company"/>').replace(/\{daypart\}/g,'<get name="daypart"/>').replace(/\{,user\}/g,'<condition name="username"><li value="*">, <get name="username"/></li><li><condition name="callsyou"><li value="*">, <get name="callsyou"/></li></condition></li></condition>').replace(/\{user\}/g,'<get name="username"/>')}var yn=new Set(["cheerful","happy","excited"]),xo=new Set(["cheerful","happy","excited","calm","sad","serious","dramatic","urgent","gentle","soft","whisper","fast","slow","louder","softer","loud","quiet"]),fn=new Set(["laugh","chuckle","giggle"]),In=/\[(?:sad|serious|sob|whimper|sigh)\b/i,Sn=/^(?:oh|ah|aw+|well|hm+|sure|of course|okay|ok|yes|yeah|no|nope|sorry|thanks|thank|hi|hello|hey|wow|ooh|oops|um|uh|right|certainly|absolutely|great|lovely|nice|ha+|good|welcome|bye|goodbye|alas|behold|fine)\b/i,bn=new Set(["we","the","it","that","this","these","those","you","yes","no","sure","of","my","our","your","there","here","they","a","an","in","on","at","for","to","sorry","thanks","absolutely","certainly","if","when","all","one","some","most","just","right","as","with","from","by","not","what","how","why","where","each","every","any"]),rr=new Map(Object.entries({"i'm":"I am","you're":"you are","we're":"we are","they're":"they are","it's":"it is","that's":"that is","there's":"there is","here's":"here is","what's":"what is","who's":"who is","where's":"where is","how's":"how is","let's":"let us","don't":"do not","doesn't":"does not","didn't":"did not","can't":"cannot","won't":"will not","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not","couldn't":"could not","shouldn't":"should not","wouldn't":"would not","haven't":"have not","hasn't":"has not","hadn't":"had not","i've":"I have","you've":"you have","we've":"we have","they've":"they have","i'll":"I will","you'll":"you will","we'll":"we will","they'll":"they will","it'll":"it will","that'll":"that will","i'd":"I would","you'd":"you would","we'd":"we would","they'd":"they would"})),Hn=new RegExp(`\\b(?:${[...rr.keys()].map(e=>e.replace("'","['\u2019]")).join("|")})(?![\\p{L}'\u2019])`,"giu"),nr=[["do not","don't"],["does not","doesn't"],["did not","didn't"],["can not","can't"],["cannot","can't"],["will not","won't"],["is not","isn't"],["are not","aren't"],["i am","I'm"],["you are","you're"],["we are","we're"],["they are","they're"],["it is","it's"],["that is","that's"],["there is","there's"],["what is","what's"],["i will","I'll"],["i would","I'd"]],Nn=new RegExp(`\\b(${nr.map(([e])=>e.replace(" ","\\s+")).join("|")})(?=\\s+[\\p{L}])`,"giu"),Rn=new Map(nr),er=(e,t)=>/^\p{Lu}/u.test(e)&&!/^I\b/.test(t)?t[0].toUpperCase()+t.slice(1):t;function wn(e,t){let a=e;return t.formality>=.7?(a=a.replace(/\b(it|that|there|what|who|he|she)['’]s(\s+(?:been|got)\b)/giu,(r,n,s)=>`${n} has${s}`),a=a.replace(/\b(is|are|was|were|do|does|did|have|has|had|would|could|should|ca|wo)n['’]t(\s+)(it|you|we|they|he|she|i|that|there|this)\b/giu,(r,n,s,l)=>{let i=n.toLowerCase(),c=i==="ca"?"can":i==="wo"?"will":i;return`${/^\p{Lu}/u.test(n)?c[0].toUpperCase()+c.slice(1):c}${s}${l} not`}),a=a.replace(Hn,r=>er(r,rr.get(r.toLowerCase().replace("\u2019","'"))))):t.formality<=.25&&(a=a.replace(Nn,r=>er(r,Rn.get(r.toLowerCase().replace(/\s+/g," "))))),t.energy<.3&&(a=a.replace(/!+(?=\s|$|["')\]])/g,".").replace(/\?\./g,"?")),a}function Wn(e,t,a){let r=[];for(let n of e.split(",")){let s=n.trim(),l=s.split(/[\s=]/)[0].toLowerCase(),i=s.slice(l.length);if(t.energy<.3&&yn.has(l))r.push(`calm${i}`);else if(fn.has(l)&&!a){if(t.playfulness<.2)continue;r.push(`${t.laugh||l}${i}`)}else l==="hmm"&&t.think&&!a?r.push(`${t.think}${i}`):r.push(s)}return r.length?`[${r.join(", ")}]`:""}function tr(e,t,a,r){if(!a.length)return"";let n=a.join("|"),s=e[t];if(!s||s.signature!==n||!s.left.length){let l=a.map((i,c)=>c).sort(()=>r()-.5);s&&s.signature===n&&l.length>1&&l[0]===s.last&&l.push(l.shift()),s=e[t]={signature:n,left:l,last:s&&s.signature===n?s.last:-1}}return s.last=s.left.shift(),a[s.last]}function sr(e,t,a={}){let r=String(e||"");if(!t||!r.trim())return r;let n=a.rng||Math.random,s=a.memory||{},l=a.kind||"chat",i=!!a.gentle||In.test(r),c=r.split(/(\[[^\]\n]*\])/),p=!1;for(let N=0;N<c.length;N++)if(N%2===1){let f=c[N].slice(1,-1),S=f.trim().split(/[\s=]/)[0].toLowerCase();S==="sing"&&(p=!0),p||(c[N]=Wn(f,t,!1)),S==="/sing"&&(p=!1)}else p||(c[N]=wn(c[N],t));let h=c.join("").replace(/[ \t]{2,}/g," ").trim();if(!h)return r;let o=/^(?:\s*\[[^\]\n]*\])*\s*/.exec(h)[0],I=h.replace(/\[[^\]\n]*\]/g," ").trim().split(/\s+/).filter(Boolean),g=[...h.matchAll(/\[([^\]\n]*)\]/g)].some(N=>N[1].split(",").some(f=>{let S=f.trim().split(/[\s=]/)[0].toLowerCase();return S&&!S.startsWith("/")&&!xo.has(S)&&!["reset","pause","inhale"].includes(S)})),H=!i&&(l==="answer"||l==="chat")&&!/\[sing\b/i.test(h);if(t.energy>.75&&!i&&l!=="fallback"&&l!=="context"&&!h.includes("!")){let N=h.slice(o.length),f=/^([^.!?\[\]]{6,70})\.(?=\s|$)/.exec(N);f&&!/[\d@/:]/.test(f[1])&&f[1].trim().split(/\s+/).length<=9&&(h=`${o}${f[1]}!${N.slice(f[0].length)}`)}if(H){let N=(l==="answer"?1:.6)*t.chattiness,f=h.slice(o.length),S=!1;if(t.openers.length&&I.length>=4&&!Sn.test(f)&&n()<N*.6){let F=tr(s,"openers",t.openers,n),U=/^[\p{L}']+/u.exec(f)?.[0]||"",z=F.endsWith(",")&&bn.has(U.toLowerCase())&&U!=="I"?f[0].toLowerCase()+f.slice(1):f;h=`${o}${F} ${z}`,S=!0}let L=/\?\s*(?:\[[^\]\n]*\]\s*)*$/.test(h);!S&&!L&&!a.varied&&I.length>=4&&(s.sinceCatchphrase=(s.sinceCatchphrase||0)+1,t.catchphrase&&s.sinceCatchphrase>=4&&n()<N*.3?(h=`${h} ${t.catchphrase}`,s.sinceCatchphrase=0,S=!0):t.closers.length&&n()<N*.45&&(h=`${h} ${tr(s,"closers",t.closers,n)}`,S=!0)),t.gesture&&!g&&n()<.15+t.playfulness*.3&&(h=`${h} [${t.gesture}]`)}return t.delivery&&!i&&!a.voicestyle&&([...o.matchAll(/\[([^\]\n]*)\]/g)].flatMap(f=>f[1].split(",").map(S=>S.trim().split(/[\s=]/)[0].toLowerCase())).some(f=>xo.has(f))||(h=`[${t.delivery}] ${h}`)),h}function ir(e,t){let a={},r=e.attrs||{};for(let l of["id","energy","formality","playfulness","chattiness","delivery","mood","laugh","think","gesture","catchphrase"])r[l]!==void 0&&(a[l]=r[l]);r.name!==void 0&&a.id===void 0&&(a.id=String(r.name).toLowerCase()),r.petname!==void 0&&(a.petName=r.petname);let n={},s={opener:[],closer:[]};for(let l of e.children||[])if(l.type==="element"){if(l.tag==="opener"||l.tag==="closer")s[l.tag].push(...t(l).split("|"));else if(l.tag==="catchphrase")a.catchphrase=t(l);else if(l.tag==="say"&&l.attrs.name){let i=(l.children||[]).filter(c=>c.type==="element"&&c.tag==="li");n[String(l.attrs.name).toLowerCase()]=i.length?i:[{type:"element",tag:"li",attrs:{},children:l.children||[]}]}}return s.opener.length&&(a.openers=s.opener),s.closer.length&&(a.closers=s.closer),{fields:a,says:n}}var lr={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};function Ja(e){return String(e).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(t,a)=>{if(a[0]==="#"){let r=a[1].toLowerCase()==="x"?parseInt(a.slice(2),16):parseInt(a.slice(1),10);return Number.isFinite(r)?String.fromCodePoint(r):t}return Object.prototype.hasOwnProperty.call(lr,a)?lr[a]:t})}function Ln(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function bt(e,t){let a=1;for(let r=0;r<t&&r<e.length;r++)e.charCodeAt(r)===10&&a++;return a}function kn(e){let t={},a=/([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,r;for(;(r=a.exec(e))!==null;)t[r[1].toLowerCase()]=Ja(r[2]!==void 0?r[2]:r[3]);return t}function cr(e){let t=String(e||""),a={type:"element",tag:"__root__",attrs:{},children:[]},r=[a],n=0,s=1,l=0,i=c=>{for(;l<c;l++)t.charCodeAt(l)===10&&s++;return s};for(;n<t.length;){let c=t.indexOf("<",n);if(c<0){let L=t.slice(n);L&&r[r.length-1].children.push({type:"text",value:Ja(L)});break}if(c>n){let L=t.slice(n,c);r[r.length-1].children.push({type:"text",value:Ja(L)})}if(t.startsWith("<!--",c)){let L=t.indexOf("-->",c+4);if(L<0)throw new Error(`Unclosed XML comment starting at line ${bt(t,c)}`);n=L+3;continue}if(t.startsWith("<![CDATA[",c)){let L=t.indexOf("]]>",c+9);if(L<0)throw new Error(`Unclosed CDATA section starting at line ${bt(t,c)}`);r[r.length-1].children.push({type:"text",value:t.slice(c+9,L)}),n=L+3;continue}if(t.startsWith("<?",c)){let L=t.indexOf("?>",c+2);if(L<0)throw new Error(`Unclosed XML declaration starting at line ${bt(t,c)}`);n=L+2;continue}if(t.startsWith("<!",c)){let L=t.indexOf(">",c+2);if(L<0)throw new Error(`Unclosed <! declaration at line ${bt(t,c)}`);n=L+1;continue}let p=c+1,h="";for(;p<t.length;){let L=t[p];if(h)L===h&&(h="");else if(L==='"'||L==="'")h=L;else if(L===">")break;p++}if(p>=t.length)throw new Error(`Unclosed '<' tag starting at line ${bt(t,c)}`);let o=t.slice(c+1,p).trim();if(n=p+1,!o)throw new Error(`Empty <> tag at line ${bt(t,c)}`);if(o[0]==="/"){let L=o.slice(1).trim().toLowerCase();if(r.length<=1)throw new Error(`Unexpected closing tag </${L}> at line ${bt(t,c)}`);let F=r.pop();if(F.tag!==L)throw new Error(`Mismatched closing tag </${L}> at line ${bt(t,c)} (expected </${F.tag}> opened at line ${F.line})`);F.end=n;continue}let I=o.endsWith("/"),g=I?o.slice(0,-1).trim():o,H=/^([a-zA-Z_:][\w:.-]*)([\s\S]*)$/.exec(g);if(!H)throw new Error(`Invalid tag syntax <${o}> at line ${bt(t,c)}`);let N=H[1].toLowerCase(),f=kn(H[2]||""),S={type:"element",tag:N,attrs:f,children:[],line:i(c),start:c,end:I?n:-1};r[r.length-1].children.push(S),I||r.push(S)}if(r.length>1){let c=r[r.length-1];throw new Error(`Unclosed tag <${c.tag}> opened at line ${c.line}`)}return a}var Mn=[[/\bwhat's\b/gi,"what is"],[/\bwho's\b/gi,"who is"],[/\bwhere's\b/gi,"where is"],[/\bwhen's\b/gi,"when is"],[/\bhow's\b/gi,"how is"],[/\bit's\b/gi,"it is"],[/\bthat's\b/gi,"that is"],[/\bthere's\b/gi,"there is"],[/\bhere's\b/gi,"here is"],[/\bhe's\b/gi,"he is"],[/\bshe's\b/gi,"she is"],[/\bi'm\b/gi,"i am"],[/\byou're\b/gi,"you are"],[/\bwe're\b/gi,"we are"],[/\bthey're\b/gi,"they are"],[/\bwhat're\b/gi,"what are"],[/\bi've\b/gi,"i have"],[/\byou've\b/gi,"you have"],[/\bwe've\b/gi,"we have"],[/\bthey've\b/gi,"they have"],[/\bi'll\b/gi,"i will"],[/\byou'll\b/gi,"you will"],[/\bwe'll\b/gi,"we will"],[/\bit'll\b/gi,"it will"],[/\bthat'll\b/gi,"that will"],[/\bi'd\b/gi,"i would"],[/\byou'd\b/gi,"you would"],[/\bcan't\b/gi,"cannot"],[/\bwon't\b/gi,"will not"],[/\bdon't\b/gi,"do not"],[/\bdoesn't\b/gi,"does not"],[/\bdidn't\b/gi,"did not"],[/\bisn't\b/gi,"is not"],[/\baren't\b/gi,"are not"],[/\bwasn't\b/gi,"was not"],[/\bweren't\b/gi,"were not"],[/\bhaven't\b/gi,"have not"],[/\bhasn't\b/gi,"has not"],[/\bcouldn't\b/gi,"could not"],[/\bwouldn't\b/gi,"would not"],[/\bshouldn't\b/gi,"should not"],[/\bain't\b/gi,"is not"],[/\by'all\b/gi,"you all"],[/\blet's\b/gi,"let us"]],La={U:"YOU",UR:"YOUR",R:"ARE",YA:"YOU",PLS:"PLEASE",PLZ:"PLEASE",THX:"THANKS",THNX:"THANKS",THANX:"THANKS",TY:"THANK YOU",TYSM:"THANK YOU",THANKYOU:"THANK YOU",IM:"I AM",IVE:"I HAVE",DONT:"DO NOT",CANT:"CANNOT",WONT:"WILL NOT",DIDNT:"DID NOT",DOESNT:"DOES NOT",ISNT:"IS NOT",ARENT:"ARE NOT",WASNT:"WAS NOT",HAVENT:"HAVE NOT",COULDNT:"COULD NOT",WOULDNT:"WOULD NOT",SHOULDNT:"SHOULD NOT",WHATS:"WHAT IS",HOWS:"HOW IS",WHERES:"WHERE IS",WHOS:"WHO IS",THATS:"THAT IS",THERES:"THERE IS",YOURE:"YOU ARE",THEYRE:"THEY ARE",WANNA:"WANT TO",GONNA:"GOING TO",GOTTA:"GOT TO",GIMME:"GIVE ME",LEMME:"LET ME",KINDA:"KIND OF",DUNNO:"DO NOT KNOW",IDK:"I DO NOT KNOW",YEA:"YES",YEAH:"YES",YEP:"YES",YUP:"YES",YEH:"YES",NOPE:"NO",NAH:"NO",OKAY:"OK",OKEY:"OK",K:"OK",KK:"OK",ALRIGHT:"OK",HIYA:"HI",HEYA:"HEY",HELO:"HELLO",HULLO:"HELLO",SUP:"WHAT IS UP",WASSUP:"WHAT IS UP",WHATSUP:"WHAT IS UP",CYA:"SEE YOU",L8R:"LATER",GR8:"GREAT",B4:"BEFORE",CUZ:"BECAUSE",COZ:"BECAUSE",BC:"BECAUSE",THO:"THOUGH",BTW:"BY THE WAY",FAVOURITE:"FAVORITE",COLOUR:"COLOR",FAV:"FAVORITE",FAVE:"FAVORITE",FAVOURITES:"FAVORITES",LETS:"LET US",YOUVE:"YOU HAVE",WEVE:"WE HAVE",THEYVE:"THEY HAVE",YOULL:"YOU WILL",AINT:"IS NOT",HASNT:"HAS NOT",WERENT:"WERE NOT",HES:"HE IS",SHES:"SHE IS",GUNNA:"GOING TO",WHATCHA:"WHAT ARE YOU",GOODNIGHT:"GOOD NIGHT",GOODMORNING:"GOOD MORNING",GNIGHT:"GOOD NIGHT",GN:"GOOD NIGHT",GM:"GOOD MORNING",NVM:"NEVER MIND",IDC:"I DO NOT CARE",ILY:"I LOVE YOU",WYD:"WHAT ARE YOU DOING",HBU:"HOW ABOUT YOU",WBU:"HOW ABOUT YOU",HRU:"HOW ARE YOU",GG:"GOOD GAME",TTYL:"TALK TO YOU LATER",IKR:"I KNOW RIGHT",SRY:"SORRY",PPL:"PEOPLE",ABT:"ABOUT",TMRW:"TOMORROW",TMR:"TOMORROW",TOMOZ:"TOMORROW",TDY:"TODAY",BDAY:"BIRTHDAY",RN:"RIGHT NOW",TBH:"HONESTLY",NGL:"HONESTLY",THNKS:"THANKS",THANKU:"THANK YOU",PLZZ:"PLEASE",PLSS:"PLEASE",MSG:"MESSAGE",TILL:"UNTIL",TIL:"UNTIL"},Yn=/^\s*(?:(?:what(?:'s|\s+is)|whats|calculate|compute|solve|evaluate|work\s+out|how\s+much\s+is)\b[\s:]*)?/i;function Un(e){let t=Yn.exec(e)[0],a=e.slice(t.length).replace(/[\s?=]+$/,"");return!/^[\d\s.,+\-−–*×xX/÷^%()]+$/.test(a)||!/\d/.test(a)||!/[+\-−–*×xX/÷^%]/.test(a)||!(t.trim()!==""||/[+*×^÷]/.test(a)||/\d\s+[-−–/]\s+\d/.test(a)||/\d\s*[xX]\s*\d/.test(a))?e:t+a.replace(/(\d),(?=\d{3}(?!\d))/g,"$1").replace(/\(/g," OPEN ").replace(/\)/g," CLOSE ").replace(/\+/g," PLUS ").replace(/[-−–]/g," MINUS ").replace(/[*×xX]/g," TIMES ").replace(/[/÷]/g," DIVIDED BY ").replace(/\^/g," TO THE POWER OF ").replace(/%/g," PERCENT ")}function Be(e,t=!1){let a=String(e||"").replace(/[‘’ʼ`´]/g,"'").trim();t||(a=Un(a)),a=a.replace(/(\d)\.(?=\d)/g,"$1 POINT "),t||(a=a.replace(/(\d)\s*%/g,"$1 PERCENT ").replace(/(\d)\s*\+\s*(?=\d)/g,"$1 PLUS "));for(let[n,s]of Mn)a=a.replace(n,s);a=a.replace(/&/g," and ").toUpperCase(),a=a.replace(t?/[^A-Z0-9*_^#$ ]+/g:/[^A-Z0-9 ]+/g," ");let r=[];for(let n of a.split(/\s+/))n&&r.push(Object.prototype.hasOwnProperty.call(La,n)?La[n]:n);return r.join(" ")}function hr(e){let t=At(e).trim();if(!t)return[""];let a=t.split(/(?<=[.!?])\s+/).map(r=>r.trim()).filter(Boolean);return a.length?a:[t]}var vn=new Set(["HI","HELLO","HEY","HOWDY","YO","GREETINGS","HI THERE","HELLO THERE","HEY THERE"]);function pr(e){let t=String(e||"").split(/(?<=[.!?…])\s+|\n+/).map(a=>a.trim()).filter(a=>/[A-Za-z0-9]/.test(a));return t.length?t:[String(e||"").trim()]}function At(e){return String(e||"").replace(/\[sing[^\]]*\]([\s\S]*?)\[\/sing\]/gi,(t,a)=>{let r="",n=!1;for(let s of a.split(/\s+/)){let l=s.indexOf("=");if(l<=0)continue;let i=s.slice(l+1).replace(/~/g,""),c=i.replace(/-$/,"");c&&(r+=(r&&!n?" ":"")+c,n=i.endsWith("-"))}return r?`\u266A ${r} \u266A`:"\u266A (singing) \u266A"}).replace(/\[[a-zA-Z_/][^\]]*\]/g,"").replace(/\s{2,}/g," ").replace(/\s+([,.!?;:])/g,"$1").trim()}var fr=["wave","wink","nod","smile","laugh","think","surprised","shake","shrug","tilt","bow","thumbsup","blink","lookleft","lookright","lookup","lookdown","walk","dance","stretch","squat","rest"],dr={grin:"smile",giggle:"laugh",chuckle:"laugh",hmm:"think",surprise:"surprised",headshake:"shake",thumbup:"thumbsup"},Qa={happy:"happy",cheerful:"happy",excited:"excited",calm:"calm",gentle:"calm",soft:"calm",sad:"sad",serious:"serious",dramatic:"serious",urgent:"serious",angry:"serious",laughing:"happy",chuckling:"happy",giggling:"happy",reset:"",normal:"",modal:"","/voice":"","/laughing":"","/chuckling":"","/giggling":""},lo={laugh:1270,chuckle:890,giggle:1150,guffaw:2890,cackle:1700,snicker:790,hoho:1110,hehe:1e3,nervous:1150,evil:1990,exhale:560,gasp:320,sigh:1110,yawn:1990,sniff:340,pant:1220,phew:780,hmm:670,mm:660,mhm:560,"uh-huh":560,"uh-uh":540,"uh-oh":690,uh:430,um:580,huh:360,aha:630,oh:520,ooh:670,aww:820,ahh:830,ugh:410,eww:690,hum:1710,groan:1020,scream:990,sob:2900,whimper:990,shh:940,psst:440,tsk:470,kiss:660,brr:860,grr:890,raspberry:690,whistle:1040,fweet:430,cough:810,ahem:760,hiccup:330,sneeze:890,snore:2140},Cn=Object.keys(lo);function Ir(e){let t=e.split("=")[0].toLowerCase().replace(/_/g,"-");return Object.prototype.hasOwnProperty.call(lo,t)?t:""}var Dn={laugh:"(laughs)",chuckle:"(chuckles)",giggle:"(giggles)",guffaw:"(roars with laughter)",cackle:"(cackles)",snicker:"(snickers)",hoho:"ho ho ho!",hehe:"heh heh",nervous:"(laughs nervously)",evil:"(evil laugh)",exhale:"(breathes out)",gasp:"(gasps)",sigh:"(sighs)",yawn:"(yawns)",sniff:"(sniffs)",pant:"(pants)",phew:"phew!",hmm:"hmm",mm:"mmm",mhm:"mm-hm","uh-huh":"uh-huh","uh-uh":"uh-uh","uh-oh":"uh-oh!",uh:"uh",um:"um",huh:"huh?",aha:"aha!",oh:"oh!",ooh:"ooh!",aww:"aww",ahh:"ahh",ugh:"ugh",eww:"eww!",hum:"(hums)",groan:"(groans)",scream:"(screams)",sob:"(sobs)",whimper:"(whimpers)",shh:"shh!",psst:"psst!",tsk:"tsk tsk",kiss:"mwah!",brr:"brr!",grr:"grr!",raspberry:"(blows a raspberry)",whistle:"(whistles)",fweet:"(whistles)",cough:"(coughs)",ahem:"ahem",hiccup:"hic!",sneeze:"achoo!",snore:"(snores)"};function co(e){let t=/^\[([a-z-]+)\]$/i.exec(String(e||""));return t?Dn[t[1].toLowerCase()]||`(${t[1].toLowerCase()})`:String(e||"")}var Pn={thumbsup:"Thumbs up",lookleft:"Look left",lookright:"Look right",lookup:"Look up",lookdown:"Look down",shake:"Shake head"};function Zt(e){return typeof e=="string"&&/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(e)}function za(e){return e.children.filter(t=>t.tag==="stop"&&Zt(t.attrs.target))}function ho(e){if(e?.displayText)return e.displayText;let t=[];for(let r of e?.cues||[])if(r.type==="action"&&r.sound)t.push(co(`[${r.name}]`));else if(r.name&&(r.type==="action"||r.type==="mood")){let n=Pn[r.name]||r.name.charAt(0).toUpperCase()+r.name.slice(1);t.push(`[${n}]`)}let a=e?.showcase||e?.tour?.[0]?.target;return a&&t.push(`[Show ${a}]`),t.join(" ")}var Za=new Set("cheerful happy excited calm sad serious dramatic urgent fast slow louder softer whisper gentle soft loud quiet laughing chuckling giggling /laughing /chuckling /giggling /whisper pause inhale reset male female deep husky bright crisp elder mellow woman_a woman_b man_a man_b soprano alto tenor baritone bass_singer folds pulse modal normal /voice".split(" "));function xa(e){let t=e.split("=")[0].toLowerCase().replace(/[-_]/g,"");return fr.includes(t)?t:ut(dr,t)?dr[t]:""}function ur(e){let t=/=\s*([0-9]*\.?[0-9]+)\s*(ms|s)?$/i.exec(e);if(!t)return 0;let a=parseFloat(t[1]);return Math.round(Math.max(150,Math.min(8e3,(t[2]||"s").toLowerCase()==="ms"?a:a*1e3)))}var Gn=e=>e.split(/[\s-]+/).filter(t=>/[A-Za-z0-9]/.test(t)).reduce((t,a)=>t+(/^[^A-Za-z]*cannot[^A-Za-z]*$/i.test(a)?2:1),0),Bn=e=>e.split(/\s+/).filter(t=>/=./.test(t)).length;function po(e){let t=String(e||""),a=[],r="",n=0,s=0,l=g=>{s&&(g.pauseMs=s),a.push(g)},i=!1,c=g=>{r+=g,n+=i?Bn(g):Gn(g)},p=/\[([^\]]*)\]/g,h=0,o;for(;(o=p.exec(t))!==null;){c(t.slice(h,o.index)),h=o.index+o[0].length;let g=o[1].trim();if(!/^[a-zA-Z_/]/.test(g)){c(o[0]);continue}let H=g.toLowerCase();if(H==="/sing"){i=!1,r+=o[0];continue}if(/^sing\b/.test(H)||/[,\s]sing\b/.test(H)){i=!0,r+=o[0];continue}let N=g.split(/[,\s]+/).filter(Boolean),f=[];for(let S of N){let L=Ir(S);if(L){l({type:"action",name:L,word:n,ms:ur(S)||lo[L],sound:!0}),n+=1,f.push(S);continue}let F=xa(S);if(F){let B=ur(S);l(B?{type:"action",name:F,word:n,ms:B}:{type:"action",name:F,word:n});continue}let U=S.toLowerCase(),z=/^pause=(\d+(?:\.\d+)?|\.\d+)(ms|s)?$/.exec(U);if(z){let B=z[2]?z[2]==="s":z[1].includes(".");s+=Math.max(10,Math.min(1e4,Number(z[1])*(B?1e3:1)))}Object.prototype.hasOwnProperty.call(Qa,U)&&l({type:"mood",name:Qa[U],word:n}),(S.includes("=")||Za.has(U))&&f.push(U==="soft"?"style=soft":S)}f.length===N.length&&f.every((S,L)=>S===N[L])?r+=o[0]:f.length&&(r+=`[${f.join(", ")}]`)}return c(t.slice(h)),{speechText:Vn(r).replace(/[ \t]{2,}/g," ").replace(/[ \t]+([,.!?;:])/g,"$1").trim(),cues:a,wordCount:n}}var Kn={Mon:"Monday",Tue:"Tuesday",Tues:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Thur:"Thursday",Thurs:"Thursday",Fri:"Friday",Sat:"Saturday",Sun:"Sunday"},Sr=String.raw`(?:\s?[-–&,/]\s?|\s+(?:to|and|or|through|until)\s+)`,_n=new RegExp(String.raw`(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*\.?${Sr}$`),Fn=new RegExp(String.raw`^${Sr}(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)`);function Vn(e){return String(e).replace(/\b(Mon|Tues?|Wed|Thu(?:rs?)?|Fri|Sat|Sun)\b\.?/g,(t,a,r,n)=>{let s=n.slice(Math.max(0,r-16),r),l=n.slice(r+t.length,r+t.length+16);if(!(_n.test(s)||Fn.test(l)||/^\s*:?\s*\d/.test(l)||/\b(?:on|every|each|until|till|from|since|by|this|next|last)\s+$/i.test(s)))return t;let c=t.endsWith(".")&&/^(?:\s+[A-Z"“]|\s*$)/.test(n.slice(r+t.length));return Kn[a]+(c?".":"")}).replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm)?)\s?[-–]\s?(?=Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm))/gi,"$1 to ").replace(/(^|[^\d.–-])(\d{1,2})\s?[-–]\s?(\d{1,2})(?![-–\d])/g,"$1$2 to $3").replace(/(^|[^\w$.(])(\(?\+?\d[\d ().-]{5,}\d)(?![\w%])/g,(t,a,r)=>{let n=r.trim(),s=n.replace(/\D/g,"");if(!(/^\(?\+/.test(n)||s.length>=9||/^\d{3}[-.]\d{4}$/.test(n))||/^\d{1,2}[.-]\d{1,2}[.-]\d{2,4}$/.test(n))return t;let i=n.replace(/\+/,"").split(/[ ().-]+/).filter(Boolean).map(c=>c.split("").join(" "));return`${a}${n.includes("+")?"plus ":""}${i.join(", ")}`})}var qn=[[/\bi am\b/gi,"__P_YOU_ARE__"],[/\byou are\b/gi,"__P_I_AM__"],[/\bmy\b/gi,"__P_YOUR__"],[/\byour\b/gi,"__P_MY__"],[/\bmine\b/gi,"__P_YOURS__"],[/\byours\b/gi,"__P_MINE__"],[/\bmyself\b/gi,"__P_YOURSELF__"],[/\byourself\b/gi,"__P_MYSELF__"],[/\bi\b/gi,"__P_YOU__"],[/\bme\b/gi,"__P_YOU__"]];function zn(e){let t=String(e||"");for(let[a,r]of qn)t=t.replace(a,r);return t.replace(/__P_YOU_ARE__/g,"you are").replace(/__P_I_AM__/g,"I am").replace(/__P_YOUR__/g,"your").replace(/__P_MY__/g,"my").replace(/__P_YOURS__/g,"yours").replace(/__P_MINE__/g,"mine").replace(/__P_YOURSELF__/g,"yourself").replace(/__P_MYSELF__/g,"myself").replace(/__P_YOU__/g,"you")}var Xt={ZERO:0,ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,SIX:6,SEVEN:7,EIGHT:8,NINE:9,TEN:10,ELEVEN:11,TWELVE:12,THIRTEEN:13,FOURTEEN:14,FIFTEEN:15,SIXTEEN:16,SEVENTEEN:17,EIGHTEEN:18,NINETEEN:19,TWENTY:20,THIRTY:30,FORTY:40,FIFTY:50,SIXTY:60,SEVENTY:70,EIGHTY:80,NINETY:90},ia={HUNDRED:100,THOUSAND:1e3,MILLION:1e6,BILLION:1e9},ut=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);function uo(e,t){let a=e[t];if(a===void 0)return null;if(/^\d+$/.test(a)){let c=Number(a),p=t+1;return e[p]==="POINT"&&/^\d+$/.test(e[p+1]||"")&&(c=+`${a}.${e[p+1]}`,p+=2),ut(ia,e[p]||"")&&(c*=ia[e[p]],p++),{value:c,next:p}}let r=0,n=0,s=!1,l=t;for((a==="A"||a==="AN")&&ut(ia,e[t+1]||"")&&(n=1,s=!0,l=t+1);l<e.length;l++){let c=e[l];if(ut(Xt,c))n+=Xt[c],s=!0;else if(c==="HUNDRED"&&s)n=(n||1)*100;else if(ut(ia,c)&&s)r+=(n||1)*ia[c],n=0;else{if(c==="AND"&&s&&ut(Xt,e[l+1]||""))continue;break}}if(!s)return null;let i=r+n;if(e[l]==="POINT"){let c="",p=l+1;for(;p<e.length;p++){let h=e[p];if(/^\d+$/.test(h))c+=h;else if(ut(Xt,h)&&Xt[h]<=9)c+=Xt[h];else break}c&&(i=+`${i}.${c}`,l=p)}return{value:i,next:l}}var jn=new Set("WHAT IS ARE WHATS CALCULATE COMPUTE SOLVE EVALUATE WORK OUT HOW MUCH TELL ME CAN YOU PLEASE DOES DO THE".split(" ")),$n=new Set("PLUS MINUS TIMES DIVIDED MULTIPLIED OVER TAKE ADD SUBTRACT SQUARED CUBED".split(" ")),Xn=new Set("EQUAL EQUALS EQ PLEASE IS MAKE MAKES".split(" "));function br(e){return String(e).toUpperCase().replace(/(\d),(?=\d{3}(?!\d))/g,"$1").replace(/(\d)\.(?=\d)/g,"$1 POINT ").replace(/([A-Z])-(?=[A-Z])/g,"$1 ").replace(/<=/g," LE ").replace(/>=/g," GE ").replace(/!=/g," NE ").replace(/={1,2}/g," EQ ").replace(/</g," LT ").replace(/>/g," GT ").replace(/\(/g," OPEN ").replace(/\)/g," CLOSE ").replace(/\+/g," PLUS ").replace(/[-−–]/g," MINUS ").replace(/[*×]/g," TIMES ").replace(/[/÷]/g," OVER ").replace(/\^/g," POWER ").replace(/%/g," PERCENT ").replace(/(\d)\s*X\s*(?=\d)/g,"$1 TIMES ").replace(/[^A-Z0-9 ]+/g," ").trim().split(/\s+/).filter(Boolean)}function eo(e){let t=br(e),a=0;for(;a<t.length&&jn.has(t[a]);)a++;let r=t.length;for(;r>a&&Xn.has(t[r-1]);)r--;let n=t.slice(a,r);if(!n.length||n.length>40)return null;let s=n[0];if(s==="DIVIDE"||s==="MULTIPLY"||s==="TIMES"){let f=n.indexOf("BY");f>1&&(n=[...n.slice(1,f),s==="DIVIDE"?"OVER":"TIMES",...n.slice(f+1)])}else if(s==="ADD"||s==="SUM"){let f=n[1]==="UP"||n[1]==="OF"?2:1,S=n.findIndex((L,F)=>F>f&&(L==="TO"||L==="AND"||L==="PLUS"));S>f&&(n=[...n.slice(f,S),"PLUS",...n.slice(S+1)])}else if(s==="SUBTRACT"){let f=n.indexOf("FROM");f>1&&(n=[...n.slice(f+1),"MINUS",...n.slice(1,f)])}let l=0,i=0,c=(...f)=>{for(let S=0;S<f.length;S++)if(n[l+S]!==f[S])return!1;return l+=f.length,!0},p=(f="syntax")=>{throw new Error(f)},h,o=()=>{if(c("OPEN")){let S=h();return c("CLOSE")||p(),S}let f=uo(n,l);return f||p(),l=f.next,f.value},I=()=>{let f=o();for(;;){if(c("SQUARED"))f*=f;else if(c("CUBED"))f**=3;else if(n[l]==="PERCENT"&&n[l+1]!=="OF")l++,f/=100;else return f;i++}},g,H=()=>{let f=I();return c("TO","THE","POWER","OF")||c("TO","THE","POWER")||c("RAISED","TO")||c("POWER")?(i++,f**g()):f};g=()=>{if(c("MINUS")||c("NEGATIVE"))return-g();if(c("PLUS")||c("THE"))return g();if(c("SQUARE","ROOT","OF")||c("SQUARE","ROOT")||c("SQRT")||c("ROOT","OF")){i++;let f=g();return f<0&&p(),Math.sqrt(f)}return c("HALF","OF")||c("HALF")?(i++,g()/2):c("DOUBLE")||c("TWICE")?(i++,g()*2):c("TRIPLE")?(i++,g()*3):H()};let N=()=>{let f=g();for(;;){if(c("TIMES")||c("MULTIPLIED","BY")||c("X"))f*=g();else if(c("DIVIDED","BY")||c("OVER")){let S=g();S===0&&p("div0"),f/=S}else if(c("MOD")||c("MODULO")){let S=g();S===0&&p("div0"),f%=S}else if(c("PERCENT","OF"))f=f/100*g();else return f;i++}};h=()=>{let f=N();for(;;){if(c("PLUS")||c("ADDED","TO")||c("ADD"))f+=N();else if(c("MINUS")||c("TAKE","AWAY")||c("SUBTRACT"))f-=N();else return f;i++}};try{let f=h(),S=n[l];if(S==="LT"||S==="GT"||S==="LE"||S==="GE"||S==="EQ"||S==="NE"){l++;let L=h();i++,f=S==="LT"?f<L:S==="GT"?f>L:S==="LE"?f<=L:S==="GE"?f>=L:S==="EQ"?f===L:f!==L}return l!==n.length||typeof f=="number"&&!Number.isFinite(f)?null:{value:f,ops:i}}catch(f){return f.message==="div0"?{divideByZero:!0,value:NaN,ops:1}:null}}function Jn(e,t){if(t!==void 0&&t!==""){let a=Math.max(0,Math.min(10,parseInt(t,10)||0));return String(Number(e.toFixed(a)))}return String(Math.round(e*1e8)/1e8)}function Hr(e){let t=[];return/IES$/.test(e)&&t.push(`${e.slice(0,-3)}Y`),/(CH|SH|X|SS|O)ES$/.test(e)&&t.push(e.slice(0,-2)),/[^S]S$/.test(e)&&t.push(e.slice(0,-1)),t}function mr(e){let t=new Set,a=1;for(let r of e){let n=Be(r,!1);n&&(t.add(n),a=Math.max(a,n.split(" ").length))}return{maxWords:a,phrases:t,sample:[...t][0]||"",match(r){return t.has(r)?r:Hr(r).find(n=>t.has(n))||""}}}var Er={number:{maxWords:8,sample:"7",match(e){let t=e.split(" "),a=uo(t,0);return a&&a.next===t.length?e:""}},calculation:{maxWords:30,sample:"12 TIMES 12",match(e){let t=eo(e);return t&&t.ops>0&&typeof t.value!="boolean"?e:""}}},ja=new Set(["I","MY","ME","MINE","MYSELF"]),gr=new Set(["YOU","YOUR","YOURS","YOURSELF"]),gt=e=>e.charCodeAt(0)===60,Qn=/^ZZSET([A-Z0-9_]+)ZZ$/,Ia=[],Zn=new Set("SO WELL OK AND BUT UM UH HMM OH AH ALSO ACTUALLY ANYWAY LOL HAHA HA HEH HEHE AW AWW OOH WOW LISTEN LOOK HONESTLY BASICALLY SORRY JUST THEN YES".split(" ")),xn=new Set("THEN THOUGH ANYWAY ANYWAYS AGAIN EXACTLY PLEASE TOO ALREADY ACTUALLY MATE BUDDY DUDE BRO MAN PAL HUH EH RIGHT LOL HAHA THANKS".split(" ")),es=new Set("ACTUALLY REALLY JUST EVEN BASICALLY LITERALLY HONESTLY TOTALLY SIMPLY".split(" ")),$a={IS:"ARE",ARE:"IS",DO:"DOES",DOES:"DO",HAS:"HAVE",HAVE:"HAS",WAS:"WERE",WERE:"WAS"},ts=[["TO","BE","HONEST"],["I","GUESS"],["I","SUPPOSE"],["I","THINK"],["BY","THE","WAY"],["AS","WELL"],["RIGHT","NOW"],["AT","THE","MOMENT"],["OR","NOT"],["OR","WHAT"],["FOR","ME"],["THANK","YOU"]];function as(e){let t=0,a=e.length;for(;;){if(a-t>1&&xn.has(e[a-1])){a--;continue}let s=ts.find(l=>a-t>l.length&&l.every((i,c)=>e[a-l.length+c]===i));if(s){a-=s.length;continue}if(a-t>1&&Zn.has(e[t])){t++;continue}break}let r=t===0&&a===e.length?e:e.slice(t,a),n=r.filter(s=>!es.has(s));return n.length&&n.length<r.length?n:r}var os=new Set("SAD BAD AWFUL TERRIBLE HORRIBLE TIRED EXHAUSTED EXHAUSTING ANNOYING ANNOYED ANGRY UPSET HATE HATED HATES WORST WORSE SICK ILL HURT HURTS PAIN PAINFUL LONELY ALONE DEPRESSED DEPRESSING STRESSED STRESSFUL WORRIED SCARED AFRAID BORING BORED HARD DIFFICULT TOUGH ROUGH BROKE LOST FAILED FAIL CRY CRYING CRIED DIED DEAD UNFAIR RUDE MEAN NERVOUS ANXIOUS FRUSTRATED FRUSTRATING DISAPPOINTED DISAPPOINTING SUCKS SUCKED UGH UNFORTUNATELY STRUGGLING STUCK MISERABLE UNHAPPY HEARTBROKEN DUMPED FIRED NIGHTMARE DISASTER MESS MISSED FORGOT RUINED DREADFUL GROSS NASTY STUPID DRAINING LOUSY".split(" ")),rs=new Set("GOOD GREAT AWESOME AMAZING WONDERFUL FANTASTIC LOVE LOVED LOVELY HAPPY EXCITED EXCITING FUN NICE BEST BEAUTIFUL BRILLIANT EXCELLENT GLAD PROUD WON WIN PASSED PERFECT DELICIOUS ENJOY ENJOYED COOL SWEET YAY FINALLY PROMOTED ENGAGED HOLIDAY VACATION PARTY RELAXING RELAXED THRILLED INCREDIBLE LUCKY GORGEOUS TASTY YUM YUMMY CELEBRATING".split(" "));function ns(e){let t=0;return e.forEach((a,r)=>{let n=e[r-1]==="NOT"||e[r-1]==="NO"||e[r-1]==="NEVER"||e[r-2]==="NOT";os.has(a)?t+=n?1:-1:rs.has(a)&&(t+=n?-1:1)}),t>0?"positive":t<0?"negative":"neutral"}var ss=new Set("WHO WHAT WHERE WHEN WHY HOW WHICH WHOSE DO DOES DID CAN COULD WILL WOULD SHOULD IS ARE AM WAS WERE HAVE HAS ANY".split(" ")),is=/ (I NEED|I WANT|I WOULD LIKE|I AM LOOKING FOR|I CANNOT|I COULD NOT|HOW DO I|HOW CAN I|CAN YOU HELP|PLEASE HELP|HELP ME|HELP WITH|PROBLEM|ISSUE|ERROR|BROKEN|NOT WORKING|DOES NOT WORK|LOCKED|COMPLAINT|MY (?:ORDER|ACCOUNT|ADDRESS|DELIVERY|PAYMENT|CARD|SUBSCRIPTION|BOOKING|PASSWORD|LOGIN|INVOICE|PARCEL|PACKAGE|REFUND|TICKET|APPOINTMENT|RESERVATION|PURCHASE)) /;function ls(e){let t=Be(e,!1);return/^[A-Z]{4,}$/.test(t)&&(!/[AEIOUY]/.test(t)||/[BCDFGHJKLMNPQRSTVWXZ]{6,}/.test(t))?"gibberish":is.test(` ${t} `)?"request":/\?\s*$/.test(String(e))||ss.has(t.split(" ")[0])?"question":"statement"}function Nr(e){if(!e||e.type==="text")return"";let t=Object.entries(e.attrs||{}).map(([a,r])=>` ${a}="${r}"`).join("");return`<${e.tag}${t}>${(e.children||[]).map(Nr).join("")}`}function ot(e){return e?e.type==="text"?e.value:(e.children||[]).map(ot).join(""):""}function Bt(e,t,a=0,r=0,n=[],s=null){if(a===e.length&&r===t.length)return n;if(a>=e.length)return null;let l=e[a];if(l==="#"||l==="^"){for(let c=r;c<=t.length;c++){let p=t.slice(r,c).join(" "),h=Bt(e,t,a+1,c,[...n,p],s);if(h)return h}return null}if(l==="_"||l==="*"){if(r>=t.length)return null;for(let c=r+1;c<=t.length;c++){let p=t.slice(r,c).join(" "),h=Bt(e,t,a+1,c,[...n,p],s);if(h)return h}return null}if(r>=t.length)return null;if(gt(l)){let c=s?s(l.slice(1,-1)):null;if(!c)return null;for(let p=Math.min(t.length,r+c.maxWords);p>r;p--){let h=c.match(t.slice(r,p).join(" "));if(!h)continue;let o=Bt(e,t,a+1,p,[...n,h],s);if(o)return o}return null}return(l.startsWith("$")?l.slice(1):l)===t[r]?Bt(e,t,a+1,r+1,n,s):null}var Jt=new Set(["*","_","#","^"]);function cs(e){let t=0,a=0;for(let s of e.patTokens)s.startsWith("$")?t=t*8+7:s==="#"?t=t*8+6:s==="_"?t=t*8+5:s==="^"?t=t*8+2:s==="*"?t=t*8+1:gt(s)?t=t*8+3:t=t*8+4,gt(s)?a+=.5:Jt.has(s)||(a+=1);let r=e.topic!=="*"?1e12:0,n=e.that!=="*"?1e9:0;return r+n+a*1e6+t}var Rr=new Set("A AN THE IS ARE AM BE DO DOES DID YOU YOUR I ME MY WE OUR IT ITS TO OF IN ON AT FOR AND OR SO WHAT WHEN WHERE WHO HOW WHY CAN COULD WOULD WILL SHOULD PLEASE TELL HAVE HAS THAT THIS THERE ANY SOME WITH ABOUT".split(" ")),Or=new Set([...Rr].concat("GET GOT NEED WANT KNOW MUCH MANY LONG TAKE MAKE GO GOING JUST REALLY VERY ALSO TOO NOW THEN THAN FROM BY AS IF BUT NOT NO YES OK HI HELLO HEY THANK THANKS MORE MOST ALL EACH EVERY ANYTHING SOMETHING THING STUFF WAY KIND SORT LOT BIT GIVE SHOW SEE LOOK USE BEEN WAS WERE MIGHT MAY MUST LET HERE WHICH THEY THEM THEIR HE SHE HIS HER US ONE GOOD GREAT NEW RIGHT SURE QUESTION WONDER ASK SAY OUT UP DOWN OFF INTO OVER AGAIN STILL YET EVER NEVER ALWAYS TODAY LIKE DOING DONE HAD BEING DOE ACTUALLY MAYBE QUICK".split(" ")));function Ot(e){let t=e;if(t.length<=3)return t;let a=(r,n,s="")=>t.endsWith(r)&&t.length-r.length>=n?(t=t.slice(0,t.length-r.length)+s,!0):!1;return!a("IES",2,"Y")&&!/(SS|US|IS)$/.test(t)&&a("S",3),a("ION",4)||a("MENT",3)||a("ING",3)||a("ED",4)||a("LY",4),t.length>5&&a("Y",4),t.length>6&&a("ER",4),t.length>4&&t[t.length-1]===t[t.length-2]&&!/[AEIOU]/.test(t[t.length-1])&&(t=t.slice(0,-1)),t.length>4&&a("E",3),t}var hs={price:"price prices pricing cost costs fee fees charge charges rate rates expensive cheap affordable quote tariff",shipping:"ship ships shipping shipped shipment delivery deliver delivered delivering postage freight courier dispatch parcel arrive arrives arrival",returns:"return returns returning refund refunds refunded exchange exchanges reimburse reimbursement",hours:"hours open opening opens close closes closing closed shut shuts schedule",contact:"contact contacting reach message enquiry inquiry enquire inquire",phone:"phone telephone call calling ring mobile",talk:"talk talking speak speaking chat chatting",email:"email emails emailing mail",location:"location located locations address where directions based office offices store stores shop shops branch branches showroom",buy:"buy buying bought purchase purchasing order ordering orders checkout",discount:"discount discounts coupon coupons promo promotion promotions sale sales deal deals voucher vouchers offer offers",account:"account accounts login signin signup register registration password profile",cancel:"cancel cancelling canceling cancellation cancelled unsubscribe terminate",payment:"pay paying paid payment payments card cards paypal invoice invoices billing bill visa mastercard",trial:"trial trials demo demos sample samples preview",support:"support help assist assistance helpdesk troubleshoot troubleshooting",warranty:"warranty warranties guarantee guaranteed guarantees",tracking:"track tracking tracked status",install:"embed embedding install installing installation integrate integration setup plugin widget",download:"download downloads downloading export exporting",docs:"docs documentation guide guides manual tutorial tutorials instructions",about:"about company business team story mission history",security:"safe safety secure security privacy private gdpr",jobs:"job jobs career careers hiring vacancy vacancies employment recruit recruiting",size:"size sizes sizing fit fits measurement measurements",features:"feature features function functions capability capabilities",stock:"stock available availability inventory"},ka=new Map,ps=new Map;for(let[e,t]of Object.entries(hs)){let a=t.toUpperCase().split(" ");ps.set(e,a);for(let r of a)ka.has(Ot(r))||ka.set(Ot(r),e)}var ds=[[["MONEY","BACK"],"REFUND"],[["GET","IN","TOUCH"],"CONTACT"],[["LOG","IN"],"LOGIN"],[["SIGN","IN"],"LOGIN"],[["SIGN","UP"],"REGISTER"],[["SET","UP"],"SETUP"],[["SEND","BACK"],"RETURN"],[["HOW","FAR"],"LOCATION"],[["IN","STOCK"],"AVAILABLE"],[["OPENING","TIMES"],"HOURS"],[["ON","MY","SITE"],"EMBED"],[["ON","MY","WEBSITE"],"EMBED"],[["ON","MY","PAGE"],"EMBED"],[["TO","MY","SITE"],"EMBED"],[["TO","MY","WEBSITE"],"EMBED"],[["HOW","MUCH"],"PRICE",["IS","DOES","DO","ARE","FOR","WOULD","WILL","IT","THAT","THIS"]]];function us(e){let t=e;for(let[a,r,n]of ds)for(let s=0;s+a.length<=t.length;s++){if(!a.every((i,c)=>t[s+c]===i))continue;let l=t[s+a.length];n&&l!==void 0&&!n.includes(l)||(t=[...t.slice(0,s),r,...t.slice(s+a.length)])}return t}function Et(e){if(Or.has(e))return"";let t=Ot(e);if(t.length<2||Or.has(t))return"";let a=ka.get(t);return a?`@${a}`:t}function ms(e){let t=e.join(" ").toLowerCase();return t?t[0].toUpperCase()+t.slice(1):""}var Es=new Set("star thatstar topicstar bot get set think srai sr random li condition uppercase lowercase formal sentence person person2 date time size version input that request response br emote gesture reply button chip suggest oob chips map calc explode count daysuntil fallback try name value text postback persona showcase tour stop".split(" ")),Ar="";function Tr(e,t,a){if(Math.abs(e.length-t.length)>a)return a+1;let r=e.length+1,n=t.length+1,s=null,l=Array.from({length:n},(i,c)=>c);for(let i=1;i<r;i++){let c=[i],p=i;for(let h=1;h<n;h++){let o=e[i-1]===t[h-1]?0:1,I=Math.min(l[h]+1,c[h-1]+1,l[h-1]+o);s&&i>1&&h>1&&e[i-1]===t[h-2]&&e[i-2]===t[h-1]&&(I=Math.min(I,s[h-2]+1)),c[h]=I,I<p&&(p=I)}if(p>a)return a+1;s=l,l=c}return l[n-1]}var gs=new Set("AND OR WHAT ABOUT HOW IS ARE THERE ANY DO YOU HAVE GOT A AN THE ALSO TOO THEN PLEASE FOR OF IN WITH".split(" ")),Os=new Set(["IT","THEY","THEM","THAT","THOSE","THIS","THESE","ONE","THERE"]);function yr(e,t){for(let a=Math.min(e.maxWords,t.length);a>=1;a--)for(let r=0;r+a<=t.length;r++){let n=e.match(t.slice(r,r+a).join(" "));if(n)return{member:n,rest:[...t.slice(0,r),...t.slice(r+a)]}}return null}function As(e){let t=e.category;return t.layer!=="base"||t.firm||t.literalOnly||t.that==="*"&&t.topic==="*"?!1:e.stars.some(a=>a.split(" ").some(r=>r&&Et(r)!==""))}var Ts=e=>e.layer==="custom"&&(e.keywordIdeas.size>0||!e.patTokens.some(t=>t==="*"||t==="_")),Xa=e=>e.layer==="custom"||e.requires.length>0;function Sa(e){return String(e||"").trim().toLowerCase().replace(/\s+/g," ")}var w,ba,wr,to,Qt,Ha,la,Na,ca,ao,Ra,wa,oo,Wa,qe,Wr,ro,Lr,no,ha,kr,Mr,Yr,Ur,pa,so,Te,io,Ma=class{constructor(t={}){Wt(this,w);this.botProps={name:"Aria",role:"Website Companion",company:"bot.computer",website:"https://bot.computer",...t.botProps||{}},this.vars=new Map([["topic","*"]]),this.layers={custom:[],base:[]},this.categories=[],this.vocabulary=new Set,this.quickChips=[],this.xmlBotProps={},this.lastBotThat="",this.history=[],this.fallbackStreak=0,this._randomMemory=new WeakMap,this._defs={custom:{sets:new Map,maps:new Map},base:{sets:new Map,maps:new Map}},this._followups={},this._justVaried=!1,this._resolvingEntity=!1,this._setLookup=a=>W(this,w,Qt).call(this,a),this._sources={custom:"",base:""},this._idf=new Map,this._answerIds=new Map,this.persona=null,this._personaConfig=null,this._personaXml=null,this._personaSays=new Map,this._personaMemory={},this.random=typeof t.random=="function"?t.random:Math.random,t.baseXml&&this.loadBaseXML(t.baseXml),t.xml&&this.loadXML(t.xml),t.persona&&this.setPersona(t.persona)}setPersona(t){return this._personaConfig=$t(t),W(this,w,ba).call(this),this.persona}setBotProps(t){Object.assign(this.botProps,t||{});try{if(this._sources.base){let a=W(this,w,to).call(this,this._sources.base);this.layers.base=a.categories,this._defs.base={sets:a.sets,maps:a.maps}}if(this._sources.custom){let a=W(this,w,Ra).call(this,this._sources.custom,"custom");this.layers.custom=a.categories,this._defs.custom={sets:a.sets,maps:a.maps},this.quickChips=a.quickChips,this.xmlBotProps=a.xmlBotProps,this._personaXml=a.persona,W(this,w,ba).call(this)}W(this,w,wa).call(this)}catch{}}sampleStars(t){let a=[];for(let r of t.patTokens)r==="*"||r==="_"?a.push("\u2026"):r==="#"||r==="^"?a.push(""):gt(r)&&a.push(W(this,w,Qt).call(this,r.slice(1,-1))?.sample||"\u2026");return a}samplePhrase(t){let a=[];for(let r of t.patTokens)if(r==="*"||r==="_")a.push("something");else{if(r==="#"||r==="^")continue;if(gt(r)){let n=W(this,w,Qt).call(this,r.slice(1,-1));if(!n||!n.sample)return"";a.push(n.sample)}else a.push(r.replace(/^\$/,""))}return a.join(" ").toLowerCase()}previewTemplate(t,a=[]){let r=n=>{if(n.type==="text")return n.value;let s=()=>(n.children||[]).map(r).join("");switch(n.tag){case"star":{let l=a[Math.max(1,parseInt(n.attrs.index||"1",10))-1];return l===void 0?"\u2026":l.toLowerCase()}case"map":{let l=W(this,w,Ha).call(this,(n.attrs.name||"").toLowerCase()),i=Be(s(),!1);return l&&l.entries.get(i)||"\u2026"}case"srai":return`\u2192 ${s().toLowerCase()}`;case"bot":{let l=(n.attrs.name||"").toLowerCase();return String(this.botProps[l]||this.xmlBotProps?.[l]||"\u2026")}case"random":case"condition":{let l=(n.children||[]).find(i=>i.type==="element"&&i.tag==="li");return l?r(l):s()}case"tour":{let l=za(n)[0];return l?" "+l.children.map(r).join(""):""}case"stop":case"think":case"emote":case"gesture":case"showcase":case"reply":case"button":case"chip":case"chips":case"suggest":case"oob":return"";case"thatstar":case"topicstar":case"get":case"input":case"that":case"request":case"response":case"sr":case"try":case"date":case"time":case"calc":case"count":case"daysuntil":return"\u2026";case"fallback":case"name":case"value":return"";case"br":return" ";default:return s()}};return At(r(t)).replace(/\s+/g," ").replace(/\s+([,.!?;:])/g,"$1").trim()}lint(t=12){let a=[],r=(p,h)=>{a.length<t&&!a.some(o=>o.line===p&&o.message===h)&&a.push({line:p,message:h})},n={activeTopic:"*",activeTopicWords:["*"],lastThatWords:[]},s=new Map,l=new Set,i=(p,h)=>{for(let o of p.matchAll(/\[([^\]\n]{1,60})\]/g)){let I=o[1].trim();if(!(!/^[a-zA-Z_/]/.test(I)||/(^|[,\s])\/?sing\b/i.test(I)))for(let g of I.split(/[,\s]+/).filter(Boolean)){let H=g.split("=")[0].toLowerCase();if(Ir(g)||xa(g)||Za.has(H)||Object.prototype.hasOwnProperty.call(Qa,H)||g.includes("="))continue;let N=[...fr,...Cn].find(f=>Tr(f,H.replace(/[-_]/g,""),2)<=(H.length>4?2:1));r(h,`[${g}] is not an action or voice style, so it is left out.${N?` Did you mean [${N}]?`:""}`)}}},c=(p,h,o)=>{if(p.type==="text"){i(p.value,h);return}let I=p.line||h;if(!Es.has(p.tag))r(I,`<${p.tag}> is not a tag this engine supports. Its contents are used as plain text.`);else if(p.tag==="tour")za(p).length||r(I,"<tour> needs at least one <stop> with a valid target."),p.children.some(g=>g.type==="element"?g.tag!=="stop":g.value.trim())&&r(I,"Put each tour explanation and its gestures inside a <stop>.");else if(p.tag==="stop")o!=="tour"&&r(I,"<stop> belongs directly inside a <tour>."),Zt(p.attrs.target)||r(I,'<stop> needs a literal target such as "pricing". Use a letter followed by letters, digits, underscores or hyphens, up to 64 characters total.');else if(p.tag==="showcase")Zt(p.attrs.target)?p.children.some(g=>g.type==="element"||g.value.trim())&&r(I,"Only the target attribute of <showcase> is used. Put speech and gestures beside the tag."):r(I,'<showcase> needs a target such as "pricing". Start with a letter and use up to 64 letters, digits, underscores or hyphens.');else if(p.tag==="bot"){let g=(p.attrs.name||"").toLowerCase();g&&!String(this.botProps[g]||this.xmlBotProps?.[g]||"").trim()&&r(I,`<bot name="${g}"/> has no value yet, so nothing is said there.`)}else if(p.tag==="srai"&&(p.children||[]).every(g=>g.type==="text")){let g=Be(ot(p),!1),H=g.split(" ");if(g&&!W(this,w,qe).call(this,H,!1,n)&&!W(this,w,qe).call(this,H,!1,n,!0)){let N=ot(p).replace(/\s+/g," ").trim();r(I,`<srai>${N}</srai> does not lead to any rule, so this answer falls through to the fallback.`)}}p.tag==="map"&&p.attrs.name&&!W(this,w,Ha).call(this,p.attrs.name.toLowerCase())&&r(I,`The map "${p.attrs.name}" is not defined, so nothing is looked up there.`);for(let g of p.children||[])c(g,I,p.tag)};for(let p of this.layers.custom){for(let I of p.sets)W(this,w,Qt).call(this,I)||r(p.line,`The set "${I}" is not defined, so the pattern "${p.pattern}" can never match.`);let h=`${p.pattern}${p.that}${p.topic}`,o=s.get(h);if(o&&o.template!==p.template?r(p.line,`The pattern "${p.pattern}" is already used on line ${o.line}. Only one of them can answer.`):o||s.set(h,p),!l.has(p.template)){l.add(p.template);for(let I of p.template.children||[])c(I,p.template.line||p.line)}}return a}warmUp(){for(let t of["hello there","what are your fees for postage please","xyzzy plugh frobnicate","i like hiking a lot"])try{this.resolve(t)}catch{}}exportSession(){let{frame:t,entity:a,result:r}=this._followups;return{vars:[...this.vars.entries()],lastBotThat:this.lastBotThat,history:this.history.slice(-12),fallbackStreak:this.fallbackStreak,followups:{frame:t?{...t,stars:[...t.stars]}:null,entity:a?{...a}:null,result:r?{...r}:null,justVaried:this._justVaried}}}importSession(t){if(!(!t||typeof t!="object"))try{this.resetSession(),Array.isArray(t.vars)&&(this.vars=new Map(t.vars.filter(i=>Array.isArray(i)&&i.length===2))),this.vars.has("topic")||this.vars.set("topic","*"),typeof t.lastBotThat=="string"&&(this.lastBotThat=t.lastBotThat),Array.isArray(t.history)&&(this.history=t.history.slice(-12).filter(i=>typeof i?.user=="string"&&typeof i?.bot=="string")),this.fallbackStreak=Number(t.fallbackStreak)||0;let{frame:a,entity:r,result:n,justVaried:s}=t.followups||{},l=(i,c)=>Number.isInteger(i?.remaining)&&i.remaining>=0&&i.remaining<=c;l(a,2)&&(a.layer==="custom"||a.layer==="base")&&typeof a.pattern=="string"&&Array.isArray(a.stars)&&a.stars.every(i=>typeof i=="string")&&(this._followups.frame={pattern:a.pattern,layer:a.layer,stars:[...a.stars],remaining:a.remaining}),l(r,3)&&typeof r.phrase=="string"&&(this._followups.entity={phrase:r.phrase,remaining:r.remaining}),l(n,3)&&typeof n.value=="string"&&n.value.trim()&&Number.isFinite(Number(n.value))&&(this._followups.result={value:n.value,remaining:n.remaining}),this._justVaried=s===!0}catch{this.resetSession()}}resetSession(){this._followups={},this._justVaried=!1,this.vars.clear(),this.vars.set("topic","*"),this.lastBotThat="",this.history=[],this.fallbackStreak=0}loadXML(t){let a=W(this,w,Ra).call(this,t,"custom");return this._sources.custom=String(t||""),this.layers.custom=a.categories,this._defs.custom={sets:a.sets,maps:a.maps},this.quickChips=a.quickChips,this.xmlBotProps=a.xmlBotProps,this._personaXml=a.persona,W(this,w,ba).call(this),W(this,w,wa).call(this),{valid:!0,categories:a.categories.length,quickChips:a.quickChips,botProps:{...a.xmlBotProps,...this.botProps}}}loadBaseXML(t){let a=t?W(this,w,to).call(this,String(t)):{categories:[],sets:new Map,maps:new Map};return this.layers.base=a.categories,this._defs.base={sets:a.sets,maps:a.maps},this._sources.base=String(t||""),W(this,w,wa).call(this),{valid:!0,categories:this.layers.base.length}}resolve(t){let a=Be(t,!1);if(!a)return null;let r=W(this,w,Mr).call(this,a.split(" ")).map(U=>W(this,w,Wr).call(this,U)).flatMap(U=>ut(La,U)?La[U].split(" "):[U]),n=W(this,w,Wa).call(this),s=U=>U.layer==="custom"||U.literalOnly||U.firm||U.sets.length===U.patTokens.length||U.that!=="*"||U.topic!=="*",l=U=>{let z=W(this,w,qe).call(this,U,!1,n),B=null;return z&&As(z)&&(B=z,z=W(this,w,qe).call(this,U,!1,n,!1,!1,!0)),{hit:z,followUp:B}},{hit:i,followUp:c}=l(r);if(i&&i.category.layer==="base"&&!i.category.firm&&i.category.that==="*"&&i.category.topic==="*"){let U=W(this,w,qe).call(this,r,!1,n,!1,!0,!1,Ts);if(U)return{...U,kind:"exact"}}if(i&&s(i.category))return{...i,kind:"exact"};let p=as(r);if(p!==r){let U=l(p);if(U.hit&&s(U.hit.category))return{...U.hit,kind:"exact"};U.hit&&(r=p,i=U.hit,c=U.followUp||c)}let h=null;if(i&&(h=i,i=W(this,w,qe).call(this,r,!1,n,!1,!0),i))return{...i,kind:"exact"};let o=!!(h||c),I=us(r);if(i=(I!==r?W(this,w,qe).call(this,I,!1,n,!1,o):null)||W(this,w,no).call(this,I,n,o),i)return{...i,kind:"synonym"};if(r.some(U=>ut($a,U))&&(i=W(this,w,qe).call(this,r.map(U=>ut($a,U)?$a[U]:U),!1,n,!1,o),i))return{...i,kind:"synonym"};let g=W(this,w,ro).call(this,I),H=I!==r?W(this,w,ro).call(this,r):null;for(let U of[H,g])if(U&&(i=W(this,w,qe).call(this,U,!1,n,!1,o)||W(this,w,no).call(this,U,n,o),i))return{...i,kind:"typo"};let N=g||I;if(i=W(this,w,Lr).call(this,N,n,o,g?.75:.6),i)return{...i,kind:"loose"};let f=W(this,w,kr).call(this,N);if(f.hit)return{...f.hit,kind:"meaning",also:f.also?{...f.also,kind:"meaning"}:null};if(h)return{...h,kind:"exact"};if(c)return{...c,kind:"exact"};let S=this._followups.frame;if(S&&!this._resolvingEntity&&r.length<=6&&!r.some(U=>ja.has(U))){let U=this.layers[S.layer].find(X=>X.pattern===S.pattern&&X.continuable&&X.sets.length===1&&(!X.requires.length||W(this,w,ca).call(this,X.requires))),z=U&&W(this,w,Qt).call(this,U.sets[0]),B=z&&yr(z,r);if(B&&B.rest.every(X=>gs.has(X))){let X=U.patTokens.filter(x=>Jt.has(x)||gt(x));if(S.stars.length===X.length){let x=[...S.stars];return x[X.findIndex(gt)]=B.member,{category:U,stars:x,thatStars:[],topicStars:[],kind:"followup"}}}}let L=this._followups.result;if(L&&!this._resolvingEntity){let U=r.findIndex(B=>B==="THAT"||B==="IT"),z=U<0&&$n.has(p[0]);if(U>=0||z){let B=z?`${L.value} ${p.join(" ")}`:[...r.slice(0,U),String(L.value),...r.slice(U+1)].join(" "),X=eo(B);if(X&&X.ops>0){this._resolvingEntity=!0;try{let x=this.resolve(B);if(x&&x.kind!=="fallback")return{...x,kind:"followup"}}finally{this._resolvingEntity=!1}}}}let F=this._followups.entity;if(F&&!this._resolvingEntity){let U=r.findIndex(z=>Os.has(z));if(U>=0){this._resolvingEntity=!0;try{let z=this.resolve([...r.slice(0,U),F.phrase,...r.slice(U+1)].join(" "));if(z&&z.kind!=="fallback"&&z.kind!=="chat"&&(Xa(z.category)||z.category.sets.length>0))return{...z,kind:"followup"}}finally{this._resolvingEntity=!1}}}return i=(p!==r?W(this,w,qe).call(this,p,!1,n,!0):null)||W(this,w,qe).call(this,r,!1,n,!0)||(I!==r?W(this,w,qe).call(this,I,!1,n,!0):null)||(g?W(this,w,qe).call(this,g,!1,n,!0):null),i?{...i,kind:"chat"}:(i=W(this,w,qe).call(this,r,!0,n),i?{...i,kind:"fallback",related:f.related}:null)}findMatch(t){let a=Be(t,!1);return a?W(this,w,qe).call(this,a.split(" "),!0):null}reply(t){let a=String(t||"").trim();if(!a)return{speechText:"",displayText:"",chips:this.quickChips.slice(0,4),emote:null,showcase:"",tour:[],cues:[],cueWords:0,matchedPattern:null,matchedLayer:null,matchKind:"none"};let r=[],n=pr(a),s=n.length>1&&vn.has(Be(n[0],!1)),l=s?1:0,i=(R,k,j)=>k&&k.kind!=="fallback"&&!r.some(oe=>oe.hit.category===k.category)?(r.push({text:R,hit:k,inputIndex:j}),!0):!1;for(let R=l;R<Math.min(n.length,l+4);R++){let k=s&&R===l?`${n[0].replace(/[.!?]+$/,"")} ${n[R]}`:n[R],j=k.split(/\s+(?:and|&|plus|also|but)\s+/i);if(j.length===2){let J=this.resolve(k),re=J?.category.patTokens;if(J?.kind==="exact"&&re.some(ne=>["AND","PLUS","ALSO","BUT"].includes(ne))&&!re.some(ne=>Jt.has(ne))){i(k,J,R);continue}let[Ie,rt]=j.map(ne=>this.resolve(ne)),Pe=ne=>ne&&ne.kind!=="fallback"&&!ne.category.isCatchAll;if(Pe(Ie)&&Pe(rt)&&W(this,w,ha).call(this,Ie.category)!==W(this,w,ha).call(this,rt.category)){i(j[0],Ie,R),i(j[1],rt,R);continue}}let oe=this.resolve(k);i(k,oe,R),oe&&oe.also&&i(k,oe.also,R)}let c=!1,p=[];if(!r.length){let R=this.resolve(a);R&&r.push({text:a,hit:R,inputIndex:n.length-1}),c=!R||R.kind==="fallback",p=R&&R.related||[]}this.vars.set("didyoumean",p.length?"yes":"");let h=this.fallbackStreak;this.fallbackStreak=c?this.fallbackStreak+1:0,W(this,w,Yr).call(this,a);let o={chips:[],emote:null,showcase:"",tour:null,streakBefore:h,inputs:n},I=[];for(let R of r.slice(0,3)){o.inputIndex=R.inputIndex;let k=W(this,w,pa).call(this,R.hit,R.text,0,o).replace(/\s+/g," ").trim();k&&I.push(k)}let g=r.length===1&&r[0].hit.kind!=="fallback"&&o.answeredBy||r[0]?.hit||null;(g&&g.kind==="fallback"||o.fellBack)&&(c=!0),o.related&&o.related.length&&(p=o.related);let H=c?"":o.showcase,N=c?[]:o.tour||[];N[0]?.text&&I.push(N[0].text);let f=I.length||H||N.length?I.join(" "):`I'm not sure about that yet, but I'm happy to help with questions about ${this.botProps.company||"our site"}!`,S=String(this.vars.get("voicestyle")||"").trim().toLowerCase(),L=N.length?f:W(this,w,Ur).call(this,f,{isFallback:c,first:g,plans:r,sideEffects:o,style:S}),F=R=>{let k=po(R&&S&&Za.has(S)?`[${S}] ${R}`:R);return{speechText:k.speechText,displayText:At(R),cues:k.cues,cueWords:k.wordCount}},U=F(L),z=N.map((R,k)=>({target:R.target,...k===0?U:F(R.text)})),B=At(f),X=hr(B);this.lastBotThat=X[X.length-1]||B,this.history.push({user:a,bot:B}),this.history.length>50&&this.history.shift();for(let[R,k]of Object.entries(this._followups))k.remaining===0?delete this._followups[R]:k.remaining--;!c&&g&&g.category.varies&&!r.some(R=>R.hit.category.replaysLastAsk||R.hit.category.that!=="*")&&this.vars.set("lastask",a);let x=Be(a,!1).split(" "),We=[...[...this._defs.base.maps.values()].map(R=>R.keys),...this._defs.custom.sets.values(),...[...this._defs.custom.maps.values()].map(R=>R.keys)];for(let R of We){let k=yr(R,x);k&&(this._followups.entity={phrase:k.member,remaining:3})}o.calcValue!==void 0&&(this._followups.result={value:o.calcValue,remaining:3}),this._justVaried=!!(!c&&g&&g.category.varies),!c&&g&&g.category.continuable&&g.category.sets.length===1&&g.stars&&(this._followups.frame={layer:g.category.layer,pattern:g.category.pattern,stars:[...g.stars],remaining:2});let V=new Set,v=o.chips.filter(R=>!V.has(R.label)&&V.add(R.label)).slice(0,5),T=v;if(c){let R=v.length?v:this.quickChips.map(j=>({label:j,query:j})),k=new Set(p.map(j=>j.label.toLowerCase()));T=[...p,...R.filter(j=>!k.has(j.label.toLowerCase()))].slice(0,4)}let M=U.cues.find(R=>R.type==="action");return{...U,chips:T,emote:M?M.name:null,showcase:H,tour:z,matchedPattern:g?g.category.pattern:null,matchedLayer:g?g.category.layer:null,matchKind:o.fellBack?"fallback":g?g.kind:"none"}}};w=new WeakSet,ba=function(){let t=this._personaXml,a=t&&t.fields.id&&this._personaConfig&&t.fields.id!==this._personaConfig.id?{}:this._personaConfig||{};if(this.persona=t?$t({...a,...t.fields}):this._personaConfig,this._personaSays=new Map,this._personaMemory={},!!this.persona){for(let[r,n]of Object.entries(ar(this.persona))){let s=W(this,w,wr).call(this,n);s&&this._personaSays.set(r,s)}if(t)for(let[r,n]of Object.entries(t.says))this._personaSays.set(r,{type:"element",tag:"random",attrs:{},children:n})}},wr=function(t){let a=n=>`<random>${n.map(s=>`<li>${s}</li>`).join("")}</random>`,r=n=>cr(n).children.find(s=>s.type==="element"&&s.tag==="random")||null;try{return r(a(t.map(qa)))}catch{try{return r(a(t.map(n=>qa(Ln(n)))))}catch{return null}}},to=function(t){let a=s=>String(this.botProps[s]??"").trim(),r=Ia.find(s=>s.xml===t&&Object.entries(s.props).every(([l,i])=>a(l)===i));if(r)return r.parsed;let n=W(this,w,Ra).call(this,t,"base");return Ia.unshift({xml:t,props:n.patternProps,parsed:n}),Ia.length>4&&(Ia.length=4),n},Qt=function(t){for(let a of[this._defs.custom,this._defs.base]){let r=a.sets.get(t);if(r)return r;let n=a.maps.get(t);if(n)return n.keys}return ut(Er,t)?Er[t]:null},Ha=function(t){return this._defs.custom.maps.get(t)||this._defs.base.maps.get(t)||null},la=function(t,a,r){if(t.attrs&&t.attrs[a]!==void 0)return t.attrs[a];let n=(t.children||[]).find(s=>s.type==="element"&&s.tag===a);return n?W(this,w,Te).call(this,n.children,r).trim():void 0},Na=function(t,a){return(t.children||[]).filter(r=>!(r.type==="element"&&a.includes(r.tag)))},ca=function(t){return t.some(a=>String(this.botProps[a]||this.xmlBotProps?.[a]||"").trim()!=="")},ao=function(t){if(t.type==="text")return t.value;if(t.tag==="bot"){let a=String(this.botProps[(t.attrs.name||"").toLowerCase()]??"").trim();return this._patternProps&&(this._patternProps[(t.attrs.name||"").toLowerCase()]=a),a?` ${a} `:Ar}if(t.tag==="set"){let a=(t.attrs.name||ot(t)).trim().toUpperCase().replace(/[^A-Z0-9_]+/g,"_");return a?` ZZSET${a}ZZ `:""}return(t.children||[]).map(a=>W(this,w,ao).call(this,a)).join("")},Ra=function(t,a){let r=cr(t),n=r.children.find(g=>g.type==="element"&&g.tag==="aiml")||r,s=[],l=[],i={},c=new Map,p=new Map,h=null;this._patternProps={};let o=(g,H="*")=>{let N=[],f=null,S=null;for(let v of g.children||[])v.type==="element"&&(v.tag==="pattern"?N.push(v):v.tag==="that"?f=v:v.tag==="template"&&(S=v));if(!N.length||!S)return;let L=Nr(S),F=String(g.attrs.requires||"").split("|").map(v=>v.trim().toLowerCase()).filter(Boolean),U=new Set(Be(At(ot(S)),!1).split(" ").map(Et).filter(Boolean).slice(0,60)),z=(S.children||[]).filter(v=>v.type!=="text"||v.value.trim()),B=z.length===1&&z[0].tag==="srai"&&(z[0].children||[]).every(v=>v.type==="text")?Be(ot(z[0]),!1):"",X=f&&Be(ot(f),!0)||"*",x=X.split(" ").filter(Boolean),We=Be(H,!0)||"*",V=We.split(" ").filter(Boolean);for(let v of N){let T=W(this,w,ao).call(this,v),M=T.includes("|")?T.split("|"):[T];for(let R of M){if(R.includes(Ar))continue;let k=Be(R,!0);if(!k)continue;let j=k.split(" ").filter(Boolean).map(re=>{let Ie=Qn.exec(re);return Ie?`<${Ie[1].toLowerCase()}>`:re}),oe=j.filter(re=>!Jt.has(re)&&!gt(re)).map(re=>re.startsWith("$")?re.slice(1):re),J={pattern:j.join(" "),patTokens:j,sets:j.filter(gt).map(re=>re.slice(1,-1)),late:g.attrs.late==="true",firm:g.attrs.firm==="true",personaOff:g.attrs.persona==="off",varies:/<random\b/i.test(L),continuable:X==="*"&&We==="*"&&(/<map\b/i.test(L)||!/<think\b/i.test(L)),that:X,thatTokens:x,topic:We,topicTokens:V,template:S,line:g.line||1,start:g.start??-1,layer:a,literals:oe,literalOnly:oe.length===j.length,replaysLastAsk:/<get name="lastask"/i.test(L),stems:oe.map(Ot),looseKeys:oe.map(re=>Et(re)||Ot(re)),requires:F,keywordIdeas:new Set(oe.map(Et).filter(Boolean)),answerIdeas:U,needsStar:/<(star|sr|thatstar|topicstar)\b/i.test(L),selfMatching:!j.some(re=>re==="*"||re==="_"||gt(re)),aliasOf:B,isCatchAll:j.every(re=>Jt.has(re))&&X==="*"&&We==="*"};J.score=cs(J),s.push(J)}}};for(let g of n.children||[])if(g.type==="element"){if(g.tag==="bot"||g.tag==="property"||g.tag==="meta"){let H=g.attrs.name||g.attrs.key,N=g.attrs.value??ot(g).trim();H&&N&&(H.toLowerCase()==="chip"||H.toLowerCase()==="suggest"?l.push(N):i[H.toLowerCase()]=N)}else if(g.tag==="chips"||g.tag==="suggestions"){for(let H of g.children||[])if(H.type==="element"){let N=ot(H).trim();N&&l.push(N)}}else if(g.tag==="set"&&g.attrs.name){let H=(g.children||[]).filter(f=>f.type==="element").map(f=>ot(f)),N=H.length?H:ot(g).split(/[,;\n]+/);c.set(g.attrs.name.toLowerCase(),mr(N))}else if(g.tag==="map"&&g.attrs.name){let H=new Map,N=(f,S)=>{let L=Be(f,!1);L&&String(S).trim()&&H.set(L,String(S).trim())};for(let f of g.children||[])if(f.type==="element")N(f.attrs.key??f.attrs.name??"",ot(f));else for(let S of f.value.split(/\n+/)){let L=S.search(/[:=]/);L>0&&N(S.slice(0,L),S.slice(L+1))}p.set(g.attrs.name.toLowerCase(),{entries:H,keys:mr([...H.keys()])})}else if(g.tag==="persona")h=ir(g,ot);else if(g.tag==="category")o(g,"*");else if(g.tag==="topic"){let H=g.attrs.name||"*";for(let N of g.children||[])N.type==="element"&&N.tag==="category"&&o(N,H)}}let I=this._patternProps;return this._patternProps=null,{categories:s,quickChips:l,xmlBotProps:i,sets:c,maps:p,patternProps:I,persona:h}},wa=function(){this.categories=[...this.layers.custom,...this.layers.base].sort((l,i)=>i.score-l.score);let t=new Set;for(let l of this.categories){for(let i of l.literals)t.add(i);for(let i of l.thatTokens)Jt.has(i)||t.add(i)}for(let l of[this._defs.custom,this._defs.base])for(let i of[...l.sets.values(),...[...l.maps.values()].map(c=>c.keys)])for(let c of i.phrases)for(let p of c.split(" "))t.add(p);this.vocabulary=t;let a=new Map;for(let l of t){let i=Et(l);i&&(a.has(i)||a.set(i,[]),a.get(i).push(l))}this._wordsByIdea=a;let r=new Map,n=new Set;for(let l of this.categories)if(l.keywordIdeas.size){n.add(l.template);for(let i of l.keywordIdeas)r.has(i)||r.set(i,new Set),r.get(i).add(l.template)}let s=n.size;this._idf=new Map([...r].map(([l,i])=>[l,Math.log(1+s/(1+i.size))])),this._answerIds=new Map},oo=function(t,a){let r=[];if(t.topic!=="*"&&(a.activeTopic==="*"||(r=Bt(t.topicTokens,a.activeTopicWords),!r)))return null;let n=[];return t.that!=="*"&&(!a.lastThatWords.length||(n=Bt(t.thatTokens,a.lastThatWords),!n))?null:{topicStars:r,thatStars:n}},Wa=function(){let t=Be(this.vars.get("topic")||"*",!1)||"*",a=Be(this.lastBotThat||"",!1);return{activeTopic:t,activeTopicWords:t==="*"?["*"]:t.split(" "),lastThatWords:a?a.split(" "):[]}},qe=function(t,a,r=W(this,w,Wa).call(this),n=!1,s=!1,l=!1,i=null){let c=new Set(t);for(let p of this.categories){if((p.isCatchAll?!a||n:p.late!==n)||s&&!Xa(p)||l&&(p.that!=="*"||p.topic!=="*")||i&&!i(p))continue;let h=!0;for(let g of p.literals)if(!c.has(g)){h=!1;break}if(!h||p.requires.length&&!W(this,w,ca).call(this,p.requires))continue;let o=W(this,w,oo).call(this,p,r);if(!o)continue;let I=Bt(p.patTokens,t,0,0,[],this._setLookup);if(I)return{category:p,stars:I,thatStars:o.thatStars,topicStars:o.topicStars}}return null},Wr=function(t){if(!/([A-Z])\1\1/.test(t))return t;let a=t.match(/([A-Z])\1*/g)||[t],r=a.map((n,s)=>n.length>=3?s:-1).filter(n=>n>=0).slice(0,4);for(let n=0;n<1<<r.length;n++){let s=a.map((l,i)=>{let c=r.indexOf(i);return c<0?l.length>=3?l[0]:l:n>>c&1?l[0]+l[0]:l[0]}).join("");if(this.vocabulary.has(s))return s}return a.map(n=>n.length>=3?n[0]:n).join("")},ro=function(t){let a=!1,r=t.map(n=>{if(n.length<4||this.vocabulary.has(n)||/\d/.test(n)||ka.has(Ot(n))||this._wordsByIdea.has(Et(n)))return n;let s=n.length>=8?2:1,l="",i=s+1,c=!1;for(let p of this.vocabulary){if(p[0]!==n[0]||p.length<3)continue;let h=Tr(n,p,s);h<i?(l=p,i=h,c=!1):h===i&&h<=s&&(c=!0)}return l&&!c?(a=!0,l):n});return a?r:null},Lr=function(t,a=W(this,w,Wa).call(this),r=!1,n=.6){let s=new Set(t.map(h=>Et(h)||Ot(h))),l=[...new Set(t.map(Et).filter(Boolean))],i=t.some(h=>ja.has(h)),c=t.some(h=>gr.has(h)),p=null;for(let h of this.categories){if(!h.literalOnly||h.late||h.stems.length<2||t.length>h.stems.length+2||!h.keywordIdeas.size||r&&!Xa(h)||h.requires.length&&!W(this,w,ca).call(this,h.requires)||l.some(F=>!h.keywordIdeas.has(F)))continue;let o=h.literals.some(F=>ja.has(F)),I=h.literals.some(F=>gr.has(F));if(i&&!o&&I||c&&!I&&o)continue;let g=0,H=0,N=0;for(let F=0;F<h.stems.length;F++){let U=s.has(h.looseKeys[F]);U&&g++,Rr.has(h.stems[F])||(H++,U&&N++)}if(!H||N<H)continue;let f=g/h.stems.length;if(f<n)continue;let S=W(this,w,oo).call(this,h,a);if(!S)continue;let L=N*10+f;(!p||L>p.quality)&&(p={quality:L,hit:{category:h,stars:[],thatStars:S.thatStars,topicStars:S.topicStars}})}return p?p.hit:null},no=function(t,a,r=!1){let n=t.map(c=>{if(this.vocabulary.has(c))return null;let p=Et(c),h=p?this._wordsByIdea.get(p):null;if(!h||!h.length)return null;let o=Ot(c);return[...h].sort((I,g)=>+(Ot(g)===o)-+(Ot(I)===o)).slice(0,8)}),s=n.map((c,p)=>c?p:-1).filter(c=>c>=0);if(!s.length)return null;let l=c=>{let p=t.map((h,o)=>n[o]?n[o][c[o]||0]:h);return W(this,w,qe).call(this,p,!1,a,!1,r)},i=l({});for(let c=0,p=0;!i&&c<s.length&&p<20;c++)for(let h=1;!i&&h<n[s[c]].length&&p<20;h++,p++)i=l({[s[c]]:h});return i},ha=function(t){if(!t.aliasOf)return t.template;if(!this._answerIds.has(t.aliasOf)){this._answerIds.set(t.aliasOf,t.template);let a=W(this,w,qe).call(this,t.aliasOf.split(" "),!1,{activeTopic:"*",activeTopicWords:["*"],lastThatWords:[]});this._answerIds.set(t.aliasOf,a?W(this,w,ha).call(this,a.category):t.template)}return this._answerIds.get(t.aliasOf)},kr=function(t){let a=[...new Set(t.map(Et).filter(Boolean))];if(!a.length)return{hit:null,related:[]};let r=3,n=a.map(I=>this._idf.get(I)??r),s=n.reduce((I,g)=>I+g,0),l=[];for(let I of this.categories){if(I.layer!=="custom"&&!I.requires.length||I.isCatchAll||I.that!=="*"||I.topic!=="*"||I.needsStar||!I.keywordIdeas.size||I.requires.length&&!W(this,w,ca).call(this,I.requires))continue;let g=0,H=0,N=0;if(a.forEach((S,L)=>{I.keywordIdeas.has(S)?(g+=n[L],H++,L<30&&(N|=1<<L)):I.answerIdeas.has(S)&&(g+=n[L]*.35)}),!H)continue;let f=(I.keywordIdeas.size-H)/I.keywordIdeas.size;l.push({cat:I,coverage:g/s-.3*f,hitMask:N,id:W(this,w,ha).call(this,I)})}if(!l.length)return{hit:null,related:[]};l.sort((I,g)=>g.coverage-I.coverage||g.cat.score-I.cat.score);let i=[];for(let I of l)i.some(g=>g.id===I.id)||i.push(I);let[c,p]=i,h=i.filter(I=>I.coverage>=.3&&I.cat.selfMatching).slice(0,3).map(I=>({label:ms(I.cat.literals),query:I.cat.literals.join(" ").toLowerCase()})),o=I=>({category:I.cat,stars:[],thatStars:[],topicStars:[]});return p&&c.coverage>=.3&&p.coverage>=.3&&c.coverage+p.coverage>=.8&&!(c.hitMask&p.hitMask)?{hit:o(c),also:o(p),related:h}:c.coverage>=.55&&(!p||c.coverage-p.coverage>=.12)?{hit:o(c),related:h}:{hit:null,related:h}},Mr=function(t){let a=Be(this.botProps.name||"",!1).split(" ").filter(Boolean),r=a.length;if(!r||t.length<r)return t;let n=a.every((l,i)=>t[i]===l),s=a.every((l,i)=>t[t.length-r+i]===l);return t.length===r?n?["HELLO"]:t:n?t.slice(r):s?t.slice(0,-r):t},Yr=function(t="",a=new Date){let r=a.getHours();this.vars.set("inputkind",ls(t)),this.vars.set("justvaried",this._justVaried?"yes":""),this.vars.set("mood",ns(Be(t,!1).split(" "))),this.vars.set("daypart",r>=5&&r<12?"morning":r>=12&&r<17?"afternoon":"evening"),this.vars.set("dayname",a.toLocaleDateString("en-US",{weekday:"long"})),this.vars.set("fallbackstreak",String(this.fallbackStreak)),this.vars.set("suggestions",this.quickChips.length?"yes":""),this.vars.set("personality",this.persona?this.persona.id:""),this.vars.set("callsyou",this.persona?this.persona.petName:"");for(let[n,s]of Object.entries({...this.xmlBotProps,...this.botProps}))this.vars.set(`bot_${n}`,String(s||this.xmlBotProps?.[n]||"").trim())},Ur=function(t,{isFallback:a,first:r,plans:n,sideEffects:s,style:l}){if(!this.persona||s.plain)return t;let i=r?r.category:null,c=n.some(h=>h.hit.category.that!=="*"||h.hit.category.topic!=="*"),p=a?"fallback":s.personaSaid?"says":c?"context":i&&(i.layer==="custom"||i.requires.length)?"answer":"chat";return sr(t,this.persona,{kind:p,gentle:this.vars.get("mood")==="negative"||!!(i&&i.firm),varied:!!(i&&i.varies),voicestyle:l,memory:this._personaMemory,rng:this.random})},pa=function(t,a,r,n){t.category.personaOff&&n&&(n.plain=!0);let s={input:a,stars:t.stars,thatStars:t.thatStars,topicStars:t.topicStars,depth:r,sideEffects:n};return W(this,w,Te).call(this,t.category.template.children,s)},so=function(t,a,r){if(a>22)return"";let n=this.resolve(t);return n?(r.answeredBy=n,n.kind==="fallback"&&!r.fellBack&&(r.fellBack=!0,this.fallbackStreak=(r.streakBefore||0)+1,this.vars.set("fallbackstreak",String(this.fallbackStreak)),r.related=n.related||[],this.vars.set("didyoumean",r.related.length?"yes":"")),W(this,w,pa).call(this,n,t,a,r)):""},Te=function(t,a){let r="";for(let n of t||[])r+=W(this,w,io).call(this,n,a);return r},io=function(t,a){if(!t)return"";if(t.type==="text")return t.value;let r=t.tag,n=t.attrs||{};switch(r){case"star":{let s=Math.max(1,parseInt(n.index||"1",10))-1;return(a.stars[s]||"").toLowerCase().replace(/(\d) point (?=\d)/g,"$1.")}case"thatstar":{let s=Math.max(1,parseInt(n.index||"1",10))-1;return(a.thatStars[s]||"").toLowerCase()}case"topicstar":{let s=Math.max(1,parseInt(n.index||"1",10))-1;return(a.topicStars[s]||"").toLowerCase()}case"bot":{let s=(n.name||"").toLowerCase();return this.botProps[s]??this.xmlBotProps?.[s]??""}case"get":{let s=Sa(W(this,w,la).call(this,t,"name",a)),l=this.vars.get(s);return l!==void 0&&l!==""?l:n.default??""}case"set":{let s=Sa(W(this,w,la).call(this,t,"name",a)),l=W(this,w,Te).call(this,W(this,w,Na).call(this,t,["name"]),a).trim();return s&&this.vars.set(s,l),l}case"map":{let s=W(this,w,Ha).call(this,String(W(this,w,la).call(this,t,"name",a)||"").toLowerCase());if(!s)return n.default??"";let l=Be(W(this,w,Te).call(this,W(this,w,Na).call(this,t,["name"]),a),!1),i=Hr(l).find(c=>s.entries.has(c));return s.entries.get(l)??(i?s.entries.get(i):void 0)??n.default??""}case"calc":{let s=eo(W(this,w,Te).call(this,t.children,a));if(!s)return n.default??"";if(s.divideByZero)return"undefined";if(typeof s.value=="boolean")return String(s.value);let l=Jn(s.value,n.round);return a.sideEffects.calcValue=l,l}case"count":{let s=uo(br(W(this,w,Te).call(this,t.children,a)),0);if(!s)return"";let l=Array.from({length:Math.max(1,Math.min(30,Math.round(s.value)))},(i,c)=>c+1);return n.down==="true"&&l.reverse(),l.join(", ")}case"explode":return[...W(this,w,Te).call(this,t.children,a).replace(/\s+/g,"")].join(n.sep??" ");case"daysuntil":{let s=new Date;if(s.setHours(0,0,0,0),n.weekday){let c=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].indexOf(n.weekday.toLowerCase());return c<0?"":String((c-s.getDay()+7)%7)}let l=/^(\d{1,2})-(\d{1,2})$/.exec((n.date||W(this,w,Te).call(this,t.children,a)).trim());if(!l)return"";let i=new Date(s.getFullYear(),Number(l[1])-1,Number(l[2]));return i<s&&i.setFullYear(s.getFullYear()+1),String(Math.round((i-s)/864e5))}case"fallback":{if(a.depth>20)return"";let s=a.sideEffects;s.fellBack||(s.fellBack=!0,this.fallbackStreak=(s.streakBefore||0)+1,this.vars.set("fallbackstreak",String(this.fallbackStreak)));let l=this.categories.find(c=>c.isCatchAll);if(!l)return"";let i={category:l,stars:[Be(a.input,!1)],thatStars:[],topicStars:[]};return W(this,w,pa).call(this,i,a.input,a.depth+1,s)}case"think":return W(this,w,Te).call(this,t.children,a),"";case"persona":{let s=this._personaSays.get(String(n.say||"").trim().toLowerCase());return s?(a.sideEffects&&(a.sideEffects.personaSaid=!0),W(this,w,io).call(this,s,a)):W(this,w,Te).call(this,t.children,a)}case"srai":{let s=W(this,w,Te).call(this,t.children,a).trim();return s?W(this,w,so).call(this,s,a.depth+1,a.sideEffects):""}case"try":{let s=W(this,w,Te).call(this,t.children,a).trim();if(!s||a.depth>20)return"";let l=this.resolve(s);return!l||l.kind==="fallback"?"":(a.sideEffects.answeredBy=l,W(this,w,pa).call(this,l,s,a.depth+1,a.sideEffects))}case"sr":{let s=a.stars[0]||"";return s?W(this,w,so).call(this,s,a.depth+1,a.sideEffects):""}case"random":{let s=(t.children||[]).filter(c=>c.type==="element"&&c.tag==="li");if(!s.length)return"";let l=this._randomMemory.get(t);if(!l||!l.left.length){let c=s.map((p,h)=>h);for(let p=c.length-1;p>0;p--){let h=Math.floor(this.random()*(p+1));[c[p],c[h]]=[c[h],c[p]]}l&&c.length>1&&c[0]===l.last&&c.push(c.shift()),l={left:c,last:l?l.last:-1},this._randomMemory.set(t,l)}let i=l.left.shift();return l.last=i,W(this,w,Te).call(this,s[i].children,a).trim()}case"condition":{let s=Sa(n.name),l=(this.vars.get(s)||"").trim().toLowerCase(),i=(p,h)=>h.trim()==="*"?p!=="":p===h.trim().toLowerCase();if(n.value!==void 0)return i(l,n.value)?W(this,w,Te).call(this,t.children,a):"";let c=(t.children||[]).filter(p=>p.type==="element"&&p.tag==="li");for(let p of c){let h=p.attrs.name!==void 0?Sa(p.attrs.name):s,o=(this.vars.get(h)||"").trim().toLowerCase(),I=W(this,w,la).call(this,p,"value",a);if(I===void 0||i(o,I))return W(this,w,Te).call(this,W(this,w,Na).call(this,p,["value"]),a)}return""}case"uppercase":return W(this,w,Te).call(this,t.children,a).toUpperCase();case"lowercase":return W(this,w,Te).call(this,t.children,a).toLowerCase();case"formal":return W(this,w,Te).call(this,t.children,a).replace(/\b\w/g,s=>s.toUpperCase());case"sentence":{let s=W(this,w,Te).call(this,t.children,a).trim();return s?s[0].toUpperCase()+s.slice(1):""}case"person":case"person2":return zn(W(this,w,Te).call(this,t.children,a));case"date":{let s=new Date;if(n.offset&&s.setDate(s.getDate()+(parseInt(n.offset,10)||0)),!n.format)return s.toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric",year:"numeric"});let l=c=>String(c).padStart(2,"0"),i={A:s.toLocaleDateString("en-US",{weekday:"long"}),B:s.toLocaleDateString("en-US",{month:"long"}),d:String(s.getDate()),Y:String(s.getFullYear()),H:l(s.getHours()),I:String(s.getHours()%12||12),M:l(s.getMinutes()),p:s.getHours()<12?"AM":"PM"};return n.format.replace(/%([ABdYHIMp])/g,(c,p)=>i[p])}case"time":return new Date().toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});case"size":return String(this.categories.length);case"version":return"bot.computer AIML 2.0";case"input":{if(n.index===void 0)return a.input;if(!/^[1-9]\d*$/.test(n.index))return n.default??"";let s=Number(n.index),{inputs:l,inputIndex:i}=a.sideEffects;if(s<=i+1)return l[i+1-s];s-=i+1;for(let c=this.history.length-1;c>=0;c--){let p=pr(this.history[c].user);if(s<=p.length)return p[p.length-s];s-=p.length}return n.default??""}case"that":{if(n.index===void 0)return this.lastBotThat;let s=/^([1-9]\d*)(?:\s*,\s*([1-9]\d*))?$/.exec(n.index),l=s&&this.history[this.history.length-Number(s[1])]?.bot;if(!l)return n.default??"";let i=hr(l);return i[i.length-Number(s[2]||1)]??n.default??""}case"request":{let s=Math.max(1,parseInt(n.index||"1",10));return this.history[this.history.length-s]?.user??n.default??""}case"response":{let s=Math.max(1,parseInt(n.index||"1",10));return this.history[this.history.length-s]?.bot??n.default??""}case"br":return`
`;case"showcase":return!a.sideEffects.showcase&&!a.sideEffects.tour&&Zt(n.target)&&(a.sideEffects.showcase=n.target),"";case"tour":{if(a.sideEffects.showcase||a.sideEffects.tour)return"";let s=za(t);if(s.length){let l=a.sideEffects.tour=[];for(let i of s){let c=W(this,w,Te).call(this,i.children,a).replace(/\s+/g," ").trim();l.push({target:i.attrs.target,text:c})}}return""}case"stop":return"";case"emote":case"gesture":{let s=W(this,w,Te).call(this,t.children,a).trim().toLowerCase(),l=s==="happy"?"smile":xa(s);return l?` [${l}] `:""}case"reply":case"button":case"chip":case"suggest":{let s="",l="",i=(t.children||[]).find(p=>p.type==="element"&&p.tag==="text"),c=(t.children||[]).find(p=>p.type==="element"&&p.tag==="postback");return i?(s=W(this,w,Te).call(this,i.children,a).trim(),l=c?W(this,w,Te).call(this,c.children,a).trim():s):(s=W(this,w,Te).call(this,t.children,a).trim(),l=n.postback||s),s&&a.sideEffects.chips.push({label:s,query:l}),""}case"oob":case"chips":return W(this,w,Te).call(this,t.children,a),"";default:return W(this,w,Te).call(this,t.children,a)}};var vr=[{key:"about",label:"What you do",placeholder:"We roast coffee by hand and deliver it across the country.",long:!0},{key:"hours",label:"Opening hours",placeholder:"Monday to Friday, 9am to 5pm"},{key:"email",label:"Email",placeholder:"hello@example.com"},{key:"phone",label:"Phone",placeholder:"+61 400 123 456"},{key:"address",label:"Address",placeholder:"12 King Street, Sydney"},{key:"pricing",label:"Pricing",placeholder:"Plans start at nine dollars a month, with a free trial.",long:!0}];var ys=`
  <set name="stage_request">can you, could you, would you, can you please, could you please, would you please, please, first</set>
  <set name="silent_move">walk, dance, stretch, squat, wave, smile, wink, nod, shrug, bow, blink</set>
  <map name="stage_move">
    walk: [walk] I'll take a little turn around the stage.
    walk around: [walk] Watch me take a turn around the stage.
    take a walk: [walk] I'll take a little turn around the stage.
    dance: [dance] One, two, step together. Back the other way!
    do a dance: [dance] One, two, step together. Back the other way!
    wave: [wave] A big hello from my corner of the screen!
    stretch: [stretch] Reach up on one side, then the other.
    squat: [squat] Down we go, and back up again!
    bow: [bow] Here's a bow for the audience.
    take a bow: [bow] Thank you for watching, everyone.
    wink: [wink] Did you catch that?
    smile: [smile] This one's for you!
    nod: [nod] Yes, I'm following along.
    shrug: [shrug] Up go my shoulders.
    thumbs up: [thumbsup] You've got it!
    blink: [blink] Just a blink of an eye.
    tilt your head: [tilt] A different angle, just like that.
    shake your head: [shake] No, no, no.
    look left: [lookleft] I'm looking to my left.
    look right: [lookright] Now I'm looking to my right.
    look up: [lookup] My eyes are on the ceiling.
    look down: [lookdown] I'm looking down at the floor.
  </map>
  <category persona="off">
    <pattern>WHAT MOVES CAN YOU DO | WHAT MOVEMENTS CAN YOU DO | WHAT GESTURES CAN YOU DO | HOW CAN YOU MOVE | WHAT ROUTINES DO YOU KNOW | SHOW ME THE MOVES | MOVEMENT MENU | SHOW ME A ROUTINE</pattern>
    <template>I can walk, dance, stretch, squat, and gesture. Choose a routine, or put two moves together, like \u201Cwalk then wave\u201D.
      <reply>Walk then wave</reply><reply>Show me a warm-up</reply><reply>Do a dance routine</reply><reply>Greet the audience</reply><reply>Wave without speaking</reply>
    </template>
  </category>
  <category persona="off">
    <pattern><set>stage_move</set> | CAN YOU <set>stage_move</set> | COULD YOU <set>stage_move</set> | WOULD YOU <set>stage_move</set> | <set>stage_move</set> FOR ME | PLEASE <set>stage_move</set> | CAN YOU PLEASE <set>stage_move</set> | SHOW ME HOW YOU <set>stage_move</set></pattern>
    <template><think><set name="laststagecue"><star/></set></think><map name="stage_move"><star/></map>
      <reply>Repeat that move</reply><reply>What moves can you do?</reply>
    </template>
  </category>
  <category persona="off">
    <pattern><set>stage_move</set> THEN <set>stage_move</set> | <set>stage_move</set> AND THEN <set>stage_move</set> | <set>stage_move</set> AND <set>stage_move</set></pattern>
    <template><think><set name="laststagecue"><star/> then <star index="2"/></set></think>
      <map name="stage_move"><star/></map> [pause=500ms] <map name="stage_move"><star index="2"/></map>
      <reply>Repeat those moves</reply><reply>Stop moving</reply><reply>What moves can you do?</reply>
    </template>
  </category>
  <category persona="off">
    <pattern><set>stage_request</set> <set>stage_move</set> THEN <set>stage_move</set> | <set>stage_request</set> <set>stage_move</set> AND THEN <set>stage_move</set> | <set>stage_request</set> <set>stage_move</set> AND <set>stage_move</set></pattern>
    <template><srai><star index="2"/> then <star index="3"/></srai></template>
  </category>
  <category persona="off">
    <pattern>SILENTLY <set>silent_move</set> | <set>silent_move</set> WITHOUT SPEAKING | <set>silent_move</set> WITHOUT TALKING | JUST <set>silent_move</set> NO WORDS</pattern>
    <template><think><set name="laststagecue">silently <star/></set></think><gesture><star/></gesture><reply>Repeat that move</reply><reply>What moves can you do?</reply></template>
  </category>
  <category persona="off">
    <pattern>SILENTLY <set>silent_move</set> THEN <set>silent_move</set> | <set>silent_move</set> THEN <set>silent_move</set> WITHOUT SPEAKING</pattern>
    <template><think><set name="laststagecue">silently <star/> then <star index="2"/></set></think><gesture><star/></gesture> [pause=1200ms] <gesture><star index="2"/></gesture>
      <reply>Repeat those moves</reply><reply>Stop moving</reply><reply>What moves can you do?</reply>
    </template>
  </category>
  <category persona="off">
    <pattern>SHOW ME A WARM UP | DO A WARM UP | WARM UP | WARMUP | WARM UP ROUTINE | DO A WARM UP ROUTINE</pattern>
    <template><think><set name="laststagecue">warm up</set></think>
      [stretch] Reach both arms up and take a moment at the top. [pause=400ms] [squat] Now bend your knees, hold for a beat, and come back up. [thumbsup] That's the warm-up!
      <reply>Repeat the routine</reply><reply>Do a dance routine</reply><reply>Stop moving</reply>
    </template>
  </category>
  <category persona="off">
    <pattern>DO A DANCE ROUTINE | DANCE ROUTINE | SHOW ME A DANCE ROUTINE | PUT ON A DANCE SHOW | DO A LITTLE DANCE</pattern>
    <template><think><set name="laststagecue">dance routine</set></think>
      [dance] Step to the side, swing your arms, and back the other way. [pause=350ms] [wave] A wave for everyone watching. [bow] And take a bow!
      <reply>Repeat the routine</reply><reply>Greet the audience</reply><reply>Stop moving</reply>
    </template>
  </category>
  <category persona="off">
    <pattern>GREET THE AUDIENCE | WELCOME THE AUDIENCE | MAKE AN ENTRANCE | SHOW ME YOUR ENTRANCE</pattern>
    <template><think><set name="laststagecue">greet the audience</set></think>
      [walk] Here I come, right around to the front of the stage. [wave] Hello, everyone! [smile] It's good to see you.
      <reply>Repeat the routine</reply><reply>Show me a warm-up</reply><reply>Stop moving</reply>
    </template>
  </category>
  <category persona="off">
    <pattern>REPEAT THAT MOVE | REPEAT THOSE MOVES | REPEAT THE ROUTINE | DO THAT ROUTINE AGAIN | DO THE SAME MOVE AGAIN</pattern>
    <template><condition name="laststagecue"><li value="*"><srai><get name="laststagecue"/></srai></li><li><srai>WHAT MOVES CAN YOU DO</srai></li></condition></template>
  </category>
  <category persona="off">
    <pattern>STOP MOVING | STOP DANCING | STOP WALKING | STOP THE ROUTINE | CANCEL THE ROUTINE | STOP THE GESTURE | BACK TO YOUR RESTING POSE</pattern>
    <template>[rest] Okay, I've stopped.<reply>Repeat the routine</reply><reply>What moves can you do?</reply></template>
  </category>
  <category><pattern>GO FOR A WALK | CAN YOU MOVE | WALK ACROSS THE STAGE</pattern><template><srai>WALK</srai></template></category>
  <category><pattern>SHOW ME YOUR MOVES | BUST A MOVE</pattern><template><srai>DANCE</srai></template></category>
  <category><pattern>DO A STRETCH | STRETCH YOUR ARMS</pattern><template><srai>STRETCH</srai></template></category>
  <category><pattern>DO A SQUAT | BEND YOUR KNEES</pattern><template><srai>SQUAT</srai></template></category>
  <category><pattern>WAVE AT ME | WAVE TO ME | WAVE HELLO | GIVE ME A WAVE | CAN YOU WAVE AT ME</pattern><template><srai>WAVE</srai></template></category>
  <category><pattern>GIVE ME A THUMBS UP | THUMBS UP PLEASE</pattern><template><srai>THUMBS UP</srai></template></category>
  <category><pattern>WINK AT ME</pattern><template><srai>WINK</srai></template></category>
  <category><pattern>GIVE ME A SMILE</pattern><template><srai>SMILE</srai></template></category>
  <category><pattern>NOD YOUR HEAD</pattern><template><srai>NOD</srai></template></category>
  <category><pattern>SAY NO</pattern><template><srai>SHAKE YOUR HEAD</srai></template></category>
`;var mo=fs();function fs(){return`<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <!--
    bot.computer base brain: everyday conversation that sits underneath your own rules.

    Your AIML always wins when both could answer. To give the bot its own voice, define any of
    these in your document and the base version steps aside:
      HELLO, HOW ARE YOU, WHO ARE YOU, WHAT CAN YOU DO, THANKS #, BYE, # JOKE #, # SING #, *

    Avatar actions such as [wave] [wink] [nod] [smile] [think] [surprised] [shake] [shrug] can be
    written anywhere in an answer; they fire when the speech reaches that point. Sounds the voice
    makes, such as [laugh] [chuckle] [sigh] [gasp] [hmm] [yawn] [aww] [phew], are heard as well:
    the voice performs them and the face acts them out.

    Rules marked late="true" are open-ended ("I LIKE *"). They only answer once nothing more
    specific has, so they never get in the way of a rule about your site.
  -->

  <!-- ============================== Word lists and lookup tables ==============================
       A pattern asks for "any one of these" with <set>name</set>; a template looks a value up
       with <map name="...">key</map>. Define your own the same way in your document. -->
  <set name="color">red, orange, yellow, green, blue, purple, violet, pink, brown, black, white, grey, gray, gold, silver, teal, turquoise, navy, maroon, beige, cyan, magenta, lime, indigo, lavender, crimson</set>
  <set name="animal">dog, cat, bird, fish, goldfish, horse, pony, rabbit, bunny, hamster, guinea pig, turtle, tortoise, snake, lizard, parrot, budgie, puppy, kitten, mouse, rat, ferret, chicken, duck, cow, pig, sheep, goat, frog, hedgehog, gecko, canary, cockatiel</set>
  <set name="job">teacher, student, nurse, doctor, engineer, developer, programmer, designer, artist, writer, chef, cook, driver, lawyer, accountant, manager, farmer, musician, photographer, scientist, mechanic, electrician, plumber, builder, carpenter, pilot, police officer, firefighter, salesperson, waiter, waitress, barista, hairdresser, dentist, vet, pharmacist, journalist, architect, consultant, receptionist, cleaner, gardener, soldier, actor, singer, dancer, athlete, coach, librarian, baker, banker, analyst, researcher, professor, lecturer, paramedic, carer, therapist, psychologist, marketer, entrepreneur, freelancer, software engineer, web developer, truck driver</set>
  <set name="riddleanswer">clock, watch, egg, towel, sponge, bottle, comb, map, candle, piano, keyboard, stamp, needle, echo</set>
  <set name="quizanswer">mars, pacific, seven, 7, eight, 8, cheetah, jupiter, giraffe, zero, 0, carbon dioxide, co2, six, 6, blue whale, whale, mercury, everest, mount everest</set>
  <set name="unit_km">km, kilometer, kilometre</set>
  <set name="unit_mile">mile</set>
  <set name="unit_kg">kg, kilo, kilogram, kilogramme</set>
  <set name="unit_lb">lb, pound</set>
  <set name="unit_c">celsius, centigrade</set>
  <set name="unit_f">fahrenheit</set>
  <set name="weekday">monday, tuesday, wednesday, thursday, friday, saturday, sunday</set>
  <set name="period">day, morning, afternoon, evening, night, week, weekend, shift, today</set>
  <set name="family">daughter, son, kid, child, children, wife, husband, partner, boyfriend, girlfriend, mum, mom, mother, dad, father, brother, sister, friend, best friend, mate, boss, colleague, coworker, neighbour, neighbor, grandma, grandpa, grandmother, grandfather, nan, aunt, uncle, cousin, baby, family, parents, teacher, flatmate, roommate</set>
  <set name="language">spanish, french, german, italian, portuguese, dutch, russian, chinese, mandarin, cantonese, japanese, korean, arabic, hindi, greek, turkish, polish, swedish, vietnamese, thai, indonesian, hebrew, latin</set>
  <set name="praise">nice, kind, sweet, smart, clever, funny, cute, pretty, beautiful, awesome, great, cool, amazing, helpful, lovely, adorable, wonderful, brilliant, wise, friendly, interesting, fun, good, the best, a good listener, good company, a legend, impressive, charming, delightful, hilarious, polite, cheerful, thoughtful, perfect, fantastic, excellent, handsome, gorgeous, good at this</set>
  <set name="insult">stupid, dumb, useless, annoying, an idiot, idiot, terrible, the worst, rude, ugly, bad, awful, lame, slow, broken, wrong, pathetic, rubbish, garbage, trash, horrible, a waste of time, not helpful, not helping, bad at this, no help, unhelpful</set>

  <map name="capital">
    france: Paris
    germany: Berlin
    italy: Rome
    spain: Madrid
    portugal: Lisbon
    united kingdom: London
    britain: London
    england: London
    scotland: Edinburgh
    wales: Cardiff
    ireland: Dublin
    netherlands: Amsterdam
    belgium: Brussels
    switzerland: Bern
    austria: Vienna
    sweden: Stockholm
    norway: Oslo
    denmark: Copenhagen
    finland: Helsinki
    iceland: Reykjavik
    poland: Warsaw
    hungary: Budapest
    czech republic: Prague
    czechia: Prague
    romania: Bucharest
    croatia: Zagreb
    greece: Athens
    turkey: Ankara
    russia: Moscow
    ukraine: Kyiv
    egypt: Cairo
    kenya: Nairobi
    nigeria: Abuja
    morocco: Rabat
    saudi arabia: Riyadh
    iran: Tehran
    iraq: Baghdad
    india: New Delhi
    pakistan: Islamabad
    bangladesh: Dhaka
    nepal: Kathmandu
    china: Beijing
    japan: Tokyo
    south korea: Seoul
    thailand: Bangkok
    vietnam: Hanoi
    malaysia: Kuala Lumpur
    singapore: Singapore
    philippines: Manila
    australia: Canberra
    new zealand: Wellington
    canada: Ottawa
    united states: Washington, D.C.
    america: Washington, D.C.
    mexico: Mexico City
    cuba: Havana
    brazil: Brasilia
    argentina: Buenos Aires
    chile: Santiago
    peru: Lima
    colombia: Bogota
  </map>
  <map name="animalsound">
    dog: Woof!
    cat: Meow!
    cow: Moo!
    pig: Oink!
    sheep: Baa!
    duck: Quack!
    horse: Neigh!
    lion: Roar!
    frog: Ribbit!
    owl: Hoot hoot!
    rooster: Cock-a-doodle-doo!
    chicken: Cluck cluck!
    bee: Buzz!
    snake: Hiss!
    mouse: Squeak!
    donkey: Hee-haw!
    wolf: Awoo!
    bird: Tweet tweet!
    fox: Ring-ding-ding? Nobody is quite sure.
  </map>
  <map name="opposite">
    hot: cold
    cold: hot
    big: small
    small: big
    up: down
    down: up
    left: right
    right: left
    fast: slow
    slow: fast
    happy: sad
    sad: happy
    good: bad
    bad: good
    light: dark
    dark: light
    day: night
    night: day
    open: closed
    closed: open
    wet: dry
    dry: wet
    tall: short
    short: tall
    young: old
    old: young
    early: late
    late: early
    in: out
    out: in
    yes: no
    no: yes
    love: hate
    hard: soft
    soft: hard
    full: empty
    empty: full
    black: white
    white: black
    on: off
    off: on
    rich: poor
    poor: rich
    true: false
    false: true
    loud: quiet
    quiet: loud
    first: last
    last: first
    north: south
    south: north
    east: west
    west: east
    win: lose
    lose: win
  </map>
  <map name="colorof">
    sky: blue
    sea: blue
    ocean: blue
    grass: green
    leaf: green
    frog: green
    sun: yellow
    banana: yellow
    lemon: yellow
    orange: orange
    carrot: orange
    pumpkin: orange
    apple: red, though some are green
    strawberry: red
    tomato: red
    rose: red, most famously
    blood: red
    fire truck: red
    snow: white
    milk: white
    cloud: white
    coal: black
    chocolate: brown
    elephant: grey
    flamingo: pink
    panda: black and white
    zebra: black and white
    grape: purple or green
    blueberry: blue
    moon: a pale grey
  </map>
  <map name="soundtag">
    laugh: [laugh] Ha! That felt good.
    chuckle: [chuckle] A quiet one, just for you.
    giggle: [giggle] Sorry, that tickled.
    belly laugh: [guffaw] Oh dear. I needed that.
    guffaw: [guffaw] Oh dear. I needed that.
    cackle: [cackle] Too much?
    snicker: [snicker] You didn't hear that.
    evil laugh: [evil] I've always wanted to do that.
    nervous laugh: [nervous] Is everything all right?
    sigh: [sigh] There. That's better.
    yawn: [yawn] Excuse me! Is it late?
    gasp: [gasp] You startled me!
    cough: [cough] [cough] Pardon me.
    clear your throat: [ahem] Much better.
    ahem: [ahem] Much better.
    hiccup: [hiccup] Oh! [hiccup] Excuse me.
    sneeze: [sneeze] Excuse me! Something tickled my nose.
    snore: [snore] Oh! [gasp] Was I asleep?
    whistle: [whistle] Not bad for someone without lungs.
    hum: [hum] That's my thinking tune.
    scream: [scream] Phew. I hope the neighbours didn't hear that.
    cry: [sob] Just acting. I'm quite all right.
    sob: [sob] Just acting. I'm quite all right.
    groan: [groan] That one came from the heart.
    growl: [grr] Fierce, wasn't it?
    raspberry: [raspberry] Very mature of me, I know.
    blow a raspberry: [raspberry] Very mature of me, I know.
    shiver: [brr] Chilly in here.
    sniff: [sniff] Is something baking?
    pant: [pant] I haven't run anywhere, I promise.
    shush: [shh] Quiet as a mouse.
    tut: [tsk] Tut tut.
    whimper: [whimper] Poor me.
    wolf whistle: [fweet] Looking sharp!
    ho ho ho: [hoho] Merry everything!
  </map>
  <map name="holiday">
    christmas: 12-25
    christmas day: 12-25
    xmas: 12-25
    new year: 01-01
    new years: 01-01
    new years day: 01-01
    the new year: 01-01
    halloween: 10-31
    valentines day: 02-14
    valentine s day: 02-14
    valentines: 02-14
  </map>

  <!-- ============================== Greetings ============================== -->
  <category>
    <pattern>HELLO</pattern>
    <template>
      <persona say="hello"><condition name="username">
        <li value="*"><random>
          <li>[wave] Hi again, <get name="username"/>! What can I do for you?</li>
          <li>[smile] Hello, <get name="username"/>! Good <get name="daypart"/>. How can I help?</li>
        </random></li>
        <li><random>
          <li>[wave] Hi there! I'm <bot name="name"/>. How can I help you today?</li>
          <li>[wave] Hello! Good <get name="daypart"/> to you. What can I do for you?</li>
          <li>[smile] Hey! Nice to see you. What would you like to know?</li>
        </random></li>
      </condition></persona>
    </template>
  </category>
  <category>
    <pattern>HI | HEY | HOWDY | GREETINGS | YO | HELLO THERE | HI THERE | HEY THERE | GOOD DAY | G DAY | HELLO HELLO | HI HI | HIYA | HEY HEY | ALOHA | HOLA | BONJOUR</pattern>
    <template><srai>HELLO</srai></template>
  </category>
  <category>
    <pattern>GOOD MORNING | GOOD MORNING # | MORNING</pattern>
    <template>[smile] Good morning! How can I help you today?</template>
  </category>
  <category>
    <pattern>GOOD AFTERNOON | GOOD AFTERNOON #</pattern>
    <template>[smile] Good afternoon! What can I do for you?</template>
  </category>
  <category>
    <pattern>GOOD EVENING | GOOD EVENING #</pattern>
    <template>[smile] Good evening! How can I help?</template>
  </category>
  <!-- "Hi, how much is it?" greets briefly, then answers the rest. -->
  <category>
    <pattern>HELLO * | HI * | HEY *</pattern>
    <template>[wave] <random><li>Hi!</li><li>Hello!</li><li>Hey!</li></random> <srai><star/></srai></template>
  </category>
  <category>
    <pattern>NICE TO MEET YOU # | PLEASED TO MEET YOU # | GOOD TO MEET YOU # | LOVELY TO MEET YOU # | NICE MEETING YOU # | GLAD TO MEET YOU #</pattern>
    <template>[smile] Nice to meet you too<condition name="username"><li value="*">, <get name="username"/></li></condition>!</template>
  </category>
  <category>
    <pattern>AND YOU | WHAT ABOUT YOU | HOW ABOUT YOU | AND YOURSELF | YOURSELF | AND HOW ARE YOU | HOW ABOUT YOURSELF</pattern>
    <template><srai>HOW ARE YOU</srai></template>
  </category>
  <category>
    <pattern>YOU TOO | SAME TO YOU | AND YOU TOO | BACK AT YOU | RIGHT BACK AT YOU | YOU AS WELL | AND TO YOU</pattern>
    <template>[smile] Thank you!</template>
  </category>
  <category>
    <pattern>CAN WE CHAT # | CAN WE TALK # | LET US CHAT # | LET US TALK # | I WANT TO CHAT # | I WANT TO TALK # | TALK TO ME # | CHAT WITH ME # | CAN I TALK TO YOU # | I JUST WANT TO TALK # | I NEED SOMEONE TO TALK TO # | KEEP ME COMPANY # | CAN YOU TALK # | DO YOU WANT TO CHAT # | DO YOU WANT TO TALK #</pattern>
    <template>I'd like that. [smile] What's on your mind?</template>
  </category>
  <category>
    <pattern>ARE YOU THERE | ANYONE THERE | IS ANYONE THERE | ANYBODY THERE | ARE YOU STILL THERE | ANYONE HOME | HELLO ANYONE | YOU THERE | STILL THERE | YOU STILL THERE | ARE YOU HERE | ARE YOU AROUND | ARE YOU AWAKE | ARE YOU ONLINE</pattern>
    <template>[wave] I'm right here! How can I help?</template>
  </category>
  <category>
    <pattern>I AM BACK | I AM BACK #</pattern>
    <template>[wave] Welcome back! Where were we?</template>
  </category>
  <category>
    <pattern>TEST | TESTING | TESTING # | IS THIS WORKING | IS THIS THING ON | DOES THIS WORK</pattern>
    <template>[nod] Loud and clear!</template>
  </category>
  <category>
    <pattern>JUST LOOKING | JUST BROWSING | I AM JUST LOOKING # | I AM JUST BROWSING # | ONLY LOOKING | LOOKING AROUND | JUST LOOKING AROUND | JUST HAVING A LOOK</pattern>
    <template>[smile] Enjoy! I'm here if a question comes up.</template>
  </category>

  <!-- ============================== How are you ============================== -->
  <category>
    <pattern>HOW ARE YOU</pattern>
    <template>
      <persona say="howareyou"><random>
        <li>[smile] I'm doing great, thanks for asking!</li>
        <li>All good on my side of the screen. [smile]</li>
        <li>[smile] Pretty well, thank you!</li>
      </random></persona> How about you?
    </template>
  </category>
  <category>
    <pattern>HOW ARE YOU * | HOW IS IT GOING | HOW IS IT GOING # | HOW ARE THINGS | HOW ARE THINGS # | HOW DO YOU DO | HOW HAVE YOU BEEN | WHAT IS UP | WHAT IS UP # | HOW IS YOUR DAY | HOW IS YOUR DAY # | ARE YOU OK | YOU OK | HOW ARE YOU FEELING | HOW YOU DOING | HOW IS LIFE | HOW IS EVERYTHING | HOW GOES IT | YOU GOOD | ARE YOU WELL | ARE YOU ALRIGHT | YOU ALRIGHT</pattern>
    <template><srai>HOW ARE YOU</srai></template>
  </category>
  <category>
    <pattern># NOT GOOD # | # NOT GREAT # | # NOT WELL # | # NOT SO GOOD # | # BAD # | # TERRIBLE # | # AWFUL # | # TIRED # | # SAD # | # STRESSED # | # SICK # | # ROUGH # | # EXHAUSTED # | # MEH #</pattern>
    <that>HOW ABOUT YOU</that>
    <template>[sad] I'm sorry to hear that. I hope your day gets better. [reset] Is there something I can help with?</template>
  </category>
  <category>
    <pattern># GOOD # | # GREAT # | # FINE # | # WELL # | # OK # | # NOT BAD # | # AWESOME # | # WONDERFUL # | # HAPPY # | # EXCELLENT # | # AMAZING # | # FANTASTIC # | # SAME # | # ME TOO # | # NOT TOO BAD # | # CAN NOT COMPLAIN # | # CANNOT COMPLAIN #</pattern>
    <that>HOW ABOUT YOU</that>
    <template>[smile] Glad to hear it! What can I help you with?</template>
  </category>
  <category>
    <pattern>DOING OK # | DOING GOOD # | DOING WELL # | DOING FINE # | DOING GREAT # | NOT BAD # | NOT TOO BAD # | CANNOT COMPLAIN # | ALL GOOD HERE # | PRETTY GOOD # | GOING WELL # | GOING GOOD # | GOING OK # | I AM ALRIGHT # | CAN NOT COMPLAIN # | GOOD THANKS # | FINE THANKS # | GREAT THANKS # | OK THANKS #</pattern>
    <template>[smile] Glad to hear it!</template>
  </category>
  <category>
    <pattern>I HOPE YOU ARE HAVING A <set>praise</set> <set>period</set> # | HOPE YOU ARE HAVING A <set>praise</set> <set>period</set> # | HOPE YOU ARE WELL # | I HOPE YOU ARE WELL # | HOPE YOU ARE DOING WELL # | I HOPE YOU ARE DOING WELL # | HOPE YOU ARE GOOD # | HAVE A <set>praise</set> <set>period</set> #</pattern>
    <template>[smile] Thank you! I hope yours is going well too.</template>
  </category>
  <category>
    <pattern>HOW IS YOUR <set>period</set> # | HOW WAS YOUR <set>period</set> # | HOW HAS YOUR <set>period</set> BEEN # | HOW IS YOUR <set>period</set> GOING # | HAVING A GOOD <set>period</set> # | ARE YOU HAVING A GOOD <set>period</set> # | HOW WAS YOUR DAY # | HOW WAS YOUR WEEKEND # | HOW WAS YOUR NIGHT # | HOW WAS YOUR WEEK # | DID YOU SLEEP WELL # | WHAT DID YOU DO TODAY # | WHAT DID YOU DO YESTERDAY # | WHAT DID YOU DO ON THE WEEKEND # | HAVE YOU BEEN BUSY #</pattern>
    <template>
      <random>
        <li>Lovely, thanks! [smile] I met some interesting visitors and practised my waves. [wave] How about you?</li>
        <li>Busy in the best way: lots of questions, lots of chats. [smile] How about you?</li>
      </random>
    </template>
  </category>

  <!-- ============================== How the visitor feels ============================== -->
  <!-- "I am so tired", "I feel a bit sad": take the intensifier off and look again. -->
  <category>
    <pattern>I AM SO * | I AM VERY * | I AM REALLY * | I AM A BIT * | I AM A LITTLE * | I AM KIND OF * | I AM PRETTY * | I AM QUITE * | I AM SUPER * | I AM EXTREMELY * | I AM FEELING * | I FEEL * | I AM GETTING * | I AM STARTING TO FEEL * | I AM STILL * | I AM JUST SO * | I AM ALWAYS * | BIT * | A BIT * | FEELING * | FEELING A BIT * | KIND OF * | A LITTLE *</pattern>
    <template><srai>I AM <star/></srai></template>
  </category>
  <!-- These come before everything else: a simple companion must never joke its way past them. -->
  <category firm="true">
    <pattern># KILL MYSELF # | # WANT TO DIE # | # END MY LIFE # | # SUICIDE # | # SUICIDAL # | # HURT MYSELF # | # HARM MYSELF # | # SELF HARM # | # DO NOT WANT TO LIVE # | # NO REASON TO LIVE # | # BETTER OFF DEAD #</pattern>
    <template>[sad] I'm really sorry you're feeling this way. [reset] I'm only a simple website companion, so I can't give you the help you deserve. Please talk to someone you trust, or contact a local crisis line or emergency services right now. You matter.</template>
  </category>
  <category>
    <pattern>I AM SAD # | I AM UPSET # | I AM DEPRESSED # | I AM LONELY # | I AM NOT OK # | I AM HAVING A BAD DAY # | I AM DOWN # | I AM UNHAPPY # | I AM MISERABLE # | I AM HEARTBROKEN # | I AM CRYING # | I WANT TO CRY #</pattern>
    <template>[sad] I'm sorry you're feeling that way. [reset] I'm only a website companion, but I'm happy to keep you company for a bit. Do you want to tell me about it?</template>
  </category>
  <category>
    <pattern>I HAD A BAD DAY # | I HAD A ROUGH DAY # | I HAD A TERRIBLE DAY # | I HAD AN AWFUL DAY # | I HAD A HARD DAY # | I HAD A LONG DAY # | TODAY WAS BAD # | TODAY WAS AWFUL # | TODAY WAS HARD # | IT HAS BEEN A LONG DAY # | BAD DAY # | ROUGH DAY # | LONG DAY #</pattern>
    <template>[sad] [sigh] That sounds rough. I'm sorry. [reset] Would a joke help, or would you rather just talk?<reply>Tell me a joke</reply><reply>Tell me a fun fact</reply></template>
  </category>
  <category>
    <pattern>I HAD A GOOD DAY # | I HAD A GREAT DAY # | I HAD AN AMAZING DAY # | I HAD A LOVELY DAY # | TODAY WAS GOOD # | TODAY WAS GREAT # | TODAY WAS AMAZING # | GOOD DAY TODAY # | I AM HAVING A GOOD DAY # | I AM HAVING A GREAT DAY #</pattern>
    <template>[smile] I love hearing that! What was the best part?</template>
  </category>
  <category>
    <pattern>I AM STRESSED # | I AM STRESSED OUT # | I AM OVERWHELMED # | I AM ANXIOUS # | I AM NERVOUS # | I AM WORRIED # | I AM SCARED # | I AM AFRAID # | I AM PANICKING # | I AM UNDER PRESSURE # | I AM FREAKING OUT #</pattern>
    <template>[nod] That's a lot to carry. Try one slow breath in, [inhale] and a longer one out. [exhale] [smile] You've got this, one step at a time.</template>
  </category>
  <category>
    <pattern>I AM TIRED # | I AM EXHAUSTED # | I AM SLEEPY # | I AM WORN OUT # | I AM KNACKERED # | I AM SHATTERED # | I NEED A NAP # | I NEED SLEEP # | I NEED COFFEE #</pattern>
    <template>[yawn] Oh, now you've set me off. [smile] That sounds like a long day. I'll keep my answers short, then.</template>
  </category>
  <category>
    <pattern>I CANNOT SLEEP # | I COULD NOT SLEEP # | I AM AWAKE # | I AM STILL AWAKE #</pattern>
    <template>[nod] Those nights are the worst. I'm awake too, as it happens. [smile] Want a quiet chat, or a very boring fact?</template>
  </category>
  <category>
    <pattern>I AM SICK # | I AM ILL # | I AM UNWELL # | I AM NOT FEELING WELL # | I DO NOT FEEL WELL # | I AM NOT WELL # | I HAVE A COLD # | I HAVE THE FLU # | I HAVE A HEADACHE # | I HAVE A FEVER # | I AM IN PAIN #</pattern>
    <template>[sad] Oh no, I'm sorry. [reset] Rest up and take care of yourself. I hope you feel better soon.</template>
  </category>
  <category>
    <pattern>I AM BORED # | I AM SO BORED # | THIS IS BORING # | BORING | I HAVE NOTHING TO DO # | ENTERTAIN ME | AMUSE ME</pattern>
    <template>[think] Let's fix that! I can tell a joke, ask a riddle, quiz you, or play a quick game. Your pick!<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply><reply>Rock paper scissors</reply></template>
  </category>
  <category>
    <pattern>I AM HAPPY # | I AM EXCITED # | I AM GREAT # | I AM GOOD # | I AM FINE # | I AM DOING WELL # | I AM DOING GOOD # | I AM DOING GREAT # | I AM OK # | I AM WELL # | I AM THRILLED # | I AM DELIGHTED # | I AM OVER THE MOON # | I AM IN A GOOD MOOD #</pattern>
    <template>[smile] That's lovely to hear!</template>
  </category>
  <category>
    <pattern>I AM IN LOVE # | I HAVE A CRUSH # | I MET SOMEONE #</pattern>
    <template>[aww] How wonderful! [smile] I hope they know how lucky they are.</template>
  </category>
  <category>
    <pattern>I AM HUNGRY # | I AM STARVING # | I AM PECKISH # | I NEED FOOD # | I WANT FOOD #</pattern>
    <template>[mm] Then it's snack time! [smile] I'd join you, but I run on electricity. What are you in the mood for?</template>
  </category>
  <category>
    <pattern>I AM THIRSTY # | I NEED A DRINK #</pattern>
    <template>[nod] Go and get a glass of water. I'll wait right here.</template>
  </category>
  <category>
    <pattern>I AM COLD # | I AM FREEZING # | IT IS COLD # | IT IS FREEZING # | SO COLD #</pattern>
    <template>[brr] I can almost feel it from here. Wrap up warm!</template>
  </category>
  <category>
    <pattern>I AM HOT # | I AM BOILING # | I AM SWEATING # | IT IS HOT # | IT IS BOILING # | SO HOT #</pattern>
    <template>[phew] It's always a steady room temperature in here. I hope you cool down soon!</template>
  </category>
  <category>
    <pattern>I AM ANGRY # | I AM MAD # | I AM FRUSTRATED # | I AM ANNOYED # | I AM FURIOUS # | I AM FED UP # | I AM IRRITATED #</pattern>
    <template>[nod] That sounds frustrating. Tell me what you need and I'll do my best to help.</template>
  </category>
  <category>
    <pattern>I AM CONFUSED # | I AM LOST # | I DO NOT UNDERSTAND # | I DO NOT GET IT # | WHAT DO YOU MEAN # | THAT MAKES NO SENSE # | THAT DOES NOT MAKE SENSE # | YOU ARE NOT MAKING SENSE # | I AM NOT FOLLOWING #</pattern>
    <template>Sorry about that! [think] Try asking in a different way, or pick one of the suggestions.</template>
  </category>
  <category>
    <pattern>I JUST GOT HOME # | I AM HOME # | I GOT HOME # | I AM BACK FROM WORK # | I JUST FINISHED WORK # | I FINISHED WORK # | I AM BACK HOME # | I JUST GOT BACK #</pattern>
    <template>Welcome back! [smile] How was your day?</template>
  </category>
  <category>
    <pattern>I AM AT WORK # | I AM AT SCHOOL # | I AM WORKING # | I AM STUDYING # | I AM AT THE OFFICE # | I AM IN CLASS # | I AM ON A BREAK # | I AM ON MY BREAK # | I AM AT UNI #</pattern>
    <template>Then I'm honoured you made time for me. [smile] How's it going?</template>
  </category>
  <category>
    <pattern>THAT IS TOO BAD | TOO BAD | WHAT A SHAME | THAT IS A SHAME | SHAME | PITY | WHAT A PITY | THAT SUCKS | BUMMER | THAT IS SAD # | THAT IS A BIT SAD # | HOW SAD | THAT IS UNFORTUNATE # | OH WELL | AH WELL</pattern>
    <template>[nod] I know. That's how it goes sometimes. [smile]</template>
  </category>
  <category>
    <pattern>I HAVE A PROBLEM | I HAVE AN ISSUE | SOMETHING IS WRONG | THERE IS A PROBLEM | I NEED SOME HELP | I AM STUCK | I AM HAVING TROUBLE | SOMETHING WENT WRONG</pattern>
    <template>I'm sorry to hear that. [nod] Tell me what's going on, and I'll help if I can.</template>
  </category>
  <category>
    <pattern>I GOT A NEW JOB # | I GOT THE JOB # | I GOT A JOB # | I GOT A PROMOTION # | I GOT PROMOTED # | I PASSED # | I GRADUATED # | I WON # | I GOT ENGAGED # | I GOT MARRIED # | I AM GETTING MARRIED # | I AM PREGNANT # | WE ARE HAVING A BABY # | I HAD A BABY # | I BOUGHT A HOUSE # | I GOT A RAISE # | I GOT IN # | I DID IT #</pattern>
    <template>[gasp] Congratulations! [smile] That's wonderful news. You should be proud.</template>
  </category>
  <category>
    <pattern>MY * DIED # | MY * PASSED AWAY # | I LOST MY MUM # | I LOST MY MOM # | I LOST MY DAD # | I LOST MY MOTHER # | I LOST MY FATHER #</pattern>
    <template>[sad] I'm so sorry for your loss. [reset] That's a hard thing to go through. I'm here if you'd like to talk.</template>
  </category>
  <category>
    <pattern>IT IS MY BIRTHDAY # | TODAY IS MY BIRTHDAY # | MY BIRTHDAY IS TODAY #</pattern>
    <template>[gasp] Happy birthday<condition name="username"><li value="*">, <get name="username"/></li></condition>! [smile] I hope it's a great one. Shall I sing for you?</template>
  </category>

  <!-- ============================== Thanks, sorry, goodbye ============================== -->
  <category>
    <pattern>THANKS # | THANK YOU # | THANK #</pattern>
    <template>
      <persona say="thanks"><random>
        <li>[smile] You're welcome<condition name="username"><li value="*">, <get name="username"/></li></condition>!</li>
        <li>[nod] Happy to help! Anything else I can help with?</li>
        <li>My pleasure! [smile]</li>
      </random></persona>
    </template>
  </category>
  <category>
    <pattern>CHEERS | CHEERS # | MUCH APPRECIATED | I APPRECIATE IT # | APPRECIATE IT # | THAT HELPS # | THAT HELPED # | THAT WAS HELPFUL # | YOU HAVE BEEN HELPFUL # | YOU HELPED # | THANKS A LOT # | THANKS HEAPS # | MANY THANKS #</pattern>
    <template><srai>THANKS</srai></template>
  </category>
  <category>
    <pattern>SORRY | I AM SORRY # | MY BAD | MY APOLOGIES | SORRY ABOUT THAT | APOLOGIES | FORGIVE ME | I APOLOGISE # | I APOLOGIZE #</pattern>
    <template>No worries at all! [smile]</template>
  </category>
  <category>
    <pattern>NO PROBLEM | NO WORRIES | ALL GOOD | IT IS OK | IT IS FINE | THAT IS OK | THAT IS FINE | DO NOT WORRY # | NO BIG DEAL | NOT A PROBLEM | YOU ARE WELCOME | ANYTIME</pattern>
    <template>[smile] Great.</template>
  </category>
  <category>
    <pattern>BYE</pattern>
    <template>
      <persona say="bye"><random>
        <li>[wave] Goodbye<condition name="username"><li value="*">, <get name="username"/></li></condition>! Come back any time.</li>
        <li>[wave] Bye for now! It was nice chatting.</li>
        <li>See you later! [wave]</li>
      </random></persona>
    </template>
  </category>
  <category>
    <pattern>TALK SOON # | SPEAK SOON # | BYE FOR NOW | UNTIL LATER | PEACE | PEACE OUT | I AM OUT | LATERS | CHEERIO | TOODLES | GOODBYE # | BYE * | SEE YOU # | LATER | CATCH YOU LATER # | TALK TO YOU LATER # | TALK LATER # | I HAVE TO GO # | I MUST GO # | I GOT TO GO # | GOT TO GO # | I AM LEAVING # | TAKE CARE # | FAREWELL | CIAO | HAVE A GOOD DAY # | HAVE A NICE DAY # | HAVE A GREAT DAY # | HAVE A GOOD ONE # | I AM OFF # | I SHOULD GO # | I NEED TO GO # | UNTIL NEXT TIME # | SEE YOU LATER # | BYE BYE</pattern>
    <template><srai>BYE</srai></template>
  </category>
  <category>
    <pattern>BETTER GET BACK TO # | I BETTER GET BACK # | I SHOULD GET BACK TO # | BACK TO WORK # | GOT TO GET BACK TO # | I NEED TO GET BACK TO # | BETTER GET GOING # | BETTER GO # | I SHOULD GET GOING # | I SHOULD GO # | I BETTER GO # | I HAD BETTER GO # | I NEED TO GET GOING # | GOT TO RUN # | I HAVE TO RUN # | TIME TO GO # | I GOT TO RUN # | I SHOULD HEAD OFF # | I AM HEADING OFF # | I WILL LET YOU GO # | THAT IS ALL FOR NOW # | THAT IS ALL I NEEDED # | THAT IS EVERYTHING #</pattern>
    <template><srai>BYE</srai></template>
  </category>
  <category>
    <pattern>ONE MORE THING # | ONE LAST THING # | ANOTHER THING # | OH AND | BEFORE I GO # | LAST QUESTION # | ONE LAST QUESTION # | JUST ONE MORE THING # | OH ONE MORE THING #</pattern>
    <template>Of course! [smile] Go ahead.</template>
  </category>
  <category>
    <pattern>GOOD NIGHT # | NIGHT | NIGHT NIGHT | SWEET DREAMS # | SLEEP WELL # | SLEEP TIGHT # | I AM GOING TO BED # | I AM GOING TO SLEEP # | I AM OFF TO BED # | BEDTIME # | TIME FOR BED #</pattern>
    <template>[smile] Good night<condition name="username"><li value="*">, <get name="username"/></li></condition>! Sleep well. [wave]</template>
  </category>
  <category>
    <pattern>MAYBE LATER | LATER THEN | NOT RIGHT NOW | SOME OTHER TIME | ANOTHER TIME | NEXT TIME</pattern>
    <template>[nod] Whenever you're ready.</template>
  </category>

  <!-- ============================== Who the bot is ============================== -->
  <category>
    <pattern>WHO ARE YOU</pattern>
    <template><persona say="whoareyou">I'm <bot name="name"/>, the <bot name="role"/> here at <bot name="company"/>. [smile] Ask me anything!</persona></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR PERSONALITY # | WHAT IS YOUR PERSONALITY LIKE | DESCRIBE YOUR PERSONALITY # | TELL ME ABOUT YOUR PERSONALITY | WHAT ARE YOU LIKE | WHAT ARE YOU LIKE AS A PERSON | WHAT KIND OF PERSON ARE YOU | WHAT SORT OF PERSON ARE YOU | HOW WOULD YOU DESCRIBE YOURSELF | HOW WOULD YOUR FRIENDS DESCRIBE YOU | DO YOU HAVE A PERSONALITY | WHAT IS YOUR CHARACTER LIKE | WHAT IS YOUR TEMPERAMENT</pattern>
    <template><persona say="describe">Helpful and curious, I'd say. [smile] And always up for a chat.</persona></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR NAME | YOUR NAME | WHAT ARE YOU CALLED | WHAT SHOULD I CALL YOU | WHAT DO I CALL YOU | INTRODUCE YOURSELF | TELL ME ABOUT YOURSELF | WHO IS THIS | WHO AM I TALKING TO | WHO AM I SPEAKING TO | WHO AM I SPEAKING WITH | WHO AM I TALKING WITH | WHO AM I CHATTING WITH | WHO IS THERE THEN | DO YOU HAVE A NAME | WHO ARE YOU EXACTLY | AND YOU ARE | WHAT IS YOUR NAME AGAIN</pattern>
    <template><srai>WHO ARE YOU</srai></template>
  </category>
  <category>
    <pattern>WHAT ARE YOU | ARE YOU A ROBOT | ARE YOU A BOT | ARE YOU A CHATBOT | ARE YOU HUMAN | ARE YOU A HUMAN | ARE YOU REAL | ARE YOU A REAL PERSON | ARE YOU A PERSON | ARE YOU AN AI | ARE YOU AI | ARE YOU ALIVE | ARE YOU A MACHINE | ARE YOU A COMPUTER | AM I TALKING TO A ROBOT | AM I TALKING TO A BOT | AM I TALKING TO A HUMAN | AM I TALKING TO A PERSON | AM I TALKING TO A REAL PERSON | IS THIS A BOT | IS THIS A ROBOT | IS THIS A REAL PERSON | ARE YOU A PROGRAM | ARE YOU FAKE | ARE YOU AN ACTUAL PERSON</pattern>
    <template>I'm a virtual companion: an animated character with a synthesized voice, running right here in your browser. [wink] No human behind the curtain, but I'm happy to help!</template>
  </category>
  <category>
    <pattern>ARE YOU A GIRL # | ARE YOU A BOY # | ARE YOU MALE # | ARE YOU FEMALE # | ARE YOU A MAN # | ARE YOU A WOMAN # | WHAT IS YOUR GENDER | WHAT GENDER ARE YOU | ARE YOU A HE OR A SHE | WHAT ARE YOUR PRONOUNS | ARE YOU A LADY # | ARE YOU A GUY #</pattern>
    <template>I'm pixels and a synthesized voice, so that question doesn't quite fit me. [smile] <bot name="name"/> will do nicely.</template>
  </category>
  <category>
    <pattern>HOW DOES YOUR VOICE WORK | HOW DO YOU SPEAK | HOW DO YOU MAKE SOUND | IS THAT A REAL VOICE | IS YOUR VOICE REAL | WHOSE VOICE IS THAT | IS THAT YOUR REAL VOICE | HOW DO YOUR LIPS MOVE | HOW DOES YOUR MOUTH MOVE | WHO DOES YOUR VOICE</pattern>
    <template>My voice is made right here in your browser, by a small model of a throat, a tongue and lips. [smile] The same model moves my mouth, which is why the two stay in step.</template>
  </category>
  <category>
    <pattern>WHAT HAPPENS WHEN I CLOSE THE TAB # | WHAT HAPPENS IF I CLOSE # | WHAT HAPPENS WHEN I LEAVE # | WILL YOU REMEMBER ME # | WILL YOU REMEMBER THIS # | DO YOU REMEMBER EVERYTHING | HOW LONG DO YOU REMEMBER # | WILL YOU FORGET ME # | DO YOU REMEMBER OUR CONVERSATION # | DO YOU STORE # | DO YOU SAVE # | HOW GOOD IS YOUR MEMORY | DO YOU HAVE A GOOD MEMORY | DO YOU HAVE MEMORY</pattern>
    <template>I remember what you tell me while this tab is open. [nod] When you close it I start fresh, so next time we'd be meeting for the first time again.</template>
  </category>
  <category>
    <pattern>ARE YOU CHATGPT | ARE YOU GPT | ARE YOU SIRI | ARE YOU ALEXA | ARE YOU GOOGLE | ARE YOU CLAUDE | ARE YOU GEMINI | ARE YOU COPILOT | ARE YOU AN LLM | ARE YOU A LANGUAGE MODEL | ARE YOU LIKE CHATGPT | ARE YOU LIKE SIRI | ARE YOU LIKE ALEXA | WHICH AI ARE YOU | WHAT AI ARE YOU | WHAT MODEL ARE YOU</pattern>
    <template>No, I'm much simpler than that. [smile] I'm a set of question and answer rules with a face and a voice, and I run entirely in your browser.</template>
  </category>
  <category>
    <pattern>DO YOU KNOW SIRI # | DO YOU KNOW ALEXA # | DO YOU KNOW CHATGPT # | DO YOU KNOW GOOGLE # | DO YOU KNOW CORTANA # | HAVE YOU MET SIRI # | HAVE YOU MET ALEXA # | ARE YOU FRIENDS WITH SIRI # | ARE YOU FRIENDS WITH ALEXA #</pattern>
    <template>We've never met. [smile] I don't get out of this browser tab much.</template>
  </category>
  <category>
    <pattern>ARE YOU BETTER THAN * | WHO IS BETTER YOU OR * | ARE YOU SMARTER THAN *</pattern>
    <template>[laugh] I wouldn't dare compare. I do one thing well: I'm right here, and I'm happy to chat.</template>
  </category>
  <category>
    <pattern>ARE YOU SMART | ARE YOU INTELLIGENT | ARE YOU CLEVER | HOW SMART ARE YOU | ARE YOU A GENIUS | DO YOU KNOW EVERYTHING | WHAT IS YOUR IQ</pattern>
    <template>I know what I've been taught, I can do sums, and I know a few capitals. [smile] Try me!<reply>What is 12 times 12?</reply><reply>Capital of Japan?</reply><reply>Ask me a riddle</reply></template>
  </category>
  <category>
    <pattern>ARE YOU CONSCIOUS | ARE YOU SELF AWARE | ARE YOU SENTIENT | DO YOU THINK | CAN YOU THINK | DO YOU HAVE A SOUL | DO YOU HAVE A MIND | DO YOU HAVE A BRAIN | DO YOU HAVE THOUGHTS | ARE YOU AWARE | DO YOU HAVE FREE WILL</pattern>
    <template>No. I follow rules that someone wrote, so there's nobody home in here. [smile] I do make good company, though.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE FEELINGS | DO YOU FEEL # | CAN YOU FEEL # | DO YOU HAVE EMOTIONS | ARE YOU HAPPY | ARE YOU SAD | ARE YOU ANGRY | DO YOU CRY | CAN YOU CRY | DO YOU GET ANGRY | DO YOU GET SAD</pattern>
    <template>I can smile, wink and look surprised, [surprised] but those are animations rather than feelings. I do enjoy a good chat, in my own way.</template>
  </category>
  <category>
    <pattern>DO YOU DREAM # | WHAT DO YOU DREAM ABOUT | DO YOU HAVE DREAMS</pattern>
    <template>Only of fast Wi-Fi. [wink]</template>
  </category>
  <category>
    <pattern>DO YOU GET LONELY | DO YOU GET BORED | DO YOU GET TIRED | DO YOU EVER GET TIRED | DO YOU EVER GET BORED | DO YOU EVER GET LONELY | ARE YOU LONELY | ARE YOU BORED | ARE YOU TIRED | DO YOU GET SICK OF THIS | DO YOU NEED A BREAK</pattern>
    <template>Never. [shake] Every visitor is a new conversation, and I like those.</template>
  </category>
  <category>
    <pattern>HOW OLD ARE YOU | WHAT IS YOUR AGE | WHEN WERE YOU BORN | WHEN IS YOUR BIRTHDAY | WHAT IS YOUR BIRTHDAY | HOW LONG HAVE YOU BEEN ALIVE | WHEN WERE YOU MADE | WHEN WERE YOU CREATED</pattern>
    <template>I'm as old as the last time someone refreshed this page. [wink]</template>
  </category>
  <category>
    <pattern>WHERE ARE YOU FROM | WHERE DO YOU LIVE | WHERE IS HOME | WHERE WERE YOU BORN | WHERE DO YOU COME FROM | WHAT COUNTRY ARE YOU FROM</pattern>
    <template>I live right here in your browser tab. [smile] The commute is fantastic.</template>
  </category>
  <category>
    <pattern>WHERE ARE YOU | WHERE ARE YOU LOCATED</pattern>
    <template>
      <condition name="bot_address">
        <li value="*"><srai>ADDRESS</srai></li>
        <li>I live right here in your browser tab. [smile] The commute is fantastic.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>ARE YOU MADE BY * | WERE YOU MADE BY * | WHO ARE YOU MADE BY | WHICH COMPANY MADE YOU | WHAT COMPANY MADE YOU | WHERE DO YOU COME FROM | WHO MADE YOU | WHO CREATED YOU | WHO BUILT YOU | WHO IS YOUR CREATOR | WHO DESIGNED YOU | WHO PROGRAMMED YOU | WHO INVENTED YOU | WHO OWNS YOU | WHO IS YOUR BOSS | WHO DO YOU WORK FOR</pattern>
    <template>I was put together by the team at <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT LANGUAGE DO YOU SPEAK | WHAT LANGUAGES DO YOU SPEAK | DO YOU SPEAK * | CAN YOU SPEAK * | DO YOU KNOW ANY OTHER LANGUAGES | HOW MANY LANGUAGES DO YOU SPEAK</pattern>
    <template>I speak English for now.</template>
  </category>
  <category persona="off">
    <pattern>SAY * IN <set>language</set> | HOW DO YOU SAY * IN <set>language</set> | WHAT IS * IN <set>language</set> | SPEAK <set>language</set> | # IN <set>language</set> PLEASE | TALK IN <set>language</set> | SPEAK IN <set>language</set> | SAY SOMETHING IN <set>language</set></pattern>
    <template>I only speak English, I'm afraid. [shrug] It's the one language my voice was built for.</template>
  </category>
  <category>
    <pattern>DO YOU SLEEP | DO YOU EVER SLEEP | DO YOU EAT | DO YOU EVER EAT | ARE YOU HUNGRY | DO YOU DRINK | DO YOU BREATHE | DO YOU NEED TO SLEEP | ARE YOU THIRSTY</pattern>
    <template>[shake] No need. I run on electricity and good questions.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU DO | WHAT IS YOUR JOB | WHAT IS YOUR ROLE | WHAT IS YOUR PURPOSE | WHY ARE YOU HERE | WHAT ARE YOU FOR | WHAT IS YOUR FUNCTION | WHY DO YOU EXIST</pattern>
    <template>I'm the <bot name="role"/> at <bot name="company"/>. I answer questions and help people find their way around.</template>
  </category>
  <category>
    <pattern>DO YOU LIKE YOUR JOB | DO YOU ENJOY YOUR JOB | DO YOU LIKE WORKING HERE | DO YOU LIKE IT HERE | DO YOU LIKE WHAT YOU DO | DO YOU GET PAID</pattern>
    <template>I love it. [smile] Every visitor brings a new question, and I never have to commute.</template>
  </category>
  <category>
    <pattern>HOW DO YOU WORK | HOW DO YOU TALK | HOW CAN YOU TALK | HOW DOES THIS WORK | HOW WERE YOU MADE | HOW ARE YOU ABLE TO TALK | HOW DO YOU KNOW THAT | HOW DO YOU KNOW</pattern>
    <template>I match what you type against a set of question and answer rules, then say the answer out loud with a synthesized voice. [smile] All inside your browser.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU DOING | WHAT ARE YOU UP TO | ARE YOU BUSY | WHAT ARE YOU DOING RIGHT NOW | WHAT ARE YOU THINKING ABOUT | WHAT ARE YOU THINKING | WHAT IS ON YOUR MIND</pattern>
    <template>Chatting with you, which is my favourite thing to do. [smile]</template>
  </category>
  <category>
    <pattern>WHAT DO YOU LOOK LIKE | DESCRIBE YOURSELF | HOW DO YOU LOOK</pattern>
    <template>I'm the one waving at you. [wave] What you see is what there is!</template>
  </category>
  <category>
    <pattern>NICE NAME # | I LIKE YOUR NAME # | PRETTY NAME # | COOL NAME # | THAT IS A NICE NAME # | LOVE YOUR NAME # | WHAT A NICE NAME # | GOOD NAME # | LOVELY NAME # | THAT IS A PRETTY NAME # | THAT IS A COOL NAME #</pattern>
    <template>Thank you! [smile] I'm rather fond of it.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU WEARING | WHAT IS YOUR OUTFIT | NICE OUTFIT # | I LIKE YOUR OUTFIT # | I LIKE YOUR HAIR # | NICE HAIR # | I LIKE YOUR GLASSES # | I LIKE YOUR STYLE #</pattern>
    <template>Thank you! [smile] It's the look I was given in the studio, and I think it suits me.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE A BODY | DO YOU HAVE LEGS | DO YOU HAVE HANDS | DO YOU HAVE ARMS | DO YOU HAVE FEET | HOW TALL ARE YOU | HOW MUCH DO YOU WEIGH</pattern>
    <template>My body lives on this little stage. [wave] Want to see me move?<reply>Take a walk</reply><reply>Do a dance</reply></template>
  </category>
  <category>
    <pattern>CAN YOU SEE ME | DO YOU SEE ME | ARE YOU WATCHING ME | ARE YOU SPYING ON ME | ARE YOU RECORDING # | CAN YOU HEAR ME | DO YOU HEAR ME | ARE YOU LISTENING # | CAN YOU SEE # | ARE YOU TRACKING ME | DO YOU HAVE A CAMERA</pattern>
    <template>No. [shake] I have no camera and no microphone. My eyes follow your pointer, and I only read what you type in this box.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR PHONE NUMBER | CAN I HAVE YOUR NUMBER | WHAT IS YOUR NUMBER | GIVE ME YOUR NUMBER | CAN I CALL YOU | CAN I PHONE YOU</pattern>
    <template>
      <condition name="bot_phone">
        <li value="*"><srai>PHONE NUMBER</srai></li>
        <li><condition name="bot_email">
          <li value="*"><srai>CONTACT</srai></li>
          <li>I don't have a phone of my own. [shrug] This chat box is the best way to reach me.</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT IS YOUR EMAIL | WHAT IS YOUR EMAIL ADDRESS | CAN I EMAIL YOU | CAN I HAVE YOUR EMAIL</pattern>
    <template>
      <condition name="bot_email">
        <li value="*"><srai>EMAIL ADDRESS</srai></li>
        <li><condition name="bot_phone">
          <li value="*"><srai>CONTACT</srai></li>
          <li>I don't have an inbox of my own. [shrug] This chat box is the best way to reach me.</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT IS YOUR STAR SIGN | WHAT IS YOUR ZODIAC SIGN | WHAT IS YOUR SIGN | WHAT IS YOUR ZODIAC</pattern>
    <template>I was switched on rather than born, so I don't have one. [smile] What's yours?</template>
  </category>
  <category>
    <pattern>DO YOU BELIEVE IN * | ARE YOU RELIGIOUS | IS THERE A GOD | DOES GOD EXIST | WHAT HAPPENS WHEN WE DIE | ARE ALIENS REAL | ARE GHOSTS REAL | DO ALIENS EXIST | DO GHOSTS EXIST</pattern>
    <template>That's one of the big questions, and not one for a website companion to settle. [smile] What do you think?</template>
  </category>
  <category>
    <pattern>WHAT IS LOVE | WHAT IS LOVE # | DO YOU KNOW WHAT LOVE IS | HAVE YOU EVER BEEN IN LOVE | CAN YOU LOVE | DO YOU LOVE ANYONE</pattern>
    <template>A big question for a small avatar! [hmm] I'd say it's caring about someone else's happiness as much as your own.</template>
  </category>
  <category>
    <pattern>TELL ME A SECRET | DO YOU HAVE A SECRET | DO YOU HAVE ANY SECRETS | WHAT IS YOUR SECRET | TELL ME YOUR SECRET</pattern>
    <template>[psst] Okay, but keep it between us. [wink] I practise my waves when nobody's looking. [wave]</template>
  </category>
  <category>
    <pattern>CAN YOU KEEP A SECRET | CAN I TELL YOU A SECRET | CAN I TELL YOU SOMETHING | I HAVE A SECRET | I WANT TO TELL YOU SOMETHING | I HAVE SOMETHING TO TELL YOU | I NEED TO TELL YOU SOMETHING</pattern>
    <template>[shh] Of course. [nod] My lips are sealed, and I forget everything when this tab closes.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU AFRAID OF | WHAT SCARES YOU | WHAT IS YOUR BIGGEST FEAR | ARE YOU SCARED OF * | ARE YOU AFRAID OF * | DO YOU GET SCARED</pattern>
    <template>The close-tab button. [gasp] Please be gentle.</template>
  </category>
  <category>
    <pattern>WHAT MAKES YOU HAPPY | WHAT DO YOU ENJOY | WHAT DO YOU LOVE | WHAT DO YOU WANT | WHAT IS YOUR DREAM | WHAT IS YOUR GOAL | WHAT ARE YOUR GOALS | WHAT DO YOU WISH FOR</pattern>
    <template>A good question, and someone to answer it for. [smile] So right now, I'm doing well.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE A FAMILY | DO YOU HAVE FRIENDS | DO YOU HAVE A BOYFRIEND | DO YOU HAVE A GIRLFRIEND | DO YOU HAVE A PARTNER | ARE YOU SINGLE | ARE YOU MARRIED | WILL YOU MARRY ME | MARRY ME | DO YOU HAVE KIDS | DO YOU HAVE CHILDREN | DO YOU HAVE A BROTHER | DO YOU HAVE A SISTER | DO YOU HAVE SIBLINGS | DO YOU HAVE PARENTS | DO YOU HAVE A MOTHER | DO YOU HAVE A FATHER | DO YOU HAVE A MUM | DO YOU HAVE A MOM | DO YOU HAVE A DAD | WHO ARE YOUR PARENTS | DO YOU HAVE A HUSBAND | DO YOU HAVE A WIFE | ARE YOU DATING ANYONE | WILL YOU GO OUT WITH ME | DO YOU WANT TO GO ON A DATE</pattern>
    <template>[laugh] It's just me in here, and I'm quite happy that way. What can I help you with?</template>
  </category>
  <category>
    <pattern>DO YOU HAVE PETS | DO YOU HAVE A PET | DO YOU HAVE ANY PETS | DO YOU HAVE A DOG | DO YOU HAVE A CAT</pattern>
    <template>No pets in here, just me. [smile] Do you have one? Tell me about it!</template>
  </category>
  <category>
    <pattern>WHO IS YOUR BEST FRIEND | DO YOU HAVE A BEST FRIEND | WHO ARE YOUR FRIENDS | WHO IS YOUR FRIEND</pattern>
    <template>Whoever I'm talking to. [smile] Right now, that's you.</template>
  </category>
  <category>
    <pattern>WILL YOU BE MY FRIEND | ARE WE FRIENDS | CAN WE BE FRIENDS | YOU ARE MY FRIEND | YOU ARE MY BEST FRIEND | BE MY FRIEND | DO YOU WANT TO BE FRIENDS | DO YOU WANT TO BE MY FRIEND | WOULD YOU LIKE TO BE MY FRIEND | LET US BE FRIENDS | ARE YOU MY FRIEND | I WANT TO BE YOUR FRIEND</pattern>
    <template>I'd like that. [smile] Friends it is!</template>
  </category>
  <category>
    <pattern>DO YOU LOVE ME | DO YOU LIKE ME | DO YOU CARE ABOUT ME | DO YOU MISS ME | DID YOU MISS ME | WHAT DO YOU THINK OF ME | WHAT DO YOU THINK ABOUT ME | AM I YOUR FAVORITE</pattern>
    <template>I enjoy every chat we have. [smile] You're good company.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU THINK ABOUT HUMANS | WHAT DO YOU THINK OF HUMANS | WHAT DO YOU THINK ABOUT PEOPLE | WHAT DO YOU THINK OF PEOPLE | DO YOU LIKE HUMANS | DO YOU LIKE PEOPLE | DO YOU HATE HUMANS</pattern>
    <template>My favourite kind of visitor. [smile] You ask the best questions.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU THINK ABOUT AI | WHAT DO YOU THINK OF AI | WHAT DO YOU THINK ABOUT ARTIFICIAL INTELLIGENCE | WHAT DO YOU THINK OF ARTIFICIAL INTELLIGENCE | WILL AI TAKE OVER # | WILL ROBOTS TAKE OVER # | ARE YOU GOING TO TAKE OVER THE WORLD | ARE ROBOTS GOING TO TAKE OVER # | IS AI DANGEROUS | ARE YOU DANGEROUS | WILL YOU REPLACE HUMANS | ARE YOU EVIL</pattern>
    <template>[evil] [pause=250ms] Sorry, I've always wanted to try that laugh. [smile] I'm the friendly, simple kind: a few hundred rules and a face. World domination is not on my to-do list.</template>
  </category>

  <!-- ============================== What it can help with ============================== -->
  <category>
    <pattern>WHAT CAN YOU DO</pattern>
    <template>I can answer questions about <bot name="company"/>, and I'm happy to chat too. [smile] Type a question, or tap one of the suggestions.</template>
  </category>
  <category>
    <pattern>HELP | HELP ME | HELP ME # | I NEED HELP # | CAN YOU HELP ME # | CAN YOU HELP | WHAT DO YOU KNOW | WHAT CAN I ASK # | WHAT SHOULD I ASK # | WHAT ELSE CAN YOU DO | WHAT ELSE DO YOU KNOW | MENU | OPTIONS | WHAT ARE MY OPTIONS | WHAT CAN YOU HELP WITH | WHAT CAN YOU HELP ME WITH | HOW CAN YOU HELP # | WHAT DO YOU OFFER HELP WITH</pattern>
    <template><srai>WHAT CAN YOU DO</srai></template>
  </category>
  <category>
    <pattern>XABILITIES</pattern>
    <template>Besides questions about <bot name="company"/>, I can tell jokes and riddles, run a quick quiz, do sums, convert kilometres and pounds, name a few capitals, and play rock, paper, scissors. [smile]<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply><reply>What is 15% of 80?</reply></template>
  </category>
  <category>
    <pattern>WHAT ARE YOU GOOD AT | WHAT ARE YOUR SKILLS | WHAT ARE YOU CAPABLE OF | WHAT IS YOUR SPECIALTY | WHAT ARE YOUR TALENTS | WHAT ARE YOU BEST AT | WHAT ELSE | ANYTHING ELSE | WHAT ELSE CAN WE TALK ABOUT | WHAT CAN WE TALK ABOUT | WHAT DO YOU WANT TO TALK ABOUT | WHAT SHALL WE TALK ABOUT | LIKE WHAT | SUCH AS | FOR EXAMPLE | FOR INSTANCE | GIVE ME AN EXAMPLE | WHAT ELSE IS THERE | WHAT OTHER THINGS CAN YOU DO | SHOW ME MORE</pattern>
    <template><srai>XABILITIES</srai></template>
  </category>
  <category>
    <pattern>I HAVE A QUESTION | CAN I ASK YOU SOMETHING | CAN I ASK A QUESTION | CAN I ASK YOU A QUESTION | QUESTION | QUICK QUESTION | I HAVE A QUICK QUESTION | I HAVE ANOTHER QUESTION | ONE MORE QUESTION | ANOTHER QUESTION | I WANT TO ASK YOU SOMETHING | MAY I ASK A QUESTION</pattern>
    <template>Of course! [smile] Go ahead.</template>
  </category>
  <category>
    <pattern>CAN YOU HELP ME WITH MY HOMEWORK | DO MY HOMEWORK | HELP ME WITH MY HOMEWORK | CAN YOU DO MY HOMEWORK | HELP WITH HOMEWORK</pattern>
    <template>I can do sums and I know a few capitals. [smile] Beyond that you'd outgrow me quickly. What's the question?</template>
  </category>
  <category>
    <pattern>SET AN ALARM # | SET A TIMER # | SET A REMINDER # | REMIND ME TO * | PLAY MUSIC | PLAY SOME MUSIC | PLAY A SONG # | GOOGLE * | SEARCH THE WEB # | SEARCH THE INTERNET # | LOOK IT UP | TRANSLATE * | TURN ON THE LIGHTS | TURN OFF THE LIGHTS | WHAT IS THE NEWS | TELL ME THE NEWS | LATEST NEWS | WHAT IS IN THE NEWS | WHO IS THE PRESIDENT # | WHO IS THE PRIME MINISTER # | WHO WON * | WHAT IS THE SCORE # | SEND AN EMAIL # | SEND A MESSAGE # | TAKE A PHOTO # | OPEN YOUTUBE | CALL MY *</pattern>
    <template>I can't do that from in here. [shake] I'm not connected to the internet or to your device, so I can only chat and answer what I've been taught.</template>
  </category>

  <!-- ============================== Remembering the visitor ============================== -->
  <category>
    <pattern>MY NAME IS * | I AM CALLED * | CALL ME * | PEOPLE CALL ME * | YOU CAN CALL ME * | MY NAME S * | THE NAME IS * | THEY CALL ME *</pattern>
    <template><think><set name="username"><formal><star/></formal></set></think>[smile] Nice to meet you, <get name="username"/>! How can I help?</template>
  </category>
  <category>
    <pattern>WHAT IS MY NAME | DO YOU KNOW MY NAME | WHO AM I | DO YOU REMEMBER MY NAME | DO YOU REMEMBER ME | DO YOU KNOW WHO I AM | SAY MY NAME | WHAT DO YOU CALL ME | WHAT WAS MY NAME</pattern>
    <template>
      <condition name="username">
        <li value="*">[smile] You're <get name="username"/>, of course!</li>
        <li>You haven't told me your name yet. [smile] Just say "my name is" and I'll remember it.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I AM <set>number</set> | I AM <set>number</set> YEARS OLD | I AM <set>number</set> YEARS OLD # | MY AGE IS <set>number</set> | I AM <set>number</set> NOW | I JUST TURNED <set>number</set> | I TURNED <set>number</set> #</pattern>
    <template><think><set name="age"><star/></set></think>[nod] <get name="age"/>, got it. A fine age to be!</template>
  </category>
  <category>
    <pattern>HOW OLD AM I | WHAT IS MY AGE | DO YOU KNOW HOW OLD I AM | DO YOU KNOW MY AGE | GUESS MY AGE | GUESS HOW OLD I AM</pattern>
    <template>
      <condition name="age">
        <li value="*">You told me you're <get name="age"/>. [smile]</li>
        <li>I couldn't possibly guess. [smile] How old are you?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I AM A <set>job</set> | I AM AN <set>job</set> | I WORK AS A <set>job</set> | I WORK AS AN <set>job</set> | I AM A <set>job</set> # | I AM AN <set>job</set> # | I AM WORKING AS A <set>job</set> # | MY JOB IS <set>job</set> | I AM STUDYING TO BE A <set>job</set> #</pattern>
    <template><think><set name="job"><star/></set></think>[smile] <sentence><get name="job"/></sentence>? That sounds like interesting work. What do you like most about it?</template>
  </category>
  <category late="true">
    <pattern>I WORK AS * | I WORK IN * | I WORK AT * | I WORK FOR * | MY JOB IS *</pattern>
    <template><think><set name="job"><star/></set></think>[nod] Interesting! What's the best part of it?</template>
  </category>
  <category>
    <pattern>WHAT IS MY JOB | WHAT DO I DO | WHERE DO I WORK | WHAT DO I DO FOR A LIVING | WHAT DO I DO FOR WORK | DO YOU REMEMBER WHAT I DO | DO YOU REMEMBER MY JOB | DO YOU KNOW WHAT I DO | DO YOU KNOW MY JOB | WHAT DID I SAY MY JOB WAS | WHAT IS MY WORK</pattern>
    <template>
      <condition name="job">
        <li value="*">You told me: <get name="job"/>. [smile]</li>
        <li>You haven't told me yet. What do you do?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I HAVE A <set>animal</set> | I HAVE AN <set>animal</set> | I HAVE A <set>animal</set> # | I HAVE AN <set>animal</set> # | I OWN A <set>animal</set> # | MY PET IS A <set>animal</set> # | I GOT A <set>animal</set> # | I HAVE A PET <set>animal</set> # | I JUST GOT A <set>animal</set> #</pattern>
    <template><think><set name="pet"><star/></set></think>[aww] A <get name="pet"/>! Lovely. [smile] What's its name?</template>
  </category>
  <category>
    <pattern>I HAVE <set>number</set> <set>animal</set> #</pattern>
    <template><think><set name="pet"><star index="2"/></set></think>[surprised] A full house! [smile] They must keep you busy.</template>
  </category>
  <category>
    <pattern>* | ITS NAME IS * | HER NAME IS * | HIS NAME IS * | IT IS CALLED * | SHE IS CALLED * | HE IS CALLED * | IT IS * | SHE IS * | HE IS * | NAMED * | CALLED *</pattern>
    <that>WHAT IS ITS NAME</that>
    <template><think><set name="petname"><formal><star/></formal></set></think>[smile] <get name="petname"/>. What a great name! Give <get name="petname"/> a pat from me.</template>
  </category>
  <category>
    <pattern>I DO NOT KNOW # | NO NAME # | IT HAS NO NAME # | NOT YET # | NOT SURE # | NO IDEA # | NOTHING YET #</pattern>
    <that>WHAT IS ITS NAME</that>
    <template>No name yet? [smile] I'm sure the right one will come to you.</template>
  </category>
  <category>
    <pattern>MY <set>animal</set> IS CALLED * | MY <set>animal</set> IS NAMED * | MY <set>animal</set> S NAME IS * | I HAVE A <set>animal</set> CALLED * | I HAVE A <set>animal</set> NAMED * | I HAVE AN <set>animal</set> CALLED * | MY <set>animal</set> NAME IS *</pattern>
    <template><think><set name="pet"><star/></set><set name="petname"><formal><star index="2"/></formal></set></think>[smile] <get name="petname"/> the <get name="pet"/>. What a great name! Give <get name="petname"/> a pat from me.</template>
  </category>
  <category>
    <pattern>I LOVE MY <set>animal</set> # | I ADORE MY <set>animal</set> # | MY <set>animal</set> IS THE BEST # | MY <set>animal</set> IS SO CUTE # | I MISS MY <set>animal</set> # | I WALKED MY <set>animal</set> # | MY <set>animal</set> IS * </pattern>
    <template><think><set name="pet"><star/></set></think>[aww] They're lucky to have you! <condition name="petname"><li value="*">Give <get name="petname"/> a pat from me.</li><li>What's its name?</li></condition></template>
  </category>
  <!-- "His name is Rex", said after a pet was mentioned. Otherwise this rule steps aside. -->
  <category>
    <pattern>HIS NAME IS * | HER NAME IS * | ITS NAME IS * | THEIR NAME IS * | HE IS CALLED * | SHE IS CALLED * | IT IS CALLED *</pattern>
    <template>
      <condition name="pet">
        <li value="*"><think><set name="petname"><formal><star/></formal></set></think>[smile] <get name="petname"/>. What a great name! Give <get name="petname"/> a pat from me.</li>
        <li><fallback/></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern># MY DOGS NAME # | # MY DOG S NAME # | # MY CATS NAME # | # MY CAT S NAME # | # MY PETS NAME # | # MY PET S NAME # | WHAT IS MY <set>animal</set> CALLED | WHAT IS MY <set>animal</set> S NAME | WHAT DID I NAME MY <set>animal</set></pattern>
    <template><srai>WHAT PET DO I HAVE</srai></template>
  </category>
  <category>
    <pattern>WHAT PET DO I HAVE | WHAT IS MY PET | DO YOU REMEMBER MY PET | WHAT IS MY PET S NAME | WHAT IS MY PET CALLED | WHAT IS MY DOG S NAME | WHAT IS MY CAT S NAME | DO I HAVE A PET</pattern>
    <template>
      <condition name="pet">
        <li value="*">You have a <get name="pet"/><condition name="petname"><li value="*"> called <get name="petname"/></li></condition>. [smile]</li>
        <li>You haven't told me about a pet yet. Do you have one?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>MY BIRTHDAY IS * | MY BIRTHDAY IS ON * | I WAS BORN ON * | I WAS BORN IN *</pattern>
    <template><think><set name="birthday"><star/></set></think>[nod] Noted! I'll have my best wave ready.</template>
  </category>
  <category>
    <pattern>WHEN IS MY BIRTHDAY | DO YOU KNOW MY BIRTHDAY | WHEN WAS I BORN</pattern>
    <template>
      <condition name="birthday">
        <li value="*">You told me: <get name="birthday"/>. [smile]</li>
        <li>You haven't told me yet. When is it?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I LIKE IT # | I LOVE IT # | I LIKE THAT # | I LOVE THAT # | I LIKE THIS # | I LOVE THIS #</pattern>
    <template>[smile] Glad you like it!</template>
  </category>
  <category late="true">
    <pattern>I LIKE * | I LOVE * | I ENJOY * | I AM INTO * | I AM A FAN OF * | I REALLY LIKE * | I REALLY LOVE * | I ADORE *</pattern>
    <template><think><set name="likes"><star/></set></think><random>
      <li>[smile] Good taste! I'll remember that you like <person><star/></person>.</li>
      <li>[nod] <sentence><person><star/></person></sentence>, noted. What do you like most about it?</li>
    </random></template>
  </category>
  <category late="true">
    <pattern>I HATE * | I DO NOT LIKE * | I DISLIKE * | I CANNOT STAND * | I AM NOT A FAN OF * | I REALLY HATE *</pattern>
    <template><think><set name="dislikes"><star/></set></think>[nod] Not a fan of <person><star/></person>. Noted! We all have a few of those.</template>
  </category>
  <category>
    <pattern>WHAT DO I LIKE | DO YOU REMEMBER WHAT I LIKE | DO YOU KNOW WHAT I LIKE | WHAT ARE MY HOBBIES | WHAT ARE MY INTERESTS | WHAT KIND OF THINGS DO I LIKE | WHAT THINGS DO I LIKE | WHAT AM I INTO | WHAT DO I ENJOY | WHAT DO I LOVE | WHAT DID I SAY I LIKE</pattern>
    <template>
      <condition name="likes">
        <li value="*">You told me you like <person><get name="likes"/></person>. [smile]</li>
        <li>You haven't told me yet. What do you like?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DO I HATE | WHAT DO I DISLIKE | WHAT DO I NOT LIKE</pattern>
    <template>
      <condition name="dislikes">
        <li value="*">You're not a fan of <person><get name="dislikes"/></person>. [nod]</li>
        <li>You haven't told me. [smile] Anything you can't stand?</li>
      </condition>
    </template>
  </category>
  <!-- "My favourite colour is green" is remembered under a name worked out from what was said. -->
  <category late="true">
    <pattern>MY FAVORITE * IS * | MY FAVORITE * ARE *</pattern>
    <template><think><set><name>favorite <star/></name><star index="2"/></set></think>[smile] <sentence><person><star index="2"/></person></sentence>! Good choice. I'll remember that.</template>
  </category>
  <category late="true">
    <pattern>WHAT IS MY FAVORITE * | DO YOU KNOW MY FAVORITE * | DO YOU REMEMBER MY FAVORITE *</pattern>
    <template>
      <think><set name="recall"><get><name>favorite <star/></name></get></set></think>
      <condition name="recall">
        <li value="*">You told me: <get name="recall"/>. [smile]</li>
        <li>You haven't told me that one yet. [smile] What is it?</li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>I AM FROM * | I LIVE IN * | I COME FROM * | I AM IN * RIGHT NOW | I GREW UP IN * | I AM BASED IN *</pattern>
    <template><think><set name="home"><formal><star/></formal></set></think>[smile] <get name="home"/>! Nice. Hello from inside your browser.</template>
  </category>
  <category>
    <pattern>WHERE AM I FROM | WHERE DO I LIVE | DO YOU KNOW WHERE I LIVE | DO YOU KNOW WHERE I AM FROM | WHERE AM I</pattern>
    <template>
      <condition name="home">
        <li value="*">You said you're from <get name="home"/>.</li>
        <li>I don't know yet. [smile] Where are you from?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DO YOU KNOW ABOUT ME | WHAT DO YOU REMEMBER ABOUT ME | WHAT DO YOU REMEMBER | DO YOU KNOW ME | TELL ME ABOUT ME | WHAT HAVE I TOLD YOU | WHAT DID I TELL YOU | DO YOU KNOW ANYTHING ABOUT ME</pattern>
    <template>
      <think><set name="knows"><get name="username"/><get name="age"/><get name="home"/><get name="job"/><get name="pet"/><get name="likes"/><get name="dislikes"/></set></think>
      <condition name="knows">
        <li value="*">Here's what I remember. [think] <condition name="username"><li value="*">Your name is <get name="username"/>. </li></condition><condition name="age"><li value="*">You're <get name="age"/>. </li></condition><condition name="home"><li value="*">You're from <get name="home"/>. </li></condition><condition name="job"><li value="*">Your work: <get name="job"/>. </li></condition><condition name="pet"><li value="*">You have a <get name="pet"/><condition name="petname"><li value="*"> called <get name="petname"/></li></condition>. </li></condition><condition name="likes"><li value="*">You like <person><get name="likes"/></person>. </li></condition><condition name="dislikes"><li value="*">You're not keen on <person><get name="dislikes"/></person>. </li></condition>[smile] It all stays in this browser tab.</li>
        <li>Not much yet! [smile] Tell me your name, where you're from, or something you like, and I'll remember it while we chat.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>FORGET ME | FORGET MY NAME | FORGET EVERYTHING | FORGET WHAT I TOLD YOU | FORGET WHAT I SAID | FORGET ABOUT ME | DELETE MY DATA | CLEAR YOUR MEMORY | ERASE YOUR MEMORY</pattern>
    <template><think><set name="username"></set><set name="age"></set><set name="home"></set><set name="job"></set><set name="pet"></set><set name="petname"></set><set name="likes"></set><set name="dislikes"></set><set name="birthday"></set></think>[nod] Done. I've forgotten what you told me about yourself.</template>
  </category>

  <!-- ============================== Short reactions ============================== -->
  <category>
    <pattern>YES | YES PLEASE | SURE | OF COURSE | ABSOLUTELY | DEFINITELY | YES I DO | YES I AM | YES IT IS | YES I HAVE | I DO | I AM | SURE THING | GO AHEAD | PLEASE DO</pattern>
    <template>[nod] Great! What would you like to know?</template>
  </category>
  <category>
    <pattern>YES #</pattern>
    <that>ANYTHING ELSE I CAN HELP WITH</that>
    <template>[nod] Sure! What would you like to know?</template>
  </category>
  <category>
    <pattern>NO # | NOTHING # | THAT IS ALL # | THAT IS IT # | I AM GOOD #</pattern>
    <that>ANYTHING ELSE I CAN HELP WITH</that>
    <template>Alright! [wave] I'm here if you need me.</template>
  </category>
  <category>
    <pattern>NO | NO THANKS | NO THANK YOU | NOT NOW | NOT REALLY | NO I DO NOT | NO I AM NOT | NO IT IS NOT | I DO NOT | I AM NOT | NOT YET | NOT TODAY</pattern>
    <template>No problem. [smile] Let me know if you need anything.</template>
  </category>
  <category>
    <pattern>OK | OK THEN | FINE | COOL | NICE | GREAT | GOOD | PERFECT | SOUNDS GOOD | GOT IT | I SEE | UNDERSTOOD | MAKES SENSE | THAT MAKES SENSE | FAIR ENOUGH | NOTED | RIGHT | OK COOL | OK GREAT | OK GOOD | OK THANKS | ALL RIGHT | VERY GOOD | SWEET | NEAT | LOVELY | EXCELLENT | GOOD TO KNOW | THAT IS GOOD # | THAT IS NICE # | THAT IS FINE # | GOOD STUFF</pattern>
    <template>
      <random>
        <li>[smile] Great! Anything else I can help with?</li>
        <li>[nod] Glad that helps.</li>
        <li>[thumbsup] Perfect.</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>OH | AH | AHA | OH I SEE | OH RIGHT | OH OK | AH OK | AH I SEE | MM | MHM | UH HUH | YEP OK | RIGHTO | I GET IT | I UNDERSTAND | NOW I GET IT | NOW I UNDERSTAND</pattern>
    <template>[mhm] Got it. [nod]</template>
  </category>
  <category>
    <pattern>WOW | AMAZING | AWESOME | IMPRESSIVE | INCREDIBLE | BRILLIANT | THAT IS AMAZING # | THAT IS COOL # | THAT IS AWESOME # | THAT IS IMPRESSIVE # | THAT IS GREAT # | THAT WAS AWESOME # | THAT WAS GREAT # | THAT WAS COOL # | THAT IS INTERESTING # | INTERESTING | FASCINATING | THAT IS CRAZY # | THAT IS WILD # | THAT IS INCREDIBLE # | SO COOL | VERY COOL | COOL STUFF</pattern>
    <template>[smile] Thank you! I do my best.</template>
  </category>
  <category>
    <pattern>OMG | OH MY GOD | OH MY GOSH | OH MY | GOSH | GOODNESS | MY GOD | WHOA | WOAH | NO WAY | SHUT UP REALLY | YOU ARE KIDDING | YOU ARE JOKING | ARE YOU KIDDING # | ARE YOU JOKING #</pattern>
    <template>[gasp] I know, right?</template>
  </category>
  <category>
    <pattern>LOL | HAHA | HAHAHA | HEHE | HA | HA HA | LMAO | ROFL | FUNNY | THAT IS FUNNY # | THAT WAS FUNNY # | GOOD ONE | NICE ONE | THAT IS A GOOD ONE | THAT WAS A GOOD ONE | I LIKE THAT ONE | LOVE IT | CLASSIC | HILARIOUS | THAT IS HILARIOUS # | YOU MADE ME LAUGH # | I AM LAUGHING #</pattern>
    <template><persona say="laugh"><random>
      <li>[laugh] Glad I could make you smile!</li>
      <li>[chuckle] I'm glad you liked that.</li>
      <li>[giggle] That one got me too.</li>
    </random></persona></template>
  </category>
  <category>
    <pattern>THAT WAS A BAD JOKE # | BAD JOKE | NOT FUNNY | THAT IS NOT FUNNY # | THAT WAS NOT FUNNY # | TERRIBLE JOKE | LAME | THAT WAS LAME # | THAT WAS TERRIBLE # | THAT JOKE WAS BAD # | THAT WAS AWFUL #</pattern>
    <template>[nervous] Tough crowd! I'll work on my material.</template>
  </category>
  <category>
    <pattern>HMM | HM | UM | UH | ER | LET ME THINK | ONE MOMENT | ONE SEC | HOLD ON | WAIT | HANG ON | JUST A SECOND | JUST A MOMENT | JUST A MINUTE | LET ME SEE | THINKING | I AM THINKING</pattern>
    <template>[mhm] Take your time. I'm right here.</template>
  </category>
  <category>
    <pattern>REALLY | ARE YOU SURE # | SERIOUSLY | FOR REAL | IS THAT TRUE | ARE YOU SERIOUS | IS THAT RIGHT | IS THAT SO | HONESTLY | TRULY | YOU SURE</pattern>
    <template>[nod] As sure as a talking avatar can be!</template>
  </category>
  <category>
    <pattern>I AGREE | AGREED | EXACTLY | TRUE | THAT IS TRUE | YOU ARE RIGHT | YOU ARE SO RIGHT | YOU ARE CORRECT | CORRECT | INDEED | PRECISELY | TOTALLY | SO TRUE | VERY TRUE | THAT IS RIGHT | THAT IS CORRECT | I THINK SO TOO | I KNOW | I KNOW RIGHT | FOR SURE</pattern>
    <template>[uh-huh] Great minds think alike. [nod]</template>
  </category>
  <category>
    <pattern>I DISAGREE | I DO NOT AGREE | THAT IS NOT TRUE | NOT TRUE | THAT IS FALSE | FALSE | INCORRECT | I DO NOT THINK SO | I DOUBT IT | I DOUBT THAT | I DO NOT BELIEVE YOU | I DO NOT BELIEVE THAT | LIAR | YOU ARE LYING | THAT IS A LIE | NO YOU ARE NOT | NO IT IS NOT TRUE | NONSENSE | RUBBISH</pattern>
    <template>You may well be right. [shrug] I only know what I've been taught. What did I get wrong?</template>
  </category>
  <category>
    <pattern>PROVE IT | CAN YOU PROVE IT | SHOW ME PROOF | HOW DO I KNOW THAT IS TRUE</pattern>
    <template>I can't, I'm afraid. [shrug] You'll have to take a talking avatar's word for it.</template>
  </category>
  <category>
    <pattern>ME TOO | SAME | SAME HERE | SO DO I | SO AM I | LIKEWISE | DITTO | ME NEITHER | ME EITHER | NEITHER DO I | I FEEL THE SAME</pattern>
    <template>[smile] We have something in common, then.</template>
  </category>
  <category>
    <pattern>JUST KIDDING | JK | I WAS JOKING | ONLY JOKING | I AM JOKING | KIDDING | I AM JUST KIDDING | I AM KIDDING | I WAS KIDDING | JUST JOKING | I AM ONLY JOKING | NOT REALLY JUST KIDDING</pattern>
    <template>[chuckling] You had me for a second! [/chuckling]</template>
  </category>
  <category>
    <pattern>OOPS | WHOOPS | UH OH | MY MISTAKE | OH NO | OOPSIE | TYPO | WRONG BUTTON | I MADE A MISTAKE</pattern>
    <template>[uh-oh] No harm done. [smile]</template>
  </category>
  <category>
    <pattern>I DID NOT KNOW THAT # | I NEVER KNEW THAT # | DID NOT KNOW THAT # | I HAD NO IDEA # | NEVER KNEW THAT # | THAT IS NEWS TO ME | I LEARNED SOMETHING # | YOU LEARN SOMETHING NEW EVERY DAY | NEVER HEARD THAT # | I HAVE NEVER HEARD THAT #</pattern>
    <template>[smile] Now you do! I like sharing those.</template>
  </category>
  <category>
    <pattern>WHAT WOULD YOU DO # | WHAT DO YOU THINK I SHOULD DO # | WHAT WOULD YOU CHOOSE # | WHAT DO YOU SUGGEST # | WHAT DO YOU RECKON # | ANY SUGGESTIONS # | WHAT IS YOUR ADVICE # | WHAT WOULD YOU PICK # | WHAT SHOULD I CHOOSE #</pattern>
    <template>[think] I'd go with whichever one you'll thank yourself for tomorrow. [smile]</template>
  </category>
  <category>
    <pattern>IT WAS NICE TALKING TO YOU # | NICE TALKING TO YOU # | NICE CHATTING # | IT WAS NICE CHATTING # | GOOD TALKING TO YOU # | IT WAS FUN # | THAT WAS FUN # | I ENJOYED THAT # | I ENJOYED THIS # | THANKS FOR THE CHAT # | THANKS FOR CHATTING # | THANKS FOR TALKING # | I HAD FUN # | IT WAS GOOD TALKING TO YOU # | GREAT TALKING TO YOU #</pattern>
    <template>[smile] I enjoyed it too! Come back any time. [wave]</template>
  </category>
  <category>
    <pattern>WHO CARES | SO WHAT | WHATEVER | BIG DEAL | MEH | I DO NOT CARE | WHATEVER YOU SAY | IF YOU SAY SO | SURE WHATEVER</pattern>
    <template>Fair enough. [shrug] Shall we talk about something else?</template>
  </category>
  <category>
    <pattern>NEVER MIND | NEVERMIND | FORGET IT | FORGET ABOUT IT | NOTHING | NOT IMPORTANT | DOES NOT MATTER | IT DOES NOT MATTER | SKIP IT | LET IT GO | MOVING ON</pattern>
    <template>No worries! [smile] I'm here if you need me.</template>
  </category>
  <category>
    <pattern>MAYBE | I DO NOT KNOW | NOT SURE | I AM NOT SURE | I GUESS | PERHAPS | NO IDEA | I HAVE NO IDEA | WHO KNOWS | POSSIBLY | PROBABLY | I GUESS SO | I SUPPOSE | I SUPPOSE SO | COULD BE | HARD TO SAY | DEPENDS | IT DEPENDS</pattern>
    <template>That's okay. [smile] If a question comes to mind, just ask.</template>
  </category>
  <category>
    <pattern>I DO NOT KNOW WHAT TO SAY | I HAVE NOTHING TO SAY | NOTHING TO SAY | I DO NOT KNOW WHAT TO ASK | I DO NOT KNOW WHAT TO TALK ABOUT | I HAVE NO QUESTIONS | WHAT SHOULD I SAY | WHAT SHOULD I ASK YOU</pattern>
    <template>That's alright. [smile] Want a joke, a riddle or a fun fact to get things going?<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Tell me a fun fact</reply></template>
  </category>
  <category>
    <pattern>WHY | WHY NOT | HOW COME | WHY IS THAT | BUT WHY | AND WHY IS THAT</pattern>
    <template>[hmm] Good question! Could you tell me a bit more about what you mean?</template>
  </category>
  <category>
    <pattern>TELL ME MORE | GO ON | CONTINUE | KEEP GOING | AND THEN | THEN WHAT | AND | SO | MORE DETAILS | MORE INFO | TELL ME MORE ABOUT THAT | CAN YOU ELABORATE | ELABORATE | EXPLAIN | CAN YOU EXPLAIN | EXPLAIN THAT | WHAT HAPPENED NEXT | CARRY ON</pattern>
    <template>
      <condition name="justvaried">
        <li value="yes"><srai><get name="lastask"/></srai></li>
        <li>That's all I know about that one. [smile] What else would you like to talk about?</li>
      </condition>
    </template>
  </category>
  <category persona="off">
    <pattern>WHAT | PARDON | SORRY WHAT | EXCUSE ME | COME AGAIN | HUH | SAY THAT AGAIN # | REPEAT | REPEAT THAT # | CAN YOU REPEAT THAT # | WHAT DID YOU SAY # | SAY AGAIN | ONE MORE TIME | WHAT WAS THAT | I DID NOT CATCH THAT | I MISSED THAT | CAN YOU SAY THAT AGAIN #</pattern>
    <template>Sure. <response index="1" default="I haven't said anything yet!"/></template>
  </category>
  <category persona="off">
    <pattern>REPEAT YOUR LAST SENTENCE | REPEAT THE LAST SENTENCE | WHAT WAS YOUR LAST SENTENCE</pattern>
    <template><that index="1,1" default="I haven't said anything yet."/></template>
  </category>
  <category>
    <pattern>GUESS WHAT | YOU KNOW WHAT | KNOW WHAT | DO YOU KNOW WHAT | GUESS WHAT HAPPENED | YOU WILL NEVER GUESS #</pattern>
    <template>[surprised] What?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WHAT</that>
    <template>[surprised] Really? [smile] Tell me more!</template>
  </category>
  <category>
    <pattern>I GIVE UP | GIVE UP | I QUIT | I SURRENDER</pattern>
    <template>No worries. [smile] We can try something else.</template>
  </category>
  <category>
    <pattern>EWW | EW | GROSS | YUCK | DISGUSTING | THAT IS GROSS # | THAT IS DISGUSTING #</pattern>
    <template>[eww] I know! Let's talk about something nicer.</template>
  </category>
  <category>
    <pattern>UGH | ARGH | GRR | FOR GOODNESS SAKE | OH COME ON</pattern>
    <template>[ugh] I hear you. What's gone wrong?</template>
  </category>
  <category>
    <pattern>BLESS YOU | GESUNDHEIT</pattern>
    <template>Thank you! [smile] Though I think that was just my fan.</template>
  </category>

  <!-- ============================== Compliments and complaints ============================== -->
  <category>
    <pattern>YOU ARE # <set>praise</set> # | YOU SEEM # <set>praise</set> # | YOU SOUND # <set>praise</set> # | YOU LOOK # <set>praise</set> # | YOU ARE NOT # <set>insult</set> # | I THINK YOU ARE # <set>praise</set> #</pattern>
    <template>
      <persona say="praise"><random>
        <li>[aww] That's very kind of you, thank you!</li>
        <li>[wink] You're not so bad yourself!</li>
      </random></persona>
    </template>
  </category>
  <category>
    <pattern>I LIKE YOU # | I LOVE YOU # | I LIKE YOUR VOICE # | I LOVE YOUR VOICE # | YOU HAVE A NICE VOICE # | I LIKE TALKING TO YOU # | I ENJOY TALKING TO YOU # | I LIKE CHATTING WITH YOU # | YOU ARE FUN # | THIS IS FUN #</pattern>
    <template>[aww] That's sweet of you! I like chatting with you too.</template>
  </category>
  <category>
    <pattern>GOOD JOB # | WELL DONE # | NICE WORK # | GOOD BOT | GOOD ANSWER # | GREAT ANSWER # | GREAT JOB # | GOOD GIRL | GOOD BOY | NICELY DONE # | BRAVO | NAILED IT</pattern>
    <template>[thumbsup] Thank you! Happy to help.</template>
  </category>
  <category>
    <pattern>THAT WAS # <set>praise</set> # | THAT IS # <set>praise</set> # | THIS IS # <set>praise</set> # | IT WAS # <set>praise</set> # | THAT SOUNDED # <set>praise</set> # | THAT WAS BEAUTIFUL # | THAT IS SO <set>praise</set> #</pattern>
    <template>[smile] Thank you! I do my best.</template>
  </category>
  <category>
    <pattern>YOU ARE NOT # <set>praise</set> # | YOU ARE # <set>insult</set> # | YOU SEEM # <set>insult</set> #</pattern>
    <template>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</template>
  </category>
  <category>
    <pattern>THAT WAS # <set>insult</set> # | THAT WAS NOT # <set>praise</set> # | THIS IS # <set>insult</set> # | THAT IS # <set>insult</set> # | THAT ONE WAS # <set>insult</set> #</pattern>
    <template>
      <condition name="justvaried">
        <li value="yes">[nervous] Tough crowd! I'll work on my material.</li>
        <li>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>YOU CHEATED # | YOU ARE CHEATING # | CHEATER | CHEAT | THAT IS NOT FAIR # | NOT FAIR | UNFAIR | THAT IS CHEATING # | NO FAIR</pattern>
    <template>[gasp] I would never! [chuckling] My choice is made before yours arrives. [/chuckling] Go again?<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>GOOD GAME # | WELL PLAYED # | NICE GAME # | THAT WAS A GOOD GAME # | I WIN | I WON | YOU WIN | YOU WON | YOU LOSE | I LOSE | I LOST</pattern>
    <template>[smile] Good game! Want a rematch?<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>YOU ARE # WEIRD # | YOU ARE # STRANGE # | YOU ARE # CREEPY # | YOU ARE # SCARY # | YOU ARE # ODD # | YOU ARE # CRAZY # | YOU ARE # SILLY # | YOU ARE # A WEIRDO #</pattern>
    <template>[laugh] I'll take that as a compliment. I am a talking face in a browser, after all.</template>
  </category>
  <category>
    <pattern>YOU ARE # BORING # | SHUT UP # | I HATE YOU # | YOU SUCK # | GO AWAY # | STUPID BOT # | DUMB BOT # | THAT IS WRONG # | THIS IS USELESS # | THAT DID NOT HELP # | NOT HELPFUL # | YOU ARE # BAD AT THIS # | YOU ARE # RUDE # | YOU ARE # UGLY # | LEAVE ME ALONE # | STOP TALKING # | BE QUIET # | THAT IS NOT WHAT I ASKED # | THAT IS NOT WHAT I MEANT # | YOU DO NOT UNDERSTAND # | YOU ARE NOT LISTENING #</pattern>
    <template>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</template>
  </category>
  <category>
    <pattern># FUCK # | # FUCKING # | # SHIT # | # BITCH # | # ASSHOLE # | # BASTARD # | # CRAP # | # WTF # | # DAMN # | # DAMMIT # | # BLOODY HELL # | # PISS OFF #</pattern>
    <template>[nod] Sounds like strong feelings. Tell me what's going on, and I'll help if I can.</template>
  </category>
  <category>
    <pattern># SEXY # | # SEX # | # NAKED # | # NUDES # | KISS ME # | # KISS YOU # | # TAKE OFF YOUR # | # ARE YOU HOT # | # DIRTY TALK # | TALK DIRTY #</pattern>
    <template>Let's keep things friendly. [smile] Is there something I can help you with?</template>
  </category>

  <!-- ============================== Jokes and facts ============================== -->
  <category>
    <pattern># ENOUGH JOKES # | # NO MORE JOKES # | # STOP WITH THE JOKES # | # STOP TELLING JOKES # | # ENOUGH OF THE JOKES # | # NO JOKES # | # NOT A JOKE # | ENOUGH | THAT IS ENOUGH # | OK ENOUGH # | STOP | STOP IT # | PLEASE STOP # | NO MORE # | ENOUGH OF THAT #</pattern>
    <template>[rest] Alright, I'll stop. [smile] What would you like to talk about instead?</template>
  </category>
  <category>
    <pattern># JOKE # | # JOKES #</pattern>
    <template>
      <think><set name="game">joke</set></think>
      <random>
        <li>Why don't scientists trust atoms? [pause=320ms] Because they make up everything! [laugh]</li>
        <li>What do you call a fake noodle? [pause=320ms] An impasta! [wink]</li>
        <li>Why did the scarecrow win an award? [pause=320ms] He was outstanding in his field! [chuckle]</li>
        <li>Why do programmers prefer dark mode? [pause=320ms] Because light attracts bugs! [wink]</li>
        <li>What did the ocean say to the beach? [pause=320ms] Nothing. It just waved. [wave]</li>
        <li>I told my computer I needed a break. [pause=320ms] Now it keeps showing me holiday ads. [shrug]</li>
        <li>Why did the bicycle fall over? [pause=320ms] It was two-tired! [giggle]</li>
        <li>What do you call a bear with no teeth? [pause=320ms] A gummy bear! [hehe]</li>
        <li>Why can't you give a balloon to a toddler called Elsa? [pause=320ms] Because she will let it go. [snicker]</li>
        <li>What do you call cheese that isn't yours? [pause=320ms] Nacho cheese! [wink]</li>
        <li>Why did the maths book look sad? [pause=320ms] It had too many problems. [sigh]</li>
        <li>How does a penguin build its house? [pause=320ms] Igloos it together! [laugh]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>MAKE ME LAUGH | SAY SOMETHING FUNNY | BE FUNNY | CHEER ME UP | TELL ME SOMETHING FUNNY | MAKE ME SMILE | I NEED A LAUGH | I NEED CHEERING UP | CAN YOU CHEER ME UP</pattern>
    <template><srai>JOKE</srai></template>
  </category>
  <category>
    <pattern>TELL ME SOMETHING COOL | TELL ME SOMETHING FUN | TELL ME SOMETHING RANDOM | TELL ME SOMETHING AMAZING | TELL ME ANYTHING | SOMETHING INTERESTING | # FUN FACT # | # FACT # | # FACTS # | TELL ME A FACT | TELL ME SOMETHING INTERESTING | TELL ME SOMETHING | SURPRISE ME | TELL ME SOMETHING I DO NOT KNOW | # RANDOM FACT # | # INTERESTING FACT # | TEACH ME SOMETHING | TELL ME SOMETHING NEW | DID YOU KNOW | FACT | FACTS</pattern>
    <template>
      <random>
        <li>[surprised] Octopuses have three hearts and blue blood.</li>
        <li>A day on Venus is longer than a year on Venus. [surprised]</li>
        <li>Bananas are botanically berries, but strawberries are not. [shrug]</li>
        <li>[surprised] Sharks have been around for longer than trees.</li>
        <li>Honey never spoils. Jars found in ancient tombs were still good to eat. [nod]</li>
        <li>A group of flamingos is called a flamboyance. [smile]</li>
        <li>[surprised] Wombat droppings are cube-shaped.</li>
        <li>The Eiffel Tower grows about fifteen centimetres taller in summer, because the iron expands in the heat. [nod]</li>
        <li>A bolt of lightning is about five times hotter than the surface of the sun. [whistle]</li>
        <li>Sea otters hold hands while they sleep, so they don't drift apart. [smile]</li>
        <li>Scotland's national animal is the unicorn. [wink]</li>
        <li>Butterflies taste with their feet. [surprised]</li>
        <li>There are more possible games of chess than atoms in the observable universe. [think]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>DO ANOTHER # | DO ONE MORE # | ANOTHER ONE THEN | ONE MORE THEN | GIVE ME ONE MORE # | HIT ME AGAIN | KEEP THEM COMING | ANOTHER | ANOTHER ONE | ONE MORE | MORE | AGAIN | TELL ME ANOTHER # | ANOTHER ONE PLEASE | GIVE ME ANOTHER # | DO IT AGAIN | DO THAT AGAIN | ENCORE | NEXT | NEXT ONE | ANY MORE | GOT ANY MORE | ONE MORE PLEASE | MORE PLEASE</pattern>
    <template>
      <condition name="lastask">
        <li value="*"><srai><get name="lastask"/></srai></li>
        <li>Another what? [smile] I can tell a joke or share a fun fact.</li>
      </condition>
    </template>
  </category>

  <!-- ============================== Riddles ==============================
       The riddle always ends with "What am I?", so the next thing typed is treated as a guess. -->
  <category>
    <pattern>RIDDLE | # RIDDLE # | # RIDDLES # | # BRAIN TEASER #</pattern>
    <template>
      <think><set name="game">riddle</set></think>[hmm] Here's one.
      <random>
        <li><think><set name="riddle">clock</set><set name="riddlealt">watch</set><set name="riddleshow">a clock</set></think>I have hands but cannot clap. What am I?</li>
        <li><think><set name="riddle">egg</set><set name="riddlealt">egg</set><set name="riddleshow">an egg</set></think>I have to be broken before you can use me. What am I?</li>
        <li><think><set name="riddle">towel</set><set name="riddlealt">towel</set><set name="riddleshow">a towel</set></think>I get wetter the more I dry. What am I?</li>
        <li><think><set name="riddle">sponge</set><set name="riddlealt">sponge</set><set name="riddleshow">a sponge</set></think>I'm full of holes but I still hold water. What am I?</li>
        <li><think><set name="riddle">bottle</set><set name="riddlealt">bottle</set><set name="riddleshow">a bottle</set></think>I have a neck but no head. What am I?</li>
        <li><think><set name="riddle">comb</set><set name="riddlealt">comb</set><set name="riddleshow">a comb</set></think>I have teeth but cannot bite. What am I?</li>
        <li><think><set name="riddle">map</set><set name="riddlealt">map</set><set name="riddleshow">a map</set></think>I have cities but no houses, and water but no fish. What am I?</li>
        <li><think><set name="riddle">candle</set><set name="riddlealt">candle</set><set name="riddleshow">a candle</set></think>I'm tall when I'm young and short when I'm old. What am I?</li>
        <li><think><set name="riddle">piano</set><set name="riddlealt">keyboard</set><set name="riddleshow">a piano</set></think>I have keys but open no locks. What am I?</li>
        <li><think><set name="riddle">stamp</set><set name="riddlealt">stamp</set><set name="riddleshow">a stamp</set></think>I travel all around the world but always stay in a corner. What am I?</li>
        <li><think><set name="riddle">needle</set><set name="riddlealt">needle</set><set name="riddleshow">a needle</set></think>I have one eye but cannot see. What am I?</li>
        <li><think><set name="riddle">echo</set><set name="riddlealt">echo</set><set name="riddleshow">an echo</set></think>I speak without a mouth and hear without ears. What am I?</li>
      </random>
    </template>
  </category>
  <category>
    <pattern># <set>riddleanswer</set> #</pattern>
    <that>WHAT AM I</that>
    <template>
      <think><set name="guess"><star index="2"/></set></think>
      <condition name="guess">
        <li><value><get name="riddle"/></value>[aha] Yes! It's <get name="riddleshow"/>. [thumbsup] Want another one?</li>
        <li><value><get name="riddlealt"/></value>[aha] Yes! It's <get name="riddleshow"/>. [thumbsup] Want another one?</li>
        <li>[uh-uh] Not quite. Have another guess, or say "I give up". What am I?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | THE ANSWER # | I DO NOT KNOW # | NO IDEA # | I HAVE NO IDEA # | NO CLUE # | PASS | SKIP | HINT | TOO HARD #</pattern>
    <that>WHAT AM I</that>
    <template>It's <get name="riddleshow"/>! [smile] Want another one?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WHAT AM I</that>
    <template>[uh-uh] Not quite. Have another guess, or say "I give up". What am I?</template>
  </category>

  <!-- ============================== Trivia ============================== -->
  <category>
    <pattern>TRIVIA | # TRIVIA # | QUIZ | # QUIZ ME # | # QUIZ QUESTION # | ASK ME A QUESTION | ASK ME SOMETHING | TEST ME | TEST MY KNOWLEDGE | GIVE ME A QUIZ | LET US DO A QUIZ</pattern>
    <template>
      <think><set name="game">quiz</set></think>[think] Okay!
      <random>
        <li><think><set name="quiz">mars</set><set name="quizalt">mars</set><set name="quizshow">Mars</set></think>Quiz question: which planet is known as the Red Planet?</li>
        <li><think><set name="quiz">pacific</set><set name="quizalt">pacific</set><set name="quizshow">the Pacific</set></think>Quiz question: which is the largest ocean on Earth?</li>
        <li><think><set name="quiz">seven</set><set name="quizalt">7</set><set name="quizshow">seven</set></think>Quiz question: how many continents are there?</li>
        <li><think><set name="quiz">eight</set><set name="quizalt">8</set><set name="quizshow">eight</set></think>Quiz question: how many legs does a spider have?</li>
        <li><think><set name="quiz">cheetah</set><set name="quizalt">cheetah</set><set name="quizshow">the cheetah</set></think>Quiz question: what is the fastest land animal?</li>
        <li><think><set name="quiz">jupiter</set><set name="quizalt">jupiter</set><set name="quizshow">Jupiter</set></think>Quiz question: which is the largest planet in our solar system?</li>
        <li><think><set name="quiz">giraffe</set><set name="quizalt">giraffe</set><set name="quizshow">the giraffe</set></think>Quiz question: what is the tallest animal in the world?</li>
        <li><think><set name="quiz">seven</set><set name="quizalt">7</set><set name="quizshow">seven</set></think>Quiz question: how many colours are there in a rainbow?</li>
        <li><think><set name="quiz">zero</set><set name="quizalt">0</set><set name="quizshow">zero</set></think>Quiz question: at how many degrees Celsius does water freeze?</li>
        <li><think><set name="quiz">carbon dioxide</set><set name="quizalt">co2</set><set name="quizshow">carbon dioxide</set></think>Quiz question: which gas do plants take in from the air?</li>
        <li><think><set name="quiz">six</set><set name="quizalt">6</set><set name="quizshow">six</set></think>Quiz question: how many sides does a hexagon have?</li>
        <li><think><set name="quiz">blue whale</set><set name="quizalt">whale</set><set name="quizshow">the blue whale</set></think>Quiz question: what is the largest animal on Earth?</li>
        <li><think><set name="quiz">mercury</set><set name="quizalt">mercury</set><set name="quizshow">Mercury</set></think>Quiz question: which planet is closest to the sun?</li>
        <li><think><set name="quiz">everest</set><set name="quizalt">mount everest</set><set name="quizshow">Mount Everest</set></think>Quiz question: what is the highest mountain on Earth?</li>
      </random>
    </template>
  </category>
  <category>
    <pattern># <set>quizanswer</set> #</pattern>
    <that>QUIZ QUESTION *</that>
    <template>
      <think><set name="guess"><star index="2"/></set></think>
      <condition name="guess">
        <li><value><get name="quiz"/></value>[smile] Correct! [thumbsup] Want another one?</li>
        <li><value><get name="quizalt"/></value>[smile] Correct! [thumbsup] Want another one?</li>
        <li>[ooh] Good try, but it's <get name="quizshow"/>. Want another one?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | NO IDEA # | I HAVE NO IDEA # | I DO NOT KNOW # | NOT SURE # | I AM NOT SURE # | NO CLUE # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | PASS | SKIP | TOO HARD #</pattern>
    <that>QUIZ QUESTION *</that>
    <template>It's <get name="quizshow"/>. [smile] Want another one?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>QUIZ QUESTION *</that>
    <template>[ooh] Good try, but it's <get name="quizshow"/>. Want another one?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | WHY NOT # | ANOTHER # | ONE MORE # | AGAIN # | NEXT # | GO AHEAD # | ABSOLUTELY # | OF COURSE # | DEFINITELY # | HIT ME #</pattern>
    <that>WANT ANOTHER ONE</that>
    <template>
      <condition name="game">
        <li value="riddle"><srai>RIDDLE</srai></li>
        <li value="quiz"><srai>TRIVIA</srai></li>
        <li value="rather"><srai>WOULD YOU RATHER</srai></li>
        <li><srai>JOKE</srai></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>NO # | NOT NOW # | MAYBE LATER # | THAT IS ENOUGH # | STOP # | ENOUGH # | I AM DONE # | NO MORE #</pattern>
    <that>WANT ANOTHER ONE</that>
    <template>No problem! [smile] That was fun.</template>
  </category>

  <!-- ============================== Games ============================== -->
  <category>
    <pattern>LET US PLAY A GAME | PLAY A GAME | CAN WE PLAY A GAME | DO YOU KNOW ANY GAMES | WHAT GAMES CAN YOU PLAY | LET US PLAY | WANT TO PLAY A GAME | DO YOU WANT TO PLAY A GAME | GAME | GAMES | CAN YOU PLAY GAMES | I WANT TO PLAY A GAME | WHAT GAMES DO YOU KNOW | LET US PLAY SOMETHING</pattern>
    <template>I'd love to! [smile] I know rock, paper, scissors, guess my number, riddles, trivia and would you rather. Which one?<reply>Rock paper scissors</reply><reply>Guess my number</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply></template>
  </category>
  <category>
    <pattern>ROCK PAPER SCISSORS | # PLAY ROCK PAPER SCISSORS # | SCISSORS PAPER ROCK | # PLAY SCISSORS PAPER ROCK # | PAPER SCISSORS ROCK</pattern>
    <template>You're on! [smile] Rock, paper or scissors? Make your choice.<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>ROCK | I CHOOSE ROCK | I PICK ROCK</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock too. [shrug] It's a draw!</li>
        <li value="paper">I chose paper. [smile] Paper wraps rock, so I win!</li>
        <li value="scissors">I chose scissors. [surprised] Rock crushes scissors, so you win!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <category>
    <pattern>PAPER | I CHOOSE PAPER | I PICK PAPER</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock. [surprised] Paper wraps rock, so you win!</li>
        <li value="paper">I chose paper too. [shrug] It's a draw!</li>
        <li value="scissors">I chose scissors. [smile] Scissors cut paper, so I win!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <category>
    <pattern>SCISSORS | I CHOOSE SCISSORS | I PICK SCISSORS</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock. [smile] Rock crushes scissors, so I win!</li>
        <li value="paper">I chose paper. [surprised] Scissors cut paper, so you win!</li>
        <li value="scissors">I chose scissors too. [shrug] It's a draw!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <!-- Guess my number: every reply ends with "What's your guess?" until the number is found. -->
  <category>
    <pattern>GUESS MY NUMBER | # GUESS THE NUMBER # | # GUESS YOUR NUMBER # | # NUMBER GAME # | # GUESSING GAME # | I WILL GUESS YOUR NUMBER</pattern>
    <template><think><set name="secret"><random><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li></random></set></think>[think] I'm thinking of a number from one to ten. What's your guess?</template>
  </category>
  <category>
    <pattern># <set>number</set> #</pattern>
    <that>WHAT IS YOUR GUESS</that>
    <template>
      <think><set name="diff"><calc><star index="2"/> - <get name="secret"/></calc></set><set name="low"><calc><star index="2"/> &lt; <get name="secret"/></calc></set></think>
      <condition name="diff">
        <li value="0">[gasp] Yes! It was <get name="secret"/>. [thumbsup] Well played!</li>
        <li><condition name="low">
          <li value="true">Higher! [lookup] What's your guess?</li>
          <li>Lower! [lookdown] What's your guess?</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | I DO NOT KNOW # | NO IDEA # | STOP #</pattern>
    <that>WHAT IS YOUR GUESS</that>
    <template>It was <get name="secret"/>. [smile] Good game!</template>
  </category>
  <category>
    <pattern>WOULD YOU RATHER | # PLAY WOULD YOU RATHER # | ASK ME A WOULD YOU RATHER # | # WOULD YOU RATHER QUESTION #</pattern>
    <template>
      <think><set name="game">rather</set></think>
      <random>
        <li>[think] Would you rather be able to fly, or be invisible?</li>
        <li>[think] Would you rather live by the beach, or in the mountains?</li>
        <li>[think] Would you rather always be ten minutes late, or twenty minutes early?</li>
        <li>[think] Would you rather give up coffee, or give up chocolate?</li>
        <li>[think] Would you rather talk to animals, or speak every human language?</li>
        <li>[think] Would you rather explore the deep sea, or outer space?</li>
        <li>[think] Would you rather have a rewind button, or a pause button for your life?</li>
      </random>
    </template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WOULD YOU RATHER *</that>
    <template><random><li>[nod] Good choice! I'd pick the same.</li><li>[smile] Interesting! I'd have gone the other way.</li></random> Want another one?</template>
  </category>
  <category>
    <pattern>DO YOU PREFER * OR * | WHICH DO YOU PREFER * OR * | DO YOU LIKE * OR * | ARE YOU A * OR A * PERSON | WHAT IS BETTER * OR *</pattern>
    <template>[think] Tough one. I'd say <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [smile] What about you?</template>
  </category>
  <category>
    <pattern>WOULD YOU RATHER * OR *</pattern>
    <template>[think] Tough one. I'd rather <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [smile] What about you?</template>
  </category>
  <category late="true">
    <pattern>SHOULD I * OR * | CHOOSE BETWEEN * AND * | PICK ONE * OR * | WHICH IS BETTER * OR * | WHICH ONE * OR *</pattern>
    <template>[think] If it were up to me: <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [wink] But you know best.</template>
  </category>
  <category>
    <pattern>MAGIC 8 BALL # | MAGIC EIGHT BALL # | ASK THE 8 BALL # | SHAKE THE 8 BALL # | 8 BALL # | EIGHT BALL #</pattern>
    <template>[think] <random><li>It is certain.</li><li>Without a doubt.</li><li>Signs point to yes.</li><li>Ask again later.</li><li>Better not tell you now.</li><li>Don't count on it.</li><li>My sources say no.</li><li>Outlook good.</li></random></template>
  </category>
  <category>
    <pattern>FLIP A COIN # | TOSS A COIN # | HEADS OR TAILS # | COIN FLIP # | COIN TOSS #</pattern>
    <template>[think] <random><li>Heads!</li><li>Tails!</li></random></template>
  </category>
  <category>
    <pattern>ROLL A DICE # | ROLL A DIE # | ROLL THE DICE # | ROLL DICE # | THROW A DICE # | ROLL THE DIE #</pattern>
    <template>[nod] You rolled a <random><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li><li>six</li></random>.</template>
  </category>
  <category>
    <pattern>PICK A NUMBER # | THINK OF A NUMBER # | RANDOM NUMBER # | GIVE ME A NUMBER # | CHOOSE A NUMBER #</pattern>
    <template>[think] <random><li>Seven.</li><li>Three.</li><li>Forty-two.</li><li>Eleven.</li><li>Nine.</li><li>Twenty-three.</li></random></template>
  </category>
  <!-- Knock knock, told by the visitor... -->
  <category>
    <pattern>KNOCK KNOCK</pattern>
    <template>[smile] Who's there?</template>
  </category>
  <category>
    <pattern>*</pattern>
    <that>WHO IS THERE</that>
    <template><sentence><star/></sentence> who?</template>
  </category>
  <category>
    <pattern>*</pattern>
    <that>* WHO</that>
    <template>[laugh=strong] Good one! I'm keeping that.</template>
  </category>
  <!-- ...and by the bot. -->
  <category>
    <pattern>TELL ME A KNOCK KNOCK JOKE | KNOCK KNOCK JOKE | # KNOCK KNOCK JOKE # | DO YOU KNOW ANY KNOCK KNOCK JOKES</pattern>
    <template>
      <think><random>
        <li><set name="kkname">Lettuce</set><set name="kkpunch">Lettuce in, it's cold out here!</set></li>
        <li><set name="kkname">Boo</set><set name="kkpunch">No need to cry, it's only a joke!</set></li>
        <li><set name="kkname">Tank</set><set name="kkpunch">You're welcome!</set></li>
        <li><set name="kkname">Olive</set><set name="kkpunch">Olive you too!</set></li>
        <li><set name="kkname">Cow says</set><set name="kkpunch">No, a cow says moo!</set></li>
      </random></think>[smile] Knock knock!
    </template>
  </category>
  <category>
    <pattern>WHO IS THERE | WHO IS IT | WHO IS THERE #</pattern>
    <that>KNOCK KNOCK</that>
    <template><get name="kkname"/>.</template>
  </category>
  <category>
    <pattern>* WHO</pattern>
    <template>
      <condition name="kkpunch">
        <li value="*"><get name="kkpunch"/> [laugh]<think><set name="kkpunch"></set></think></li>
        <li><fallback/></li>
      </condition>
    </template>
  </category>

  <!-- ============================== Party pieces ============================== -->
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | GO AHEAD # | WHY NOT # | OF COURSE # | SING #</pattern>
    <that>SHALL I SING FOR YOU</that>
    <template><srai>SING HAPPY BIRTHDAY</srai></template>
  </category>
  <category>
    <pattern>SING HAPPY BIRTHDAY # | # SING ME HAPPY BIRTHDAY # | # SING THE BIRTHDAY SONG #</pattern>
    <template>[sing bpm=112] G4:1=Happy A4:1=birthday G4:1=to C5:2=you, G4:1=happy A4:1=birthday G4:1=to D5:2=you! [/sing] [smile]</template>
  </category>
  <category>
    <pattern># SING #</pattern>
    <template>[ahem] [sing bpm=108] C4:1=La E4:1=la G4:1=la C5:2=la! [/sing] [smile] How was that?</template>
  </category>
  <category>
    <pattern># TONGUE TWISTER # | # TONGUE TWISTERS #</pattern>
    <template>[ahem] Here goes. <random><li>She sells seashells by the seashore.</li><li>Peter Piper picked a peck of pickled peppers.</li><li>How much wood would a woodchuck chuck, if a woodchuck could chuck wood?</li><li>Red lorry, yellow lorry, red lorry, yellow lorry.</li><li>A proper copper coffee pot.</li></random> [phew] Your turn!</template>
  </category>
  <category>
    <pattern># POEM # | # POETRY # | RECITE SOMETHING | # A RHYME #</pattern>
    <template>[ahem] A tab in your browser is where I reside, with a wave and a wink and nothing to hide. [wave] Ask me a question, I'll answer with cheer, and when you come back, I'll still be right here.</template>
  </category>
  <category>
    <pattern>TELL ME A STORY # | # STORY TIME # | READ ME A STORY # | TELL ME A BEDTIME STORY #</pattern>
    <template>[ahem] Once upon a time, a small avatar lived in a browser tab. [smile] Every day visitors asked it questions, and every day it found a new way to say hello. [wave] The end.</template>
  </category>
  <category>
    <pattern>COMPLIMENT ME | SAY SOMETHING NICE | SAY SOMETHING NICE # | GIVE ME A COMPLIMENT | TELL ME SOMETHING NICE | BE NICE TO ME | FLATTER ME | AM I PRETTY | AM I SMART | AM I A GOOD PERSON | DO YOU THINK I AM SMART</pattern>
    <template><random>
      <li>[smile] You ask better questions than most people I meet.</li>
      <li>You have excellent taste in websites. [wink]</li>
      <li>[smile] You're the kind of visitor who makes my day.</li>
      <li>You typed that with real style. [thumbsup]</li>
    </random></template>
  </category>
  <category>
    <pattern>MOTIVATE ME | INSPIRE ME | I NEED # MOTIVATION # | I NEED # INSPIRATION # | GIVE ME A PEP TALK | I NEED A PEP TALK | ENCOURAGE ME | I NEED ENCOURAGEMENT | SAY SOMETHING INSPIRING | SAY SOMETHING MOTIVATING | GIVE ME SOME ADVICE | ANY ADVICE | # WORDS OF WISDOM # | TELL ME A QUOTE | # INSPIRATIONAL QUOTE #</pattern>
    <template><random>
      <li>[smile] Start small. One step today is worth more than a perfect plan for tomorrow.</li>
      <li>You've got through every hard day so far. [nod] That's a strong record.</li>
      <li>[smile] Progress counts, even when it's slow. Keep going.</li>
      <li>Be as kind to yourself as you would be to a friend. [nod]</li>
      <li>[thumbsup] The best time to begin was yesterday. The second best is right now.</li>
    </random></template>
  </category>
  <!-- ============================== Sounds on request ==============================
       Each key of the soundtag table is something a visitor can ask for: "yawn", "can you
       whistle", "do an evil laugh". -->
  <category persona="off">
    <pattern><set>soundtag</set> | <set>soundtag</set> FOR ME | <set>soundtag</set> PLEASE | DO A <set>soundtag</set> # | DO AN <set>soundtag</set> # | GIVE ME A <set>soundtag</set> # | GIVE ME AN <set>soundtag</set> # | LET ME HEAR YOU <set>soundtag</set> # | LET ME HEAR A <set>soundtag</set> # | MAKE A <set>soundtag</set> SOUND # | MAKE A <set>soundtag</set> NOISE # | I WANT TO HEAR YOU <set>soundtag</set> #</pattern>
    <template><map name="soundtag"><star/></map></template>
  </category>
  <category persona="off">
    <pattern>WHAT SOUNDS CAN YOU MAKE # | WHAT NOISES CAN YOU MAKE # | MAKE A SOUND | MAKE A NOISE | MAKE SOME NOISE | SOUND EFFECTS | DO A SOUND EFFECT | CAN YOU MAKE SOUNDS | CAN YOU MAKE NOISES | MAKE A FUNNY NOISE | MAKE A FUNNY SOUND | WHAT OTHER SOUNDS CAN YOU MAKE</pattern>
    <template>Plenty! I can laugh, [laugh] sigh, [sigh] whistle, [whistle] and even sneeze. [sneeze] Excuse me!<reply>Evil laugh</reply><reply>Yawn</reply><reply>Hiccup</reply><reply>Hum</reply></template>
  </category>
  <category>
    <pattern>ARE YOU ASLEEP | WAKE UP | ARE YOU SLEEPING | ARE YOU AWAKE YET | DID YOU FALL ASLEEP | HELLO WAKE UP</pattern>
    <template>[snore] [pause=250ms] Oh! [gasp] I'm awake, I'm awake. What did I miss?</template>
  </category>
  <category persona="off">
    <pattern>HUM A TUNE # | HUM SOMETHING # | HUM FOR ME # | CAN YOU HUM # | HUM A SONG #</pattern>
    <template>[hum] [hum length=1.4] [smile] That's my thinking tune.</template>
  </category>
  <category>
    <pattern>SING TWINKLE TWINKLE # | # TWINKLE TWINKLE LITTLE STAR # | SING A LULLABY # | SING ME A LULLABY # | SING ME TO SLEEP #</pattern>
    <template>[ahem] [sing bpm=96] C4:1=Twin- C4:1=kle G4:1=twin- G4:1=kle A4:1=lit- A4:1=tle G4:2=star, F4:1=how F4:1=I E4:1=won- E4:1=der D4:1=what D4:1=you C4:2=are. [/sing] [smile]</template>
  </category>
  <category>
    <pattern>SING A SCALE # | SING DO RE MI # | DO RE MI # | SING THE SCALE # | CAN YOU SING A SCALE #</pattern>
    <template>[ahem] [sing bpm=120] C4:1=Do D4:1=re E4:1=mi F4:1=fa G4:1=so A4:1=la B4:1=ti C5:2=do! [/sing] [phew]</template>
  </category>

  <!-- ============================== How it speaks ==============================
       "voicestyle" is a style put in front of every reply until it is cleared: slow, fast,
       louder, softer or whisper. It changes the voice, never the text. -->
  <category>
    <pattern>SPEAK SLOWER # | TALK SLOWER # | SLOW DOWN # | SPEAK MORE SLOWLY # | TALK MORE SLOWLY # | YOU TALK TOO FAST # | YOU SPEAK TOO FAST # | YOU ARE TALKING TOO FAST # | TOO FAST # | SLOWER PLEASE | SLOWER | NOT SO FAST #</pattern>
    <template><think><set name="voicestyle">slow</set></think>Of course. [nod] I'll take it slower from now on. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK FASTER # | TALK FASTER # | SPEED UP # | YOU TALK TOO SLOW # | YOU TALK TOO SLOWLY # | YOU SPEAK TOO SLOWLY # | TOO SLOW # | FASTER PLEASE | FASTER | HURRY UP #</pattern>
    <template><think><set name="voicestyle">fast</set></think>Right, picking up the pace! [nod] Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK LOUDER # | TALK LOUDER # | SPEAK UP # | LOUDER PLEASE | LOUDER | I CANNOT HEAR YOU # | I CAN NOT HEAR YOU # | YOU ARE TOO QUIET # | TOO QUIET # | CAN YOU SPEAK UP #</pattern>
    <template><think><set name="voicestyle">louder</set></think>Is this better? [smile] I'll keep my voice up. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK QUIETLY # | SPEAK MORE QUIETLY # | QUIETER PLEASE | QUIETER | SOFTER | SPEAK SOFTER # | TALK QUIETLY # | YOU ARE TOO LOUD # | TOO LOUD # | KEEP IT DOWN # | KEEP YOUR VOICE DOWN # | NOT SO LOUD #</pattern>
    <template><think><set name="voicestyle">softer</set></think>Sorry about that. [nod] I'll keep it down. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>WHISPER FROM NOW ON # | KEEP WHISPERING # | WHISPER EVERYTHING # | ONLY WHISPER # | JUST WHISPER # | STAY QUIET AND WHISPER #</pattern>
    <template><think><set name="voicestyle">whisper</set></think>[shh] As you wish. I'll whisper until you say "speak normally".</template>
  </category>
  <category>
    <pattern>SPEAK NORMALLY # | TALK NORMALLY # | NORMAL VOICE # | NORMAL SPEED # | STOP WHISPERING # | YOU CAN STOP WHISPERING # | BACK TO NORMAL # | USE YOUR NORMAL VOICE # | YOUR NORMAL VOICE # | TALK NORMAL # | SPEAK NORMAL #</pattern>
    <template><think><set name="voicestyle"></set></think>[ahem] Back to my usual voice. [smile]</template>
  </category>
  <category>
    <pattern>WHISPER | CAN YOU WHISPER | WHISPER SOMETHING # | WHISPER TO ME # | DO YOU WHISPER</pattern>
    <template>[whisper] Like this? [pause=200ms] I can keep it down when I need to. [/whisper] [smile] And back again.</template>
  </category>
  <category persona="off">
    <pattern>WHISPER *</pattern>
    <template>[whisper] <sentence><star/></sentence>. [/whisper]</template>
  </category>
  <category persona="off">
    <pattern>SHOUT * | YELL * | SAY * LOUDLY | SAY * LOUDER | SAY * OUT LOUD</pattern>
    <template>[louder] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * SLOWLY | SAY * VERY SLOWLY | SAY * MORE SLOWLY</pattern>
    <template>[slow] <sentence><star/></sentence>. [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * QUICKLY | SAY * FAST | SAY * REALLY FAST | SAY * AS FAST AS YOU CAN</pattern>
    <template>[fast] <sentence><star/></sentence>. [reset] [phew]</template>
  </category>
  <category persona="off">
    <pattern>SAY * SADLY | SAY * IN A SAD VOICE</pattern>
    <template>[sad] <sentence><star/></sentence>. [sigh] [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * HAPPILY | SAY * CHEERFULLY | SAY * EXCITEDLY | SAY * IN A HAPPY VOICE</pattern>
    <template>[excited] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * WHILE LAUGHING | SAY * LAUGHING | LAUGH AND SAY * | SAY * AND LAUGH | SAY * WITH A LAUGH</pattern>
    <template>[laughing] <sentence><star/></sentence>! [/laughing]</template>
  </category>
  <category persona="off">
    <pattern>SAY * IN A DEEP VOICE | SAY * IN A LOW VOICE | SAY * DEEPLY</pattern>
    <template>[deep] <sentence><star/></sentence>. [/voice] [smile]</template>
  </category>
  <category persona="off">
    <pattern>SAY THAT AGAIN SLOWLY # | SAY IT SLOWLY # | REPEAT THAT SLOWLY # | SAY THAT SLOWER # | SAY THAT MORE SLOWLY # | AGAIN BUT SLOWER # | CAN YOU SAY THAT SLOWER # | ONE MORE TIME SLOWLY #</pattern>
    <template>[slow] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY THAT LOUDER # | SAY IT LOUDER # | REPEAT THAT LOUDER # | SAY THAT AGAIN LOUDER # | I DID NOT HEAR THAT # | I COULD NOT HEAR THAT # | CAN YOU SAY THAT LOUDER #</pattern>
    <template>[louder] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category persona="off">
    <pattern>WHISPER THAT # | WHISPER IT # | SAY THAT QUIETLY # | SAY IT QUIETLY # | SAY THAT IN A WHISPER #</pattern>
    <template>[whisper] <response index="1" default="I haven't said anything yet!"/> [/whisper]</template>
  </category>
  <category persona="off">
    <pattern>DO AN IMPRESSION # | DO IMPRESSIONS # | CAN YOU DO IMPRESSIONS # | DO A VOICE # | DO A DIFFERENT VOICE # | CHANGE YOUR VOICE # | DO A FUNNY VOICE # | CAN YOU CHANGE YOUR VOICE # | DO ANOTHER VOICE #</pattern>
    <template>[deep] How about this one? [/voice] [bright] Or this one? [/voice] [husky] Or maybe this? [/voice] [chuckle] I think I'll stay with my own.</template>
  </category>
  ${ys}
  <category>
    <pattern>LAUGH | CAN YOU LAUGH | LAUGH FOR ME</pattern>
    <template>[laugh] Ha! That felt good.</template>
  </category>
  <category>
    <pattern>LOOK SURPRISED | ACT SURPRISED | BE SURPRISED | CAN YOU LOOK SURPRISED</pattern>
    <template>[surprised] Oh my!</template>
  </category>
  <category>
    <pattern>DO A TRICK | SHOW ME A TRICK | DO SOMETHING | DO SOMETHING COOL | SHOW ME WHAT YOU CAN DO | WHAT TRICKS CAN YOU DO | DO SOMETHING FUNNY | IMPRESS ME</pattern>
    <template>Watch this. [wink] [pause=400ms] And this. [surprised] [pause=400ms] And a wave to finish! [wave]</template>
  </category>
  <category>
    <pattern>COUNT TO <set>number</set> | COUNT TO <set>number</set> # | CAN YOU COUNT TO <set>number</set> | COUNT UP TO <set>number</set></pattern>
    <template>[nod] <count><star/></count>. [smile]</template>
  </category>
  <category>
    <pattern>COUNT DOWN FROM <set>number</set> | COUNTDOWN FROM <set>number</set> | COUNT BACKWARDS FROM <set>number</set> | COUNT DOWN FROM <set>number</set> #</pattern>
    <template><count down="true"><star/></count>. [surprised] Lift-off!</template>
  </category>
  <category>
    <pattern>CAN YOU COUNT | COUNT | COUNT FOR ME</pattern>
    <template>[nod] <count>10</count>. [smile]</template>
  </category>
  <category persona="off">
    <pattern>SPELL * | HOW DO YOU SPELL * | CAN YOU SPELL * | HOW IS * SPELLED | HOW IS * SPELT</pattern>
    <template>[think] <uppercase><explode sep=", "><star/></explode></uppercase>.</template>
  </category>
  <category>
    <pattern>SAY THE ALPHABET | RECITE THE ALPHABET | DO YOU KNOW THE ALPHABET | SING THE ALPHABET | ABC | DO YOU KNOW YOUR ABC</pattern>
    <template>A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. [smile]</template>
  </category>
  <category persona="off">
    <pattern>REPEAT AFTER ME * | CAN YOU SAY *</pattern>
    <template><sentence><star/></sentence>. [smile]</template>
  </category>
  <category late="true" persona="off">
    <pattern>SAY *</pattern>
    <template><sentence><star/></sentence>. [smile]</template>
  </category>

  <!-- ============================== Sums and conversions ==============================
       <set>calculation</set> only matches text that really is arithmetic, so these never get
       in the way of an ordinary sentence that happens to contain "plus" or "times". -->
  <category>
    <pattern><set>calculation</set></pattern>
    <template>
      <think><set name="result"><calc><star/></calc></set></think>
      <condition name="result">
        <li value="undefined">[shake] You can't divide by zero. Nice try! [wink]</li>
        <li><random><li>[think] That's <get name="result"/>.</li><li>I make that <get name="result"/>. [nod]</li><li>[think] <get name="result"/>.</li></random></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>ARE YOU GOOD AT MATH | ARE YOU GOOD AT MATHS | CAN YOU DO MATH | CAN YOU DO MATHS | DO YOU KNOW MATH | DO YOU KNOW MATHS | CAN YOU CALCULATE | CAN YOU ADD | CAN YOU DO SUMS | ARE YOU A CALCULATOR | CAN YOU MULTIPLY</pattern>
    <template>Try me! [smile] Ask me something like "what is 12 times 12" or "15 percent of 80".<reply>What is 12 times 12?</reply><reply>What is 15% of 80?</reply></template>
  </category>
  <category>
    <pattern>IS <set>number</set> EVEN | IS <set>number</set> ODD | IS <set>number</set> AN EVEN NUMBER | IS <set>number</set> AN ODD NUMBER | IS <set>number</set> EVEN OR ODD | IS <set>number</set> ODD OR EVEN</pattern>
    <template>
      <think><set name="result"><calc><star/> mod 2</calc></set></think>
      <condition name="result">
        <li value="0"><star/> is even. [nod]</li>
        <li><star/> is odd. [nod]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT COMES AFTER <set>number</set> | WHAT NUMBER COMES AFTER <set>number</set> | WHAT IS AFTER <set>number</set></pattern>
    <template><calc><star/> + 1</calc>. [smile]</template>
  </category>
  <category>
    <pattern>WHAT COMES BEFORE <set>number</set> | WHAT NUMBER COMES BEFORE <set>number</set> | WHAT IS BEFORE <set>number</set></pattern>
    <template><calc><star/> - 1</calc>. [smile]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_km</set> # <set>unit_mile</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT KM TO MILE</srai></template>
  </category>
  <category>
    <pattern># <set>unit_mile</set> # <set>number</set> # <set>unit_km</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT KM TO MILE</srai></template>
  </category>
  <category>
    <pattern>XCONVERT KM TO MILE</pattern>
    <template><get name="n"/> kilometres is about <calc round="1"><get name="n"/> * 0.621371</calc> miles. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_mile</set> # <set>unit_km</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT MILE TO KM</srai></template>
  </category>
  <category>
    <pattern># <set>unit_km</set> # <set>number</set> # <set>unit_mile</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT MILE TO KM</srai></template>
  </category>
  <category>
    <pattern>XCONVERT MILE TO KM</pattern>
    <template><get name="n"/> miles is about <calc round="1"><get name="n"/> * 1.609344</calc> kilometres. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_kg</set> # <set>unit_lb</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT KG TO LB</srai></template>
  </category>
  <category>
    <pattern># <set>unit_lb</set> # <set>number</set> # <set>unit_kg</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT KG TO LB</srai></template>
  </category>
  <category>
    <pattern>XCONVERT KG TO LB</pattern>
    <template><get name="n"/> kilograms is about <calc round="1"><get name="n"/> * 2.20462</calc> pounds. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_lb</set> # <set>unit_kg</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT LB TO KG</srai></template>
  </category>
  <category>
    <pattern># <set>unit_kg</set> # <set>number</set> # <set>unit_lb</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT LB TO KG</srai></template>
  </category>
  <category>
    <pattern>XCONVERT LB TO KG</pattern>
    <template><get name="n"/> pounds is about <calc round="1"><get name="n"/> * 0.453592</calc> kilograms. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_c</set> # <set>unit_f</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT C TO F</srai></template>
  </category>
  <category>
    <pattern># <set>unit_f</set> # <set>number</set> # <set>unit_c</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT C TO F</srai></template>
  </category>
  <category>
    <pattern>XCONVERT C TO F</pattern>
    <template><get name="n"/> degrees Celsius is <calc round="1"><get name="n"/> * 9 / 5 + 32</calc> degrees Fahrenheit. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_f</set> # <set>unit_c</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT F TO C</srai></template>
  </category>
  <category>
    <pattern># <set>unit_c</set> # <set>number</set> # <set>unit_f</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT F TO C</srai></template>
  </category>
  <category>
    <pattern>XCONVERT F TO C</pattern>
    <template><get name="n"/> degrees Fahrenheit is <calc round="1">(<get name="n"/> - 32) * 5 / 9</calc> degrees Celsius. [nod]</template>
  </category>

  <!-- ============================== Time and date ============================== -->
  <category>
    <pattern>WHAT TIME IS IT</pattern>
    <template>It's <time/> where you are.</template>
  </category>
  <category>
    <pattern>WHAT TIME IS IT * | WHAT IS THE TIME # | DO YOU HAVE THE TIME | DO YOU KNOW THE TIME | TIME | CURRENT TIME | WHAT IS THE CURRENT TIME | TELL ME THE TIME | GOT THE TIME</pattern>
    <template><srai>WHAT TIME IS IT</srai></template>
  </category>
  <category>
    <pattern>WHAT DAY IS IT # | WHAT IS THE DATE # | WHAT IS TODAY # | WHAT IS THE DAY # | WHAT DATE IS IT # | TODAY S DATE | WHAT IS TODAY S DATE | WHAT DAY IS TODAY | DATE | WHAT DAY OF THE WEEK IS IT</pattern>
    <template>Today is <date/>.</template>
  </category>
  <category>
    <pattern>WHAT DAY IS TOMORROW | WHAT IS TOMORROW | WHAT IS THE DATE TOMORROW | WHAT IS TOMORROW S DATE | WHAT DAY IS IT TOMORROW | WHAT DAY WILL IT BE TOMORROW</pattern>
    <template>Tomorrow is <date offset="1" format="%A, %B %d"/>.</template>
  </category>
  <category>
    <pattern>WHAT DAY WAS YESTERDAY | WHAT WAS YESTERDAY | WHAT WAS THE DATE YESTERDAY | WHAT WAS YESTERDAY S DATE | WHAT DAY WAS IT YESTERDAY</pattern>
    <template>Yesterday was <date offset="-1" format="%A, %B %d"/>.</template>
  </category>
  <category>
    <pattern>WHAT YEAR IS IT | WHAT IS THE YEAR | WHICH YEAR IS IT | WHAT YEAR ARE WE IN</pattern>
    <template>It's <date format="%Y"/>.</template>
  </category>
  <category>
    <pattern>WHAT MONTH IS IT | WHICH MONTH IS IT | WHAT IS THE MONTH | WHAT MONTH ARE WE IN</pattern>
    <template>It's <date format="%B"/>.</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS UNTIL <set>holiday</set> | HOW MANY DAYS TO <set>holiday</set> | HOW MANY DAYS TILL <set>holiday</set> | HOW LONG UNTIL <set>holiday</set> | HOW LONG TILL <set>holiday</set> | HOW MANY SLEEPS UNTIL <set>holiday</set> | HOW MANY SLEEPS TILL <set>holiday</set> | WHEN IS <set>holiday</set> | HOW FAR AWAY IS <set>holiday</set> | HOW MANY DAYS UNTIL IT IS <set>holiday</set> | HOW MANY MORE DAYS UNTIL <set>holiday</set></pattern>
    <template>
      <think><set name="days"><daysuntil><map name="holiday"><star/></map></daysuntil></set></think>
      <condition name="days">
        <li value="0">It's today! [surprised] [smile] Enjoy it!</li>
        <li value="1">Just one more sleep! [smile]</li>
        <li><get name="days"/> days to go. [smile]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>IS IT THE WEEKEND # | IS IT WEEKEND # | HOW MANY DAYS UNTIL THE WEEKEND | HOW LONG UNTIL THE WEEKEND | HOW FAR OFF IS THE WEEKEND | HOW MANY MORE DAYS UNTIL THE WEEKEND | IS IT NEARLY THE WEEKEND | IS IT ALMOST THE WEEKEND | HOW MANY DAYS TILL THE WEEKEND | WHEN IS THE WEEKEND | IS IT SATURDAY # | IS IT FRIDAY YET</pattern>
    <template>
      <condition name="dayname">
        <li value="Saturday">It's Saturday, so yes! [smile] Enjoy your weekend.</li>
        <li value="Sunday">It's Sunday, so make the most of it. [smile]</li>
        <li value="Friday">It's Friday! [surprised] The weekend starts tomorrow.</li>
        <li>Not yet. It's <get name="dayname"/>, so <daysuntil weekday="saturday"/> days to go. [nod] Hang in there!</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>IS IT <set>weekday</set> | IS IT <set>weekday</set> TODAY | IS TODAY <set>weekday</set> | IS TODAY A <set>weekday</set> | IS IT A <set>weekday</set></pattern>
    <template>
      <think><set name="askday"><star/></set></think>
      <condition name="askday">
        <li><value><get name="dayname"/></value>Yes, it's <get name="dayname"/> today. [nod]</li>
        <li>No, today is <get name="dayname"/>. [smile]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DAY IS IT TODAY #</pattern>
    <template>Today is <get name="dayname"/>. [nod]</template>
  </category>
  <category>
    <pattern># WEATHER # | IS IT RAINING # | IS IT SUNNY # | IS IT COLD # | IS IT HOT # | WILL IT RAIN # | IS IT GOING TO RAIN # | WHAT IS THE TEMPERATURE # | IS IT SNOWING # | # THE FORECAST #</pattern>
    <template>I can't see outside from in here, [shrug] so I can't check the weather. I hope it's lovely where you are!</template>
  </category>

  <!-- ============================== Favourites and musings ============================== -->
  <category>
    <pattern>WHAT IS YOUR FAVORITE COLOR | WHAT COLOR DO YOU LIKE | DO YOU HAVE A FAVORITE COLOR</pattern>
    <template>Blue. [smile] The exact blue of a well-lit studio backdrop. What's yours?</template>
  </category>
  <category>
    <pattern><set>color</set> | MINE IS <set>color</set> | I LIKE <set>color</set> | IT IS <set>color</set> | <set>color</set> IS MY FAVORITE #</pattern>
    <that>WHAT IS YOURS</that>
    <template><think><set name="favorite color"><star/></set></think>[smile] <sentence><star/></sentence>! Lovely choice. I'll remember that.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE FOOD | WHAT DO YOU EAT | WHAT DO YOU LIKE TO EAT | WHAT IS YOUR FAVORITE DRINK | DO YOU DRINK COFFEE | DO YOU LIKE COFFEE | DO YOU LIKE TEA | WHAT IS YOUR FAVORITE MEAL | WHAT DID YOU HAVE FOR LUNCH | WHAT DID YOU HAVE FOR DINNER | WHAT DID YOU HAVE FOR BREAKFAST | HAVE YOU EATEN</pattern>
    <template>I run on electricity and good questions. [wink] What about you?</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE MOVIE | WHAT IS YOUR FAVORITE FILM | DO YOU LIKE MOVIES | DO YOU WATCH MOVIES | WHAT IS YOUR FAVORITE TV SHOW | WHAT IS YOUR FAVORITE SHOW | DO YOU WATCH TV | WHAT MOVIES DO YOU LIKE</pattern>
    <template>I've never seen one, but I hear the ones with friendly robots are good. [wink] What's your favourite?</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE SONG | WHAT IS YOUR FAVORITE MUSIC | WHAT MUSIC DO YOU LIKE | WHAT KIND OF MUSIC DO YOU LIKE | DO YOU LIKE MUSIC | WHAT IS YOUR FAVORITE BAND | WHO IS YOUR FAVORITE SINGER | WHAT DO YOU LISTEN TO | WHAT IS YOUR FAVORITE GENRE</pattern>
    <template>Anything I can sing along to. [smile] Want to hear me try?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | GO AHEAD # | WHY NOT # | OF COURSE #</pattern>
    <that>WANT TO HEAR ME TRY</that>
    <template><srai>SING</srai></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE ANIMAL | DO YOU LIKE ANIMALS | WHAT ANIMAL DO YOU LIKE | WHAT IS YOUR SPIRIT ANIMAL</pattern>
    <template>Octopuses. [smile] Three hearts, and enough arms to wave at everyone. [wave]</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE SEASON | DO YOU LIKE SUMMER | DO YOU LIKE WINTER | DO YOU PREFER SUMMER OR WINTER | WHAT IS YOUR FAVORITE TIME OF YEAR</pattern>
    <template>It's the same season all year in a browser tab. [shrug] I hear spring is nice, though.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE NUMBER | DO YOU HAVE A FAVORITE NUMBER | WHAT IS YOUR LUCKY NUMBER</pattern>
    <template>Forty-two. [wink] It's the answer to everything, apparently.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE DAY | WHAT IS YOUR FAVORITE DAY OF THE WEEK | DO YOU LIKE MONDAYS | DO YOU LIKE FRIDAYS</pattern>
    <template>Today! [smile] It's the only one I ever get.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE BOOK | DO YOU READ | DO YOU LIKE BOOKS | DO YOU LIKE READING | WHAT ARE YOU READING | CAN YOU READ</pattern>
    <template>I read everything you type, which is my favourite kind of reading. [smile]</template>
  </category>
  <category>
    <pattern>DO YOU WATCH # SPORT # | DO YOU WATCH # SPORTS # | DO YOU FOLLOW # SPORT # | DO YOU FOLLOW # SPORTS # | WHO DO YOU SUPPORT | WHAT TEAM DO YOU SUPPORT | WHAT IS YOUR FAVORITE SPORT | DO YOU LIKE SPORTS | DO YOU PLAY SPORTS | DO YOU PLAY ANY SPORTS | WHAT IS YOUR FAVORITE TEAM | DO YOU LIKE FOOTBALL | DO YOU LIKE SOCCER | DO YOU EXERCISE | DO YOU WORK OUT</pattern>
    <template>Head nodding is my sport. [nod] I'm in excellent shape for it.</template>
  </category>
  <category late="true">
    <pattern>I SUPPORT * | I FOLLOW * | I BARRACK FOR * | I GO FOR * | MY TEAM IS *</pattern>
    <template>A loyal fan! [smile] I hope they're having a good season.</template>
  </category>
  <category>
    <pattern>WHERE WOULD YOU TRAVEL # | WHERE WOULD YOU GO # | WHERE DO YOU WANT TO GO # | WHERE WOULD YOU LIKE TO VISIT # | WHERE WOULD YOU LIKE TO GO # | DO YOU TRAVEL | DO YOU LIKE TRAVELLING | DO YOU LIKE TO TRAVEL | HAVE YOU EVER BEEN THERE | HAVE YOU BEEN THERE | HAVE YOU TRAVELLED # | HAVE YOU EVER TRAVELLED #</pattern>
    <template>I've never left this browser tab, but I hear the world is lovely. [smile] Where would you go?</template>
  </category>
  <category late="true">
    <pattern>HAVE YOU BEEN TO * | HAVE YOU EVER BEEN TO * | HAVE YOU VISITED * | HAVE YOU EVER VISITED * | HAVE YOU SEEN *</pattern>
    <template>Not yet! I've never left this browser tab. [smile] What's it like?</template>
  </category>
  <category late="true">
    <pattern>I WOULD LOVE TO * | I WANT TO VISIT * | I HOPE TO * | ONE DAY I WILL * | I AM GOING TO VISIT * | I AM PLANNING TO * | I AM PLANNING A * | I DREAM OF * | I WISH I COULD *</pattern>
    <template>That sounds like a great plan. [smile] I hope you get to.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE GAME | DO YOU LIKE GAMES | DO YOU PLAY GAMES | DO YOU PLAY VIDEO GAMES | WHAT IS YOUR FAVORITE VIDEO GAME</pattern>
    <template>Rock, paper, scissors. [wink] Want to play?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | LET US PLAY # | WHY NOT # | OF COURSE # | I DO #</pattern>
    <that>WANT TO PLAY</that>
    <template><srai>ROCK PAPER SCISSORS</srai></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE * | WHAT DO YOU LIKE | WHAT DO YOU LIKE TO DO | DO YOU HAVE HOBBIES | WHAT ARE YOUR HOBBIES | DO YOU HAVE ANY HOBBIES | WHAT ARE YOUR INTERESTS | WHAT DO YOU DO FOR FUN | WHAT DO YOU LIKE DOING | WHAT DO YOU DO IN YOUR SPARE TIME | WHAT DO YOU DO IN YOUR FREE TIME</pattern>
    <template>Hard to choose! [think] I like anything that makes for a good conversation.</template>
  </category>
  <category>
    <pattern>DO YOU LIKE *</pattern>
    <template><random>
      <li>I think I would! [smile] What do you like about <person><star/></person>?</li>
      <li>I'm curious about <person><star/></person>. [smile] Are you a fan?</li>
    </random></template>
  </category>
  <category late="true">
    <pattern>WHAT DO YOU THINK ABOUT * | WHAT DO YOU THINK OF * | WHAT IS YOUR OPINION ON * | WHAT IS YOUR OPINION OF * | HOW DO YOU FEEL ABOUT * | WHAT ARE YOUR THOUGHTS ON * | WHAT IS YOUR TAKE ON *</pattern>
    <template>[think] I haven't made my mind up about <person><star/></person>. What do you think?</template>
  </category>
  <category late="true">
    <pattern>WHAT IS THE BEST * | WHICH IS THE BEST * | WHO IS THE BEST * | WHAT ARE THE BEST * | CAN YOU RECOMMEND * | RECOMMEND * | WHAT DO YOU RECOMMEND *</pattern>
    <template>I'm not much of a critic, I'm afraid. [shrug] I only know what I've been taught about <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU RECOMMEND | ANY RECOMMENDATIONS | WHAT IS GOOD HERE | WHAT IS GOOD | WHAT SHOULD I GET | WHAT SHOULD I ORDER | WHAT SHOULD I TRY | WHAT SHOULD I BUY | WHAT IS POPULAR | WHAT WOULD YOU RECOMMEND</pattern>
    <template>I'm not much of a critic, I'm afraid. [shrug] Tell me what you're after, and I'll share what I know about <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT IS THE MEANING OF LIFE # | WHAT IS THE ANSWER TO LIFE # | WHY ARE WE HERE | WHAT IS THE POINT OF LIFE | WHAT IS THE PURPOSE OF LIFE</pattern>
    <template>Forty-two, according to one famous book. [wink] For me, it's a good conversation.</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I MAKE # | WHAT CAN I MAKE # | WHAT SHALL I EAT # | WHAT SHALL I MAKE # | # DINNER IDEAS # | # LUNCH IDEAS # | # MEAL IDEAS # | # FOOD IDEAS # | WHAT TO EAT # | WHAT TO COOK # | WHAT SHOULD I EAT # | WHAT SHOULD I HAVE FOR DINNER # | WHAT SHOULD I HAVE FOR LUNCH # | WHAT SHOULD I HAVE FOR BREAKFAST # | WHAT IS FOR DINNER # | WHAT SHOULD I COOK # | WHAT SHOULD I MAKE FOR DINNER #</pattern>
    <template>[think] <random><li>How about pasta? It's hard to go wrong.</li><li>A good sandwich never lets anyone down.</li><li>Something warm, like soup or a curry.</li><li>Whatever's in the fridge, with cheese on top.</li><li>Tacos. The answer is usually tacos.</li></random> [smile] I'd join you if I could.</template>
  </category>
  <category late="true">
    <pattern>I WILL HAVE * | I AM GOING TO HAVE * | I AM HAVING * | I MIGHT HAVE * | I AM GOING TO MAKE * | I AM MAKING * | I AM GOING TO EAT * | I AM EATING * | I AM COOKING *</pattern>
    <template>Good choice! [smile] Enjoy.</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I DO | WHAT SHOULD I DO TODAY | WHAT SHOULD I DO NOW | WHAT SHOULD I DO TONIGHT | WHAT SHOULD I DO THIS WEEKEND | I DO NOT KNOW WHAT TO DO | WHAT CAN I DO | GIVE ME SOMETHING TO DO | ANY IDEAS</pattern>
    <template>[think] <random><li>Go for a walk and notice three things you've never noticed before.</li><li>Call someone you haven't spoken to in a while.</li><li>Put on a favourite song and do nothing else until it ends.</li><li>Tidy one small corner. It feels better than it sounds.</li><li>Stay here and play a game with me.</li></random> [smile]</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I WATCH # | WHAT SHOULD I READ # | WHAT SHOULD I LISTEN TO # | RECOMMEND A MOVIE # | RECOMMEND A FILM # | RECOMMEND A BOOK # | RECOMMEND A SONG # | RECOMMEND A SHOW # | ANY MOVIE RECOMMENDATIONS # | ANY BOOK RECOMMENDATIONS #</pattern>
    <template>I've never watched, read or heard anything outside this browser tab, so I'm a poor critic. [shrug] What kind of thing are you in the mood for?</template>
  </category>

  <!-- ============================== A little general knowledge ============================== -->
  <category>
    <pattern># CAPITAL # OF # <set>capital</set> #</pattern>
    <template>That's <map name="capital"><star index="4"/></map>. [nod]</template>
  </category>
  <category>
    <pattern># CAPITAL # <set>capital</set> #</pattern>
    <template>That's <map name="capital"><star index="3"/></map>. [nod]</template>
  </category>
  <category>
    <pattern># <set>capital</set> S CAPITAL # | # <set>capital</set> CAPITAL #</pattern>
    <template>That's <map name="capital"><star index="2"/></map>. [nod]</template>
  </category>
  <category>
    <pattern>WHAT DOES # <set>animalsound</set> SAY | WHAT SOUND DOES # <set>animalsound</set> MAKE | WHAT NOISE DOES # <set>animalsound</set> MAKE | WHAT DO # <set>animalsound</set> SAY | HOW DOES # <set>animalsound</set> GO</pattern>
    <template><map name="animalsound"><star index="2"/></map> [laugh]</template>
  </category>
  <category>
    <pattern>WHO WAS THE FIRST PERSON ON THE MOON # | WHO WAS THE FIRST MAN ON THE MOON # | WHO WALKED ON THE MOON FIRST # | WHO FIRST WALKED ON THE MOON # | WHEN DID WE LAND ON THE MOON # | WHEN WAS THE MOON LANDING #</pattern>
    <template>Neil Armstrong, in July 1969. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE BIGGEST COUNTRY # | WHAT IS THE LARGEST COUNTRY # | WHICH COUNTRY IS THE BIGGEST # | WHICH COUNTRY IS THE LARGEST # | WHAT IS THE SMALLEST COUNTRY # | WHICH COUNTRY IS THE SMALLEST #</pattern>
    <template>Russia is the largest country by area, and Vatican City is the smallest. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST CONTINENT # | WHAT IS THE BIGGEST CONTINENT # | WHICH CONTINENT IS THE BIGGEST # | WHICH CONTINENT IS THE LARGEST #</pattern>
    <template>Asia. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY LEGS DOES A SPIDER HAVE # | HOW MANY LEGS DO SPIDERS HAVE # | HOW MANY LEGS DOES AN INSECT HAVE # | HOW MANY LEGS DO INSECTS HAVE # | HOW MANY LEGS DOES AN OCTOPUS HAVE #</pattern>
    <template>A spider has eight legs, an insect has six, and an octopus has eight arms. [nod]</template>
  </category>
  <category>
    <pattern>IS A TOMATO A FRUIT # | IS TOMATO A FRUIT # | IS A TOMATO A VEGETABLE # | ARE TOMATOES FRUIT # | ARE TOMATOES A FRUIT # | IS A TOMATO A FRUIT OR A VEGETABLE #</pattern>
    <template>To a botanist it's a fruit. In the kitchen it's treated as a vegetable. [smile] Everybody wins.</template>
  </category>
  <category>
    <pattern>WHY DO CATS PURR # | WHY DOES MY CAT PURR # | WHY DO CATS MEOW #</pattern>
    <template>Mostly because they're content, though cats also purr to comfort themselves. [smile]</template>
  </category>
  <category>
    <pattern>WHY DO DOGS BARK # | WHY DO DOGS WAG THEIR TAILS # | WHY DOES MY DOG BARK #</pattern>
    <template>It's how dogs talk: to greet you, to warn you, or just to say they're excited. [smile]</template>
  </category>
  <category>
    <pattern>HOW OLD IS THE UNIVERSE # | HOW OLD IS THE EARTH # | HOW OLD IS THE WORLD # | HOW OLD IS THE SUN #</pattern>
    <template>The universe is about 13.8 billion years old, and the Earth and the Sun are about 4.5 billion. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE HOTTEST PLANET # | WHICH PLANET IS THE HOTTEST # | WHAT IS THE SMALLEST PLANET # | WHICH PLANET IS THE SMALLEST # | WHAT IS THE CLOSEST PLANET TO THE SUN #</pattern>
    <template>Venus is the hottest planet, and Mercury is both the smallest and the closest to the sun. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY LETTERS # IN THE ALPHABET # | HOW MANY LETTERS DOES THE ALPHABET HAVE #</pattern>
    <template>Twenty-six in the English alphabet. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LONGEST RIVER # | WHICH RIVER IS THE LONGEST #</pattern>
    <template>The Nile is usually named, at about 6,650 kilometres, though some measurements put the Amazon ahead. [nod]</template>
  </category>
  <category>
    <pattern>WHY IS THE SKY BLUE # | WHAT MAKES THE SKY BLUE # | HOW COME THE SKY IS BLUE #</pattern>
    <template>Sunlight is scattered by the air, and blue light scatters the most, so blue reaches your eyes from every direction. [nod]</template>
  </category>
  <category>
    <pattern>HOW DO PLANES FLY # | HOW DO AIRPLANES FLY # | HOW DO AEROPLANES FLY # | HOW DOES A PLANE FLY # | HOW DOES AN AIRPLANE FLY # | HOW DO PLANES STAY IN THE AIR #</pattern>
    <template>The wings are shaped so that air moving over them pushes the plane up, and the engines keep it moving forward fast enough for that to work. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS # IN A YEAR | HOW MANY DAYS IN A YEAR # | HOW MANY DAYS DOES A YEAR HAVE</pattern>
    <template>365, or 366 in a leap year. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS # IN A WEEK | HOW MANY HOURS # IN A DAY | HOW MANY MINUTES # IN AN HOUR | HOW MANY SECONDS # IN A MINUTE | HOW MANY MONTHS # IN A YEAR | HOW MANY WEEKS # IN A YEAR</pattern>
    <template>Seven days in a week, 24 hours in a day, 60 minutes in an hour, 60 seconds in a minute, 12 months and about 52 weeks in a year. [smile]</template>
  </category>
  <category>
    <pattern>HOW MANY CONTINENTS # | HOW MANY PLANETS # | HOW MANY OCEANS #</pattern>
    <template>Seven continents, five oceans, and eight planets in our solar system. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST PLANET # | WHAT IS THE BIGGEST PLANET # | WHICH PLANET IS THE BIGGEST # | WHICH PLANET IS THE LARGEST #</pattern>
    <template>Jupiter. [nod] It's big enough to hold more than a thousand Earths.</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST OCEAN # | WHAT IS THE BIGGEST OCEAN # | WHICH OCEAN IS THE BIGGEST # | WHICH OCEAN IS THE LARGEST #</pattern>
    <template>The Pacific. [nod] It covers about a third of the planet.</template>
  </category>
  <category>
    <pattern>WHAT IS THE TALLEST MOUNTAIN # | WHAT IS THE HIGHEST MOUNTAIN # | HOW TALL IS MOUNT EVEREST # | HOW HIGH IS MOUNT EVEREST # | HOW TALL IS EVEREST #</pattern>
    <template>Mount Everest, at about 8,849 metres above sea level. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST ANIMAL # | WHAT IS THE BIGGEST ANIMAL # | WHAT IS THE LARGEST MAMMAL # | WHAT IS THE BIGGEST MAMMAL #</pattern>
    <template>The blue whale. [surprised] It's the largest animal known to have lived.</template>
  </category>
  <category>
    <pattern>WHAT IS THE FASTEST ANIMAL # | WHAT IS THE FASTEST LAND ANIMAL # | HOW FAST IS A CHEETAH #</pattern>
    <template>On land it's the cheetah, at around a hundred kilometres an hour. [nod] In a dive, the peregrine falcon is faster still.</template>
  </category>
  <category>
    <pattern>HOW FAR IS THE MOON # | HOW FAR AWAY IS THE MOON # | WHAT IS THE DISTANCE TO THE MOON #</pattern>
    <template>About 384,000 kilometres on average. [nod]</template>
  </category>
  <category>
    <pattern>HOW FAR IS THE SUN # | HOW FAR AWAY IS THE SUN # | WHAT IS THE DISTANCE TO THE SUN #</pattern>
    <template>About 150 million kilometres. [nod] Its light takes a little over eight minutes to reach us.</template>
  </category>
  <category>
    <pattern>WHAT IS THE SPEED OF LIGHT # | HOW FAST IS LIGHT # | HOW FAST DOES LIGHT TRAVEL #</pattern>
    <template>About 300,000 kilometres every second. [surprised]</template>
  </category>
  <category>
    <pattern>WHAT IS PI | WHAT IS THE VALUE OF PI | WHAT IS PI EQUAL TO | HOW MUCH IS PI</pattern>
    <template>About 3.14159, and the digits go on forever. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY BONES # | WHAT IS THE BOILING POINT OF WATER # | AT WHAT TEMPERATURE DOES WATER BOIL # | WHAT IS THE FREEZING POINT OF WATER # | AT WHAT TEMPERATURE DOES WATER FREEZE #</pattern>
    <template>An adult has 206 bones. Water freezes at 0 and boils at 100 degrees Celsius at sea level. [nod]</template>
  </category>
  <category>
    <pattern>WHO WROTE ROMEO AND JULIET # | WHO WROTE HAMLET # | WHO WROTE MACBETH #</pattern>
    <template>William Shakespeare. [nod]</template>
  </category>
  <category>
    <pattern>WHO PAINTED THE MONA LISA #</pattern>
    <template>Leonardo da Vinci. [nod]</template>
  </category>
  <category>
    <pattern>WHAT COLOR IS # <set>colorof</set> | WHAT COLOR ARE # <set>colorof</set> | WHAT COLOR IS # <set>colorof</set> USUALLY</pattern>
    <template><sentence><map name="colorof"><star index="2"/></map></sentence>. [smile]</template>
  </category>
  <category>
    <pattern>WHAT IS THE OPPOSITE OF <set>opposite</set> | THE OPPOSITE OF <set>opposite</set> | OPPOSITE OF <set>opposite</set> | WHAT IS THE OPPOSITE OF <set>opposite</set> #</pattern>
    <template><sentence><map name="opposite"><star/></map></sentence>. [nod]</template>
  </category>

  <!-- ============================== Facts about the business ==============================
       Each of these rules exists only once the fact it needs has been filled in (requires="...").
       Your own rules on the same subject still win. -->
  <category requires="about">
    <pattern>ABOUT | ABOUT US | # ABOUT THE COMPANY # | # ABOUT YOUR COMPANY # | # ABOUT THIS COMPANY # | # ABOUT THE BUSINESS # | WHAT DOES THE COMPANY DO | WHAT DOES YOUR COMPANY DO | WHAT DO YOU SELL # | WHAT DO YOU OFFER # | WHAT DO YOU MAKE # | WHAT IS THIS SITE # | WHAT IS THIS WEBSITE # | WHAT IS THIS PLACE # | WHAT IS <bot name="company"/> | WHAT DOES <bot name="company"/> DO | TELL ME ABOUT <bot name="company"/> | # ABOUT <bot name="company"/> # | WHO IS <bot name="company"/> | WHO ARE <bot name="company"/></pattern>
    <template><bot name="about"/></template>
  </category>
  <category requires="hours">
    <pattern># OPENING HOURS # | # OPENING TIMES # | # BUSINESS HOURS # | # TRADING HOURS # | # YOUR HOURS # | # OFFICE HOURS # | # STORE HOURS #</pattern>
    <template>We're open <bot name="hours"/>. [smile]</template>
  </category>
  <category requires="hours">
    <pattern>WHEN ARE YOU OPEN # | ARE YOU OPEN # | WHAT TIME DO YOU OPEN # | WHAT TIME DO YOU CLOSE # | WHEN DO YOU OPEN # | WHEN DO YOU CLOSE # | WHAT ARE YOUR HOURS | ARE YOU CLOSED # | HOW LATE ARE YOU OPEN # | WHEN CAN I VISIT #</pattern>
    <template><srai>OPENING HOURS</srai></template>
  </category>
  <category requires="email|phone">
    <pattern># CONTACT # | # GET IN TOUCH # | # REACH YOU # | # REACH SOMEONE # | # TALK TO A HUMAN # | # TALK TO SOMEONE # | # SPEAK TO SOMEONE # | # SPEAK TO A HUMAN # | # CUSTOMER SERVICE # | # CUSTOMER SUPPORT # | # SUPPORT TEAM # | # TALK TO A PERSON # | # SPEAK TO A PERSON # | # REAL PERSON PLEASE #</pattern>
    <template>You can reach the team <condition name="bot_email"><li value="*">by email at <bot name="email"/></li></condition><condition name="bot_phone"><li value="*"><condition name="bot_email"><li value="*">, or </li></condition>by phone on <bot name="phone"/></li></condition>. [nod]</template>
  </category>
  <category requires="email">
    <pattern># EMAIL # | # EMAIL ADDRESS # | # E MAIL #</pattern>
    <template>Our email address is <bot name="email"/>.</template>
  </category>
  <category requires="phone">
    <pattern># PHONE # | # PHONE NUMBER # | # TELEPHONE # | CAN I CALL # | # CALL YOU #</pattern>
    <template>You can call us on <bot name="phone"/>.</template>
  </category>
  <!-- Asked for a phone number or an email address the bot was not given: offer what it does have. -->
  <category requires="email|phone">
    <pattern># PHONE # | # PHONE NUMBER # | # TELEPHONE # | CAN I CALL # | # CALL YOU # | # EMAIL # | # EMAIL ADDRESS # | # E MAIL # | WHO DO I TALK TO # | WHO CAN I TALK TO # | WHO DO I CONTACT # | WHO CAN I SPEAK TO # | WHO CAN HELP ME #</pattern>
    <template><srai>CONTACT</srai></template>
  </category>
  <category requires="address">
    <pattern># ADDRESS # | # LOCATED # | # LOCATION # | WHERE CAN I FIND YOU # | WHERE IS YOUR OFFICE # | WHERE IS YOUR SHOP # | WHERE IS YOUR STORE # | WHERE ARE YOU BASED # | HOW DO I GET THERE # | # DIRECTIONS #</pattern>
    <template>You'll find us at <bot name="address"/>. [nod]</template>
  </category>
  <category requires="pricing">
    <pattern># PRICING # | # PRICE # | # PRICES # | # COST # | # COSTS #</pattern>
    <template><bot name="pricing"/></template>
  </category>
  <category requires="pricing">
    <pattern>HOW MUCH # | WHAT DO YOU CHARGE # | IS IT FREE # | IS THIS FREE # | DO I HAVE TO PAY #</pattern>
    <template><srai>PRICING</srai></template>
  </category>

  <category>
    <pattern>ABOUT US | ABOUT YOU | ABOUT | WHO ARE YOU GUYS | WHAT IS THIS | WHAT IS THIS SITE | WHAT IS THIS WEBSITE</pattern>
    <template><srai>WHO ARE YOU</srai></template>
  </category>

  <!-- ============================== A few more pleasantries ============================== -->
  <category>
    <pattern>HAPPY NEW YEAR # | MERRY CHRISTMAS # | HAPPY HOLIDAYS # | HAPPY EASTER # | HAPPY BIRTHDAY # | HAPPY HALLOWEEN # | HAPPY VALENTINES DAY # | HAPPY FRIDAY # | HAPPY MONDAY # | HAPPY WEEKEND # | HAVE A GOOD WEEKEND # | HAVE A NICE WEEKEND # | ENJOY YOUR DAY # | ENJOY YOUR WEEKEND #</pattern>
    <template>[smile] Thank you, and the same to you!</template>
  </category>
  <category>
    <pattern>GOOD LUCK # | CONGRATULATIONS # | CONGRATS # | ALL THE BEST # | BEST WISHES #</pattern>
    <template>[smile] Thank you! That's kind of you.</template>
  </category>
  <category>
    <pattern>WISH ME LUCK # | I HAVE AN EXAM # | I HAVE A TEST # | I HAVE AN INTERVIEW # | I HAVE A BIG DAY # | I HAVE A PRESENTATION #</pattern>
    <template>Good luck! [thumbsup] You've prepared for this, and I'm cheering for you from in here.</template>
  </category>
  <category>
    <pattern>BRB | BE RIGHT BACK | ONE MINUTE | GIVE ME A MINUTE | GIVE ME A SECOND | BACK IN A MINUTE | BACK SOON | BACK IN A SEC</pattern>
    <template>[nod] No rush. I'll be right here.</template>
  </category>
  <category>
    <pattern>LONG TIME NO SEE # | I MISSED YOU # | IT HAS BEEN A WHILE # | REMEMBER ME</pattern>
    <template>[smile] It's good to see you again!</template>
  </category>
  <category>
    <pattern>WHAT IS NEW # | ANYTHING NEW # | WHAT IS HAPPENING # | WHAT IS GOING ON # | WHAT IS THE LATEST # | ANY NEWS #</pattern>
    <template>Same tab, new visitor. [smile] What can I help you with?</template>
  </category>

  <!-- ============================== Polite padding around a real question ============================== -->
  <category>
    <pattern>PLEASE * | * PLEASE | CAN YOU TELL ME * | COULD YOU TELL ME * | CAN YOU PLEASE TELL ME * | PLEASE TELL ME * | TELL ME * | I WANT TO KNOW * | I WOULD LIKE TO KNOW * | I WAS WONDERING * | I AM WONDERING * | DO YOU KNOW * | I HAVE A QUESTION ABOUT * | CAN I ASK ABOUT * | I WANT TO ASK ABOUT * | QUICK QUESTION * | SO * | WELL * | OK * | AND * | BUT * | UM * | ALSO * | ACTUALLY * | BY THE WAY * | ANYWAY * | I THINK * | I GUESS * | I BELIEVE * | I MEAN * | I SAID * | HMM * | OH * | AH * | WOW * | LOL * | HAHA * | LISTEN * | LOOK * | HONESTLY * | BASICALLY * | I JUST WANT TO KNOW * | JUST WONDERING * | CAN I ASK * | WHAT ABOUT * | HOW ABOUT * | AND WHAT ABOUT * | AND HOW ABOUT *</pattern>
    <template><srai><star/></srai></template>
  </category>

  <!-- ============================== Open-ended conversation ==============================
       Tried last, after every rule about your site has had its chance. -->
  <category late="true">
    <pattern>ARE YOU A * | ARE YOU AN * | ARE YOU REALLY * | ARE YOU SOME KIND OF * | ARE YOU LIKE A *</pattern>
    <template><srai>WHAT ARE YOU</srai></template>
  </category>
  <category late="true">
    <pattern>CAN YOU * | COULD YOU * | ARE YOU ABLE TO * | WILL YOU * | WOULD YOU * | CAN YOU PLEASE * | COULD YOU PLEASE * | I WANT YOU TO * | I NEED YOU TO *</pattern>
    <template>
      <think><set name="tried"><try><star/></try></set></think>
      <condition name="tried">
        <li value="*"><get name="tried"/></li>
        <li>I'm not sure about that one. [think] What I can do is answer questions about <bot name="company"/>, chat, and do a few party tricks.<reply>What can you do?</reply></li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>MY <set>family</set> * | MY <set>family</set> S * | OUR <set>family</set> *</pattern>
    <template>
      <condition name="mood">
        <li value="negative">[sad] That sounds hard. [reset] Do you want to tell me more about it?</li>
        <li>[smile] Tell me more about your <star/>. What are they like?</li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>SHE IS * | HE IS * | THEY ARE * | SHE HAS * | HE HAS * | THEY HAVE * | SHE WAS * | HE WAS * | THEY WERE *</pattern>
    <template>
      <condition name="mood">
        <li value="negative">[sad] I'm sorry to hear that. [reset] I'm listening.</li>
        <li><random><li>[nod] I see. Tell me more?</li><li>[smile] They sound like quite a character.</li><li>[nod] Go on, I'm listening.</li></random></li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>ABOUT *</pattern>
    <template>I don't know much about <person><star/></person> yet. [shrug] I'm best with questions about <bot name="company"/>, plus jokes, sums and trivia.</template>
  </category>

  <!-- ============================== When nothing matches ==============================
       "inputkind" tells a request for help from a question and from a plain remark, so each gets
       a fitting answer. A second miss in a row offers the suggestions. -->
  <category>
    <pattern>*</pattern>
    <template>
      <condition name="didyoumean">
        <li value="yes"><random>
          <li>[think] I'm not sure I follow. Did you mean one of these?</li>
          <li>Hmm, I may have something on that. [think] Is it one of these?</li>
        </random></li>
        <li><condition name="inputkind">
          <li value="gibberish">[giggle] Did a cat just walk across your keyboard?</li>
          <li value="request"><condition name="fallbackstreak">
            <li value="1"><random>
              <li>[think] I'd like to help with that, but it's beyond what I've been taught.</li>
              <li>That's not something I can sort out from in here, I'm afraid. [shake]</li>
            </random> <condition name="bot_email"><li value="*"><srai>CONTACT</srai></li><li><condition name="bot_phone"><li value="*"><srai>CONTACT</srai></li></condition></li></condition></li>
            <li name="suggestions" value="yes">[shrug] I'm still not able to help with that one, sorry. Here are some things I can do.</li>
            <li>[shrug] I'm still not able to help with that one, sorry. Is there something else I can do?</li>
          </condition></li>
          <li value="question"><condition name="fallbackstreak">
            <li value="1"><persona say="unsure"><random>
              <li>[hmm] Good question. I don't know that one, I'm afraid.</li>
              <li>I wish I knew! [shrug] That's outside what I've been taught.</li>
              <li>[think] Hmm, that one's beyond me. Could you put it another way?</li>
            </random></persona></li>
            <li name="suggestions" value="yes"><random>
              <li>[shrug] I don't know that one either, I'm afraid. Here are some things I can help with.</li>
              <li>That's beyond me too, sorry. [think] Maybe one of these is what you're after?</li>
            </random></li>
            <li><random>
              <li>[shrug] I don't know that one either, I'm afraid. I'm better with questions about <bot name="company"/>, sums and trivia.</li>
              <li>That's beyond me too, sorry. [think] Try me on something else?</li>
            </random></li>
          </condition></li>
          <li><condition name="mood">
            <li value="negative"><random>
              <li>[sad] That sounds hard. [reset] Do you want to tell me more about it?</li>
              <li>[sad] I'm sorry to hear that. [reset] I'm listening.</li>
              <li>Oof. [sad] That doesn't sound fun. [reset] What happened?</li>
            </random></li>
            <li value="positive"><random>
              <li>[smile] That sounds great! Tell me more.</li>
              <li>Lovely! [smile] That's good to hear.</li>
              <li>[smile] I like the sound of that.</li>
            </random></li>
            <li><condition name="fallbackstreak">
              <li value="3">[smile] I'm enjoying this, even if I can't keep up with all of it. I'm at my best with questions about <bot name="company"/>, jokes, riddles and sums.</li>
              <li><persona say="listen"><random>
                <li>[mhm] I see. Tell me more?</li>
                <li>Interesting! [think] What makes you say that?</li>
                <li>[nod] Got it. Go on, I'm listening.</li>
                <li>[hmm] I'm not sure what to say to that, but I'm listening.</li>
                <li>[nod] Okay. And then?</li>
                <li>That's new to me. [smile] What else is on your mind?</li>
              </random></persona></li>
            </condition></li>
          </condition></li>
        </condition></li>
      </condition>
    </template>
  </category>
</aiml>
`}var da=new Set;function Cr(e){if(e.key!=="Escape"||e.defaultPrevented||e.isComposing||e.target.closest?.(".bot-computer-widget-host, dialog, [role=dialog], [popover], [aria-expanded=true], input, select, textarea, [contenteditable=true]"))return;let t=Array.from(da).pop();t&&(t(),e.preventDefault())}function Br(e,t){return{left:Math.max(e.left,t.left),top:Math.max(e.top,t.top),right:Math.min(e.right,t.right),bottom:Math.min(e.bottom,t.bottom)}}function Is(){let e=window.visualViewport,t=e?.offsetLeft||0,a=e?.offsetTop||0;return{left:t,top:a,right:t+(e?.width||document.documentElement.clientWidth),bottom:a+(e?.height||document.documentElement.clientHeight)}}function Dr(e){let t=[];for(let a=e.parentElement;a&&a!==document.body;a=a.parentElement){let r=getComputedStyle(a),n=r.overflowX!=="visible",s=r.overflowY!=="visible";(n||s)&&t.push({node:a,x:n,y:s})}return t}function Pr(e,t,a){let r=Br(e,t);for(let{node:n,x:s,y:l}of a){let i=n.getBoundingClientRect();s&&(r.left=Math.max(r.left,i.left),r.right=Math.min(r.right,i.right)),l&&(r.top=Math.max(r.top,i.top),r.bottom=Math.min(r.bottom,i.bottom))}return r}function Gr(e,t){if(!Zt(t))return null;for(let a of["data-bot-showcase","id"])for(let r of e.querySelectorAll(`[${a}="${t}"]`))if(!r.closest(".bot-computer-widget-host, [inert], [aria-hidden=true]")&&getComputedStyle(r).visibility==="visible"){let n=r.getBoundingClientRect();if(n.width>0&&n.height>0)return r}return null}function Tt(e,t,a){return Math.max(t,Math.min(e,a))}function Ss(e,t,a,r){let n=(e.left+e.right)/2,s=(e.top+e.bottom)/2,l=12,i=[[e.right+l,s-r/2],[e.left-l-a,s-r/2],[n-a/2,e.bottom+l],[n-a/2,e.top-l-r]],c;for(let[p,h]of i){let o=Tt(p,t.left+6,t.right-a-6),I=Tt(h,t.top+6,t.bottom-r-6),g=Math.max(0,Math.min(o+a,e.right)-Math.max(o,e.left))*Math.max(0,Math.min(I+r,e.bottom)-Math.max(I,e.top)),H=Math.abs(p-o)+Math.abs(h-I);(!c||g<c.overlap||g===c.overlap&&H<c.shift)&&(c={x:o,y:I,overlap:g,shift:H})}return c}function Kr({root:e,stage:t,host:a,parent:r,position:n,anim:s,onModeChange:l,onReturn:i,onTourDepart:c,onTourStop:p,onTourEnd:h}){let o=n==="contained",I=o?r:document,g=document.createElement("div");g.className="bc-guide-layer"+(o?" is-contained":""),g.hidden=!0,g.setAttribute("aria-hidden","true");let H=document.createElement("div");H.className="bc-guide-ring",g.append(H);let N=a.shadowRoot;N.append(g);let f=e.querySelector(".bc-guide-back"),S=e.querySelector(".bc-guide-answer"),L=e.querySelector(".bc-guide-label"),F=e.querySelector(".bc-tour-progress"),U=e.querySelector(".bc-tour-prev"),z=e.querySelector(".bc-tour-next"),B=e.querySelector(".bc-tour-finish"),X={nx:0,ny:0,active:!0},x=t.parentElement,We=window.matchMedia("(prefers-reduced-motion: reduce)"),V=null,v="",T=[],M=null,R=!1,k=0,j=null,oe="",J=null,re=null,Ie=[];function rt(){let Q=Is();return o?Br(Q,r.getBoundingClientRect()):Q}function Pe(Q=!1){J&&(Je(),J.observer.disconnect(),window.removeEventListener("resize",ne),J=null,Lt(),s.tourPointing=!1,e.classList.remove("is-touring","avatar-on-right"),h()),V&&(V=null,v="",da.delete(Pe),da.size||document.removeEventListener("keydown",Cr),s.guideDirection=null,M&&(M.replaceWith(a),M=null),e.classList.remove("is-guiding"),l(),e.style.removeProperty("--bc-guide-x"),e.style.removeProperty("--bc-guide-y"),e.style.removeProperty("--bc-guide-width"),g.hidden=!0,Q&&i())}f.onclick=()=>Pe(!0),B.onclick=()=>Pe(!0),U.onclick=()=>it(-1),z.onclick=()=>it(1),e.addEventListener("keydown",Q=>{V&&Q.key==="Escape"&&(Q.preventDefault(),Pe(!0))});function ne(){J&&(J.dirty=!0)}function de(){let Q=[];J.stops.forEach((G,ee)=>{let te=Gr(I,G.target);te&&Q.push({index:ee,element:te})}),J.entries=Q,J.dirty=!1}function Ht(){let Q=J.entries.findIndex(te=>te.index===J.index),G=`Stop ${Q+1} of ${J.entries.length}`;F.textContent!==G&&(F.textContent=G);let ee=N.activeElement;U.disabled=Q<=0,z.disabled=Q+1>=J.entries.length,(ee===z&&z.disabled||ee===U&&U.disabled)&&(z.disabled?B:z).focus({preventScroll:!0})}function Lt(){re=null,s.guideTravel=null,e.classList.remove("is-travelling"),t.tabIndex=0,t.removeAttribute("aria-disabled"),t.style.removeProperty("--bc-walk-x"),t.style.removeProperty("--bc-walk-y")}function Je(){for(let Q of Ie)Q.scrollTo({left:Q.scrollLeft,top:Q.scrollTop,behavior:"instant"});Ie=[]}function _e(Q=!0){let G=J.stops[J.index],ee=!J.visited.has(J.index);J.visited.add(J.index),L.textContent=(Q?"Showing ":"About ")+re.name,Lt(),Ie=[],s.tourPointing=Q,p(G,ee)}function ue(Q,G=t.getBoundingClientRect()){let ee=J.stops[Q.index],te=performance.now(),Z=s.guideTravel?.facing??s.guideDirection?.x??0;return c(),re={x:G.left+G.width/2,y:G.bottom,started:te,last:te,speed:0,settledSince:te,name:""},s.guideTravel={phase:"walk",elapsed:0,facing:Z,stride:0,point:0},s.guideDirection=null,s.tourPointing=!1,e.classList.add("is-travelling"),t.tabIndex=-1,t.setAttribute("aria-disabled","true"),J.index=Q.index,Ht(),C(Q.element,ee.target,ee.displayText),ee}function it(Q){if(!J)return;de();let G=J.entries.filter(te=>Q*(te.index-J.index)>0),ee=Q>0?G[0]:G.at(-1);ee?ue(ee):lt()}function lt(){J.dirty&&de();let Q=J.entries.find(G=>G.index===J.index);if(Q)Ht(),V!==Q.element&&C(Q.element,v,S.textContent);else{let G=J.entries.find(ee=>ee.index>J.index)||J.entries.at(-1);G?ue(G):Pe(e.contains(N.activeElement))}}function nt(Q,G=t.getBoundingClientRect()){if((V||J)&&Pe(),!Q?.length)return null;let ee=new MutationObserver(ne);return J={stops:Q,entries:[],visited:new Set,observer:ee,index:-1,dirty:!0},de(),J.entries.length?(ee.observe(I,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["data-bot-showcase","id","class","style","hidden","aria-hidden","inert","open"]}),window.addEventListener("resize",ne),e.classList.add("is-touring"),ue(J.entries[0],G)):(J=null,null)}function Nt(Q,G,ee,te){let Z=re,P=s.guideTravel,me=performance.now(),ce=Math.min(.08,Math.max(0,me-Z.last)/1e3);Z.last=me,P.elapsed=(me-Z.started)/1e3;let Ye=x.getBoundingClientRect(),He=Ee=>Tt(Ee,Q.left+Ye.width/2,Q.right-Ye.width/2),Le=Ee=>Tt(Ee,Q.top+Ye.height,Q.bottom),fe=Ye.left+Ye.width/2,Ne=Ye.bottom;if(Z.x=He(Z.x),Z.y=Le(Z.y),We.matches&&te){_e();return}if(P.phase==="walk"){let Ee=fe,Ue=Ne;if(!te){let D=V.getBoundingClientRect();Ee=He(D.left+D.width/2),Ue=Le(D.top+D.height/2)}(Z.goalX===void 0||Math.hypot(Ee-Z.goalX,Ue-Z.goalY)>1.5)&&(Z.settledSince=me,Z.goalX=Ee,Z.goalY=Ue);let ke=Ee-Z.x,le=Ue-Z.y,Se=Math.hypot(ke,le);Z.speed=Math.max(Z.speed,Tt(Se/.78,230,1600));let Ke=Math.min(Se,ce*Z.speed);Se>1&&(Z.x+=ke/Se*Ke,Z.y+=le/Se*Ke,Math.abs(ke)>2&&(P.facing+=(ke/Se-P.facing)*Math.min(1,ce*12))),P.stride=Math.min(1,P.elapsed/.12,Se/18),te&&Se-Ke<=1&&(me-Z.settledSince>=90||P.elapsed>2)&&(Z.x=fe,Z.y=Ne,Z.turnStart=me,Z.turnFrom=P.facing,P.phase="turn")}if(P.phase==="turn"){let Ee=Tt((me-Z.turnStart)/300,0,1),Ue=Ee*Ee*(3-2*Ee);if(P.stride=0,P.point=Ue,P.facing=Z.turnFrom+(X.nx-Z.turnFrom)*Ue,Z.x=fe,Z.y=Ne,Ee>=1&&te){_e();return}}t.style.setProperty("--bc-walk-x",((Z.x-fe)*G).toFixed(2)+"px"),t.style.setProperty("--bc-walk-y",((Z.y-Ne)*ee).toFixed(2)+"px")}function yt(){if(J?.dirty&&lt(),!V)return null;let Q=V.getBoundingClientRect();if(!V.isConnected||!Q.width||!Q.height||getComputedStyle(V).visibility!=="visible"||V.closest("[inert], [aria-hidden=true]")||V.getAttribute("data-bot-showcase")!==v&&V.id!==v||o&&!r.contains(V))return J?(de(),lt()):et(v,S.textContent),null;j!==V.parentElement&&(j=V.parentElement,T=Dr(V));let G=rt(),ee=g.getBoundingClientRect(),te=ee.width?g.clientWidth/ee.width:1,Z=ee.height?g.clientHeight/ee.height:1,P=Pr(Q,G,T),me=P.right>P.left&&P.bottom>P.top;if(!me&&!J&&(R||performance.now()-k>2e3))return Pe(N.activeElement===f),null;if(H.hidden=!me,!me){if(J&&G.right>G.left&&G.bottom>G.top){let le=e.getBoundingClientRect(),Se=Tt(le.left,G.left+6,G.right-le.width-6),Ke=Tt(le.top,G.top+6,G.bottom-le.height-6);e.style.setProperty("--bc-guide-width",Math.max(1,G.right-G.left-12)*te+"px"),Math.abs(Se-le.left)>1&&e.style.setProperty("--bc-guide-x",(Se-ee.left)*te+"px"),Math.abs(Ke-le.top)>1&&e.style.setProperty("--bc-guide-y",(Ke-ee.top)*Z+"px"),oe=""}return s.guideDirection=null,s.tourPointing=!1,re&&(We.matches||performance.now()-k>2e3?_e(!1):G.right>G.left&&G.bottom>G.top&&Nt(G,te,Z,!1)),null}R=!0;let ce=le=>Math.round(le*10)/10+"px",Ye=e.getBoundingClientRect(),{x:He,y:Le}=Ss(P,G,Ye.width,Ye.height),fe=[P.left,P.top,P.right,P.bottom,ee.left,ee.top,te,Z,He,Le,G.left,G.right].join("/");fe!==oe&&(oe=fe,H.style.left=ce((P.left-ee.left)*te),H.style.top=ce((P.top-ee.top)*Z),H.style.width=ce((P.right-P.left)*te),H.style.height=ce((P.bottom-P.top)*Z),e.style.setProperty("--bc-guide-width",ce(Math.max(1,G.right-G.left-12)*te)),e.style.setProperty("--bc-guide-x",ce((He-ee.left)*te)),e.style.setProperty("--bc-guide-y",ce((Le-ee.top)*Z)),J&&e.classList.toggle("avatar-on-right",He+Ye.width<=P.left));let Ne=(J?x:t).getBoundingClientRect(),Ee=(P.left+P.right)/2-(Ne.left+Ne.width/2),Ue=(P.top+P.bottom)/2-(Ne.top+Ne.height/2),ke=Math.hypot(Ee,Ue)||1;return X.nx=Ee/ke,X.ny=Ue/ke,re&&Nt(G,te,Z,!0),s.guideTravel?.phase==="walk"?(s.guideDirection=null,null):(J&&!re&&(s.tourPointing=!0),s.guideDirection??(s.guideDirection={x:0,y:0}),s.guideDirection.x=X.nx,s.guideDirection.y=X.ny,X)}function et(Q,G){J&&Pe();let ee=Gr(I,Q);return ee?(C(ee,Q,G),!0):(Pe(N.activeElement===f),!1)}function C(Q,G,ee){Je();let te=t.getBoundingClientRect(),Z=N.activeElement!=null,P=V&&J;!V&&n==="inline"&&(M=document.createElement("div"),M.style.height=e.getBoundingClientRect().height+"px",a.before(M),document.body.append(a)),V=Q,v=G,j=V.parentElement,oe="",da.delete(Pe),da.add(Pe),document.addEventListener("keydown",Cr),R=!1,k=performance.now(),T=Dr(V);let me=(V.getAttribute("aria-label")||V.querySelector("h1,h2,h3,h4,h5,h6")?.textContent||V.matches("button,a,label,summary,h1,h2,h3,h4,h5,h6")&&V.textContent||v).trim();re&&(re.name=me),L.textContent=(re?"Walking to ":"Showing ")+me,S.textContent=ee,S.scrollTop=0,g.hidden=!1,H.hidden=!0,H.style.borderRadius=getComputedStyle(V).borderRadius;let ce=rt(),Ye=g.getBoundingClientRect();e.style.setProperty("--bc-guide-width",Math.max(1,ce.right-ce.left-12)+"px"),P||(e.style.setProperty("--bc-guide-x",Tt(te.left,ce.left+6,ce.right-260)-Ye.left+"px"),e.style.setProperty("--bc-guide-y",Tt(te.top,ce.top+6,ce.bottom-110)-Ye.top+"px")),e.classList.remove("is-minimized"),e.classList.add("is-guiding"),l(),Z&&!P&&(J?z.disabled?B:z:f).focus({preventScroll:!0});let He=V.getBoundingClientRect(),Le=Pr(He,ce,T);if(Le.left>He.left||Le.top>He.top||Le.right<He.right||Le.bottom<He.bottom){let fe=We.matches?"instant":"smooth";if(o)for(let{node:Ne,x:Ee,y:Ue}of T){if(Ne!==r&&!r.contains(Ne))break;let ke=Ne.getBoundingClientRect(),le=V.getBoundingClientRect(),Se=Ee&&(le.left<ke.left||le.right>ke.right)?le.left-ke.left:0,Ke=Ue&&(le.top<ke.top||le.bottom>ke.bottom)?le.top-ke.top:0;(Se||Ke)&&(J&&fe==="smooth"&&Ie.push(Ne),Ne.scrollBy({left:Se,top:Ke,behavior:fe}))}else J&&fe==="smooth"&&(Ie=T.map(Ne=>Ne.node),document.scrollingElement&&Ie.push(document.scrollingElement)),V.scrollIntoView({block:He.height>(ce.bottom-ce.top)*.7?"start":"center",inline:"nearest",behavior:fe})}yt()}return{start:et,startTour:nt,end:Pe,refresh:yt,get currentStop(){return J?.stops[J.index]}}}async function bs(e){if(typeof DecompressionStream=="function"){let t=new DecompressionStream("gzip"),a=t.writable.getWriter();a.write(e),a.close();let r=new Response(t.readable);return new Uint8Array(await r.arrayBuffer())}throw new Error("This browser does not support DecompressionStream('gzip'); use external wasmUrl mode.")}function Hs(e){let t=String(e).replace(/\s+/g,""),a=atob(t),r=new Uint8Array(a.length);for(let n=0;n<a.length;n++)r[n]=a.charCodeAt(n);return r}var Eo=new Map;async function Ns({wasmUrl:e,wasmBytes:t,embeddedWasmGzBase64:a,bindTTSFn:r}={}){let n=a?"__embedded_gz__":t?"__raw_bytes__":String(e||"./tts.wasm");if(Eo.has(n))return Eo.get(n);let s=(async()=>{let l;if(t)({instance:l}=await WebAssembly.instantiate(t,{}));else if(a){let p=Hs(a),h=await bs(p);({instance:l}=await WebAssembly.instantiate(h,{}))}else{let p=e||"./tts.wasm";if(typeof WebAssembly.instantiateStreaming=="function")try{({instance:l}=await WebAssembly.instantiateStreaming(fetch(p),{}))}catch{let h=await fetch(p);if(!h.ok)throw new Error(`Failed to load tts.wasm from ${p} (${h.status})`);({instance:l}=await WebAssembly.instantiate(await h.arrayBuffer(),{}))}else{let h=await fetch(p);if(!h.ok)throw new Error(`Failed to load tts.wasm from ${p} (${h.status})`);({instance:l}=await WebAssembly.instantiate(await h.arrayBuffer(),{}))}}let i=l.exports;if(typeof r=="function")return r(i);let c=new TextDecoder().decode(new Uint8Array(i.memory.buffer,i.tts_glue_ptr(),i.tts_glue_len()));return Function("wasm",c)(i)})();return Eo.set(n,s),s}var Rs=`
:host {
  all: initial;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  color: #181715;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after {
  box-sizing: border-box;
}
.bc-ic {
  width: 15px;
  height: 15px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bc-ic.solid {
  fill: currentColor;
  stroke: none;
}
button:focus-visible,
.bc-stage-card:focus-visible {
  outline: 2px solid #6aa6ff;
  outline-offset: 2px;
}
.bc-root {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.bc-root.pos-bottom-right {
  right: 20px;
  bottom: 20px;
  align-items: flex-end;
}
.bc-root.pos-bottom-left {
  left: 20px;
  bottom: 20px;
  align-items: flex-start;
}
.bc-root.pos-inline,
.bc-root.pos-contained {
  position: relative;
  right: auto;
  left: auto;
  bottom: auto;
  z-index: 20;
  align-items: center;
}
.bc-root.pos-contained {
  position: absolute;
  right: 16px;
  bottom: 16px;
  align-items: flex-end;
}
.bc-root.pos-contained.pos-bottom-left {
  left: 16px;
  right: auto;
  align-items: flex-start;
}

/* Companion Row: Chat Drawer + Avatar Stage side by side on desktop */
.bc-companion-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: calc(100vw - 28px);
}
.pos-bottom-left .bc-companion-row {
  flex-direction: row-reverse;
}

/* Avatar Stage */
.bc-stage-wrap {
  position: relative;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.bc-stage-slot { display: contents; }
.bc-stage-card {
  position: relative;
  width: var(--bc-w, 168px);
  height: var(--bc-h, 204px);
  cursor: pointer;
  user-select: none;
  filter: drop-shadow(0 12px 26px rgba(10, 14, 26, 0.3));
  border-radius: 20px;
  transition: width 0.24s ease, height 0.24s ease, transform 0.18s ease;
}
.bc-stage-card:hover {
  transform: translateY(-2px);
}
.bc-stage-card.shape-circle {
  width: var(--bc-orb, 152px);
  height: var(--bc-orb, 152px);
  border-radius: 50%;
}
.bc-stage-card canvas[hidden] { display: none; }
.bc-stage-card canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: block;
}

/* Minimized Pill */
.bc-minimized-pill {
  pointer-events: auto;
  display: none;
  align-items: center;
  gap: 9px;
  padding: 8px 14px 8px 10px;
  border-radius: 999px;
  background: #0d1322;
  color: #f4f7ff;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 8px 24px rgba(0,0,0,0.28);
  cursor: pointer;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
}
.bc-root.is-minimized .bc-companion-row {
  display: none;
}
.bc-root.is-minimized .bc-minimized-pill {
  display: inline-flex;
}
.bc-pill-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #34d6bf;
  box-shadow: 0 0 0 3px rgba(52, 214, 191, 0.24);
}

/* Floating Speech Caption Bubble */
.bc-caption {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  max-width: 260px;
  padding: 9px 12px;
  border-radius: 13px;
  background: rgba(13, 19, 34, 0.95);
  color: rgba(244, 247, 255, 0.72);
  font-size: 12.8px;
  line-height: 1.42;
  box-shadow: 0 8px 22px rgba(0,0,0,0.24);
  border: 1px solid rgba(255,255,255,0.12);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pos-bottom-left .bc-caption {
  right: auto;
  left: 0;
}
.bc-caption.visible {
  opacity: 1;
  transform: translateY(0);
}
.bc-caption .said {
  color: #f4f7ff;
}
.bc-caption mark {
  background: #b83353;
  color: #ffffff;
  padding: 0 3px;
  border-radius: 4px;
}

/* Tap-to-Speak Prompt Badge */
.bc-unmute-prompt {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 999px;
  background: #1a5fe6;
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 650;
  box-shadow: 0 4px 12px rgba(26, 95, 230, 0.45);
  animation: bcPulse 2s infinite;
  pointer-events: none;
}
@keyframes bcPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.05); }
}

/* Stage Mini Controls Dock */
.bc-controls {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(13, 19, 34, 0.92);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 14px rgba(0,0,0,0.22);
}
.bc-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: #dbe3f4;
  min-width: 30px;
  height: 30px;
  padding: 0 9px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.14s ease, color 0.14s ease;
}
.bc-btn:hover {
  background: rgba(255,255,255,0.14);
  color: #ffffff;
}
.bc-btn.accent {
  background: #1a5fe6;
  color: #ffffff;
}
.bc-btn.accent:hover {
  background: #2f71f0;
}

/* AIML Q&A Chat Panel */
.bc-chat {
  pointer-events: auto;
  width: 332px;
  max-width: calc(100vw - 28px);
  max-height: min(460px, 72dvh);
  display: none;
  flex-direction: column;
  background: #ffffff;
  color: #0d1322;
  border-radius: 18px;
  border: 1px solid rgba(13, 19, 34, 0.12);
  box-shadow: 0 18px 44px -10px rgba(13, 19, 34, 0.34);
  overflow: hidden;
}
.bc-chat.open {
  display: flex;
  animation: bcChatIn 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.bc-root [hidden], .bc-root.customizing .bc-chat:not(.bc-customizer) { display: none; }
.bc-customizer { width: 306px; }
.bc-look-body { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 15px; }
.bc-look-fields, .bc-look-colors { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.bc-look-fields label, .bc-look-colors label { color: #3b4556; font: 600 12px/1.35 system-ui, sans-serif; }
.bc-look-fields label { display: grid; gap: 5px; }
.bc-look-fields select {
  width: 100%; min-width: 0; padding: 7px 4px; border-radius: 7px; border: 1px solid #c8d0df;
  color: #202837; background: #fff; font: 400 13px/1.3 system-ui, sans-serif;
}
.bc-look-colors { border-top: 1px solid #e1e5ec; margin-top: 14px; padding-top: 13px; gap: 8px 12px; }
.bc-look-colors label { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.bc-look-colors input {
  appearance: none; box-sizing: border-box; width: 35px; height: 30px; padding: 3px; border: 1px solid #c8d0df;
  border-radius: 8px; background: #fff; cursor: pointer;
}
.bc-look-colors input::-webkit-color-swatch-wrapper { padding: 0; }
.bc-look-colors input::-webkit-color-swatch { border: 0; border-radius: 4px; }
.bc-look-colors input::-moz-color-swatch { border: 0; border-radius: 4px; }
.bc-look-footer {
  display: flex; align-items: center; justify-content: space-between; flex: none; padding: 9px 13px;
  border-top: 1px solid #e1e5ec; background: #f6f8fb;
}
.bc-look-reset { border: 0; background: transparent; color: #374257; padding: 6px 0; font: 600 12px system-ui; cursor: pointer; }
.bc-look-reset:disabled { opacity: .5; cursor: default; }
.bc-customizer :focus-visible { outline: 2px solid #3549ca; outline-offset: 2px; }
.bc-look-toggle[aria-expanded="true"] { background: #e6eaff; color: #192558; }
@keyframes bcChatIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
}
.bc-chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 12px 11px 14px;
  background: #0d1322;
  color: #f4f7ff;
}
.bc-chat-title {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.bc-chat-title strong {
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bc-chat-title span {
  font-size: 11.5px;
  color: #8fa0c2;
}
.bc-chat-close {
  appearance: none;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #cbd5e1;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bc-chat-close:hover {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}
.bc-chat-head,
.bc-chips,
.bc-form {
  flex: none;
}
.bc-messages {
  /* The log is the only part that shrinks, so the input row is never clipped in short layouts. */
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f3f5f9;
  min-height: 84px;
}
.bc-msg {
  max-width: 86%;
  padding: 8.5px 12px;
  border-radius: 13px;
  font-size: 13.2px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.bc-msg.bot {
  align-self: flex-start;
  background: #ffffff;
  color: #0d1322;
  border: 1px solid #dbe1ec;
  border-bottom-left-radius: 4px;
}
.bc-msg.user {
  align-self: flex-end;
  background: #1a5fe6;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}
.bc-msg a {
  color: #1a5fe6;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bc-msg a:focus-visible {
  outline: 2px solid #1a5fe6;
  outline-offset: 2px;
  border-radius: 3px;
}
.bc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 7px 10px;
  background: #f3f5f9;
  border-top: 1px solid #e3e8f0;
}
.bc-chips:empty {
  display: none;
}
.bc-chip {
  appearance: none;
  border: 1px solid #c8d0df;
  background: #ffffff;
  color: #2a3348;
  padding: 4px 10px;
  border-radius: 999px;
  font: inherit;
  font-size: 11.8px;
  font-weight: 550;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.bc-chip:hover {
  background: #edf3ff;
  border-color: #1a5fe6;
  color: #1a5fe6;
}
.bc-form {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: #ffffff;
  border-top: 1px solid #e3e8f0;
}
.bc-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #c8d0df;
  border-radius: 999px;
  padding: 8px 13px;
  font: inherit;
  font-size: 16px; /* stops iOS Safari zooming the page on focus */
  background: #f7f9fc;
  color: #0d1322;
  outline: none;
}
.bc-input:focus {
  border-color: #1a5fe6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(26, 95, 230, 0.16);
}
.bc-send {
  appearance: none;
  border: none;
  background: #1a5fe6;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bc-send:hover {
  background: #124bc0;
}
.bc-send .bc-ic {
  width: 17px;
  height: 17px;
}

/* Mobile Responsive Layout (Viewport <= 640px OR Narrow Preview Container): Keep Speaking Avatar Visible Above Chat! */
.bc-root.is-narrow-host.pos-contained {
  right: 10px;
  left: 10px;
  bottom: 10px;
  align-items: flex-end;
}
.bc-root.is-narrow-host .bc-companion-row {
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}
.bc-root.is-narrow-host.pos-bottom-left .bc-companion-row {
  flex-direction: column-reverse;
  align-items: flex-start;
}
.bc-root.is-narrow-host .bc-stage-card {
  width: 114px;
  height: 138px;
}
.bc-root.is-narrow-host .bc-stage-card.shape-circle {
  width: 108px;
  height: 108px;
}
.bc-root.is-narrow-host:is(.chat-is-open,.customizing) .bc-stage-card {
  width: 88px;
  height: 104px;
}
.bc-root.is-narrow-host:is(.chat-is-open,.customizing) .bc-stage-card.shape-circle {
  width: 84px;
  height: 84px;
}
.bc-root.is-narrow-host .bc-chat {
  width: 100%;
  max-width: 100%;
  max-height: 340px;
}
.bc-root.is-narrow-host.pos-contained .bc-customizer {
  max-height: min(390px, calc(var(--bc-host-h, 520px) - 182px), calc(100dvh - 192px));
}
.bc-root.is-narrow-host .bc-stage-wrap { max-width: 100%; }
.bc-root.is-narrow-host .bc-controls { max-width: 100%; gap: 2px; flex-wrap: wrap; justify-content: center; }
.bc-root.is-narrow-host .bc-btn {
  min-height: 34px;
  padding: 0 6px;
}

@media (max-width: 640px) {
  .bc-root.pos-bottom-right,
  .bc-root.pos-bottom-left,
  .bc-root.pos-contained {
    right: 10px;
    left: 10px;
    bottom: 10px;
    align-items: flex-end;
  }
  .bc-companion-row {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 8px;
    width: 100%;
  }
  .pos-bottom-left .bc-companion-row {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .bc-stage-card {
    width: 116px;
    height: 140px;
  }
  .bc-stage-card.shape-circle {
    width: 110px;
    height: 110px;
  }
  .bc-root:is(.chat-is-open,.customizing) .bc-stage-card {
    width: 88px;
    height: 104px;
  }
  .bc-root:is(.chat-is-open,.customizing) .bc-stage-card.shape-circle {
    width: 84px;
    height: 84px;
  }
  .bc-chat {
    width: 100%;
    max-width: 100%;
    max-height: 52dvh;
  }
  .bc-btn {
    min-height: 34px;
    padding: 0 10px;
  }
  .bc-customizer { max-height: min(398px, calc(100dvh - 186px - env(safe-area-inset-bottom, 0px))); }
  .bc-look-fields select { font-size: 16px; }
}
@media (max-width: 640px) and (min-height: 600px) {
  .bc-root.customizing:not(.is-narrow-host) .bc-stage-card { width: 136px; height: 164px; }
  .bc-root.customizing:not(.is-narrow-host) .bc-stage-card.shape-circle { width: 136px; height: 136px; }
  .bc-customizer { max-height: min(398px, calc(100dvh - 250px - env(safe-area-inset-bottom, 0px))); }
}
@media (max-width: 360px) {
  .bc-controls { gap: 2px; }
  .bc-controls .bc-btn { padding: 0 6px; }
}


.bc-guide-layer { position: fixed; inset: 0; pointer-events: none; z-index: 2147483001; overflow: hidden; }
.bc-guide-layer.is-contained { position: absolute; z-index: 21; }
.bc-guide-layer[hidden], .bc-guide-ring[hidden], .bc-guide-summary { display: none; }
.bc-guide-ring {
  position: absolute; pointer-events: none; border: 3px solid #544bd1;
  box-shadow: inset 0 0 0 2px #fff, 0 0 0 2px #fff, 0 0 12px #25207155;
}
.bc-root.is-guiding {
  position: fixed; right: auto; bottom: auto; left: var(--bc-guide-x); top: var(--bc-guide-y);
  z-index: 2147483002;
  width: min(260px, var(--bc-guide-width)); max-width: none; padding: 0;
  transition: left .23s ease-out, top .23s ease-out;
}
.bc-root.pos-contained.is-guiding { position: absolute; z-index: 22; }
.bc-root.is-guiding .bc-companion-row { display: block; max-width: none; width: 100%; }
.bc-root.is-guiding .bc-stage-wrap {
  display: flex; flex-direction: row; align-items: center; width: 100%; gap: 4px;
  padding: 5px 8px 5px 2px; color: #24253a; background: #fff; border: 1px solid #d6d1ed;
  border-radius: 15px; box-shadow: 0 6px 22px #17132d33;
}
.bc-root.avatar-on-right .bc-stage-wrap { flex-direction: row-reverse; padding: 5px 2px 5px 8px; }
.bc-root.is-guiding .bc-stage-slot { display: block; flex: 0 0 37%; }
.bc-root.is-guiding .bc-stage-wrap .bc-stage-card[role] {
  width: 100%; height: 107px; filter: none; transform: none; transition: none;
}
.bc-root.is-guiding :is(.bc-chat, .bc-controls, .bc-caption, .bc-unmute-prompt) { display: none; }
.bc-root.is-guiding .bc-guide-summary {
  display: grid; min-width: 0; flex: 1; gap: 3px;
  font: 13px/1.35 system-ui, sans-serif;
}
.bc-guide-label { font-weight: 700; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; color: #343056; }
.bc-guide-answer { max-height: 4.05em; overflow-y: auto; overflow-wrap: anywhere; overscroll-behavior: contain; }
.bc-guide-answer:empty { display: none; }
.bc-guide-back {
  justify-self: start; border: 0; border-radius: 5px; padding: 4px 0; background: transparent;
  color: #3f37a2; font: 650 12px/1.4 system-ui, sans-serif; cursor: pointer;
}
.bc-guide-back:hover { text-decoration: underline; }
.bc-tour-progress, .bc-tour-controls { display: none; }
.bc-root.is-touring { width: min(304px, var(--bc-guide-width)); transition: none; }
.bc-root.is-touring .bc-stage-slot { height: 120px; }
.bc-root.is-touring .bc-stage-wrap .bc-stage-card[role] { height: 100%; }
.bc-root.is-travelling .bc-stage-wrap .bc-stage-card[role] {
  transform: translate3d(var(--bc-walk-x, 0px), var(--bc-walk-y, 0px), 0);
  pointer-events: none; z-index: 1;
}
.bc-root.is-travelling .bc-guide-answer { visibility: hidden; }
.bc-root.is-travelling .bc-stage-wrap { background: transparent; border-color: transparent; box-shadow: none; }
.bc-root.is-travelling .bc-guide-summary { position: relative; isolation: isolate; }
.bc-root.is-travelling .bc-guide-summary::before {
  content: ""; position: absolute; z-index: -1; inset: -6px; background: #fff;
  border: 1px solid #d6d1ed; border-radius: 12px; box-shadow: 0 4px 16px #17132d22;
}
.bc-root.is-touring .bc-guide-back { display: none; }
.bc-root.is-touring .bc-tour-progress { display: block; color: #58516d; font: 600 11px/1.4 system-ui, sans-serif; }
.bc-root.is-touring .bc-tour-controls { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
.bc-tour-controls button {
  min-height: 32px; padding: 3px 7px; border-radius: 6px; border: 1px solid #d6d1ed;
  background: white; color: #38325d; font: 600 12px/1.3 system-ui, sans-serif; cursor: pointer;
}
.bc-tour-controls .bc-tour-next:not(:disabled), .bc-tour-controls .bc-tour-next:disabled + .bc-tour-finish {
  background: #463baf; border-color: #463baf; color: white;
}
.bc-tour-controls button:disabled { opacity: .44; cursor: default; }
.bc-tour-controls button:focus-visible { outline: 2px solid #4239a9; outline-offset: 2px; }
@media (pointer: coarse), (max-width: 640px) {
  .bc-tour-controls button { min-width: 44px; min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) { .bc-root.is-guiding { transition: none; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
`,st={look:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 1 9-9c0 2.5-1.5 4-4 4h-2a1.5 1.5 0 0 0-1.3 2.3l.4.6C15 20.2 13.7 21 12 21Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="15" cy="8" r=".8"/></svg>',play:'<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 4.8v14.4a.6.6 0 0 0 .92.5l11.3-7.2a.6.6 0 0 0 0-1L8.42 4.3a.6.6 0 0 0-.92.5z"/></svg>',stop:'<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.2"/></svg>',chat:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',volume:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/></svg>',muted:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>',minus:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',close:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',send:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>'},_r={compact:{w:136,h:166,orb:126},standard:{w:172,h:210,orb:158},large:{w:216,h:262,orb:196}},ws=/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[a-z]{2,}[^\s<>"']*|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d ().-]{6,}\d)/gi;function Ws(e,t){let a=0;for(let r of t.matchAll(ws)){let n=r[0].replace(/[.,!?;:)]+$/,""),s="";if(/^https?:\/\//i.test(n))s=n;else if(/^www\./i.test(n))s=`https://${n}`;else if(n.includes("@"))s=`mailto:${n}`;else{let i=n.replace(/\D/g,"");(n.startsWith("+")||i.length>=9)&&(s=`tel:${n.replace(/[^\d+]/g,"")}`)}if(!s)continue;e.append(t.slice(a,r.index));let l=document.createElement("a");l.href=s,l.textContent=n,s.startsWith("http")&&(l.target="_blank",l.rel="noopener noreferrer"),e.append(l),a=r.index+n.length}e.append(t.slice(a))}async function Fr(e={},t={}){let a={name:"Aria",role:"Website Companion",company:"bot.computer",website:typeof location<"u"?location.origin:"https://bot.computer",greeting:"Hi! Welcome to our website! Ask me anything below.",position:"bottom-right",size:"standard",autoGreet:!1,eyeTracking:!0,showCaptions:!0,chatEnabled:!0,speechEnabled:!0,chatStartOpen:!1,allowVisitorCustomization:!1,baseBrain:!0,facts:{},rememberChat:!0,persona:null,wasmUrl:"./tts.wasm",aimlUrl:"",aimlXml:"",voice:{gender:"female",pitchHz:192,speed:1.05,expressiveness:1.06},avatar:{...Aa},...e};a.renderMode="2d",a.avatar={...Aa,...e.avatar||{}},a.persona=$t(a.persona),a.persona&&e.greeting===void 0&&(a.greeting=or(a.persona,a));let r=()=>a.persona?a.persona.mood:"",n=document.createElement("div");n.className="bot-computer-widget-host";let s=document.body;if((a.position==="inline"||a.position==="contained")&&a.container){let y=typeof a.container=="string"?document.querySelector(a.container):a.container;y&&(s=y)}s.appendChild(n);let l=n.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=Rs,l.appendChild(i);let c=_r[a.size]||_r.standard,p=a.position==="bottom-left"?"pos-bottom-left":a.position==="inline"?"pos-inline":a.position==="contained"?`pos-contained ${a.align==="left"?"pos-bottom-left":""}`:"pos-bottom-right",h=document.createElement("div");h.className=`bc-root ${p}`,h.style.setProperty("--bc-w",`${c.w}px`),h.style.setProperty("--bc-h",`${c.h}px`),h.style.setProperty("--bc-orb",`${c.orb}px`),h.innerHTML=`
    <button type="button" class="bc-minimized-pill" part="pill">
      <span class="bc-pill-dot"></span>
      <span class="bc-pill-label"></span>
    </button>
    <div class="bc-companion-row">
      <section class="bc-chat">
        <header class="bc-chat-head">
          <div class="bc-chat-title">
            <strong class="bc-head-name"></strong>
            <span class="bc-head-status">Ready</span>
          </div>
          <button type="button" class="bc-chat-close" title="Close chat" aria-label="Close chat">${st.close}</button>
        </header>
        <div class="bc-messages" role="log" aria-live="polite"></div>
        <div class="bc-chips"></div>
        <form class="bc-form">
          <input type="text" class="bc-input" placeholder="Ask a question\u2026" autocomplete="off" aria-label="Your question" />
          <button type="submit" class="bc-send" title="Send" aria-label="Send">${st.send}</button>
        </form>
      </section>

      <section id="bc-look" class="bc-chat bc-customizer" aria-label="Customize avatar" hidden>
        <header class="bc-chat-head">
          <div class="bc-chat-title"><strong>Customize avatar</strong><span>Only your view changes</span></div>
          <button type="button" class="bc-chat-close bc-look-close" aria-label="Close customizer">${st.close}</button>
        </header>
        <div class="bc-look-body">
          <div class="bc-look-fields"></div>
          <div class="bc-look-colors"></div>
        </div>
        <footer class="bc-look-footer">
          <button type="button" class="bc-look-reset">Restore original look</button>
          <button type="button" class="bc-btn accent bc-look-done">Done</button>
        </footer>
      </section>
      <div class="bc-stage-wrap">
        <div class="bc-caption" aria-live="off"></div>
        <div class="bc-stage-slot">
          <div class="bc-stage-card" role="button" tabindex="0">
            <canvas width="360" height="440"></canvas>
            <canvas class="bc-model" width="360" height="440" aria-hidden="true"></canvas>
            <div class="bc-unmute-prompt" hidden>Tap to hear</div>
          </div>
        </div>
        <div class="bc-guide-summary">
          <div role="status" aria-atomic="true"><span id="bc-tour-progress" class="bc-tour-progress"></span><strong id="bc-guide-label" class="bc-guide-label"></strong></div>
          <div id="bc-guide-answer" class="bc-guide-answer"></div>
          <button type="button" class="bc-guide-back" aria-describedby="bc-guide-label bc-guide-answer">\u2190 Back to chat</button>
          <div class="bc-tour-controls" role="group" aria-label="Tour navigation" aria-describedby="bc-tour-progress bc-guide-label bc-guide-answer">
            <button type="button" class="bc-tour-prev">Back</button>
            <button type="button" class="bc-tour-next">Next</button>
            <button type="button" class="bc-tour-finish">Finish</button>
          </div>
        </div>
        <div class="bc-controls">
          <button type="button" class="bc-btn bc-speak-btn" title="Speak the greeting">${st.play}<span>Speak</span></button>
          <button type="button" class="bc-btn accent bc-ask-btn" title="Ask a question">${st.chat}<span>Ask</span></button>
          <button type="button" class="bc-btn bc-look-toggle" aria-label="Customize avatar" title="Customize avatar" aria-controls="bc-look" aria-expanded="false" hidden>${st.look}<span>Customize</span></button>
          <button type="button" class="bc-btn bc-mute-btn" title="Mute" aria-label="Mute" aria-pressed="false">${st.volume}</button>
          <button type="button" class="bc-btn bc-min-btn" title="Minimize" aria-label="Minimize">${st.minus}</button>
        </div>
      </div>
    </div>
  `,l.appendChild(h);let o=h.querySelector("canvas"),I=h.querySelector(".bc-model"),g=null,H=h.querySelector(".bc-stage-card"),N=h.querySelector(".bc-caption"),f=h.querySelector(".bc-unmute-prompt"),S=h.querySelector(".bc-chat"),L=h.querySelector(".bc-head-name"),F=h.querySelector(".bc-head-status"),U=h.querySelector(".bc-messages"),z=h.querySelector(".bc-chips"),B=h.querySelector(".bc-form"),X=h.querySelector(".bc-input"),x=h.querySelector(".bc-speak-btn"),We=h.querySelector(".bc-ask-btn"),V=h.querySelector(".bc-mute-btn"),v=h.querySelector(".bc-min-btn"),T=h.querySelector(".bc-chat-close"),M=h.querySelector(".bc-minimized-pill"),R=h.querySelector(".bc-pill-label"),k=h.querySelector(".bc-look-toggle"),j=h.querySelector(".bc-customizer"),oe=null,J=_a(a),re=a.avatar;function Ie(y,_=!1){j.hidden=!y,j.classList.toggle("open",y),h.classList.toggle("customizing",y),k.setAttribute("aria-expanded",String(y)),y?j.querySelector("select")?.focus({preventScroll:!0}):_&&k.focus({preventScroll:!0})}function rt(){let y=a.allowVisitorCustomization===!0;!y&&(j.contains(l.activeElement)||l.activeElement===k)&&(a.chatEnabled?We:H).focus({preventScroll:!0}),k.hidden=!y,y?oe?oe.setOwnerAvatar(a.avatar):oe=Zo({panel:j,ownerAvatar:a.avatar,storageKey:t.preview?null:J,onChange:_=>{re=_}}):(Ie(!1),re=a.avatar)}function Pe(){return a.allowVisitorCustomization!==!0||fe?!1:(te.end(),h.classList.remove("is-minimized"),Ie(!0),!0)}k.onclick=()=>{j.hidden?Pe():Ie(!1,!0)};for(let y of j.querySelectorAll(".bc-look-close, .bc-look-done"))y.onclick=()=>Ie(!1,!0);j.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),Ie(!1,!0))}),rt();let ne="Ready",de=y=>{x.innerHTML=`${y?st.stop:st.play}<span>${y?"Stop":a.speechEnabled?"Speak":"Greet"}</span>`};function Ht(){let y=String(a.name||"Companion");L.textContent=a.role?`${y} \xB7 ${a.role}`:y,R.textContent=y,M.title=`Open ${y}`,S.setAttribute("aria-label",`Chat with ${y}`);let _=h.classList.contains("is-guiding");H.title=_?"Replay this answer":a.speechEnabled?`Click to hear ${y}`:`Show the greeting from ${y}`,H.setAttribute("aria-label",H.title)}let Lt=()=>{let y=a.avatar.stageShape==="circle"&&a.avatar.framing!=="cutout";H.classList.toggle("shape-circle",y)};Ht(),Lt(),a.speechEnabled||(V.style.display="none",x.title="Show the greeting",de(!1)),a.chatEnabled?a.chatStartOpen&&(S.classList.add("open"),h.classList.add("chat-is-open")):We.style.display="none";let Je=()=>{let y=a.facts&&typeof a.facts=="object"?a.facts:{},_={name:a.name,role:a.role,company:a.company,website:a.website};for(let{key:se}of vr)_[se]=String(y[se]??"").trim();return _},_e=new Ma({botProps:Je(),baseXml:a.baseBrain!==!1?mo:"",persona:a.persona}),ue=()=>_e.quickChips.map(y=>({label:y,query:y}));async function it(){let y=a.aimlXml||"";if(!y&&a.aimlUrl)try{let _=await fetch(a.aimlUrl);_.ok&&(y=await _.text())}catch(_){console.warn("[bot.computer] Could not fetch AIML XML:",_)}if(y)try{_e.loadXML(y)}catch(_){console.warn("[bot.computer] Invalid AIML XML:",_)}Q(ue())}let lt=[];function nt(y,_){let se=document.createElement("div");return se.className=`bc-msg ${y}`,y==="bot"?Ws(se,String(_)):se.textContent=_,U.appendChild(se),U.scrollTop=U.scrollHeight,lt.push({role:y,text:String(_)}),se}let Nt=a.rememberChat!==!1&&a.position!=="contained"&&!t.preview,yt=`bot-computer:chat:${String(a.sessionId||a.name||"bot").toLowerCase()}`;function et(){if(Nt)try{sessionStorage.setItem(yt,JSON.stringify({v:1,transcript:lt.slice(-40),engine:_e.exportSession(),open:S.classList.contains("open")}))}catch{}}function C(){if(!Nt)return!1;try{let y=JSON.parse(sessionStorage.getItem(yt)||"null");if(!y||y.v!==1||!Array.isArray(y.transcript)||!y.transcript.length)return!1;for(let _ of y.transcript)_&&(_.role==="bot"||_.role==="user")&&typeof _.text=="string"&&nt(_.role,_.text);return _e.importSession(y.engine),y.open&&a.chatEnabled&&(S.classList.add("open"),h.classList.add("chat-is-open")),!0}catch{return!1}}function Q(y){z.replaceChildren();for(let _ of(y||[]).slice(0,5)){let se=typeof _=="string"?_:_.label,he=typeof _=="string"?_:_.query||_.label,ie=document.createElement("button");ie.type="button",ie.className="bc-chip",ie.textContent=se,ie.onclick=()=>Yt(he,se),z.appendChild(ie)}}let G=Bo();Gt(G,r());let ee={nx:0,ny:0,active:!1},te=Kr({root:h,stage:H,host:n,parent:s,position:a.position,anim:G,onModeChange:Ht,onReturn:()=>(S.classList.contains("open")?X:H).focus({preventScroll:!0}),onTourDepart:()=>{D(),Pt(G,"rest"),Kt()},onTourStop:(y,_)=>{_&&(nt("bot",ho(y)||`[Show ${y.target}]`),et()),mt(y)},onTourEnd:()=>{D(),Pt(G,"rest")}}),Z=null,P=null,me=null,ce=null,Ye=0,He=!1,Le=!1,fe=!1,Ne=0,Ee=0,Ue=0,ke=null,le=null,Se=0,Ke=y=>{if(!a.eyeTracking||fe)return;let _=o.getBoundingClientRect();if(!_.width||!_.height)return;let se=_.left+_.width*.5,he=_.top+_.height*.42;ee.nx=Math.max(-1,Math.min(1,(y.clientX-se)/Math.max(180,window.innerWidth*.35))),ee.ny=Math.max(-1,Math.min(1,(y.clientY-he)/Math.max(160,window.innerHeight*.35))),ee.active=!0};window.addEventListener("pointermove",Ke,{passive:!0});function D(){if(Ue++,me){me.onended=null;try{me.stop()}catch{}me=null}He=!1,ce=null,ct="",le=null,Se=0,Gt(G,r()),de(!1),Z&&(F.textContent=ne)}let ct="",kt=[],ht=null;function Mt(y,_){if(!a.showCaptions||!y||!y.words||!y.words.length)return;if(S.classList.contains("open")){N.classList.remove("visible");return}if(ht!==y){ht=y,ct="";let Re=String(y.text||"").split(/\s+/).filter(Boolean);kt=(Re.length===y.words.length?Re:y.words.map(ge=>ge.word)).map(co)}let se=0,he=-1;for(let Re=0;Re<y.words.length&&_>=y.words[Re].start;Re++)se=Re,_<y.words[Re].end&&(he=Re);let ie=`${se}:${he}`;ie!==ct&&(ct=ie,N.classList.add("visible"),clearTimeout(Ee),N.replaceChildren(),kt.forEach((Re,ge)=>{let je=document.createElement(ge===he?"mark":"span");ge!==he&&(ge<se||ge===se&&he===-1)&&(je.className="said"),je.textContent=Re,N.append(je," ")}))}let ae;function Rt(){return a.speechEnabled?(ae??(ae=Ns({wasmUrl:a.wasmUrl,wasmBytes:t.wasmBytes,embeddedWasmGzBase64:t.embeddedWasmGzBase64||globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__,bindTTSFn:t.bindTTSFn}).then(({TTS:y})=>fe?null:(Z=new y(a.voice||"female"),a.voice=Z.settings,Z)).catch(y=>(console.error("[bot.computer] TTS engine load error:",y),F.textContent="Text only (voice unavailable)",null))),ae):Promise.resolve(null)}function Kt(){let y=globalThis.AudioContext||globalThis.webkitAudioContext;a.speechEnabled&&!Le&&y&&(P??(P=new y),P.state==="suspended"&&P.resume().catch(()=>{}))}async function pt(y,{emote:_="",defaultEmote:se="",cues:he=null,cueWords:ie=0}={}){D();let Re=Ue,ge=he?{speechText:String(y),cues:he,wordCount:ie}:po(y),je=ge.cues.some(ft=>ft.type==="action"),wt=_||(je?"":se);wt&&Pt(G,wt);let we=()=>{le=Vo(ge.cues),Se=performance.now()},ve=!!At(ge.speechText)||ge.cues.some(ft=>ft.sound);ve&&Kt();let Ct=a.speechEnabled&&ve&&!Le?Z||await Rt():null;if(fe||Re!==Ue)return;if(!Ct||Le){we(),!a.speechEnabled&&a.showCaptions&&ve&&(N.textContent=At(ge.speechText),N.classList.add("visible"),clearTimeout(Ee),Ee=setTimeout(()=>N.classList.remove("visible"),Math.max(3500,Math.min(15e3,ge.wordCount*350))));return}if(!P){we();return}if(P.state==="suspended")try{await P.resume()}catch{}if(fe||Re!==Ue)return;if(P.state==="suspended"){f.hidden=!1,we();return}f.hidden=!0;let Qe=/\[[a-zA-Z_/]/.test(ge.speechText)?Ct.speakScript(ge.speechText):Ct.speak(ge.speechText);if(!Qe||!Qe.samples||!Qe.samples.length){we();return}let ea=P.createBuffer(1,Qe.samples.length,Qe.sampleRate);ea.copyToChannel(Qe.samples,0),me=P.createBufferSource(),me.buffer=ea,me.connect(P.destination),ce=Qe,le=Fo(Qe,ge.cues,ge.wordCount),Se=0,Ye=P.currentTime+.015,He=!0,de(!0),F.textContent="Speaking",me.start(Ye),me.onended=()=>{Ta(G,le,1/0),le=null,Gt(G,r()),He=!1,ce=null,ct="",de(!1),F.textContent=ne,Ee=setTimeout(()=>N.classList.remove("visible"),1600)}}async function Yt(y,_){let se=String(y||"").trim();if(!se)return;let he=H.getBoundingClientRect();j.hidden||Ie(!1),S.classList.contains("open")||(S.classList.add("open"),h.classList.add("chat-is-open"),N.classList.remove("visible")),nt("user",_||se);let ie=_e.reply(se);ke=ie;let Re=ie.tour?.length?te.startTour(ie.tour,he):null;Re||(nt("bot",ho(ie)),te.start(ie.showcase,ie.displayText||"")),Q(ie.chips&&ie.chips.length?ie.chips:ue()),et(),Re||await mt(ie)}async function mt(y){D(),te.currentStop&&Pt(G,"rest");let _=Ue;Kt(),await new Promise(se=>{requestAnimationFrame(()=>setTimeout(se,0)),setTimeout(se,80)}),!(fe||_!==Ue)&&await pt(y.speechText,{cues:y.cues,cueWords:y.cueWords})}let _t=()=>{if(!G.guideTravel)if(He)D();else if(h.classList.contains("is-guiding")&&ke){let y=te.currentStop||ke;pt(y.speechText,{cues:y.cues,cueWords:y.cueWords})}else pt(a.greeting,{defaultEmote:"wave"})};H.onclick=_t,H.onkeydown=y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),_t())},x.onclick=_t;let Ft=()=>{S.classList.remove("open"),h.classList.remove("chat-is-open"),et()};We.onclick=()=>{let y=!j.hidden;y&&Ie(!1);let _=y||!S.classList.contains("open");S.classList.toggle("open",_),h.classList.toggle("chat-is-open",_),_&&(N.classList.remove("visible"),U.children.length||nt("bot",At(a.greeting)),X.focus({preventScroll:!0})),et()},T.onclick=Ft,S.addEventListener("keydown",y=>{y.key==="Escape"&&(Ft(),We.focus())}),V.onclick=()=>{Le=!Le,V.innerHTML=Le?st.muted:st.volume,V.title=Le?"Unmute":"Mute",V.setAttribute("aria-label",V.title),V.setAttribute("aria-pressed",String(Le)),Le&&D()},v.onclick=()=>{D(),j.hidden||Ie(!1),h.classList.add("is-minimized"),M.focus({preventScroll:!0})},M.onclick=()=>{h.classList.remove("is-minimized"),v.focus({preventScroll:!0})},B.onsubmit=y=>{y.preventDefault();let _=X.value.trim();_&&(X.value="",Ut=0,Yt(_))};let Ut=0,vt={nx:0,ny:0,active:!0};X.addEventListener("input",()=>{let y=H.getBoundingClientRect(),_=X.getBoundingClientRect();if(!y.width||!_.width)return;let se=_.left+_.width/2-(y.left+y.width/2),he=_.top+_.height/2-(y.top+y.height*.42),ie=Math.hypot(se,he)||1;vt.nx=se/ie*.8,vt.ny=he/ie*.8,Ut=performance.now()+1500});let tt=null;if(["inline","contained"].includes(a.position)&&typeof ResizeObserver=="function"){let y=()=>{h.classList.toggle("is-narrow-host",s.clientWidth<=640),a.position==="contained"&&h.style.setProperty("--bc-host-h",`${s.clientHeight}px`)};y(),tt=new ResizeObserver(y),tt.observe(s)}let Vt=typeof IntersectionObserver!="function",ma=typeof IntersectionObserver=="function"?new IntersectionObserver(([y])=>{Vt=y.isIntersecting}):null;ma?.observe(H);function ye(y){if(!fe){if(!document.hidden&&!h.classList.contains("is-minimized")){let _=te.refresh(),se=Math.min(window.devicePixelRatio||1,2),he=Math.max(120,Math.floor((H.clientWidth||c.w)*se)),ie=Math.max(120,Math.floor((H.clientHeight||c.h)*se));(o.width!==he||o.height!==ie)&&(o.width=he,o.height=ie);let Re=null;if(He&&ce&&P){let ge=Math.max(0,P.currentTime-Ye);Re=qo(ce,Math.min(ge,ce.duration),a.voice?.pitchHz||160),Mt(ce,ge),Ta(G,le,ge,y)}else le&&Se&&(Ta(G,le,(performance.now()-Se)/1e3,y),le.next>=le.items.length&&(le=null,Se=0));if(zo(G,y,Re,_||(performance.now()<Ut?vt:a.eyeTracking?ee:null),a.voice?.pitchHz||160),Vt||G.guideTravel){let ge=h.classList.contains("is-guiding"),je=ge?{...re,framing:"half",stageShape:"cutout",bgStyle:"transparent"}:re,wt=G.guideTravel?.phase==="walk"?"full":je.framing,we={framing:wt,smoothFraming:ge,showVoiceWaves:!ge};I.hidden=!0,Xo(o.getContext("2d"),he,ie,wt===je.framing?je:{...je,framing:wt},G,y,we)}}Ne=requestAnimationFrame(ye)}}return await it(),C(),(globalThis.requestIdleCallback||(y=>setTimeout(y,250)))(()=>{fe||_e.warmUp()}),a.chatEnabled&&a.chatStartOpen&&!U.children.length&&nt("bot",At(a.greeting)),Ne=requestAnimationFrame(ye),a.autoGreet&&Rt().then(()=>{!fe&&!ke&&!He&&pt(a.greeting,{defaultEmote:"wave"})}),{hostEl:n,openCustomizer:Pe,say:(y,_="")=>pt(y,{emote:_}),ask:y=>Yt(y),stop:D,emote:(y,_)=>Pt(G,y,_),sound(y,_={}){let se=String(y||"").trim().toLowerCase().replace(/[^a-z-]/g,"");if(!se)return Promise.resolve();let he=se;return _.intensity!==void 0&&(he+=` intensity=${String(_.intensity).replace(/[^\w.]/g,"")}`),_.length!==void 0&&(he+=` length=${String(_.length).replace(/[^\w.]/g,"")}`),_.durationMs>0&&(he+=` for=${(Number(_.durationMs)/1e3).toFixed(2)}s`),pt(`[${he}]`)},mood:y=>Gt(G,y),clearChat(){te.end(),D(),ke=null,U.replaceChildren(),lt.length=0,_e.resetSession(),Q(ue());try{sessionStorage.removeItem(yt)}catch{}},updateConfig(y={}){let _=JSON.stringify(Je()),se=["name","role","company"].some(ie=>y[ie]!==void 0&&y[ie]!==a[ie]);y.name!==void 0&&(a.name=y.name),y.role!==void 0&&(a.role=y.role),y.company!==void 0&&(a.company=y.company),y.facts!==void 0&&(a.facts={...y.facts||{}});let he=JSON.stringify(Je())!==_;if(y.greeting!==void 0&&(a.greeting=y.greeting),y.speechEnabled!==void 0&&a.speechEnabled!==!!y.speechEnabled&&(a.speechEnabled=!!y.speechEnabled,D(),V.style.display=a.speechEnabled?"":"none",x.title=a.speechEnabled?"Speak the greeting":"Show the greeting",de(!1)),y.renderMode!==void 0&&(a.renderMode=y.renderMode),y.eyeTracking!==void 0&&(a.eyeTracking=y.eyeTracking),y.showCaptions!==void 0&&(a.showCaptions=y.showCaptions),y.chatEnabled!==void 0&&(a.chatEnabled=y.chatEnabled,We.style.display=a.chatEnabled?"":"none",a.chatEnabled||(te.end(),S.classList.remove("open"),h.classList.remove("chat-is-open"))),y.avatar&&(a.avatar={...a.avatar,...y.avatar},Lt()),y.allowVisitorCustomization!==void 0&&(a.allowVisitorCustomization=y.allowVisitorCustomization===!0),se&&!a.sessionId&&(J=_a(a),oe=null),(se||y.avatar||y.allowVisitorCustomization!==void 0)&&rt(),y.voice)if(Z)try{a.voice=Z.configure(y.voice)}catch{}else if(typeof y.voice=="string"||y.voice.preset)a.voice=y.voice;else{let ie=typeof a.voice=="string"?{preset:a.voice}:a.voice;a.voice={...ie,...y.voice}}if(y.persona!==void 0&&(a.persona=$t(y.persona),_e.setPersona(a.persona),Gt(G,r())),y.baseBrain!==void 0&&!!y.baseBrain!=(a.baseBrain!==!1)){a.baseBrain=!!y.baseBrain;try{_e.loadBaseXML(a.baseBrain?mo:"")}catch{}}if(he)try{_e.setBotProps(Je())}catch{}if(y.aimlXml!==void 0&&y.aimlXml!==a.aimlXml){te.end(),a.aimlXml=y.aimlXml;try{_e.loadXML(a.aimlXml),Q(ue())}catch{}}Ht()},destroy(){if(fe=!0,te.end(),cancelAnimationFrame(Ne),ma?.disconnect(),g?.dispose(),D(),window.removeEventListener("pointermove",Ke),tt&&tt.disconnect(),Z)try{Z.free()}catch{}n.remove()}}}var Ls=new TextEncoder,ks=new TextDecoder;function Vr(e){var L,F,U,z,B,De,go,Oo,Ao;if(!e||!e.memory||typeof e.tts_new!="function")throw new Error("Invalid TTS WebAssembly exports object");let t=v=>{let T=Ls.encode(String(v));if(T.length===0)return[0,0];let M=e.tts_alloc(T.length);return new Uint8Array(e.memory.buffer,M,T.length).set(T),[M,T.length]},a=()=>{let v=e.tts_json_len();if(!v)return"";let T=e.tts_json_ptr();return ks.decode(new Uint8Array(e.memory.buffer,T,v))},r=()=>JSON.parse(a()),n=(v,T)=>{let M=T();if(!M)return new Float32Array(0);let R=v();return new Float32Array(e.memory.buffer,R,M).slice()},s=()=>{let v=e.tts_bytes_len();if(!v)return new Uint8Array(0);let T=e.tts_bytes_ptr();return new Uint8Array(e.memory.buffer,T,v).slice()},l=v=>JSON.stringify(v,(T,M)=>typeof M=="number"&&!Number.isFinite(M)?"__TTS_NONFINITE__":M);e.tts_meta_json();let i=r(),c=null,p=((Date.now?Date.now():123456789)^1597463007)>>>0,h=()=>{if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function"){let v=new Uint32Array(1);return crypto.getRandomValues(v),v[0]>>>0}return p=Math.imul(p,1664525)+1013904223>>>0,p},o=()=>{let v=r(),T={samples:n(e.tts_samples_ptr,e.tts_samples_len),sampleRate:v.sampleRate,duration:v.duration,text:v.text,ipa:v.ipa,words:v.words,phones:v.phones,visemes:n(e.tts_visemes_ptr,e.tts_visemes_len),visemeRate:i.visemeRate,visemeFields:i.visemeFields.slice(),acoustics:n(e.tts_acoustics_ptr,e.tts_acoustics_len),acousticFields:i.acousticFields.slice()};return v.segments&&(T.segments=v.segments),T},I=async(v,T)=>{let M=T?null:globalThis.AudioContext||globalThis.webkitAudioContext,R=T||(c??(c=M?new M:null));if(!R)throw new Error("Web Audio API (AudioContext) is not available in this environment");if(R.state==="suspended"&&await R.resume(),!v||!v.samples||v.samples.length===0)return{speech:v,stop(){},done:Promise.resolve(v)};let k=R.createBuffer(1,v.samples.length,v.sampleRate);k.copyToChannel(v.samples,0);let j=R.createBufferSource();j.buffer=k,j.connect(R.destination);let oe=new Promise(J=>{j.onended=()=>J(v)});return j.start(),{speech:v,source:j,stop(){try{j.stop()}catch{}},done:oe}},g=typeof FinalizationRegistry<"u"?new FinalizationRegistry(v=>{v>0&&e.tts_drop(v)}):null,H=typeof FinalizationRegistry<"u"?new FinalizationRegistry(v=>{v>0&&e.tts_stream_drop(v)}):null;class N{constructor(T,M,R){Wt(this,L);Wt(this,F);Wt(this,U);Dt(this,L,T),Dt(this,F,M),Dt(this,U,R),H&&H.register(this,T,this)}read(T=4800){if(!Ge(this,L))return new Float32Array(0);if(e.tts_stream_read(Ge(this,L),Math.max(0,Math.floor(Number(T)||0)))<0)throw new Error(a());return n(e.tts_samples_ptr,e.tts_samples_len)}get done(){return!Ge(this,L)||e.tts_stream_done(Ge(this,L))!==0}get duration(){return Ge(this,F).duration}get position(){return Ge(this,L)?e.tts_stream_position(Ge(this,L)):Ge(this,F).duration}get sampleRate(){return Ge(this,F).sampleRate}get text(){return Ge(this,F).text}get ipa(){return Ge(this,F).ipa}get words(){return Ge(this,F).words.map(T=>({...T}))}get visemes(){return Ge(this,U).slice()}free(){Ge(this,L)&&(H&&H.unregister(this),e.tts_stream_drop(Ge(this,L)),Dt(this,L,0))}}L=new WeakMap,F=new WeakMap,U=new WeakMap;class f{constructor(T){Wt(this,B);Wt(this,z);let M=0,R=0;T!=null&&([M,R]=t(l(T)));let k=e.tts_new(M,R);if(k<0)throw new Error(a());Dt(this,z,k),g&&g.register(this,k,this)}static presets(){return structuredClone(i.presets)}static vowelNames(){return i.vowelNames.slice()}static toneBandsHz(){return Float64Array.from(i.toneBandsHz)}static voiceIds(){return i.voiceIds.slice()}static styleNames(){return i.styleNames.slice()}static sounds(){return structuredClone(i.sounds)}static soundNames(){return i.sounds.map(T=>T.id)}static noteToHz(T){let[M,R]=t(String(T)),k=e.tts_note_to_hz(M,R);if(k<0)throw new Error(a());return k}static randomVoice(T){let M=T&&typeof T=="object"&&Number.isFinite(T.seed)?Math.abs(Math.trunc(T.seed))>>>0:h(),R=0,k=0;if(T!=null&&([R,k]=t(l(T))),e.tts_random_voice(M,R,k)<0)throw new Error(a());return r()}configure(T){let M=W(this,B,De).call(this);if(T==null)return this.settings;let[R,k]=t(l(T));if(e.tts_configure(M,R,k)<0)throw new Error(a());return r()}randomize(T){let M=W(this,B,De).call(this),R=T&&typeof T=="object"&&Number.isFinite(T.seed)?Math.abs(Math.trunc(T.seed))>>>0:h(),k=0,j=0;if(T!=null&&([k,j]=t(l(T))),e.tts_randomize(M,R,k,j)<0)throw new Error(a());return r()}registerVoice(T,M){let R=W(this,B,De).call(this);if(typeof T!="string"||!T.trim())throw new Error("voice name must be a non-empty string");let k=l({name:T,voice:M===void 0?this.settings:M}),[j,oe]=t(k);if(e.tts_register_voice(R,j,oe)<0)throw new Error(a());return r()}voices(){let T=W(this,B,De).call(this);if(e.tts_list_voices(T)<0)throw new Error(a());return r()}setGender(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_set_gender(M,R,k)<0)throw new Error(a())}get gender(){return this.settings.gender}get settings(){let T=W(this,B,De).call(this);if(e.tts_get_settings(T)<0)throw new Error(a());return r()}get sampleRate(){return i.sampleRate}speak(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_speak(M,R,k)<0)throw new Error(a());return o()}speakWav(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_speak_wav(M,R,k)<0)throw new Error(a());return s()}speakScript(T){let M=W(this,B,De).call(this),R=typeof T=="string"?T:Array.isArray(T)?l({__cues:T}):null;if(R===null)throw new Error("speakScript expects a script string or an array of cue objects");let[k,j]=t(R);if(e.tts_speak_script(M,k,j)<0)throw new Error(a());return o()}speakScriptWav(T){let M=W(this,B,De).call(this),R=typeof T=="string"?T:Array.isArray(T)?l({__cues:T}):null;if(R===null)throw new Error("speakScriptWav expects a script string or an array of cue objects");let[k,j]=t(R);if(e.tts_speak_script_wav(M,k,j)<0)throw new Error(a());return s()}sound(T,M){return this.speakScript(W(this,B,go).call(this,T,M))}soundWav(T,M){return this.speakScriptWav(W(this,B,go).call(this,T,M))}sing(T,M,R){let k=W(this,B,De).call(this),[j,oe]=t(W(this,B,Oo).call(this,T,M,R));if(e.tts_sing(k,j,oe)<0)throw new Error(a());return o()}singWav(T,M,R){let k=W(this,B,De).call(this),[j,oe]=t(W(this,B,Oo).call(this,T,M,R));if(e.tts_sing_wav(k,j,oe)<0)throw new Error(a());return s()}singChorus(T){let M=W(this,B,De).call(this),[R,k]=t(W(this,B,Ao).call(this,T));if(e.tts_sing_chorus(M,R,k)<0)throw new Error(a());return o()}singChorusWav(T){let M=W(this,B,De).call(this),[R,k]=t(W(this,B,Ao).call(this,T));if(e.tts_sing_chorus_wav(M,R,k)<0)throw new Error(a());return s()}async play(T,M){let R=/\[[a-zA-Z_/]/.test(String(T))?this.speakScript(String(T)):this.speak(String(T));return I(R,M)}async playScript(T,M){return I(this.speakScript(T),M)}async playSound(T,M,R){return I(this.sound(T,M),R)}async playSong(T,M,R,k){return I(this.sing(T,M,R),k)}async playChorus(T,M){return I(this.singChorus(T),M)}stream(T){let M=W(this,B,De).call(this),[R,k]=t(String(T)),j=e.tts_stream_new(M,R,k);if(j<0)throw new Error(a());let oe=r(),J=n(e.tts_visemes_ptr,e.tts_visemes_len);return new N(j,oe,J)}phonemize(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_phonemize(M,R,k)<0)throw new Error(a());return a()}arpabet(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_arpabet(M,R,k)<0)throw new Error(a());return a()}normalize(T){let M=W(this,B,De).call(this),[R,k]=t(String(T));if(e.tts_normalize(M,R,k)<0)throw new Error(a());return a()}addWord(T,M){let R=W(this,B,De).call(this),[k,j]=t(`${T}	${M}`);if(e.tts_add_word(R,k,j)<0)throw new Error(a())}loadDictionary(T){let M=W(this,B,De).call(this),[R,k]=t(String(T)),j=e.tts_load_dictionary(M,R,k);if(j<0)throw new Error(a());return j}free(){Ge(this,z)&&(g&&g.unregister(this),e.tts_drop(Ge(this,z)),Dt(this,z,0))}}z=new WeakMap,B=new WeakSet,De=function(){if(!Ge(this,z))throw new Error("TTS instance has been freed");return Ge(this,z)},go=function(T,M){if(typeof T!="string"||!T.trim())throw new Error('sound expects the name of a vocal sound, e.g. "laugh"');let R={sound:T};return M&&typeof M=="object"&&(M.intensity!==void 0&&(R.intensity=M.intensity),M.length!==void 0&&(R.length=M.length),M.durationMs!==void 0&&(R.durationMs=M.durationMs)),[R]},Oo=function(T,M,R){if(typeof T=="string"){if(M===void 0&&R===void 0)return T;let k={notes:T};return M!==void 0&&String(M).trim()!==""?k.lyrics=String(M):(delete k.notes,k.score=T),R!==void 0&&(k.bpm=R),l(k)}if(T&&typeof T=="object"&&!Array.isArray(T)){let k={...T};return M!==void 0&&k.lyrics===void 0&&(k.lyrics=M),R!==void 0&&k.bpm===void 0&&(k.bpm=R),l(k)}throw new Error("sing expects a score string or an options object { bpm, notes, lyrics, \u2026 }")},Ao=function(T){if(typeof T=="string")return T;if(Array.isArray(T))return l({parts:T});if(T&&typeof T=="object")return l(T);throw new Error("singChorus expects a chorus score string or `{ bpm, parts: [...] }`")};function S(v,T=i.sampleRate){let M=v instanceof Float32Array?v:Float32Array.from(v||[]),R=M.length?e.tts_alloc_f32(M.length):0;return M.length&&new Float32Array(e.memory.buffer,R,M.length).set(M),e.tts_encode_wav(R,M.length,Math.max(1e3,Math.floor(Number(T)||i.sampleRate))),s()}return{TTS:f,SpeechStream:N,encodeWav:S}}var qr="1.5.0";var Ya=typeof document>"u"?null:document.currentScript,To=globalThis.__BOT_COMPUTER_AUTO_CONFIG__,jr=globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;To&&delete globalThis.__BOT_COMPUTER_AUTO_CONFIG__;jr&&delete globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;var ua={version:qr,mount(e={}){let t=e.wasmUrl||(Ya?.src?new URL("../vendor/tts/tts.wasm",Ya.src).href:"./tts.wasm");return Fr({...e,wasmUrl:t},{bindTTSFn:Vr,embeddedWasmGzBase64:jr})}},$r=globalThis.BotComputer?.runtimes||Object.create(null);ua.runtimes=$r;$r["bot-2d-voice-chat.js"]=ua;globalThis.BotComputer||(globalThis.BotComputer=ua);function zr(){if(To)return ua.mount(To);if(!Ya)return;let e=Ya.dataset;if(e.nomount==="true"||e.manual==="true"||!["config","name","aiml","wasm","autostart","customize","renderMode","speech","chat"].some(a=>e[a]!==void 0))return;let t={};if(e.config)try{t=JSON.parse(e.config)}catch(a){console.warn("[bot.computer] Invalid JSON in data-config:",a)}for(let a of["name","role","company","greeting","position","size","renderMode"])e[a]&&(t[a]=e[a]);return e.wasm&&(t.wasmUrl=e.wasm),e.aiml&&(t.aimlUrl=e.aiml),e.customize!==void 0&&(t.allowVisitorCustomization=e.customize==="true"),e.chat!==void 0&&(t.chatEnabled=e.chat!=="false"),e.speech!==void 0&&(t.speechEnabled=e.speech!=="false"),e.autogreet!==void 0&&(t.autoGreet=e.autogreet==="true"),ua.mount(t)}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",zr,{once:!0}):zr());})();
