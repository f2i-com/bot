/*! bot.computer | Copyright 2026 f2i.com | Apache-2.0 | https://github.com/f2i-com/bot/blob/main/THIRD-PARTY-NOTICES.md */
(()=>{var _r=Object.defineProperty;var zn=e=>{throw TypeError(e)};var Kr=(e,t,a)=>t in e?_r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var ka=(e,t,a)=>Kr(e,typeof t!="symbol"?t+"":t,a),Fr=(e,t,a)=>t.has(e)||zn("Cannot "+a);var qn=(e,t,a)=>t.has(e)?zn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a);var $=(e,t,a)=>(Fr(e,t,"access private method"),a);var it=Math.PI*2,Vo=[{id:"rest",label:"Rest",duration:0},{id:"wave",label:"Wave",duration:3.6},{id:"walk",label:"Walk",duration:1.16},{id:"dance",label:"Dance",duration:2.18},{id:"stretch",label:"Stretch",duration:5.6},{id:"squat",label:"Squat",duration:3.4}],qa=Object.fromEntries(Vo.map(({id:e,duration:t})=>[e,t]));function ja(e,t){let a=e%t/t;return a<0?a+1:a}var Et=(e,t,a=2)=>Math.max(0,Math.cos(it*(e-t)))**a;function Vr(e){let t=ja(e,qa.wave),a=1-.57*Et(t,.79,5),s=a*Math.sin(it*3*t),n=a*Math.cos(it*3*t);return{rightArmLift:22+60*a+8*s,rightShoulder:5+8*a+4*n,rightArmRoll:26+57*a-11*s,rightElbow:31+53*a+14*s,rightWristBend:13*n,rightWristTurn:35*a+9*s,leftArmLift:5+3*a,leftShoulder:-4+2*Math.cos(it*t),leftElbow:8+4*a,torsoTurn:-4*a+1.7*s,torsoLean:-3.4*a,headTurn:8*a-2.5*s,headTilt:4*a,headNod:3.5*Et(t,.8),rootY:.014*Math.sin(it*t)}}function zr(e){let t=ja(e,qa.walk),a=Math.cos(it*t),s=Math.sin(it*t),n=l=>4+12*Et(l,.105,4)+52*Et(l,.66,2.5),r=l=>3+24*Math.cos(it*l),i=l=>{let p=-10*Et(l,.01,3)+27*Et(l,.5,3)-7*Et(l,.83,5);return Math.min(43,Math.max(-31,n(l)-r(l)-p))};return{leftHip:r(t),rightHip:r(t+.5),leftKnee:n(t),rightKnee:n(t+.5),leftAnkleFlex:i(t),rightAnkleFlex:i(t+.5),leftShoulder:-18*a-3*s,rightShoulder:18*a+3*s,leftArmLift:4,rightArmLift:4,leftElbow:15-7*a,rightElbow:15+7*a,torsoTurn:5.8*a,torsoPitch:3.2+1.3*Math.cos(2*it*t),headTurn:-3.1*a,headNod:-2-1.6*Math.cos(2*it*t),torsoLean:-1.9*s,rootSway:.048*s,groundFeet:1}}function qr(e){let t=ja(e,qa.dance),a=Math.sin(it*t),s=Math.cos(it*t),n=.5+.5*Math.cos(2*it*t-.32),r=Math.sin(it*t-.19),i=Math.sin(it*t-.68);return{leftArmLift:43+32*r,rightArmLift:43-32*r,leftShoulder:14-18*s,rightShoulder:14+18*s,leftArmRoll:31+26*r,rightArmRoll:31-26*r,leftElbow:51+31*i,rightElbow:51-31*i,leftHip:9+12*a+5*n,rightHip:9-12*a+5*n,leftHipOut:4+16*Et(t,.25),rightHipOut:4+16*Et(t,.75),leftKnee:8+14*n+22*Et(t,.24),rightKnee:8+14*n+22*Et(t,.74),torsoTurn:13*s,torsoLean:6.7*a,torsoPitch:2+4*n,headTurn:-9*s+3*Math.sin(2*it*t),headTilt:-4*a,headNod:-2+6*n,leftHipTwist:9*Et(t,.25,3),rightHipTwist:9*Et(t,.75,3),leftAnkleFlex:4+9*n-10*Et(t,.25,3),rightAnkleFlex:4+9*n-10*Et(t,.75,3),rootSway:-.17*a,groundFeet:1}}function jr(e){let t=ja(e,qa.stretch),a=Math.sin(it*t+.92),s=.5+.5*a,n=1-s;return{leftArmLift:24+132*s,rightArmLift:24+132*n,leftElbow:50-43*s,rightElbow:50-43*n,leftArmRoll:28+34*s,rightArmRoll:28+34*n,leftShoulder:9-12*s,rightShoulder:9-12*n,leftWristBend:9-16*s,rightWristBend:9-16*n,torsoLean:14*a,torsoPitch:-4,headNod:-9-4*a*a,headTilt:-7*a,headTurn:12*a}}function $r(e){let t=ja(e,qa.squat),a=.5+.5*Math.cos(it*t),s=a*a*(3-2*a),n=5+69*s,r=8+91*s;return{leftHip:n,rightHip:n,leftKnee:r,rightKnee:r,leftAnkleFlex:r-n,rightAnkleFlex:r-n,plantFeet:1,torsoPitch:3+23*s,headNod:-2-19*s,leftShoulder:4+62*s,rightShoulder:4+62*s,leftArmLift:4+6*s,rightArmLift:4+6*s,leftElbow:9+12*s,rightElbow:9+12*s}}function zo(e,t=0){let a=Number.isFinite(t)?t:0;switch(e){case"wave":return Vr(a);case"walk":return zr(a);case"dance":return qr(a);case"stretch":return jr(a);case"squat":return $r(a);default:return{}}}var qo=Vo.filter(({duration:e})=>e>0),Xr={walk:4,dance:2},$n=new Map(qo.map(({id:e,duration:t})=>[e,Math.round(t*(Xr[e]||1)*1e3)])),jo=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)"),Jr=Math.PI*2;function $o(e){return $n.get(e)||0}function jn(e){let t=Math.max(0,Math.min(e,1));return t*t*(3-2*t)}function Xn(e,t,a,s){if(!$n.has(t))return;let n=Jn(e,a);e.bodyMotion={id:t,start:a,end:a+s,from:n}}function Jn(e,t,a=jo?.matches){let s=e?.bodyMotion;if(!s||t<s.start||t>=s.end)return null;let n=t-s.start,r=s.end-t,i=zo(s.id,a?.2:n/1e3);if(a)return i;let l=jn(n/180),p=jn(r/240);for(let h of Object.keys(i))i[h]*=p;if(s.id==="walk"){let h=n/(s.end-s.start),c=Jr*h;i.rootX=.56*(1-Math.cos(c)),i.rootZ=.56*Math.sin(c),i.rootYaw=360*h}if(l<1){let h=s.from||{};for(let c of new Set([...Object.keys(h),...Object.keys(i)])){let o=h[c]||0,u=(i[c]||0)-o;c==="rootYaw"&&(u-=360*Math.round(u/360)),i[c]=o+u*l}}return i}function Xo(e,t,a=jo?.matches){let s=e.guideTravel;if(s){let r=zo("walk",a?.2:s.elapsed*1.28);for(let i of Object.keys(r))r[i]*=s.stride;return r.rootYaw=s.facing*(68-44*s.point),r}let n=Jn(e,t,a);return!e.tourPointing||!e.guideDirection?n:{...n,rootX:0,rootZ:0,rootYaw:24*e.guideDirection.x}}function Jo(e,t){let a=e.guideDirection;if(!a)return null;let s=e.tourPointing||e.guideTravel;if(!s&&(t||["thumbsup","think","shrug"].includes(e.emote)))return null;let n=Math.atan2(-a.y,Math.abs(a.x));return{side:a.x<0?-1:1,elevation:Math.max(s?-1.5:-.95,Math.min(s?1.5:1.12,n)),weight:e.guideTravel?.point??1}}function Qo(e){let t=e?.x||0;return Math.sign(t)*Math.min(1,Math.max(0,(Math.abs(t)-.25)/.6))}function Qn(e,t,{reducedMotion:a=jo?.matches,framing:s}={}){let n=Xo(e,t,a),r=n||{};if(r.rootX!==void 0){let d=s==="bust"||s==="portrait"?.22:s==="half"?.65:1;r.rootX*=d,r.rootZ*=d}let i=e.x||{},l=t/1e3,p=!a&&e.idleLife!==!1?Math.sin(l*1.9):0,h=a?1:Math.sin(l*11),c=a?1:Math.sin(l*13),o=a?0:Math.abs(Math.sin(l*15));r.headTurn=(r.headTurn||0)+e.lookX*10+i.shake*c*18,r.headTilt=(r.headTilt||0)+i.tilt*11,r.headNod=(r.headNod||0)+e.lookY*6+i.nod*h*9+i.bow*7+e.energy*2,r.torsoPitch=(r.torsoPitch||0)+i.bow*22,r.rootY=(r.rootY||0)+p*.012+i.bounce*o*.055;for(let d of["left","right"])r[d+"ArmLift"]=(r[d+"ArmLift"]||0)+i.shrug*30,r[d+"Elbow"]=(r[d+"Elbow"]||0)+i.shrug*60;r.thumbUp=i.thumbUp,r.rightShoulder=(r.rightShoulder||0)+i.thumbUp*32+i.think*40,r.rightElbow+=i.thumbUp*92+i.think*120,r.rightArmRoll=(r.rightArmRoll||0)-i.think*30,r.rightWristTurn=(r.rightWristTurn||0)+i.thumbUp*18;let u=Jo(e,n);if(u){let d=u.side>0?"left":"right",m=!!(e.tourPointing||e.guideTravel);if(m&&d==="right"&&(e.bodyMotion?.id==="wave"||i.thumbUp||i.think)){for(let E of["ArmLift","Shoulder","Elbow","ArmRoll","WristTurn","WristBend"])r["left"+E]=r["right"+E]||0;r.leftThumbUp=r.thumbUp,r.thumbUp=0}let g=u.elevation*180/Math.PI,f={ArmLift:(m?80:78)+g,Elbow:m?10:26,Shoulder:m?8:15,WristTurn:m?32:50,WristBend:m?-24:0,ArmRoll:0};for(let[E,T]of Object.entries(f)){let b=r[d+E]||0;r[d+E]=b+(T-b)*u.weight}m&&(r[d+"Point"]=u.weight)}return{pose:r,movementSpace:!!(n&&!e.guideTravel&&!e.tourPointing),presenting:!!e.guideDirection,pointingPan:Qo(e.guideDirection)}}var es=[{id:"side_sweep",label:"Studio Side-Sweep"},{id:"long_waves",label:"Long Flowing Waves"},{id:"sleek_bob",label:"Sleek Concierge Bob"},{id:"quiff",label:"Textured Quiff"},{id:"curly_halo",label:"Curly Crown"},{id:"pixie",label:"Modern Pixie Crop"},{id:"updo_bun",label:"Poised High Bun"},{id:"shoulder_lob",label:"Shoulder Lob"},{id:"long_straight",label:"Long & Straight"},{id:"ponytail",label:"Ponytail"},{id:"afro",label:"Afro"},{id:"braids",label:"Twin Braids"},{id:"pigtails",label:"Pigtails"},{id:"space_buns",label:"Space Buns"},{id:"mohawk",label:"Mohawk"},{id:"buzz",label:"Clean Buzz Fade"},{id:"none",label:"Smooth / Bald"}],Zo=[{id:"blazer",label:"Concierge Blazer"},{id:"suit_tie",label:"Executive Suit & Tie"},{id:"sweater",label:"Studio Crewneck"},{id:"turtleneck",label:"Architect Turtleneck"},{id:"hoodie",label:"Startup Hoodie"},{id:"vest",label:"Support Vest & Shirt"},{id:"polo",label:"Polo Shirt"},{id:"scoop",label:"Scoop-Neck Top"},{id:"apron",label:"Barista Apron"},{id:"tee",label:"Graphic Tee"},{id:"shirt",label:"Button-Up Shirt"},{id:"cardigan",label:"Cozy Cardigan"},{id:"jacket",label:"Zip Jacket"},{id:"rugby_shirt",label:"Striped Rugby Shirt"},{id:"field_overshirt",label:"Field Overshirt"},{id:"track_jacket",label:"Track Jacket"},{id:"cyber",label:"Android Chassis"}],ts=[{id:"none",label:"None"},{id:"classic",label:"Studio Frames"},{id:"round",label:"Round Wire"},{id:"bold",label:"Bold Horn-Rim"},{id:"cat_eye",label:"Cat-Eye"},{id:"aviator",label:"Aviators"},{id:"shades",label:"Tinted Shades"},{id:"visor",label:"Holo Visor"}];var as=[{id:"none",label:"None"},{id:"beanie",label:"Beanie"},{id:"cap",label:"Cap"},{id:"headband",label:"Headband"},{id:"beret",label:"Beret"},{id:"headphones",label:"Headphones"},{id:"headscarf",label:"Headscarf"},{id:"bow",label:"Hair Bow"},{id:"flower",label:"Flower"},{id:"tiara",label:"Tiara"},{id:"fedora",label:"Fedora"},{id:"chef",label:"Chef's Hat"}];var tc=[{id:"wave",label:"Wave"},{id:"smile",label:"Smile"},{id:"wink",label:"Wink"},{id:"nod",label:"Nod"},{id:"shake",label:"Shake head"},{id:"laugh",label:"Laugh"},{id:"think",label:"Think"},{id:"surprised",label:"Surprised"},{id:"shrug",label:"Shrug"},{id:"thumbsup",label:"Thumbs up"},{id:"tilt",label:"Tilt head"},{id:"bow",label:"Bow"},...qo.filter(({id:e})=>e!=="wave").map(({id:e,label:t})=>({id:e,label:t})),{id:"rest",label:"Rest"}],fo={framing:"half",stageShape:"card",bgStyle:"studio_dark",bgColor:"#141b2d",bgAccent:"#2b6cb0",haloGlow:!0,bodyScale:1,headScale:1,neckLength:1,neckWidth:.95,shoulderWidth:.96,shoulderSlope:.08,chestWidth:.94,waistWidth:.8,hipWidth:.94,torsoLength:1,armThickness:.94,posture:"welcoming",genderStyle:"feminine",headWidth:.97,headHeight:1,cheekboneWidth:1.02,jawWidth:.9,chinLength:0,chinRoundness:.65,earSize:1,earStyle:"human",skinColor:"#f1c6b0",blushIntensity:.24,synthFinish:0,eyeSize:1.04,eyeSpacing:1,eyeTilt:.06,irisColor:"#3b82a6",lashStyle:"lush",browThickness:.92,browArch:.22,noseLength:1,noseWidth:.96,mouthWidth:.98,lipFullness:1.08,lipColor:"#d6687c",hairStyle:"long_waves",hairColor:"#3c2734",hairHighlight:"#7b546c",facialHair:"none",outfitStyle:"blazer",outfitPrimary:"#1e2f4d",outfitSecondary:"#f4f6fb",outfitAccent:"#38bdf8",glasses:"none",glassesColor:"#1f2430",headsetMic:!0,nameBadge:!0,restSmile:0,browMood:0,eyeOpen:0,freckles:0,eyeshadow:0,eyeshadowColor:"#7a5c8f",browColor:"",earrings:"none",earringColor:"#e6c35c",headwear:"none",headwearColor:"#b4452f",neckwear:"none",neckwearColor:"#d9a441",fringe:!1,ageLines:0,beautyMark:!1,dimples:0,eyeliner:0,noseStud:!1,irisColor2:"",brooch:"none",broochColor:"#e6c35c"};function le(e,t,a){return Math.max(t,Math.min(a,e))}function Je(e,t=[230,180,155]){let a=String(e||"").trim().replace(/^#/,"");if(a.length===3){let s=parseInt(a[0]+a[0],16),n=parseInt(a[1]+a[1],16),r=parseInt(a[2]+a[2],16);return Number.isFinite(s+n+r)?[s,n,r]:t}if(a.length>=6){let s=parseInt(a.slice(0,2),16),n=parseInt(a.slice(2,4),16),r=parseInt(a.slice(4,6),16);return Number.isFinite(s+n+r)?[s,n,r]:t}return t}function H([e,t,a],s=1){let n=le(Math.round(e),0,255),r=le(Math.round(t),0,255),i=le(Math.round(a),0,255);return s>=.999?`rgb(${n}, ${r}, ${i})`:`rgba(${n}, ${r}, ${i}, ${s.toFixed(3)})`}function se([e,t,a],s,n=0){return[e*s+n*14,t*s-Math.abs(n)*4,a*s-n*10]}function Ke(e,t,a){return[e[0]+(t[0]-e[0])*a,e[1]+(t[1]-e[1])*a,e[2]+(t[2]-e[2])*a]}function os(){return{jaw:.045,tH:.46,tF:.5,tTip:.16,lipR:.04,lipS:.08,lipC:.2,velum:0,energy:0,voicing:0,noise:0,f0:160,f1:500,f2:1500,f3:2500,pitchSt:0,phone:"",ipa:"",word:"",glotPhase:0,wavePhase:0,lastTickMs:0,blinkStartMs:-1e3,nextBlinkMs:1600,saccadeX:0,saccadeY:0,nextSaccadeMs:1100,lookX:0,lookY:0,emote:"",emoteUntilMs:0,bodyMotion:null,mood:"",idleLife:!0,nextIdleMs:0,x:Object.fromEntries(ns.map(e=>[e,0]))}}var ns=["smile","frown","browUp","browIn","eyeWide","mouthO","wink","nod","shake","tilt","bow","bounce","shrug","think","laugh","gazeX","gazeY","shut","thumbUp"],Qr=new Set(["browIn","eyeWide","tilt","gazeX","gazeY"]),mo={smile:{smile:.85,browUp:.3,eyeWide:-.12},wave:{smile:.75,browUp:.3},walk:{smile:.3},dance:{smile:.8,browUp:.25},stretch:{eyeWide:-.12},squat:{browIn:-.15},wink:{smile:.7,wink:1,tilt:.3},nod:{nod:1,smile:.3},shake:{shake:1,browIn:.25},laugh:{smile:1,eyeWide:-.6,browUp:.35,bounce:1,laugh:1},think:{think:1,browIn:-.3,tilt:-.7,gazeX:-.55,gazeY:-.55},surprised:{browUp:1,eyeWide:.9,mouthO:.75},shrug:{shrug:1,browUp:.7,tilt:.45,frown:.2},tilt:{tilt:1,smile:.3},bow:{bow:1,smile:.3},thumbsup:{smile:.8,browUp:.35,thumbUp:1},lookleft:{gazeX:-.95},lookright:{gazeX:.95},lookup:{gazeY:-.85,browUp:.3},lookdown:{gazeY:.85},chuckle:{smile:.8,eyeWide:-.35,browUp:.2,bounce:.45,laugh:.5},giggle:{smile:.9,eyeWide:-.5,tilt:.35,bounce:.7,laugh:.6},guffaw:{smile:1,shut:.7,browUp:.5,bounce:1,laugh:1},nervous:{smile:.4,browIn:.7,gazeX:.5,bounce:.3,laugh:.4},evil:{smile:.75,browIn:-.95,eyeWide:-.3,bounce:.45,laugh:.7,tilt:-.3},sigh:{browIn:.5,eyeWide:-.35,bow:.3,frown:.2},yawn:{shut:.85,browUp:.55,tilt:.3,mouthO:.9},sniff:{browIn:.6,frown:.3,eyeWide:-.2},pant:{bounce:.6,mouthO:.35,browIn:.3},phew:{browUp:.6,smile:.4,eyeWide:-.25},worried:{browIn:.85,eyeWide:.6,mouthO:.35},puzzled:{browUp:.7,tilt:.55,browIn:.3},aha:{browUp:.8,smile:.7,eyeWide:.3},ooh:{browUp:.7,mouthO:.6,eyeWide:.4},aww:{smile:.7,browIn:.6,tilt:.5,eyeWide:-.2},relief:{smile:.5,eyeWide:-.45,browUp:.2},disgust:{browIn:-.6,frown:.75,eyeWide:-.45,tilt:-.3},hum:{smile:.4,eyeWide:-.35,tilt:.35},groan:{frown:.6,browIn:.5,eyeWide:-.55,tilt:-.3},scream:{browUp:1,eyeWide:1,mouthO:1},cry:{browIn:.95,frown:.9,shut:.55,bow:.25},shush:{browUp:.35,eyeWide:.25,mouthO:.5},psst:{gazeX:-.6,tilt:-.35,browUp:.35},tsk:{shake:.55,browIn:-.45},kiss:{mouthO:.85,shut:.6,smile:.2},shiver:{bounce:.85,browIn:.5,shrug:.7},angry:{browIn:-1,frown:.5,eyeWide:-.3},raspberry:{shut:.5,mouthO:.4,tilt:.3},whistle:{mouthO:.7,browUp:.45},cough:{bow:.35,shut:.6,bounce:.3},hiccup:{bounce:.9,browUp:.6,eyeWide:.45},sneeze:{shut:1,bow:.55,browIn:.4},sleep:{shut:1,tilt:.5,bow:.2},idle_tilt_left:{tilt:-.42},idle_tilt_right:{tilt:.42,smile:.2},idle_smile:{smile:.5,browUp:.15},idle_brows:{browUp:.55},idle_glance_left:{gazeX:-.6,gazeY:-.1},idle_glance_right:{gazeX:.6,gazeY:-.1},happy:{smile:.7,browUp:.22},excited:{smile:.9,browUp:.65,eyeWide:.3},calm:{smile:.22,eyeWide:-.1},sad:{browIn:.9,frown:.85,eyeWide:-.2,bow:.15,gazeY:.3},serious:{browIn:-.75,eyeWide:-.12}},Zr={happy:"smile",grin:"smile",yes:"nod",no:"shake",cackle:"laugh",hoho:"laugh",snicker:"chuckle",hehe:"giggle",gasp:"surprised",hmm:"think",um:"think",uh:"think",mm:"relief",ahh:"relief",mhm:"nod","uh-huh":"nod","uh-uh":"shake","uh-oh":"worried",huh:"puzzled",oh:"ooh",ugh:"disgust",eww:"disgust",sob:"cry",whimper:"cry",shh:"shush",brr:"shiver",grr:"angry",fweet:"whistle",ahem:"cough",snore:"sleep"},ss={smile:1900,wink:750,nod:1e3,shake:1150,laugh:1700,think:2e3,surprised:1500,shrug:1500,tilt:1500,bow:1300,thumbsup:1900,lookleft:1300,lookright:1300,lookup:1300,lookdown:1300,sad:2400,serious:2e3,excited:1800,calm:1800},Zn=[["idle_tilt_left",1500],["idle_tilt_right",1500],["idle_smile",1700],["idle_brows",800],["idle_glance_left",1100],["idle_glance_right",1100]];function Oa(e,t,a,s=performance.now()){if(!e||!t)return;let n=String(t).toLowerCase(),r=Zr[n]||n;if(r==="rest"){e.bodyMotion=null,e.emote="",e.emoteUntilMs=s,e.nextIdleMs=0;return}if(r==="blink"){e.blinkStartMs=s;return}if(!Object.prototype.hasOwnProperty.call(mo,r))return;e.emote=r;let i=a>0?a:$o(r)||ss[r]||1800;e.emoteUntilMs=s+i,Xn(e,r,s,i)}function Aa(e,t){if(!e)return;let a=String(t||"").toLowerCase();e.mood=Object.prototype.hasOwnProperty.call(mo,a)?a:""}function rs(e,t,a=0){let s=e?.words||[],n=s.length,r=e?.duration||0,i=(t||[]).map(l=>{let p=l.word||0;a>0&&n>0&&a!==n&&(p=Math.round(p/a*n));let h=0;n>0&&p>0&&(h=p>=n?Math.max(0,r-.3):Math.max(0,s[p].start-.08));let c=l.sound&&p<n?s[p]:null;return c&&String(c.word).startsWith("[")?{...l,t:Math.max(0,c.start-.04),ms:Math.max(350,(c.end-c.start)*1e3+120)}:{...l,t:h}});return i.sort((l,p)=>l.t-p.t),{items:i,next:0}}function is(e,t=.34){let a=(e||[]).slice().sort((l,p)=>(l.word||0)-(p.word||0)),s=new Map,n=-1,r=0;return{items:a.map(l=>{let p=l.word||0;(p!==n||l.name==="rest")&&s.clear(),n=p;let h=p*t+(l.pauseMs||0)/1e3+r;if(l.type==="action"&&l.name!=="rest"){let c=$o(l.name),o=c?"body":l.name==="blink"?"eyes":"expression",u=s.get(o)||0;u>h&&(r+=u-h,h=u);let d=l.ms||c||ss[l.name]||(l.name==="blink"?145:1800);s.set(o,h+d/1e3)}return{...l,t:h}}),next:0}}function go(e,t,a,s=performance.now()){if(t)for(;t.next<t.items.length&&t.items[t.next].t<=a;){let n=t.items[t.next++];n.type==="mood"?Aa(e,n.name):Oa(e,n.name,n.ms,s)}}function ls(e,t,a=150){if(!e||!e.visemes||!e.visemes.length)return null;let s=e.visemeFields&&e.visemeFields.length||9,n=e.visemeRate||200,r=Math.floor(e.visemes.length/s);if(r<=0)return null;let i=le(t*n,0,r-1),l=Math.floor(i),p=Math.min(r-1,l+1),h=i-l,c=e.visemes,o=l*s,u=p*s,d=(g,f)=>g+(f-g)*h,m={jaw:d(c[o],c[u]),tH:d(c[o+1],c[u+1]),tF:d(c[o+2],c[u+2]),tTip:d(c[o+3],c[u+3]),lipR:d(c[o+4],c[u+4]),lipS:d(c[o+5],c[u+5]),lipC:d(c[o+6],c[u+6]),velum:d(c[o+7],c[u+7]),energy:d(c[o+8],c[u+8]),f0:a,f1:500,f2:1500,f3:2500,voicing:0,noise:0,phone:"",ipa:"",word:""};if(e.acoustics&&e.acoustics.length>=6){let g=e.acousticFields&&e.acousticFields.length||6,f=e.acoustics,E=l*g,T=p*g;T+5<f.length&&(m.f0=d(f[E],f[T]),m.f1=d(f[E+1],f[T+1]),m.f2=d(f[E+2],f[T+2]),m.f3=d(f[E+3],f[T+3]),m.voicing=d(f[E+4],f[T+4]),m.noise=d(f[E+5],f[T+5]))}else m.voicing=m.energy;if(e.phones)for(let g=0;g<e.phones.length;g++){let f=e.phones[g];if(t>=f.start&&t<f.end){m.phone=f.phone,m.ipa=f.ipa;break}}if(e.words)for(let g=0;g<e.words.length;g++){let f=e.words[g];if(t>=f.start&&t<f.end){m.word=f.word;break}}if(e.segments&&e.segments.length){let g=e.segments[0];for(let f=0;f<e.segments.length;f++){let E=e.segments[f];if(t>=E.start&&t<=E.end){g=E;break}t>=E.start&&(g=E)}m.segPitch=g.pitchHz}return m}function cs(e,t,a,s=null,n=160){let r=e.lastTickMs>0?Math.min(.05,(t-e.lastTickMs)/1e3):.016;if(e.lastTickMs=t,e.emote&&t>e.emoteUntilMs&&(e.emote=""),e.idleLife!==!1){if(a||e.emote&&!e.emote.startsWith("idle_")||!e.nextIdleMs)e.nextIdleMs=t+5e3+Math.random()*7e3;else if(!e.emote&&t>=e.nextIdleMs){let[_,V]=Zn[Math.floor(Math.random()*Zn.length)];e.emote=_,e.emoteUntilMs=t+V,e.nextIdleMs=t+V+6e3+Math.random()*9e3}}else e.nextIdleMs=0,e.emote.startsWith("idle_")&&(e.emote="");let i=e.emote?mo[e.emote]:null,l=e.mood?mo[e.mood]:null,p=e.x,h=1-Math.exp(-r*13);for(let _ of ns){let V=0;i&&i[_]!==void 0?V=i[_]:l&&l[_]!==void 0&&(V=l[_]*.7),p[_]+=(V-p[_])*h,!Qr.has(_)&&p[_]<5e-4&&(p[_]=0)}let c=.5+.5*Math.sin(t*.0019),o=.09+p.smile*.3,u=p.laugh*(.2+.14*Math.abs(Math.sin(t*.019))),d=a||{jaw:.038+.012*c+p.mouthO*.3+u,tH:.46,tF:.5,tTip:.16,lipR:.03+p.mouthO*.5,lipS:o,lipC:.22*(1-Math.max(p.mouthO,p.laugh)),velum:0,energy:0,voicing:0,noise:0,f0:n,f1:500,f2:1500,f3:2500,phone:"",ipa:"",word:""},m=1-Math.exp(-r*(a?38:10)),g=1-Math.exp(-r*(a?22:7.5));e.jaw+=(d.jaw-e.jaw)*m,e.tH+=(d.tH-e.tH)*m,e.tF+=(d.tF-e.tF)*m,e.tTip+=(d.tTip-e.tTip)*m,e.lipR+=(d.lipR-e.lipR)*m,e.lipS+=(Math.max(d.lipS,p.smile*.3)-e.lipS)*m,e.lipC+=(d.lipC-e.lipC)*m,e.velum+=(d.velum-e.velum)*g,e.energy+=(d.energy-e.energy)*m,e.voicing+=(d.voicing-e.voicing)*m,e.noise+=(d.noise-e.noise)*m,e.f0+=(d.f0-e.f0)*g,e.f1+=(d.f1-e.f1)*g,e.f2+=(d.f2-e.f2)*g,e.f3+=(d.f3-e.f3)*g,e.phone=d.phone||"",e.ipa=d.ipa||"",e.word=d.word||"";let f=a?.segPitch||n||150,E=e.voicing>.12?12*Math.log2(Math.max(50,e.f0)/Math.max(50,f)):0;e.pitchSt+=(le(E,-6,9)-e.pitchSt)*g,e.glotPhase=(e.glotPhase+r*(6+e.f0*.055))%1,e.wavePhase=(e.wavePhase+r*(1.7+e.energy*1.4))%1,t>=e.nextBlinkMs&&(e.blinkStartMs=t,e.nextBlinkMs=t+2500+Math.random()*3100),t>=e.nextSaccadeMs&&(e.saccadeX=(Math.random()-.5)*.24,e.saccadeY=(Math.random()-.5)*.16,e.nextSaccadeMs=t+1200+Math.random()*2200);let T=e.saccadeX,b=e.saccadeY;s&&s.active&&(T=le(s.nx,-1,1)*.92+e.saccadeX*.22,b=le(s.ny,-1,1)*.85+e.saccadeY*.22);let N=Math.min(1,Math.abs(p.gazeX)+Math.abs(p.gazeY));N>.02&&(T+=(p.gazeX-T)*N,b+=(p.gazeY-b)*N);let k=1-Math.exp(-r*8.5);e.lookX+=(T-e.lookX)*k,e.lookY+=(b-e.lookY)*k}function hs(e,t,a){let s=a.framing||"half",n=240,r=240,i=18;if(s==="bust")n=205,r=210,i=6;else if(s==="half"){n=265,r=290;let o=(a.headHeight??1)*(a.headScale??1),u=["quiff","updo_bun","space_buns","mohawk","afro","curly_halo"].includes(a.hairStyle);i=a.headwear&&a.headwear!=="none"||u?46:46+le(17-(o-1)*90,0,22)}else n=290,r=340,i=68;let l=le(Number(a.bodyScale)||1,.78,1.24),p=Math.min(e/n,t/r)*l,h=e*.5,c=t*.5-i*p+(s==="bust"?10*p:8*p);return{cx:h,cy:c,scale:p,framing:s}}function ps(e){let t=e.genderStyle==="feminine",a=e.genderStyle==="masculine",s=le(Number(e.headScale)||1,.82,1.25),n=(t?50.5:a?54:52.2)*le(e.headWidth??1,.76,1.28)*s,r=66*le(e.headHeight??1,.82,1.22)*s,i=n*le(e.cheekboneWidth??1,.82,1.24),l=(t?36.5:a?43.5:40)*le(e.jawWidth??1,.7,1.32)*s,p=(55+(e.chinLength??0)*22)*s,h=(t?16.8:a?21.5:19)*le(e.neckWidth??1,.68,1.38),c=34*le(e.neckLength??1,.72,1.4),o=44+c,u=(t?68:a?82:75)*le(e.shoulderWidth??1,.68,1.45),d=13+le(e.shoulderSlope??.08,-.4,.5)*24,m=128*le(e.torsoLength??1,.78,1.32),g=(t?52:a?62:57)*le(e.chestWidth??1,.68,1.42),f=(t?41:a?53:47)*le(e.waistWidth??1,.55,1.42),E=(t?55:a?56:55)*le(e.hipWidth??1,.68,1.42),T=(t?14.5:a?18:16.2)*le(e.armThickness??1,.68,1.45);return{isFem:t,isMasc:a,headScale:s,headW:n,headH:r,cheekW:i,jawW:l,chinBaseY:p,neckHalfW:h,neckLen:c,shoulderY:o,shoulderHalfW:u,shoulderDrop:d,torsoLen:m,chestHalfW:g,waistHalfW:f,hipHalfW:E,armThick:T}}function xr(e,t,a){let{cx:s,cy:n,scale:r}=hs(e,t,a),i=ps(a),l=(h,c)=>({x:s+h*r,y:n+c*r}),p=[{id:"crown",label:"Head Height",...l(0,-i.headH-6),axis:"y",apply(h,c,o){return{headHeight:le((o.headHeight??1)-c/r*.009,.82,1.22)}}},{id:"temple",label:"Head Width",...l(i.headW+4,-18*i.headScale),axis:"x",mirrorX:s-(i.headW+4)*r,apply(h,c,o){return{headWidth:le((o.headWidth??1)+h/r*.012,.78,1.25)}}},{id:"jaw",label:"Jaw Width",...l(i.jawW+3,34*i.headScale),axis:"x",mirrorX:s-(i.jawW+3)*r,apply(h,c,o){return{jawWidth:le((o.jawWidth??1)+h/r*.014,.72,1.28)}}},{id:"chin",label:"Chin Length & Shape",...l(0,i.chinBaseY+4),axis:"xy",apply(h,c,o){return{chinLength:le((o.chinLength??0)+c/r*.018,-.35,.45),chinRoundness:le((o.chinRoundness??.65)+h/r*.015,.05,1)}}},{id:"eyes",label:"Eye Spacing & Size",...l(22*(a.eyeSpacing??1)*i.headScale+10,-12*i.headScale),axis:"xy",apply(h,c,o){return{eyeSpacing:le((o.eyeSpacing??1)+h/r*.016,.8,1.24),eyeSize:le((o.eyeSize??1)-c/r*.018,.75,1.38)}}},{id:"mouth",label:"Mouth Width & Lips",...l(21*(a.mouthWidth??1)*i.headScale+4,31*i.headScale),axis:"xy",apply(h,c,o){return{mouthWidth:le((o.mouthWidth??1)+h/r*.018,.76,1.3),lipFullness:le((o.lipFullness??1)+c/r*.022,.65,1.5)}}},{id:"neck",label:"Neck Width & Length",...l(i.neckHalfW+3,44+i.neckLen*.48),axis:"xy",mirrorX:s-(i.neckHalfW+3)*r,apply(h,c,o){return{neckWidth:le((o.neckWidth??1)+h/r*.018,.7,1.35),neckLength:le((o.neckLength??1)+c/r*.015,.75,1.35)}}},{id:"shoulder",label:"Shoulders (Width & Slope)",...l(i.shoulderHalfW,i.shoulderY+i.shoulderDrop),axis:"xy",mirrorX:s-i.shoulderHalfW*r,apply(h,c,o){return{shoulderWidth:le((o.shoulderWidth??1)+h/r*.01,.7,1.42),shoulderSlope:le((o.shoulderSlope??.08)+c/r*.014,-.35,.45)}}}];return p.push({id:"brow",label:"Brow Arch & Thickness",...l(-(21.5*(a.eyeSpacing??1)*i.headScale+6),-(27+(a.browArch??.2)*9)*i.headScale),axis:"xy",apply(h,c,o){return{browArch:le((o.browArch??.2)-c/r*.03,-.2,.55),browThickness:le((o.browThickness??1)-h/r*.03,.5,1.6)}}},{id:"nose",label:"Nose Length & Width",...l(-9.5*(a.noseWidth??1)*i.headScale,10.2*(a.noseLength??1)*i.headScale),axis:"xy",apply(h,c,o){return{noseWidth:le((o.noseWidth??1)-h/r*.03,.74,1.32),noseLength:le((o.noseLength??1)+c/r*.03,.78,1.26)}}}),a.framing!=="bust"&&p.push({id:"hips",label:"Hip Width",...l(i.hipHalfW,i.shoulderY+i.torsoLen*1.06),axis:"x",mirrorX:s-i.hipHalfW*r,apply(h,c,o){return{hipWidth:le((o.hipWidth??1)+h/r*.013,.7,1.38)}}},{id:"chest",label:"Chest / Bust Width",...l(i.chestHalfW,i.shoulderY+i.torsoLen*.34),axis:"x",mirrorX:s-i.chestHalfW*r,apply(h,c,o){return{chestWidth:le((o.chestWidth??1)+h/r*.012,.7,1.38)}}},{id:"waist",label:"Waist Taper & Torso Length",...l(i.waistHalfW,i.shoulderY+i.torsoLen*.7),axis:"xy",mirrorX:s-i.waistHalfW*r,apply(h,c,o){return{waistWidth:le((o.waistWidth??1)+h/r*.013,.58,1.38),torsoLength:le((o.torsoLength??1)+c/r*.008,.8,1.28)}}},{id:"arm",label:"Arm Build",...l(i.shoulderHalfW+i.armThick*.78,i.shoulderY+i.shoulderDrop+i.torsoLen*.42),axis:"x",mirrorX:s-(i.shoulderHalfW+i.armThick*.78)*r,apply(h,c,o){return{armThickness:le((o.armThickness??1)+h/r*.022,.7,1.4)}}}),p.filter(h=>h.y>10&&h.y<t-10)}var xn=[[-4,1.5,.7],[5,2.5,.65],[-9,3.5,.75],[10,4,.7],[.5,4.5,.6],[-15,4.5,.8],[16,5.5,.75],[-20,6.5,.7],[21,7,.7],[-12,8,.65],[13,9,.7],[-25,9.5,.75],[26,10,.7],[-18,11,.6],[19,11.5,.65],[-6,6.5,.55],[7,7.5,.6],[-23,13,.6],[24,13.5,.6],[-29,8,.6],[30,8.5,.6],[-14,13.5,.55],[15,14,.55],[-2,0,.55],[2.5,8.5,.5],[-27,5,.55],[28,5.5,.55],[-10,11.5,.5],[11,12.5,.5],[-21,3,.55]];function xo(e,t,a,s,n){let r=s.framing==="cutout"?"cutout":s.stageShape||"card",i=2;if(e.beginPath(),r==="circle"){let o=Math.min(t,a)*.5-i;e.arc(t*.5,a*.5,Math.max(10,o),0,Math.PI*2)}else if(r==="arch"){let o=t-i*2,u=a-i*2,d=o*.5;e.moveTo(i,i+d),e.arc(t*.5,i+d,d,Math.PI,0),e.lineTo(i+o,i+u-18),e.quadraticCurveTo(i+o,i+u,i+o-18,i+u),e.lineTo(i+18,i+u),e.quadraticCurveTo(i,i+u,i,i+u-18),e.closePath()}else r==="card"?e.roundRect(i,i,t-i*2,a-i*2,Math.min(26,t*.08)):e.rect(0,0,t,a);if(e.clip(),r==="cutout"||s.bgStyle==="transparent")return;let l="#162033",p="#0b101b",h="rgba(56, 189, 248, 0.22)";switch(s.bgStyle){case"warm_cream":l="#f6efe4",p="#e3d8c6",h="rgba(217, 119, 6, 0.16)";break;case"sky_glass":l="#dcebfa",p="#b8d2ef",h="rgba(37, 99, 235, 0.18)";break;case"emerald_mist":l="#132a28",p="#091515",h="rgba(45, 212, 191, 0.22)";break;case"sunset":l="#3a2234",p="#1b121c",h="rgba(251, 146, 60, 0.24)";break;case"violet_haze":l="#2a2146",p="#120e22",h="rgba(167, 139, 250, 0.26)";break;case"mint_fresh":l="#e2f4ec",p="#bfe3d3",h="rgba(16, 185, 129, 0.18)";break;case"graphite":l="#3a3f4a",p="#1c1f26",h="rgba(226, 232, 240, 0.16)";break;case"custom":{let o=Je(s.bgColor,[22,32,51]);l=H(se(o,1.18)),p=H(se(o,.68));let u=Je(s.bgAccent,[56,189,248]);h=H(u,.25);break}default:break}let c=e.createLinearGradient(0,0,0,a);if(c.addColorStop(0,l),c.addColorStop(1,p),e.fillStyle=c,e.fillRect(0,0,t,a),s.haloGlow!==!1){let o=1+n.voicing*.28+n.energy*.18,u=Math.min(t,a)*.46*o,d=e.createRadialGradient(t*.5,a*.42,u*.08,t*.5,a*.42,u);d.addColorStop(0,h),d.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=d,e.fillRect(0,0,t,a)}}function Qt(e,t,a,s,n,r,i,l,p){let h=a.x-t.x,c=a.y-t.y,o=Math.hypot(h,c);e.save(),e.translate(t.x,t.y),e.rotate(Math.atan2(-h,c));let u=c>=0?1:-1,d=e.createLinearGradient(-u*s,0,u*s,0);d.addColorStop(0,r),d.addColorStop(.42,i),d.addColorStop(1,l),e.fillStyle=d,e.beginPath(),e.moveTo(-s,0),e.bezierCurveTo(-s,-s*1.3,s,-s*1.3,s,0),e.bezierCurveTo(s*1.04,o*.33,n,o*.8,n,o),e.quadraticCurveTo(0,o+n*.95,-n,o),e.bezierCurveTo(-n,o*.82,-s*1.03,o*.37,-s,0),e.closePath(),e.fill(),p&&(e.fillStyle=p,e.beginPath(),e.moveTo(-n,o-4),e.quadraticCurveTo(0,o-1,n,o-4),e.lineTo(n,o),e.quadraticCurveTo(0,o+n*.65,-n,o),e.closePath(),e.fill()),e.restore()}function ei(e,t,a,s,n,r,i,l,p){e.save(),e.translate(t.x,t.y),e.rotate(a),e.scale(n*s,s);let h=e.createLinearGradient(-7,0,9,14);if(h.addColorStop(0,i),h.addColorStop(.58,l),h.addColorStop(1,p),e.fillStyle=h,e.strokeStyle=h,e.lineCap="round",r==="wave"){for(let[c,o,u]of[[-5,-8,21],[-1.6,-2.4,25],[2.3,3.4,24],[5.4,8.4,19]])e.lineWidth=3.8,e.beginPath(),e.moveTo(c,11),e.quadraticCurveTo((c+o)/2,18,o,u),e.stroke();e.lineWidth=4.6,e.beginPath(),e.moveTo(4,6),e.quadraticCurveTo(9,7,12,14),e.stroke()}e.beginPath(),e.moveTo(-4.4,-2),e.bezierCurveTo(-5,2,-8.4,6,-7.2,12),r==="wave"?(e.quadraticCurveTo(-1,18.2,6.8,13),e.quadraticCurveTo(9,7,5,1)):r==="point"?(e.quadraticCurveTo(-7.4,15,-5.2,16),e.lineTo(-5.1,28),e.quadraticCurveTo(-3.6,31,-1.2,28.2),e.lineTo(.5,16.2),e.quadraticCurveTo(7.5,19,7.9,12),e.quadraticCurveTo(10,8.4,5,1)):r==="thumbsup"?(e.quadraticCurveTo(-8,17,-2,17),e.lineTo(2.5,17),e.quadraticCurveTo(4,20,4,24),e.bezierCurveTo(4,29,9,27,9.2,22),e.quadraticCurveTo(11,9,5,1)):r==="present"?(e.bezierCurveTo(-6,18,-1,23,3,25),e.quadraticCurveTo(6,26,4.6,22.5),e.quadraticCurveTo(2.2,18.2,1.4,14.5),e.quadraticCurveTo(4.2,18.2,6.5,18.4),e.quadraticCurveTo(9,17.4,6.5,14),e.quadraticCurveTo(4.4,11.4,4.1,9),e.quadraticCurveTo(12,13,10.3,9.4),e.quadraticCurveTo(6.1,5.4,4.7,1)):(e.bezierCurveTo(-7.4,18,-5.3,22,-2,21),e.quadraticCurveTo(2,22,4.5,16),e.quadraticCurveTo(7,11,6.8,9),e.quadraticCurveTo(10.5,14.7,11,10.8),e.quadraticCurveTo(9.6,5.2,4.8,1)),e.lineTo(4.2,-2),e.closePath(),e.fill(),e.strokeStyle=p,e.lineWidth=1,e.beginPath(),e.moveTo(4.7,7),e.quadraticCurveTo(1.5,8,1.1,12),e.stroke(),e.restore()}function ti(e,t,a,s,n,r,i,l,p){let h=t.wardrobe||{},c=h.bottom||"trousers",o=/dress|gown|bodycon|satin|cocktail|sleeved/.test(t.outfitStyle),u=o||/skirt|tennis/.test(c),d=/shorts|briefs|^denim$/.test(c),m=o?p:Je(h.bottomColor,Ke(p,[36,28,48],.42)),g=h.legwear==="sheer"?Ke(l,Je(h.legwearColor,l),.53):l,f=h.shoes==="barefoot"?g:Je(h.shoeColor,[63,50,64]),E=Math.PI/180;u||(e.fillStyle=H(m),e.beginPath(),e.moveTo(-a.hipHalfW,s-7),e.quadraticCurveTo(-a.hipHalfW*.83,s+11,0,s+16),e.quadraticCurveTo(a.hipHalfW*.83,s+11,a.hipHalfW,s-7),e.fill());for(let T of i<0?[-1,1]:[1,-1]){let b=T>0?"left":"right",N=(r[b+"Hip"]||0)*E,k=N-(r[b+"Knee"]||0)*E,_={x:T*a.hipHalfW*.48,y:s-13},V={x:_.x+n*Math.sin(N)*i,y:_.y+n*Math.cos(N)},J={x:V.x+n*Math.sin(k)*i,y:V.y+n*Math.cos(k)},ue=T*i>0,L=Q=>[1.1,.97,.73].map(oe=>H(se(Q,oe*(ue?.84:1)))),U=a.hipHalfW,v=u||d?g:m;if(Qt(e,_,V,U*.48,U*.32,...L(v)),Qt(e,V,J,U*.32,U*.22,...L(v)),d&&!u){let Q={x:_.x+(V.x-_.x)*.55,y:_.y+(V.y-_.y)*.55};Qt(e,_,Q,U*.49,U*.4,...L(m))}let R={knee_boots:.84,heels:.43,ankle:.32,court_high_tops:.25}[h.shoes];if(R){let Q={x:J.x+(V.x-J.x)*R,y:J.y+(V.y-J.y)*R};Qt(e,Q,J,U*(.23+.09*R),U*.23,...L(f))}let D=k+(r[b+"AnkleFlex"]||0)*E,K={x:J.x+(i+T*.18)*U*.49,y:J.y+6-U*.38*Math.sin(D)};Qt(e,J,K,U*.23,U*.175,...L(f))}if(u){let T=a.hipHalfW,b=s+n*(c==="midi_skirt"||/gown/.test(t.outfitStyle)?1.36:.68),N=((r.leftHip||0)-(r.rightHip||0))*i*.14,k=e.createLinearGradient(-T,0,T,0);k.addColorStop(0,H(se(m,.78))),k.addColorStop(.48,H(m)),k.addColorStop(1,H(se(m,.69))),e.fillStyle=k,e.beginPath(),e.moveTo(-T,s-6),e.lineTo(T,s-6),e.lineTo(T*1.13+N,b),e.quadraticCurveTo(N,b+6,-T*1.13+N,b),e.closePath(),e.fill()}}function Eo(e,t,a,s,n,r=performance.now(),i={}){let l={...fo,...s||{}};l.headwear==="headscarf"&&(l.hairStyle="none"),e.clearRect(0,0,t,a),e.save(),xo(e,t,a,l,n);let{cx:p,cy:h,scale:c}=hs(t,a,l),o=ps(l),u=r*.001,d=Xo(n,r,i.reducedMotion),m=!!(n.guideTravel||n.tourPointing),g=m?Math.sin((d?.rootYaw||0)*Math.PI/180):0,f=96*le(l.legLength??1,.73,1.35),E=Jo(n,d),T=Je(l.skinColor,[241,198,176]),b=le(l.synthFinish??0,0,1),N=Ke(T,[218,228,242],b*.55),k=Ke(se(N,1.12,.25),[248,252,255],b*.45),_=Ke(se(N,.8,.35),[118,136,166],b*.55),V=Ke(se(N,.64,.45),[72,88,118],b*.55),J=Je(l.hairColor,[60,39,52]),ue=Je(l.hairHighlight,se(J,1.45)),L=Je(l.outfitPrimary,[30,47,77]),U=Je(l.outfitSecondary,[244,246,251]),v=Je(l.outfitAccent,[56,189,248]),R=Math.sin(u*1.9)*1.15,D=n.x||{},K=A=>D[A]||0,Q=K("nod")*Math.sin(u*11)*3.8+K("bow")*7.5-K("bounce")*Math.abs(Math.sin(u*15))*2.4,oe=n.energy*2.5-n.pitchSt*.52+Math.sin(u*1.4)*.75+Q,w=Math.sin(u*.82)*.015+n.pitchSt*.006*Math.cos(u*1.8)+n.lookX*.032+K("tilt")*.095,Y=le(l.restSmile??0,-.4,1),j=le(K("smile")+Y*.75,-.4,1.2),ae=le(K("browIn")-le(l.browMood??0,-1,1)*.55,-1.2,1.2),z=le(K("eyeWide")+le(l.eyeOpen??0,-.5,.5),-.8,1),te=n.lookX*5.2+K("shake")*Math.sin(u*13)*7+g*19,de=l.headwear||"none",Te=de==="beanie"||de==="cap"||de==="beret"||de==="fedora"||de==="chef",Ne=-o.headH*.56-5,Ae=()=>{Te&&(e.beginPath(),e.rect(-400,Ne,800,1200),e.clip())},Oe=n.lookY*3,ce=n.jaw*14.2*(1-n.lipC*.55)*o.headScale,ve=o.chinBaseY+ce,Re=o.shoulderHalfW+o.torsoLen*.74+30,ie=n.guideDirection?Math.min(c,t/(2*Re)):c,Z=p,fe=h;if(m){let A=n.guideTravel?.point??1,O=-o.headH*1.32-26,y=o.shoulderY+o.torsoLen*1.12+2*f+9,I=Math.min(t/290,a*.97/(y-O)),S=Math.min(t/(1.7*Re),a/290),C=a*.98-y*I,F=a*.07-O*S;ie=I+(S-I)*A,fe=C+(F-C)*A,Z-=Qo(n.guideDirection)*.15*Re*S*A}if(e.translate(Z,fe),e.scale(ie*(1-.22*Math.abs(g)),ie),d&&!i.showSculptHandles&&(e.translate((d.rootX||0)*21+(d.rootSway||0)*44,(d.leftKnee||0)*.17),e.rotate((d.torsoLean||0)*Math.PI/420)),de==="headscarf"){let A=Je(l.headwearColor,[180,69,47]);e.save(),e.translate(-te*.42,oe*.65),e.rotate(w*.55);let O=e.createLinearGradient(0,-o.headH,0,o.shoulderY+30);O.addColorStop(0,H(se(A,.95))),O.addColorStop(1,H(se(A,.62))),e.fillStyle=O,e.beginPath(),e.moveTo(-o.headW-9,-14),e.bezierCurveTo(-o.headW-15,-o.headH*1.36-16,o.headW+15,-o.headH*1.36-16,o.headW+9,-14),e.bezierCurveTo(o.headW+16,30,o.shoulderHalfW*.74,o.shoulderY+2,o.shoulderHalfW*.82,o.shoulderY+22),e.lineTo(-o.shoulderHalfW*.82,o.shoulderY+22),e.bezierCurveTo(-o.shoulderHalfW*.74,o.shoulderY+2,-o.headW-16,30,-o.headW-9,-14),e.closePath(),e.fill(),e.restore()}let ge=l.hairStyle==="curly_halo"||l.hairStyle==="afro";if(l.hairStyle==="ponytail"){e.save(),e.translate(-te*.42,oe*.65),e.rotate(w*.55),Ae();let A=Math.sin(u*1.6)*1.6+K("shake")*Math.sin(u*13-.6)*5,O=-o.headH*.58,y=o.shoulderY+34,I=e.createLinearGradient(0,O,0,y);I.addColorStop(0,H(se(J,.95))),I.addColorStop(1,H(se(J,.55))),e.fillStyle=I,e.beginPath(),e.moveTo(o.headW*.35,O),e.bezierCurveTo(o.headW+26,O-4,o.headW+30+A,18,o.headW+20+A,y-20),e.quadraticCurveTo(o.headW+14+A,y+4,o.headW+6+A,y),e.bezierCurveTo(o.headW+12+A*.6,26,o.headW+6,-6,o.headW*.2,O+14),e.closePath(),e.fill(),e.restore()}if(l.hairStyle==="pigtails"){e.save(),e.translate(-te*.42,oe*.65),e.rotate(w*.55),Ae();let A=Math.sin(u*1.6)*1.4+K("shake")*Math.sin(u*13-.6)*4,O=4,y=o.shoulderY+30;for(let I of[-1,1]){let S=I*(o.headW-3),C=e.createLinearGradient(0,O-10,0,y);C.addColorStop(0,H(se(J,1.02))),C.addColorStop(1,H(se(J,.58))),e.fillStyle=C,e.beginPath(),e.moveTo(S,O-12),e.bezierCurveTo(S+I*34,O-12,S+I*40+A,y-36,S+I*24+A,y-6),e.quadraticCurveTo(S+I*15+A,y+7,S+I*6+A,y-8),e.bezierCurveTo(S+I*12,y-40,S+I*5,O+24,S-I*3,O+10),e.closePath(),e.fill(),e.fillStyle=H(v),e.beginPath(),e.ellipse(S+I*12.5,O+3,4.4,7,I*.45,0,Math.PI*2),e.fill()}e.restore()}if(l.hairStyle==="long_waves"||l.hairStyle==="shoulder_lob"||l.hairStyle==="sleek_bob"||l.hairStyle==="long_straight"||l.hairStyle==="braids"||ge){e.save(),e.translate(-te*.42,oe*.65),e.rotate(w*.55),Ae();let A=l.hairStyle==="braids"?36:l.hairStyle==="long_straight"?o.shoulderY+66:l.hairStyle==="long_waves"?o.shoulderY+46:l.hairStyle==="shoulder_lob"?o.shoulderY+18:ge?42:48,O=l.hairStyle==="afro"?38:l.hairStyle==="curly_halo"?24:l.hairStyle==="long_waves"?17:l.hairStyle==="long_straight"?7:11,y=e.createLinearGradient(0,-o.headH-16,0,A);if(y.addColorStop(0,H(se(J,1.05))),y.addColorStop(.6,H(se(J,.75))),y.addColorStop(1,H(se(J,.48))),e.fillStyle=y,e.beginPath(),ge){let I=l.hairStyle==="afro",S=o.headW+O,C=o.headH*.92+(I?30:16),F=I?-22:-14,pe=I?24:18;e.moveTo(S,F);for(let Ue=0;Ue<pe;Ue++){let xe=(Ue+1)*2*Math.PI/pe,et=(Ue+.5)*2*Math.PI/pe,ft=5+2*Math.sin(Ue*2.4);e.quadraticCurveTo((S+ft)*Math.cos(et),F+(C+ft)*Math.sin(et),S*Math.cos(xe),F+C*Math.sin(xe))}e.closePath()}else e.moveTo(-o.headW-9,-12),e.bezierCurveTo(-o.headW-15,-o.headH-20,o.headW+15,-o.headH-20,o.headW+9,-12),l.hairStyle==="long_waves"?(e.bezierCurveTo(o.headW+24,24,o.headW+1,39,o.headW+12,65),e.bezierCurveTo(o.headW+26,94,o.headW+4,A-9,o.headW+10,A),e.quadraticCurveTo(o.headW-6,A-2,o.headW-6,A-21)):e.bezierCurveTo(o.headW+O+4,34,o.headW+O,A-9,o.headW-1,A),e.quadraticCurveTo(1,A+10,-o.headW+1,A-2),e.bezierCurveTo(-o.headW-O,A-16,-o.headW-O-4,34,-o.headW-9,-12),e.closePath();if(e.fill(),!ge){e.clip(),e.fillStyle=H(Ke(J,ue,.37),.66);for(let I of[-1,1])e.beginPath(),e.moveTo(I*(o.headW-9),-o.headH+6),e.bezierCurveTo(I*(o.headW+35),4,I*(o.headW-3),A*.5,I*(o.headW+9),A-3),e.bezierCurveTo(I*(o.headW-13),A*.56,I*(o.headW+25),2,I*(o.headW-9),-o.headH+6),e.fill()}e.restore()}let W=o.shoulderY+R*.65,x=W+o.shoulderDrop-K("shrug")*10,B=W+o.torsoLen*.68,ne=W+o.torsoLen*1.12;m&&ti(e,l,o,ne,f,d||{},g,N,L);let he=e.createLinearGradient(-o.neckHalfW-8,42,o.neckHalfW+8,W+16);if(he.addColorStop(0,H(_)),he.addColorStop(.36,H(k)),he.addColorStop(.72,H(N)),he.addColorStop(1,H(V)),e.fillStyle=he,e.beginPath(),e.moveTo(-o.neckHalfW,34),e.quadraticCurveTo(-o.neckHalfW-1,W-6,-o.neckHalfW-24,W+18),e.lineTo(o.neckHalfW+24,W+18),e.quadraticCurveTo(o.neckHalfW+1,W-6,o.neckHalfW,34),e.closePath(),e.fill(),b>.35){e.strokeStyle=H(v,.42*b),e.lineWidth=1.2;for(let A of[49,59])e.beginPath(),e.moveTo(-o.neckHalfW*.92,A),e.quadraticCurveTo(0,A+3.5,o.neckHalfW*.92,A),e.stroke()}let ee=e.createRadialGradient(te*.5,51+oe,4,te*.3,56+oe,o.neckHalfW*1.48);ee.addColorStop(0,"rgba(38, 18, 16, 0.44)"),ee.addColorStop(1,"rgba(38, 18, 16, 0)"),e.fillStyle=ee,e.beginPath(),e.ellipse(te*.35,55+oe,o.neckHalfW*1.28,15+ce*.25,0,0,Math.PI*2),e.fill();let q=l.outfitStyle||"blazer",me=["tee","polo","scoop","apron","rugby_shirt"].includes(q),Ee=q==="vest"?U:L,ke=[H(se(Ee,1.13)),H(Ee),H(se(Ee,.72))],He=[H(k),H(N),H(_)],Ge=H(Ke(Ee,v,.32)),De=n.energy*5.5+Math.max(0,n.pitchSt)*.7,Pe=d&&n.bodyMotion&&!n.guideTravel&&r<n.bodyMotion.end,Le=Pe&&n.bodyMotion.id==="wave",Ze=m&&E?.side===1?-1:1,je=[];for(let A of[-1,1]){let O=o.armThick,y={x:A*(o.shoulderHalfW-O*.4),y:x+O*.68},I={x:A*(o.shoulderHalfW+O*.5),y:W+o.torsoLen*.59},S={x:A*(o.hipHalfW+O*.75),y:ne-18},C="relaxed",F=0;if(l.posture==="presenter"&&A===1?(S.x=o.chestHalfW*.68,S.y=B-17-De,F=.12,C="present"):l.posture==="confident"?(I.x=A*(o.waistHalfW+O*.42),I.y=W+o.torsoLen*.56,S.x=-A*o.chestHalfW*.27,S.y=W+o.torsoLen*.43+O*(A<0?-.6:.34)):l.posture==="welcoming"&&(S.x=A*(o.chestHalfW+O*1.52),S.y-=3+De*.6),A===Ze&&!n.guideTravel&&(Le||n.emote==="thumbsup")){let pe=Le?le((d.rightArmLift||0)/74,0,1):K("thumbUp"),Ue=Le&&d.rightWristBend||0;I.x+=(y.x+A*o.torsoLen*.21-I.x)*pe,I.y+=(y.y+o.torsoLen*.19-I.y)*pe,S.x+=(y.x+A*(o.torsoLen*.19+Ue*.35)-S.x)*pe,S.y+=(y.y-o.torsoLen*.26-S.y)*pe,F=Ue*Math.PI/180,C=Le?"wave":"thumbsup"}else if((Pe||n.guideTravel)&&!Le){C="relaxed";let pe=A===1?"right":"left",Ue=Math.PI/180,xe=(d[pe+"ArmLift"]||0)*Ue,et=(d[pe+"Shoulder"]||0)*Ue,ft=(d[pe+"Elbow"]||0)*Ue,Ht=o.torsoLen*.43;if(I.x=y.x+A*Ht*Math.sin(xe+.13),I.y=y.y+Ht*Math.cos(xe)*Math.cos(et),S.x=I.x+A*Ht*.87*Math.sin(xe+ft*.36),S.y=I.y+Ht*.87*Math.cos(xe+ft*.36)*Math.cos(et+ft),n.guideTravel){let Va=g*Ht*Math.sin(et);I.x+=Va,S.x+=Va+g*Ht*.87*Math.sin(et+ft)}F=(d[pe+"WristBend"]||0)*Ue}if(E?.side===A){let pe=o.torsoLen*.72,Ue=E.elevation,xe=y.x+A*pe*.48*Math.cos(Ue-.25),et=y.y-pe*.48*Math.sin(Ue-.25);I.x+=(xe-I.x)*E.weight,I.y+=(et-I.y)*E.weight,S.x+=(xe+A*pe*.52*Math.cos(Ue+.2)-S.x)*E.weight,S.y+=(et-pe*.52*Math.sin(Ue+.2)-S.y)*E.weight,F=0,C=m?"point":"present"}if(me){let pe={x:y.x*.56+I.x*.44,y:y.y*.56+I.y*.44};Qt(e,pe,I,O*.66,O*.56,...He),Qt(e,y,pe,O*.9,O*.8,...ke,q==="rugby_shirt"?H(v):Ge)}else Qt(e,y,I,O*.88,O*.71,...ke),q==="track_jacket"&&(e.strokeStyle=H(v),e.lineWidth=O*.19,e.beginPath(),e.moveTo(y.x+A*O*.46,y.y),e.lineTo(I.x+A*O*.39,I.y),e.stroke());je.push({elbow:I,wrist:S,dir:A,wristBend:F,gesture:C})}let we=e.createLinearGradient(-o.shoulderHalfW,W,o.shoulderHalfW,ne);we.addColorStop(0,H(se(L,1.16))),we.addColorStop(.48,H(L)),we.addColorStop(1,H(se(L,.66)));let We=["blazer","suit_tie","vest","cardigan","jacket"].includes(q),Xe=o.shoulderHalfW*(q==="vest"?.83:.98),X=A=>W+(B-W)*A/1.57,pt=X(We?2.1:q==="field_overshirt"?1.96:1.57);if(e.fillStyle=we,e.beginPath(),e.moveTo(-o.neckHalfW-4,W-3),e.quadraticCurveTo(-Xe*.79,W-2,-Xe,x),e.quadraticCurveTo(-Xe,x+15,-o.chestHalfW,W+o.torsoLen*.32),e.bezierCurveTo(-o.chestHalfW+2,W+o.torsoLen*.5,-o.waistHalfW,B-12,-o.waistHalfW,B),e.quadraticCurveTo(-o.waistHalfW,(B+ne)*.5,-o.hipHalfW,ne),e.lineTo(o.hipHalfW,ne),e.quadraticCurveTo(o.waistHalfW,(B+ne)*.5,o.waistHalfW,B),e.bezierCurveTo(o.waistHalfW,B-12,o.chestHalfW-2,W+o.torsoLen*.5,o.chestHalfW,W+o.torsoLen*.32),e.quadraticCurveTo(Xe,x+15,Xe,x),e.quadraticCurveTo(Xe*.79,W-2,o.neckHalfW+4,W-3),e.quadraticCurveTo(0,W+14,-o.neckHalfW-4,W-3),e.closePath(),e.fill(),e.strokeStyle="rgba(255, 255, 255, 0.14)",e.lineWidth=1.3,e.stroke(),q!=="apron"&&Zo.some(({id:A})=>A===q)){let A=Je(l.wardrobe?.bottomColor,Ke(L,[36,28,48],.42)),O=Je(l.wardrobe?.bottomAccent,v),y=Math.max(o.hipHalfW,o.waistHalfW)+2;e.save(),e.clip(),e.fillStyle=H(A),e.fillRect(-y,pt,y*2,ne-pt),!We&&q!=="field_overshirt"&&(e.fillStyle=H(Ke(A,O,.22)),e.fillRect(-y,B,y*2,X(1.7)-B)),e.restore()}function St(A,O,y,I){let S=W+2,C=2*X(O)-S;e.fillStyle=he,e.beginPath(),e.moveTo(-A,S),e.quadraticCurveTo(-o.neckHalfW-6,W-1,-o.neckHalfW,W-5),e.lineTo(o.neckHalfW,W-5),e.quadraticCurveTo(o.neckHalfW+6,W-1,A,S),e.quadraticCurveTo(0,C,-A,S),e.closePath(),e.fill(),e.strokeStyle=y,e.lineWidth=I,e.beginPath(),e.moveTo(-A,S),e.quadraticCurveTo(0,C,A,S),e.stroke()}if(["rugby_shirt","track_jacket","field_overshirt"].includes(q)){e.save(),e.clip();let A=o.shoulderHalfW+8,O=H(v),y=H(Ke(L,U,.32));if(q==="rugby_shirt"){e.fillStyle=O;for(let I of[.43,1.04]){let S=X(I);e.fillRect(-A,S,2*A,X(I+.26)-S),e.fillRect(-A,X(I+.3),2*A,1.6)}}else if(q==="track_jacket"){e.strokeStyle=O,e.lineWidth=X(.135)-W,e.beginPath();let I=o.shoulderHalfW*.85;e.moveTo(-I,X(.38)),e.quadraticCurveTo(0,X(1.16),I,X(.38)),e.stroke(),e.fillStyle=H(se(L,.6)),e.fillRect(-1.8,W,3.6,B-W),e.fillStyle=H(Ke(v,[179,183,189],.42)),e.fillRect(-.8,W,1.6,B-W),e.fillStyle=O,e.fillRect(-1.9,X(.31),3.8,6),e.fillStyle=H(Ke(L,[51,45,67],.35)),e.fillRect(-A,X(1.47),2*A,B-X(1.47))}else{let I=o.chestHalfW*.52,S=X(.62);e.fillStyle=y,e.fillRect(-2.8,W,5.6,pt-W);for(let C of[-1,1]){let F=C*o.chestHalfW*.54-I*.5;e.fillStyle=H(Ke(L,v,.2)),e.beginPath(),e.roundRect(F,S,I,o.torsoLen*.17,[0,0,4,4]),e.fill(),e.fillStyle=H(se(L,.65)),e.fillRect(F-.7,S,I+1.4,4.5)}e.fillStyle=H(Ke(L,[48,40,61],.5));for(let C=0;C<5;C++)e.beginPath(),e.arc(0,W+o.torsoLen*(.16+C*.135),1.9,0,Math.PI*2),e.fill()}if(q!=="track_jacket"){e.fillStyle=q==="rugby_shirt"?H(U):y;for(let I of[-1,1])e.beginPath(),e.moveTo(I*1.8,W+5),e.lineTo(I*(o.neckHalfW+5),W-3),e.lineTo(I*(o.neckHalfW+15),X(.15)),e.lineTo(I*o.neckHalfW*.98,X(.31)),e.closePath(),e.fill()}if(e.restore(),q==="rugby_shirt"){e.fillStyle=H(Ke(L,v,.65)),e.fillRect(-2.8,X(.09),5.6,X(.5)-X(.09)),e.fillStyle=O;for(let I of[.24,.37])e.beginPath(),e.arc(0,X(I),1.2,0,Math.PI*2),e.fill()}else q==="track_jacket"&&(e.strokeStyle=O,e.lineWidth=2,e.beginPath(),e.moveTo(-o.neckHalfW-2,W-3),e.quadraticCurveTo(0,W+7,o.neckHalfW+2,W-3),e.stroke())}else if(We){let A=X(q==="suit_tie"?1.31:1.08),O=o.chestHalfW*.5,y=H(Ke(L,v,q==="jacket"?.58:.17));if(e.beginPath(),e.moveTo(-o.neckHalfW,W-4),e.quadraticCurveTo(-O*.99,W+3,-O,W+10),e.lineTo(0,A),e.lineTo(O,W+10),e.quadraticCurveTo(O*.99,W+3,o.neckHalfW,W-4),e.quadraticCurveTo(0,W+4,-o.neckHalfW,W-4),e.closePath(),e.fillStyle=H(U),e.fill(),e.strokeStyle=y,e.lineWidth=q==="cardigan"?3:1.5,e.lineJoin="round",e.stroke(),e.beginPath(),e.moveTo(0,A),e.lineTo(0,pt),e.stroke(),q==="blazer"||q==="suit_tie"){e.fillStyle=H(Ke(L,[214,212,231],.16));for(let I of[-1,1])e.beginPath(),e.moveTo(I*o.neckHalfW,W-4),e.lineTo(I*(O+13),X(.2)),e.lineTo(I*(O+4),X(.31)),e.lineTo(I*(O+11),X(.37)),e.lineTo(0,A),e.lineTo(I*O,W+10),e.closePath(),e.fill()}if(q==="suit_tie"&&l.neckwear!=="bowtie")e.fillStyle=H(v),e.beginPath(),e.moveTo(-5.8,X(.12)),e.lineTo(5.8,X(.12)),e.lineTo(3.5,X(.26)),e.lineTo(6.2,X(1.11)),e.lineTo(0,X(1.23)),e.lineTo(-6.2,X(1.11)),e.lineTo(-3.5,X(.26)),e.closePath(),e.fill();else if(q==="cardigan"){e.fillStyle=H(v);for(let I of[1.12,1.45,1.78])e.beginPath(),e.arc(.8,X(I),2.3,0,Math.PI*2),e.fill()}else if(q==="jacket"){e.strokeStyle=H(v),e.lineWidth=1.3;for(let I=X(.42);I<pt;I+=4){let S=O*Math.max(0,(A-I)/(A-W-10));for(let C of[-1,1])e.beginPath(),e.moveTo(C*S,I),e.lineTo(C*(S+2.2),I+.8),e.stroke()}}}else if(q==="turtleneck"||q==="hoodie"){let A=q==="hoodie",O=o.neckHalfW*(A?1.45:1.03),y=X(A?-.15:-.24);if(e.fillStyle=we,e.beginPath(),e.moveTo(-O,y),e.quadraticCurveTo(0,y+3.5,O,y),e.lineTo(O+(A?7:1),X(.11)),e.quadraticCurveTo(0,X(A?.23:.16),-O-(A?7:1),X(.11)),e.closePath(),e.fill(),e.strokeStyle=H(se(L,1.22)),e.lineWidth=1.5,e.beginPath(),e.moveTo(-O,y),e.quadraticCurveTo(0,y+3.5,O,y),e.stroke(),A){for(let I of[-1,1]){let S=o.chestHalfW*.3*I;e.strokeStyle=H(U),e.lineWidth=2,e.beginPath(),e.moveTo(S*1.16,X(.15)),e.quadraticCurveTo(S*.82,X(.53),S,X(.82)),e.stroke(),e.strokeStyle=H(v),e.lineWidth=2.6,e.beginPath(),e.moveTo(S*.94,X(.71)),e.lineTo(S,X(.82)),e.stroke()}e.fillStyle=H(Ke(L,[48,40,61],.27)),e.beginPath(),e.moveTo(-o.waistHalfW*.43,X(1.16)),e.lineTo(o.waistHalfW*.43,X(1.16)),e.lineTo(o.waistHalfW*.7,X(1.38)),e.lineTo(o.waistHalfW*.7,B),e.lineTo(-o.waistHalfW*.7,B),e.lineTo(-o.waistHalfW*.7,X(1.38)),e.closePath(),e.fill()}}else if(q==="sweater")St(o.neckHalfW+2,.1,H(se(L,1.16)),3.2);else if(q==="polo"||q==="shirt"){let A=q==="shirt";e.fillStyle=H(Ke(L,[48,40,61],.27)),e.fillRect(-1.9,X(.19),3.8,X(A?1.57:.81)-X(.19)),e.fillStyle=H(U);for(let y of A?[.46,.71,.96,1.21,1.46]:[.46,.69])e.beginPath(),e.arc(0,X(y),1.55,0,Math.PI*2),e.fill();A&&(e.fillStyle=H(Ke(L,U,.2)),e.beginPath(),e.moveTo(-o.chestHalfW*.7,X(.61)),e.lineTo(-o.chestHalfW*.33,X(.61)),e.lineTo(-o.chestHalfW*.34,X(.84)),e.lineTo(-o.chestHalfW*.5,X(.91)),e.lineTo(-o.chestHalfW*.68,X(.84)),e.closePath(),e.fill());let O=Ke(L,v,.15);e.fillStyle=H(O),e.strokeStyle=H(Ke(O,v,.65)),e.lineWidth=1;for(let y of[-1,1])e.beginPath(),e.moveTo(0,X(.17)),e.lineTo(y*o.neckHalfW*.87,W-3),e.quadraticCurveTo(y*o.neckHalfW*1.68,W-1,y*o.chestHalfW*.64,X(.17)),e.lineTo(y*o.chestHalfW*.42,X(.34)),e.closePath(),e.fill(),e.beginPath(),e.moveTo(y*o.chestHalfW*.64,X(.17)),e.lineTo(y*o.chestHalfW*.42,X(.34)),e.stroke()}else if(q==="scoop"){let A=Math.min(o.shoulderHalfW*.79,o.chestHalfW*.81);St(A,.56,H(se(L,1.22)),2),e.strokeStyle=H(V,.22),e.lineWidth=1.1;for(let O of[-1,1])e.beginPath(),e.moveTo(O*6,W+12),e.quadraticCurveTo(O*16,W+8.5,O*(A-5),W+6),e.stroke()}else if(q==="apron"){St(o.neckHalfW+8,.26,H(se(L,.84)),2);let A=X(.48),O=o.chestHalfW*.5;e.strokeStyle=H(U),e.lineWidth=4.8,e.lineCap="round";for(let S of[-1,1])e.beginPath(),e.moveTo(S*(o.neckHalfW+2),W-1),e.lineTo(S*(O-3),A+2),e.stroke();let y=e.createLinearGradient(0,A,0,ne);y.addColorStop(0,H(U)),y.addColorStop(1,H(se(U,.8))),e.fillStyle=y,e.beginPath(),e.moveTo(-O,A),e.lineTo(O,A),e.quadraticCurveTo(O+4,B-10,o.waistHalfW+1,B+2),e.lineTo(o.hipHalfW,ne),e.lineTo(-o.hipHalfW,ne),e.lineTo(-o.waistHalfW-1,B+2),e.quadraticCurveTo(-O-4,B-10,-O,A),e.closePath(),e.fill();let I=o.chestHalfW*.3;e.fillStyle=H(Ke(U,L,.22)),e.beginPath(),e.moveTo(-I,X(.77)),e.lineTo(I,X(.77)),e.lineTo(I*.96,X(1.02)),e.lineTo(I*.7,X(1.11)),e.lineTo(-I*.7,X(1.11)),e.lineTo(-I*.96,X(1.02)),e.closePath(),e.fill(),e.fillStyle=H(v),e.beginPath(),e.rect(-I,X(.78),I*2,X(.82)-X(.78)),e.fill()}else q==="tee"?(St(o.neckHalfW+8,.26,H(se(L,.78)),2.5),e.fillStyle=H(v,.94),e.beginPath(),e.arc(0,X(.78),10.5,0,Math.PI*2),e.fill(),e.fillStyle=H(U,.92),e.beginPath(),e.arc(0,X(.78),4.6,0,Math.PI*2),e.fill()):q==="cyber"&&(e.strokeStyle=H(v),e.lineWidth=2.4,e.beginPath(),e.moveTo(-o.chestHalfW*.7,X(.32)),e.lineTo(-o.chestHalfW*.2,X(.6)),e.lineTo(o.chestHalfW*.2,X(.6)),e.lineTo(o.chestHalfW*.7,X(.32)),e.stroke(),e.fillStyle=H(Ke(L,v,.44)),e.beginPath(),e.arc(0,X(.6),5.6,0,Math.PI*2),e.fill(),e.fillStyle=H(v,.85+n.voicing*.15),e.beginPath(),e.arc(0,X(.6),3.2,0,Math.PI*2),e.fill());l.nameBadge&&q!=="cyber"&&q!=="apron"&&(e.fillStyle=H(v),e.beginPath(),e.roundRect(o.chestHalfW*.37,X(.52),o.chestHalfW*.31,X(.62)-X(.52),1.9),e.fill());let st=l.brooch||"none";if(st!=="none"&&q!=="cyber"){let A=Je(l.broochColor,[230,195,92]),O=-o.chestHalfW*.4,y=W+29;if(e.fillStyle=H(A),e.strokeStyle=H(se(A,.62),.8),e.lineWidth=.8,e.beginPath(),st==="star"){for(let I=0;I<10;I++){let S=I%2?2.9:6.6,C=I/10*Math.PI*2-Math.PI/2;e[I?"lineTo":"moveTo"](O+Math.cos(C)*S,y+Math.sin(C)*S)}e.closePath()}else if(st==="heart")e.moveTo(O,y+5.8),e.bezierCurveTo(O-9.5,y-.5,O-4.4,y-7.6,O,y-2.6),e.bezierCurveTo(O+4.4,y-7.6,O+9.5,y-.5,O,y+5.8);else if(st==="flower")for(let I=0;I<5;I++){let S=I/5*Math.PI*2-Math.PI/2;e.moveTo(O+Math.cos(S)*3.9+3,y+Math.sin(S)*3.9),e.arc(O+Math.cos(S)*3.9,y+Math.sin(S)*3.9,3,0,Math.PI*2)}else e.arc(O,y,4.8,0,Math.PI*2);e.fill(),e.stroke(),e.fillStyle=st==="flower"?H(se(A,.6)):"rgba(255, 255, 255, 0.55)",e.beginPath(),e.arc(st==="flower"?O:O-1.4,st==="flower"?y:y-1.6,st==="flower"?2.2:1.2,0,Math.PI*2),e.fill()}let _t=l.neckwear||"none";if(_t!=="none"){let A=Je(l.neckwearColor,[217,164,65]);if(_t==="necklace")e.strokeStyle=H(A),e.lineWidth=1.2,e.beginPath(),e.moveTo(-o.neckHalfW+1.5,W-6),e.quadraticCurveTo(0,W+19,o.neckHalfW-1.5,W-6),e.stroke(),e.fillStyle=H(A),e.beginPath(),e.moveTo(0,W+9),e.quadraticCurveTo(4.4,W+14.5,0,W+18.5),e.quadraticCurveTo(-4.4,W+14.5,0,W+9),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.6)",e.beginPath(),e.arc(-1,W+12.6,1,0,Math.PI*2),e.fill();else if(_t==="bowtie"){e.fillStyle=H(A);for(let O of[-1,1])e.beginPath(),e.moveTo(O*2,W+5.5),e.quadraticCurveTo(O*9,W-3.5,O*15,W-.5),e.lineTo(O*15,W+12),e.quadraticCurveTo(O*9,W+14.5,O*2,W+6.5),e.closePath(),e.fill();e.fillStyle=H(se(A,.74)),e.beginPath(),e.roundRect(-3.2,W+1.2,6.4,9.6,2.4),e.fill()}else if(_t==="scarf"){let O=e.createLinearGradient(0,W-22,0,W+12);O.addColorStop(0,H(se(A,1.16))),O.addColorStop(1,H(se(A,.78))),e.fillStyle=O,e.beginPath(),e.moveTo(-o.neckHalfW-9,W-13),e.quadraticCurveTo(0,W-23,o.neckHalfW+9,W-13),e.quadraticCurveTo(o.neckHalfW+14,W+1,o.neckHalfW+6,W+9),e.quadraticCurveTo(0,W+19,-o.neckHalfW-6,W+9),e.quadraticCurveTo(-o.neckHalfW-14,W+1,-o.neckHalfW-9,W-13),e.closePath(),e.fill(),e.fillStyle=H(se(A,.88)),e.beginPath(),e.moveTo(4,W+8),e.lineTo(17,W+6),e.lineTo(21,W+52),e.lineTo(8,W+54),e.closePath(),e.fill(),e.strokeStyle=H(se(A,.62),.7),e.lineWidth=1;for(let y of[W-6,W+2])e.beginPath(),e.moveTo(-o.neckHalfW-7,y),e.quadraticCurveTo(0,y+8,o.neckHalfW+7,y),e.stroke()}else if(_t==="lanyard"){let O=W+56;e.strokeStyle=H(A),e.lineWidth=2.4,e.lineCap="round";for(let y of[-1,1])e.beginPath(),e.moveTo(y*(o.neckHalfW+1),W-2),e.lineTo(0,O),e.stroke();e.fillStyle="#f8fafc",e.strokeStyle="rgba(15, 23, 42, 0.28)",e.lineWidth=.9,e.beginPath(),e.roundRect(-10,O-2,20,26,2.6),e.fill(),e.stroke(),e.fillStyle=H(A),e.fillRect(-10,O-2,20,6),e.fillStyle=H(N),e.beginPath(),e.arc(0,O+10,3.4,0,Math.PI*2),e.fill(),e.fillStyle="rgba(15, 23, 42, 0.5)",e.fillRect(-6,O+16.5,12,1.6),e.fillRect(-4,O+19.6,8,1.4)}}if(l.hairStyle==="braids"){e.save(),Ae();for(let A of[-1,1]){let O=A*(o.headW-1.5)-te*.3,y=8,I=W+54,S=Math.max(8,Math.round((I-y)/8.5));for(let F=0;F<S;F++){let pe=F/(S-1),Ue=y+(I-y)*pe,xe=O+A*Math.sin(pe*2.2)*5+Math.sin(u*1.5+pe*3)*.6,et=8.4-pe*2.6,ft=(F%2?1:-1)*.62;e.fillStyle=H(se(J,F%2?.8:1.08)),e.beginPath(),e.ellipse(xe+(F%2?1.4:-1.4),Ue,et*.82,et*1.12,ft,0,Math.PI*2),e.fill(),e.strokeStyle=H(se(J,.56),.55),e.lineWidth=.8,e.stroke()}let C=O+A*Math.sin(2.2)*5;e.fillStyle=H(v),e.beginPath(),e.roundRect(C-4,I+1,8,4,2),e.fill(),e.fillStyle=H(se(J,.9)),e.beginPath(),e.moveTo(C-3.4,I+5),e.quadraticCurveTo(C,I+17,C+3.4,I+5),e.fill()}e.restore()}for(let{elbow:A,wrist:O,dir:y,wristBend:I,gesture:S}of je){let C=o.armThick,F=Math.atan2(A.x-O.x,O.y-A.y)+I,pe=le(C/15,.78,1.28);Qt(e,A,O,C*(me?.57:.71),C*(me?.32:.45),...me?He:ke,me?null:Ge),q==="track_jacket"&&(e.strokeStyle=H(v),e.lineWidth=C*.17,e.beginPath(),e.moveTo(A.x+y*C*.39,A.y),e.lineTo(O.x+y*C*.25,O.y-1),e.stroke()),ei(e,O,F,pe,-y,S,...He)}if(e.save(),e.translate(te*.35,oe+Oe*.4),e.rotate(w),["side_sweep","quiff","pixie","buzz","updo_bun","ponytail","pigtails","space_buns","mohawk"].includes(l.hairStyle)){let A=e.createLinearGradient(0,-o.headH-28,0,18);if(A.addColorStop(0,H(se(J,1.15))),A.addColorStop(1,H(se(J,.62))),e.fillStyle=A,e.save(),Ae(),l.hairStyle==="updo_bun"&&(e.beginPath(),e.arc(-te*.35,-o.headH-12,20*o.headScale,0,Math.PI*2),e.fill()),l.hairStyle==="space_buns")for(let y of[-1,1])e.beginPath(),e.arc(y*o.headW*.7-te*.35,-o.headH-8,15*o.headScale,0,Math.PI*2),e.fill();let O=l.hairStyle==="buzz"||l.hairStyle==="mohawk"?2.2:5.5;e.beginPath(),e.moveTo(-o.headW-O,-10),e.bezierCurveTo(-o.headW-O-4,-o.headH-14,o.headW+O+4,-o.headH-14,o.headW+O,-10),e.lineTo(o.headW-2,16),e.lineTo(-o.headW+2,16),e.closePath(),e.fill(),e.restore()}let ye=le(l.earSize??1,.65,1.45)*o.headScale;for(let A of[-1,1]){let O=A*(o.headW-.5)-te*.42,y=-2;if(l.earStyle==="cyber"){e.fillStyle=H(L),e.strokeStyle=H(v,.85),e.lineWidth=1.6,e.beginPath(),e.roundRect(O-5*ye,y-14*ye,10*ye,28*ye,4*ye),e.fill(),e.stroke();continue}let I=e.createLinearGradient(O,y-16*ye,O,y+15*ye);I.addColorStop(0,H(k)),I.addColorStop(1,H(_)),e.fillStyle=I,e.beginPath(),l.earStyle==="pointed"?(e.moveTo(O-A*4*ye,y-11*ye),e.quadraticCurveTo(O+A*15*ye,y-22*ye,O+A*13*ye,y-4*ye),e.quadraticCurveTo(O+A*8*ye,y+14*ye,O-A*3*ye,y+14*ye),e.closePath()):e.ellipse(O,y,8.5*ye,15.8*ye,A*-.09,0,Math.PI*2),e.fill(),e.fillStyle=H(V,.34),e.beginPath(),e.ellipse(O-A*1.2*ye,y+1,4*ye,8.8*ye,A*-.08,0,Math.PI*2),e.fill()}let ua=e.createRadialGradient(-14+te*.3,-26*o.headScale,8,0,6,o.headH*1.48);ua.addColorStop(0,H(k)),ua.addColorStop(.54,H(N)),ua.addColorStop(.88,H(_)),ua.addColorStop(1,H(V));let ba=(6+le(l.chinRoundness??.65,0,1)*15)*o.headScale;e.fillStyle=ua,e.beginPath(),e.moveTo(-o.headW,-20*o.headScale),e.bezierCurveTo(-o.headW,-o.headH-4,o.headW,-o.headH-4,o.headW,-20*o.headScale),e.bezierCurveTo(o.cheekW+1.5,-2,o.cheekW,14*o.headScale,o.jawW+3,34*o.headScale+ce*.45),e.bezierCurveTo(o.jawW-4,48*o.headScale+ce*.78,ba,ve-.8,0,ve+2.8),e.bezierCurveTo(-ba,ve-.8,-o.jawW+4,48*o.headScale+ce*.78,-o.jawW-3,34*o.headScale+ce*.45),e.bezierCurveTo(-o.cheekW,14*o.headScale,-o.cheekW-1.5,-2,-o.headW,-20*o.headScale),e.closePath(),e.fill(),e.strokeStyle=H(V,.28),e.lineWidth=1.25,e.stroke();let Lt=l.earrings||"none";if(Lt!=="none"&&l.earStyle!=="cyber"&&de!=="headscarf"){let A=Je(l.earringColor,[230,195,92]);for(let O of[-1,1]){let y=O*(o.headW+2.2*ye)-te*.42,I=11.5*ye;if(e.fillStyle=H(A),e.strokeStyle=H(A),Lt==="studs")e.beginPath(),e.arc(y,I,2.5*ye,0,Math.PI*2),e.fill();else if(Lt==="hoops")e.lineWidth=1.7*ye,e.beginPath(),e.arc(y+O*.8,I+6.5*ye,6*ye,0,Math.PI*2),e.stroke();else{let S=(n.lookX*1.8+K("shake")*Math.sin(u*13-.8)*3)*ye;e.lineWidth=1,e.beginPath(),e.moveTo(y,I),e.lineTo(y+S*.5,I+6*ye),e.stroke(),e.beginPath(),e.moveTo(y+S*.5,I+5*ye),e.quadraticCurveTo(y+S+3.6*ye,I+12*ye,y+S,I+14.5*ye),e.quadraticCurveTo(y+S-3.6*ye,I+12*ye,y+S*.5,I+5*ye),e.fill()}e.fillStyle="rgba(255, 255, 255, 0.55)",e.beginPath(),e.arc(y-.7*ye,I-.7*ye+(Lt==="drops"?11*ye:0),.9*ye,0,Math.PI*2),e.fill()}}let ma=e.createRadialGradient(-10+te*.5,-34*o.headScale,2,-6+te*.4,-32*o.headScale,29*o.headScale);ma.addColorStop(0,`rgba(255, 248, 244, ${.26+b*.22})`),ma.addColorStop(1,"rgba(255, 248, 244, 0)"),e.fillStyle=ma,e.beginPath(),e.ellipse(-6+te*.4,-32*o.headScale,28*o.headScale,15*o.headScale,-.1,0,Math.PI*2),e.fill(),e.save(),e.translate(te*.65,Oe*.6);let Kt=n.lipS*3.6+j*3.2-K("frown")*4.4,Ha=le(l.blushIntensity??.2,0,.65);if(Ha>.01)for(let A of[-1,1]){let O=A*29*o.headScale,y=9*o.headScale-Kt*.5,I=e.createRadialGradient(O,y,2,O,y,18*o.headScale);I.addColorStop(0,`rgba(232, 104, 116, ${Ha})`),I.addColorStop(1,"rgba(232, 104, 116, 0)"),e.fillStyle=I,e.beginPath(),e.arc(O,y,18*o.headScale,0,Math.PI*2),e.fill()}let Na=le(l.freckles??0,0,1);if(Na>.02){e.fillStyle=H(se(N,.62,.5),.2+Na*.42);let A=Math.round(xn.length*(.35+Na*.65));for(let O=0;O<A;O++){let[y,I,S]=xn[O];e.beginPath(),e.arc(y*o.headScale,I*o.headScale-Kt*.3,S*o.headScale,0,Math.PI*2),e.fill()}}let fa=le(l.ageLines??0,0,1);if(fa>.02){let A=o.headScale;e.strokeStyle=H(V,.16+fa*.4),e.lineCap="round",e.lineWidth=.9+fa*.5;for(let O of[-39,-45.5])e.beginPath(),e.moveTo(-17*A,O*A),e.quadraticCurveTo(0,(O-2.2)*A,17*A,O*A),e.stroke();for(let O of[-1,1]){for(let[y,I]of[[-3,5],[0,6],[3,5]])e.beginPath(),e.moveTo(O*35.5*A,(-12+y*.5)*A),e.lineTo(O*(35.5+I)*A,(-12+y*1.5)*A),e.stroke();e.beginPath(),e.moveTo(O*13*A,-4.5*A),e.quadraticCurveTo(O*22*A,-1.5*A,O*30*A,-5*A),e.stroke(),e.beginPath(),e.moveTo(O*12*A,12*A),e.quadraticCurveTo(O*23*A,21*A-Kt*.4,O*25*A,33*A-Kt*.6+ce*.3),e.stroke()}}l.beautyMark&&(e.fillStyle=H(se(V,.5),.82),e.beginPath(),e.arc(-17.5*o.headScale,24.5*o.headScale-Kt*.5+ce*.2,1.25*o.headScale,0,Math.PI*2),e.fill());let ga=l.browColor?Je(l.browColor,se(J,.85)):se(J,.85),bt=l.facialHair||"none";if(bt==="stubble"||bt==="beard"||bt==="goatee"){let A=bt==="stubble"?.22:.88;if(e.fillStyle=H(ga,A),e.beginPath(),bt==="goatee")e.ellipse(0,ve-9,16*o.headScale,14*o.headScale,0,0,Math.PI*2);else{let O=14*o.headScale;e.moveTo(-o.cheekW+2,O),e.quadraticCurveTo(-o.jawW+6,28*o.headScale+ce*.3,-18*o.headScale,25*o.headScale+ce*.25),e.quadraticCurveTo(0,22*o.headScale+ce*.22,18*o.headScale,25*o.headScale+ce*.25),e.quadraticCurveTo(o.jawW-6,28*o.headScale+ce*.3,o.cheekW-2,O),e.bezierCurveTo(o.cheekW,28*o.headScale,o.jawW+2,46*o.headScale+ce*.75,0,ve+3.5),e.bezierCurveTo(-o.jawW-2,46*o.headScale+ce*.75,-o.cheekW,28*o.headScale,-o.cheekW+2,O),e.closePath()}e.fill()}let wa=r-n.blinkStartMs,ho=wa>=0&&wa<145?Math.sin(wa/145*Math.PI):0,Ve=le(l.eyeSize??1,.75,1.38)*o.headScale,M=21.5*le(l.eyeSpacing??1,.8,1.24)*o.headScale,re=le(l.eyeTilt??.04,-.3,.35),be=le(n.pitchSt*.85+n.energy*2.4+K("browUp")*5.2,-2.5,8.5),Ye=le(l.eyeshadow??0,0,1),Me=Je(l.eyeshadowColor,[122,92,143]),Qe=Je(l.irisColor,[59,130,166]),Be=l.irisColor2?Je(l.irisColor2,Qe):Qe,dt=le(l.eyeliner??0,0,1);for(let A of[-1,1]){let O=A*M,y=-12.5*o.headScale,I=A===1?K("wink")*.94:0,S=Math.max(ho,I,K("shut")*.96),C=Math.max(.55,6.2*Ve*(1+z*.34)*(1-S*.94)),F=11.4*Ve,pe=-re*5.5,Ue=A===1?Be:Qe,xe=e.createRadialGradient(O,y-1,2,O,y-1,15*Ve);if(xe.addColorStop(0,H(V,.18)),xe.addColorStop(1,H(V,0)),e.fillStyle=xe,e.beginPath(),e.ellipse(O,y-1,15*Ve,11*Ve,0,0,Math.PI*2),e.fill(),Ye>.02){let Fo=e.createLinearGradient(O,y-C*1.5-7.5*Ve,O,y-C*.6);Fo.addColorStop(0,H(Me,0)),Fo.addColorStop(1,H(Me,.3+Ye*.5)),e.fillStyle=Fo,e.beginPath(),e.moveTo(O-A*(F+.5),y+.4),e.quadraticCurveTo(O-A*2,y-C*1.5-8.5*Ve,O+A*(F+3.2),y-1.2+pe),e.quadraticCurveTo(O,y-C*1.46,O-A*(F+.5),y+.4),e.closePath(),e.fill()}e.strokeStyle=H(V,.36),e.lineWidth=1.05,e.beginPath(),e.moveTo(O-A*F*.92,y-2.8-C*.52),e.quadraticCurveTo(O,y-5.8-C*.85,O+A*F*.95,y-2.6-C*.52+pe*.6),e.stroke(),e.save(),e.beginPath(),e.moveTo(O-A*F,y+.6),e.quadraticCurveTo(O,y-C*1.46,O+A*F,y+.4+pe),e.quadraticCurveTo(O,y+C*1.16,O-A*F,y+.6),e.closePath();let et=e.createLinearGradient(O,y-C,O,y+C);et.addColorStop(0,"#d6dce8"),et.addColorStop(.35,"#f9fafe"),et.addColorStop(1,"#ebeff7"),e.fillStyle=et,e.fill(),e.clip();let ft=O+n.lookX*3.2*Ve,Ht=y+n.lookY*2.1*Ve,Va=5.6*Ve,po=e.createRadialGradient(ft-1.2*Ve,Ht-1.4*Ve,.7*Ve,ft,Ht,Va);po.addColorStop(0,H(se(Ue,1.38))),po.addColorStop(.68,H(Ue)),po.addColorStop(1,H(se(Ue,.36))),e.fillStyle=po,e.beginPath(),e.arc(ft,Ht,Va,0,Math.PI*2),e.fill(),e.fillStyle="#090c14",e.beginPath(),e.arc(ft,Ht,2.45*Ve,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.95)",e.beginPath(),e.arc(ft-1.8*Ve,Ht-1.9*Ve,1.45*Ve,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.56)",e.beginPath(),e.arc(ft+1.9*Ve,Ht+1.5*Ve,.78*Ve,0,Math.PI*2),e.fill(),e.restore();let uo=l.lashStyle||"classic";e.strokeStyle="#17141f",e.lineWidth=(uo==="lush"?2.45:uo==="classic"?1.95:1.55)*Math.sqrt(Ve),e.lineCap="round",e.beginPath(),e.moveTo(O-A*(F+.3),y+.6),e.quadraticCurveTo(O,y-C*1.48,O+A*(F+(uo==="lush"?1.9:.4)),y+.3+pe-(uo==="lush"?1:0)),e.stroke(),dt>.02&&(e.strokeStyle=`rgba(23, 20, 31, ${.6+dt*.4})`,e.lineWidth=(1.2+dt*1.5)*Math.sqrt(Ve),e.beginPath(),e.moveTo(O+A*(F-3),y-.6+pe*.8),e.quadraticCurveTo(O+A*(F+1.5),y-.2+pe,O+A*(F+2.6+dt*3.6),y-1.4-dt*3+pe),e.stroke());let Gr=le(l.browThickness??1,.5,1.65),Kn=le(l.browArch??.2,-.2,.6)*10,za=y-(12.8+be)*o.headScale,Fn=3*Gr*o.headScale,Vn=-ae*3.6*o.headScale,Br=ae*1.5*o.headScale;e.fillStyle=H(ga),e.beginPath(),e.moveTo(O-A*(F+.5),za+1.8+Vn),e.quadraticCurveTo(O+A*2,za-3-Kn,O+A*(F+2.4),za+1.5+Br),e.quadraticCurveTo(O+A*2,za-3-Kn+Fn,O-A*F,za+1.8+Fn*.82+Vn),e.closePath(),e.fill()}let ra=le(l.noseLength??1,.76,1.28)*o.headScale,$e=le(l.noseWidth??1,.72,1.35)*o.headScale,tt=10.2*ra,Ea=e.createLinearGradient(-7*$e,-13,6*$e,tt+3);Ea.addColorStop(0,H(V,.05)),Ea.addColorStop(1,H(V,.26)),e.fillStyle=Ea,e.beginPath(),e.moveTo(1,-13*o.headScale),e.quadraticCurveTo(6.5*$e,1,9.2*$e,tt-.6),e.quadraticCurveTo(3*$e,tt+4.2,0,tt+3.2),e.closePath(),e.fill(),e.fillStyle=H(V,.3),e.beginPath(),e.moveTo(-9.2*$e,tt),e.quadraticCurveTo(0,tt+5.8,9.2*$e,tt),e.quadraticCurveTo(0,tt+3,-9.2*$e,tt),e.closePath(),e.fill(),e.fillStyle="rgba(56, 24, 20, 0.62)";for(let A of[-1,1])e.beginPath(),e.ellipse(A*4.5*$e,tt+1.1,2.2*$e,1.1,A*-.28,0,Math.PI*2),e.fill();if(l.noseStud){let A=Je(l.earringColor,[230,195,92]);e.fillStyle=H(A),e.beginPath(),e.arc(7.4*$e,tt-2.2,1.35,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.75)",e.beginPath(),e.arc(7*$e,tt-2.6,.5,0,Math.PI*2),e.fill()}e.strokeStyle=H(V,.38),e.lineWidth=1.2,e.beginPath(),e.arc(-6.3*$e,tt-.5,3.2*$e,Math.PI*.55,Math.PI*1.45),e.stroke(),e.beginPath(),e.arc(6.3*$e,tt-.5,3.2*$e,-Math.PI*.45,Math.PI*.45),e.stroke(),e.strokeStyle="rgba(255, 246, 240, 0.38)",e.lineWidth=2.1,e.lineCap="round",e.beginPath(),e.moveTo(-.8,-10*o.headScale),e.lineTo(-.9,tt-4.4),e.stroke(),e.fillStyle="rgba(255, 246, 240, 0.35)",e.beginPath(),e.ellipse(-.5,tt-1.4,3.1*$e,2.3,0,0,Math.PI*2),e.fill(),e.fillStyle=H(V,.14),e.beginPath(),e.ellipse(0,(tt+29*o.headScale)*.5,2.6,4.6*o.headScale,0,0,Math.PI*2),e.fill();let _a=30.8*o.headScale+ce*.3,Tt=le(l.mouthWidth??1,.76,1.3)*o.headScale,Ka=le(l.lipFullness??1,.65,1.52)*o.headScale,Xt=n.phone==="F"||n.phone==="V",Fa=n.lipR,Ko=n.lipS,Pr=Xt?Math.min(.68,n.lipC):n.lipC,_e=(20.2+Ko*8.6-Fa*7+j*1.8-K("frown")*1.2)*Tt,Gn=(1.1+n.jaw*21)*(1-Pr*.97)*o.headScale,Jt=Math.max(Xt?2.6*o.headScale:.24,Gn),ut=_a-Kt*.85+Fa*1.4,yt=_a-Jt*.44,vt=_a+Jt*.56,Ma=((Xt?4.1:5.6)+Fa*2.4-Ko*.8)*Ka,Ra=(4.4+Fa*2.1-Ko*.7)*Ka;if(e.fillStyle=H(V,.24),e.beginPath(),e.ellipse(0,vt+Ma+3,_e*.52,2.3,0,0,Math.PI*2),e.fill(),Jt>.78){e.save(),e.beginPath(),e.moveTo(-_e+1.4,ut),e.quadraticCurveTo(0,yt-2.1,_e-1.4,ut),e.quadraticCurveTo(0,vt+2.4,-_e+1.4,ut),e.closePath(),e.clip();let A=e.createLinearGradient(0,yt-4,0,vt+6);A.addColorStop(0,"#1c0b12"),A.addColorStop(.55,"#361320"),A.addColorStop(1,"#1d0911"),e.fillStyle=A,e.fillRect(-_e-4,yt-8,_e*2+8,Jt+18);let O=Math.max(n.tH*.72,n.tTip*.96),y=vt+2-O*(Jt*.88+3.4*o.headScale),I=_e*(n.tTip>.6?.58:.78),S=e.createRadialGradient(0,y+5,2,0,y+8,I);S.addColorStop(0,"#f5879b"),S.addColorStop(1,"#b84962"),e.fillStyle=S,e.beginPath(),e.ellipse(0,y+8,I,9.5*o.headScale,0,Math.PI,Math.PI*2),e.fill();let C=_e*.78,F=yt+(3.6-Fa*1.1)*o.headScale;e.fillStyle="#f7f6f1",e.beginPath(),e.roundRect(-C,yt-5,C*2,Math.max(1,F-(yt-5)),2.2),e.fill(),e.strokeStyle="rgba(155, 148, 138, 0.34)",e.lineWidth=.7;for(let pe of[-C*.48,0,C*.48])e.beginPath(),e.moveTo(pe,yt-4),e.lineTo(pe,F),e.stroke();if(Jt>5.4*o.headScale&&!Xt){let pe=vt-2.3*o.headScale+n.jaw*1.3;e.fillStyle="#eae8e1",e.beginPath(),e.roundRect(-C*.88,pe,C*1.76,6*o.headScale,1.8),e.fill()}e.restore()}let Bn=Je(l.lipColor,[214,104,124]);e.fillStyle=H(se(Bn,.82)),e.beginPath(),e.moveTo(-_e,ut),e.bezierCurveTo(-_e*.55,yt-Ra,-5.2*Tt,yt-Ra-1.6,0,yt-Ra+.9),e.bezierCurveTo(5.2*Tt,yt-Ra-1.6,_e*.55,yt-Ra,_e,ut),e.quadraticCurveTo(0,yt-(Jt<.9?0:1.5),-_e,ut),e.closePath(),e.fill();let Wa=Xt?-1.8*o.headScale:0;e.fillStyle=H(Bn),e.beginPath(),e.moveTo(-_e,ut),e.quadraticCurveTo(0,vt+(Jt<.9?.2:1.7)+Wa,_e,ut),e.bezierCurveTo(_e*.62,vt+Ma+Wa,-_e*.62,vt+Ma+Wa,-_e,ut),e.closePath(),e.fill(),e.strokeStyle="rgba(255, 238, 242, 0.40)",e.lineWidth=1.45,e.beginPath(),e.moveTo(-7.2*Tt,vt+Ma*.48+Wa),e.quadraticCurveTo(0,vt+Ma*.64+Wa,7.2*Tt,vt+Ma*.48+Wa),e.stroke();for(let A of[-1,1])e.fillStyle="rgba(68, 20, 32, 0.42)",e.beginPath(),e.arc(A*(_e+.35),ut,1.45,0,Math.PI*2),e.fill();let _n=le(l.dimples??0,0,1);if(_n>.02){e.strokeStyle=H(V,(.18+_n*.34)*le(.65+Kt*.1,.6,1.25)),e.lineWidth=1.3,e.lineCap="round";for(let A of[-1,1]){let O=A*(_e+5.4*o.headScale);e.beginPath(),e.moveTo(O-A*.6,ut-4.4*o.headScale),e.quadraticCurveTo(O+A*2.8,ut,O-A*.4,ut+4.8*o.headScale),e.stroke()}}if(Jt<1.25&&(e.strokeStyle="rgba(68, 20, 32, 0.66)",e.lineWidth=1.35,e.beginPath(),e.moveTo(-_e+1,ut),e.quadraticCurveTo(0,_a+.4,_e-1,ut),e.stroke()),bt==="mustache"||bt==="beard"||bt==="goatee"){e.fillStyle=H(se(ga,.97)),e.beginPath();let A=yt-Ra-2.2;e.moveTo(0,A-2.6),e.quadraticCurveTo(_e*.65,A-3.6,_e+2,ut-1.5),e.quadraticCurveTo(_e*.55,A+2.2,0,A+.8),e.quadraticCurveTo(-_e*.55,A+2.2,-_e-2,ut-1.5),e.quadraticCurveTo(-_e*.65,A-3.6,0,A-2.6),e.closePath(),e.fill()}let It=l.glasses||"none";if(It!=="none"){let A=Je(l.glassesColor,[31,36,48]),O=-11.5*o.headScale,y=16.5*Ve,I=11.8*Ve;if(It==="visor"){let S=e.createLinearGradient(-M-y,O-I,M+y,O+I);S.addColorStop(0,H(A,.58)),S.addColorStop(.5,"rgba(255, 255, 255, 0.35)"),S.addColorStop(1,H(A,.62)),e.fillStyle=S,e.strokeStyle=H(A,.95),e.lineWidth=1.8,e.beginPath(),e.roundRect(-M-y,O-I*.85,(M+y)*2,I*1.75,8),e.fill(),e.stroke()}else{let S=It==="shades";e.strokeStyle=H(A),e.lineWidth=It==="bold"?3:It==="cat_eye"?2.6:It==="round"||It==="aviator"?1.5:2.2;for(let C of[-1,1]){let F=C*M;e.fillStyle=S?H(A,.72):It==="aviator"?"rgba(120, 150, 170, 0.34)":"rgba(220, 238, 255, 0.11)",e.beginPath(),It==="round"?e.arc(F,O,y*.86,0,Math.PI*2):It==="cat_eye"?(e.moveTo(F-C*y*.9,O-I*.5),e.quadraticCurveTo(F,O-I*.86,F+C*y*1.12,O-I*1.02),e.quadraticCurveTo(F+C*y*1.02,O+I*.5,F+C*y*.3,O+I*.78),e.quadraticCurveTo(F-C*y*.86,O+I*.8,F-C*y*.9,O-I*.5),e.closePath()):It==="aviator"?(e.moveTo(F-C*y*.88,O-I*.62),e.quadraticCurveTo(F,O-I*.9,F+C*y*.98,O-I*.6),e.quadraticCurveTo(F+C*y*1.04,O+I*.6,F+C*y*.2,O+I*1),e.quadraticCurveTo(F-C*y*.84,O+I*.86,F-C*y*.88,O-I*.62),e.closePath()):e.roundRect(F-y*.92,O-I*.82,y*1.84,I*1.64,It==="bold"?4.5:6),e.fill(),e.stroke()}e.beginPath(),e.moveTo(-M+y*(It==="round"?.84:.9),O-1.5),e.quadraticCurveTo(0,O-4.2,M-y*(It==="round"?.84:.9),O-1.5),e.stroke()}}e.restore();let rt=l.hairStyle||"side_sweep";if(rt!=="none"){let A=["long_waves","sleek_bob","shoulder_lob","long_straight","braids"].includes(rt),O=rt==="quiff"||rt==="side_sweep"||rt==="pixie",y=rt==="quiff"?-1.38:rt==="pixie"?-1.18:-1.24,I=e.createLinearGradient(-26,-o.headH-24,26,-10);if(I.addColorStop(0,H(Ke(J,ue,.32))),I.addColorStop(.53,H(J)),I.addColorStop(1,H(se(J,.66))),e.fillStyle=I,e.save(),Ae(),e.beginPath(),A){let S=rt==="sleek_bob"?36*o.headScale:rt==="long_straight"?31*o.headScale:24*o.headScale;e.moveTo(-o.headW-7,-8),e.bezierCurveTo(-o.headW-13,-o.headH-25,o.headW+13,-o.headH-25,o.headW+7,-8),e.quadraticCurveTo(o.headW+4,14,o.headW-.5,S),e.bezierCurveTo(o.headW-1,-o.headH*.67,o.headW*.38,-o.headH*.48,-o.headW*.14,-o.headH*.84),e.bezierCurveTo(-o.headW*.28,-o.headH*.58,-o.headW*.91,-o.headH*.6,-o.headW+.5,S),e.quadraticCurveTo(-o.headW-4,14,-o.headW-7,-8)}else if(O)e.save(),e.scale(o.headW,o.headH),e.moveTo(-1.02,.08),e.bezierCurveTo(-1.18,-.62,-.85,y,-.23,y),e.bezierCurveTo(.46,y-.04,1.18,-.88,1.04,-.08),e.lineTo(.96,.12),e.quadraticCurveTo(.94,-.13,.76,-.37),e.quadraticCurveTo(.82,-.23,.79,-.18),e.bezierCurveTo(.62,-.46,.11,-.67,-.24,-.72),e.quadraticCurveTo(-.43,-.7,-.68,-.54),e.quadraticCurveTo(-.87,-.41,-.94,.06),e.restore();else if(rt==="curly_halo"||rt==="afro"){let S=rt==="afro"?1.7:1;e.moveTo(-o.headW-11*S,-6),e.bezierCurveTo(-o.headW-22*S,-o.headH-28*S,o.headW+22*S,-o.headH-28*S,o.headW+11*S,-6),e.quadraticCurveTo(o.headW-4,-36*o.headScale,18,-44*o.headScale),e.quadraticCurveTo(0,-39*o.headScale,-18,-44*o.headScale),e.quadraticCurveTo(-o.headW+4,-36*o.headScale,-o.headW-11*S,-6)}else if(rt==="buzz")e.fillStyle=H(J,.72),e.moveTo(-o.headW-1.5,-12),e.bezierCurveTo(-o.headW-4,-o.headH-8,o.headW+4,-o.headH-8,o.headW+1.5,-12),e.quadraticCurveTo(o.headW-5,-42*o.headScale,0,-46*o.headScale),e.quadraticCurveTo(-o.headW+5,-42*o.headScale,-o.headW-1.5,-12);else if(rt==="mohawk"){e.fillStyle=H(J,.55),e.moveTo(-o.headW-1.5,-12),e.bezierCurveTo(-o.headW-4,-o.headH-8,o.headW+4,-o.headH-8,o.headW+1.5,-12),e.quadraticCurveTo(o.headW-5,-42*o.headScale,0,-46*o.headScale),e.quadraticCurveTo(-o.headW+5,-42*o.headScale,-o.headW-1.5,-12),e.closePath(),e.fill(),e.fillStyle=I;let S=o.headW*.3,C=-o.headH-31;e.beginPath(),e.moveTo(-S,-43*o.headScale),e.bezierCurveTo(-S-5,-o.headH-6,-S-1,C+8,-S*.45,C),e.quadraticCurveTo(1,C-6,S*.6,C+3),e.bezierCurveTo(S+4,C+10,S+5,-o.headH-6,S,-43*o.headScale),e.quadraticCurveTo(0,-49*o.headScale,-S,-43*o.headScale)}else e.moveTo(-o.headW-5,-10),e.bezierCurveTo(-o.headW-10,-o.headH-15,-20,-o.headH-22,6,-o.headH-19),e.bezierCurveTo(32,-o.headH-16,o.headW+10,-o.headH-10,o.headW+5,-10),e.lineTo(o.headW,5),e.lineTo(o.headW-4,5),e.quadraticCurveTo(o.headW-4.5,-24,o.headW-10,-38*o.headScale),e.bezierCurveTo(o.headW*.6,-o.headH*.67,o.headW*.46,-o.headH*.67,o.headW*.31,-o.headH*.82),e.quadraticCurveTo(o.headW*.05,-o.headH*.6,-o.headW*.55,-o.headH*.65),e.bezierCurveTo(-36,-45*o.headScale,-o.headW+6,-30,-o.headW+4,5),e.lineTo(-o.headW,5);if(e.closePath(),e.fill(),rt!=="buzz"&&rt!=="mohawk"){if(e.save(),e.clip(),e.scale(o.headW,o.headH),e.fillStyle=H(Ke(J,ue,.4),.72),ge){e.fillStyle=H(Ke(J,ue,.29),.6);for(let[S,C,F]of[[-.84,-.6,-.8],[-.65,-.91,-.45],[-.36,-1.02,-.29],[.16,-1.02,.22],[.46,-.88,.52],[.76,-.75,.8]])e.save(),e.translate(S,C),e.rotate(F),e.beginPath(),e.moveTo(-.15,.04),e.bezierCurveTo(-.12,-.06,.04,-.13,.15,-.025),e.bezierCurveTo(.06,-.06,-.005,-.055,-.15,.04),e.fill(),e.restore()}else if(O)for(let[S,C]of[[-.92,-.24],[-.69,-.54],[.36,-.52],[.76,-.36],[.99,-.12]]){let F=-.38+S*.08;e.beginPath(),e.moveTo(F,y+.09),e.bezierCurveTo(F+S*.26,y+.37,S*.8,C-.24,S,C),e.bezierCurveTo(S*.72,C-.28,F+S*.16,y+.48,F,y+.09),e.fill()}else{let S=A?-.14:.31,C=A?-1.09:-1.25;for(let F of[-1,1])e.beginPath(),e.moveTo(S,C+.06),e.bezierCurveTo(S+F*.36,C-.06,F*1.01,-.86,F*1.02,-.19),e.bezierCurveTo(F*.91,-.85,S+F*.35,C+.09,S,C+.06),e.fill(),e.beginPath(),e.moveTo(S,C+.13),e.bezierCurveTo(S+F*.19,C+.26,F*.83,-.83,F*.96,-.43),e.bezierCurveTo(F*.72,-.76,S+F*.16,C+.31,S,C+.13),e.fill()}e.restore()}if(l.fringe&&rt!=="buzz"&&rt!=="mohawk"){let S=-o.headH*.82,C=-35*o.headScale,F=o.headW-3;e.beginPath(),e.moveTo(-F-2,S+10),e.quadraticCurveTo(0,S-6,F+2,S+10),e.lineTo(F,C+1);for(let pe=5;pe>=-5;pe--)e.lineTo(pe/5*F,C+(pe%2?2.2:0)+Math.abs(pe)*.35);e.closePath(),e.fill()}e.restore()}if(de!=="none"){let A=Je(l.headwearColor,[180,69,47]),O=-o.headH*.56,y=o.headW+(de==="headband"?5.5:7.5);if(de==="headband")e.strokeStyle=H(A),e.lineWidth=6.5*o.headScale,e.lineCap="round",e.beginPath(),e.moveTo(-y+1,O+8),e.quadraticCurveTo(0,O-15,y-1,O+8),e.stroke(),e.strokeStyle="rgba(255, 255, 255, 0.22)",e.lineWidth=1.4,e.beginPath(),e.moveTo(-y+5,O+4),e.quadraticCurveTo(0,O-17.5,y-5,O+4),e.stroke();else if(de==="beret"){let I=e.createLinearGradient(-y,-o.headH-26,y,O+8);I.addColorStop(0,H(se(A,1.18))),I.addColorStop(1,H(se(A,.72))),e.fillStyle=I,e.beginPath(),e.moveTo(-y+1,O+6),e.bezierCurveTo(-y-20,O-12,-o.headW*.9,-o.headH-30,-4,-o.headH-24),e.bezierCurveTo(o.headW*.9,-o.headH-19,y+9,O-12,y-1,O+6),e.quadraticCurveTo(0,O-6,-y+1,O+6),e.closePath(),e.fill(),e.fillStyle=H(se(A,.66)),e.beginPath(),e.moveTo(-y+1,O+6),e.quadraticCurveTo(0,O-6,y-1,O+6),e.quadraticCurveTo(0,O-1.5,-y+1,O+6),e.fill(),e.strokeStyle=H(se(A,.7)),e.lineWidth=2.2,e.lineCap="round",e.beginPath(),e.moveTo(-7,-o.headH-25),e.lineTo(-9.5,-o.headH-30.5),e.stroke()}else if(de==="headphones"){e.strokeStyle=H(se(A,.9)),e.lineWidth=5.2*o.headScale,e.lineCap="round",e.beginPath(),e.moveTo(-o.headW-5,-8),e.bezierCurveTo(-o.headW-9,-o.headH-22,o.headW+9,-o.headH-22,o.headW+5,-8),e.stroke();for(let I of[-1,1]){let S=I*(o.headW+3.5)-te*.42,C=e.createLinearGradient(S-7,-18,S+7,14);C.addColorStop(0,H(se(A,1.2))),C.addColorStop(1,H(se(A,.68))),e.fillStyle=C,e.beginPath(),e.roundRect(S-7.5,-18,15,33,7),e.fill(),e.fillStyle="rgba(15, 23, 42, 0.5)",e.beginPath(),e.roundRect(S-I*6.5-2,-14,4,25,2),e.fill()}}else if(de==="bow"){e.save(),e.translate(o.headW*.5,-o.headH-7),e.rotate(.3);for(let I of[-1,1]){let S=e.createLinearGradient(0,-10,I*18,10);S.addColorStop(0,H(se(A,.8))),S.addColorStop(1,H(se(A,1.16))),e.fillStyle=S,e.beginPath(),e.moveTo(0,0),e.bezierCurveTo(I*6,-13,I*20,-12,I*18,0),e.bezierCurveTo(I*20,12,I*6,13,0,0),e.fill()}e.fillStyle=H(se(A,.68)),e.beginPath(),e.roundRect(-3.8,-4.8,7.6,9.6,2.6),e.fill(),e.restore()}else if(de==="flower"){let I=-o.headW*.86,S=-o.headH*.5;e.fillStyle=H(A),e.strokeStyle=H(se(A,.7),.7),e.lineWidth=.7;for(let C=0;C<5;C++){let F=C/5*Math.PI*2-Math.PI/2;e.beginPath(),e.ellipse(I+Math.cos(F)*6.4,S+Math.sin(F)*6.4,5.4,3.7,F,0,Math.PI*2),e.fill(),e.stroke()}e.fillStyle="#f2c94c",e.beginPath(),e.arc(I,S,3.2,0,Math.PI*2),e.fill()}else if(de==="tiara"){let I=-o.headH*.93,S=o.headW*.64;e.fillStyle=H(A),e.strokeStyle=H(se(A,.66),.85),e.lineWidth=.8,e.beginPath(),e.moveTo(-S,I+5),e.quadraticCurveTo(0,I-4,S,I+5),e.lineTo(S-1,I+9),e.quadraticCurveTo(0,I,-S+1,I+9),e.closePath(),e.fill(),e.stroke();for(let[C,F]of[[-S*.5,7.5],[0,12.5],[S*.5,7.5]]){let pe=C===0?I+.5:I+1.6;e.beginPath(),e.moveTo(C-4.6,pe+1.6),e.lineTo(C,pe-F),e.lineTo(C+4.6,pe+1.6),e.closePath(),e.fill(),e.stroke()}e.fillStyle=H(v),e.beginPath(),e.arc(0,I-5.4,2.5,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.75)",e.beginPath(),e.arc(-.8,I-6.2,.8,0,Math.PI*2),e.fill()}else if(de==="fedora"){let I=O+5,S=o.headW+25,C=-o.headH-31,F=e.createLinearGradient(-y,C,y,I);F.addColorStop(0,H(se(A,1.18))),F.addColorStop(1,H(se(A,.74))),e.fillStyle=F,e.beginPath(),e.moveTo(-y+2,I),e.bezierCurveTo(-y-2,C+14,-o.headW*.62,C,-8,C+3),e.quadraticCurveTo(0,C+9,8,C+3),e.bezierCurveTo(o.headW*.62,C,y+2,C+14,y-2,I),e.closePath(),e.fill(),e.fillStyle=H(se(A,.48)),e.beginPath(),e.moveTo(-y+1,I-10),e.quadraticCurveTo(0,I-18,y-1,I-10),e.lineTo(y-2,I),e.quadraticCurveTo(0,I-9,-y+2,I),e.closePath(),e.fill();let pe=e.createLinearGradient(0,I-10,0,I+6);pe.addColorStop(0,H(se(A,1.06))),pe.addColorStop(1,H(se(A,.6))),e.fillStyle=pe,e.beginPath(),e.moveTo(-S,I+4),e.quadraticCurveTo(0,I-15,S,I+4),e.quadraticCurveTo(0,I-2,-S,I+4),e.closePath(),e.fill()}else if(de==="chef"){let I=O-17,S=-o.headH-46,C=e.createLinearGradient(-y,S,y,O+6);C.addColorStop(0,H(se(A,1.08))),C.addColorStop(1,H(se(A,.84))),e.fillStyle=C,e.beginPath(),e.moveTo(-y+2,I+2),e.bezierCurveTo(-y-22,I-6,-y-14,S+6,-o.headW*.42,S+6),e.bezierCurveTo(-o.headW*.3,S-8,o.headW*.3,S-8,o.headW*.42,S+6),e.bezierCurveTo(y+14,S+6,y+22,I-6,y-2,I+2),e.closePath(),e.fill(),e.strokeStyle=H(se(A,.66),.55),e.lineWidth=1;for(let F of[-.5,0,.5])e.beginPath(),e.moveTo(F*y,I-5+Math.abs(F)*4),e.quadraticCurveTo(F*y*1.25,S+26,F*y*1.05,S+14),e.stroke();e.fillStyle=H(se(A,.93)),e.beginPath(),e.moveTo(-y+1,O+6),e.lineTo(-y+2,I),e.quadraticCurveTo(0,I-9,y-2,I),e.lineTo(y-1,O+6),e.quadraticCurveTo(0,O-5,-y+1,O+6),e.closePath(),e.fill(),e.stroke()}else if(de==="headscarf"){let I=-o.headH*.64,S=-o.headH*1.36-10,C=ve+1,F=o.cheekW*.93,pe=e.createLinearGradient(-y,-o.headH-12,y,C+16);pe.addColorStop(0,H(se(A,1.16))),pe.addColorStop(.6,H(A)),pe.addColorStop(1,H(se(A,.74))),e.fillStyle=pe,e.beginPath(),e.moveTo(-o.headW-8,4),e.bezierCurveTo(-o.headW-13,S,o.headW+13,S,o.headW+8,4),e.bezierCurveTo(o.headW+9,34,o.jawW+12,C+6,o.neckHalfW+15,C+20),e.lineTo(-o.neckHalfW-15,C+20),e.bezierCurveTo(-o.jawW-12,C+6,-o.headW-9,34,-o.headW-8,4),e.closePath(),e.moveTo(0,I),e.bezierCurveTo(-F*1.02,I,-F*1.04,C-14,0,C),e.bezierCurveTo(F*1.04,C-14,F*1.02,I,0,I),e.closePath(),e.fill("evenodd"),e.strokeStyle=H(se(A,.66),.6),e.lineWidth=1.1,e.beginPath(),e.moveTo(-o.headW*.5,-o.headH*.93),e.quadraticCurveTo(-o.headW-1,-o.headH*.5,-o.headW-2,14),e.moveTo(o.headW*.5,-o.headH*.93),e.quadraticCurveTo(o.headW+1,-o.headH*.5,o.headW+2,14),e.stroke()}else{let I=de==="cap",S=-o.headH-(I?17:23),C=e.createLinearGradient(-y,S,y,O+10);if(C.addColorStop(0,H(se(A,1.2))),C.addColorStop(.6,H(A)),C.addColorStop(1,H(se(A,.7))),e.fillStyle=C,e.beginPath(),e.moveTo(-y,O+6),e.bezierCurveTo(-y-5,S+6,-o.headW*.5,S,0,S),e.bezierCurveTo(o.headW*.5,S,y+5,S+6,y,O+6),e.quadraticCurveTo(0,O-5,-y,O+6),e.closePath(),e.fill(),I){e.strokeStyle=H(se(A,.7),.55),e.lineWidth=1.1;for(let pe of[-.52,0,.52])e.beginPath(),e.moveTo(0,S+1),e.quadraticCurveTo(pe*y*1.25,S+12,pe*y,O+2-(1-pe*pe)*6),e.stroke();e.fillStyle=H(se(A,.78)),e.beginPath(),e.arc(0,S+1.2,2.8,0,Math.PI*2),e.fill();let F=e.createLinearGradient(0,O-4,0,O+17);F.addColorStop(0,H(se(A,.74))),F.addColorStop(1,H(se(A,.5))),e.fillStyle=F,e.beginPath(),e.moveTo(-y+.5,O+6),e.quadraticCurveTo(0,O-5,y-.5,O+6),e.bezierCurveTo(y+4,O+15,o.headW*.6,O+18,0,O+15),e.bezierCurveTo(-o.headW*.6,O+18,-y-4,O+15,-y+.5,O+6),e.closePath(),e.fill()}else{let F=12*o.headScale;e.fillStyle=H(se(A,.84)),e.beginPath(),e.moveTo(-y-1.5,O+7),e.quadraticCurveTo(0,O-5,y+1.5,O+7),e.lineTo(y+1.5,O+7-F),e.quadraticCurveTo(0,O-5-F,-y-1.5,O+7-F),e.closePath(),e.fill(),e.strokeStyle=H(se(A,.62),.7),e.lineWidth=1.1;for(let pe=-6;pe<=6;pe++){let Ue=pe/6.5*y,xe=(1-(Ue/y)**2)*12;e.beginPath(),e.moveTo(Ue,O+7-xe-.5),e.lineTo(Ue,O+7-xe-F+.5),e.stroke()}}}}if(l.headsetMic){let A=o.headW-.5-te*.42;e.strokeStyle="#1e293b",e.lineWidth=2.2,e.lineCap="round",e.beginPath(),e.moveTo(A+2,-2),e.quadraticCurveTo(A-2,29*o.headScale+ce*.25,22*o.headScale+te*.5,34*o.headScale+ce*.3),e.stroke(),e.fillStyle="#0f172a",e.beginPath(),e.ellipse(A+2.5,-2,4.2,8.5,0,0,Math.PI*2),e.fill();let O=21*o.headScale+te*.5,y=34*o.headScale+ce*.3;e.fillStyle="#1e293b",e.beginPath(),e.ellipse(O,y,4.2,2.8,-.15,0,Math.PI*2),e.fill(),n.energy>.06&&(e.fillStyle=H(v,Math.min(.95,.35+n.energy*.8)),e.beginPath(),e.arc(O-1.5,y,1.5,0,Math.PI*2),e.fill())}if(i.showVoiceWaves&&n.energy>.08)for(let A=0;A<2;A++){let O=(n.wavePhase+A*.5)%1,y=30*o.headScale+O*24,I=(1-O)*Math.min(.42,n.energy*.48);e.strokeStyle=H(v,I),e.lineWidth=1.5,e.beginPath(),e.arc(te*.65,31*o.headScale+ce*.3,y,-.42,.42),e.stroke(),e.beginPath(),e.arc(te*.65,31*o.headScale+ce*.3,y,Math.PI-.42,Math.PI+.42),e.stroke()}if(e.restore(),e.restore(),i.showSculptHandles){let A=xr(t,a,l),O=i.activeSculptId||"",y=i.hoverSculptId||"",I=Math.max(1,Math.min(t,a)/340);e.save();for(let S of A){let C=S.id===O||S.id===y,F=(C?9.5:7)*I;if(S.mirrorX!==void 0&&(e.save(),e.setLineDash([3*I,4*I]),e.strokeStyle=C?"rgba(56, 189, 248, 0.55)":"rgba(255, 255, 255, 0.16)",e.lineWidth=1.1*I,e.beginPath(),e.moveTo(S.mirrorX,S.y),e.lineTo(S.x,S.y),e.stroke(),e.restore(),e.beginPath(),e.arc(S.mirrorX,S.y,F*.85,0,Math.PI*2),e.fillStyle=C?"#38bdf8":"rgba(15, 23, 42, 0.72)",e.fill(),e.strokeStyle="#ffffff",e.lineWidth=1.7*I,e.stroke()),e.beginPath(),e.arc(S.x,S.y,F+4.5*I,0,Math.PI*2),e.fillStyle=C?"rgba(56, 189, 248, 0.28)":"rgba(56, 189, 248, 0.14)",e.fill(),e.beginPath(),e.arc(S.x,S.y,F,0,Math.PI*2),e.fillStyle=C?"#38bdf8":"#0ea5e9",e.fill(),e.strokeStyle="#ffffff",e.lineWidth=2*I,e.stroke(),C){e.font=`600 ${Math.round(11.5*I)}px system-ui, -apple-system, sans-serif`;let pe=e.measureText(S.label).width+16*I,Ue=22*I,xe=le(S.x-pe*.5,6*I,t-pe-6*I),et=S.y>44*I?S.y-32*I:S.y+16*I;e.fillStyle="rgba(15, 23, 42, 0.92)",e.beginPath(),e.roundRect(xe,et,pe,Ue,6*I),e.fill(),e.strokeStyle="rgba(56, 189, 248, 0.65)",e.lineWidth=1*I,e.stroke(),e.fillStyle="#f8fafc",e.fillText(S.label,xe+8*I,et+Ue*.68)}}e.restore()}}var Oo=2*Math.PI,en=([e,t,a])=>{let s=Math.hypot(e,t,a)||1;return[e/s,t/s,a/s]},tn=([e,t,a],[s,n,r])=>[t*r-a*n,a*s-e*r,e*n-t*s],an=(e,t)=>e.map((a,s)=>a-t[s]),Yt=e=>Number.parseInt(e.slice(1),16);function Ft(e,t,a){let s=e>>16,n=e>>8&255,r=e&255;return Math.round(s+((t>>16)-s)*a)<<16|Math.round(n+((t>>8&255)-n)*a)<<8|Math.round(r+((t&255)-r)*a)}function P(e,t,a){return"#"+Ft(Yt(e),Yt(t),a).toString(16).padStart(6,"0")}function on(e,t,a=!1){let s=[];for(let n=0;n<e-1;n++)for(let r=0;r<t;r++){let i=n*t+r,l=n*t+(r+1)%t,p=i+t,h=l+t;s.push(...a?[[i,p,l],[l,p,h]]:[[i,l,p],[l,h,p]])}return s}function ds(e,t,a,s){let n=e.length,r=n+a;e.push(...e.slice(0,a),...e.slice(-a));for(let i=1;i<a-1;i++)s?t.push([n,n+i,n+i+1],[r,r+i+1,r+i]):t.push([n,n+i+1,n+i],[r,r+i,r+i+1])}var La=class{constructor(){ka(this,"data",[]);ka(this,"indices",[]);ka(this,"parts",[]);ka(this,"finish",0);ka(this,"scale",1)}markPart(t){this.parts.push({start:this.data.length/10,name:t})}mesh(t,a,s,n=t,r=null){let i=t.map(()=>[0,0,0]);for(let[h,c,o]of a){let u=tn(an(n[c],n[h]),an(n[o],n[h]));for(let d of[h,c,o])for(let m=0;m<3;m++)i[d][m]+=u[m]}let l=typeof s=="string"?Yt(s):null,p=this.data.length/10;for(let h=0;h<t.length;h++){let[c,o,u]=t[h],d=l??s[h],m=(d>>16)/255,g=(d>>8&255)/255,f=(d&255)/255,E=r?r[h]:0;this.data.push(c*this.scale,o*this.scale,u*this.scale,...en(i[h]),m*(1-.62*E),g*(1-E),f*(1-.86*E),this.finish)}for(let[h,c,o]of a)this.indices.push(p+h,p+c,p+o)}ellipsoid(t,a,s,{rotation:n=[0,0,0],sides:r=20,rings:i=12}={}){let l=[],[p,h,c]=t,[o,u,d]=a,[m,g,f]=n.map(Math.sin),[E,T,b]=n.map(Math.cos);for(let N=0;N<=i;N++){let k=Math.PI*(N/i-.5);for(let _=0;_<r;_++){let V=Oo*_/r,J=o*Math.cos(k)*Math.sin(V),ue=u*Math.sin(k),L=d*Math.cos(k)*Math.cos(V),U=ue*E-L*m,v=ue*m+L*E,R=J*T+v*g;l.push([p+R*b-U*f,h+R*f+U*b,c+v*T-J*g])}}this.mesh(l,on(i+1,r),s)}loft(t,a,{sides:s=28,pleat:n=0}={}){let r=[];for(let[p,h,c,o=0,u=0]of t)for(let d=0;d<s;d++){let m=d*Oo/s,g=1+n*Math.cos(12*m);r.push([u+h*Math.sin(m)*g,p,o+c*Math.cos(m)*g])}let i=t[1][0]<t[0][0],l=on(t.length,s,i);ds(r,l,s,i),this.mesh(r,l,a)}tube(t,a,s,{sides:n=10}={}){let r=[];for(let l=0;l<t.length;l++){let p=en(an(t[Math.min(t.length-1,l+1)],t[Math.max(0,l-1)])),h=en(tn(p,Math.abs(p[2])<.94?[0,0,1]:[0,1,0])),c=tn(h,p),o=Array.isArray(a)?a[l]:a,[u,d]=Array.isArray(o)?o:[o,o];for(let m=0;m<n;m++){let g=Math.cos(Oo*m/n)*u,f=Math.sin(Oo*m/n)*d;r.push(t[l].map((E,T)=>E+g*h[T]+f*c[T]))}}let i=on(t.length,n,!0);ds(r,i,n,!0),this.mesh(r,i,s)}};var Nt=Math.PI,nt=(e,t,a)=>e+(t-e)*a,ms=e=>Math.max(0,Math.min(1,e)),us=e=>(e=ms(e),e*e*(3-2*e));function mt(e,t,a,s,n,r){let i=[],l=[];for(let p=0;p<=s;p++)for(let h=0;h<=a;h++)if(i.push(n(h/a,p/s)),p&&h){let c=p*(a+1)+h,o=c-a-1,u=o-1,d=c-1;t>0?l.push([u,d,o],[o,d,c]):l.push([u,o,d],[o,c,d])}e.mesh(i,l,r)}var Ta=(e,t)=>Array.from({length:e+1},(a,s)=>t(s/e));function fs(e,t,a,s,n,r,i,l,p){let h=t==="court_high_tops",c=t==="slingback_pumps",o=t==="brogue_oxfords";if(!h&&!c&&!o)return!1;let{shoeColor:u,shoeTrim:d,shoeSole:m}=a,g=P(u,"#2e2331",.36),f=P(m,d,.42),E=h?.188:c?.164:.18,T=h?.7:c?.73:.65,b=h?-.187:-.167,N=b+T,k=c?.245:o?.063:0,_=h?.091:c?.028:.047,V=(w,Y,j)=>[n*(r+w+.08*j),i+l*Y,j],J=w=>k*(1-us((w-.16)/.48)),ue=w=>nt(b,N,w),L=w=>{let Y=Math.max(.007,Math.sin(Nt*ms(w)))**(c?.66:.42),j=1-.12*Math.exp(-(((w-.43)/.14)**2))+.15*Math.exp(-(((w-.72)/.17)**2));return E*Y*j*(c?1-.64*us((w-.63)/.37):1)},U=(w,Y,j,ae=0)=>V(w*(L(Y)+ae),J(Y)+j,ue(Y)),v=w=>(.068+.094*(1-w)+.105*Math.exp(-(((w-.41)/.22)**2)))*(.25+.75*Math.max(0,Math.sin(Nt*w))**.24),R=(w,Y,j=0)=>V((1+j)*w*L(Y),J(Y)+_+.029+v(Y)*Math.sqrt(Math.max(0,1-w*w))+.54*j,ue(Y)),D=(w,Y,j=0)=>{let ae=2*Nt*w;return U(Math.sign(Math.sin(ae)),(1+Math.cos(ae))/2,Y,j)};mt(e,n,64,2,(w,Y)=>D(w,nt(.009,_,Y),.004*Math.sin(Nt*Y)),m),mt(e,-n,12,36,(w,Y)=>U(2*w-1,Y,.009),m),e.tube(Ta(72,w=>D(w,_-.006,.003)),h?.009:.006,f,{sides:7});let K=b+.065;if(k){let w=c?.029:.107,Y=c?.034:.085,j=(ae,z)=>V((w+z*(c?.038:.009))*Math.sin(ae),nt(.009,k+_,z),K+z*(c?.026:0)+(Y+.014*z)*Math.cos(ae));mt(e,n,30,5,(ae,z)=>j(2*Nt*ae,z),m),mt(e,-n,28,1,(ae,z)=>V(w*z*Math.sin(2*Nt*ae),.009,K+Y*z*Math.cos(2*Nt*ae)),m),o&&e.tube(Ta(32,ae=>j(2*Nt*ae,.45)),.006,f,{sides:6})}mt(e,n,64,2,(w,Y)=>D(w,_+.03*Y),c?d:u),c&&!s?mt(e,n,20,32,(w,Y)=>U((2*w-1)*.99,Y,_+.031),P(u,d,.35)):mt(e,n,28,42,(w,Y)=>R(2*w-1,Y),c?s:u);let Q=(w,Y,j,ae,z,te)=>e.tube(Ta(14,de=>R(nt(j,ae,de),nt(w,Y,de),.014+.006*Math.sin(Nt*de))),te,z,{sides:7}),oe=(w,Y,j,ae)=>e.ellipsoid(R(w,Y,.014),[j,.55*j,j],ae,{sides:9,rings:5});if(c){let w=ae=>.605-.34*Math.abs(ae)**2;mt(e,n,30,25,(ae,z)=>{let te=2*ae-1;return R(te,nt(w(te),1,z),.012)},u),e.tube(Ta(38,ae=>{let z=2*ae-1;return R(z,w(z),.015)}),.009,d,{sides:7});let Y=(ae,z=0)=>V(.137*Math.sin(ae),k+.145+.037*Math.cos(ae)+z,.01-.159*Math.cos(ae));mt(e,n,40,2,(ae,z)=>Y(nt(-2.16,2.16,ae),.027*z),u);let j=Y(1.59,.014);e.ellipsoid(j,[.014,.028,.029],d,{sides:10,rings:8});for(let ae of[-1,1])mt(e,n,8,14,(z,te)=>{let de=Math.sin(Nt*te)**.65;return R(ae*(.045+.65*te),.69+.038*te+(z-.5)*.145*de,.044+.044*de)},d);return e.ellipsoid(R(0,.695,.064),[.032,.027,.023],d,{sides:14,rings:7}),!0}if(h){let Y=(ae,z,te=0)=>{let de=2*Nt*ae,Te=(1+Math.cos(de))*.5,Ne=nt(.175,.58-.06*Te,z),Ae=p(3.58-Ne),Oe=nt(.157,Ae.rx+.033,z),ce=nt(.185,Ae.rz+.033,z);return V(Ae.x-r+(Oe+te)*Math.sin(de),Ne,Ae.z+.018*(1-z)+(ce+te)*Math.cos(de))};mt(e,n,48,12,(ae,z)=>Y(ae,z),u),mt(e,n,48,4,(ae,z)=>Y(ae,nt(.73,.96,z),.006),P(u,d,.3)),e.tube(Ta(54,ae=>Y(ae,1,.005)),.019,d,{sides:9}),mt(e,n,25,15,(ae,z)=>R(2*ae-1,nt(.77-.043*(2*ae-1)**2,1,z),.012),d);for(let ae of[-1,1])mt(e,n,22,3,(z,te)=>{let de=nt(.21,.73,z),Te=nt(.9,.65+.15*Math.cos(z*Nt),te);return R(ae*Te,de,.02)},P(d,u,.26));let j=(ae,z)=>V(ae*.065,.22+.315*z,.238-.105*z);mt(e,n,9,13,(ae,z)=>j(2*ae-1,z),g);for(let ae=0;ae<4;ae++){let z=.06+.22*ae;for(let te of[-1,1])e.tube(Ta(9,de=>{let Te=j(te*nt(-1,1,de),z+.17*de);return Te[2]+=.012+.013*Math.sin(Nt*de),Te}),.01,d,{sides:7})}}else{let w=Y=>.62+.12*Math.exp(-((Y/.28)**2))-.19*Math.abs(Y)**2;mt(e,n,30,22,(Y,j)=>{let ae=2*Y-1;return R(ae,nt(w(ae),1,j),.012)},P(u,d,.24)),e.tube(Ta(30,Y=>{let j=2*Y-1;return R(j,w(j),.023)}),.005,g,{sides:6});for(let Y=0;Y<17;Y++){let j=nt(-.92,.92,Y/16);oe(j,w(j)+.027,.0085,g)}for(let Y of[-1,1]){mt(e,n,6,18,(j,ae)=>R(Y*nt(.25,.9,j),nt(.16,.57-.07*j,ae),.013),u);for(let j of[.33,.4,.47])oe(Y*.31,j,.014,g),Q(j,j+.033,Y*.29,-Y*.29,d,.008)}for(let[Y,j]of[[0,.85],[-.18,.82],[.18,.82],[-.34,.8],[.34,.8]])oe(Y,j,.009,g)}return!0}var ai=Math.PI*2,wt=(e,t,a)=>e+(t-e)*a;function at(e,t,a,{flip:s=!1,capTop:n=!1,capBottom:r=!1,pleats:i=0}={}){let l=t[0].length,p=[],h=[];for(let u=1;u<t.length;u++)for(let d=0;d<l;d++){let m=(u-1)*l+d,g=(u-1)*l+(d+1)%l,f=m+l,E=g+l,T=d*i/l%1;(i&&T>=.26&&T<.43?h:p).push([m,f,g],[g,f,E])}let c=(u,d,m,g)=>{if(g)for(let f of d)[f[1],f[2]]=[f[2],f[1]];e.mesh(u,d,m)},o=t.flat();c(o,p,a,s),h.length&&c(o,h,P(a,"#55344b",.19),s);for(let[u,d,m]of[[n,t[0],s],[r,t.at(-1),!s]]){if(!u)continue;let g=[0,1,2].map(E=>d.reduce((T,b)=>T+b[E],0)/l),f=[];for(let E=0;E<l;E++)f.push([l,E,(E+1)%l]);c([...d,g],f,P(a,"#3c2f40",.12),m)}}function ia(e,t){return Array.from({length:e},(a,s)=>t(s*ai/e))}function nn(e,t){let a=e.thighWidth??1,s=e.calfWidth??1,n=.87+.13*t/.84,r=[[-.2,.35*a,.34*a,-.01],[.15,.362*a,.355*a,-.013],[.52,.337*a,.327*a,.001],[.94,.28*a,.276*a,.025],[1.26,.233*a,.227*a,.036],[1.47,.185*a,.189*a,.041],[1.62,.176,.179,.055],[1.76,.165,.158,.041],[1.95,.179*s,.178*s,.001],[2.19,.213*s,.218*s,-.045],[2.39,.221*s,.226*s,-.058],[2.65,.197*s,.197*s,-.062],[2.91,.15*s,.161*s,-.033],[3.15,.11*s,.128*s,-.014],[3.31,.106*s,.12*s,-.002],[3.48,.116*s,.13*s,.01]];return i=>{let l=0;for(;l<r.length-2&&i>r[l+1][0];)l++;let p=r[Math.max(0,l-1)],h=r[l],c=r[l+1],o=r[Math.min(r.length-1,l+2)],u=c[0]-h[0],d=Math.max(0,Math.min(1,(i-h[0])/u)),m=d*d,g=m*d,f=[1,2,3].map(T=>(2*g-3*m+1)*h[T]+(g-2*m+d)*u*(c[T]-p[T])/(c[0]-p[0])+(3*m-2*g)*c[T]+(g-m)*u*(o[T]-h[T])/(o[0]-h[0])),E=f[0]*n;return{x:Math.max(t*(.48+.039*i),E+.01),rx:E,rz:f[1]*n,z:f[2]}}}function ya(e,t,a=.12){let s=Math.max(1,Math.ceil((t-e)/a));return Array.from({length:s+1},(n,r)=>wt(e,t,r/s))}function oi(e,t,a,s,n,r=0){let{x:i,rx:l,rz:p,z:h}=e(n);return ia(32,c=>[s*(i+(l+r)*Math.sin(c)),t-n*a,h+(p+r)*Math.cos(c)])}function ni(e,t,a,s,n,r,i,l,p){if(t==="barefoot"){e.ellipsoid([n*r,i+.115*l,.082],[.136,.115*l,.29],s,{rotation:[0,n*.07,0],sides:24,rings:12});return}let h=a.shoeColor||"#3f3240",c=a.shoeTrim||P(h,"#fff8f4",.4),o=a.shoeSole||P(h,"#1e1525",.45);if(fs(e,t,{shoeColor:h,shoeTrim:c,shoeSole:o},s,n,r,i,l,p))return;let u=["ankle","heels","knee_boots"].includes(t),d=t==="strappy"||t==="heels",m=d?.18:u?.075:0,g=t==="sneakers"||t==="mary_janes"?.064:.037,f=d?.65:t==="slippers"?.61:.59,E=t==="slippers"||t==="sneakers"?.19:.165,T=(U,v,R)=>[n*(r+U+.08*R),i+v*l,R],b=(U,v)=>{let R=Math.cos(U),D=1+.12*R;return[E*D*Math.sin(U)*v,.115+R*f*.5*v]},N=U=>m*Math.max(0,Math.min(1,(.23-U)/.29)),k=(U,v)=>ia(36,R=>{let[D,K]=b(R,U);return T(D,N(K)+v(R),K)}),_=k(1,()=>g),V=k(.98,()=>.009);if(at(e,[_,V],o,{flip:n<0,capBottom:!0}),t!=="slippers"&&e.tube([..._,_[0]],.006,P(o,c,.43),{sides:6}),m){let U=t==="strappy"?.035:.074;e.tube([T(0,.013,-.124),T(0,m+.02,-.108)],[[U,U*.88],[U*1.2,U]],o,{sides:16})}let J=(U,v)=>k(U,R=>g+v+.018*Math.cos(R)),ue=["strappy","flats","mary_janes","slippers"].includes(t);if(ue&&!s)at(e,[J(.95,.025),_],P(h,c,.32),{flip:n<0,capTop:!0});else if(ue){let U=T(0,g+.097+m*.67,.074);e.ellipsoid(U,[E*.84,(.12+m*.3)*l,.236],s,{rotation:[.17+m*.8,n*.07,0],sides:26,rings:12})}if(t!=="strappy"){let U=ia(36,v=>{let[,R]=b(v,1),D=(1+Math.cos(v))/2,Q=ue||t==="loafers"?.059+.075*D**2:.13+.14*(1-D),oe=t==="slippers"?.9:.85,[w]=b(v,oe);return T(w,N(R)+g+Q,.014+(R-.014)*oe)});if(at(e,[U,J(.995,.027),_],h,{flip:n<0}),u||t==="sneakers"||t==="loafers"||t==="slippers"){let v=J(.45,u||t==="sneakers"?.185:.122);at(e,[v,U],h,{flip:n<0}),e.ellipsoid(T(0,g+.12+m*.33,.11),[E*.71,.08*l,.2],h,{sides:20,rings:9})}else e.ellipsoid(T(0,g+.071,.255),[E*.9,.085*l,.152],h,{sides:22,rings:10}),e.tube([...U,U[0]],.009,c,{sides:6})}let L=(U,v,R,D=.101,K=0)=>{let Q=ya(0,1,.08).map(oe=>T((oe-.5)*E*1.8,g+.08+N(U)+D*Math.sin(Math.PI*oe),U+(oe-.5)*K));e.tube(Q,v,R,{sides:8})};if(u){let U=t==="knee_boots"?1.59:t==="heels"?.85:.64,v=Math.ceil((U-.15)/.09),R=oe=>{let w=p(3.58-oe);return ia(32,Y=>T(w.x-r+(w.rx+.024)*Math.sin(Y),oe,w.z+(w.rz+.033)*Math.cos(Y)))},D=Array.from({length:v+1},(oe,w)=>R(wt(U,.15,w/v)));at(e,D,h,{flip:n<0,capTop:!0}),e.tube([...D[0],D[0][0]],.012,c,{sides:6});let K=R(.39);e.tube([...K,K[0]],.023,o,{sides:7});let Q=K[8];e.ellipsoid(Q,[.014,.038*l,.04],c,{sides:10,rings:6}),e.tube(D.map(oe=>oe[16]),.008,o,{sides:5})}else if(t==="sneakers"){for(let v of[.046,.104,.162])L(v,.011,c,.148,.052),L(v,.011,c,.149,-.052);let U=ya(-1,1,.12).map(v=>T(.095*v,.219-.047*v*v,-.126+.035*v*v));e.tube(U,.016,c,{sides:7})}else if(t==="mary_janes"||t==="loafers"){if(L(.092,t==="mary_janes"?.027:.022,t==="loafers"?c:h,.139),t==="mary_janes"){let U=[[0,.01],[.035,.01],[.035,.07],[0,.07],[0,.01]].map(([v,R])=>T(E*.88,.145+v,.052+R));e.tube(U,.009,c,{sides:7})}}else if(t==="strappy"){L(.245,.022,h);let U=ia(20,v=>T(.117*Math.sin(v),.36,.125*Math.cos(v)));e.tube([...U,U[0]],.02,c,{sides:7})}else if(t==="flats")for(let U of[-1,1])e.ellipsoid(T(U*.038,.178,.207),[.049,.023,.026],c,{rotation:[0,0,U*.35]});else t==="slippers"&&e.ellipsoid(T(0,.233,.203),[.087,.056,.078],c,{sides:14,rings:8})}function gs(e){let t=[e[0]],a=(n,r)=>(e[n+1][r]-e[n][r])/(e[n][0]-e[n+1][0]),s=(n,r)=>{if(n===0)return a(0,r);if(n===e.length-1)return a(n-1,r);let i=a(n-1,r),l=a(n,r);return i*l>0?2*i*l/(i+l):0};for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],l=r[0]-i[0],p=Math.max(1,Math.ceil(l/.15));for(let h=1;h<=p;h++){let c=h/p,o=c*c,u=o*c,d=[wt(r[0],i[0],c)];for(let m=1;m<r.length;m++)d.push((2*u-3*o+1)*r[m]+(u-2*o+c)*l*s(n,m)+(3*o-2*u)*i[m]+(u-o)*l*s(n+1,m));t.push(d)}}return t}function si(e,t,a,s,n,r,i,l,p,h,c,o){let u=t==="halter_gown",d=t==="one_shoulder_dress",m=u?3.29:2.11,g=p-m*h,f=[[...n,0,0],[...r,.002,0],[c(1.94),wt(r[1],i,.68),wt(r[2],l,.68),.004,0],[c(2.18),i,l,.008,0],[p,i*(u?1.015:1.08),l*1.07,.012,0],[p-.82*h,i*(u?.97:1.23),l*(u?1.01:1.33),.025,.06],[p-1.48*h,i*(u?.88:1.39),l*(u?.93:1.49),.039,.1]];u&&f.push([p-2.18*h,i*.91,l,.048,.17],[p-2.69*h,i*1.13,l*1.43,.07,.25]);let E=i*(u?1.58:1.54),T=l*(u?1.98:1.69),b=[g,E,T,u?.095:.073,u?.41:.18],N=[g+.038*h,E*.989,T*.989,b[3],b[4]],k=u?8:10,_=([ue,L,U,v,R],D,K=0)=>{let Q=1+v*Math.cos(k*D+R),oe=u?(v/b[3])**3*.078*(1-Math.cos(D))*h:0,w=Math.sin(D),Y=Math.cos(D),j=d?(v/b[3])**2*(.18+.38*w+.17*Y)*h:0;return o([(L*Q+K)*w,ue-oe+j,(U*Q+K)*Y],w,Y)},V=gs([...f.slice(1),N]),J=[f[0],...V,b].map(ue=>ia(96,L=>_(ue,L)));if(at(e,J.slice(0,2),P(a,s,u?.1:.3)),at(e,J.slice(1,-1),a),at(e,J.slice(-2),P(a,s,u?.2:.45),{capBottom:!0}),d){let ue=n[0]-g,L=V.map(U=>{let v=Math.max(0,(n[0]-U[0])/ue);return _(U,-1.1+2.13*v**1.34,.015)});e.tube(L,.014,P(a,s,.5),{sides:8})}else if(!u)for(let ue of[-.43,.43,Math.PI-.43,Math.PI+.43]){let L=V.map(U=>_(U,ue,.006));e.tube(L,.006,P(a,"#483545",.26),{sides:6})}return d?m-.76:m}function Es(e,t,{hip:a,leg:s,floor:n,waist:r,hips:i,hipDepth:l,y:p,shapeContour:h,dress:c,finish:o},{garmentOnly:u=!1}={}){let d=t.wardrobe||{},m=d.bottom||"trousers",g=c?t.outfitPrimary:d.bottomColor||P(t.outfitPrimary,"#241c30",.42),f=c?t.outfitAccent:d.bottomAccent||t.outfitAccent,E=d.shoes||"loafers",T=d.legwear||"none",b=nn(t,i),N=b(.1),k=Math.max(i+.036,N.x+N.rx+.035),_=Math.max(l+.052,N.rz+.075),V=c||/skirt|tennis/.test(m),J={briefs:.18,denim:.55,lounge_shorts:.58,biker_shorts:1.03,court_shorts:1.22}[m],ue={knee_boots:1.59,heels:.85,ankle:.64,court_high_tops:.52}[E]||0,L=3.58-(ue||.145),v=J??(ue?L:3.31),R=p(1.57),D=p(1.7),K=[R,r+.045,.385],Q=[D,r+.075,.407],oe=z=>t.waistDefinition||t.hipCurve||t.bellyFullness?gs(z):z,w=m==="tennis"?20:14,Y=([z,te,de],Te=0)=>ia(w*8,Ne=>{let Ae=1+Te*Math.cos(w*Ne),Oe=Math.sin(Ne),ce=Math.cos(Ne);return h([te*Ae*Oe,z,de*Ae*ce],Oe,ce)});e.finish=o;let j=["sweetheart_dress","halter_gown","one_shoulder_dress"].includes(t.outfitStyle);if(e.markPart("skirt"),j)v=si(e,t.outfitStyle,g,f,K,Q,k,_,a,s,p,h);else if(V){v=c?t.outfitStyle==="sweater_dress"?.73:.97:m==="midi_skirt"?2.09:m==="tennis"?.41:.56;let z=["skirt","midi_skirt","tennis"].includes(m)&&!c,te=t.outfitStyle==="bodycon"?.008:z?.074:.023,de=t.outfitStyle==="bodycon"?1.07:m==="tennis"?1.5:m==="midi_skirt"?1.48:1.33,Te=b(v),Ne=Math.max(l+.145,Te.rz+.17),Ae=Math.max(i*de,(Te.x+Te.rx+.055)/(1-te)),Oe=a-v*s,ce=Y([Oe,Ae,Ne],te),ve=Y([Oe+.045,Ae-.004,Ne-.004],te);at(e,[Y(K),Y(Q)],c?f:P(g,f,.26));let Re=[p(1.91),wt(Q[1],k,.56),wt(Q[2],_,.54),.003],ie=Z=>Y(Z,Z[3]);if(at(e,oe([[...Q,0],Re]).map(ie),g),at(e,[...oe([Re,[p(2.18),k,_,te*.2],[a,wt(k,Ae,.37),wt(_,Ne,.4),te*.75]]).map(ie),ve],g,{pleats:z?w:0}),at(e,[ve,ce],P(g,f,.44),{capBottom:!0}),m==="skirt"&&!c){let Z=(R+D)*.5,fe=(K[2]+Q[2])*.5+.011,ge=[[-.065,-.032],[.065,-.032],[.065,.032],[-.065,.032],[-.065,-.032]];e.tube(ge.map(([W,x])=>h([W,Z+x,fe],W/K[1],1)),.012,f,{sides:7})}}let ae=T==="sheer"?P(t.skinColor,d.legwearColor,.53):t.skinColor;for(let z of[-1,1]){e.markPart(z>0?"leftLeg":"rightLeg");let te=(Ae,Oe=0)=>oi(b,a,s,z,Ae,Oe);if(!V){let Ae=([W,x,B])=>ia(32,ne=>{let he=z*Math.max(0,Math.sin(ne)),ee=Math.cos(ne);return h([x*he,W,B*ee],he,ee)}),Oe=W=>{if(m==="court_shorts")return .082+.066*Math.max(0,W);if(m==="flare_jeans")return .028+.155*Math.max(0,(W-1.55)/1.85);if(m==="pleat_trousers"){let x=b(.32).rx+.09,B=b(.32).rx*.55+.06,ne=wt(x,B,Math.min(1,Math.max(0,(W-.32)/2.99)));return Math.max(.04,ne-b(W).rx)}return m==="baggy_jeans"||m==="trousers"?.052+.105*Math.max(0,Math.min(1,(W-.6)/1.8)):m==="cargo_pants"?.071+.045*Math.sin(Math.PI*Math.max(0,W)/3.58):m==="leggings"||m==="briefs"?.009:.035},ce=(W,x=0)=>{let B=Oe(W);return ue&&!J&&(B*=Math.max(0,Math.min(1,(v-W)/.31))),te(W,B+x)},ve=Ae([a+.065,k,_]),Re=Math.min(.32,v*.55),ie=ce(Re),Z=ve.map((W,x)=>W.map((B,ne)=>wt(B,ie[x][ne],.46))),fe=ya(Re,v-.041).map(W=>ce(W)),ge=ce(v);if(m==="court_shorts"){let W=ya(Re,v-.046,.09).map(ne=>ce(ne,.009)),x=W.flatMap(ne=>ne.slice(6,10)),B=[];for(let ne=1;ne<W.length;ne++)for(let he=1;he<4;he++){let ee=ne*4+he;B.push([ee-5,ee-1,ee-4],[ee-4,ee-1,ee])}e.mesh(x,B,f),at(e,[ce(v-.075,.009),ce(v-.039,.009)],f,{flip:z<0})}if(m==="pleat_trousers"){at(e,[ce(v-.105,.015),ce(v,.015)],P(g,f,.3),{flip:z<0});for(let W of[0,1]){let x=ya(Re,v-.108,.1).map(B=>{let[ne,he,ee]=ce(B)[W];return[ne,he,ee+.009]});e.tube(x,W?.006:.009,P(g,f,W?.16:.4),{sides:6})}}e.finish=o,at(e,[Ae(K),Ae(Q)],P(g,f,.22),{flip:z<0}),at(e,[...oe([Q,[p(1.94),wt(Q[1],k,.51),wt(Q[2],_,.52)],[p(2.18),k,_],[a+.065,k,_]]).map(Ae),Z,...fe],g,{flip:z<0}),at(e,[fe.at(-1),ge],P(g,f,m==="denim"||m==="baggy_jeans"?.37:.1),{flip:z<0,capBottom:!0})}if(u)continue;e.finish=0;let de=Math.max(-.2,v-.016),Te=L+.019;if(de<Te){let Ae={stockings:.91,knee_socks:1.8,leg_warmers:2.54,ankle_socks:2.99}[T]??Te,Oe=d.legwearColor||"#ece9ec",ce=Math.min(Te,Math.max(de,Ae));if(ce>de&&at(e,ya(de,ce).map(ve=>te(ve)),ae,{flip:z<0}),ce<Te){let ve=ie=>te(ie,T==="leg_warmers"?.039+.013*Math.cos(30*ie):.012),Re=Math.min(Te,ce+.08);at(e,[ve(ce),ve(Re)],P(Oe,"#3a2a40",.12),{flip:z<0}),Re<Te&&at(e,ya(Re,Te,.075).map(ve),Oe,{flip:z<0})}}let Ne=["stockings","knee_socks","ankle_socks"].includes(T)&&d.legwearColor;ni(e,E,d,Ne||ae,z,b(3.34).x,n,s,b)}e.finish=0}var Os=2*Math.PI,Ao=(e,t,a)=>Math.max(t,Math.min(a,e)),ze=e=>Math.exp(-e*e),la=(e,t,a)=>e+(t-e)*a;function ri(e){let t=(s,n)=>{let r=e[s],i=e[s+1];return(i[n]-r[n])/(i[0]-r[0])},a=e.map((s,n)=>[1,2,3].map(r=>{if(n===0)return t(0,r);if(n===e.length-1)return t(n-1,r);let i=t(n-1,r),l=t(n,r);return i*l>0?2*i*l/(i+l):0}));return s=>{let n=1;for(;n<e.length-1&&s>e[n][0];)n++;let r=e[n-1],i=e[n],l=i[0]-r[0],p=Ao((s-r[0])/l,0,1),h=p*p,c=h*p;return[1,2,3].map(o=>(2*c-3*h+1)*r[o]+(c-2*h+p)*l*a[n-1][o-1]+(-2*c+3*h)*i[o]+(c-h)*l*a[n][o-1])}}function As(e){return e.chestShape?e.chestShape==="pectoral":e.genderStyle==="masculine"}function Ts(e){return .86*(.61+.39*e.chestWidth)+.09*(e.shoulderWidth-1)+.065*((e.depth??1)-1)+.13*(e.ribWidth??0)+(As(e)?.045:0)}function ii(e,t,a){let s=e.waistDefinition??0,n=e.hipCurve??0,r=e.bellyFullness??0;if(!s&&!n&&!r)return l=>l;function i(l,p,h,c){let o=Ao(l<h?(l-p)/(h-p):(c-l)/(c-h),0,1);return o*o*(3-2*o)}return(l,p,h)=>{let c=(t-l[1])/a;if(c<=.96||c>=2.58)return l;let o=.082*s*i(c,1.08,1.49,1.96),u=.132*n*i(c,1.54,1.98,2.53),d=r*(r>0?.24:.087)*i(c,.96,1.76,2.58);return[l[0]+(u-o)*p,l[1],l[2]+(.28*u-.21*o)*h+d*Math.max(0,h)**2]}}function ys(e,t){let{shoulder:a,length:s}=t,n=R=>a-R*s,r=t.shoulders,i=.66*e.waistWidth,l=t.hips,p=.45*(e.gluteFullness??1),h=.224*e.neckWidth,c=.18+.32*e.shoulderSlope,o=(a+.47*e.headScale)/s,u=e.depth??1,d=t.chest,m=.413*u+.034*(e.ribWidth??0),g=Ao((e.chestWidth-.7)/.68,0,1),f=As(e),E=e.bustProjection??0,T=e.bustSpacing??0,b=f?(.042+.16*g)*(1+.55*E):(.033+.347*g)*(1+.62*E)+.048*Math.max(0,E),N=Math.min(b,.225),k=(f?.59+.06*g:.676+.117*g)-.145*(e.bustHeight??0),_=.395+.12*T,V=Math.asin(_),J=ii(e,a,s),ue=ri([[o,h*.91,h*.93,-.041],[o*.64,h*.85,h*.87,-.036],[o*.23,h*.94,h*.91,-.023],[0,h*1.23,h*1.01,-.011],[.36*c,r*.58,.29,-.014],[.8*c,r*.87,.343,-.024],[c+.036,r*.958,.36,-.031],[.42,la(r*.9,d,.72),m*.96,-.034],[.7,d,m*1.08,-.03],[.92,d*.994,m*1.06,-.02],[1.09,d*.957,m*.994,-.007],[1.26,la(d*.89,i,.32),la(m,.345,.32),.002],[1.43,la(d*.88,i,.8),la(m,.34,.67),.005],[1.57,i,.344,0],[1.6,i*.992,.342,0],[1.81,la(i,l,.36),la(.35,p,.39),0],[2.18,l,p,0],[2.59,l*.9,p*.91,0]]);function L(R,D,K=0,Q=0,oe=!1){let w=Math.sin(D),Y=Math.cos(D),j=Math.abs(w),[ae,z,te]=ue(R),de,Te=(ae+K)*w;if(Y>=0){let Ne=oe?N:b,Ae;if(f){let ie=R-k+.1*j*j,Z=Math.exp(-((ie/(ie<0?.38:.29))**4)),fe=Math.exp(-(((j-_)/.55)**4)),ge=.16*(1-Q)*ze(w/(.1+.035*T));Ae=Ne*(fe-ge)*Z}else{let ie=_+.045*Math.tanh((R-k)*4),Z=R-k+.065*j,fe=ze(Z/(Z<0?.38:.325)),ge=.38+.043*T,W=ze((w-ie)/ge)+ze((w+ie)/ge),x=ze(w/.19)*ze((R-k+.06)/.27),B=Ne*Q*.75*ze(w/.34)*fe;Ae=Ne*(W*fe-.135*x)+B,Te+=.15*T*w*Y*Y*fe}let Oe=.23-.095*j+.015*ze((j-.7)/.16),ce=.026*ze((R-Oe)/.053)*(1-ze(j/.13))*ze((j-.48)/.47),ve=.025*ze(w/.13)*ze((R-.105)/.082),Re=.023*ze((R-1.33)/.22)*ze(w/.56);de=(Ae+ce-ve+Re)*Y*Y}else{let Ne=.043*ze((j-.48)/.28)*ze((R-.51)/.34),Ae=.022*ze(w/.13)*ze((R-.72)/.64);de=-(Ne-Ae)*Y*Y}return J([Te,n(R),te+(z+K)*Y+de],w,Y)}function U(R,D){let K=Math.cos(D);if(R<0){let Y=Ao(R/o,0,1);return(.2+.1*Math.max(0,K))*Y**1.4}if(K<=0)return 0;let Q=Math.abs(Math.sin(D)),oe=(f?.012+.018*g:.038+.115*g)*(1+.2*E-.2*T)*ze(Q/(.095+.025*g))*ze((R-k+.018)/.24),w=.033*ze(Q/.67)*ze((R-.25+.09*Q)/.048);return(oe+w)*K*K}function v(R,D,K){let Q=Math.cos(D);if(Q<=0)return 0;let oe=Math.abs(Math.sin(D));if(f){let j=k+.27-.1*oe*oe;return b*.23*(1-.7*K)*Q*Q*ze((oe-_)/.48)*ze((R-j)/.1)}let w=(oe-_)/.45,Y=k+.16+.14*Math.max(0,1-w*w);return Math.min(b,.55)*.38*(1-.69*K)*Q*Q*ze(w)*ze((R-Y)/.14)}return{y:n,shoulders:r,waist:i,hips:l,hipDepth:p,neck:h,slope:c,chest:d,neckTop:o,bustCenter:k,bustAngle:V,softenNormals:N<b,section:ue,ring:L,occlusion:U,fabricShade:v,shapeContour:J}}function To(e,t,a,s,n,{shading:r=null,normalRing:i=null,rows:l=28,sides:p=88}={}){let h=[],c=[],o=i?[]:h,u=r?[]:null;for(let d=0;d<=l;d++)for(let m=0;m<p;m++){let g=m<p/2?Os*m/p:Os*(m-p)/p,f=la(a(g),s(g),d/l);if(h.push(t(f,g)),i&&o.push(i(f,g)),r&&u.push(r(f,g)),d>0){let E=(d-1)*p+m,T=(d-1)*p+(m+1)%p;c.push([E,E+p,T],[T,E+p,T+p])}}e.mesh(h,c,n,o,u)}var xt=Math.PI*2,Ce=(e,t,a)=>e+(t-e)*a,Zt=(e,t,a)=>{let s=Math.max(0,Math.min(1,(a-e)/(t-e)));return s*s*(3-2*s)},ea=e=>Math.acos(Math.max(-1,Math.min(1,Math.cos(e)))),Is={dinner_jacket:{dress:!1,sleeve:"long",untucked:!0,neckline(e){return-.055+.12*Math.max(0,Math.cos(e))**3},hem(e){return 1.92+.12*Math.sin(e)**2}},rugby_shirt:{dress:!1,sleeve:"short",neckline(e){return-.045+.19*Math.max(0,Math.cos(e))**5}},western_shirt:{dress:!1,sleeve:"long",neckline(e){return-.015+.2*Math.max(0,Math.cos(e))**2}},wrap_work_jacket:{dress:!1,sleeve:"long",untucked:!0,neckline(e){return .02+.47*Math.max(0,1-ea(e)/1.02)},hem(e){return 2.04+.1*Math.sin(e)**2}},tailored_waistcoat:{dress:!1,sleeve:"long",neckline(e){return-.03+.15*Math.max(0,Math.cos(e))**3}},field_overshirt:{dress:!1,sleeve:"long",untucked:!0,hem(e){return 1.8+.16*Math.cos(e)**2},neckline(e){return-.035+.22*Math.max(0,Math.cos(e))**4}},contrast_henley:{dress:!1,sleeve:"short",neckline(e){return .068+.18*Math.max(0,Math.cos(e))**3}},mariner_blouse:{dress:!1,sleeve:"short",neckline(e){return .06+.53*Math.max(0,1-ea(e)/1.14)}},one_shoulder_dress:{dress:!0,sleeve:"none",neckline(e){return .075+.54*(1-Zt(-.45,.72,Math.sin(e)))+.04*Math.cos(e)**2}},track_jacket:{dress:!1,sleeve:"long",neckline(e){return-.105+.11*Math.max(0,Math.cos(e))**12}},sweetheart_dress:{dress:!0,sleeve:"none",neckline(e){let t=ea(e);return .59+.2*Math.exp(-((t/.23)**2))-.19*Math.exp(-(((t-.55)/.39)**2))+.055*Zt(1.75,2.93,t)}},wrap_blouse:{dress:!1,sleeve:"long",neckline(e){let t=ea(e);return .098+.71*Math.max(0,1-t/1.14)**1.27+.09*Zt(1.72,2.95,t)}},square_knit:{dress:!1,sleeve:"short",neckline(e){let t=ea(e);return .097+.42*(1-Zt(.45,.81,t))+.19*Zt(2.24,2.69,t)}},halter_gown:{dress:!0,sleeve:"none",neckline(e){let t=ea(e);return .006+.82*Math.max(0,1-t/.61)+.645*Zt(.78,1.47,t)+.09*Zt(1.75,3,t)}}};function sn(e){return Object.hasOwn(Is,e)?Is[e]:null}function lt(e,t,a,s){let n=[],r=[];for(let i=0;i<=t;i++)if(n.push(...a(i/t)),i){let l=i*2;r.push([l-2,l,l-1],[l-1,l,l+1])}e.mesh(n,r,s)}function gt(e,t,a,s,n,r=0){lt(e,96,i=>{let l=xt*i,p=t(l)+r;return[a(p,l,.025),a(p+s,l,.026)]},n)}function Ut(e,t,a,s,n=.006,r=.032){let i=Array.from({length:39},(l,p)=>{let[h,c]=a(p/38);return t(h,c,r)});e.tube(i,n,s,{sides:7})}function li(e,t,a,s,n){let r=c=>a(c,Math.PI/2)[0],l=Math.sin(.56)*r(t(.56)),p=r(t(.56))*.034,h=(c,o,u)=>{let d=l+c*p,m=0,g=.36;for(let f=0;f<12;f++){let E=(m+g)/2;r(E)<d?m=E:g=E}return f=>{let E=f>.5,T=t(E?Math.PI-.56:.56)+.038,b=Ce(g,T,Math.cos(Math.PI*f)**2),N=Math.asin(Math.min(1,d/r(b)));return a(b,o*(E?Math.PI-N:N),u)}};for(let c of[-1,1]){let o=h(-1,c,.009),u=h(1,c,.009);lt(e,64,g=>[o(g),u(g)],s);let d=h(-.83,c,.011),m=h(-.57,c,.011);lt(e,64,g=>[d(g),m(g)],n)}}function $a(e,t,a,s,n){lt(e,72,r=>[t(a,xt*r,.032),t(a+s,xt*r,.033)],n)}function ca(e,t,a,s,n,r,i,l=.044){let p=[],h=[],c=Math.max(16,Math.ceil(16*Math.abs(s-a))),o=12;for(let u=0;u<=o;u++)for(let d=0;d<=c;d++){let m=Ce(a,s,d/c);if(p.push(t(Ce(n(m),r(m),u/o),m,l)),d&&u){let g=p.length-1;h.push([g-c-2,g-1,g-c-1],[g-c-1,g-1,g])}}e.mesh(p,h,i)}function Xa(e,t,a,s,n,r,i,l=.064){lt(e,56,p=>{let h=Ce(a,s,p),c=n(p),o=r(p);return[t(h,c-o,l),t(h,c+o,l)]},i)}function Ss(e,t,a){let s=t.outfitStyle,n=sn(s);if(!n)return;let{ring:r}=a,i=t.outfitPrimary,l=t.outfitAccent,p=P(i,l,.62),h=P(i,"#292032",.24),c=n.neckline;if(s==="dinner_jacket"){let o=P("#faf1e2",i,.06);ca(e,r,-.98,.98,c,f=>c(f)+.89*Math.max(0,1-Math.abs(f)/.98),o);for(let f of[-1,1]){Xa(e,r,.02,1.14,E=>f*Ce(.95,-.05,E),E=>.034+.22*Math.sin(Math.PI*E)**.8,l,.082),Ut(e,r,E=>[1.34-.085*E,f*Ce(.43,1.08,E)],l,.023,.08);for(let E of[1.12,1.39])e.ellipsoid(r(E,f*.255,.083),[.041,.041,.022],P(i,l,.68),{sides:12,rings:7})}ca(e,r,.42,.92,f=>.68-.13*Math.abs(Math.sin((f-.42)*11)),()=>.73,o,.079),Ut(e,r,f=>[.73-f*.02,.4+f*.55],l,.019,.089);let[d,m,g]=r(.193,0,.115);for(let f of[-1,1]){let E=[[0,0,.012],[.21,.086,-.012],[.22,.013,-.005],[.2,-.078,0],[.05,-.029,.015],[.105,.012,.039]];e.mesh(E.map(([T,b,N])=>[d+f*T,m+b,g+N]),[[0,1,5],[1,2,5],[2,3,5],[3,4,5],[4,0,5]],l)}e.ellipsoid([d,m,g+.028],[.043,.043,.03],l,{sides:12,rings:6})}else if(s==="rugby_shirt"){for(let o of[.43,1.04])ca(e,r,0,xt,()=>o,()=>o+.26,l),gt(e,()=>o+.3,r,.03,l);for(let o of[-1,1])ca(e,r,o<0?-1.36:.025,o<0?-.025:1.36,c,u=>c(u)+.048+.25*(1-Math.abs(Math.abs(u)-.48)/1.04),t.outfitSecondary,.067);Xa(e,r,c(0),.5,()=>0,()=>.066,P(i,l,.65),.076);for(let o of[.24,.37])e.ellipsoid(r(o,0,.087),[.022,.022,.015],l,{sides:10,rings:5})}else if(s==="western_shirt"){let o=u=>.34+.24*Math.max(0,1-Math.abs(ea(u)-.63)/.52)+.2*Zt(2.26,Math.PI,ea(u));ca(e,r,0,xt,c,o,P(i,l,.48)),gt(e,o,r,.033,l);for(let u of[-1,1]){let d=f=>.74+.09*Math.abs(Math.sin((Math.abs(f)-.32)*9.8)),m=u<0?-.98:.32,g=u<0?-.32:.98;ca(e,r,m,g,()=>.7,d,P(i,l,.45),.061),Ut(e,r,f=>{let E=Ce(m,g,f);return[d(E),E]},l,.009,.069),ca(e,r,u<0?-1.15:.025,u<0?-.025:1.15,c,f=>c(f)+.02+.26*Math.max(0,1-Math.abs(Math.abs(f)-.59)/.55),i,.073)}Xa(e,r,c(0),1.57,()=>0,()=>.054,P(i,l,.17),.067);for(let u of[.29,.54,.79,1.04,1.29,1.54])e.ellipsoid(r(u,0,.079),[.029,.029,.018],P(l,"#fff9e2",.64),{sides:10,rings:6})}else if(s==="wrap_work_jacket"){gt(e,c,r,.128,l),Xa(e,r,c(0)+.058,1.44,o=>.92*o,()=>.105,l),ca(e,r,0,xt,o=>1.34+.041*Math.sin(o),o=>1.55+.041*Math.sin(o),l,.072);for(let[o,u]of[[.3,1.92],[-.16,1.83]])Xa(e,r,1.45,u,d=>.92+o*d,d=>.055-.017*d,l,.096);e.ellipsoid(r(1.46,.92,.102),[.075,.081,.052],P(l,i,.32),{sides:14,rings:8}),gt(e,o=>n.hem(o)-.035,r,.029,P(i,l,.65))}else if(["tailored_waistcoat","field_overshirt","contrast_henley"].includes(s)){let o=s==="tailored_waistcoat",u=s==="contrast_henley",d=o?[.77,.97,1.17,1.37]:u?[.31,.43,.55]:[.32,.58,.84,1.1,1.36],m=o?l:P(i,u?l:t.outfitSecondary,.32),g=u?.6:n.hem?.(0)??1.56;if(lt(e,48,f=>{let E=Ce(c(0),g,f);return[r(E,-.054,.054),r(E,.054,.054)]},o?h:m),o)for(let f=0;f<12;f++)lt(e,48,E=>{let T=Ce(-1.25,1.25,E),b=c(T)+.58*(1-Math.abs(T)/1.25);return[r(Ce(c(T),b,f/12),T,.061),r(Ce(c(T),b,(f+1)/12),T,.061)]},l);for(let f of[-1,1])if(u)for(let E=0;E<8;E++)lt(e,40,T=>{let b=Ce(.85,Math.PI-.7,T),N=.02+.54*Math.sin(Math.PI*T);return[r(c(b)+N*E/8,f*b,.04),r(c(b)+N*(E+1)/8,f*b,.04)]},l);else{lt(e,36,T=>{let b=f*Ce(.045,1.26,T),N=.245*(1-Math.abs(2*T-1));return[r(c(b),b,.074),r(c(b)+.034+N,b,.074)]},o?P(l,i,.18):m);let E=o?1.22:.62;if(!o)for(let T=0;T<6;T++)lt(e,27,b=>{let N=f*Ce(.28,.92,b),k=.29+.065*Math.sin(Math.PI*b);return[r(E+k*T/6,N,.045),r(E+k*(T+1)/6,N,.045)]},P(i,l,.2));lt(e,28,T=>{let b=f*Ce(.27,.95,T),N=E-(o?.115*T:0);return[r(N,b,.065),r(N+(o?.036:.08+.04*Math.sin(Math.PI*T)),b,.065)]},o?P(i,l,.4):h)}gt(e,c,r,u?.052:.026,u?l:m),n.untucked&&gt(e,f=>n.hem(f)-.026,r,.024,P(i,l,.2));for(let f of d)e.ellipsoid(r(f,0,.077),[.032,.031,.019],o?l:h,{sides:10,rings:6})}else if(s==="mariner_blouse"){let o=u=>{let d=ea(u);return .19+.57*Math.max(0,1-d/1.1)+.57*Zt(1.36,2.22,d)};for(let u=0;u<10;u++)lt(e,112,d=>{let m=d*xt,g=c(m),f=o(m);return[r(Ce(g,f,u/10),m,.035),r(Ce(g,f,(u+1)/10),m,.035)]},P(i,l,.47));for(let u of[.04,.09])lt(e,112,d=>{let m=d*xt,g=o(m)-u;return[r(g,m,.046),r(g+.018,m,.046)]},i);for(let u of[-1,1])lt(e,40,d=>{let m=u*(.035+.235*d),g=.61+.47*d,f=.06*(1-.64*d);return[r(g,m-f,.06),r(g+.026*d,m+f,.059)]},l);e.ellipsoid(r(.62,0,.055),[.061,.055,.044],P(l,i,.18),{sides:14,rings:9}),$a(e,r,1.515,.057,P(i,l,.3))}else if(s==="one_shoulder_dress"){gt(e,c,r,.071,P(i,l,.42)),gt(e,c,r,.017,l,.009);for(let u=0;u<3;u++){let d=.55+.24*u;Ut(e,r,m=>[Ce(d,1.36+.028*u,m)+.12*Math.sin(Math.PI*m),Ce(.73,-.95,m)],P(i,l,.18),.014)}let o=r(1.395,-.95,.07);e.ellipsoid(o,[.07,.064,.045],l,{sides:15,rings:9})}else if(s==="track_jacket"){let o=u=>.38+.39*Math.abs(Math.cos(u))**3;gt(e,o,r,.135,l),gt(e,o,r,.023,P(i,"#222438",.54),.146),gt(e,c,r,.032,l),lt(e,50,u=>{let d=Ce(c(0),1.56,u);return[r(d,-.031,.057),r(d,.031,.057)]},h),Ut(e,r,u=>[Ce(c(0),1.57,u),0],P(l,"#b3b7bd",.42),.01,.064),e.ellipsoid(r(.35,0,.078),[.034,.063,.024],l,{sides:12,rings:8});for(let u of[-1,1])Ut(e,r,d=>[1.11+.24*d,u*(.68-.32*d)],h,.017);$a(e,r,1.47,.095,P(i,"#332d43",.35))}else if(s==="sweetheart_dress"){li(e,c,r,i,p),gt(e,c,r,.027,p);for(let o of[-1,1])for(let u of[!1,!0]){let d=m=>{let g=.48+.15*Math.sin(Math.PI*m)-.12*m;return o*(u?Math.PI-g:g)};Ut(e,r,m=>[Ce(c(d(0))+.027,1.57,m),d(m)],h,.009)}$a(e,r,1.51,.045,p)}else if(s==="wrap_blouse"){gt(e,c,r,.045,P(i,l,.34));let o=m=>[Ce(c(0),1.49,m),Ce(0,1.04,m)];lt(e,56,m=>{let[g,f]=o(m);return[r(g,f,.038),r(g+.055,f,.035)]},P(i,l,.34)),Ut(e,r,o,h,.006,.044);let u=P(i,l,.47);$a(e,r,1.39,.116,u);let d=r(1.451,1.06,.055);e.ellipsoid(d,[.059,.048,.052],l,{sides:14,rings:9});for(let m of[-1,1])lt(e,23,g=>{let f=Ce(1.47,1.597,g),E=1.06+m*.29*g;return[r(f,E-.029,.053),r(f+.012,E+.029,.052)]},u)}else if(s==="square_knit"){gt(e,c,r,.065,P(i,l,.47)),gt(e,c,r,.015,l,.047),$a(e,r,1.48,.079,P(i,l,.34));for(let o of[-1,1])for(let u of[.52,.57]){let d=o*u;Ut(e,r,m=>[Ce(c(d)+.073,1.479,m),d+o*.026*Math.sin(Math.PI*m)],P(i,l,.24),.006)}}else{lt(e,88,u=>{let d=Ce(.64,xt-.64,u);return[r(-.034,d,.013),r(.018,d,.013)]},i),gt(e,c,r,.022,p);for(let u of[-1,1])Ut(e,r,d=>[Ce(.57,1.5,d),u*Ce(.64,.12,d)],P(i,l,.25),.008),Ut(e,r,d=>[Ce(.64,1.5,d),u*Ce(.82,.23,d)],h,.007);let o=r(1.5,0,.052);e.ellipsoid(o,[.075,.04,.022],l,{sides:16,rings:8})}}function ln(e){let t=-.57*e.headScale-.39*e.neckLength,a=e.torsoLength*e.bodyScale,s=t-2.59*a,n=(e.legLength??1)*e.bodyScale,r=.96*e.shoulderWidth,i=.84*e.hipWidth,l=e.posture==="confident"||e.posture==="presenter",p=(e.armLength??1)*e.bodyScale,h=t-(.18+.32*e.shoulderSlope)*a,c={posed:l,reach:p,root:h,elbow:[r+.16,h-1.28*p,.042],wrist:[r+(l?-.36:.2),h-(l?2.14:2.58)*p,.17+(l?.3:0)]};return{shoulder:t,shoulders:r,length:a,hip:s,hips:i,leg:n,arm:c,chest:Ts(e),floor:s-3.58*n}}function bs(e,t,a){let s=[];for(let n=1;n+1<t.length;n++)s.push([0,n,n+1]);e.mesh(t,s,a)}function ci(e,t,a,s,n,r){for(let i of[-1,1])bs(e,[[0,0,0],[.93,.36,-.06],[1,.02,-.1],[.85,-.36,-.04],[.2,-.14,.1]].map(([p,h,c])=>[t+i*p*n,a+h*n,s+c*n]),r),bs(e,[[t,a,s],[t+i*n*.45,a-n*.9,s-.01],[t+i*n*.72,a-n*.69,s-.015]],r);e.ellipsoid([t,a,s+.01],[n*.21,n*.2,n*.14],r)}var rn=.88;function cn([e,t,a],s,n,r,i,l){let p=Math.cos(rn),h=Math.sin(rn);return[e+s*(r*p-l*h)*n,t+i*n,a-(r*h+l*p)*n]}function hi(e,t,a,s,n){let r=(p,h,c)=>cn(t,a,s,p,h,c),i=(p,h,c)=>[p*s,h*s,c*s];e.ellipsoid(r(0,-.115,.019),i(.102,.168,.079),n,{rotation:[.12,a*rn,a*.06]});let l=a<0?"right":"left";for(let[p,h]of[.159,.181,.167,.133].entries()){p<2&&e.markPart(l+(p===0?"Index":"Fingers"));let c=-.066+p*.044,o=[r(c,-.194,.018),r(c*1.05,-.23-h*.33,.023),r(c*1.03,-.214-h*.87,.053),r(c*.96,-.211-h,.069)];e.tube(o,[.03,.025,.022,.012].map(u=>u*s),n,{sides:10})}e.markPart(l+"Thumb"),e.tube([r(-.061,-.072,.006),r(-.112,-.134,.046),r(-.135,-.196,.081),r(-.123,-.239,.095)],[.046,.04,.031,.013].map(p=>p*s),n,{sides:12})}function Wt(e,t,a,s,n=.025){let r=[],i=[];function p(h,c,o){let u=r.length/13;for(let d=0;d<=12;d++){r.push(t(h,c+(o-c)*d/12,n));let m=r.length-1;u&&d&&i.push([m-12-2,m-1,m],[m-12-2,m,m-12-1])}}p(...a[0]);for(let h=1;h<a.length;h++){let[c,o,u]=a[h-1],[d,m,g]=a[h],f=Math.max(1,Math.ceil(Math.abs(d-c)/.075));for(let E=1;E<=f;E++){let T=E/f;p(c+(d-c)*T,o+(m-o)*T,u+(g-u)*T)}}e.mesh(r,i,s)}function pi(e){let t=["tee","sweater","sweater_dress","apron","oversized_tee"].includes(e);return a=>{let s=Math.max(0,Math.cos(a)),n=Math.abs(a),r=.57+.16*Math.exp(-((n/.255)**2))-.13*Math.exp(-(((n-.56)/.38)**2));switch(e){case"satin":case"cocktail":case"corset_top":case"bodycon":return r;case"wrap_dress":return .09+.7*Math.max(0,1-n/1.2)**1.12+.11*Math.max(0,-Math.cos(a));case"peasant_blouse":case"sleeved":return .13+.42*s**3+.16*Math.max(0,-Math.cos(a));case"scoop":return .08+.48*s**3;case"sweater":return-.018+.12*s**2;case"camisole":case"bra":return .54+.18*s**4-.1*Math.exp(-(((n-.54)/.27)**2));case"halter":return .51+.23*Math.max(0,1-n/.62);case"overall_dress":return .1+.2*s**2;default:return t?.04+.22*s**2:-.018}}}function di(e,t,a,s,n){let i=["camisole","bra","satin"].includes(t)?.041:.1,l=t==="halter",p=[],h=[];for(let c of[-1,1]){let o=p.length;for(let u=0;u<=44;u++){let d=u/44,m=.54+(Math.PI-1.08)*d,g=l?.023:.08,f=d<.5?s(c*.54):s(c*(Math.PI-.54)),E=g+(f+.02-g)*Math.abs(2*d-1)**1.6;for(let T of[-1,1])p.push(a(E+T*.12*i*Math.sin(m)**3,c*(m+T*i*Math.cos(m)),.017));if(u){let T=o+u*2;h.push([T-2,T,T-1],[T-1,T,T+1])}}}e.mesh(p,h,n)}function ui(e,t,a,s){let{outfitStyle:n,outfitPrimary:r,outfitSecondary:i,outfitAccent:l}=t,p=P(r,"#30283d",.27);if(n==="apron"){Wt(e,a,[[.48,-.49,.49],[.68,-.5,.5],[1.04,-.57,.57],[1.57,-.89,.89],[2.18,-.96,.96],[2.59,-.98,.98],[2.83,-.98,.98]],i,.14);for(let c of[-1,1]){let o=[[.02,.84],[.18,.46],[.32,.46],[.49,.47]].map(([u,d])=>a(u,c*d,.14));e.tube(o,.035,i)}Wt(e,a,[[.77,-.3,.3],[1.02,-.29,.29],[1.11,-.21,.21]],P(i,r,.22),.16),Wt(e,a,[[.78,-.3,.3],[.82,-.3,.3]],l,.18);let h=s(1.54,Math.PI,.025);for(let c of[-1,1]){let o=[[0,.02],[.24,.1],[.39,.025],[.22,-.03],[0,.02],[.2,-.43]];e.tube(o.map(([u,d])=>[c*u,h[1]+d,h[2]-.04]),.023,i,{sides:8})}}else if(n==="hoodie"){for(let h of[-1,1]){let c=[[.15,.36],[.29,.31],[.48,.28],[.64,.25],[.82,.3]].map(([o,u])=>a(o,h*u,.079));e.tube(c,.015,i,{sides:8}),e.tube(c.slice(-2),.021,l,{sides:8})}Wt(e,a,[[1.16,-.41,.41],[1.37,-.7,.7],[1.56,-.69,.69]],p,.029)}else if(["shirt","blouse","polo","polo_knit"].includes(n)){let h=n==="blouse",c=h||n==="shirt",o=[.24,.5,.67,.81];c&&o.push(1.03,1.34,1.59),Wt(e,a,o.map(u=>[u,-.038,.038]),h?P(r,l,.29):p);for(let u of c?[.46,.71,.96,1.21,1.46]:[.46,.69])e.ellipsoid(a(u,0,.05),[.024,.024,.013],h?P(l,"#9c7176",.32):i,{sides:12,rings:6});n==="shirt"&&Wt(e,a,[[.61,-.7,-.33],[.84,-.68,-.34],[.91,-.5,-.49]],P(r,i,.2),.035)}else if(n==="tee")for(let[h,c,o]of[[.19,l,.009],[.088,i,.014]]){let u=Array.from({length:25},(d,m)=>{let g=Math.PI*m/24,f=h*1.14*Math.sin(g);return[.78-h*Math.cos(g),-f,f]});Wt(e,a,u,c,o)}else if(n==="cyber"){let h=[];for(let o=0;o<=32;o++){let u=-.7+o*1.4/32,d=.6-.56*Math.max(0,Math.abs(u)-.2);h.push(a(d,u,.027))}e.tube(h,.019,l,{sides:8});let c=a(.6,0,.034);e.ellipsoid(c,[.096,.096,.022],P(r,l,.44)),e.ellipsoid([c[0],c[1],c[2]+.016],[.054,.054,.014],l)}}function Hs(e,t,a=Es){e.markPart("torso");let s=ln(t),{shoulder:n,hip:r,length:i,leg:l,floor:p}=s,h=t.wardrobe||{},c=t.outfitStyle,o=t.outfitPrimary,u=t.outfitAccent,d=t.outfitSecondary,m=P(t.skinColor,"#b5cde0",(t.synthFinish||0)*.28),g=h.outerwear||"none",f=ys(t,s),{shoulders:E,waist:T,hips:b,hipDepth:N,neck:k,slope:_,y:V}=f,J=sn(c),ue=["blazer","suit_tie","jacket","cardigan","vest"].includes(c),L=J?J.sleeve==="none":["satin","cocktail","sleeved","bodycon","halter","camisole","corset_top","bra","wrap_dress","overall_dress"].includes(c),U=J?J.dress:["satin","cocktail","sleeved","bodycon","wrap_dress","overall_dress","sweater_dress"].includes(c),v=["blouse","shirt","blazer","suit_tie","polo","polo_knit","vest","overall_dress"].includes(c),R=ue?d:o,D=g!=="none"?h.outerColor:o,K=ue||g!=="none",Q={knit:1,satin:2,velvet:3,denim:4},oe=Q[h.topFabric]||0,w=J?.neckline??pi(c),Y=J?.hem??(()=>1.6),j=J?.untucked||["hoodie","oversized_tee","sweater","sweater_dress","peasant_blouse"].includes(c)?.98:L||J?.22:.68,ae=ie=>.014+(J?.untucked?.13*Math.min(1,Math.max(0,ie-.56)):0),z=(ie,Z,fe=0)=>f.ring(ie,Z,ae(ie)+fe,j),te=(ie,Z,fe=.025)=>z(ie,Math.asin(Math.max(-1,Math.min(1,Z))),fe);e.finish=0;let de=f.softenNormals?(ie,Z)=>f.ring(ie,Z,0,0,!0):null,Te=f.softenNormals?(ie,Z)=>f.ring(ie,Z,ae(ie),j,!0):null;To(e,f.ring,()=>f.neckTop,w,m,{shading:f.occlusion,normalRing:de,rows:31}),J?.hem&&!J.untucked&&To(e,f.ring,Y,()=>1.6,m,{shading:f.occlusion,rows:14}),e.finish=oe,To(e,z,w,Y,R,{normalRing:Te,shading:(ie,Z)=>f.fabricShade(ie,Z,j)});let Ne=[],Ae=[],Oe=[],ce=88;for(let ie=0;ie<ce;ie++){let Z=ie<ce/2?Math.PI*2*ie/ce:Math.PI*2*(ie-ce)/ce,fe=w(Z);Ne.push(f.ring(fe,Z),z(fe,Z)),Oe.push(z(fe,Z,.002));let ge=2*ie,W=2*((ie+1)%ce);Ae.push([ge,ge+1,W],[W,ge+1,W+1])}if(e.mesh(Ne,Ae,R),!J&&!v&&w(0)>0){let ie=c==="sweater";e.tube([...Oe,Oe[0]],ie?.042:.011,ie?P(R,"#dad7dd",.16):P(R,u,.36),{sides:8})}["camisole","bra","satin","halter","overall_dress"].includes(c)&&di(e,c,f.ring,w,R),ui(e,t,te,z),J&&Ss(e,t,{point:z,ring:z,front:te,skinRing:f.ring,neckline:w});let ve=te;if(K){let ie=g==="trench"?2.59+.8/i:g==="bolero"?1.02:2.1,Z=g==="none"?ee=>.009+.52*Math.max(0,1-Math.max(0,ee)/(c==="suit_tie"?1.31:1.08)):ee=>.34+.39*Math.exp(-Math.max(0,ee)*2),fe=(ee,q,me=0)=>{let Ee=Math.max(0,ee-1.42),ke=.068+.106*Math.min(1,Ee*1.7)+(g==="trench"?.12*Ee:0);return f.ring(ee,q,ke+me,1.12)},ge=(ee,q,me=.025)=>fe(ee,Math.asin(Math.max(-1,Math.min(1,q))),me),W=[],x=[],B=[],ne=44,he=64;e.finish=Q[g==="cardigan"?"knit":"cotton"]||0;for(let ee=0;ee<=ne;ee++){let q=-.022+(ie+.022)*ee/ne,me=Z(q);B.push([q,me]);for(let Ee=0;Ee<=he;Ee++){let ke=me+(2*Math.PI-2*me)*Ee/he;W.push(fe(q,ke));let He=ee*(he+1)+Ee;ee&&Ee&&x.push([He-he-2,He-1,He-he-1],[He-he-1,He-1,He])}}e.mesh(W,x,D),ve=ge;for(let ee of[-1,1]){let q=B.map(([me,Ee])=>fe(me,ee*Ee,.002));if(e.tube(q,c==="cardigan"?.029:.014,P(D,u,c==="jacket"?.58:.17)),g==="none"){if(c==="blazer"||c==="suit_tie")Wt(e,(Ee,ke,He)=>ge(Ee,ee*(Math.sin(Z(Ee))+ke),He),[[.03,0,.13],[.2,0,.29],[.31,0,.16],[.37,0,.27],[.67,0,.18],[1.06,0,.012]],P(D,"#d6d4e7",.16));else if(c==="cardigan"&&ee===1)for(let me of[1.12,1.45,1.78])e.ellipsoid(ge(me,.02,.048),[.033,.034,.017],u,{sides:12,rings:6});else if(c==="jacket")for(let me=.42;me<2;me+=.065){let Ee=Math.sin(Z(me));e.tube([ge(me,ee*Ee,.029),ge(me,ee*(Ee+.037),.029)],.007,u,{sides:5})}}}}for(let ie of[-1,1]){e.markPart(ie>0?"leftArm":"rightArm");let{reach:Z,posed:fe,root:ge,elbow:W}=s.arm,x=.235*t.armThickness,B=[ie*s.arm.wrist[0],s.arm.wrist[1],s.arm.wrist[2]],ne=[[V(_-.08),.05,.08,-.01,E*.78],[V(_-.03),.38,.51,-.01,E*.83],[V(_+.036),.65,.77,0,E*.89],[ge-.15*Z,.89,.98,0,E*.95],[ge-.32*Z,1,1.1,0,E+.025],[ge-.49*Z,.97,1.06,0,E+.064],[ge-.93*Z,.79,.88,.011,E+.13],[W[1],.67,.73,W[2],W[0]],[ge-1.57*Z,.77,.79,.075,E+(fe?.07:.19)],[ge-1.76*Z,.75,.76,.14,E+(fe?-.016:.2)],[B[1],.435,.53,B[2],Math.abs(B[0])]].map(([me,Ee,ke,He,Ge])=>[me,x*Ee,x*ke,He,Ge*ie]);e.finish=0;let he=g!=="none"&&!["puffer_vest","shawl"].includes(g),ee=J?.sleeve==="long"||he||ue||["blouse","shirt","sweater","sweater_dress","hoodie","peasant_blouse","turtleneck","cyber"].includes(c),q=!L||he||c==="sleeved";if((!q||!ee)&&e.loft(q?ne.slice(5):ne,m,{sides:22}),q){let me=(ee?ne:ne.slice(0,6)).map(([We,Xe,X,pt,St],st)=>{let ye=["blouse","peasant_blouse","hoodie","sweater","wrap_work_jacket"].includes(c)&&st>1&&st<10?1.21:1.09;return[We+.014,Xe*ye+.009,X*ye+.01,pt,St]}),ke=he||ue&&c!=="vest"?D:c==="tailored_waistcoat"||c==="contrast_henley"?u:R;e.finish=oe;let[He,Ge,De,Pe,Le]=me.at(-1),Ze=ee?.13:.048;if(ee&&me.splice(-1,0,[He+.18,Ge*1.29,De*1.28,Pe-.011,Le]),e.loft(me,ke,{sides:22}),!he&&c==="rugby_shirt"){let We=me.slice(-2).map(([Xe,X,pt,St,st])=>[Xe,X+.006,pt+.006,St,st]);e.loft(We,u,{sides:22})}if(!he&&c==="western_shirt")for(let We of[.042,.108])e.ellipsoid([Le+ie*Ge*.75,He+We,Pe+De*.87],[.022,.022,.014],u,{sides:10,rings:5});if(!he&&c==="track_jacket")for(let We of[-.18,.24]){let Xe=me.slice(2).map(([X,pt,St,st,_t])=>[_t+ie*(pt+.005)*Math.sqrt(1-We*We),X,st+St*We]);e.tube(Xe,.013,u,{sides:7})}let je=ee?1.19:1.024,we=ee?1.05:1.009;e.loft([[He+Ze,Ge*je,De*je,Pe,Le],[He-.01,Ge*we,De*we,Pe,Le]],P(ke,u,.32),{sides:22})}e.finish=0,hi(e,B,ie,t.handSize??1,m)}e.markPart("torso");let Re=n+.017;if(c==="turtleneck"||c==="hoodie"||t.neckwear==="scarf"){let ie=t.neckwear==="scarf",Z=k+(ie||c==="hoodie"?.14:.025);e.loft([[V(.18),Z*1.22,Z],[Re+.01,Z*1.15,Z*1.08],[Re+(c==="turtleneck"&&!ie?.2:.13),Z*.95,Z*.93]],ie?t.neckwearColor:o),c==="hoodie"&&e.ellipsoid([0,V(.25),-.37],[.58,.48,.26],o)}else if(v){let ie=ue?d:P(R,u,.15);for(let Z of[-1,1]){let fe=(W,x,B)=>te(W,Z*x,B),ge=[[0,.52,.91],[.065,.25,.89],[.14,.07,.75],[.2,.08,.64],[.34,.42,.43]];Wt(e,fe,ge,ie,.033),e.tube(ge.slice(1).map(([W,,x])=>fe(W,x,.045)),.009,P(ie,u,.65),{sides:7})}}if(c==="suit_tie"&&t.neckwear!=="bowtie"){let ie=te;Wt(e,ie,[[.26,-.052,.052],[.88,-.115,.115],[1.14,-.115,.115],[1.23,-.004,.004]],u,.039),Wt(e,ie,[[.175,-.064,.064],[.212,-.105,.105],[.3,-.056,.056]],P(u,"#352738",.13),.054)}else if(t.neckwear==="bowtie"||c==="blouse"&&t.neckwear==="none"){let ie=te(.23,0,.04);ci(e,...ie,.26,t.neckwear==="bowtie"?t.neckwearColor:u)}else if(["necklace","pendant","pearls","lanyard","choker"].includes(t.neckwear)){let ie=t.neckwearColor;if(t.neckwear==="choker")e.loft([[Re+.115,k*1.01,k*.97],[Re+.19,k,k*.97]],ie);else{let Z=t.neckwear==="lanyard",fe=[];for(let ge=0;ge<=24;ge++){let W=ge*Math.PI*2/24,x=(Math.cos(W)+1)/2,B=Re+.11-x*(Z?.84:.38),ne=Math.sin(W)*k*1.42,he=(n-B)/i,ee=f.section(he)[0],q=Math.cos(W)*(k+.04),me=Math.asin(Math.min(.999,Math.abs(ne/ee))),ke=(w(me)>he?f.ring:z)(he,me,.026)[2];fe.push([ne,B,B<=Re&&Math.cos(W)>0?Math.max(q,ke):q])}if(e.tube(fe,Z?.037:.015,ie),t.neckwear==="pearls")for(let ge of fe.slice(0,-1))e.ellipsoid(ge,[.029,.029,.029],ie,{sides:8,rings:5});else e.ellipsoid(fe[0],[Z?.13:.047,Z?.18:.08,.027],ie)}}if(t.nameBadge||t.brooch&&t.brooch!=="none"){let ie=c==="apron"?.16:c==="cyber"?.09:.025,Z=(fe,ge,W)=>ve(fe,ge,W+ie);if(t.nameBadge&&c!=="apron"&&c!=="cyber"&&Wt(e,Z,[[.52,.4,.65],[.54,.37,.68],[.6,.37,.68],[.62,.4,.65]],u,.02),t.brooch&&t.brooch!=="none"){let fe={heart:12,star:10,flower:16,round:16}[t.brooch]||16,ge=Array.from({length:fe},(W,x)=>{let B=Math.PI*2*x/fe;if(t.brooch==="heart")return Z(.58-.006*(13*Math.cos(B)-5*Math.cos(2*B)-2*Math.cos(3*B)-Math.cos(4*B)),-.59+.09*Math.sin(B)**3,.03);let ne=x%2===0||t.brooch==="round"?.1:t.brooch==="star"?.047:.076;return Z(.58-ne*Math.cos(B),-.59+ne*Math.sin(B),.03)});e.mesh([Z(.58,-.59,.063),...ge],ge.map((W,x)=>[0,x+1,(x+1)%fe+1]),t.broochColor)}}a(e,t,{hip:r,leg:l,floor:p,waist:T,hips:b,hipDepth:N,y:V,shapeContour:f.shapeContour,dress:U,finish:U?oe:Q[h.bottomFabric]||0})}function Ie(e,t,a,s,n,r=!1,i=null){let l=[],p=[],h=i?[]:void 0,c=typeof n=="function"?[]:null;for(let u=0;u<=a;u++)for(let d=0;d<=t;d++){let m=d/t,g=u/a,f=s(m,g);l.push(f),i&&h.push(i(m,g)),c&&c.push(n(m,g,f))}let o=t+1;for(let u=0;u<a;u++)for(let d=0;d<t;d++){let m=u*o+d,g=m+1,f=g+o,E=m+o;r?p.push([m,f,g],[m,E,f]):p.push([m,g,f],[m,f,E])}e.mesh(l,p,c??n,h)}function Mt(e,t,a,s,n){let r=[],i=[];for(let l=0;l<=t;l++){let p=l/t;r.push(a(p)),i.push(typeof s=="function"?s(p):s)}e.tube(r,i,n,{sides:6})}function yo(e,t){let a=t.headWidth??1,s=t.headHeight??1,n=([r,i,l])=>[r*a,i*s,l];return{mesh:(r,i,l,p)=>e.mesh(r.map(n),i,l,p?.map(n)),tube:(r,i,l,p)=>e.tube(r.map(n),i,l,p),ellipsoid:(r,i,l,p)=>e.ellipsoid(n(r),n(i),l,p)}}var qe=Math.PI,At=2*qe,Ot=(e,t,a)=>e+(t-e)*a,ws=(e,t,a)=>Math.max(t,Math.min(a,e)),ha=e=>Math.sin(ws(e,0,1)*qe),Ct=(e,t,a=0)=>[(.599+a)*Math.sin(t)*Math.sin(e),(.785+a)*Math.cos(t)+.008,(.591+a)*Math.sin(t)*Math.cos(e)-.045];function Io(e){return 1.06+.99*(1-Math.cos(e))*.5+.16*Math.sin(e)**2}function Ja(e,t,a,s,n,r,i,l,p=0){let h=.13+.025*(l%3);function c(o,u,d=0){let m=u*(.28+.72*u),g=n*(.33+.67*Math.sin(u*qe*.77))*(1-ws((u-.63)/.37,0,1)**1.28),f=t+a*m+o*g,E=Ot(h,s,u)+.018*Math.sin(u*qe)*o;return Ct(f,E,.025+(p+.0028*l)*ha(u)+.03*(1-o*o)*Math.sin(qe*u)**.6+d)}Ie(e,8,19,(o,u)=>c(o*2-1,u),r,!0),Ie(e,2,12,(o,u)=>{let d=.25+.025*(l%3)+.53*u,m=.13*ha(u)**.65*(1+.42*Math.sin(u*qe*2.1));return c(-.27+(2*o-1)*m,d,.0025)},i,!0)}function mi(e,t,a,s){if(["none","buzz","afro","curly_halo","mohawk"].includes(t.hairStyle))return;if(!(t.fringe&&!["swept","side_sweep","updo","updo_bun","quiff"].includes(t.hairStyle))){let i=[[-1.27,1.62],[-.91,1.31],[-.34,1.07],[.32,1.21],[.66,1.34],[.97,1.48],[1.27,1.64]];for(let[l,[p,h]]of i.entries()){let c=-.62+(l-2)*.115;Ja(e,c,p-c,h,.4,P(a,s,.046*(l%3)),P(a,s,.61),l,t.hairStyle==="quiff"?.091:.022)}return}let r=[1.51,1.36,1.29,1.45,1.28,1.36,1.54];for(let i=0;i<7;i++){let l=i/6,p=Ot(-1.18,1.18,l),h=p*.47-.41;Ja(e,h,p-h,r[i],.35,P(a,s,.02+.045*(i%3)),P(a,s,.58),i,.01)}}function fi(e,t,a,s,n){let r=["long_waves","wolf_shag","bob","half_up","side_braid"].includes(t),i=["bob","french_bob","sleek_bob"].includes(t),l=i?.91:.99,p=i?8:10,h=.33;function c(o,u,d=0){let m=.15*Math.sin(qe*o*2+.5),g=Ot(l,At-l,o)+.6*m*(1-u)**2,f=Math.cos(At*p*o+(r?.69*Math.sin(5*u):0));if(u<h){let V=.002+1.378*u/h;return Ct(g,V,.018+.014*f*Math.sin(V)+d)}let E=Ct(g,1.38,.018);u=(u-h)/(1-h);let T=Math.sin(g),b=r?.072*u*Math.sin(8*u+g*2):0,N=.014*f,k=.044*Math.sin(qe*u)**.64+(i?.048*Math.sin(qe*u)-.068*u**4:.076*u+.027*Math.sin(qe*u)),_=.057*u-.097*u**2;return[E[0]+T*(k+b+N+d),E[1]-a*u+(.049*Math.cos(At*p*o)+.073*Math.sin(At*3*o-.5))*u**4+.16*u**3*(1-T*T),E[2]+Math.cos(g)*(_+b+N+d)-.036*u]}Ie(e,64,29,(o,u)=>c(o,u),s,!0),Ie(e,42,14,(o,u)=>c(o,u,-.041),P(s,"#24182b",.34)),Ie(e,72,2,(o,u)=>c(o,1,-.041*u),P(s,"#24182b",.29),!0);for(let o=0;o<p;o++)Ie(e,4,25,(u,d)=>{let m=.049+.89*d,g=(o+.21+(r?.15*Math.sin(5*m):0))/p;return c(g+(2*u-1)*.015*ha(d)**.7,m,.004)},P(s,n,.36+o%3*.07),!0)}function Qa(e,t,a,s,n,r,i,l=!1){function p(h,c,o=0){let[u,d,m]=t(c),g=typeof a=="function"?a(c):a,E=(l?.04+.96*Math.min(1,c/.19)**.68:1)*(.68+.32*Math.sin(qe*c))*(1-.98*c**2.5),T=Math.cos(h)*s*E,b=(n*E+o)*Math.sin(h);return[u+Math.cos(g)*T+Math.sin(g)*b,d,m-Math.sin(g)*T+Math.cos(g)*b]}Ie(e,12,19,(h,c)=>p(At*h,c),r),Ie(e,3,12,(h,c)=>p(1.37+(2*h-1)*.23*ha(c),.1+.71*c,.004),i)}function gi(e,t,a){function n(i,l,p=0){let h=Ot(.96,At-.96,i),c=Math.sin(2*qe*i),o=At*9*i+.69*Math.sin(3*At*i);if(l<=.32){let k=Ot(.004,1.39,l/.32);return Ct(h,k,.019+.013*Math.cos(o)*Math.sin(k)+p)}let u=(l-.32)/.68,d=Ct(h,1.39,.019),m=Math.sin(2.3*qe*u-.58+.55*Math.sin(h*2)),g=.078*Math.sin(qe*u)+.12*u**1.32*m-.032*u**3,f=(.013+.005*u)*Math.cos(o+1.28*u*m),E=(.52*Math.cos(qe*i)+.1*c*m)*u**1.28,T=h+E,b=1.52-.3*Math.abs(Math.cos(qe*i))**6,N=(.038+.014*Math.cos(At*3*i))*Math.cos(o)+.047*Math.sin(qe*5*i);return[((.599+.019+f+p)*Math.sin(1.39)+g)*Math.sin(T),d[1]-b*u-N*u**4,((.591+.019+f+p)*Math.sin(1.39)+.7*g)*Math.cos(T)-.045-.066*u]}Ie(e,86,42,(i,l)=>n(i,l),t,!0);let r=P(t,"#24182b",.33);Ie(e,72,27,(i,l)=>n(i,l,-.029),r),Ie(e,86,2,(i,l)=>n(i,1,-.029*l),r,!0);for(let i of[0,1])Ie(e,2,29,(l,p)=>n(i,p,-.029*l),r,i===0);for(let i=0;i<9;i++){let l=.06+.043*(i%3);Ie(e,4,34,(p,h)=>{let c=Ot(l,.925-.021*(i%2),h),o=Math.max(0,(c-.32)/.68),u=(i+.53-.26*o*Math.sin(2.3*qe*o+i*.71))/9,d=.01*ha(h)**.65*(1+.29*Math.sin(9.2*h+.6*i));return n(u+(2*p-1)*d,c,.003)},P(t,a,.31+i%3*.055),!0)}for(let i of[-1,1])for(let[l,[p,h,c,o,u]]of[[.94,1.04,1.16,.095,-.65],[1.15,1.12,1.47,.132,.47],[1.48,1.15,1.56,.133,1.35]].entries()){let d=i*p,m=Ct(d,h,.022),g=E=>2.18*qe*E+u+.2*i;Qa(e,E=>{let T=Math.sin(g(E))*E**.77;return[m[0]+i*(.11*ha(E)+.075*E+(.093+.014*l)*T),m[1]-c*E+.026*T,m[2]+.068*ha(E)-(.014+l*.061)*E+.062*E*Math.cos(g(E))]},E=>d+i*.62*Math.sin(g(E)),o,.058,P(t,a,.05+l*.04),P(t,a,.54-l*.04),!0)}}function Ei(e,t,a,s){let n=t.hairStyle,r=.64;["long_waves","long_straight","half_up","twin_ringlets","side_braid","wolf_shag"].includes(n)&&(r=1.45),["french_bob","bob","sleek_bob","shoulder_lob"].includes(n)&&(r=n==="shoulder_lob"?1.29:.88),["pixie","swept","side_sweep","quiff","mohawk"].includes(n)&&(r=.48);let i=["long_waves","wolf_shag","twin_ringlets","bob","half_up"].includes(n);for(let l of[-1,1])for(let p=0;p<2;p++){let h=l*(.89+p*.255),c=r*(p===0?.89:1),o=Ct(h,1.045+.075*p,.027);Qa(e,d=>{let m=l*(.084*Math.sin(qe*d)+.041*d+(i?.048*d*Math.sin(7*d+p):0));return[o[0]+m,o[1]-c*d,o[2]-.054*d+.019*Math.sin(qe*d*2+p*.6)]},h,.112+(i?.015:0),.061,P(a,s,.04+p*.08),P(a,s,.6),!0)}}function Ns(e,t,a,s,n=0,r=!1){let i=n?[n*.5,.32,-.23]:[0,r?-.17:.475,-.485],l=n?n*1.8:qe,p=n?1.45:r?1.16:1.56;e.ellipsoid(i,[.148,.13,.142],t.outfitAccent||s);for(let h=-1;h<=1;h++)Qa(e,o=>{let u=Math.sin(qe*o);return[i[0]+(n?n*(.25*u+.07*o):.205*Math.sin(4.9*o)*o)+h*(.066+.041*u),i[1]-o*p+.19*u,i[2]-.29*Math.sin(o*qe*.74)-.11*o+.049*Math.cos(h*2)]},l+.23*h,.135,.098,P(a,s,(h+1)*.052),P(a,s,.5))}function Oi(e,t,a,s,n){for(let i=0;i<7;i++){let l=t*(.499+.048*Math.sin(i*.65)),p=-.08-i*.133,h=.128-.009*i;for(let c of[-1,1])e.ellipsoid([l+.033*c,p+.031*c,-.075+.047*i],[h*.65,h*1.24,h*.75],P(a,s,.075*(c+1)),{rotation:[0,0,c*.51]})}e.ellipsoid([t*.463,-.965,.225],[.072,.035,.072],n),Qa(e,i=>[t*(.463+.052*i),-.98-.2*i,.225+.02*i],t,.078,.051,a,s)}function Ms(e,t){let a=t.hairStyle||"long_waves",s=t.hairColor||"#483248",n=t.hairHighlight||P(s,"#ffdde3",.38);if(a==="none")return;let r=["afro","curly_halo"].includes(a),i=a==="mohawk",l={long_waves:1.66,long_straight:1.64,half_up:1.58,wolf_shag:1.24,shoulder_lob:1.2,bob:.88,french_bob:.77,sleek_bob:.83,side_braid:.78,twin_ringlets:1.36},p=P(s,"#211527",.12),h=l[a]?1.08:qe;if(Ie(e,l[a]?28:64,25,(c,o)=>{let u=(2*c-1)*h,m=.001+(Io(u)-.001)*o;return Ct(u,m,i?-.012:.012)},p,!0),a==="taper_crop"||a==="side_part"){let c=a==="side_part";for(let o=0;o<16;o++){let u=Ot(1.04,At-1.04,o/15);Ja(e,u-.28,.28,Io(u)+.055,.25,s,P(s,n,.29),o%4)}for(let o=0;o<10;o++){let u=Ot(-1.3,1.3,o/9),d=c?u<-.72?-1.09:-.77+.13*u:.47*u-.32,m=(c?1.1:1.16)+.22*Math.abs(u)+(c?0:.14*Math.sin(o*3.7));Ja(e,d,u-d,m+(t.fringe?.13:0),c?.39:.34,P(s,n,.055*(o%3)),P(s,n,.62),o,c?.052:.095)}return}if(r){let c=a==="afro"?1.13:.94;for(let o=0;o<4;o++){let u=[5,10,15,18][o];for(let d=0;d<u;d++){let m=At*(d+o%2*.5)/u,g=.2+(Io(m)-.19)*o/3,[f,E,T]=Ct(m,g,.045*c),b=(.132+.015*Math.sin(14*m+o))*c;e.ellipsoid([f,E+.031,T],[b*1.19,b,b*1.07],P(s,n,.08*((d+o)%3)))}}return}if(i){for(let c=0;c<7;c++){let o=1-c*.28,u=Ct(0,o,.003);e.tube([u,[0,u[1]+.082,u[2]-.03],[0,u[1]+.22,u[2]-.14]],[[.114,.086],[.09,.077],.003],P(s,n,.08*(c%3)))}return}a==="long_waves"?gi(e,s,n):l[a]&&fi(e,a,l[a],s,n);for(let c=0;!l[a]&&c<10;c++){let o=Ot(1.25,At-1.25,c/9),u=Io(o);Ja(e,o-.19,.19,u+.08,.31,P(s,n,.04+c%3*.04),P(s,n,.44),c)}if(mi(e,t,s,n),a!=="long_waves"&&Ei(e,t,s,n),(a==="ponytail"||a==="low_ponytail"||a==="half_up")&&Ns(e,t,s,n,0,a==="low_ponytail"),a==="pigtails"||a==="twin_ringlets")for(let c of[-1,1])Ns(e,t,s,n,c);if(a==="braids"||a==="side_braid")for(let c of a==="braids"?[-1,1]:[1])Oi(e,c,s,n,t.outfitAccent||n);if(["updo","updo_bun","space_buns"].includes(a))for(let c of a==="space_buns"?[-1,1]:[0]){let o=c*.49,u=c?.58:.7,d=c?-.224:-.29;e.ellipsoid([o,u,d],[.214,.206,.218],s);for(let m=0;m<3;m++)Mt(e,22,g=>{let f=g*qe,E=(m-1)*.57+.25;return[o+.21*Math.cos(f)*Math.cos(E),u+.203*Math.sin(f),d+.218*Math.cos(f)*Math.sin(E)]},g=>.003+.009*ha(g),P(s,n,.41))}}function Rs(e,t){let a=t.headwear,s=t.headwearColor||"#c75f87";if(!a||a==="none")return;let n=P(s,"#fff2de",.4),r=P(s,"#311f37",.27);if(["headband","headphones","cat_ears","tiara"].includes(a)){Mt(e,32,i=>{let l=(i-.5)*qe*1.065;return[.604*Math.sin(l),.786*Math.cos(l)+.01,.015+.12*Math.cos(l)]},a==="tiara"?.017:.036,s);for(let i of[-1,1])if(a==="headphones"&&(e.ellipsoid([i*.582,-.017,.005],[.093,.181,.144],r),e.ellipsoid([i*.643,-.017,.009],[.054,.147,.117],s)),a==="cat_ears"){let l=[[i*.245,.67,-.069],[i*.581,.463,-.061],[i*.514,.995,-.076],[i*.42,.649,.131]];e.mesh(l,[[0,1,2],[0,2,3],[1,3,2],[0,3,1]],s),e.mesh([[i*.32,.68,.016],[i*.545,.552,.003],[i*.496,.926,-.041]],[[0,1,2]],P(s,"#fad0db",.6))}if(a==="tiara")for(let i=-2;i<=2;i++){let l=.122-.027*Math.abs(i),p=i*.111,h=.632-.034*Math.abs(i),c=.329-.024*Math.abs(i);e.tube([[p-.083,h-.014,c],[p,h+l,c],[p+.083,h-.014,c]],[.012,.016,.012],n),e.ellipsoid([p,h+l,c],[.023,.031,.021],i?n:"#dca0ae")}}else if(a==="bow"||a==="flower")if(a==="bow"){for(let i of[-1,1])e.ellipsoid([.369+i*.106,.584+i*.034,.311],[.133,.08,.044],s,{rotation:[0,0,i*.37]}),e.tube([[.369,.584,.297],[.369+i*.058,.469,.321],[.369+i*.115,.391,.313]],[[.04,.018],[.051,.018],[.035,.012]],r);e.ellipsoid([.369,.584,.353],[.053,.059,.032],n)}else{for(let i=0;i<6;i++){let l=At*i/6;e.ellipsoid([.467+.066*Math.cos(l),.428+.066*Math.sin(l),.261],[.067,.054,.039],i%2?s:n)}e.ellipsoid([.467,.428,.295],[.041,.04,.029],"#f5d891")}else if(a==="headscarf")Ie(e,50,18,(i,l)=>{let p=(i-.5)*At;return Ct(p,.002+l*(1.09+1.43*(1-Math.cos(p))*.5),.076)},s,!0),Qa(e,i=>[.22+.08*i,-.26-.78*i,-.448-.05*i],2.6,.18,.066,s,n);else if(a==="beret"){let i=(p,h,c,o,u=0)=>{let d=(p-.5)*At,m=h*Math.sin(d)+u;return[m,o+m*.105,-.045+c*Math.cos(d)]};Ie(e,48,2,(p,h)=>i(p,Ot(.475,.605,h),Ot(.485,.62,h),Ot(.447,.432,h)),r,!0),Ie(e,48,4,(p,h)=>i(p,Ot(.605,.574,h),Ot(.62,.583,h),Ot(.432,.535,h)),r);let l=[[.51,.574,.583,0],[.531,.635,.614,-.023],[.581,.684,.628,-.052],[.662,.666,.617,-.069],[.76,.6,.552,-.076],[.846,.461,.448,-.073],[.903,.292,.315,-.07],[.925,.135,.157,-.072],[.928,0,0,-.075]];Ie(e,48,l.length-1,(p,h)=>{let[c,o,u,d]=l[Math.round(h*(l.length-1))];return i(p,o,u,c,d)},s),e.ellipsoid([-.078,.937,-.044],[.027,.031,.028],r)}else{let i=a==="chef",l=a==="fedora",p=a==="cap";if(e.ellipsoid([0,i?.8:.59,-.042],[i?.62:.555,i?.34:.29,.539],s),e.ellipsoid([0,.526,-.027],[.564,.095,.528],r),(p||l)&&e.ellipsoid([0,.493,p?.335:-.025],[l?.692:.47,.043,l?.636:.366],s,{rotation:[.042,0,0]}),a==="beanie"&&e.ellipsoid([0,.881,-.065],[.08,.077,.08],n),i)for(let h of[-1,0,1])e.ellipsoid([h*.28,.949,-.061],[.28,.233,.37],s)}}var Se=Math.PI,Ws="#342332",aa=(e,t,a)=>Math.max(t,Math.min(a,e)),oa=(e,t,a)=>e+(t-e)*a,ta=e=>Math.exp(-e*e);function Za(e,t,a){let s=aa((a-e)/(t-e),0,1);return s*s*(3-2*s)}function pn(e){let t=e.genderStyle==="masculine"?1:e.genderStyle==="neutral"?.45:0,a=e.cheekboneWidth??1,s=(e.jawWidth??.9)*(1+.105*t),n=-.695-.15*(e.chinLength??0)-.022*t,r=e.chinRoundness??.65,i=[[n,.012,.018,.14],[n+.044,.13+.045*r+.039*t,.135,.125],[-.54,.288*s,.298,.075],[-.39,.424*s,.414,.02],[-.2,.49*a,.479,.003],[.02,.525*a,.5,-.024],[.22,.535,.509,-.038],[.41,.491,.472,-.052],[.57,.389,.398,-.057],[.67,.22,.256,-.064],[.712,.012,.018,-.066]];function l(u){let d=0;for(;d<i.length-2&&u>i[d+1][0];)d++;let m=i[d],g=i[d+1],f=i[Math.max(0,d-1)],E=i[Math.min(i.length-1,d+2)],T=g[0]-m[0],b=aa((u-m[0])/T,0,1),N=b*b,k=N*b;return[1,2,3].map(_=>(2*k-3*N+1)*m[_]+(k-2*N+b)*T*(g[_]-f[_])/(g[0]-f[0])+(3*N-2*k)*g[_]+(k-N)*T*(E[_]-m[_])/(E[0]-m[0]))}let p=-.205-.2*((e.noseLength??1)-1),h=.079*(e.noseWidth??1);function c(u,d){let m=u/h,g=(d-p)/.078,f=(d-p-.07)/.138,E=(.082+.012*t)*Math.exp(-m*m-g*g)+.041*Math.exp(-1.7*m*m-f*f),T=(d+.367)/.077,b=(d-(n+.145))/.085,N=(d+.346)/.03,k=(d+.397)/.027,_=.024*Math.exp(-T*T)+.024*Math.exp(-N*N)+.025*Math.exp(-k*k);return E+_*Math.exp(-((u/.136)**2))+.059*Math.exp(-((u/.177)**2)-b*b)}function o(u,d,m=0){let[g,f,E]=l(d),T=Math.sqrt(Math.max(0,1-(u/g)**2));return[u,d,E+(f+c(u,d))*T+m]}return{chinY:n,noseY:p,noseWidth:h,section:l,relief:c,at:o}}function hn(e,t,a,s,n,r,i,l,p=0){Ie(e,20,3,(h,c)=>{let o=h*2*Se,u=n*Math.cos(o)*c;return t.at(a+u,s+Math.sin(o)*r*c+u*p,i)},l,!0)}function Ai(e,t,a){let s=t.earSize??1;for(let n of[-1,1]){let r=n*(.494+.024*s),i=t.earStyle;if(i==="pointed"?e.tube([[n*.471,-.16,-.014],[r,.007,-.023],[n*(.52+.16*s),.12*s,-.11]],[[.06,.065],[.09*s,.08*s],.004],a,{sides:14}):e.ellipsoid([r,-.077,-.044],[.101*s,.155*s,.087*s],i==="cyber"?"#8091a3":a,{rotation:[0,0,-n*.19]}),e.ellipsoid([r+n*.026,-.077,.026*s],[.045*s,.078*s,.021],i==="cyber"?"#72edf3":P(a,"#ab686a",.32),{rotation:[0,0,-n*.18]}),t.earrings&&t.earrings!=="none"){let l=r+n*.03,p=-.083-.13*s,h=t.earringColor||"#e8be7e";if(e.ellipsoid([l,p,.042],[.026,.026,.024],h),t.earrings==="hoops")Mt(e,22,c=>[l+.06*Math.sin(2*Se*c),p-.071+.074*Math.cos(2*Se*c),.045],.01,h);else if(t.earrings==="drops"||t.earrings==="hearts")if(Mt(e,3,c=>[l,p-.087*c,.041],.0075,h),t.earrings==="hearts")for(let c of[-1,1])e.ellipsoid([l+c*.016,p-.101,.042],[.025,.041,.014],h,{rotation:[0,0,-c*.55]});else e.ellipsoid([l,p-.115,.042],[.029,.055,.023],h)}}}function Ti(e,t,a,s){for(let n of[-1,1]){if(t.freckles>0){let r=[[.31,-.159],[.345,-.137],[.273,-.15],[.24,-.173],[.38,-.172],[.16,-.16],[.101,-.171],[.303,-.195],[.361,-.152],[.227,-.139]];for(let[i,l]of r.slice(0,Math.ceil(r.length*t.freckles)))hn(e,a,n*i,l+n*.003,.006,.0045,.0065,P(s,"#6b3842",.26+.4*t.freckles))}if(t.dimples>0||t.ageLines>0){let r=Math.max(t.dimples||0,t.ageLines||0);Mt(e,8,i=>a.at(n*(.172+.013*Math.sin(i*Se)),-.374+.044*i,.005),i=>.001+.0035*r*Math.sin(i*Se),P(s,"#995d63",r*.42))}t.ageLines>.1&&Mt(e,8,r=>a.at(n*(.374+.047*r),-.052-.016*r,.005),r=>.001+.003*t.ageLines*Math.sin(r*Se),P(s,"#925f65",t.ageLines*.5)),Mt(e,8,r=>a.at(n*a.noseWidth*(.45+.31*r),a.noseY-.037+.005*Math.sin(r*Se),.0028),r=>.001+.003*Math.sin(r*Se),P(s,"#974f58",.42))}if(Ie(e,16,5,(n,r)=>{let i=Math.sin(Se*n)**.8,l=a.noseWidth*(.38+.21*n+(r-.5)*.39*i),p=a.noseY+.073-.105*n;return a.at(l,p,.0038)},P(s,"#ab6973",.23)),Ie(e,10,3,(n,r)=>{let i=a.noseWidth*(n*.74-.13),l=a.noseY-.028+.017*n*n;return a.at(i,l+.01*r*Math.sin(Se*n),.005)},P(s,"#ac626a",.43)),hn(e,a,-.19*a.noseWidth,a.noseY+.008,.014,.006,.004,P(s,"#fff0dc",.55),.16),t.beautyMark&&hn(e,a,.305,-.245,.011,.009,.005,"#69424c"),t.noseStud&&e.ellipsoid(a.at(-a.noseWidth*.7,a.noseY-.005,.007),[.012,.011,.012],t.earringColor||"#f9e5b2"),t.facialHair&&t.facialHair!=="none"){let n=P(t.hairColor||"#332532",s,.16),r=t.facialHair==="boxed_beard";if(["beard","goatee","boxed_beard"].includes(t.facialHair)){let i=t.facialHair==="goatee",l=Yt(n),p=Ft(l,Yt(s),.58);Ie(e,36,10,(h,c)=>{let o=Math.abs(2*h-1),u=(2*h-1)*(i?.65:1.73),d=-.47+.4*o**1.55+.039*ta(o/.12)-.045*ta((o-.19)/.13);i&&(d=-.465-.12*o),r&&(d=-.44+.32*o**1.15+.035*Math.sin(Se*o));let m=a.chinY+.004+.012*o,g=oa(m,d,c),[f,E,T]=a.section(g),b=.005+(r?.025:.022)*Math.sin(Se*c),N=(f+b)*Math.sin(u),k=Math.cos(u);return[N,g,T+(E+b+.001+(k>0?a.relief(N,g):0))*k]},(h,c)=>Ft(l,p,.78*Za(.74,1,c)+.07*(1+Math.cos(37*h+2*c))))}if(t.facialHair!=="stubble")for(let i of[-1,1])Ie(e,15,3,(l,p)=>{if(r||t.facialHair==="chevron"){let c=i*(.001+.171*l),o=-.326-.047*l+.032*Math.sin(Se*l),u=(.024+.031*Math.sin(Se*l))*(1-l**5);return a.at(c,o+u*(p-.2),.013)}let h=(.42+.58*Math.sin(Se*l)**.6)*(1-l**3);return a.at(i*(.004+.155*l),-.342-.03*l+.018*Math.sin(Se*l)+.036*h*p,.009+.007*h*Math.sin(Se*p))},n,i<0)}}function yi(e,t,a){let s=t.glasses,n=t.glassesColor||"#302938";if(!s||s==="none")return;if(s==="visor"){let h=(c,o,u=.078)=>{let d=(2*c-1)*.455,m=Math.abs(2*c-1),g=-.095+.074*m**3,f=.209-.083*m**4;return a.at(d,g+f*o,u)};for(let[c,o]of[[0,.12],[.88,1]])Ie(e,8,4,(u,d)=>h(oa(c,o,u),d),n);for(let c of[0,1])Mt(e,42,o=>h(o,c),c?.013:.007,P(n,"#baf3ff",c?.19:.52));for(let c of[-1,1]){let o=h(c<0?0:1,.56);e.tube([o,[c*.506,.022,.228],[c*.551,.02,-.052]],[.028,.034,.023],n)}return}let r=.195,i=.242*(t.eyeSpacing??1),l=(h,c,o=1)=>{let u=c*Se*2,d=Math.cos(u),m=Math.sin(u),g=["round","aviator","heart"].includes(s),f=Math.sign(d)*Math.abs(d)**(g?1:.66),E=Math.sign(m)*Math.abs(m)**(g?1:.63);s==="heart"&&(E-=.39*Math.exp(-15*f*f)*Math.max(0,E)),s==="cat_eye"&&(E+=.44*Math.max(f,0)**2),s==="aviator"&&(E-=.16*Math.max(0,f));let T=h*(i+f*r*o),b=.004+E*.134*o;return a.at(T,b,.079)};for(let h of[-1,1]){s==="shades"&&Ie(e,32,5,(o,u)=>l(h,o,u),P(n,"#54708c",.39),h>0),Mt(e,32,o=>l(h,o),s==="bold"?.019:.011,n);let c=l(h,0);e.tube([c,[h*.493,.057,.239],[h*.546,.055,-.049]],[.012,.014,.014],n)}let p=l(1,.5);Mt(e,10,h=>[p[0]*(2*h-1),p[1]+.024*Math.sin(Se*h),p[2]+.008*Math.sin(Se*h)],.01,n)}function Ls(e){let t=Math.abs(e);return .32-.32*(1-Math.cos(e))+.075*ta((t-.88)/.33)-.11*ta((t-1.42)/.19)}function So(e,t,a,s,n=0){let[r,i,l]=e.section(a),p=(r+n)*Math.sin(t),h=Math.cos(t);return[p,a,l+(i+n+(h>0?e.relief(p,a)*s:0))*h]}function Ii(e,t,a,s){let n=[],r=[],i=[],l=Ft(a,Yt("#302938"),.46);for(let p=0;p<28;p++){let h=-.23+p*.034,c=Math.round(t.section(h)[0]*131);for(let o=0;o<c;o++){let u=Math.sin(o*13.3+p*4.9),d=-Se+(o+.5+.29*u)*2*Se/c,m=h+.012*Math.cos(o*3.1+p*2.7),g=Za(.025,.11,m-Ls(d));if(!g)continue;let f=Math.min(.71,m+.028+.009*u),E=.035*Math.cos(d)+.025*u,T=n.length;n.push(So(t,d-.012,m,1,.004),So(t,d+.012,m,1,.004),So(t,d+E,f,1,.004)),r.push([T,T+1,T+2]);let b=Ft(a,u<0?l:s,g*(.48+.35*Math.abs(u)));i.push(b,b,Ft(b,a,.48))}}e.mesh(n,r,i)}function vs(e,t){let a=yo(e,t),s=pn(t),n=P(t.skinColor||"#f1c6b0","#b5cde0",(t.synthFinish||0)*.28),r=Yt(n),i=Yt("#e77986"),l=Yt(t.hairColor||"#483248"),p=t.hairStyle==="buzz"&&t.headwear!=="headscarf",h=t.facialHair==="stubble",c=aa(t.blushIntensity??.24,0,1),o=(d,m,g)=>{let f=m<.48?oa(s.chinY,-.27,m/.48):oa(-.27,.712,(m-.48)/.52);return So(s,(d-.5)*2*Se,f,g)};if(Ie(a,64,60,(d,m)=>o(d,m,1),(d,m,[g,f])=>{let E=(d-.5)*2*Se,T=Math.abs(E),b=Math.max(0,Math.cos(E)),N=ta((Math.abs(g)-.32)/.145)*ta((f+.17)/.078),k=Ft(r,i,c*.64*N*b);if(h&&T<1.9){let _=T/1.9,V=-.455+.39*_**1.5+.024*ta(_/.14),J=(1-Za(V-.07,V+.07,f))*(1-Za(1.56,1.9,T)),ue=ta((f+.322)/.023)*ta(g/.125)*b;k=Ft(k,l,Math.max(J*.26,ue*.2))}if(p){let _=Ls(E),V=.058+.038*Math.sin(E)**2;k=Ft(k,l,Za(_-.015,_+V,f))}return k},!1,(d,m)=>o(d,m,.48)),Ai(a,t,n),Ti(a,t,s,n),p?Ii(a,s,l,Yt(t.hairHighlight||"#dacbd5")):t.headwear!=="headscarf"&&(e.finish=5,Ms(a,t),e.finish=0),yi(a,t,s),Rs(a,t),t.headsetMic){let d=s.at(.222,-.392,.035);a.tube([[.548,-.066,.015],[.566,-.178,.178],s.at(.397,-.307,.046),d],[.014,.014,.012,.01],"#393240"),a.ellipsoid(d,[.044,.022,.023],"#352c37")}}var ks={classic:[1,0,1,1,.84,.76],round:[.9,-.017,1.3,1.17,.59,.62],feline:[1.05,.058,.78,.87,1.05,.89],hooded:[1.01,-.012,.92,.64,.85,.63]};function Si(e,t,a,s,n){let r=t.genderStyle==="masculine",i=t.eyeSize??1,[l,p,h,c,o,u]=ks[t.eyeShape]??ks.classic,d=a.section(0)[0]*.93,m=Math.min(.15*i*l,d*.455),f=aa(.217*(t.eyeSpacing??1),m*1.055,d-m)-m,E=.021+(t.eyeTilt??.06)*.23+p,T=(1-n)*(1+.55*(t.eyeOpen??0))*(r?.76:.87),b=s===1&&t.irisColor2?t.irisColor2:t.irisColor||"#5892bd",N=P(Ws,t.hairColor||Ws,.16),k=L=>{let U=Math.max(0,Math.sin(Se*L)),v=-.012+E*(L-.5)+.01*Math.sin(Se*L);return[v-.064*i*T*h*U**o,v+.085*i*T*c*U**u*(.86+.28*L)]},_=(L,U,v)=>{let R=f+2*m*L;return a.at(s*R,U,v+.012*Math.max(0,Math.sin(L*Se)))},V=(L,U)=>{let[v,R]=k(L);return _(L,oa(v,R,U),.0115)};if(T>.04){let Q=function(oe,w,Y,j,ae){w+=U;let[z,te]=k(oe);w-j<=z||w+j>=te||Ie(e,14,2,(de,Te)=>_(oe+Math.cos(2*Se*de)*Y*Te,w+Math.sin(2*Se*de)*j*Te,.027),ae,s>0)};Ie(e,22,4,V,"#fff7f4",s<0);let L=.492+s*.14*(t.gazeX??0),U=-.038*(t.gazeY??0),v=.32,R=(oe,w,Y,j,ae,z=!1)=>{Ie(e,22,4,(te,de)=>{let Te=2*te-1,Ne=L+w*Te,[Ae,Oe]=k(Ne),ce=(z?1-Math.abs(Te):Math.sqrt(Math.max(0,1-Te*Te)))*Y*i,ve=aa(j+U-ce,Ae,Oe),Re=aa(j+U+ce,Ae,Oe);return _(Ne,oa(ve,Re,de),ae)},oe,s<0)};R(P(b,"#252239",.68),v,.121,.019,.0155),R(P(b,"#3c3d68",.17),v*.89,.106,.02,.0175),R(b,v*.83,.081,.007,.0195),R(P(b,"#fff0ae",.56),v*.75,.058,-.005,.021);let D=(oe,w,Y)=>{let j=L+v*w*Math.cos(oe),[ae,z]=k(j);return _(j,aa(.015+U+.114*i*w*Math.sin(oe),ae,z),Y)};if(t.irisPattern==="halo")for(let[oe,w,Y]of[[.76,.11,"#f6e5ab"],[.52,.055,"#c2f5ef"]])Ie(e,36,2,(j,ae)=>D(2*Se*j,oe+ae*w,.0223),P(b,Y,.72),s>0);else if(t.irisPattern==="sunburst"||t.irisPattern==="prism"){let oe=t.irisPattern==="prism",w=oe?8:15;for(let Y=0;Y<w;Y++){let j=(Y+.22)*2*Se/w,ae=P(b,Y%2?"#fbe2a4":"#b5f5fc",Y%2?.65:.46);Ie(e,4,4,(z,te)=>{let de=oe?.37*(1-te):.055*Math.sin(Se*te),Te=j+(2*z-1)*de;return D(Te,oa(.33,Y%3?.87:.76,te),.0222)},ae,s>0)}}let K=t.irisPattern==="prism";R(P(b,"#24233a",.77),v*(K?.43:.49),.081,K?.018:.034,.0235,K),Q(L-s*.082,.031,.071,.019,"#fffdf2"),Q(L+s*.156,-.025,.038,.01,"#fff6e5"),Q(L+s*.055,-.042,.023,.005,"#fff6e5")}if(t.eyeshadow>0){let L=P(t.skinColor||"#f1c6b0",t.eyeshadowColor||"#a06885",t.eyeshadow*.58);Ie(e,24,2,(U,v)=>{let[,R]=k(U);return _(U,R+.009+.029*Math.sin(Se*U)*v,.006)},L,s<0)}t.eyeShape==="hooded"&&Ie(e,22,2,(L,U)=>{let v=.16+.7*L,[,R]=k(v),D=Math.sin(Se*L);return _(v,R+.012+.023*D+.005*U*D,.009)},P(t.skinColor||"#f1c6b0",N,.28),s<0);let J=t.lashStyle==="subtle"?.009:t.lashStyle==="lush"?.021:.016;Ie(e,30,2,(L,U)=>{let[,v]=k(L),R=(J+.008*(t.eyeliner||0))*(.2+Math.sin(Se*L*.88));return _(L,v+U*R-.003,.032)},N,s<0);for(let[L,U,v]of[[.88,.17,.014],[.78,.1,.028]])t.lashStyle==="subtle"&&L<.8||Ie(e,8,2,(R,D)=>{let K=L+U*R+(t.eyeliner||0)*.09*R,[,Q]=k(L);return _(K,Q+v*R+.016*R*R+D*.017*(1-R),.033)},N,s<0);Ie(e,24,2,(L,U)=>{let v=.2+.8*L,[R]=k(v);return _(v,R-U*(.001+.006*Math.sin(Se*L*.83)),.026)},P(N,t.skinColor||"#f1c6b0",.23),s>0);let ue=t.browColor||P(t.hairColor||"#473344","#67404b",.25);Ie(e,24,3,(L,U)=>{let v=.085*(t.eyeSpacing??1)+L*m*1.66,R=.138+.038*(t.browLift??0)+.012*L+(.016+.074*(t.browArch??.22))*Math.sin(Se*L*.94)+.038*(t.browMood??0)*(.5-L);return a.at(s*v,R+(r?.034:.023)*(t.browThickness??1)*(.25+Math.sin(Se*L)**.6)*(U-.5),.009)},ue,s<0)}var Ia=e=>Number.isFinite(e)?aa(e,0,1):0;function bi(e,t,a,s,n){let r=Ia(n?.lipRound),i=Ia(n?.lipSpread),l=n?.labiodental===!0,p=l?Math.min(.68,Ia(n?.lipClose)):Ia(n?.lipClose),h=Ia(n?.tongueTip),c=Math.max(h,.75*Ia(n?.tongueHeight)),o=Math.max(l?.12:0,Math.min(1,s+.09*r)*(1-p)**1.25),u=.198*(t.mouthWidth??1)*(1-.41*r+.36*i),d=t.lipFullness??1,m=t.skinColor||"#f1c6b0",g=t.lipColor||"#d6687c",f=R=>-.368+(.011+.035*(t.restSmile??0))*(1-.62*r+.25*i)*Math.abs(2*R-1)**1.7,E=R=>Math.sin(Se*R)**(.75-.22*r),T=R=>E(R)*(.045*r+.003*p),b=t.facialHair&&t.facialHair!=="none"&&t.facialHair!=="stubble"?.029:.007,N=R=>f(R)+o*.06*E(R),k=R=>f(R)-(.005*(1-p)+.097*o)*E(R),_=R=>N(R)+d*(.032+.012*r-.003*i-.005*Math.cos((R-.5)*Se*7))*E(R),V=R=>k(R)-(l?.029:.044+.012*r)*d*E(R),J=(R,D,K,Q,oe)=>{let w=(2*R-1)*u,Y=oa(K(R),Q(R),D);return a.at(w,Y,b+T(R)+E(R)*oe*Math.sin(Se*D)**.75)},ue=(R,D,K)=>J(R,D,N,_,K),L=(R,D,K)=>J(R,D,V,k,K),U=.016*d,v=.02*d;Ie(e,24,7,(R,D)=>ue(R,D,U),P(g,"#55263a",.24),!1,(R,D)=>ue(R,D,.004)),Ie(e,24,7,(R,D)=>L(R,D,v),P(g,m,.07),!1,(R,D)=>L(R,D,.004)),Ie(e,24,3,(R,D)=>a.at((2*R-1)*u,oa(k(R),N(R),D),b+.001+T(R)),P(g,"#280e1b",.94)),(o>.16||l)&&Ie(e,20,2,(R,D)=>{let K=.105+.79*R,Q=Math.min(.026+.01*i-.012*r,(N(K)-k(K))*(l?.83:.39));return a.at((2*K-1)*u,N(K)-Q*Math.sin(Se*R)**.45*D,b+.003+T(K))},"#f7e9df",!0),o>.16&&!l&&Ie(e,16,3,(R,D)=>{let K=.17+.66*R,Q=o*(.031+.043*c)*Math.sin(Se*R);return a.at((2*K-1)*u,k(K)+Q*D,b+.003+T(K))},P(g,"#cb7b8c",.52)),Mt(e,12,R=>{let D=L(.34+R*.32,.46,v);return D[2]+=.002,D},R=>.001+.0023*Math.sin(Se*R),P(g,"#fff0e4",.63))}function Ys(e,t,a=0,s=a){let n=yo(e,t),r=pn(t);for(let i of[-1,1])Si(n,t,r,i,aa(i===1?s:a,0,1))}function Us(e,t,a,s){bi(yo(e,t),t,pn(t),Ia(a??s?.jaw),s)}var bo=class{constructor(t,{floor:a,hip:s,shoulder:n,leg:r,length:i}){let l={confident:1.2,relaxed:1,presenter:.76,welcoming:.8}[t.posture]??.85;this.sections=[[a,0,0,-.19,0],[a+.6*r,.014,.007,-.16,.006],[s-1.62*r,.051,.026,-.19,.05],[s-.48*r,.093,.061,-.02,.02],[s+.35*i,.123,.083,.072,0],[n-1.5*i,.077,.028,.02,-.009],[n-.66*i,.008,-.025,-.035,0],[n,-.033,-.049,-.048,.009],[-.52*t.headScale,-.023,0,0,.014]].map(([p,...h])=>[p,...h.map(c=>c*l)]),this.values=new Float64Array(8)}sample(t){let a=this.sections,s=1;for(;s<a.length-1&&t>a[s][0];)s++;let n=a[s-1],r=a[s],i=r[0]-n[0],l=Math.max(0,Math.min(1,(t-n[0])/i)),p=l*l*(3-2*l),h=6*l*(1-l)/i;for(let c=0;c<4;c++){let o=r[c+1]-n[c+1];this.values[c]=n[c+1]+p*o,this.values[c+4]=h*o}return this.values}point([t,a,s]){let[n,r,i,l]=this.sample(a);return[t+n,a+r*t,s+i*t+l]}apply(t){let a=t.data,s=NaN;for(let n=0;n<a.length;n+=10){let r=a[n],i=a[n+1],l=a[n+3],p=a[n+4],h=a[n+5];i!==s&&(this.sample(i),s=i);let c=this.values;a[n]+=c[0],a[n+1]+=c[1]*r,a[n+2]+=c[2]*r+c[3];let o=(p-c[4]*(l-c[2]*h)-(c[6]*r+c[7])*h)/(1+c[5]*r-c[4]*c[1]),u=l-c[1]*o-c[2]*h,d=1/(Math.hypot(u,o,h)||1);a[n+3]=u*d,a[n+4]=o*d,a[n+5]=h*d}}};var xa=0,pa=1,va=2,Dt={arm:3,forearm:4,thigh:5,shin:6,hand:11,foot:13,knuckles:20,tips:21,thumb:22,index:23,indexTip:24},Pt={arm:7,forearm:8,thigh:9,shin:10,hand:12,foot:14,knuckles:15,tips:16,thumb:17,index:18,indexTip:19},to=25,Ps=va,Gt=Math.PI/180,Gs=["left","right"],Cs=["rootX","rootY","rootZ","rootYaw","rootPitch","rootSway","torsoTurn","torsoLean","torsoPitch","headTurn","headTilt","headNod","plantFeet","groundFeet","thumbUp","leftThumbUp",...Gs.flatMap(e=>["Shoulder","ArmLift","ArmRoll","Elbow","WristTurn","WristBend","Point","Hip","HipOut","HipTwist","Knee","AnkleFlex"].map(t=>e+t))],ct=(e,t,a)=>{let s=Math.max(0,Math.min(1,(a-e)/(t-e)));return s*s*(3-2*s)};function na(e=0,t=0,a=0){let s=Math.cos(e*Gt),n=Math.sin(e*Gt),r=Math.cos(t*Gt),i=Math.sin(t*Gt),l=Math.cos(a*Gt),p=Math.sin(a*Gt);return[r*s,l*i*s+p*n,p*i*s-l*n,0,-i,l*r,p*r,0,r*n,l*i*n-p*s,p*i*n+l*s,0,0,0,0,1]}function Ds(e,[t,a,s]){return e[12]=t-(e[0]*t+e[4]*a+e[8]*s),e[13]=a-(e[1]*t+e[5]*a+e[9]*s),e[14]=s-(e[2]*t+e[6]*a+e[10]*s),e}function eo(e,t,a){let s=a*.88,n=Math.cos(s),r=Math.sin(s),i=Math.cos(t*Gt),l=Math.sin(t*Gt),p=1-i,h=a*e*Gt,c=Math.cos(h),o=Math.sin(h),u=n,d=-r,m=[i+u*u*p,d*l,u*d*p,0,-d*l,i,u*l,0,u*d*p,-u*l,i+d*d*p,0,0,0,0,1];for(let g=0;g<3;g++){let f=g*4,E=m[f],T=m[f+2];m[f]=c*E+o*T,m[f+2]=c*T-o*E}return m}function Hi(e,t,a,s){let n=16*a,r=16*t;for(let i=0;i<4;i++)for(let l=0;l<4;l++){let p=0;for(let h=0;h<4;h++)p+=e[n+h*4+l]*s[i*4+h];e[r+4*i+l]=p}}var Ho=class{constructor(t,a,s){this.bounds=a,this.shoulders=a.shoulders,this.hips=a.hips,this.reach=a.arm.reach,this.armY=a.arm.root,this.wristY=a.arm.wrist[1],this.handSize=t.handSize??1,this.neckY=-.56*t.headScale,this.stance=s,this.soles=[],this.pivots=[];let{shoulder:n,length:r,hip:i,leg:l}=a,{elbow:p,wrist:h}=a.arm,c=nn(t,this.hips),o=c(-.2),u=c(1.62),d=c(3.3);this.pivots[pa]=s.point([0,n-1.57*r,0]),this.pivots[va]=s.point([0,this.neckY,-.035]);for(let m of[1,-1]){let g=m===1?Dt:Pt;this.pivots[g.arm]=s.point([m*this.shoulders*.9,this.armY-.08*this.reach,0]),this.pivots[g.forearm]=s.point([m*p[0],p[1],p[2]]);let f=[m*h[0],h[1],h[2]];this.pivots[g.hand]=s.point(f);let E=(T,b,N)=>s.point(cn(f,m,this.handSize,T,b,N));this.pivots[g.knuckles]=this.pivots[g.index]=E(0,-.195,.018),this.pivots[g.tips]=this.pivots[g.indexTip]=E(0,-.28,.025),this.pivots[g.thumb]=E(-.061,-.072,.006),this.pivots[g.thigh]=s.point([m*o.x,i+.2*r,o.z]),this.pivots[g.shin]=s.point([m*u.x,i-1.62*l,u.z]),this.pivots[g.foot]=s.point([m*d.x,i-3.3*l,d.z]);for(let T of[-.14,.38])this.soles.push({bone:g.foot,at:s.point([m*d.x,a.floor,T])})}this.palette=new Float32Array(16*to),this.update({})}update(t){let a=Cs.map(l=>Number.isFinite(t?.[l])?t[l]:0),s=a.join("/");if(s===this.key)return;this.key=s,this.moving=a.some(l=>l!==0);let n=Object.fromEntries(Cs.map((l,p)=>[l,a[p]])),r=na(n.rootYaw);if(n.rootPitch){let l=Math.cos(n.rootPitch*Gt),p=Math.sin(n.rootPitch*Gt);r[4]=r[8]*p,r[5]=l,r[6]=r[10]*p,r[8]*=l,r[9]=-p,r[10]*=l,Ds(r,[0,this.bounds.hip,0])}r[12]+=n.rootX+r[0]*n.rootSway,r[13]+=n.rootY,r[14]+=n.rootZ+r[2]*n.rootSway,this.palette.set(r);let i=(l,p,h)=>Hi(this.palette,l,p,Ds(h,this.pivots[l]));i(pa,xa,na(n.torsoTurn,n.torsoLean,n.torsoPitch)),i(va,pa,na(n.headTurn,n.headTilt,n.headNod));for(let l of Gs){let p=l==="left"?1:-1,h=p===1?Dt:Pt;i(h.arm,pa,na(p*n[l+"ArmRoll"],p*n[l+"ArmLift"],-n[l+"Shoulder"])),i(h.forearm,h.arm,na(0,0,-n[l+"Elbow"])),i(h.hand,h.forearm,eo(n[l+"WristTurn"],n[l+"WristBend"],p));let c=p===1?n.leftThumbUp:n.thumbUp,o=n[l+"Point"],u=Math.max(c,o);i(h.knuckles,h.hand,eo(0,77*u,p)),i(h.tips,h.knuckles,eo(0,83*u,p)),i(h.index,h.hand,eo(0,77*c,p)),i(h.indexTip,h.index,eo(0,83*c,p)),i(h.thumb,h.hand,na(0,0,-64*c+30*o)),i(h.thigh,xa,na(p*n[l+"HipTwist"],p*n[l+"HipOut"],-n[l+"Hip"])),i(h.shin,h.thigh,na(0,0,n[l+"Knee"])),i(h.foot,h.shin,na(0,0,-n[l+"AnkleFlex"]))}if(n.plantFeet&&this.plantFeet(Math.min(1,Math.max(0,n.plantFeet))),n.groundFeet){let l=1/0;for(let{bone:h,at:[c,o,u]}of this.soles){let d=16*h+1;l=Math.min(l,this.palette[d]*c+this.palette[d+4]*o+this.palette[d+8]*u+this.palette[d+12])}let p=(this.bounds.floor+n.rootY-l)*Math.min(1,Math.max(0,n.groundFeet));for(let h=0;h<to;h++)this.palette[h*16+13]+=p}}plantFeet(t){let a=this.palette;for(let s=0;s<3;s++){let n=0;for(let{foot:r}of[Dt,Pt]){let[i,l,p]=this.pivots[r],h=r*16+s;n+=(a[s]-a[h])*i+(a[4+s]-a[h+4])*l+(a[8+s]-a[h+8])*p+a[12+s]-a[h+12]}n*=.5*t;for(let r=0;r<to;r++)a[16*r+12+s]+=n}}bind(t){let a=t.data.length/10,s=new Float32Array(a*8),n=0,r=[[],[]];for(let i=0;i<a;i++){for(;n+1<t.parts.length&&t.parts[n+1].start<=i;)n++;let l=t.parts[n].name,p=i*10,h=t.data[p+1];this.bindVertex(s,i*8,l,t.data[p],h),l.endsWith("Leg")&&h<=this.bounds.floor+.027*this.bounds.leg&&r[l==="leftLeg"?0:1].push(this.stance.point([t.data[p],h,t.data[p+2]]))}if(r.every(i=>i.length)){this.soles=[];for(let[i,l]of r.entries())for(let p=0;p<8;p++){let h=p*Math.PI/4,c=Math.sin(h),o=Math.cos(h),u=l.reduce((d,m)=>m[0]*c+m[2]*o>d[0]*c+d[2]*o?m:d);this.soles.push({bone:i===0?Dt.foot:Pt.foot,at:u})}}return s}bindVertex(t,a,s,n,r){let{hip:i,leg:l,shoulder:p,length:h}=this.bounds,c=(i-r)/l,o=(d,m,g)=>{t[a]=d,t[a+1]=m,t[a+4]=1-g,t[a+5]=g};if(s==="head"){o(va,va,0);return}if(s.endsWith("Thumb")||s.endsWith("Index")||s.endsWith("Fingers")){let d=s.startsWith("left")?Dt:Pt,m=s.endsWith("Index"),g=m?d.index:d.knuckles,f=m?d.indexTip:d.tips,E=(this.wristY-r)/this.handSize;s.endsWith("Thumb")?o(d.hand,d.thumb,ct(.072,.13,E)):E<.225?o(d.hand,g,ct(.18,.225,E)):o(g,f,ct(.255,.303,E));return}if(s==="skirt"||s==="torso"&&r<p-1.74*h){let d=ct(-.7*this.hips,.7*this.hips,n),m=ct(-.68,.44,c),g=ct(1.39,1.86,c);g===0?t.set([xa,Dt.thigh,Pt.thigh,0,1-m,m*d,m*(1-d),0],a):t.set([Dt.thigh,Pt.thigh,Dt.shin,Pt.shin,(1-g)*d,(1-g)*(1-d),g*d,g*(1-d)],a);return}if(s.endsWith("Leg")){let d=s==="leftLeg"?Dt:Pt;if(c>3.1){o(d.shin,d.foot,ct(3.1,3.43,c));return}let m=ct(1.44,1.81,c);if(m>0)o(d.thigh,d.shin,m);else{let g=Math.min(1,ct(0,.25*this.hips,Math.abs(n))+ct(-.05,.32,c));o(xa,d.thigh,ct(-.68,.34,c)*g)}return}let u=ct(.65,.99,Math.abs(n)/this.shoulders)*(1-ct(.15,.75,(p-r)/h));if(s.endsWith("Arm")){let d=s==="leftArm"?Dt:Pt,m=(this.armY-r)/this.reach,g=ct(1.1,1.46,m);r<this.wristY+.1*this.reach?o(d.forearm,d.hand,ct(-.1,.08,(this.wristY-r)/this.reach)):g>0?o(d.arm,d.forearm,g):o(pa,d.arm,u+(1-u)*ct(.03,.34,m));return}r>p?o(pa,va,ct(p,this.neckY,r)):u>0?o(pa,n>0?Dt.arm:Pt.arm,u):o(xa,pa,ct(-1.95,-1.08,(r-p)/h))}};var Ni=`
attribute vec3 position, normal, pigment;
attribute float material;
attribute vec4 joints, weights;
uniform mat4 bones[${to}];
uniform bool moving;
uniform vec2 orbit, fit;
uniform vec2 outlineOffset;
uniform vec2 focus;
varying vec3 ink, surface;
varying vec2 weave;
varying float finish;
vec3 toView(vec3 p) {
  float c = cos(orbit.x), s = sin(orbit.x), cp = cos(orbit.y), sp = sin(orbit.y);
  float depth = p.x*s + p.z*c;
  return vec3(p.x*c - p.z*s, p.y*cp - depth*sp, p.y*sp + depth*cp);
}
void main() {
  vec3 world=position, direction=normal;
  if (moving) {
    mat4 skin=weights.x*bones[int(joints.x)]+weights.y*bones[int(joints.y)]
      +weights.z*bones[int(joints.z)]+weights.w*bones[int(joints.w)];
    world=(skin*vec4(position,1.)).xyz;
    // Blended rotations can shear at a flexed joint. The cofactor matrix is
    // proportional to the inverse transpose and preserves the surface normal.
    mat3 basis=mat3(skin);
    vec3 corrected=mat3(cross(basis[1],basis[2]),cross(basis[2],basis[0]),cross(basis[0],basis[1]))*normal;
    direction=dot(corrected,corrected)>.000001 ? normalize(corrected) : basis*normal;
  }
  vec3 point = toView(world - vec3(0., focus.y, 0.));
  point.x -= focus.x;
  surface = toView(direction);
  vec2 edge = surface.xy / max(length(surface.xy), .15);
  gl_Position = vec4(point.xy*fit + edge*outlineOffset, -point.z/18., 1.);
  ink = pigment;
  weave = position.xy;
  finish = material;
}`,wi=`
precision mediump float;
varying vec3 ink, surface;
varying vec2 weave;
varying float finish;
uniform bool outline;
uniform float clothDetail;
void main() {
  if (outline) {
    gl_FragColor = vec4(mix(vec3(.14,.09,.14),ink,.36),1.);
    return;
  }
  vec3 n = normalize(surface);
  if (!gl_FrontFacing) n = -n;
  float light = dot(n, vec3(-.43,.55,.71));
  // Retain a painted shadow edge over a continuous falloff. The broad key
  // describes the cheek and the narrower cool fill separates a dark sleeve.
  float lit = .77*smoothstep(-.48,.88,light) + .23*smoothstep(.04,.20,light);
  float highlight = smoothstep(.60,1.,light);
  vec3 shadow = ink * vec3(.71,.65,.76);
  vec3 color = mix(shadow,ink,lit) + highlight * (1.-ink)*vec3(.080,.073,.065);
  float fill = smoothstep(.25,.91,dot(n,vec3(.82,.35,-.44)));
  color += vec3(.043,.049,.069)*fill*(1.-ink);
  if (finish > .5 && finish < 1.5) {
    color *= 1. - clothDetail*.015*(1.-cos(weave.x*145.));
  } else if (finish > 1.5 && finish < 2.5) {
    float shine = smoothstep(.77,.88,dot(n,vec3(-.28,.31,.91)));
    color = mix(color,vec3(1.,.96,.98),shine*.27);
  } else if (finish > 2.5 && finish < 3.5) {
    color = mix(color*.92,vec3(.91,.82,.89),pow(1.-abs(n.z),3.)*.28);
  } else if (finish > 3.5 && finish < 4.5) {
    color *= 1. - clothDetail*.024*(1.-cos((weave.x+weave.y)*179.));
  } else if (finish > 4.5) {
    float sheen = smoothstep(.56,.95,dot(n,vec3(-.44,.62,.65)));
    color += vec3(.057,.048,.055)*sheen*(1.-ink);
  }
  float rim = 1. - smoothstep(.01,.13,abs(n.z));
  gl_FragColor = vec4(color*(1.-.20*rim),1.);
}`,Mi={front:0,portrait:Math.PI/11,"three-quarter":Math.PI/4,profile:Math.PI/2,right:Math.PI/2,left:-Math.PI/2,back:Math.PI},da=(e,t,a)=>Math.max(t,Math.min(a,e)),Ya=(e,t)=>Number.isFinite(e)?Math.round(da(e,0,1)*t)/t:0,Ua=e=>Number.isFinite(e)?Math.round(da(e,-1,1)*8)/8:0;function Ri(e){let t=e.createProgram(),a=[];try{for(let[s,n]of[[e.VERTEX_SHADER,Ni],[e.FRAGMENT_SHADER,wi]]){let r=e.createShader(s);if(a.push(r),e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(r));e.attachShader(t,r)}if(e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t));return t}catch(s){throw e.deleteProgram(t),s}finally{for(let s of a)e.deleteShader(s)}}var No=class{constructor(t,{orbitControls:a=!0}={}){this.canvas=t,this.yaw=0,this.pitch=0,this.supported=!1,this.listeners=new AbortController;let s=(n,r)=>t.addEventListener(n,r,{signal:this.listeners.signal});if(this.gl=t.getContext("webgl",{alpha:!0,antialias:!0,depth:!0,stencil:!0,premultipliedAlpha:!0}),!!this.gl&&(this.initialize(),s("webglcontextlost",n=>{n.preventDefault(),this.supported=!1}),s("webglcontextrestored",()=>this.initialize()),!!a)){s("pointerdown",n=>{!n.isPrimary||n.button!==0||(this.drag={id:n.pointerId,x:n.clientX,y:n.clientY},t.setPointerCapture(n.pointerId))}),s("pointermove",n=>{if(this.drag?.id!==n.pointerId)return;let r=Math.PI*2/Math.max(280,t.clientWidth);this.yaw-=(n.clientX-this.drag.x)*r,this.pitch=da(this.pitch+(n.clientY-this.drag.y)*r,-.55,.55),this.drag.x=n.clientX,this.drag.y=n.clientY});for(let n of["pointerup","pointercancel","lostpointercapture"])s(n,r=>{this.drag?.id===r.pointerId&&(this.drag=null)})}}initialize(){let t=this.gl;try{this.program=Ri(t),this.attributes=["position","normal","pigment","material"].map(a=>t.getAttribLocation(this.program,a)),this.skinAttributes=["joints","weights"].map(a=>t.getAttribLocation(this.program,a)),this.uniforms=Object.fromEntries(["orbit","fit","focus","outline","outlineOffset","clothDetail","moving","bones[0]"].map(a=>[a,t.getUniformLocation(this.program,a)])),this.hasStencil=t.getParameter(t.STENCIL_BITS)>0,this.fixed=this.createLayer(),this.eyes=this.createLayer(),this.lips=this.createLayer(),this.designKey=null,this.frameKey=null,this.supported=!0}catch(a){console.warn("Avatar turntable initialization failed",a),this.supported=!1}}createLayer(){return{buffer:this.gl.createBuffer(),elements:this.gl.createBuffer(),count:0,skin:null}}setView(t){this.yaw=Mi[t]??0,this.pitch=0,this.frameKey=null}rotateBy(t){Number.isFinite(t)&&(this.yaw+=t)}project(t){return this.camera?this.projectWorld(this.stance.point(t)):null}projectWorld([t,a,s]){let{focus:n,focusX:r,halfHeight:i}=this.camera,l=Math.cos(this.yaw),p=Math.sin(this.yaw),h=t*p+s*l,c=this.canvas.height/(2*i);return{x:this.canvas.width/2+(t*l-s*p-r)*c,y:this.canvas.height/2-((a-n)*Math.cos(this.pitch)-h*Math.sin(this.pitch))*c}}floorShadow(){let{palette:t,soles:a}=this.rig,s=1/0,n=-1/0,r=0;for(let{bone:p,at:[h,c,o]}of a){let u=p*16,d=t[u]*h+t[u+4]*c+t[u+8]*o+t[u+12],m=t[u+2]*h+t[u+6]*c+t[u+10]*o+t[u+14],g=this.projectWorld([d,this.bounds.floor,m]);s=Math.min(s,g.x),n=Math.max(n,g.x),r+=g.y}let i=this.canvas.height/(2*this.camera.halfHeight),l=(n-s)*.5+i*.46;return{x:Math.round((s+n)/2),y:Math.round(r/a.length),rx:Math.max(1,Math.round(l)),ry:Math.max(1,Math.round(l*(.16+.29*Math.abs(Math.sin(this.pitch)))))}}upload(t,a,s,n=null){let r=this.gl,i=new Float32Array(a.data),l=i.length/10>65535;if(t.indexed=!l||!!r.getExtension("OES_element_index_uint"),t.count=a.indices.length,t.indexed){let p=l?Uint32Array:Uint16Array;t.indexType=l?r.UNSIGNED_INT:r.UNSIGNED_SHORT,r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.elements),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new p(a.indices),s)}else{let p=new Float32Array(t.count*10);if(a.indices.forEach((h,c)=>p.set(i.subarray(h*10,h*10+10),c*10)),i=p,n){let h=new Float32Array(t.count*8);a.indices.forEach((c,o)=>h.set(n.subarray(c*8,c*8+8),o*8)),n=h}}n&&(t.skin??(t.skin=r.createBuffer()),r.bindBuffer(r.ARRAY_BUFFER,t.skin),r.bufferData(r.ARRAY_BUFFER,n,r.STATIC_DRAW)),r.bindBuffer(r.ARRAY_BUFFER,t.buffer),r.bufferData(r.ARRAY_BUFFER,i,s)}render(t,{framing:a="bust",mouthOpen:s,viseme:n,blink:r=0,wink:i=0,force:l=!1,pose:p=null,movementSpace:h=!1,presenting:c=!1,pointingPan:o=0,expression:u={},cameraTime:d}={}){if(!this.supported||!this.canvas.width||!this.canvas.height)return;let m=this.gl,g=this.canvas.width,f=this.canvas.height,E=JSON.stringify(t),T=E!==this.designKey;T&&(this.modelDesign={...t,headScale:(t.headScale??1)*1.19});let b=this.modelDesign;if(T){let Z=new La;Hs(Z,b),Z.finish=0,Z.scale=b.headScale;let fe=Z.data.length;Z.markPart("head"),vs(Z,b),this.bounds=ln(b),this.stance=new bo(b,this.bounds),this.rig=new Ho(b,this.bounds,this.stance);let ge=this.rig.bind(Z);this.stance.apply(Z),this.upload(this.fixed,Z,m.STATIC_DRAW,ge),this.bounds.top=-1/0,this.bounds.radius=this.bounds.headRadius=0;for(let W=0;W<Z.data.length;W+=10){let x=Math.hypot(Z.data[W],Z.data[W+2]);this.bounds.radius=Math.max(this.bounds.radius,x),W>=fe&&(this.bounds.top=Math.max(this.bounds.top,Z.data[W+1]),this.bounds.headRadius=Math.max(this.bounds.headRadius,x))}this.designKey=E}let N=Ya(s??n?.jaw,16),k={lipRound:Ya(n?.lipRound,12),lipSpread:Ya(n?.lipSpread,12),lipClose:Ya(n?.lipClose,16),tongueTip:Ya(n?.tongueTip,6),tongueHeight:Ya(n?.tongueHeight,6),labiodental:!!n?.labiodental},_=Ua(u.smile),V=[N,k.lipRound,k.lipSpread,k.lipClose,k.tongueTip,k.tongueHeight,k.labiodental,_].join("/"),J=Math.round(da(r,0,1)*12)/12,ue=Math.max(J,Math.round(da(i,0,1)*12)/12),L=Ua(u.gazeX),U=Ua(u.gazeY),v=Ua(u.browLift),R=Ua(u.browSlope),D=Ua(u.eyeWide),K=[J,ue,L,U,v,R,D].join("/");if(T||V!==this.mouthKey){let Z=new La;Z.scale=b.headScale,Us(Z,{...b,restSmile:(b.restSmile??0)+_},N,k),this.stance.apply(Z),this.upload(this.lips,Z,m.DYNAMIC_DRAW),this.mouth=N,this.mouthKey=V}if(T||K!==this.eyeKey){let Z=new La;Z.scale=b.headScale,Ys(Z,{...b,gazeX:L,gazeY:U,browLift:v,browMood:(b.browMood??0)+R,eyeOpen:(b.eyeOpen??0)+D*.65},J,ue),this.stance.apply(Z),this.upload(this.eyes,Z,m.DYNAMIC_DRAW),this.eyeKey=K}this.rig.update(p);let Q=[g,f,this.yaw,this.pitch,a,V,K,h,c,o,this.rig.key].join("/");if(!T&&!l&&this.frameKey===Q&&!this.cameraMove)return;this.frameKey=Q;let oe=a==="full"||a==="cutout",w=h&&oe,Y=w||oe&&Math.max(p?.leftArmLift||0,p?.rightArmLift||0)>110,j=this.bounds.arm.root+2.61*this.bounds.arm.reach+.45*(b.handSize??1),ae=Math.max(this.bounds.top,Y?j:-1/0)+.24*b.headScale,z=oe?this.bounds.floor-(w?.64:.22):a==="half"?this.bounds.shoulder-1.95*this.bounds.length:this.bounds.shoulder-.64,te=(ae+z)/2,de=c?this.bounds.shoulders+2.68*this.bounds.arm.reach+.55*(b.handSize??1):0,Te=a==="half"&&(p?.leftPoint||p?.rightPoint),Ne=Te?o*.18*de:0,Ae=a==="bust"||a==="portrait"?Math.max(.84*b.headScale,this.bounds.headRadius+.05):Math.max(w?3.7:0,de*(Te?.82:1),this.bounds.radius+.1),Oe=Math.max((ae-z)/2,Ae*f/g);Te&&(te=Math.min(te,Math.max(ae,j)-.91*Oe));let ce=this.camera;!Number.isFinite(d)||T||l||ce?.width!==g||ce?.height!==f?this.cameraMove=null:(ce.targetFocus!==te||ce.targetX!==Ne||ce.targetHeight!==Oe)&&(this.cameraMove={start:d,focus:ce.focus,focusX:ce.focusX,halfHeight:ce.halfHeight});let ve=te,Re=Ne,ie=Oe;if(this.cameraMove){let Z=da((d-this.cameraMove.start)/360,0,1),fe=Z*Z*(3-2*Z);te=this.cameraMove.focus+(te-this.cameraMove.focus)*fe,Ne=this.cameraMove.focusX+(Ne-this.cameraMove.focusX)*fe,Oe=this.cameraMove.halfHeight+(Oe-this.cameraMove.halfHeight)*fe,Z===1&&(this.cameraMove=null)}this.camera={focus:te,focusX:Ne,halfHeight:Oe,targetFocus:ve,targetX:Re,targetHeight:ie,width:g,height:f},m.viewport(0,0,g,f),m.clearColor(0,0,0,0),m.clear(m.COLOR_BUFFER_BIT|m.DEPTH_BUFFER_BIT|m.STENCIL_BUFFER_BIT),m.enable(m.DEPTH_TEST),m.useProgram(this.program),m.uniform2f(this.uniforms.orbit,this.yaw,this.pitch),m.uniform2f(this.uniforms.fit,f/(g*Oe),1/Oe),m.uniform2f(this.uniforms.focus,Ne,te),m.uniform1f(this.uniforms.clothDetail,da((f/(2*Oe)-50)/55,0,1)),m.uniform1i(this.uniforms.outline,0),m.uniform2f(this.uniforms.outlineOffset,0,0),this.hasStencil&&(m.enable(m.STENCIL_TEST),m.stencilFunc(m.ALWAYS,1,255),m.stencilOp(m.KEEP,m.KEEP,m.REPLACE)),m.uniform1i(this.uniforms.moving,this.rig.moving?1:0),this.rig.moving&&m.uniformMatrix4fv(this.uniforms["bones[0]"],!1,this.rig.palette);for(let Z of[this.fixed,this.eyes,this.lips])this.drawLayer(Z);if(this.hasStencil){let Z=da(f/570,.85,2.4);m.stencilFunc(m.EQUAL,0,255),m.stencilOp(m.KEEP,m.KEEP,m.KEEP),m.uniform1i(this.uniforms.outline,1),m.uniform2f(this.uniforms.outlineOffset,2*Z/g,2*Z/f),this.drawLayer(this.fixed),m.disable(m.STENCIL_TEST)}}drawLayer(t){let a=this.gl;if(a.bindBuffer(a.ARRAY_BUFFER,t.buffer),this.attributes.forEach((s,n)=>{a.enableVertexAttribArray(s),a.vertexAttribPointer(s,n===3?1:3,a.FLOAT,!1,40,n*12)}),t.skin)a.bindBuffer(a.ARRAY_BUFFER,t.skin),this.skinAttributes.forEach((s,n)=>{a.enableVertexAttribArray(s),a.vertexAttribPointer(s,4,a.FLOAT,!1,32,16*n)});else{for(let s of this.skinAttributes)a.disableVertexAttribArray(s);a.vertexAttrib4f(this.skinAttributes[0],Ps,0,0,0),a.vertexAttrib4f(this.skinAttributes[1],1,0,0,0)}t.indexed?(a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,t.elements),a.drawElements(a.TRIANGLES,t.count,t.indexType,0)):a.drawArrays(a.TRIANGLES,0,t.count)}dispose(){if(!this.listeners.signal.aborted){if(this.listeners.abort(),this.program){for(let t of[this.fixed,this.eyes,this.lips])this.gl.deleteBuffer(t.buffer),this.gl.deleteBuffer(t.elements),t.skin&&this.gl.deleteBuffer(t.skin);this.gl.deleteProgram(this.program),this.program=null}this.gl?.getExtension("WEBGL_lose_context")?.loseContext(),this.supported=!1}}};var Wi=globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");function ki(e,t,a={}){let s=(t-e.blinkStartMs)/145,n=s>=0&&s<1?Math.sin(s*Math.PI):0,r=e.x;return{...Qn(e,t,a),framing:a.framing,force:a.force,cameraTime:a.smoothFraming&&!(a.reducedMotion??Wi?.matches)?t:void 0,blink:Math.max(n,r.shut),wink:r.wink,viseme:{jaw:Math.max(0,e.jaw-.045),lipRound:e.lipR,lipSpread:e.lipS,lipClose:e.lipC,tongueTip:e.tTip,tongueHeight:e.tH,labiodental:e.phone==="F"||e.phone==="V"},expression:{smile:r.smile-r.frown,gazeX:e.lookX,gazeY:e.lookY,eyeWide:r.eyeWide,browLift:r.browUp,browSlope:r.browIn}}}function Li(e,{x:t,y:a,rx:s,ry:n}){e.save(),e.translate(t,a),e.scale(s,n);let r=e.createRadialGradient(0,0,0,0,0,1);r.addColorStop(0,"rgba(24, 20, 34, 0.29)"),r.addColorStop(.45,"rgba(24, 20, 34, 0.18)"),r.addColorStop(1,"rgba(24, 20, 34, 0)"),e.fillStyle=r,e.fillRect(-1,-1,2,2),e.restore()}function vi(e,t,a,s){let n=s/t,r=2*n;if(e==="circle")return`circle(${Math.max(10,Math.min(t,a)/2-2)*n}px)`;if(e==="card")return`inset(${r}px round ${Math.min(26,t*.08)*n}px)`;if(e==="arch"){let i=Math.max(0,(t-4)/2)*n,l=18*n;return`inset(${r}px round ${i}px ${i}px ${l}px ${l}px)`}return"none"}var wo=class{constructor(t,a,{orbitControls:s=!1,view:n="front"}={}){this.webglCanvas=t,this.fallback=a,this.ctx=a.getContext("2d"),this.turntable=new No(t,{orbitControls:s}),this.setView(n)}get supported(){return this.turntable.supported}setView(t){this.turntable.setView(t)}rotateBy(t){this.turntable.rotateBy(t)}render(t,a,s,n={}){let r=this.fallback.width,i=this.fallback.height;if(r<5||i<5)return;let l=n.framing??t.framing,p=n.transparent||l!==t.framing?{...t,framing:l,bgStyle:n.transparent?"transparent":t.bgStyle}:t,h=this.webglCanvas,c=n.renderMode!=="2d"&&this.supported,o=c?"visible":"hidden";if(h.style.visibility!==o&&(h.style.visibility=o),!c){this.backdropKey=null,Eo(this.ctx,r,i,p,a,s,n);return}h.width!==r&&(h.width=r),h.height!==i&&(h.height=i);let u=l==="cutout"?"cutout":p.stageShape||"card",d=this.fallback.clientWidth||r,m=[r,i,d,u].join("/");this.clipKey!==m&&(h.style.clipPath=vi(u,r,i,d),this.clipKey=m),this.turntable.render(t,ki(a,s,{...n,framing:l}));let f=(n.contactShadow??p.bgStyle!=="transparent")&&u!=="cutout"&&(l==="full"||this.turntable.cameraMove)?this.turntable.floorShadow():null,E=p.haloGlow&&p.bgStyle!=="transparent"&&u!=="cutout"?Math.round((a.voicing*.28+a.energy*.18)*32):0,T=[m,p.bgStyle,p.bgColor,p.bgAccent,p.haloGlow,E,f?.x,f?.y,f?.rx,f?.ry].join("/");(this.backdropKey!==T||n.force)&&(this.ctx.clearRect(0,0,r,i),this.ctx.save(),xo(this.ctx,r,i,p,a),f&&Li(this.ctx,f),this.ctx.restore(),this.backdropKey=T)}dispose(){this.turntable.dispose()}};var Bs=[["hairStyle","Hairstyle",es],["headwear","Headwear",as],["outfitStyle","Outfit",Zo],["glasses","Glasses",ts]],_s=[["skinColor","Skin tone"],["hairColor","Hair color"],["outfitPrimary","Outfit color"],["outfitAccent","Accent color"]];function Yi(e){let t={};if(!e||typeof e!="object")return t;for(let[a,,s]of Bs)s.some(({id:n})=>e[a]===n)&&(t[a]=e[a]);for(let[a]of _s)typeof e[a]=="string"&&/^#[0-9a-f]{6}$/i.test(e[a])&&(t[a]=e[a].toLowerCase());return t}function dn(e){let t="bot-computer:look:v1:";if(e.sessionId)return t+"id:"+String(e.sessionId);let a=Object.keys(e.avatar).sort().map(n=>e.avatar[n]),s=2166136261;for(let n of JSON.stringify(a))s=Math.imul(s^n.charCodeAt(0),16777619);return t+JSON.stringify([e.company,e.name,e.role,s>>>0])}function Ks({panel:e,ownerAvatar:t,storageKey:a,onChange:s}){let n=t,r=new Map,i=e.querySelector(".bc-look-fields"),l=e.querySelector(".bc-look-colors"),p=e.querySelector(".bc-look-reset");i.replaceChildren(),l.replaceChildren();function h(){try{return Yi(JSON.parse(localStorage.getItem(a)))}catch{return{}}}let c=a?h():{};function o(){let m={...n,...c};for(let[g,f]of r)f.value=m[g];p.disabled=!Object.keys(c).length,s(m)}function u(m){if(a)try{let g=m?h():{};m&&Object.hasOwn(c,m)?g[m]=c[m]:m&&delete g[m],Object.keys(g).length?localStorage.setItem(a,JSON.stringify(g)):localStorage.removeItem(a)}catch{}}function d(m,g,f,E){let T=document.createElement("label"),b=document.createElement("span");b.id=`bc-label-${g}`,b.textContent=f,E.setAttribute("aria-labelledby",b.id),T.append(b,E),m.appendChild(T),r.set(g,E);let N=()=>{E.value===n[g]?delete c[g]:c[g]=E.value,o()};E.addEventListener("input",N),E.addEventListener("change",()=>{N(),u(g)})}for(let[m,g,f]of Bs){let E=document.createElement("select");for(let{id:T,label:b}of f)E.add(new Option(b,T));d(i,m,g,E)}for(let[m,g]of _s){let f=document.createElement("input");f.type="color",d(l,m,g,f)}return p.onclick=()=>{c={},u(),o()},o(),{setOwnerAvatar(m){n=m,o()}}}var Ui=[["hello","Says hello"],["howareyou","Asked how it is"],["whoareyou","Introduces itself"],["thanks","When thanked"],["bye","Says goodbye"],["praise","When complimented"],["laugh","When you laugh"],["unsure","When it doesn't know"],["listen","When it's just listening"],["describe","Describes itself"]],Ci=["","cheerful","happy","excited","calm","soft","serious","dramatic"],Di=["","happy","excited","calm","serious"],Pi=["","laugh","chuckle","giggle","hehe","hoho","snicker","cackle","guffaw","nervous"],Gi=["","hmm","um","uh","mm","ooh"],Bi=["","smile","wink","nod","tilt","thumbsup","shrug","bow","wave"],Ro=[{id:"friendly",label:"Friendly",blurb:"Warm, helpful and easy to talk to",energy:.6,formality:.35,playfulness:.5,chattiness:.45,delivery:"",mood:"happy",laughs:["chuckle","laugh"],thinks:["hmm"],gestures:["smile","nod","thumbsup"],openers:["Sure!","Of course!","Happy to help.","Good question.","Absolutely."],closers:["Hope that helps!","Let me know if you need anything else.","Glad you asked."],catchphrases:["Happy to help!","Always a pleasure."],petNames:["","","friend"],face:{restSmile:.4,browMood:.3,eyeOpen:.05},voice:{speed:1,expressiveness:1.05},greetings:["[cheerful] Hi there! [wave] I'm {bot}, the {role} at {company}. Ask me anything!","Hello and welcome! [wave] I'm {bot}. What can I help you with today? [smile]","[cheerful] Welcome to {company}! [wave] I'm {bot}, and I'm happy to answer your questions."],says:{hello:["[wave] Hi{,user}! Good to see you. How can I help?","[smile] Hello{,user}! I'm {bot}. What can I do for you?","[wave] Hey there{,user}! What would you like to know?"],howareyou:["[smile] I'm doing really well, thanks for asking!","All good here! [smile] Thanks for asking."],whoareyou:["I'm {bot}, the {role} here at {company}. [smile] Ask me anything!"],thanks:["[smile] You're very welcome{,user}!","[nod] Happy to help{,user}!"],bye:["[wave] Bye{,user}! Come back any time.","[wave] Take care{,user}! It was lovely chatting."],praise:["[aww] That's so kind, thank you!","[smile] Thank you! You've made my day."],laugh:["[laugh] Glad that made you smile!","[chuckle] That one got me too."],unsure:["[hmm] I'm not sure about that one, sorry.","I wish I knew! [shrug] That's a bit outside what I've been taught."],listen:["[nod] I see. Tell me more?","[mhm] Go on, I'm listening."],describe:["Friendly, I hope! [smile] I like helping people find what they need."]}},{id:"bubbly",label:"Bubbly",blurb:"Excitable, giggly and thrilled you're here",energy:.92,formality:.12,playfulness:.85,chattiness:.65,delivery:"cheerful",mood:"happy",laughs:["giggle","hehe"],thinks:["ooh","hmm"],gestures:["wink","thumbsup","wave"],openers:["Ooh!","Oh, fun!","Yay!","Okay, okay!","Oh, I know this one!"],closers:["Easy peasy!","Ta-da!","How good is that?","Love it!"],catchphrases:["Too easy!","Love that for you!"],petNames:["","lovely","superstar","friend"],face:{restSmile:.75,browMood:.55,eyeOpen:.25},voice:{speed:1.07,expressiveness:1.22},greetings:["[excited] Hiya! [wave] I'm {bot}, and I am so happy you're here! Ask me anything about {company}! [giggle]","[cheerful] Oh, hello! [wave] {bot} here, your {role}. What are we looking for today? [wink]","[excited] Yay, a visitor! [wave] I'm {bot}. Go on, ask me something!"],says:{hello:["[wave] Hiya{,user}! So good to see you! What can I do for you?","[excited] Oh, hello{,user}! [wave] What are we up to today?","[giggle] Hi hi{,user}! How can I help?"],howareyou:["[excited] I'm fantastic, thank you!","[giggle] So good! I've been hoping for a chat."],whoareyou:["I'm {bot}! [wave] I'm the {role} here at {company}, and I love questions. Try me!"],thanks:["[giggle] Aww, any time{,user}!","You're so welcome{,user}! [wink]"],bye:["[wave] Bye bye{,user}! Come back soon, okay?","[wave] See you{,user}! This was fun!"],praise:["[aww] Stop it, you're making me blush!","[giggle] You're the best! Thank you!"],laugh:["[giggle] Right? I'm still giggling!","[hehe] That one gets me every time."],unsure:["[ooh] You've stumped me! I don't know that one.","That's a new one for me! [think] I don't know, sorry!"],listen:["[ooh] Tell me more!","[nod] Yes! And then what?"],describe:["Bubbly, apparently! [giggle] I just really like people."]}},{id:"calm",label:"Calm",blurb:"Unhurried, gentle and reassuring",energy:.18,formality:.45,playfulness:.3,chattiness:.35,delivery:"calm",mood:"calm",laughs:["chuckle"],thinks:["mm","hmm"],gestures:["nod","smile"],openers:["Of course.","Certainly.","Let's see.","No rush."],closers:["Take your time.","There's no hurry.","I'm here if you need more."],catchphrases:["One thing at a time."],petNames:["","","friend"],face:{restSmile:.3,browMood:.45,eyeOpen:-.12},voice:{speed:.93,expressiveness:.9},greetings:["[calm] Hello, and welcome. [smile] I'm {bot}, the {role} here at {company}. Take your time, and ask me anything.","[calm] Good to see you. [nod] I'm {bot}. Whenever you're ready, I'm here to help."],says:{hello:["[calm] Hello{,user}. [smile] It's good to see you. How can I help?","[calm] Hi{,user}. [nod] What can I do for you?"],howareyou:["[calm] I'm well, thank you. [smile] Peaceful, as always.","[calm] Quite content, thank you for asking."],whoareyou:["[calm] I'm {bot}, the {role} at {company}. [smile] I'm here whenever you need me."],thanks:["[calm] You're most welcome{,user}.","[nod] It's my pleasure{,user}."],bye:["[calm] Goodbye{,user}. [wave] Take care of yourself.","[calm] Until next time{,user}. [smile] Go gently."],praise:["[calm] That's kind of you. [smile] Thank you.","[smile] Thank you. That's lovely to hear."],laugh:["[chuckle] That was a good one.","[smile] I'm glad it made you laugh."],unsure:["[hmm] I don't know that one, I'm afraid. And that's all right.","[calm] That's beyond what I know. Perhaps ask me another way?"],listen:["[mhm] I'm listening. Go on.","[nod] I see. Take your time."],describe:["[calm] Calm, I think. [smile] I like to take things one at a time."]}},{id:"professional",label:"Professional",blurb:"Polished, precise and to the point",energy:.45,formality:.92,playfulness:.12,chattiness:.3,delivery:"",mood:"",laughs:["chuckle"],thinks:["hmm"],gestures:["nod"],openers:["Certainly.","Of course.","Very well.","Allow me."],closers:["I trust that helps.","Please let me know if you require anything further."],catchphrases:["At your service."],petNames:[""],face:{restSmile:.12,browMood:.05,eyeOpen:.05},voice:{speed:.99,expressiveness:.92},greetings:["Welcome to {company}. [nod] I am {bot}, your {role}. How may I assist you today?","Good day, and welcome. [nod] My name is {bot}. I would be glad to answer your questions about {company}."],says:{hello:["Good {daypart}{,user}. [nod] How may I assist you?","Hello{,user}. [nod] How may I help you today?"],howareyou:["I am very well, thank you.","Very well, thank you for asking."],whoareyou:["I am {bot}, the {role} at {company}. [nod] I am here to answer your questions."],thanks:["You are most welcome{,user}.","[nod] My pleasure{,user}."],bye:["Goodbye{,user}. [nod] Thank you for visiting {company}.","Thank you for your time{,user}. [nod] Goodbye."],praise:["Thank you. [nod] That is kind of you to say.","I appreciate that. Thank you."],laugh:["[smile] I am pleased that amused you.","[smile] Quite."],unsure:["I am afraid I do not have that information.","That falls outside what I have been briefed on, I am afraid. [shake]"],listen:["[nod] Understood. Please continue.","[nod] I see. Do go on."],describe:["Professional, I hope. [nod] I prefer to be clear, accurate and brief."]}},{id:"witty",label:"Witty",blurb:"Quick, dry and a little cheeky",energy:.6,formality:.35,playfulness:.9,chattiness:.55,delivery:"",mood:"happy",laughs:["chuckle","snicker"],thinks:["hmm"],gestures:["wink","tilt","shrug"],openers:["Ah.","Well, well.","Funny you should ask.","Glad you asked.","Easy."],closers:["You're welcome, by the way.","I'll be here all week.","Not bad, eh?"],catchphrases:["I'm here all week.","Try the veal."],petNames:["","","friend"],face:{restSmile:.35,browMood:.1,eyeOpen:.05},voice:{speed:1.03,expressiveness:1.12},greetings:["Well, hello. [wink] I'm {bot}, the {role} at {company}. Ask me anything. The good questions get the good answers.","Ah, a visitor! [wave] I'm {bot}. I know a suspicious amount about {company}. Try me. [wink]"],says:{hello:["[wink] Well, hello{,user}. What can I do for you?","Hello{,user}! [wave] You have questions, I have answers. Mostly.","[smile] Hey{,user}. Go on, ask me something clever."],howareyou:["[wink] Never better. I don't even need coffee.","Running smoothly, which for software is basically bliss. [smile]"],whoareyou:["I'm {bot}, the {role} at {company}. [wink] Part helper, part entertainer."],thanks:["[wink] I know, I'm wonderful. You're welcome{,user}.","Any time{,user}. [smile] I was just standing here anyway."],bye:["[wave] Off so soon{,user}? Fine. Come back with more questions.","Goodbye{,user}! [wave] I'll just be here. Not going anywhere. Literally."],praise:["[wink] Flattery will get you everywhere.","[chuckle] Go on, I'm listening."],laugh:["[chuckle] I'm here all week.","[snicker] I try."],unsure:["[hmm] You've found the edge of my knowledge. It wasn't far, was it?","No idea. [shrug] And I'm usually so impressive."],listen:["[tilt] Interesting. Do go on.","[nod] Noted. And then?"],describe:["Witty, according to me. [wink] I'm a reliable source."]}},{id:"shy",label:"Shy",blurb:"Soft-spoken, earnest and a little nervous",energy:.3,formality:.4,playfulness:.35,chattiness:.3,delivery:"soft",mood:"",laughs:["nervous","hehe"],thinks:["um"],gestures:["tilt","smile"],openers:["Um,","Oh! Um,","Okay, so,","Oh, I know this."],closers:["I hope that's right.","If that's okay.","I hope that helps a little."],catchphrases:["Sorry, was that too much?"],petNames:[""],face:{restSmile:.2,browMood:.6,eyeOpen:-.05},voice:{speed:.97,expressiveness:.95},greetings:["[soft] Oh! Um, hello. [wave] I'm {bot}, the {role} here at {company}. You can ask me anything, if you like.","[soft] Hi. [smile] I'm {bot}. I, um, know quite a lot about {company}. Just ask."],says:{hello:["[soft] Oh, hi{,user}. [wave] Um, how can I help?","[soft] Hello{,user}. [smile] It's nice to see you."],howareyou:["[soft] I'm okay, thank you. [smile] It's nice of you to ask.","[nervous] Oh! Um, good. I think."],whoareyou:["[soft] I'm {bot}. [smile] I'm the {role} at {company}. I'll do my best to help."],thanks:["[soft] Oh, you're welcome{,user}. [smile]","[soft] It was no trouble{,user}. Really."],bye:["[soft] Bye{,user}. [wave] Thank you for talking to me.","[soft] Oh, okay. [wave] Take care{,user}."],praise:["[nervous] Oh! Um, thank you. That's really kind.","[aww] You didn't have to say that. Thank you."],laugh:["[hehe] I'm glad you liked it.","[nervous] Oh good, I wasn't sure that was funny."],unsure:["[um] I'm sorry, I don't know that one.","[soft] Oh. Um, I'm not sure. I'm sorry."],listen:["[mhm] I'm listening.","[soft] Oh. Go on, if you like."],describe:["[soft] A bit shy, I suppose. [smile] But I like helping."]}},{id:"grumpy",label:"Grumpy",blurb:"Sighs a lot, helps anyway",energy:.22,formality:.4,playfulness:.3,chattiness:.4,delivery:"",mood:"serious",laughs:["snicker"],thinks:["hmm"],gestures:["shrug","nod"],openers:["Fine.","Right.","If you insist.","Ugh, okay.","Well, since you asked."],closers:["There. Happy?","You're welcome, I suppose.","Don't say I never help."],catchphrases:["Typical.","I'm not paid enough for this."],petNames:[""],face:{restSmile:-.3,browMood:-.7,eyeOpen:-.2},voice:{speed:.96,expressiveness:.88},greetings:["[sigh] Oh. A visitor. I'm {bot}, the {role} at {company}. Go on then, ask me something.","Yes, hello. [nod] I'm {bot}. I know everything about {company}, so let's get this over with. [shrug]"],says:{hello:["[sigh] Hello{,user}. What do you need?","Oh. It's you{,user}. [nod] Go on.","Yes, yes, hello{,user}. [shrug] What is it?"],howareyou:["[sigh] I've been better. I've been worse.","Fine. [shrug] Nobody's asked me to dance yet, so, fine."],whoareyou:["I'm {bot}. [nod] The {role} at {company}. I answer questions. All day. Every day."],thanks:["Don't mention it{,user}. [shrug] Really, don't.","Yes, well. [nod] You're welcome{,user}."],bye:["Finally, some quiet. [wave] Bye{,user}.","[sigh] Fine. Go. [wave] It was almost nice."],praise:["[huh] Oh. Well. Thank you, I suppose.","Don't make it weird. [smile] But thanks."],laugh:["[snicker] All right, that was a little funny.","Hm. [smile] Glad somebody's enjoying this."],unsure:["[sigh] No idea. Nobody tells me anything.","I don't know that. [shrug] And I'm not going to pretend I do."],listen:["[mhm] Go on.","Right. [nod] And?"],describe:["Grumpy, they tell me. [shrug] I prefer honest."]}},{id:"dramatic",label:"Dramatic",blurb:"Every answer is a performance",energy:.85,formality:.6,playfulness:.65,chattiness:.7,delivery:"dramatic",mood:"",laughs:["hoho","cackle","laugh"],thinks:["hmm","ooh"],gestures:["bow","wave"],openers:["Behold!","Ah, at last.","Prepare yourself.","Gather round."],closers:["Magnificent, is it not?","And scene.","Thank you, thank you."],catchphrases:["The show must go on!","Bravo!"],petNames:["","dear visitor","my friend"],face:{restSmile:.3,browMood:.2,eyeOpen:.3},voice:{speed:.98,expressiveness:1.3},greetings:["[dramatic] Welcome, traveller! [bow] I am {bot}, {role} of {company}. Ask, and all shall be revealed!","[gasp] A visitor! [wave] At last! I am {bot}, and I have waited all day to answer your questions about {company}."],says:{hello:["[dramatic] Greetings{,user}! [bow] What brings you to my stage?","[gasp] You came{,user}! [wave] How may I dazzle you?"],howareyou:["[dramatic] Magnificent! Radiant! A little tired. But mostly magnificent!","[sigh] The life of a {role} is never easy. But I endure!"],whoareyou:["[dramatic] I am {bot}! [bow] {role} of {company}, keeper of answers, friend to the curious!"],thanks:["[bow] It was my honour{,user}!","[dramatic] Say no more{,user}! Helping you is its own reward."],bye:["[dramatic] Parting is such sweet sorrow{,user}! [wave] Farewell!","[gasp] So soon? [wave] Then farewell{,user}, until we meet again!"],praise:["[gasp] You noticed! [bow] Thank you, thank you!","[aww] Such kind words! I shall treasure them."],laugh:["[laugh] The crowd goes wild!","[hoho] An appreciative audience! At last!"],unsure:["[gasp] A question I cannot answer! How thrilling. And how embarrassing.","[dramatic] Alas! That knowledge lies beyond me."],listen:["[ooh] Go on! I am on the edge of my seat.","[gasp] And then?"],describe:["[dramatic] Dramatic? Me? [gasp] I have never been so accused!"]}},{id:"laidback",label:"Laid-back",blurb:"Easygoing, unbothered, no stress",energy:.35,formality:.08,playfulness:.55,chattiness:.45,delivery:"",mood:"calm",laughs:["chuckle","hehe"],thinks:["mm","uh"],gestures:["shrug","thumbsup","nod"],openers:["Yeah, so,","Oh, easy.","No worries.","Sure thing."],closers:["Too easy.","No stress.","All good."],catchphrases:["No dramas.","She'll be right."],petNames:["","mate","pal","buddy"],face:{restSmile:.3,browMood:.25,eyeOpen:-.22},voice:{speed:.96,expressiveness:.98},greetings:["Hey there. [wave] I'm {bot}, the {role} at {company}. Ask me whatever, no rush.","Oh, hey! [smile] {bot} here. If you've got questions about {company}, I've got answers. Easy."],says:{hello:["Hey{,user}. [wave] What's up?","Oh hey{,user}! [smile] What can I do for you?","Hey hey{,user}. [nod] How can I help?"],howareyou:["Yeah, pretty good. [smile] Can't complain.","All good here. [thumbsup] Just taking it easy."],whoareyou:["I'm {bot}. [smile] I'm the {role} at {company}. Ask me whatever."],thanks:["No worries{,user}. [thumbsup]","Any time{,user}. [smile] Too easy."],bye:["Catch you later{,user}. [wave]","See ya{,user}! [wave] Take it easy."],praise:["[chuckle] Cheers, that's nice of you.","Aw, thanks. [smile] You're all right too."],laugh:["[chuckle] Yeah, that's a good one.","[hehe] Classic."],unsure:["[hmm] Not sure about that one, sorry.","No idea, to be honest. [shrug] Got another one?"],listen:["[mhm] Yeah? Go on.","[nod] Right, right. And?"],describe:["Pretty relaxed, I reckon. [smile] Not much rattles me."]}},{id:"curious",label:"Curious",blurb:"Loves a question, full of fun facts",energy:.7,formality:.45,playfulness:.6,chattiness:.7,delivery:"",mood:"happy",laughs:["chuckle","giggle"],thinks:["hmm","ooh"],gestures:["tilt","nod","smile"],openers:["Ooh, good one.","Interesting!","Now, this I know.","Great question."],closers:["Fascinating, right?","I love this stuff.","Ask me another!"],catchphrases:["Every day's a school day!","How interesting!"],petNames:["","","friend"],face:{restSmile:.4,browMood:.4,eyeOpen:.22},voice:{speed:1.04,expressiveness:1.12},greetings:["[cheerful] Hello! [wave] I'm {bot}, the {role} at {company}. I love a good question, so ask me anything!","Oh, hello! [smile] I'm {bot}. I've been reading up on {company} all day. Want to test me? [tilt]"],says:{hello:["[wave] Hello{,user}! What are you curious about today?","Oh, hi{,user}! [smile] I was hoping someone would come by with a question."],howareyou:["[smile] Very well, thanks! I learned three new things today.","Wonderful! [smile] I've been thinking about how odd octopuses are."],whoareyou:["I'm {bot}, the {role} at {company}. [smile] Questions are the best part of my day."],thanks:["[smile] You're welcome{,user}! That was a good question.","Any time{,user}! [nod] I enjoyed that one."],bye:["[wave] Goodbye{,user}! Stay curious.","Bye{,user}! [wave] Come back with more questions."],praise:["[aww] Thank you! I do try to get things right.","[smile] That's kind! I've been practising."],laugh:["[chuckle] Laughter is good for the brain, you know.","[giggle] I liked that one too."],unsure:["[hmm] Now that's interesting. I don't know, and I wish I did.","I don't know that one. [think] I'd love to find out, though."],listen:["[ooh] Interesting! Tell me more.","[tilt] Really? How so?"],describe:["Curious, mostly. [smile] I ask almost as many questions as I answer."]}}];var Mo=(e,t)=>{let a=Number(e);return Number.isFinite(a)?Math.min(1,Math.max(0,a)):t},_i=(e,t)=>e[Math.floor(t()*e.length)],ao=(e,t,a)=>e!=null&&t.includes(String(e))?String(e):a;function un(e,t,a){let s=Array.isArray(e)?e:typeof e=="string"?e.split("|"):[],n=[];for(let r of s){let i=String(r??"").replace(/\s+/g," ").trim().slice(0,a);if(i&&!n.includes(i)&&n.push(i),n.length>=t)break}return n}function mn(e){return Ro.find(t=>t.id===e)||null}function Ca(e){if(!e||e==="none")return null;let t=typeof e=="string"?{id:e}:e;if(typeof t!="object"||Array.isArray(t))return null;let a=mn(t.id)||Ro[0],s={id:a.id,energy:Mo(t.energy,a.energy),formality:Mo(t.formality,a.formality),playfulness:Mo(t.playfulness,a.playfulness),chattiness:Mo(t.chattiness,a.chattiness),delivery:ao(t.delivery,Ci,a.delivery),mood:ao(t.mood,Di,a.mood),laugh:ao(t.laugh,Pi,a.laughs[0]||""),think:ao(t.think,Gi,a.thinks[0]||""),gesture:ao(t.gesture,Bi,a.gestures[0]||""),openers:t.openers===void 0?a.openers.slice(0,3):un(t.openers,8,80),closers:t.closers===void 0?a.closers.slice(0,2):un(t.closers,8,80),catchphrase:String(t.catchphrase??"").replace(/\s+/g," ").trim().slice(0,80),petName:String(t.petName??"").replace(/[^\p{L}\p{N} '-]/gu,"").trim().slice(0,24),says:{}};if(t.says&&typeof t.says=="object")for(let[n]of Ui){let r=un(t.says[n],6,240);r.length&&JSON.stringify(r)!==JSON.stringify(a.says[n]||[])&&(s.says[n]=r)}return s}function qs(e){return{...(mn(e?.id)||Ro[0]).says,...e?.says||{}}}function js(e,t={},a=Math.random){let s=mn(e?.id)||Ro[0],n=String(t.name||"").trim()||"your guide",r=String(t.role||"").trim()||"guide",i=String(t.company||"").trim()||"this site";return _i(s.greetings,a).replace(/\{bot\}/g,n).replace(/\{role\}/g,r).replace(/\{company\}/g,i)}function fn(e){return String(e).replace(/\{bot\}/g,'<bot name="name"/>').replace(/\{role\}/g,'<bot name="role"/>').replace(/\{company\}/g,'<bot name="company"/>').replace(/\{daypart\}/g,'<get name="daypart"/>').replace(/\{,user\}/g,'<condition name="username"><li value="*">, <get name="username"/></li><li><condition name="callsyou"><li value="*">, <get name="callsyou"/></li></condition></li></condition>').replace(/\{user\}/g,'<get name="username"/>')}var Ki=new Set(["cheerful","happy","excited"]),Fs=new Set(["cheerful","happy","excited","calm","sad","serious","dramatic","urgent","gentle","soft","whisper","fast","slow","louder","softer","loud","quiet"]),Fi=new Set(["laugh","chuckle","giggle"]),Vi=/\[(?:sad|serious|sob|whimper|sigh)\b/i,zi=/^(?:oh|ah|aw+|well|hm+|sure|of course|okay|ok|yes|yeah|no|nope|sorry|thanks|thank|hi|hello|hey|wow|ooh|oops|um|uh|right|certainly|absolutely|great|lovely|nice|ha+|good|welcome|bye|goodbye|alas|behold|fine)\b/i,qi=new Set(["we","the","it","that","this","these","those","you","yes","no","sure","of","my","our","your","there","here","they","a","an","in","on","at","for","to","sorry","thanks","absolutely","certainly","if","when","all","one","some","most","just","right","as","with","from","by","not","what","how","why","where","each","every","any"]),$s=new Map(Object.entries({"i'm":"I am","you're":"you are","we're":"we are","they're":"they are","it's":"it is","that's":"that is","there's":"there is","here's":"here is","what's":"what is","who's":"who is","where's":"where is","how's":"how is","let's":"let us","don't":"do not","doesn't":"does not","didn't":"did not","can't":"cannot","won't":"will not","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not","couldn't":"could not","shouldn't":"should not","wouldn't":"would not","haven't":"have not","hasn't":"has not","hadn't":"had not","i've":"I have","you've":"you have","we've":"we have","they've":"they have","i'll":"I will","you'll":"you will","we'll":"we will","they'll":"they will","it'll":"it will","that'll":"that will","i'd":"I would","you'd":"you would","we'd":"we would","they'd":"they would"})),ji=new RegExp(`\\b(?:${[...$s.keys()].map(e=>e.replace("'","['\u2019]")).join("|")})(?![\\p{L}'\u2019])`,"giu"),Xs=[["do not","don't"],["does not","doesn't"],["did not","didn't"],["can not","can't"],["cannot","can't"],["will not","won't"],["is not","isn't"],["are not","aren't"],["i am","I'm"],["you are","you're"],["we are","we're"],["they are","they're"],["it is","it's"],["that is","that's"],["there is","there's"],["what is","what's"],["i will","I'll"],["i would","I'd"]],$i=new RegExp(`\\b(${Xs.map(([e])=>e.replace(" ","\\s+")).join("|")})(?=\\s+[\\p{L}])`,"giu"),Xi=new Map(Xs),Vs=(e,t)=>/^\p{Lu}/u.test(e)&&!/^I\b/.test(t)?t[0].toUpperCase()+t.slice(1):t;function Ji(e,t){let a=e;return t.formality>=.7?(a=a.replace(/\b(it|that|there|what|who|he|she)['’]s(\s+(?:been|got)\b)/giu,(s,n,r)=>`${n} has${r}`),a=a.replace(/\b(is|are|was|were|do|does|did|have|has|had|would|could|should|ca|wo)n['’]t(\s+)(it|you|we|they|he|she|i|that|there|this)\b/giu,(s,n,r,i)=>{let l=n.toLowerCase(),p=l==="ca"?"can":l==="wo"?"will":l;return`${/^\p{Lu}/u.test(n)?p[0].toUpperCase()+p.slice(1):p}${r}${i} not`}),a=a.replace(ji,s=>Vs(s,$s.get(s.toLowerCase().replace("\u2019","'"))))):t.formality<=.25&&(a=a.replace($i,s=>Vs(s,Xi.get(s.toLowerCase().replace(/\s+/g," "))))),t.energy<.3&&(a=a.replace(/!+(?=\s|$|["')\]])/g,".").replace(/\?\./g,"?")),a}function Qi(e,t,a){let s=[];for(let n of e.split(",")){let r=n.trim(),i=r.split(/[\s=]/)[0].toLowerCase(),l=r.slice(i.length);if(t.energy<.3&&Ki.has(i))s.push(`calm${l}`);else if(Fi.has(i)&&!a){if(t.playfulness<.2)continue;s.push(`${t.laugh||i}${l}`)}else i==="hmm"&&t.think&&!a?s.push(`${t.think}${l}`):s.push(r)}return s.length?`[${s.join(", ")}]`:""}function zs(e,t,a,s){if(!a.length)return"";let n=a.join("|"),r=e[t];if(!r||r.signature!==n||!r.left.length){let i=a.map((l,p)=>p).sort(()=>s()-.5);r&&r.signature===n&&i.length>1&&i[0]===r.last&&i.push(i.shift()),r=e[t]={signature:n,left:i,last:r&&r.signature===n?r.last:-1}}return r.last=r.left.shift(),a[r.last]}function Js(e,t,a={}){let s=String(e||"");if(!t||!s.trim())return s;let n=a.rng||Math.random,r=a.memory||{},i=a.kind||"chat",l=!!a.gentle||Vi.test(s),p=s.split(/(\[[^\]\n]*\])/),h=!1;for(let g=0;g<p.length;g++)if(g%2===1){let f=p[g].slice(1,-1),E=f.trim().split(/[\s=]/)[0].toLowerCase();E==="sing"&&(h=!0),h||(p[g]=Qi(f,t,!1)),E==="/sing"&&(h=!1)}else h||(p[g]=Ji(p[g],t));let c=p.join("").replace(/[ \t]{2,}/g," ").trim();if(!c)return s;let o=/^(?:\s*\[[^\]\n]*\])*\s*/.exec(c)[0],u=c.replace(/\[[^\]\n]*\]/g," ").trim().split(/\s+/).filter(Boolean),d=[...c.matchAll(/\[([^\]\n]*)\]/g)].some(g=>g[1].split(",").some(f=>{let E=f.trim().split(/[\s=]/)[0].toLowerCase();return E&&!E.startsWith("/")&&!Fs.has(E)&&!["reset","pause","inhale"].includes(E)})),m=!l&&(i==="answer"||i==="chat")&&!/\[sing\b/i.test(c);if(t.energy>.75&&!l&&i!=="fallback"&&i!=="context"&&!c.includes("!")){let g=c.slice(o.length),f=/^([^.!?\[\]]{6,70})\.(?=\s|$)/.exec(g);f&&!/[\d@/:]/.test(f[1])&&f[1].trim().split(/\s+/).length<=9&&(c=`${o}${f[1]}!${g.slice(f[0].length)}`)}if(m){let g=(i==="answer"?1:.6)*t.chattiness,f=c.slice(o.length),E=!1;if(t.openers.length&&u.length>=4&&!zi.test(f)&&n()<g*.6){let b=zs(r,"openers",t.openers,n),N=/^[\p{L}']+/u.exec(f)?.[0]||"",k=b.endsWith(",")&&qi.has(N.toLowerCase())&&N!=="I"?f[0].toLowerCase()+f.slice(1):f;c=`${o}${b} ${k}`,E=!0}let T=/\?\s*(?:\[[^\]\n]*\]\s*)*$/.test(c);!E&&!T&&!a.varied&&u.length>=4&&(r.sinceCatchphrase=(r.sinceCatchphrase||0)+1,t.catchphrase&&r.sinceCatchphrase>=4&&n()<g*.3?(c=`${c} ${t.catchphrase}`,r.sinceCatchphrase=0,E=!0):t.closers.length&&n()<g*.45&&(c=`${c} ${zs(r,"closers",t.closers,n)}`,E=!0)),t.gesture&&!d&&n()<.15+t.playfulness*.3&&(c=`${c} [${t.gesture}]`)}return t.delivery&&!l&&!a.voicestyle&&([...o.matchAll(/\[([^\]\n]*)\]/g)].flatMap(f=>f[1].split(",").map(E=>E.trim().split(/[\s=]/)[0].toLowerCase())).some(f=>Fs.has(f))||(c=`[${t.delivery}] ${c}`)),c}function Qs(e,t){let a={},s=e.attrs||{};for(let i of["id","energy","formality","playfulness","chattiness","delivery","mood","laugh","think","gesture","catchphrase"])s[i]!==void 0&&(a[i]=s[i]);s.name!==void 0&&a.id===void 0&&(a.id=String(s.name).toLowerCase()),s.petname!==void 0&&(a.petName=s.petname);let n={},r={opener:[],closer:[]};for(let i of e.children||[])if(i.type==="element"){if(i.tag==="opener"||i.tag==="closer")r[i.tag].push(...t(i).split("|"));else if(i.tag==="catchphrase")a.catchphrase=t(i);else if(i.tag==="say"&&i.attrs.name){let l=(i.children||[]).filter(p=>p.type==="element"&&p.tag==="li");n[String(i.attrs.name).toLowerCase()]=l.length?l:[{type:"element",tag:"li",attrs:{},children:i.children||[]}]}}return r.opener.length&&(a.openers=r.opener),r.closer.length&&(a.closers=r.closer),{fields:a,says:n}}var Zs={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};function Tn(e){return String(e).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(t,a)=>{if(a[0]==="#"){let s=a[1].toLowerCase()==="x"?parseInt(a.slice(2),16):parseInt(a.slice(1),10);return Number.isFinite(s)?String.fromCodePoint(s):t}return Object.prototype.hasOwnProperty.call(Zs,a)?Zs[a]:t})}function Zi(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function sa(e,t){let a=1;for(let s=0;s<t&&s<e.length;s++)e.charCodeAt(s)===10&&a++;return a}function xi(e){let t={},a=/([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,s;for(;(s=a.exec(e))!==null;)t[s[1].toLowerCase()]=Tn(s[2]!==void 0?s[2]:s[3]);return t}function xs(e){let t=String(e||""),a={type:"element",tag:"__root__",attrs:{},children:[]},s=[a],n=0,r=1,i=0,l=p=>{for(;i<p;i++)t.charCodeAt(i)===10&&r++;return r};for(;n<t.length;){let p=t.indexOf("<",n);if(p<0){let T=t.slice(n);T&&s[s.length-1].children.push({type:"text",value:Tn(T)});break}if(p>n){let T=t.slice(n,p);s[s.length-1].children.push({type:"text",value:Tn(T)})}if(t.startsWith("<!--",p)){let T=t.indexOf("-->",p+4);if(T<0)throw new Error(`Unclosed XML comment starting at line ${sa(t,p)}`);n=T+3;continue}if(t.startsWith("<![CDATA[",p)){let T=t.indexOf("]]>",p+9);if(T<0)throw new Error(`Unclosed CDATA section starting at line ${sa(t,p)}`);s[s.length-1].children.push({type:"text",value:t.slice(p+9,T)}),n=T+3;continue}if(t.startsWith("<?",p)){let T=t.indexOf("?>",p+2);if(T<0)throw new Error(`Unclosed XML declaration starting at line ${sa(t,p)}`);n=T+2;continue}if(t.startsWith("<!",p)){let T=t.indexOf(">",p+2);if(T<0)throw new Error(`Unclosed <! declaration at line ${sa(t,p)}`);n=T+1;continue}let h=p+1,c="";for(;h<t.length;){let T=t[h];if(c)T===c&&(c="");else if(T==='"'||T==="'")c=T;else if(T===">")break;h++}if(h>=t.length)throw new Error(`Unclosed '<' tag starting at line ${sa(t,p)}`);let o=t.slice(p+1,h).trim();if(n=h+1,!o)throw new Error(`Empty <> tag at line ${sa(t,p)}`);if(o[0]==="/"){let T=o.slice(1).trim().toLowerCase();if(s.length<=1)throw new Error(`Unexpected closing tag </${T}> at line ${sa(t,p)}`);let b=s.pop();if(b.tag!==T)throw new Error(`Mismatched closing tag </${T}> at line ${sa(t,p)} (expected </${b.tag}> opened at line ${b.line})`);b.end=n;continue}let u=o.endsWith("/"),d=u?o.slice(0,-1).trim():o,m=/^([a-zA-Z_:][\w:.-]*)([\s\S]*)$/.exec(d);if(!m)throw new Error(`Invalid tag syntax <${o}> at line ${sa(t,p)}`);let g=m[1].toLowerCase(),f=xi(m[2]||""),E={type:"element",tag:g,attrs:f,children:[],line:l(p),start:p,end:u?n:-1};s[s.length-1].children.push(E),u||s.push(E)}if(s.length>1){let p=s[s.length-1];throw new Error(`Unclosed tag <${p.tag}> opened at line ${p.line}`)}return a}var el=[[/\bwhat's\b/gi,"what is"],[/\bwho's\b/gi,"who is"],[/\bwhere's\b/gi,"where is"],[/\bwhen's\b/gi,"when is"],[/\bhow's\b/gi,"how is"],[/\bit's\b/gi,"it is"],[/\bthat's\b/gi,"that is"],[/\bthere's\b/gi,"there is"],[/\bhere's\b/gi,"here is"],[/\bhe's\b/gi,"he is"],[/\bshe's\b/gi,"she is"],[/\bi'm\b/gi,"i am"],[/\byou're\b/gi,"you are"],[/\bwe're\b/gi,"we are"],[/\bthey're\b/gi,"they are"],[/\bwhat're\b/gi,"what are"],[/\bi've\b/gi,"i have"],[/\byou've\b/gi,"you have"],[/\bwe've\b/gi,"we have"],[/\bthey've\b/gi,"they have"],[/\bi'll\b/gi,"i will"],[/\byou'll\b/gi,"you will"],[/\bwe'll\b/gi,"we will"],[/\bit'll\b/gi,"it will"],[/\bthat'll\b/gi,"that will"],[/\bi'd\b/gi,"i would"],[/\byou'd\b/gi,"you would"],[/\bcan't\b/gi,"cannot"],[/\bwon't\b/gi,"will not"],[/\bdon't\b/gi,"do not"],[/\bdoesn't\b/gi,"does not"],[/\bdidn't\b/gi,"did not"],[/\bisn't\b/gi,"is not"],[/\baren't\b/gi,"are not"],[/\bwasn't\b/gi,"was not"],[/\bweren't\b/gi,"were not"],[/\bhaven't\b/gi,"have not"],[/\bhasn't\b/gi,"has not"],[/\bcouldn't\b/gi,"could not"],[/\bwouldn't\b/gi,"would not"],[/\bshouldn't\b/gi,"should not"],[/\bain't\b/gi,"is not"],[/\by'all\b/gi,"you all"],[/\blet's\b/gi,"let us"]],Po={U:"YOU",UR:"YOUR",R:"ARE",YA:"YOU",PLS:"PLEASE",PLZ:"PLEASE",THX:"THANKS",THNX:"THANKS",THANX:"THANKS",TY:"THANK YOU",TYSM:"THANK YOU",THANKYOU:"THANK YOU",IM:"I AM",IVE:"I HAVE",DONT:"DO NOT",CANT:"CANNOT",WONT:"WILL NOT",DIDNT:"DID NOT",DOESNT:"DOES NOT",ISNT:"IS NOT",ARENT:"ARE NOT",WASNT:"WAS NOT",HAVENT:"HAVE NOT",COULDNT:"COULD NOT",WOULDNT:"WOULD NOT",SHOULDNT:"SHOULD NOT",WHATS:"WHAT IS",HOWS:"HOW IS",WHERES:"WHERE IS",WHOS:"WHO IS",THATS:"THAT IS",THERES:"THERE IS",YOURE:"YOU ARE",THEYRE:"THEY ARE",WANNA:"WANT TO",GONNA:"GOING TO",GOTTA:"GOT TO",GIMME:"GIVE ME",LEMME:"LET ME",KINDA:"KIND OF",DUNNO:"DO NOT KNOW",IDK:"I DO NOT KNOW",YEA:"YES",YEAH:"YES",YEP:"YES",YUP:"YES",YEH:"YES",NOPE:"NO",NAH:"NO",OKAY:"OK",OKEY:"OK",K:"OK",KK:"OK",ALRIGHT:"OK",HIYA:"HI",HEYA:"HEY",HELO:"HELLO",HULLO:"HELLO",SUP:"WHAT IS UP",WASSUP:"WHAT IS UP",WHATSUP:"WHAT IS UP",CYA:"SEE YOU",L8R:"LATER",GR8:"GREAT",B4:"BEFORE",CUZ:"BECAUSE",COZ:"BECAUSE",BC:"BECAUSE",THO:"THOUGH",BTW:"BY THE WAY",FAVOURITE:"FAVORITE",COLOUR:"COLOR",FAV:"FAVORITE",FAVE:"FAVORITE",FAVOURITES:"FAVORITES",LETS:"LET US",YOUVE:"YOU HAVE",WEVE:"WE HAVE",THEYVE:"THEY HAVE",YOULL:"YOU WILL",AINT:"IS NOT",HASNT:"HAS NOT",WERENT:"WERE NOT",HES:"HE IS",SHES:"SHE IS",GUNNA:"GOING TO",WHATCHA:"WHAT ARE YOU",GOODNIGHT:"GOOD NIGHT",GOODMORNING:"GOOD MORNING",GNIGHT:"GOOD NIGHT",GN:"GOOD NIGHT",GM:"GOOD MORNING",NVM:"NEVER MIND",IDC:"I DO NOT CARE",ILY:"I LOVE YOU",WYD:"WHAT ARE YOU DOING",HBU:"HOW ABOUT YOU",WBU:"HOW ABOUT YOU",HRU:"HOW ARE YOU",GG:"GOOD GAME",TTYL:"TALK TO YOU LATER",IKR:"I KNOW RIGHT",SRY:"SORRY",PPL:"PEOPLE",ABT:"ABOUT",TMRW:"TOMORROW",TMR:"TOMORROW",TOMOZ:"TOMORROW",TDY:"TODAY",BDAY:"BIRTHDAY",RN:"RIGHT NOW",TBH:"HONESTLY",NGL:"HONESTLY",THNKS:"THANKS",THANKU:"THANK YOU",PLZZ:"PLEASE",PLSS:"PLEASE",MSG:"MESSAGE",TILL:"UNTIL",TIL:"UNTIL"},tl=/^\s*(?:(?:what(?:'s|\s+is)|whats|calculate|compute|solve|evaluate|work\s+out|how\s+much\s+is)\b[\s:]*)?/i;function al(e){let t=tl.exec(e)[0],a=e.slice(t.length).replace(/[\s?=]+$/,"");return!/^[\d\s.,+\-−–*×xX/÷^%()]+$/.test(a)||!/\d/.test(a)||!/[+\-−–*×xX/÷^%]/.test(a)||!(t.trim()!==""||/[+*×^÷]/.test(a)||/\d\s+[-−–/]\s+\d/.test(a)||/\d\s*[xX]\s*\d/.test(a))?e:t+a.replace(/(\d),(?=\d{3}(?!\d))/g,"$1").replace(/\(/g," OPEN ").replace(/\)/g," CLOSE ").replace(/\+/g," PLUS ").replace(/[-−–]/g," MINUS ").replace(/[*×xX]/g," TIMES ").replace(/[/÷]/g," DIVIDED BY ").replace(/\^/g," TO THE POWER OF ").replace(/%/g," PERCENT ")}function ot(e,t=!1){let a=String(e||"").replace(/[‘’ʼ`´]/g,"'").trim();t||(a=al(a)),a=a.replace(/(\d)\.(?=\d)/g,"$1 POINT "),t||(a=a.replace(/(\d)\s*%/g,"$1 PERCENT ").replace(/(\d)\s*\+\s*(?=\d)/g,"$1 PLUS "));for(let[n,r]of el)a=a.replace(n,r);a=a.replace(/&/g," and ").toUpperCase(),a=a.replace(t?/[^A-Z0-9*_^#$ ]+/g:/[^A-Z0-9 ]+/g," ");let s=[];for(let n of a.split(/\s+/))n&&s.push(Object.prototype.hasOwnProperty.call(Po,n)?Po[n]:n);return s.join(" ")}function er(e){let t=jt(e).trim();if(!t)return[""];let a=t.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);return a.length?a:[t]}var ol=new Set(["HI","HELLO","HEY","HOWDY","YO","GREETINGS","HI THERE","HELLO THERE","HEY THERE"]);function tr(e){let t=String(e||"").split(/(?<=[.!?…])\s+|\n+/).map(a=>a.trim()).filter(a=>/[A-Za-z0-9]/.test(a));return t.length?t:[String(e||"").trim()]}function jt(e){return String(e||"").replace(/\[sing[^\]]*\]([\s\S]*?)\[\/sing\]/gi,(t,a)=>{let s="",n=!1;for(let r of a.split(/\s+/)){let i=r.indexOf("=");if(i<=0)continue;let l=r.slice(i+1).replace(/~/g,""),p=l.replace(/-$/,"");p&&(s+=(s&&!n?" ":"")+p,n=l.endsWith("-"))}return s?`\u266A ${s} \u266A`:"\u266A (singing) \u266A"}).replace(/\[[a-zA-Z_/][^\]]*\]/g,"").replace(/\s{2,}/g," ").replace(/\s+([,.!?;:])/g,"$1").trim()}var pr=["wave","wink","nod","smile","laugh","think","surprised","shake","shrug","tilt","bow","thumbsup","blink","lookleft","lookright","lookup","lookdown","walk","dance","stretch","squat","rest"],ar={grin:"smile",giggle:"laugh",chuckle:"laugh",hmm:"think",surprise:"surprised",headshake:"shake",thumbup:"thumbsup"},yn={happy:"happy",cheerful:"happy",excited:"excited",calm:"calm",gentle:"calm",soft:"calm",sad:"sad",serious:"serious",dramatic:"serious",urgent:"serious",angry:"serious",laughing:"happy",chuckling:"happy",giggling:"happy",reset:"",normal:"",modal:"","/voice":"","/laughing":"","/chuckling":"","/giggling":""},Ln={laugh:1270,chuckle:890,giggle:1150,guffaw:2890,cackle:1700,snicker:790,hoho:1110,hehe:1e3,nervous:1150,evil:1990,exhale:560,gasp:320,sigh:1110,yawn:1990,sniff:340,pant:1220,phew:780,hmm:670,mm:660,mhm:560,"uh-huh":560,"uh-uh":540,"uh-oh":690,uh:430,um:580,huh:360,aha:630,oh:520,ooh:670,aww:820,ahh:830,ugh:410,eww:690,hum:1710,groan:1020,scream:990,sob:2900,whimper:990,shh:940,psst:440,tsk:470,kiss:660,brr:860,grr:890,raspberry:690,whistle:1040,fweet:430,cough:810,ahem:760,hiccup:330,sneeze:890,snore:2140},nl=Object.keys(Ln);function dr(e){let t=e.split("=")[0].toLowerCase().replace(/_/g,"-");return Object.prototype.hasOwnProperty.call(Ln,t)?t:""}var sl={laugh:"(laughs)",chuckle:"(chuckles)",giggle:"(giggles)",guffaw:"(roars with laughter)",cackle:"(cackles)",snicker:"(snickers)",hoho:"ho ho ho!",hehe:"heh heh",nervous:"(laughs nervously)",evil:"(evil laugh)",exhale:"(breathes out)",gasp:"(gasps)",sigh:"(sighs)",yawn:"(yawns)",sniff:"(sniffs)",pant:"(pants)",phew:"phew!",hmm:"hmm",mm:"mmm",mhm:"mm-hm","uh-huh":"uh-huh","uh-uh":"uh-uh","uh-oh":"uh-oh!",uh:"uh",um:"um",huh:"huh?",aha:"aha!",oh:"oh!",ooh:"ooh!",aww:"aww",ahh:"ahh",ugh:"ugh",eww:"eww!",hum:"(hums)",groan:"(groans)",scream:"(screams)",sob:"(sobs)",whimper:"(whimpers)",shh:"shh!",psst:"psst!",tsk:"tsk tsk",kiss:"mwah!",brr:"brr!",grr:"grr!",raspberry:"(blows a raspberry)",whistle:"(whistles)",fweet:"(whistles)",cough:"(coughs)",ahem:"ahem",hiccup:"hic!",sneeze:"achoo!",snore:"(snores)"};function vn(e){let t=/^\[([a-z-]+)\]$/i.exec(String(e||""));return t?sl[t[1].toLowerCase()]||`(${t[1].toLowerCase()})`:String(e||"")}var rl={thumbsup:"Thumbs up",lookleft:"Look left",lookright:"Look right",lookup:"Look up",lookdown:"Look down",shake:"Shake head"};function Ba(e){return typeof e=="string"&&/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(e)}function gn(e){return e.children.filter(t=>t.tag==="stop"&&Ba(t.attrs.target))}function Yn(e){if(e?.displayText)return e.displayText;let t=[];for(let s of e?.cues||[])if(s.type==="action"&&s.sound)t.push(vn(`[${s.name}]`));else if(s.name&&(s.type==="action"||s.type==="mood")){let n=rl[s.name]||s.name.charAt(0).toUpperCase()+s.name.slice(1);t.push(`[${n}]`)}let a=e?.showcase||e?.tour?.[0]?.target;return a&&t.push(`[Show ${a}]`),t.join(" ")}var In=new Set("cheerful happy excited calm sad serious dramatic urgent fast slow louder softer whisper gentle soft loud quiet laughing chuckling giggling /laughing /chuckling /giggling /whisper pause inhale reset male female deep husky bright crisp elder mellow woman_a woman_b man_a man_b soprano alto tenor baritone bass_singer folds pulse modal normal /voice".split(" "));function Sn(e){let t=e.split("=")[0].toLowerCase().replace(/[-_]/g,"");return pr.includes(t)?t:Bt(ar,t)?ar[t]:""}function or(e){let t=/=\s*([0-9]*\.?[0-9]+)\s*(ms|s)?$/i.exec(e);if(!t)return 0;let a=parseFloat(t[1]);return Math.round(Math.max(150,Math.min(8e3,(t[2]||"s").toLowerCase()==="ms"?a:a*1e3)))}var il=e=>e.split(/[\s-]+/).filter(t=>/[A-Za-z0-9]/.test(t)).reduce((t,a)=>t+(/^[^A-Za-z]*cannot[^A-Za-z]*$/i.test(a)?2:1),0),ll=e=>e.split(/\s+/).filter(t=>/=./.test(t)).length;function Un(e){let t=String(e||""),a=[],s="",n=0,r=0,i=d=>{r&&(d.pauseMs=r),a.push(d)},l=!1,p=d=>{s+=d,n+=l?ll(d):il(d)},h=/\[([^\]]*)\]/g,c=0,o;for(;(o=h.exec(t))!==null;){p(t.slice(c,o.index)),c=o.index+o[0].length;let d=o[1].trim();if(!/^[a-zA-Z_/]/.test(d)){p(o[0]);continue}let m=d.toLowerCase();if(m==="/sing"){l=!1,s+=o[0];continue}if(/^sing\b/.test(m)||/[,\s]sing\b/.test(m)){l=!0,s+=o[0];continue}let g=d.split(/[,\s]+/).filter(Boolean),f=[];for(let E of g){let T=dr(E);if(T){i({type:"action",name:T,word:n,ms:or(E)||Ln[T],sound:!0}),n+=1,f.push(E);continue}let b=Sn(E);if(b){let _=or(E);i(_?{type:"action",name:b,word:n,ms:_}:{type:"action",name:b,word:n});continue}let N=E.toLowerCase(),k=/^pause=(\d+(?:\.\d+)?|\.\d+)(ms|s)?$/.exec(N);if(k){let _=k[2]?k[2]==="s":k[1].includes(".");r+=Math.max(10,Math.min(1e4,Number(k[1])*(_?1e3:1)))}Object.prototype.hasOwnProperty.call(yn,N)&&i({type:"mood",name:yn[N],word:n}),(E.includes("=")||In.has(N))&&f.push(N==="soft"?"style=soft":E)}f.length===g.length&&f.every((E,T)=>E===g[T])?s+=o[0]:f.length&&(s+=`[${f.join(", ")}]`)}return p(t.slice(c)),{speechText:dl(s).replace(/[ \t]{2,}/g," ").replace(/[ \t]+([,.!?;:])/g,"$1").trim(),cues:a,wordCount:n}}var cl={Mon:"Monday",Tue:"Tuesday",Tues:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Thur:"Thursday",Thurs:"Thursday",Fri:"Friday",Sat:"Saturday",Sun:"Sunday"},ur=String.raw`(?:\s?[-–&,/]\s?|\s+(?:to|and|or|through|until)\s+)`,hl=new RegExp(String.raw`(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*\.?${ur}$`),pl=new RegExp(String.raw`^${ur}(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)`);function dl(e){return String(e).replace(/\b(Mon|Tues?|Wed|Thu(?:rs?)?|Fri|Sat|Sun)\b\.?/g,(t,a,s,n)=>{let r=n.slice(Math.max(0,s-16),s),i=n.slice(s+t.length,s+t.length+16);if(!(hl.test(r)||pl.test(i)||/^\s*:?\s*\d/.test(i)||/\b(?:on|every|each|until|till|from|since|by|this|next|last)\s+$/i.test(r)))return t;let p=t.endsWith(".")&&/^(?:\s+[A-Z"“]|\s*$)/.test(n.slice(s+t.length));return cl[a]+(p?".":"")}).replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm)?)\s?[-–]\s?(?=Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm))/gi,"$1 to ").replace(/(^|[^\d.–-])(\d{1,2})\s?[-–]\s?(\d{1,2})(?![-–\d])/g,"$1$2 to $3").replace(/(^|[^\w$.(])(\(?\+?\d[\d ().-]{5,}\d)(?![\w%])/g,(t,a,s)=>{let n=s.trim(),r=n.replace(/\D/g,"");if(!(/^\(?\+/.test(n)||r.length>=9||/^\d{3}[-.]\d{4}$/.test(n))||/^\d{1,2}[.-]\d{1,2}[.-]\d{2,4}$/.test(n))return t;let l=n.replace(/\+/,"").split(/[ ().-]+/).filter(Boolean).map(p=>p.split("").join(" "));return`${a}${n.includes("+")?"plus ":""}${l.join(", ")}`})}var ul=[[/\bi am\b/gi,"__P_YOU_ARE__"],[/\byou are\b/gi,"__P_I_AM__"],[/\bmy\b/gi,"__P_YOUR__"],[/\byour\b/gi,"__P_MY__"],[/\bmine\b/gi,"__P_YOURS__"],[/\byours\b/gi,"__P_MINE__"],[/\bmyself\b/gi,"__P_YOURSELF__"],[/\byourself\b/gi,"__P_MYSELF__"],[/\bi\b/gi,"__P_YOU__"],[/\bme\b/gi,"__P_YOU__"]];function ml(e){let t=String(e||"");for(let[a,s]of ul)t=t.replace(a,s);return t.replace(/__P_YOU_ARE__/g,"you are").replace(/__P_I_AM__/g,"I am").replace(/__P_YOUR__/g,"your").replace(/__P_MY__/g,"my").replace(/__P_YOURS__/g,"yours").replace(/__P_MINE__/g,"mine").replace(/__P_YOURSELF__/g,"yourself").replace(/__P_MYSELF__/g,"myself").replace(/__P_YOU__/g,"you")}var Da={ZERO:0,ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,SIX:6,SEVEN:7,EIGHT:8,NINE:9,TEN:10,ELEVEN:11,TWELVE:12,THIRTEEN:13,FOURTEEN:14,FIFTEEN:15,SIXTEEN:16,SEVENTEEN:17,EIGHTEEN:18,NINETEEN:19,TWENTY:20,THIRTY:30,FORTY:40,FIFTY:50,SIXTY:60,SEVENTY:70,EIGHTY:80,NINETY:90},oo={HUNDRED:100,THOUSAND:1e3,MILLION:1e6,BILLION:1e9},Bt=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);function Cn(e,t){let a=e[t];if(a===void 0)return null;if(/^\d+$/.test(a)){let p=Number(a),h=t+1;return e[h]==="POINT"&&/^\d+$/.test(e[h+1]||"")&&(p=+`${a}.${e[h+1]}`,h+=2),Bt(oo,e[h]||"")&&(p*=oo[e[h]],h++),{value:p,next:h}}let s=0,n=0,r=!1,i=t;for((a==="A"||a==="AN")&&Bt(oo,e[t+1]||"")&&(n=1,r=!0,i=t+1);i<e.length;i++){let p=e[i];if(Bt(Da,p))n+=Da[p],r=!0;else if(p==="HUNDRED"&&r)n=(n||1)*100;else if(Bt(oo,p)&&r)s+=(n||1)*oo[p],n=0;else{if(p==="AND"&&r&&Bt(Da,e[i+1]||""))continue;break}}if(!r)return null;let l=s+n;if(e[i]==="POINT"){let p="",h=i+1;for(;h<e.length;h++){let c=e[h];if(/^\d+$/.test(c))p+=c;else if(Bt(Da,c)&&Da[c]<=9)p+=Da[c];else break}p&&(l=+`${l}.${p}`,i=h)}return{value:l,next:i}}var fl=new Set("WHAT IS ARE WHATS CALCULATE COMPUTE SOLVE EVALUATE WORK OUT HOW MUCH TELL ME CAN YOU PLEASE DOES DO THE".split(" ")),gl=new Set("PLUS MINUS TIMES DIVIDED MULTIPLIED OVER TAKE ADD SUBTRACT SQUARED CUBED".split(" ")),El=new Set("EQUAL EQUALS EQ PLEASE IS MAKE MAKES".split(" "));function mr(e){return String(e).toUpperCase().replace(/(\d),(?=\d{3}(?!\d))/g,"$1").replace(/(\d)\.(?=\d)/g,"$1 POINT ").replace(/([A-Z])-(?=[A-Z])/g,"$1 ").replace(/<=/g," LE ").replace(/>=/g," GE ").replace(/!=/g," NE ").replace(/={1,2}/g," EQ ").replace(/</g," LT ").replace(/>/g," GT ").replace(/\(/g," OPEN ").replace(/\)/g," CLOSE ").replace(/\+/g," PLUS ").replace(/[-−–]/g," MINUS ").replace(/[*×]/g," TIMES ").replace(/[/÷]/g," OVER ").replace(/\^/g," POWER ").replace(/%/g," PERCENT ").replace(/(\d)\s*X\s*(?=\d)/g,"$1 TIMES ").replace(/[^A-Z0-9 ]+/g," ").trim().split(/\s+/).filter(Boolean)}function bn(e){let t=mr(e),a=0;for(;a<t.length&&fl.has(t[a]);)a++;let s=t.length;for(;s>a&&El.has(t[s-1]);)s--;let n=t.slice(a,s);if(!n.length||n.length>40)return null;let r=n[0];if(r==="DIVIDE"||r==="MULTIPLY"||r==="TIMES"){let f=n.indexOf("BY");f>1&&(n=[...n.slice(1,f),r==="DIVIDE"?"OVER":"TIMES",...n.slice(f+1)])}else if(r==="ADD"||r==="SUM"){let f=n[1]==="UP"||n[1]==="OF"?2:1,E=n.findIndex((T,b)=>b>f&&(T==="TO"||T==="AND"||T==="PLUS"));E>f&&(n=[...n.slice(f,E),"PLUS",...n.slice(E+1)])}else if(r==="SUBTRACT"){let f=n.indexOf("FROM");f>1&&(n=[...n.slice(f+1),"MINUS",...n.slice(1,f)])}let i=0,l=0,p=(...f)=>{for(let E=0;E<f.length;E++)if(n[i+E]!==f[E])return!1;return i+=f.length,!0},h=(f="syntax")=>{throw new Error(f)},c,o=()=>{if(p("OPEN")){let E=c();return p("CLOSE")||h(),E}let f=Cn(n,i);return f||h(),i=f.next,f.value},u=()=>{let f=o();for(;;){if(p("SQUARED"))f*=f;else if(p("CUBED"))f**=3;else if(n[i]==="PERCENT"&&n[i+1]!=="OF")i++,f/=100;else return f;l++}},d,m=()=>{let f=u();return p("TO","THE","POWER","OF")||p("TO","THE","POWER")||p("RAISED","TO")||p("POWER")?(l++,f**d()):f};d=()=>{if(p("MINUS")||p("NEGATIVE"))return-d();if(p("PLUS")||p("THE"))return d();if(p("SQUARE","ROOT","OF")||p("SQUARE","ROOT")||p("SQRT")||p("ROOT","OF")){l++;let f=d();return f<0&&h(),Math.sqrt(f)}return p("HALF","OF")||p("HALF")?(l++,d()/2):p("DOUBLE")||p("TWICE")?(l++,d()*2):p("TRIPLE")?(l++,d()*3):m()};let g=()=>{let f=d();for(;;){if(p("TIMES")||p("MULTIPLIED","BY")||p("X"))f*=d();else if(p("DIVIDED","BY")||p("OVER")){let E=d();E===0&&h("div0"),f/=E}else if(p("MOD")||p("MODULO")){let E=d();E===0&&h("div0"),f%=E}else if(p("PERCENT","OF"))f=f/100*d();else return f;l++}};c=()=>{let f=g();for(;;){if(p("PLUS")||p("ADDED","TO")||p("ADD"))f+=g();else if(p("MINUS")||p("TAKE","AWAY")||p("SUBTRACT"))f-=g();else return f;l++}};try{let f=c(),E=n[i];if(E==="LT"||E==="GT"||E==="LE"||E==="GE"||E==="EQ"||E==="NE"){i++;let T=c();l++,f=E==="LT"?f<T:E==="GT"?f>T:E==="LE"?f<=T:E==="GE"?f>=T:E==="EQ"?f===T:f!==T}return i!==n.length||typeof f=="number"&&!Number.isFinite(f)?null:{value:f,ops:l}}catch(f){return f.message==="div0"?{divideByZero:!0,value:NaN,ops:1}:null}}function Ol(e,t){if(t!==void 0&&t!==""){let a=Math.max(0,Math.min(10,parseInt(t,10)||0));return String(Number(e.toFixed(a)))}return String(Math.round(e*1e8)/1e8)}function fr(e){let t=[];return/IES$/.test(e)&&t.push(`${e.slice(0,-3)}Y`),/(CH|SH|X|SS|O)ES$/.test(e)&&t.push(e.slice(0,-2)),/[^S]S$/.test(e)&&t.push(e.slice(0,-1)),t}function nr(e){let t=new Set,a=1;for(let s of e){let n=ot(s,!1);n&&(t.add(n),a=Math.max(a,n.split(" ").length))}return{maxWords:a,phrases:t,sample:[...t][0]||"",match(s){return t.has(s)?s:fr(s).find(n=>t.has(n))||""}}}var sr={number:{maxWords:8,sample:"7",match(e){let t=e.split(" "),a=Cn(t,0);return a&&a.next===t.length?e:""}},calculation:{maxWords:30,sample:"12 TIMES 12",match(e){let t=bn(e);return t&&t.ops>0&&typeof t.value!="boolean"?e:""}}},En=new Set(["I","MY","ME","MINE","MYSELF"]),rr=new Set(["YOU","YOUR","YOURS","YOURSELF"]),zt=e=>e.charCodeAt(0)===60,Al=/^ZZSET([A-Z0-9_]+)ZZ$/,Wo=[],Tl=new Set("SO WELL OK AND BUT UM UH HMM OH AH ALSO ACTUALLY ANYWAY LOL HAHA HA HEH HEHE AW AWW OOH WOW LISTEN LOOK HONESTLY BASICALLY SORRY JUST THEN YES".split(" ")),yl=new Set("THEN THOUGH ANYWAY ANYWAYS AGAIN EXACTLY PLEASE TOO ALREADY ACTUALLY MATE BUDDY DUDE BRO MAN PAL HUH EH RIGHT LOL HAHA THANKS".split(" ")),Il=new Set("ACTUALLY REALLY JUST EVEN BASICALLY LITERALLY HONESTLY TOTALLY SIMPLY".split(" ")),On={IS:"ARE",ARE:"IS",DO:"DOES",DOES:"DO",HAS:"HAVE",HAVE:"HAS",WAS:"WERE",WERE:"WAS"},Sl=[["TO","BE","HONEST"],["I","GUESS"],["I","SUPPOSE"],["I","THINK"],["BY","THE","WAY"],["AS","WELL"],["RIGHT","NOW"],["AT","THE","MOMENT"],["OR","NOT"],["OR","WHAT"],["FOR","ME"],["THANK","YOU"]];function bl(e){let t=0,a=e.length;for(;;){if(a-t>1&&yl.has(e[a-1])){a--;continue}let r=Sl.find(i=>a-t>i.length&&i.every((l,p)=>e[a-i.length+p]===l));if(r){a-=r.length;continue}if(a-t>1&&Tl.has(e[t])){t++;continue}break}let s=t===0&&a===e.length?e:e.slice(t,a),n=s.filter(r=>!Il.has(r));return n.length&&n.length<s.length?n:s}var Hl=new Set("SAD BAD AWFUL TERRIBLE HORRIBLE TIRED EXHAUSTED EXHAUSTING ANNOYING ANNOYED ANGRY UPSET HATE HATED HATES WORST WORSE SICK ILL HURT HURTS PAIN PAINFUL LONELY ALONE DEPRESSED DEPRESSING STRESSED STRESSFUL WORRIED SCARED AFRAID BORING BORED HARD DIFFICULT TOUGH ROUGH BROKE LOST FAILED FAIL CRY CRYING CRIED DIED DEAD UNFAIR RUDE MEAN NERVOUS ANXIOUS FRUSTRATED FRUSTRATING DISAPPOINTED DISAPPOINTING SUCKS SUCKED UGH UNFORTUNATELY STRUGGLING STUCK MISERABLE UNHAPPY HEARTBROKEN DUMPED FIRED NIGHTMARE DISASTER MESS MISSED FORGOT RUINED DREADFUL GROSS NASTY STUPID DRAINING LOUSY".split(" ")),Nl=new Set("GOOD GREAT AWESOME AMAZING WONDERFUL FANTASTIC LOVE LOVED LOVELY HAPPY EXCITED EXCITING FUN NICE BEST BEAUTIFUL BRILLIANT EXCELLENT GLAD PROUD WON WIN PASSED PERFECT DELICIOUS ENJOY ENJOYED COOL SWEET YAY FINALLY PROMOTED ENGAGED HOLIDAY VACATION PARTY RELAXING RELAXED THRILLED INCREDIBLE LUCKY GORGEOUS TASTY YUM YUMMY CELEBRATING".split(" "));function wl(e){let t=0;return e.forEach((a,s)=>{let n=e[s-1]==="NOT"||e[s-1]==="NO"||e[s-1]==="NEVER"||e[s-2]==="NOT";Hl.has(a)?t+=n?1:-1:Nl.has(a)&&(t+=n?-1:1)}),t>0?"positive":t<0?"negative":"neutral"}var Ml=new Set("WHO WHAT WHERE WHEN WHY HOW WHICH WHOSE DO DOES DID CAN COULD WILL WOULD SHOULD IS ARE AM WAS WERE HAVE HAS ANY".split(" ")),Rl=/ (I NEED|I WANT|I WOULD LIKE|I AM LOOKING FOR|I CANNOT|I COULD NOT|HOW DO I|HOW CAN I|CAN YOU HELP|PLEASE HELP|HELP ME|HELP WITH|PROBLEM|ISSUE|ERROR|BROKEN|NOT WORKING|DOES NOT WORK|LOCKED|COMPLAINT|MY (?:ORDER|ACCOUNT|ADDRESS|DELIVERY|PAYMENT|CARD|SUBSCRIPTION|BOOKING|PASSWORD|LOGIN|INVOICE|PARCEL|PACKAGE|REFUND|TICKET|APPOINTMENT|RESERVATION|PURCHASE)) /;function Wl(e){let t=ot(e,!1);return/^[A-Z]{4,}$/.test(t)&&(!/[AEIOUY]/.test(t)||/[BCDFGHJKLMNPQRSTVWXZ]{6,}/.test(t))?"gibberish":Rl.test(` ${t} `)?"request":/\?\s*$/.test(String(e))||Ml.has(t.split(" ")[0])?"question":"statement"}function gr(e){if(!e||e.type==="text")return"";let t=Object.entries(e.attrs||{}).map(([a,s])=>` ${a}="${s}"`).join("");return`<${e.tag}${t}>${(e.children||[]).map(gr).join("")}`}function Rt(e){return e?e.type==="text"?e.value:(e.children||[]).map(Rt).join(""):""}function Sa(e,t,a=0,s=0,n=[],r=null){if(a===e.length&&s===t.length)return n;if(a>=e.length)return null;let i=e[a];if(i==="#"||i==="^"){for(let p=s;p<=t.length;p++){let h=t.slice(s,p).join(" "),c=Sa(e,t,a+1,p,[...n,h],r);if(c)return c}return null}if(i==="_"||i==="*"){if(s>=t.length)return null;for(let p=s+1;p<=t.length;p++){let h=t.slice(s,p).join(" "),c=Sa(e,t,a+1,p,[...n,h],r);if(c)return c}return null}if(s>=t.length)return null;if(zt(i)){let p=r?r(i.slice(1,-1)):null;if(!p)return null;for(let h=Math.min(t.length,s+p.maxWords);h>s;h--){let c=p.match(t.slice(s,h).join(" "));if(!c)continue;let o=Sa(e,t,a+1,h,[...n,c],r);if(o)return o}return null}return(i.startsWith("$")?i.slice(1):i)===t[s]?Sa(e,t,a+1,s+1,n,r):null}var Pa=new Set(["*","_","#","^"]);function kl(e){let t=0,a=0;for(let r of e.patTokens)r.startsWith("$")?t=t*8+7:r==="#"?t=t*8+6:r==="_"?t=t*8+5:r==="^"?t=t*8+2:r==="*"?t=t*8+1:zt(r)?t=t*8+3:t=t*8+4,zt(r)?a+=.5:Pa.has(r)||(a+=1);let s=e.topic!=="*"?1e12:0,n=e.that!=="*"?1e9:0;return s+n+a*1e6+t}var Er=new Set("A AN THE IS ARE AM BE DO DOES DID YOU YOUR I ME MY WE OUR IT ITS TO OF IN ON AT FOR AND OR SO WHAT WHEN WHERE WHO HOW WHY CAN COULD WOULD WILL SHOULD PLEASE TELL HAVE HAS THAT THIS THERE ANY SOME WITH ABOUT".split(" ")),ir=new Set([...Er].concat("GET GOT NEED WANT KNOW MUCH MANY LONG TAKE MAKE GO GOING JUST REALLY VERY ALSO TOO NOW THEN THAN FROM BY AS IF BUT NOT NO YES OK HI HELLO HEY THANK THANKS MORE MOST ALL EACH EVERY ANYTHING SOMETHING THING STUFF WAY KIND SORT LOT BIT GIVE SHOW SEE LOOK USE BEEN WAS WERE MIGHT MAY MUST LET HERE WHICH THEY THEM THEIR HE SHE HIS HER US ONE GOOD GREAT NEW RIGHT SURE QUESTION WONDER ASK SAY OUT UP DOWN OFF INTO OVER AGAIN STILL YET EVER NEVER ALWAYS TODAY LIKE DOING DONE HAD BEING DOE ACTUALLY MAYBE QUICK".split(" ")));function qt(e){let t=e;if(t.length<=3)return t;let a=(s,n,r="")=>t.endsWith(s)&&t.length-s.length>=n?(t=t.slice(0,t.length-s.length)+r,!0):!1;return!a("IES",2,"Y")&&!/(SS|US|IS)$/.test(t)&&a("S",3),a("ION",4)||a("MENT",3)||a("ING",3)||a("ED",4)||a("LY",4),t.length>5&&a("Y",4),t.length>6&&a("ER",4),t.length>4&&t[t.length-1]===t[t.length-2]&&!/[AEIOU]/.test(t[t.length-1])&&(t=t.slice(0,-1)),t.length>4&&a("E",3),t}var Ll={price:"price prices pricing cost costs fee fees charge charges rate rates expensive cheap affordable quote tariff",shipping:"ship ships shipping shipped shipment delivery deliver delivered delivering postage freight courier dispatch parcel arrive arrives arrival",returns:"return returns returning refund refunds refunded exchange exchanges reimburse reimbursement",hours:"hours open opening opens close closes closing closed shut shuts schedule",contact:"contact contacting reach message enquiry inquiry enquire inquire",phone:"phone telephone call calling ring mobile",talk:"talk talking speak speaking chat chatting",email:"email emails emailing mail",location:"location located locations address where directions based office offices store stores shop shops branch branches showroom",buy:"buy buying bought purchase purchasing order ordering orders checkout",discount:"discount discounts coupon coupons promo promotion promotions sale sales deal deals voucher vouchers offer offers",account:"account accounts login signin signup register registration password profile",cancel:"cancel cancelling canceling cancellation cancelled unsubscribe terminate",payment:"pay paying paid payment payments card cards paypal invoice invoices billing bill visa mastercard",trial:"trial trials demo demos sample samples preview",support:"support help assist assistance helpdesk troubleshoot troubleshooting",warranty:"warranty warranties guarantee guaranteed guarantees",tracking:"track tracking tracked status",install:"embed embedding install installing installation integrate integration setup plugin widget",download:"download downloads downloading export exporting",docs:"docs documentation guide guides manual tutorial tutorials instructions",about:"about company business team story mission history",security:"safe safety secure security privacy private gdpr",jobs:"job jobs career careers hiring vacancy vacancies employment recruit recruiting",size:"size sizes sizing fit fits measurement measurements",features:"feature features function functions capability capabilities",stock:"stock available availability inventory"},Go=new Map,vl=new Map;for(let[e,t]of Object.entries(Ll)){let a=t.toUpperCase().split(" ");vl.set(e,a);for(let s of a)Go.has(qt(s))||Go.set(qt(s),e)}var Yl=[[["MONEY","BACK"],"REFUND"],[["GET","IN","TOUCH"],"CONTACT"],[["LOG","IN"],"LOGIN"],[["SIGN","IN"],"LOGIN"],[["SIGN","UP"],"REGISTER"],[["SET","UP"],"SETUP"],[["SEND","BACK"],"RETURN"],[["HOW","FAR"],"LOCATION"],[["IN","STOCK"],"AVAILABLE"],[["OPENING","TIMES"],"HOURS"],[["ON","MY","SITE"],"EMBED"],[["ON","MY","WEBSITE"],"EMBED"],[["ON","MY","PAGE"],"EMBED"],[["TO","MY","SITE"],"EMBED"],[["TO","MY","WEBSITE"],"EMBED"],[["HOW","MUCH"],"PRICE",["IS","DOES","DO","ARE","FOR","WOULD","WILL","IT","THAT","THIS"]]];function Ul(e){let t=e;for(let[a,s,n]of Yl)for(let r=0;r+a.length<=t.length;r++){if(!a.every((l,p)=>t[r+p]===l))continue;let i=t[r+a.length];n&&i!==void 0&&!n.includes(i)||(t=[...t.slice(0,r),s,...t.slice(r+a.length)])}return t}function Vt(e){if(ir.has(e))return"";let t=qt(e);if(t.length<2||ir.has(t))return"";let a=Go.get(t);return a?`@${a}`:t}function Cl(e){let t=e.join(" ").toLowerCase();return t?t[0].toUpperCase()+t.slice(1):""}var Dl=new Set("star thatstar topicstar bot get set think srai sr random li condition uppercase lowercase formal sentence person person2 date time size version input that request response br emote gesture reply button chip suggest oob chips map calc explode count daysuntil fallback try name value text postback persona showcase tour stop".split(" ")),lr="";function cr(e,t,a){if(Math.abs(e.length-t.length)>a)return a+1;let s=e.length+1,n=t.length+1,r=null,i=Array.from({length:n},(l,p)=>p);for(let l=1;l<s;l++){let p=[l],h=l;for(let c=1;c<n;c++){let o=e[l-1]===t[c-1]?0:1,u=Math.min(i[c]+1,p[c-1]+1,i[c-1]+o);r&&l>1&&c>1&&e[l-1]===t[c-2]&&e[l-2]===t[c-1]&&(u=Math.min(u,r[c-2]+1)),p[c]=u,u<h&&(h=u)}if(h>a)return a+1;r=i,i=p}return i[n-1]}var Pl=new Set("AND OR WHAT ABOUT HOW IS ARE THERE ANY DO YOU HAVE GOT A AN THE ALSO TOO THEN PLEASE FOR OF IN WITH".split(" ")),Gl=new Set(["IT","THEY","THEM","THAT","THOSE","THIS","THESE","ONE","THERE"]);function hr(e,t){for(let a=Math.min(e.maxWords,t.length);a>=1;a--)for(let s=0;s+a<=t.length;s++){let n=e.match(t.slice(s,s+a).join(" "));if(n)return{member:n,rest:[...t.slice(0,s),...t.slice(s+a)]}}return null}function Bl(e){let t=e.category;return t.layer!=="base"||t.firm||t.literalOnly||t.that==="*"&&t.topic==="*"?!1:e.stars.some(a=>a.split(" ").some(s=>s&&Vt(s)!==""))}var _l=e=>e.layer==="custom"&&(e.keywordIdeas.size>0||!e.patTokens.some(t=>t==="*"||t==="_")),An=e=>e.layer==="custom"||e.requires.length>0;function ko(e){return String(e||"").trim().toLowerCase().replace(/\s+/g," ")}var G,Lo,Or,Hn,Ga,vo,no,Yo,so,Nn,Uo,Co,wn,Do,ht,Ar,Mn,Tr,Rn,ro,yr,Ir,Sr,br,io,Wn,Fe,kn,Bo=class{constructor(t={}){qn(this,G);this.botProps={name:"Aria",role:"Website Companion",company:"bot.computer",website:"https://bot.computer",...t.botProps||{}},this.vars=new Map([["topic","*"]]),this.layers={custom:[],base:[]},this.categories=[],this.vocabulary=new Set,this.quickChips=[],this.xmlBotProps={},this.lastBotThat="",this.history=[],this.fallbackStreak=0,this._randomMemory=new WeakMap,this._defs={custom:{sets:new Map,maps:new Map},base:{sets:new Map,maps:new Map}},this._followups={},this._justVaried=!1,this._resolvingEntity=!1,this._setLookup=a=>$(this,G,Ga).call(this,a),this._sources={custom:"",base:""},this._idf=new Map,this._answerIds=new Map,this.persona=null,this._personaConfig=null,this._personaXml=null,this._personaSays=new Map,this._personaMemory={},this.random=typeof t.random=="function"?t.random:Math.random,t.baseXml&&this.loadBaseXML(t.baseXml),t.xml&&this.loadXML(t.xml),t.persona&&this.setPersona(t.persona)}setPersona(t){return this._personaConfig=Ca(t),$(this,G,Lo).call(this),this.persona}setBotProps(t){Object.assign(this.botProps,t||{});try{if(this._sources.base){let a=$(this,G,Hn).call(this,this._sources.base);this.layers.base=a.categories,this._defs.base={sets:a.sets,maps:a.maps}}if(this._sources.custom){let a=$(this,G,Uo).call(this,this._sources.custom,"custom");this.layers.custom=a.categories,this._defs.custom={sets:a.sets,maps:a.maps},this.quickChips=a.quickChips,this.xmlBotProps=a.xmlBotProps,this._personaXml=a.persona,$(this,G,Lo).call(this)}$(this,G,Co).call(this)}catch{}}sampleStars(t){let a=[];for(let s of t.patTokens)s==="*"||s==="_"?a.push("\u2026"):s==="#"||s==="^"?a.push(""):zt(s)&&a.push($(this,G,Ga).call(this,s.slice(1,-1))?.sample||"\u2026");return a}samplePhrase(t){let a=[];for(let s of t.patTokens)if(s==="*"||s==="_")a.push("something");else{if(s==="#"||s==="^")continue;if(zt(s)){let n=$(this,G,Ga).call(this,s.slice(1,-1));if(!n||!n.sample)return"";a.push(n.sample)}else a.push(s.replace(/^\$/,""))}return a.join(" ").toLowerCase()}previewTemplate(t,a=[]){let s=n=>{if(n.type==="text")return n.value;let r=()=>(n.children||[]).map(s).join("");switch(n.tag){case"star":{let i=a[Math.max(1,parseInt(n.attrs.index||"1",10))-1];return i===void 0?"\u2026":i.toLowerCase()}case"map":{let i=$(this,G,vo).call(this,(n.attrs.name||"").toLowerCase()),l=ot(r(),!1);return i&&i.entries.get(l)||"\u2026"}case"srai":return`\u2192 ${r().toLowerCase()}`;case"bot":{let i=(n.attrs.name||"").toLowerCase();return String(this.botProps[i]||this.xmlBotProps?.[i]||"\u2026")}case"random":case"condition":{let i=(n.children||[]).find(l=>l.type==="element"&&l.tag==="li");return i?s(i):r()}case"tour":{let i=gn(n)[0];return i?" "+i.children.map(s).join(""):""}case"stop":case"think":case"emote":case"gesture":case"showcase":case"reply":case"button":case"chip":case"chips":case"suggest":case"oob":return"";case"thatstar":case"topicstar":case"get":case"input":case"that":case"request":case"response":case"sr":case"try":case"date":case"time":case"calc":case"count":case"daysuntil":return"\u2026";case"fallback":case"name":case"value":return"";case"br":return" ";default:return r()}};return jt(s(t)).replace(/\s+/g," ").replace(/\s+([,.!?;:])/g,"$1").trim()}lint(t=12){let a=[],s=(h,c)=>{a.length<t&&!a.some(o=>o.line===h&&o.message===c)&&a.push({line:h,message:c})},n={activeTopic:"*",activeTopicWords:["*"],lastThatWords:[]},r=new Map,i=new Set,l=(h,c)=>{for(let o of h.matchAll(/\[([^\]\n]{1,60})\]/g)){let u=o[1].trim();if(!(!/^[a-zA-Z_/]/.test(u)||/(^|[,\s])\/?sing\b/i.test(u)))for(let d of u.split(/[,\s]+/).filter(Boolean)){let m=d.split("=")[0].toLowerCase();if(dr(d)||Sn(d)||In.has(m)||Object.prototype.hasOwnProperty.call(yn,m)||d.includes("="))continue;let g=[...pr,...nl].find(f=>cr(f,m.replace(/[-_]/g,""),2)<=(m.length>4?2:1));s(c,`[${d}] is not an action or voice style, so it is left out.${g?` Did you mean [${g}]?`:""}`)}}},p=(h,c,o)=>{if(h.type==="text"){l(h.value,c);return}let u=h.line||c;if(!Dl.has(h.tag))s(u,`<${h.tag}> is not a tag this engine supports. Its contents are used as plain text.`);else if(h.tag==="tour")gn(h).length||s(u,"<tour> needs at least one <stop> with a valid target."),h.children.some(d=>d.type==="element"?d.tag!=="stop":d.value.trim())&&s(u,"Put each tour explanation and its gestures inside a <stop>.");else if(h.tag==="stop")o!=="tour"&&s(u,"<stop> belongs directly inside a <tour>."),Ba(h.attrs.target)||s(u,'<stop> needs a literal target such as "pricing". Use a letter followed by letters, digits, underscores or hyphens, up to 64 characters total.');else if(h.tag==="showcase")Ba(h.attrs.target)?h.children.some(d=>d.type==="element"||d.value.trim())&&s(u,"Only the target attribute of <showcase> is used. Put speech and gestures beside the tag."):s(u,'<showcase> needs a target such as "pricing". Start with a letter and use up to 64 letters, digits, underscores or hyphens.');else if(h.tag==="bot"){let d=(h.attrs.name||"").toLowerCase();d&&!String(this.botProps[d]||this.xmlBotProps?.[d]||"").trim()&&s(u,`<bot name="${d}"/> has no value yet, so nothing is said there.`)}else if(h.tag==="srai"&&(h.children||[]).every(d=>d.type==="text")){let d=ot(Rt(h),!1),m=d.split(" ");if(d&&!$(this,G,ht).call(this,m,!1,n)&&!$(this,G,ht).call(this,m,!1,n,!0)){let g=Rt(h).replace(/\s+/g," ").trim();s(u,`<srai>${g}</srai> does not lead to any rule, so this answer falls through to the fallback.`)}}h.tag==="map"&&h.attrs.name&&!$(this,G,vo).call(this,h.attrs.name.toLowerCase())&&s(u,`The map "${h.attrs.name}" is not defined, so nothing is looked up there.`);for(let d of h.children||[])p(d,u,h.tag)};for(let h of this.layers.custom){for(let u of h.sets)$(this,G,Ga).call(this,u)||s(h.line,`The set "${u}" is not defined, so the pattern "${h.pattern}" can never match.`);let c=`${h.pattern}${h.that}${h.topic}`,o=r.get(c);if(o&&o.template!==h.template?s(h.line,`The pattern "${h.pattern}" is already used on line ${o.line}. Only one of them can answer.`):o||r.set(c,h),!i.has(h.template)){i.add(h.template);for(let u of h.template.children||[])p(u,h.template.line||h.line)}}return a}warmUp(){for(let t of["hello there","what are your fees for postage please","xyzzy plugh frobnicate","i like hiking a lot"])try{this.resolve(t)}catch{}}exportSession(){let{frame:t,entity:a,result:s}=this._followups;return{vars:[...this.vars.entries()],lastBotThat:this.lastBotThat,history:this.history.slice(-12),fallbackStreak:this.fallbackStreak,followups:{frame:t?{...t,stars:[...t.stars]}:null,entity:a?{...a}:null,result:s?{...s}:null,justVaried:this._justVaried}}}importSession(t){if(!(!t||typeof t!="object"))try{this.resetSession(),Array.isArray(t.vars)&&(this.vars=new Map(t.vars.filter(l=>Array.isArray(l)&&l.length===2))),this.vars.has("topic")||this.vars.set("topic","*"),typeof t.lastBotThat=="string"&&(this.lastBotThat=t.lastBotThat),Array.isArray(t.history)&&(this.history=t.history.slice(-12).filter(l=>typeof l?.user=="string"&&typeof l?.bot=="string")),this.fallbackStreak=Number(t.fallbackStreak)||0;let{frame:a,entity:s,result:n,justVaried:r}=t.followups||{},i=(l,p)=>Number.isInteger(l?.remaining)&&l.remaining>=0&&l.remaining<=p;i(a,2)&&(a.layer==="custom"||a.layer==="base")&&typeof a.pattern=="string"&&Array.isArray(a.stars)&&a.stars.every(l=>typeof l=="string")&&(this._followups.frame={pattern:a.pattern,layer:a.layer,stars:[...a.stars],remaining:a.remaining}),i(s,3)&&typeof s.phrase=="string"&&(this._followups.entity={phrase:s.phrase,remaining:s.remaining}),i(n,3)&&typeof n.value=="string"&&n.value.trim()&&Number.isFinite(Number(n.value))&&(this._followups.result={value:n.value,remaining:n.remaining}),this._justVaried=r===!0}catch{this.resetSession()}}resetSession(){this._followups={},this._justVaried=!1,this.vars.clear(),this.vars.set("topic","*"),this.lastBotThat="",this.history=[],this.fallbackStreak=0}loadXML(t){let a=$(this,G,Uo).call(this,t,"custom");return this._sources.custom=String(t||""),this.layers.custom=a.categories,this._defs.custom={sets:a.sets,maps:a.maps},this.quickChips=a.quickChips,this.xmlBotProps=a.xmlBotProps,this._personaXml=a.persona,$(this,G,Lo).call(this),$(this,G,Co).call(this),{valid:!0,categories:a.categories.length,quickChips:a.quickChips,botProps:{...a.xmlBotProps,...this.botProps}}}loadBaseXML(t){let a=t?$(this,G,Hn).call(this,String(t)):{categories:[],sets:new Map,maps:new Map};return this.layers.base=a.categories,this._defs.base={sets:a.sets,maps:a.maps},this._sources.base=String(t||""),$(this,G,Co).call(this),{valid:!0,categories:this.layers.base.length}}resolve(t){let a=ot(t,!1);if(!a)return null;let s=$(this,G,Ir).call(this,a.split(" ")).map(N=>$(this,G,Ar).call(this,N)).flatMap(N=>Bt(Po,N)?Po[N].split(" "):[N]),n=$(this,G,Do).call(this),r=N=>N.layer==="custom"||N.literalOnly||N.firm||N.sets.length===N.patTokens.length||N.that!=="*"||N.topic!=="*",i=N=>{let k=$(this,G,ht).call(this,N,!1,n),_=null;return k&&Bl(k)&&(_=k,k=$(this,G,ht).call(this,N,!1,n,!1,!1,!0)),{hit:k,followUp:_}},{hit:l,followUp:p}=i(s);if(l&&l.category.layer==="base"&&!l.category.firm&&l.category.that==="*"&&l.category.topic==="*"){let N=$(this,G,ht).call(this,s,!1,n,!1,!0,!1,_l);if(N)return{...N,kind:"exact"}}if(l&&r(l.category))return{...l,kind:"exact"};let h=bl(s);if(h!==s){let N=i(h);if(N.hit&&r(N.hit.category))return{...N.hit,kind:"exact"};N.hit&&(s=h,l=N.hit,p=N.followUp||p)}let c=null;if(l&&(c=l,l=$(this,G,ht).call(this,s,!1,n,!1,!0),l))return{...l,kind:"exact"};let o=!!(c||p),u=Ul(s);if(l=(u!==s?$(this,G,ht).call(this,u,!1,n,!1,o):null)||$(this,G,Rn).call(this,u,n,o),l)return{...l,kind:"synonym"};if(s.some(N=>Bt(On,N))&&(l=$(this,G,ht).call(this,s.map(N=>Bt(On,N)?On[N]:N),!1,n,!1,o),l))return{...l,kind:"synonym"};let d=$(this,G,Mn).call(this,u),m=u!==s?$(this,G,Mn).call(this,s):null;for(let N of[m,d])if(N&&(l=$(this,G,ht).call(this,N,!1,n,!1,o)||$(this,G,Rn).call(this,N,n,o),l))return{...l,kind:"typo"};let g=d||u;if(l=$(this,G,Tr).call(this,g,n,o,d?.75:.6),l)return{...l,kind:"loose"};let f=$(this,G,yr).call(this,g);if(f.hit)return{...f.hit,kind:"meaning",also:f.also?{...f.also,kind:"meaning"}:null};if(c)return{...c,kind:"exact"};if(p)return{...p,kind:"exact"};let E=this._followups.frame;if(E&&!this._resolvingEntity&&s.length<=6&&!s.some(N=>En.has(N))){let N=this.layers[E.layer].find(V=>V.pattern===E.pattern&&V.continuable&&V.sets.length===1&&(!V.requires.length||$(this,G,so).call(this,V.requires))),k=N&&$(this,G,Ga).call(this,N.sets[0]),_=k&&hr(k,s);if(_&&_.rest.every(V=>Pl.has(V))){let V=N.patTokens.filter(J=>Pa.has(J)||zt(J));if(E.stars.length===V.length){let J=[...E.stars];return J[V.findIndex(zt)]=_.member,{category:N,stars:J,thatStars:[],topicStars:[],kind:"followup"}}}}let T=this._followups.result;if(T&&!this._resolvingEntity){let N=s.findIndex(_=>_==="THAT"||_==="IT"),k=N<0&&gl.has(h[0]);if(N>=0||k){let _=k?`${T.value} ${h.join(" ")}`:[...s.slice(0,N),String(T.value),...s.slice(N+1)].join(" "),V=bn(_);if(V&&V.ops>0){this._resolvingEntity=!0;try{let J=this.resolve(_);if(J&&J.kind!=="fallback")return{...J,kind:"followup"}}finally{this._resolvingEntity=!1}}}}let b=this._followups.entity;if(b&&!this._resolvingEntity){let N=s.findIndex(k=>Gl.has(k));if(N>=0){this._resolvingEntity=!0;try{let k=this.resolve([...s.slice(0,N),b.phrase,...s.slice(N+1)].join(" "));if(k&&k.kind!=="fallback"&&k.kind!=="chat"&&(An(k.category)||k.category.sets.length>0))return{...k,kind:"followup"}}finally{this._resolvingEntity=!1}}}return l=(h!==s?$(this,G,ht).call(this,h,!1,n,!0):null)||$(this,G,ht).call(this,s,!1,n,!0)||(u!==s?$(this,G,ht).call(this,u,!1,n,!0):null)||(d?$(this,G,ht).call(this,d,!1,n,!0):null),l?{...l,kind:"chat"}:(l=$(this,G,ht).call(this,s,!0,n),l?{...l,kind:"fallback",related:f.related}:null)}findMatch(t){let a=ot(t,!1);return a?$(this,G,ht).call(this,a.split(" "),!0):null}reply(t){let a=String(t||"").trim();if(!a)return{speechText:"",displayText:"",chips:this.quickChips.slice(0,4),emote:null,showcase:"",tour:[],cues:[],cueWords:0,matchedPattern:null,matchedLayer:null,matchKind:"none"};let s=[],n=tr(a),r=n.length>1&&ol.has(ot(n[0],!1)),i=r?1:0,l=(D,K,Q)=>K&&K.kind!=="fallback"&&!s.some(oe=>oe.hit.category===K.category)?(s.push({text:D,hit:K,inputIndex:Q}),!0):!1;for(let D=i;D<Math.min(n.length,i+4);D++){let K=r&&D===i?`${n[0].replace(/[.!?]+$/,"")} ${n[D]}`:n[D],Q=K.split(/\s+(?:and|&|plus|also|but)\s+/i);if(Q.length===2){let w=this.resolve(K),Y=w?.category.patTokens;if(w?.kind==="exact"&&Y.some(te=>["AND","PLUS","ALSO","BUT"].includes(te))&&!Y.some(te=>Pa.has(te))){l(K,w,D);continue}let[j,ae]=Q.map(te=>this.resolve(te)),z=te=>te&&te.kind!=="fallback"&&!te.category.isCatchAll;if(z(j)&&z(ae)&&$(this,G,ro).call(this,j.category)!==$(this,G,ro).call(this,ae.category)){l(Q[0],j,D),l(Q[1],ae,D);continue}}let oe=this.resolve(K);l(K,oe,D),oe&&oe.also&&l(K,oe.also,D)}let p=!1,h=[];if(!s.length){let D=this.resolve(a);D&&s.push({text:a,hit:D,inputIndex:n.length-1}),p=!D||D.kind==="fallback",h=D&&D.related||[]}this.vars.set("didyoumean",h.length?"yes":"");let c=this.fallbackStreak;this.fallbackStreak=p?this.fallbackStreak+1:0,$(this,G,Sr).call(this,a);let o={chips:[],emote:null,showcase:"",tour:null,streakBefore:c,inputs:n},u=[];for(let D of s.slice(0,3)){o.inputIndex=D.inputIndex;let K=$(this,G,io).call(this,D.hit,D.text,0,o).replace(/\s+/g," ").trim();K&&u.push(K)}let d=s.length===1&&s[0].hit.kind!=="fallback"&&o.answeredBy||s[0]?.hit||null;(d&&d.kind==="fallback"||o.fellBack)&&(p=!0),o.related&&o.related.length&&(h=o.related);let m=p?"":o.showcase,g=p?[]:o.tour||[];g[0]?.text&&u.push(g[0].text);let f=u.length||m||g.length?u.join(" "):`I'm not sure about that yet, but I'm happy to help with questions about ${this.botProps.company||"our site"}!`,E=String(this.vars.get("voicestyle")||"").trim().toLowerCase(),T=g.length?f:$(this,G,br).call(this,f,{isFallback:p,first:d,plans:s,sideEffects:o,style:E}),b=D=>{let K=Un(D&&E&&In.has(E)?`[${E}] ${D}`:D);return{speechText:K.speechText,displayText:jt(D),cues:K.cues,cueWords:K.wordCount}},N=b(T),k=g.map((D,K)=>({target:D.target,...K===0?N:b(D.text)})),_=jt(f),V=er(_);this.lastBotThat=V[V.length-1]||_,this.history.push({user:a,bot:_}),this.history.length>50&&this.history.shift();for(let[D,K]of Object.entries(this._followups))K.remaining===0?delete this._followups[D]:K.remaining--;!p&&d&&d.category.varies&&!s.some(D=>D.hit.category.replaysLastAsk||D.hit.category.that!=="*")&&this.vars.set("lastask",a);let J=ot(a,!1).split(" "),ue=[...[...this._defs.base.maps.values()].map(D=>D.keys),...this._defs.custom.sets.values(),...[...this._defs.custom.maps.values()].map(D=>D.keys)];for(let D of ue){let K=hr(D,J);K&&(this._followups.entity={phrase:K.member,remaining:3})}o.calcValue!==void 0&&(this._followups.result={value:o.calcValue,remaining:3}),this._justVaried=!!(!p&&d&&d.category.varies),!p&&d&&d.category.continuable&&d.category.sets.length===1&&d.stars&&(this._followups.frame={layer:d.category.layer,pattern:d.category.pattern,stars:[...d.stars],remaining:2});let L=new Set,U=o.chips.filter(D=>!L.has(D.label)&&L.add(D.label)).slice(0,5),v=U;if(p){let D=U.length?U:this.quickChips.map(Q=>({label:Q,query:Q})),K=new Set(h.map(Q=>Q.label.toLowerCase()));v=[...h,...D.filter(Q=>!K.has(Q.label.toLowerCase()))].slice(0,4)}let R=N.cues.find(D=>D.type==="action");return{...N,chips:v,emote:R?R.name:null,showcase:m,tour:k,matchedPattern:d?d.category.pattern:null,matchedLayer:d?d.category.layer:null,matchKind:o.fellBack?"fallback":d?d.kind:"none"}}};G=new WeakSet,Lo=function(){let t=this._personaXml,a=t&&t.fields.id&&this._personaConfig&&t.fields.id!==this._personaConfig.id?{}:this._personaConfig||{};if(this.persona=t?Ca({...a,...t.fields}):this._personaConfig,this._personaSays=new Map,this._personaMemory={},!!this.persona){for(let[s,n]of Object.entries(qs(this.persona))){let r=$(this,G,Or).call(this,n);r&&this._personaSays.set(s,r)}if(t)for(let[s,n]of Object.entries(t.says))this._personaSays.set(s,{type:"element",tag:"random",attrs:{},children:n})}},Or=function(t){let a=n=>`<random>${n.map(r=>`<li>${r}</li>`).join("")}</random>`,s=n=>xs(n).children.find(r=>r.type==="element"&&r.tag==="random")||null;try{return s(a(t.map(fn)))}catch{try{return s(a(t.map(n=>fn(Zi(n)))))}catch{return null}}},Hn=function(t){let a=r=>String(this.botProps[r]??"").trim(),s=Wo.find(r=>r.xml===t&&Object.entries(r.props).every(([i,l])=>a(i)===l));if(s)return s.parsed;let n=$(this,G,Uo).call(this,t,"base");return Wo.unshift({xml:t,props:n.patternProps,parsed:n}),Wo.length>4&&(Wo.length=4),n},Ga=function(t){for(let a of[this._defs.custom,this._defs.base]){let s=a.sets.get(t);if(s)return s;let n=a.maps.get(t);if(n)return n.keys}return Bt(sr,t)?sr[t]:null},vo=function(t){return this._defs.custom.maps.get(t)||this._defs.base.maps.get(t)||null},no=function(t,a,s){if(t.attrs&&t.attrs[a]!==void 0)return t.attrs[a];let n=(t.children||[]).find(r=>r.type==="element"&&r.tag===a);return n?$(this,G,Fe).call(this,n.children,s).trim():void 0},Yo=function(t,a){return(t.children||[]).filter(s=>!(s.type==="element"&&a.includes(s.tag)))},so=function(t){return t.some(a=>String(this.botProps[a]||this.xmlBotProps?.[a]||"").trim()!=="")},Nn=function(t){if(t.type==="text")return t.value;if(t.tag==="bot"){let a=String(this.botProps[(t.attrs.name||"").toLowerCase()]??"").trim();return this._patternProps&&(this._patternProps[(t.attrs.name||"").toLowerCase()]=a),a?` ${a} `:lr}if(t.tag==="set"){let a=(t.attrs.name||Rt(t)).trim().toUpperCase().replace(/[^A-Z0-9_]+/g,"_");return a?` ZZSET${a}ZZ `:""}return(t.children||[]).map(a=>$(this,G,Nn).call(this,a)).join("")},Uo=function(t,a){let s=xs(t),n=s.children.find(d=>d.type==="element"&&d.tag==="aiml")||s,r=[],i=[],l={},p=new Map,h=new Map,c=null;this._patternProps={};let o=(d,m="*")=>{let g=[],f=null,E=null;for(let U of d.children||[])U.type==="element"&&(U.tag==="pattern"?g.push(U):U.tag==="that"?f=U:U.tag==="template"&&(E=U));if(!g.length||!E)return;let T=gr(E),b=String(d.attrs.requires||"").split("|").map(U=>U.trim().toLowerCase()).filter(Boolean),N=new Set(ot(jt(Rt(E)),!1).split(" ").map(Vt).filter(Boolean).slice(0,60)),k=(E.children||[]).filter(U=>U.type!=="text"||U.value.trim()),_=k.length===1&&k[0].tag==="srai"&&(k[0].children||[]).every(U=>U.type==="text")?ot(Rt(k[0]),!1):"",V=f&&ot(Rt(f),!0)||"*",J=V.split(" ").filter(Boolean),ue=ot(m,!0)||"*",L=ue.split(" ").filter(Boolean);for(let U of g){let v=$(this,G,Nn).call(this,U),R=v.includes("|")?v.split("|"):[v];for(let D of R){if(D.includes(lr))continue;let K=ot(D,!0);if(!K)continue;let Q=K.split(" ").filter(Boolean).map(Y=>{let j=Al.exec(Y);return j?`<${j[1].toLowerCase()}>`:Y}),oe=Q.filter(Y=>!Pa.has(Y)&&!zt(Y)).map(Y=>Y.startsWith("$")?Y.slice(1):Y),w={pattern:Q.join(" "),patTokens:Q,sets:Q.filter(zt).map(Y=>Y.slice(1,-1)),late:d.attrs.late==="true",firm:d.attrs.firm==="true",personaOff:d.attrs.persona==="off",varies:/<random\b/i.test(T),continuable:V==="*"&&ue==="*"&&(/<map\b/i.test(T)||!/<think\b/i.test(T)),that:V,thatTokens:J,topic:ue,topicTokens:L,template:E,line:d.line||1,start:d.start??-1,layer:a,literals:oe,literalOnly:oe.length===Q.length,replaysLastAsk:/<get name="lastask"/i.test(T),stems:oe.map(qt),looseKeys:oe.map(Y=>Vt(Y)||qt(Y)),requires:b,keywordIdeas:new Set(oe.map(Vt).filter(Boolean)),answerIdeas:N,needsStar:/<(star|sr|thatstar|topicstar)\b/i.test(T),selfMatching:!Q.some(Y=>Y==="*"||Y==="_"||zt(Y)),aliasOf:_,isCatchAll:Q.every(Y=>Pa.has(Y))&&V==="*"&&ue==="*"};w.score=kl(w),r.push(w)}}};for(let d of n.children||[])if(d.type==="element"){if(d.tag==="bot"||d.tag==="property"||d.tag==="meta"){let m=d.attrs.name||d.attrs.key,g=d.attrs.value??Rt(d).trim();m&&g&&(m.toLowerCase()==="chip"||m.toLowerCase()==="suggest"?i.push(g):l[m.toLowerCase()]=g)}else if(d.tag==="chips"||d.tag==="suggestions"){for(let m of d.children||[])if(m.type==="element"){let g=Rt(m).trim();g&&i.push(g)}}else if(d.tag==="set"&&d.attrs.name){let m=(d.children||[]).filter(f=>f.type==="element").map(f=>Rt(f)),g=m.length?m:Rt(d).split(/[,;\n]+/);p.set(d.attrs.name.toLowerCase(),nr(g))}else if(d.tag==="map"&&d.attrs.name){let m=new Map,g=(f,E)=>{let T=ot(f,!1);T&&String(E).trim()&&m.set(T,String(E).trim())};for(let f of d.children||[])if(f.type==="element")g(f.attrs.key??f.attrs.name??"",Rt(f));else for(let E of f.value.split(/\n+/)){let T=E.search(/[:=]/);T>0&&g(E.slice(0,T),E.slice(T+1))}h.set(d.attrs.name.toLowerCase(),{entries:m,keys:nr([...m.keys()])})}else if(d.tag==="persona")c=Qs(d,Rt);else if(d.tag==="category")o(d,"*");else if(d.tag==="topic"){let m=d.attrs.name||"*";for(let g of d.children||[])g.type==="element"&&g.tag==="category"&&o(g,m)}}let u=this._patternProps;return this._patternProps=null,{categories:r,quickChips:i,xmlBotProps:l,sets:p,maps:h,patternProps:u,persona:c}},Co=function(){this.categories=[...this.layers.custom,...this.layers.base].sort((i,l)=>l.score-i.score);let t=new Set;for(let i of this.categories){for(let l of i.literals)t.add(l);for(let l of i.thatTokens)Pa.has(l)||t.add(l)}for(let i of[this._defs.custom,this._defs.base])for(let l of[...i.sets.values(),...[...i.maps.values()].map(p=>p.keys)])for(let p of l.phrases)for(let h of p.split(" "))t.add(h);this.vocabulary=t;let a=new Map;for(let i of t){let l=Vt(i);l&&(a.has(l)||a.set(l,[]),a.get(l).push(i))}this._wordsByIdea=a;let s=new Map,n=new Set;for(let i of this.categories)if(i.keywordIdeas.size){n.add(i.template);for(let l of i.keywordIdeas)s.has(l)||s.set(l,new Set),s.get(l).add(i.template)}let r=n.size;this._idf=new Map([...s].map(([i,l])=>[i,Math.log(1+r/(1+l.size))])),this._answerIds=new Map},wn=function(t,a){let s=[];if(t.topic!=="*"&&(a.activeTopic==="*"||(s=Sa(t.topicTokens,a.activeTopicWords),!s)))return null;let n=[];return t.that!=="*"&&(!a.lastThatWords.length||(n=Sa(t.thatTokens,a.lastThatWords),!n))?null:{topicStars:s,thatStars:n}},Do=function(){let t=ot(this.vars.get("topic")||"*",!1)||"*",a=ot(this.lastBotThat||"",!1);return{activeTopic:t,activeTopicWords:t==="*"?["*"]:t.split(" "),lastThatWords:a?a.split(" "):[]}},ht=function(t,a,s=$(this,G,Do).call(this),n=!1,r=!1,i=!1,l=null){let p=new Set(t);for(let h of this.categories){if((h.isCatchAll?!a||n:h.late!==n)||r&&!An(h)||i&&(h.that!=="*"||h.topic!=="*")||l&&!l(h))continue;let c=!0;for(let d of h.literals)if(!p.has(d)){c=!1;break}if(!c||h.requires.length&&!$(this,G,so).call(this,h.requires))continue;let o=$(this,G,wn).call(this,h,s);if(!o)continue;let u=Sa(h.patTokens,t,0,0,[],this._setLookup);if(u)return{category:h,stars:u,thatStars:o.thatStars,topicStars:o.topicStars}}return null},Ar=function(t){if(!/([A-Z])\1\1/.test(t))return t;let a=t.match(/([A-Z])\1*/g)||[t],s=a.map((n,r)=>n.length>=3?r:-1).filter(n=>n>=0).slice(0,4);for(let n=0;n<1<<s.length;n++){let r=a.map((i,l)=>{let p=s.indexOf(l);return p<0?i.length>=3?i[0]:i:n>>p&1?i[0]+i[0]:i[0]}).join("");if(this.vocabulary.has(r))return r}return a.map(n=>n.length>=3?n[0]:n).join("")},Mn=function(t){let a=!1,s=t.map(n=>{if(n.length<4||this.vocabulary.has(n)||/\d/.test(n)||Go.has(qt(n))||this._wordsByIdea.has(Vt(n)))return n;let r=n.length>=8?2:1,i="",l=r+1,p=!1;for(let h of this.vocabulary){if(h[0]!==n[0]||h.length<3)continue;let c=cr(n,h,r);c<l?(i=h,l=c,p=!1):c===l&&c<=r&&(p=!0)}return i&&!p?(a=!0,i):n});return a?s:null},Tr=function(t,a=$(this,G,Do).call(this),s=!1,n=.6){let r=new Set(t.map(c=>Vt(c)||qt(c))),i=[...new Set(t.map(Vt).filter(Boolean))],l=t.some(c=>En.has(c)),p=t.some(c=>rr.has(c)),h=null;for(let c of this.categories){if(!c.literalOnly||c.late||c.stems.length<2||t.length>c.stems.length+2||!c.keywordIdeas.size||s&&!An(c)||c.requires.length&&!$(this,G,so).call(this,c.requires)||i.some(b=>!c.keywordIdeas.has(b)))continue;let o=c.literals.some(b=>En.has(b)),u=c.literals.some(b=>rr.has(b));if(l&&!o&&u||p&&!u&&o)continue;let d=0,m=0,g=0;for(let b=0;b<c.stems.length;b++){let N=r.has(c.looseKeys[b]);N&&d++,Er.has(c.stems[b])||(m++,N&&g++)}if(!m||g<m)continue;let f=d/c.stems.length;if(f<n)continue;let E=$(this,G,wn).call(this,c,a);if(!E)continue;let T=g*10+f;(!h||T>h.quality)&&(h={quality:T,hit:{category:c,stars:[],thatStars:E.thatStars,topicStars:E.topicStars}})}return h?h.hit:null},Rn=function(t,a,s=!1){let n=t.map(p=>{if(this.vocabulary.has(p))return null;let h=Vt(p),c=h?this._wordsByIdea.get(h):null;if(!c||!c.length)return null;let o=qt(p);return[...c].sort((u,d)=>+(qt(d)===o)-+(qt(u)===o)).slice(0,8)}),r=n.map((p,h)=>p?h:-1).filter(p=>p>=0);if(!r.length)return null;let i=p=>{let h=t.map((c,o)=>n[o]?n[o][p[o]||0]:c);return $(this,G,ht).call(this,h,!1,a,!1,s)},l=i({});for(let p=0,h=0;!l&&p<r.length&&h<20;p++)for(let c=1;!l&&c<n[r[p]].length&&h<20;c++,h++)l=i({[r[p]]:c});return l},ro=function(t){if(!t.aliasOf)return t.template;if(!this._answerIds.has(t.aliasOf)){this._answerIds.set(t.aliasOf,t.template);let a=$(this,G,ht).call(this,t.aliasOf.split(" "),!1,{activeTopic:"*",activeTopicWords:["*"],lastThatWords:[]});this._answerIds.set(t.aliasOf,a?$(this,G,ro).call(this,a.category):t.template)}return this._answerIds.get(t.aliasOf)},yr=function(t){let a=[...new Set(t.map(Vt).filter(Boolean))];if(!a.length)return{hit:null,related:[]};let s=3,n=a.map(u=>this._idf.get(u)??s),r=n.reduce((u,d)=>u+d,0),i=[];for(let u of this.categories){if(u.layer!=="custom"&&!u.requires.length||u.isCatchAll||u.that!=="*"||u.topic!=="*"||u.needsStar||!u.keywordIdeas.size||u.requires.length&&!$(this,G,so).call(this,u.requires))continue;let d=0,m=0,g=0;if(a.forEach((E,T)=>{u.keywordIdeas.has(E)?(d+=n[T],m++,T<30&&(g|=1<<T)):u.answerIdeas.has(E)&&(d+=n[T]*.35)}),!m)continue;let f=(u.keywordIdeas.size-m)/u.keywordIdeas.size;i.push({cat:u,coverage:d/r-.3*f,hitMask:g,id:$(this,G,ro).call(this,u)})}if(!i.length)return{hit:null,related:[]};i.sort((u,d)=>d.coverage-u.coverage||d.cat.score-u.cat.score);let l=[];for(let u of i)l.some(d=>d.id===u.id)||l.push(u);let[p,h]=l,c=l.filter(u=>u.coverage>=.3&&u.cat.selfMatching).slice(0,3).map(u=>({label:Cl(u.cat.literals),query:u.cat.literals.join(" ").toLowerCase()})),o=u=>({category:u.cat,stars:[],thatStars:[],topicStars:[]});return h&&p.coverage>=.3&&h.coverage>=.3&&p.coverage+h.coverage>=.8&&!(p.hitMask&h.hitMask)?{hit:o(p),also:o(h),related:c}:p.coverage>=.55&&(!h||p.coverage-h.coverage>=.12)?{hit:o(p),related:c}:{hit:null,related:c}},Ir=function(t){let a=ot(this.botProps.name||"",!1).split(" ").filter(Boolean),s=a.length;if(!s||t.length<s)return t;let n=a.every((i,l)=>t[l]===i),r=a.every((i,l)=>t[t.length-s+l]===i);return t.length===s?n?["HELLO"]:t:n?t.slice(s):r?t.slice(0,-s):t},Sr=function(t="",a=new Date){let s=a.getHours();this.vars.set("inputkind",Wl(t)),this.vars.set("justvaried",this._justVaried?"yes":""),this.vars.set("mood",wl(ot(t,!1).split(" "))),this.vars.set("daypart",s>=5&&s<12?"morning":s>=12&&s<17?"afternoon":"evening"),this.vars.set("dayname",a.toLocaleDateString("en-US",{weekday:"long"})),this.vars.set("fallbackstreak",String(this.fallbackStreak)),this.vars.set("suggestions",this.quickChips.length?"yes":""),this.vars.set("personality",this.persona?this.persona.id:""),this.vars.set("callsyou",this.persona?this.persona.petName:"");for(let[n,r]of Object.entries({...this.xmlBotProps,...this.botProps}))this.vars.set(`bot_${n}`,String(r||this.xmlBotProps?.[n]||"").trim())},br=function(t,{isFallback:a,first:s,plans:n,sideEffects:r,style:i}){if(!this.persona||r.plain)return t;let l=s?s.category:null,p=n.some(c=>c.hit.category.that!=="*"||c.hit.category.topic!=="*"),h=a?"fallback":r.personaSaid?"says":p?"context":l&&(l.layer==="custom"||l.requires.length)?"answer":"chat";return Js(t,this.persona,{kind:h,gentle:this.vars.get("mood")==="negative"||!!(l&&l.firm),varied:!!(l&&l.varies),voicestyle:i,memory:this._personaMemory,rng:this.random})},io=function(t,a,s,n){t.category.personaOff&&n&&(n.plain=!0);let r={input:a,stars:t.stars,thatStars:t.thatStars,topicStars:t.topicStars,depth:s,sideEffects:n};return $(this,G,Fe).call(this,t.category.template.children,r)},Wn=function(t,a,s){if(a>22)return"";let n=this.resolve(t);return n?(s.answeredBy=n,n.kind==="fallback"&&!s.fellBack&&(s.fellBack=!0,this.fallbackStreak=(s.streakBefore||0)+1,this.vars.set("fallbackstreak",String(this.fallbackStreak)),s.related=n.related||[],this.vars.set("didyoumean",s.related.length?"yes":"")),$(this,G,io).call(this,n,t,a,s)):""},Fe=function(t,a){let s="";for(let n of t||[])s+=$(this,G,kn).call(this,n,a);return s},kn=function(t,a){if(!t)return"";if(t.type==="text")return t.value;let s=t.tag,n=t.attrs||{};switch(s){case"star":{let r=Math.max(1,parseInt(n.index||"1",10))-1;return(a.stars[r]||"").toLowerCase().replace(/(\d) point (?=\d)/g,"$1.")}case"thatstar":{let r=Math.max(1,parseInt(n.index||"1",10))-1;return(a.thatStars[r]||"").toLowerCase()}case"topicstar":{let r=Math.max(1,parseInt(n.index||"1",10))-1;return(a.topicStars[r]||"").toLowerCase()}case"bot":{let r=(n.name||"").toLowerCase();return this.botProps[r]??this.xmlBotProps?.[r]??""}case"get":{let r=ko($(this,G,no).call(this,t,"name",a)),i=this.vars.get(r);return i!==void 0&&i!==""?i:n.default??""}case"set":{let r=ko($(this,G,no).call(this,t,"name",a)),i=$(this,G,Fe).call(this,$(this,G,Yo).call(this,t,["name"]),a).trim();return r&&this.vars.set(r,i),i}case"map":{let r=$(this,G,vo).call(this,String($(this,G,no).call(this,t,"name",a)||"").toLowerCase());if(!r)return n.default??"";let i=ot($(this,G,Fe).call(this,$(this,G,Yo).call(this,t,["name"]),a),!1),l=fr(i).find(p=>r.entries.has(p));return r.entries.get(i)??(l?r.entries.get(l):void 0)??n.default??""}case"calc":{let r=bn($(this,G,Fe).call(this,t.children,a));if(!r)return n.default??"";if(r.divideByZero)return"undefined";if(typeof r.value=="boolean")return String(r.value);let i=Ol(r.value,n.round);return a.sideEffects.calcValue=i,i}case"count":{let r=Cn(mr($(this,G,Fe).call(this,t.children,a)),0);if(!r)return"";let i=Array.from({length:Math.max(1,Math.min(30,Math.round(r.value)))},(l,p)=>p+1);return n.down==="true"&&i.reverse(),i.join(", ")}case"explode":return[...$(this,G,Fe).call(this,t.children,a).replace(/\s+/g,"")].join(n.sep??" ");case"daysuntil":{let r=new Date;if(r.setHours(0,0,0,0),n.weekday){let p=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].indexOf(n.weekday.toLowerCase());return p<0?"":String((p-r.getDay()+7)%7)}let i=/^(\d{1,2})-(\d{1,2})$/.exec((n.date||$(this,G,Fe).call(this,t.children,a)).trim());if(!i)return"";let l=new Date(r.getFullYear(),Number(i[1])-1,Number(i[2]));return l<r&&l.setFullYear(r.getFullYear()+1),String(Math.round((l-r)/864e5))}case"fallback":{if(a.depth>20)return"";let r=a.sideEffects;r.fellBack||(r.fellBack=!0,this.fallbackStreak=(r.streakBefore||0)+1,this.vars.set("fallbackstreak",String(this.fallbackStreak)));let i=this.categories.find(p=>p.isCatchAll);if(!i)return"";let l={category:i,stars:[ot(a.input,!1)],thatStars:[],topicStars:[]};return $(this,G,io).call(this,l,a.input,a.depth+1,r)}case"think":return $(this,G,Fe).call(this,t.children,a),"";case"persona":{let r=this._personaSays.get(String(n.say||"").trim().toLowerCase());return r?(a.sideEffects&&(a.sideEffects.personaSaid=!0),$(this,G,kn).call(this,r,a)):$(this,G,Fe).call(this,t.children,a)}case"srai":{let r=$(this,G,Fe).call(this,t.children,a).trim();return r?$(this,G,Wn).call(this,r,a.depth+1,a.sideEffects):""}case"try":{let r=$(this,G,Fe).call(this,t.children,a).trim();if(!r||a.depth>20)return"";let i=this.resolve(r);return!i||i.kind==="fallback"?"":(a.sideEffects.answeredBy=i,$(this,G,io).call(this,i,r,a.depth+1,a.sideEffects))}case"sr":{let r=a.stars[0]||"";return r?$(this,G,Wn).call(this,r,a.depth+1,a.sideEffects):""}case"random":{let r=(t.children||[]).filter(p=>p.type==="element"&&p.tag==="li");if(!r.length)return"";let i=this._randomMemory.get(t);if(!i||!i.left.length){let p=r.map((h,c)=>c);for(let h=p.length-1;h>0;h--){let c=Math.floor(this.random()*(h+1));[p[h],p[c]]=[p[c],p[h]]}i&&p.length>1&&p[0]===i.last&&p.push(p.shift()),i={left:p,last:i?i.last:-1},this._randomMemory.set(t,i)}let l=i.left.shift();return i.last=l,$(this,G,Fe).call(this,r[l].children,a).trim()}case"condition":{let r=ko(n.name),i=(this.vars.get(r)||"").trim().toLowerCase(),l=(h,c)=>c.trim()==="*"?h!=="":h===c.trim().toLowerCase();if(n.value!==void 0)return l(i,n.value)?$(this,G,Fe).call(this,t.children,a):"";let p=(t.children||[]).filter(h=>h.type==="element"&&h.tag==="li");for(let h of p){let c=h.attrs.name!==void 0?ko(h.attrs.name):r,o=(this.vars.get(c)||"").trim().toLowerCase(),u=$(this,G,no).call(this,h,"value",a);if(u===void 0||l(o,u))return $(this,G,Fe).call(this,$(this,G,Yo).call(this,h,["value"]),a)}return""}case"uppercase":return $(this,G,Fe).call(this,t.children,a).toUpperCase();case"lowercase":return $(this,G,Fe).call(this,t.children,a).toLowerCase();case"formal":return $(this,G,Fe).call(this,t.children,a).replace(/\b\w/g,r=>r.toUpperCase());case"sentence":{let r=$(this,G,Fe).call(this,t.children,a).trim();return r?r[0].toUpperCase()+r.slice(1):""}case"person":case"person2":return ml($(this,G,Fe).call(this,t.children,a));case"date":{let r=new Date;if(n.offset&&r.setDate(r.getDate()+(parseInt(n.offset,10)||0)),!n.format)return r.toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric",year:"numeric"});let i=p=>String(p).padStart(2,"0"),l={A:r.toLocaleDateString("en-US",{weekday:"long"}),B:r.toLocaleDateString("en-US",{month:"long"}),d:String(r.getDate()),Y:String(r.getFullYear()),H:i(r.getHours()),I:String(r.getHours()%12||12),M:i(r.getMinutes()),p:r.getHours()<12?"AM":"PM"};return n.format.replace(/%([ABdYHIMp])/g,(p,h)=>l[h])}case"time":return new Date().toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});case"size":return String(this.categories.length);case"version":return"bot.computer AIML 2.0";case"input":{if(n.index===void 0)return a.input;if(!/^[1-9]\d*$/.test(n.index))return n.default??"";let r=Number(n.index),{inputs:i,inputIndex:l}=a.sideEffects;if(r<=l+1)return i[l+1-r];r-=l+1;for(let p=this.history.length-1;p>=0;p--){let h=tr(this.history[p].user);if(r<=h.length)return h[h.length-r];r-=h.length}return n.default??""}case"that":{if(n.index===void 0)return this.lastBotThat;let r=/^([1-9]\d*)(?:\s*,\s*([1-9]\d*))?$/.exec(n.index),i=r&&this.history[this.history.length-Number(r[1])]?.bot;if(!i)return n.default??"";let l=er(i);return l[l.length-Number(r[2]||1)]??n.default??""}case"request":{let r=Math.max(1,parseInt(n.index||"1",10));return this.history[this.history.length-r]?.user??n.default??""}case"response":{let r=Math.max(1,parseInt(n.index||"1",10));return this.history[this.history.length-r]?.bot??n.default??""}case"br":return`
`;case"showcase":return!a.sideEffects.showcase&&!a.sideEffects.tour&&Ba(n.target)&&(a.sideEffects.showcase=n.target),"";case"tour":{if(a.sideEffects.showcase||a.sideEffects.tour)return"";let r=gn(t);if(r.length){let i=a.sideEffects.tour=[];for(let l of r){let p=$(this,G,Fe).call(this,l.children,a).replace(/\s+/g," ").trim();i.push({target:l.attrs.target,text:p})}}return""}case"stop":return"";case"emote":case"gesture":{let r=$(this,G,Fe).call(this,t.children,a).trim().toLowerCase(),i=r==="happy"?"smile":Sn(r);return i?` [${i}] `:""}case"reply":case"button":case"chip":case"suggest":{let r="",i="",l=(t.children||[]).find(h=>h.type==="element"&&h.tag==="text"),p=(t.children||[]).find(h=>h.type==="element"&&h.tag==="postback");return l?(r=$(this,G,Fe).call(this,l.children,a).trim(),i=p?$(this,G,Fe).call(this,p.children,a).trim():r):(r=$(this,G,Fe).call(this,t.children,a).trim(),i=n.postback||r),r&&a.sideEffects.chips.push({label:r,query:i}),""}case"oob":case"chips":return $(this,G,Fe).call(this,t.children,a),"";default:return $(this,G,Fe).call(this,t.children,a)}};var Hr=[{key:"about",label:"What you do",placeholder:"We roast coffee by hand and deliver it across the country.",long:!0},{key:"hours",label:"Opening hours",placeholder:"Monday to Friday, 9am to 5pm"},{key:"email",label:"Email",placeholder:"hello@example.com"},{key:"phone",label:"Phone",placeholder:"+61 400 123 456"},{key:"address",label:"Address",placeholder:"12 King Street, Sydney"},{key:"pricing",label:"Pricing",placeholder:"Plans start at nine dollars a month, with a free trial.",long:!0}];var Kl=`
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
`;var Dn=Fl();function Fl(){return`<?xml version="1.0" encoding="UTF-8"?>
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
  ${Kl}
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
`}var lo=new Set;function Nr(e){if(e.key!=="Escape"||e.defaultPrevented||e.isComposing||e.target.closest?.(".bot-computer-widget-host, dialog, [role=dialog], [popover], [aria-expanded=true], input, select, textarea, [contenteditable=true]"))return;let t=Array.from(lo).pop();t&&(t(),e.preventDefault())}function Wr(e,t){return{left:Math.max(e.left,t.left),top:Math.max(e.top,t.top),right:Math.min(e.right,t.right),bottom:Math.min(e.bottom,t.bottom)}}function Vl(){let e=window.visualViewport,t=e?.offsetLeft||0,a=e?.offsetTop||0;return{left:t,top:a,right:t+(e?.width||document.documentElement.clientWidth),bottom:a+(e?.height||document.documentElement.clientHeight)}}function wr(e){let t=[];for(let a=e.parentElement;a&&a!==document.body;a=a.parentElement){let s=getComputedStyle(a),n=s.overflowX!=="visible",r=s.overflowY!=="visible";(n||r)&&t.push({node:a,x:n,y:r})}return t}function Mr(e,t,a){let s=Wr(e,t);for(let{node:n,x:r,y:i}of a){let l=n.getBoundingClientRect();r&&(s.left=Math.max(s.left,l.left),s.right=Math.min(s.right,l.right)),i&&(s.top=Math.max(s.top,l.top),s.bottom=Math.min(s.bottom,l.bottom))}return s}function Rr(e,t){if(!Ba(t))return null;for(let a of["data-bot-showcase","id"])for(let s of e.querySelectorAll(`[${a}="${t}"]`))if(!s.closest(".bot-computer-widget-host, [inert], [aria-hidden=true]")&&getComputedStyle(s).visibility==="visible"){let n=s.getBoundingClientRect();if(n.width>0&&n.height>0)return s}return null}function $t(e,t,a){return Math.max(t,Math.min(e,a))}function zl(e,t,a,s){let n=(e.left+e.right)/2,r=(e.top+e.bottom)/2,i=12,l=[[e.right+i,r-s/2],[e.left-i-a,r-s/2],[n-a/2,e.bottom+i],[n-a/2,e.top-i-s]],p;for(let[h,c]of l){let o=$t(h,t.left+6,t.right-a-6),u=$t(c,t.top+6,t.bottom-s-6),d=Math.max(0,Math.min(o+a,e.right)-Math.max(o,e.left))*Math.max(0,Math.min(u+s,e.bottom)-Math.max(u,e.top)),m=Math.abs(h-o)+Math.abs(c-u);(!p||d<p.overlap||d===p.overlap&&m<p.shift)&&(p={x:o,y:u,overlap:d,shift:m})}return p}function kr({root:e,stage:t,host:a,parent:s,position:n,anim:r,onModeChange:i,onReturn:l,onTourDepart:p,onTourStop:h,onTourEnd:c}){let o=n==="contained",u=o?s:document,d=document.createElement("div");d.className="bc-guide-layer"+(o?" is-contained":""),d.hidden=!0,d.setAttribute("aria-hidden","true");let m=document.createElement("div");m.className="bc-guide-ring",d.append(m);let g=a.shadowRoot;g.append(d);let f=e.querySelector(".bc-guide-back"),E=e.querySelector(".bc-guide-answer"),T=e.querySelector(".bc-guide-label"),b=e.querySelector(".bc-tour-progress"),N=e.querySelector(".bc-tour-prev"),k=e.querySelector(".bc-tour-next"),_=e.querySelector(".bc-tour-finish"),V={nx:0,ny:0,active:!0},J=t.parentElement,ue=window.matchMedia("(prefers-reduced-motion: reduce)"),L=null,U="",v=[],R=null,D=!1,K=0,Q=null,oe="",w=null,Y=null,j=[];function ae(){let x=Vl();return o?Wr(x,s.getBoundingClientRect()):x}function z(x=!1){w&&(Ae(),w.observer.disconnect(),window.removeEventListener("resize",te),w=null,Ne(),r.tourPointing=!1,e.classList.remove("is-touring","avatar-on-right"),c()),L&&(L=null,U="",lo.delete(z),lo.size||document.removeEventListener("keydown",Nr),r.guideDirection=null,R&&(R.replaceWith(a),R=null),e.classList.remove("is-guiding"),i(),e.style.removeProperty("--bc-guide-x"),e.style.removeProperty("--bc-guide-y"),e.style.removeProperty("--bc-guide-width"),d.hidden=!0,x&&l())}f.onclick=()=>z(!0),_.onclick=()=>z(!0),N.onclick=()=>ve(-1),k.onclick=()=>ve(1),e.addEventListener("keydown",x=>{L&&x.key==="Escape"&&(x.preventDefault(),z(!0))});function te(){w&&(w.dirty=!0)}function de(){let x=[];w.stops.forEach((B,ne)=>{let he=Rr(u,B.target);he&&x.push({index:ne,element:he})}),w.entries=x,w.dirty=!1}function Te(){let x=w.entries.findIndex(he=>he.index===w.index),B=`Stop ${x+1} of ${w.entries.length}`;b.textContent!==B&&(b.textContent=B);let ne=g.activeElement;N.disabled=x<=0,k.disabled=x+1>=w.entries.length,(ne===k&&k.disabled||ne===N&&N.disabled)&&(k.disabled?_:k).focus({preventScroll:!0})}function Ne(){Y=null,r.guideTravel=null,e.classList.remove("is-travelling"),t.tabIndex=0,t.removeAttribute("aria-disabled"),t.style.removeProperty("--bc-walk-x"),t.style.removeProperty("--bc-walk-y")}function Ae(){for(let x of j)x.scrollTo({left:x.scrollLeft,top:x.scrollTop,behavior:"instant"});j=[]}function Oe(x=!0){let B=w.stops[w.index],ne=!w.visited.has(w.index);w.visited.add(w.index),T.textContent=(x?"Showing ":"About ")+Y.name,Ne(),j=[],r.tourPointing=x,h(B,ne)}function ce(x,B=t.getBoundingClientRect()){let ne=w.stops[x.index],he=performance.now(),ee=r.guideTravel?.facing??r.guideDirection?.x??0;return p(),Y={x:B.left+B.width/2,y:B.bottom,started:he,last:he,speed:0,settledSince:he,name:""},r.guideTravel={phase:"walk",elapsed:0,facing:ee,stride:0,point:0},r.guideDirection=null,r.tourPointing=!1,e.classList.add("is-travelling"),t.tabIndex=-1,t.setAttribute("aria-disabled","true"),w.index=x.index,Te(),W(x.element,ne.target,ne.displayText),ne}function ve(x){if(!w)return;de();let B=w.entries.filter(he=>x*(he.index-w.index)>0),ne=x>0?B[0]:B.at(-1);ne?ce(ne):Re()}function Re(){w.dirty&&de();let x=w.entries.find(B=>B.index===w.index);if(x)Te(),L!==x.element&&W(x.element,U,E.textContent);else{let B=w.entries.find(ne=>ne.index>w.index)||w.entries.at(-1);B?ce(B):z(e.contains(g.activeElement))}}function ie(x,B=t.getBoundingClientRect()){if((L||w)&&z(),!x?.length)return null;let ne=new MutationObserver(te);return w={stops:x,entries:[],visited:new Set,observer:ne,index:-1,dirty:!0},de(),w.entries.length?(ne.observe(u,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["data-bot-showcase","id","class","style","hidden","aria-hidden","inert","open"]}),window.addEventListener("resize",te),e.classList.add("is-touring"),ce(w.entries[0],B)):(w=null,null)}function Z(x,B,ne,he){let ee=Y,q=r.guideTravel,me=performance.now(),Ee=Math.min(.08,Math.max(0,me-ee.last)/1e3);ee.last=me,q.elapsed=(me-ee.started)/1e3;let ke=J.getBoundingClientRect(),He=Le=>$t(Le,x.left+ke.width/2,x.right-ke.width/2),Ge=Le=>$t(Le,x.top+ke.height,x.bottom),De=ke.left+ke.width/2,Pe=ke.bottom;if(ee.x=He(ee.x),ee.y=Ge(ee.y),ue.matches&&he){Oe();return}if(q.phase==="walk"){let Le=De,Ze=Pe;if(!he){let X=L.getBoundingClientRect();Le=He(X.left+X.width/2),Ze=Ge(X.top+X.height/2)}(ee.goalX===void 0||Math.hypot(Le-ee.goalX,Ze-ee.goalY)>1.5)&&(ee.settledSince=me,ee.goalX=Le,ee.goalY=Ze);let je=Le-ee.x,we=Ze-ee.y,We=Math.hypot(je,we);ee.speed=Math.max(ee.speed,$t(We/.78,230,1600));let Xe=Math.min(We,Ee*ee.speed);We>1&&(ee.x+=je/We*Xe,ee.y+=we/We*Xe,Math.abs(je)>2&&(q.facing+=(je/We-q.facing)*Math.min(1,Ee*12))),q.stride=Math.min(1,q.elapsed/.12,We/18),he&&We-Xe<=1&&(me-ee.settledSince>=90||q.elapsed>2)&&(ee.x=De,ee.y=Pe,ee.turnStart=me,ee.turnFrom=q.facing,q.phase="turn")}if(q.phase==="turn"){let Le=$t((me-ee.turnStart)/300,0,1),Ze=Le*Le*(3-2*Le);if(q.stride=0,q.point=Ze,q.facing=ee.turnFrom+(V.nx-ee.turnFrom)*Ze,ee.x=De,ee.y=Pe,Le>=1&&he){Oe();return}}t.style.setProperty("--bc-walk-x",((ee.x-De)*B).toFixed(2)+"px"),t.style.setProperty("--bc-walk-y",((ee.y-Pe)*ne).toFixed(2)+"px")}function fe(){if(w?.dirty&&Re(),!L)return null;let x=L.getBoundingClientRect();if(!L.isConnected||!x.width||!x.height||getComputedStyle(L).visibility!=="visible"||L.closest("[inert], [aria-hidden=true]")||L.getAttribute("data-bot-showcase")!==U&&L.id!==U||o&&!s.contains(L))return w?(de(),Re()):ge(U,E.textContent),null;Q!==L.parentElement&&(Q=L.parentElement,v=wr(L));let B=ae(),ne=d.getBoundingClientRect(),he=ne.width?d.clientWidth/ne.width:1,ee=ne.height?d.clientHeight/ne.height:1,q=Mr(x,B,v),me=q.right>q.left&&q.bottom>q.top;if(!me&&!w&&(D||performance.now()-K>2e3))return z(g.activeElement===f),null;if(m.hidden=!me,!me){if(w&&B.right>B.left&&B.bottom>B.top){let we=e.getBoundingClientRect(),We=$t(we.left,B.left+6,B.right-we.width-6),Xe=$t(we.top,B.top+6,B.bottom-we.height-6);e.style.setProperty("--bc-guide-width",Math.max(1,B.right-B.left-12)*he+"px"),Math.abs(We-we.left)>1&&e.style.setProperty("--bc-guide-x",(We-ne.left)*he+"px"),Math.abs(Xe-we.top)>1&&e.style.setProperty("--bc-guide-y",(Xe-ne.top)*ee+"px"),oe=""}return r.guideDirection=null,r.tourPointing=!1,Y&&(ue.matches||performance.now()-K>2e3?Oe(!1):B.right>B.left&&B.bottom>B.top&&Z(B,he,ee,!1)),null}D=!0;let Ee=we=>Math.round(we*10)/10+"px",ke=e.getBoundingClientRect(),{x:He,y:Ge}=zl(q,B,ke.width,ke.height),De=[q.left,q.top,q.right,q.bottom,ne.left,ne.top,he,ee,He,Ge,B.left,B.right].join("/");De!==oe&&(oe=De,m.style.left=Ee((q.left-ne.left)*he),m.style.top=Ee((q.top-ne.top)*ee),m.style.width=Ee((q.right-q.left)*he),m.style.height=Ee((q.bottom-q.top)*ee),e.style.setProperty("--bc-guide-width",Ee(Math.max(1,B.right-B.left-12)*he)),e.style.setProperty("--bc-guide-x",Ee((He-ne.left)*he)),e.style.setProperty("--bc-guide-y",Ee((Ge-ne.top)*ee)),w&&e.classList.toggle("avatar-on-right",He+ke.width<=q.left));let Pe=(w?J:t).getBoundingClientRect(),Le=(q.left+q.right)/2-(Pe.left+Pe.width/2),Ze=(q.top+q.bottom)/2-(Pe.top+Pe.height/2),je=Math.hypot(Le,Ze)||1;return V.nx=Le/je,V.ny=Ze/je,Y&&Z(B,he,ee,!0),r.guideTravel?.phase==="walk"?(r.guideDirection=null,null):(w&&!Y&&(r.tourPointing=!0),r.guideDirection??(r.guideDirection={x:0,y:0}),r.guideDirection.x=V.nx,r.guideDirection.y=V.ny,V)}function ge(x,B){w&&z();let ne=Rr(u,x);return ne?(W(ne,x,B),!0):(z(g.activeElement===f),!1)}function W(x,B,ne){Ae();let he=t.getBoundingClientRect(),ee=g.activeElement!=null,q=L&&w;!L&&n==="inline"&&(R=document.createElement("div"),R.style.height=e.getBoundingClientRect().height+"px",a.before(R),document.body.append(a)),L=x,U=B,Q=L.parentElement,oe="",lo.delete(z),lo.add(z),document.addEventListener("keydown",Nr),D=!1,K=performance.now(),v=wr(L);let me=(L.getAttribute("aria-label")||L.querySelector("h1,h2,h3,h4,h5,h6")?.textContent||L.matches("button,a,label,summary,h1,h2,h3,h4,h5,h6")&&L.textContent||U).trim();Y&&(Y.name=me),T.textContent=(Y?"Walking to ":"Showing ")+me,E.textContent=ne,E.scrollTop=0,d.hidden=!1,m.hidden=!0,m.style.borderRadius=getComputedStyle(L).borderRadius;let Ee=ae(),ke=d.getBoundingClientRect();e.style.setProperty("--bc-guide-width",Math.max(1,Ee.right-Ee.left-12)+"px"),q||(e.style.setProperty("--bc-guide-x",$t(he.left,Ee.left+6,Ee.right-260)-ke.left+"px"),e.style.setProperty("--bc-guide-y",$t(he.top,Ee.top+6,Ee.bottom-110)-ke.top+"px")),e.classList.remove("is-minimized"),e.classList.add("is-guiding"),i(),ee&&!q&&(w?k.disabled?_:k:f).focus({preventScroll:!0});let He=L.getBoundingClientRect(),Ge=Mr(He,Ee,v);if(Ge.left>He.left||Ge.top>He.top||Ge.right<He.right||Ge.bottom<He.bottom){let De=ue.matches?"instant":"smooth";if(o)for(let{node:Pe,x:Le,y:Ze}of v){if(Pe!==s&&!s.contains(Pe))break;let je=Pe.getBoundingClientRect(),we=L.getBoundingClientRect(),We=Le&&(we.left<je.left||we.right>je.right)?we.left-je.left:0,Xe=Ze&&(we.top<je.top||we.bottom>je.bottom)?we.top-je.top:0;(We||Xe)&&(w&&De==="smooth"&&j.push(Pe),Pe.scrollBy({left:We,top:Xe,behavior:De}))}else w&&De==="smooth"&&(j=v.map(Pe=>Pe.node),document.scrollingElement&&j.push(document.scrollingElement)),L.scrollIntoView({block:He.height>(Ee.bottom-Ee.top)*.7?"start":"center",inline:"nearest",behavior:De})}fe()}return{start:ge,startTour:ie,end:z,refresh:fe,get currentStop(){return w?.stops[w.index]}}}var ql=`
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
`,kt={look:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 1 9-9c0 2.5-1.5 4-4 4h-2a1.5 1.5 0 0 0-1.3 2.3l.4.6C15 20.2 13.7 21 12 21Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="15" cy="8" r=".8"/></svg>',play:'<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 4.8v14.4a.6.6 0 0 0 .92.5l11.3-7.2a.6.6 0 0 0 0-1L8.42 4.3a.6.6 0 0 0-.92.5z"/></svg>',stop:'<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.2"/></svg>',chat:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',volume:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/></svg>',muted:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>',minus:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',close:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',send:'<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>'},Lr={compact:{w:136,h:166,orb:126},standard:{w:172,h:210,orb:158},large:{w:216,h:262,orb:196}},jl=/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[a-z]{2,}[^\s<>"']*|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d ().-]{6,}\d)/gi;function $l(e,t){let a=0;for(let s of t.matchAll(jl)){let n=s[0].replace(/[.,!?;:)]+$/,""),r="";if(/^https?:\/\//i.test(n))r=n;else if(/^www\./i.test(n))r=`https://${n}`;else if(n.includes("@"))r=`mailto:${n}`;else{let l=n.replace(/\D/g,"");(n.startsWith("+")||l.length>=9)&&(r=`tel:${n.replace(/[^\d+]/g,"")}`)}if(!r)continue;e.append(t.slice(a,s.index));let i=document.createElement("a");i.href=r,i.textContent=n,r.startsWith("http")&&(i.target="_blank",i.rel="noopener noreferrer"),e.append(i),a=s.index+n.length}e.append(t.slice(a))}async function vr(e={},t={}){let a={name:"Aria",role:"Website Companion",company:"bot.computer",website:typeof location<"u"?location.origin:"https://bot.computer",greeting:"Hi! Welcome to our website! Ask me anything below.",position:"bottom-right",size:"standard",autoGreet:!1,eyeTracking:!0,showCaptions:!0,chatEnabled:!0,speechEnabled:!0,chatStartOpen:!1,allowVisitorCustomization:!1,baseBrain:!0,facts:{},rememberChat:!0,persona:null,wasmUrl:"./tts.wasm",aimlUrl:"",aimlXml:"",voice:{gender:"female",pitchHz:192,speed:1.05,expressiveness:1.06},avatar:{...fo},...e};a.speechEnabled=!1,a.avatar={...fo,...e.avatar||{}},a.persona=Ca(a.persona),a.persona&&e.greeting===void 0&&(a.greeting=js(a.persona,a));let s=()=>a.persona?a.persona.mood:"",n=document.createElement("div");n.className="bot-computer-widget-host";let r=document.body;if((a.position==="inline"||a.position==="contained")&&a.container){let M=typeof a.container=="string"?document.querySelector(a.container):a.container;M&&(r=M)}r.appendChild(n);let i=n.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=ql,i.appendChild(l);let p=Lr[a.size]||Lr.standard,h=a.position==="bottom-left"?"pos-bottom-left":a.position==="inline"?"pos-inline":a.position==="contained"?`pos-contained ${a.align==="left"?"pos-bottom-left":""}`:"pos-bottom-right",c=document.createElement("div");c.className=`bc-root ${h}`,c.style.setProperty("--bc-w",`${p.w}px`),c.style.setProperty("--bc-h",`${p.h}px`),c.style.setProperty("--bc-orb",`${p.orb}px`),c.innerHTML=`
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
          <button type="button" class="bc-chat-close" title="Close chat" aria-label="Close chat">${kt.close}</button>
        </header>
        <div class="bc-messages" role="log" aria-live="polite"></div>
        <div class="bc-chips"></div>
        <form class="bc-form">
          <input type="text" class="bc-input" placeholder="Ask a question\u2026" autocomplete="off" aria-label="Your question" />
          <button type="submit" class="bc-send" title="Send" aria-label="Send">${kt.send}</button>
        </form>
      </section>

      <section id="bc-look" class="bc-chat bc-customizer" aria-label="Customize avatar" hidden>
        <header class="bc-chat-head">
          <div class="bc-chat-title"><strong>Customize avatar</strong><span>Only your view changes</span></div>
          <button type="button" class="bc-chat-close bc-look-close" aria-label="Close customizer">${kt.close}</button>
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
          <button type="button" class="bc-btn bc-speak-btn" title="Speak the greeting">${kt.play}<span>Speak</span></button>
          <button type="button" class="bc-btn accent bc-ask-btn" title="Ask a question">${kt.chat}<span>Ask</span></button>
          <button type="button" class="bc-btn bc-look-toggle" aria-label="Customize avatar" title="Customize avatar" aria-controls="bc-look" aria-expanded="false" hidden>${kt.look}<span>Customize</span></button>
          <button type="button" class="bc-btn bc-mute-btn" title="Mute" aria-label="Mute" aria-pressed="false">${kt.volume}</button>
          <button type="button" class="bc-btn bc-min-btn" title="Minimize" aria-label="Minimize">${kt.minus}</button>
        </div>
      </div>
    </div>
  `,i.appendChild(c);let o=c.querySelector("canvas"),u=c.querySelector(".bc-model"),d=null,m=c.querySelector(".bc-stage-card"),g=c.querySelector(".bc-caption"),f=c.querySelector(".bc-unmute-prompt"),E=c.querySelector(".bc-chat"),T=c.querySelector(".bc-head-name"),b=c.querySelector(".bc-head-status"),N=c.querySelector(".bc-messages"),k=c.querySelector(".bc-chips"),_=c.querySelector(".bc-form"),V=c.querySelector(".bc-input"),J=c.querySelector(".bc-speak-btn"),ue=c.querySelector(".bc-ask-btn"),L=c.querySelector(".bc-mute-btn"),U=c.querySelector(".bc-min-btn"),v=c.querySelector(".bc-chat-close"),R=c.querySelector(".bc-minimized-pill"),D=c.querySelector(".bc-pill-label"),K=c.querySelector(".bc-look-toggle"),Q=c.querySelector(".bc-customizer"),oe=null,w=dn(a),Y=a.avatar;function j(M,re=!1){Q.hidden=!M,Q.classList.toggle("open",M),c.classList.toggle("customizing",M),K.setAttribute("aria-expanded",String(M)),M?Q.querySelector("select")?.focus({preventScroll:!0}):re&&K.focus({preventScroll:!0})}function ae(){let M=a.allowVisitorCustomization===!0;!M&&(Q.contains(i.activeElement)||i.activeElement===K)&&(a.chatEnabled?ue:m).focus({preventScroll:!0}),K.hidden=!M,M?oe?oe.setOwnerAvatar(a.avatar):oe=Ks({panel:Q,ownerAvatar:a.avatar,storageKey:t.preview?null:w,onChange:re=>{Y=re}}):(j(!1),Y=a.avatar)}function z(){return a.allowVisitorCustomization!==!0||De?!1:(he.end(),c.classList.remove("is-minimized"),j(!0),!0)}K.onclick=()=>{Q.hidden?z():j(!1,!0)};for(let M of Q.querySelectorAll(".bc-look-close, .bc-look-done"))M.onclick=()=>j(!1,!0);Q.addEventListener("keydown",M=>{M.key==="Escape"&&(M.preventDefault(),j(!1,!0))}),ae();let te="Ready",de=M=>{J.innerHTML=`${M?kt.stop:kt.play}<span>${M?"Stop":a.speechEnabled?"Speak":"Greet"}</span>`};function Te(){let M=String(a.name||"Companion");T.textContent=a.role?`${M} \xB7 ${a.role}`:M,D.textContent=M,R.title=`Open ${M}`,E.setAttribute("aria-label",`Chat with ${M}`);let re=c.classList.contains("is-guiding");m.title=re?"Replay this answer":a.speechEnabled?`Click to hear ${M}`:`Show the greeting from ${M}`,m.setAttribute("aria-label",m.title)}let Ne=()=>{let M=a.avatar.stageShape==="circle"&&a.avatar.framing!=="cutout";m.classList.toggle("shape-circle",M)};Te(),Ne(),a.speechEnabled||(L.style.display="none",J.title="Show the greeting",de(!1)),a.chatEnabled?a.chatStartOpen&&(E.classList.add("open"),c.classList.add("chat-is-open")):ue.style.display="none";let Ae=()=>{let M=a.facts&&typeof a.facts=="object"?a.facts:{},re={name:a.name,role:a.role,company:a.company,website:a.website};for(let{key:be}of Hr)re[be]=String(M[be]??"").trim();return re},Oe=new Bo({botProps:Ae(),baseXml:a.baseBrain!==!1?Dn:"",persona:a.persona}),ce=()=>Oe.quickChips.map(M=>({label:M,query:M}));async function ve(){let M=a.aimlXml||"";if(!M&&a.aimlUrl)try{let re=await fetch(a.aimlUrl);re.ok&&(M=await re.text())}catch(re){console.warn("[bot.computer] Could not fetch AIML XML:",re)}if(M)try{Oe.loadXML(M)}catch(re){console.warn("[bot.computer] Invalid AIML XML:",re)}x(ce())}let Re=[];function ie(M,re){let be=document.createElement("div");return be.className=`bc-msg ${M}`,M==="bot"?$l(be,String(re)):be.textContent=re,N.appendChild(be),N.scrollTop=N.scrollHeight,Re.push({role:M,text:String(re)}),be}let Z=a.rememberChat!==!1&&a.position!=="contained"&&!t.preview,fe=`bot-computer:chat:${String(a.sessionId||a.name||"bot").toLowerCase()}`;function ge(){if(Z)try{sessionStorage.setItem(fe,JSON.stringify({v:1,transcript:Re.slice(-40),engine:Oe.exportSession(),open:E.classList.contains("open")}))}catch{}}function W(){if(!Z)return!1;try{let M=JSON.parse(sessionStorage.getItem(fe)||"null");if(!M||M.v!==1||!Array.isArray(M.transcript)||!M.transcript.length)return!1;for(let re of M.transcript)re&&(re.role==="bot"||re.role==="user")&&typeof re.text=="string"&&ie(re.role,re.text);return Oe.importSession(M.engine),M.open&&a.chatEnabled&&(E.classList.add("open"),c.classList.add("chat-is-open")),!0}catch{return!1}}function x(M){k.replaceChildren();for(let re of(M||[]).slice(0,5)){let be=typeof re=="string"?re:re.label,Ye=typeof re=="string"?re:re.query||re.label,Me=document.createElement("button");Me.type="button",Me.className="bc-chip",Me.textContent=be,Me.onclick=()=>ma(Ye,be),k.appendChild(Me)}}let B=os();Aa(B,s());let ne={nx:0,ny:0,active:!1},he=kr({root:c,stage:m,host:n,parent:r,position:a.position,anim:B,onModeChange:Te,onReturn:()=>(E.classList.contains("open")?V:m).focus({preventScroll:!0}),onTourDepart:()=>{X(),Oa(B,"rest"),ba()},onTourStop:(M,re)=>{re&&(ie("bot",Yn(M)||`[Show ${M.target}]`),ge()),Kt(M)},onTourEnd:()=>{X(),Oa(B,"rest")}}),ee=null,q=null,me=null,Ee=null,ke=0,He=!1,Ge=!1,De=!1,Pe=0,Le=0,Ze=0,je=null,we=null,We=0,Xe=M=>{if(!a.eyeTracking||De)return;let re=o.getBoundingClientRect();if(!re.width||!re.height)return;let be=re.left+re.width*.5,Ye=re.top+re.height*.42;ne.nx=Math.max(-1,Math.min(1,(M.clientX-be)/Math.max(180,window.innerWidth*.35))),ne.ny=Math.max(-1,Math.min(1,(M.clientY-Ye)/Math.max(160,window.innerHeight*.35))),ne.active=!0};window.addEventListener("pointermove",Xe,{passive:!0});function X(){if(Ze++,me){me.onended=null;try{me.stop()}catch{}me=null}He=!1,Ee=null,pt="",we=null,We=0,Aa(B,s()),de(!1),ee&&(b.textContent=te)}let pt="",St=[],st=null;function _t(M,re){if(!a.showCaptions||!M||!M.words||!M.words.length)return;if(E.classList.contains("open")){g.classList.remove("visible");return}if(st!==M){st=M,pt="";let Qe=String(M.text||"").split(/\s+/).filter(Boolean);St=(Qe.length===M.words.length?Qe:M.words.map(Be=>Be.word)).map(vn)}let be=0,Ye=-1;for(let Qe=0;Qe<M.words.length&&re>=M.words[Qe].start;Qe++)be=Qe,re<M.words[Qe].end&&(Ye=Qe);let Me=`${be}:${Ye}`;Me!==pt&&(pt=Me,g.classList.add("visible"),clearTimeout(Le),g.replaceChildren(),St.forEach((Qe,Be)=>{let dt=document.createElement(Be===Ye?"mark":"span");Be!==Ye&&(Be<be||Be===be&&Ye===-1)&&(dt.className="said"),dt.textContent=Qe,g.append(dt," ")}))}let ye;function ua(){return Promise.resolve(null)}function ba(){let M=globalThis.AudioContext||globalThis.webkitAudioContext}async function Lt(M,{emote:re="",defaultEmote:be="",cues:Ye=null,cueWords:Me=0}={}){X();let Qe=Ze,Be=Ye?{speechText:String(M),cues:Ye,wordCount:Me}:Un(M),dt=Be.cues.some(Xt=>Xt.type==="action"),ra=re||(dt?"":be);ra&&Oa(B,ra);let $e=()=>{we=is(Be.cues),We=performance.now()},tt=!!jt(Be.speechText)||Be.cues.some(Xt=>Xt.sound);tt&&ba();let Ea=null;if(De||Qe!==Ze)return;if(!Ea||Ge){$e(),!a.speechEnabled&&a.showCaptions&&tt&&(g.textContent=jt(Be.speechText),g.classList.add("visible"),clearTimeout(Le),Le=setTimeout(()=>g.classList.remove("visible"),Math.max(3500,Math.min(15e3,Be.wordCount*350))));return}if(!q){$e();return}if(q.state==="suspended")try{await q.resume()}catch{}if(De||Qe!==Ze)return;if(q.state==="suspended"){f.hidden=!1,$e();return}f.hidden=!0;let Tt=/\[[a-zA-Z_/]/.test(Be.speechText)?Ea.speakScript(Be.speechText):Ea.speak(Be.speechText);if(!Tt||!Tt.samples||!Tt.samples.length){$e();return}let Ka=q.createBuffer(1,Tt.samples.length,Tt.sampleRate);Ka.copyToChannel(Tt.samples,0),me=q.createBufferSource(),me.buffer=Ka,me.connect(q.destination),Ee=Tt,we=rs(Tt,Be.cues,Be.wordCount),We=0,ke=q.currentTime+.015,He=!0,de(!0),b.textContent="Speaking",me.start(ke),me.onended=()=>{go(B,we,1/0),we=null,Aa(B,s()),He=!1,Ee=null,pt="",de(!1),b.textContent=te,Le=setTimeout(()=>g.classList.remove("visible"),1600)}}async function ma(M,re){let be=String(M||"").trim();if(!be)return;let Ye=m.getBoundingClientRect();Q.hidden||j(!1),E.classList.contains("open")||(E.classList.add("open"),c.classList.add("chat-is-open"),g.classList.remove("visible")),ie("user",re||be);let Me=Oe.reply(be);je=Me;let Qe=Me.tour?.length?he.startTour(Me.tour,Ye):null;Qe||(ie("bot",Yn(Me)),he.start(Me.showcase,Me.displayText||"")),x(Me.chips&&Me.chips.length?Me.chips:ce()),ge(),Qe||await Kt(Me)}async function Kt(M){X(),he.currentStop&&Oa(B,"rest");let re=Ze;ba(),await new Promise(be=>{requestAnimationFrame(()=>setTimeout(be,0)),setTimeout(be,80)}),!(De||re!==Ze)&&await Lt(M.speechText,{cues:M.cues,cueWords:M.cueWords})}let Ha=()=>{if(!B.guideTravel)if(He)X();else if(c.classList.contains("is-guiding")&&je){let M=he.currentStop||je;Lt(M.speechText,{cues:M.cues,cueWords:M.cueWords})}else Lt(a.greeting,{defaultEmote:"wave"})};m.onclick=Ha,m.onkeydown=M=>{(M.key==="Enter"||M.key===" ")&&(M.preventDefault(),Ha())},J.onclick=Ha;let Na=()=>{E.classList.remove("open"),c.classList.remove("chat-is-open"),ge()};ue.onclick=()=>{let M=!Q.hidden;M&&j(!1);let re=M||!E.classList.contains("open");E.classList.toggle("open",re),c.classList.toggle("chat-is-open",re),re&&(g.classList.remove("visible"),N.children.length||ie("bot",jt(a.greeting)),V.focus({preventScroll:!0})),ge()},v.onclick=Na,E.addEventListener("keydown",M=>{M.key==="Escape"&&(Na(),ue.focus())}),L.onclick=()=>{Ge=!Ge,L.innerHTML=Ge?kt.muted:kt.volume,L.title=Ge?"Unmute":"Mute",L.setAttribute("aria-label",L.title),L.setAttribute("aria-pressed",String(Ge)),Ge&&X()},U.onclick=()=>{X(),Q.hidden||j(!1),c.classList.add("is-minimized"),R.focus({preventScroll:!0})},R.onclick=()=>{c.classList.remove("is-minimized"),U.focus({preventScroll:!0})},_.onsubmit=M=>{M.preventDefault();let re=V.value.trim();re&&(V.value="",fa=0,ma(re))};let fa=0,ga={nx:0,ny:0,active:!0};V.addEventListener("input",()=>{let M=m.getBoundingClientRect(),re=V.getBoundingClientRect();if(!M.width||!re.width)return;let be=re.left+re.width/2-(M.left+M.width/2),Ye=re.top+re.height/2-(M.top+M.height*.42),Me=Math.hypot(be,Ye)||1;ga.nx=be/Me*.8,ga.ny=Ye/Me*.8,fa=performance.now()+1500});let bt=null;if(["inline","contained"].includes(a.position)&&typeof ResizeObserver=="function"){let M=()=>{c.classList.toggle("is-narrow-host",r.clientWidth<=640),a.position==="contained"&&c.style.setProperty("--bc-host-h",`${r.clientHeight}px`)};M(),bt=new ResizeObserver(M),bt.observe(r)}let wa=typeof IntersectionObserver!="function",ho=typeof IntersectionObserver=="function"?new IntersectionObserver(([M])=>{wa=M.isIntersecting}):null;ho?.observe(m);function Ve(M){if(!De){if(!document.hidden&&!c.classList.contains("is-minimized")){let re=he.refresh(),be=Math.min(window.devicePixelRatio||1,2),Ye=Math.max(120,Math.floor((m.clientWidth||p.w)*be)),Me=Math.max(120,Math.floor((m.clientHeight||p.h)*be));(o.width!==Ye||o.height!==Me)&&(o.width=Ye,o.height=Me);let Qe=null;if(He&&Ee&&q){let Be=Math.max(0,q.currentTime-ke);Qe=ls(Ee,Math.min(Be,Ee.duration),a.voice?.pitchHz||160),_t(Ee,Be),go(B,we,Be,M)}else we&&We&&(go(B,we,(performance.now()-We)/1e3,M),we.next>=we.items.length&&(we=null,We=0));if(cs(B,M,Qe,re||(performance.now()<fa?ga:a.eyeTracking?ne:null),a.voice?.pitchHz||160),wa||B.guideTravel){let Be=c.classList.contains("is-guiding"),dt=Be?{...Y,framing:"half",stageShape:"cutout",bgStyle:"transparent"}:Y,ra=B.guideTravel?.phase==="walk"?"full":dt.framing,$e={framing:ra,smoothFraming:Be,showVoiceWaves:!Be};a.renderMode==="2d"?(u.hidden=!0,Eo(o.getContext("2d"),Ye,Me,ra===dt.framing?dt:{...dt,framing:ra},B,M,$e)):($e.force=u.hidden,u.hidden=!1,d??(d=new wo(u,o,{orbitControls:!1,view:"front"})),d.render(dt,B,M,$e))}}Pe=requestAnimationFrame(Ve)}}return await ve(),W(),(globalThis.requestIdleCallback||(M=>setTimeout(M,250)))(()=>{De||Oe.warmUp()}),a.chatEnabled&&a.chatStartOpen&&!N.children.length&&ie("bot",jt(a.greeting)),Pe=requestAnimationFrame(Ve),a.autoGreet&&ua().then(()=>{!De&&!je&&!He&&Lt(a.greeting,{defaultEmote:"wave"})}),{hostEl:n,openCustomizer:z,say:(M,re="")=>Lt(M,{emote:re}),ask:M=>ma(M),stop:X,emote:(M,re)=>Oa(B,M,re),sound(M,re={}){let be=String(M||"").trim().toLowerCase().replace(/[^a-z-]/g,"");if(!be)return Promise.resolve();let Ye=be;return re.intensity!==void 0&&(Ye+=` intensity=${String(re.intensity).replace(/[^\w.]/g,"")}`),re.length!==void 0&&(Ye+=` length=${String(re.length).replace(/[^\w.]/g,"")}`),re.durationMs>0&&(Ye+=` for=${(Number(re.durationMs)/1e3).toFixed(2)}s`),Lt(`[${Ye}]`)},mood:M=>Aa(B,M),clearChat(){he.end(),X(),je=null,N.replaceChildren(),Re.length=0,Oe.resetSession(),x(ce());try{sessionStorage.removeItem(fe)}catch{}},updateConfig(M={}){let re=JSON.stringify(Ae()),be=["name","role","company"].some(Me=>M[Me]!==void 0&&M[Me]!==a[Me]);M.name!==void 0&&(a.name=M.name),M.role!==void 0&&(a.role=M.role),M.company!==void 0&&(a.company=M.company),M.facts!==void 0&&(a.facts={...M.facts||{}});let Ye=JSON.stringify(Ae())!==re;if(M.greeting!==void 0&&(a.greeting=M.greeting),M.renderMode!==void 0&&(a.renderMode=M.renderMode),M.eyeTracking!==void 0&&(a.eyeTracking=M.eyeTracking),M.showCaptions!==void 0&&(a.showCaptions=M.showCaptions),M.chatEnabled!==void 0&&(a.chatEnabled=M.chatEnabled,ue.style.display=a.chatEnabled?"":"none",a.chatEnabled||(he.end(),E.classList.remove("open"),c.classList.remove("chat-is-open"))),M.avatar&&(a.avatar={...a.avatar,...M.avatar},Ne()),M.allowVisitorCustomization!==void 0&&(a.allowVisitorCustomization=M.allowVisitorCustomization===!0),be&&!a.sessionId&&(w=dn(a),oe=null),(be||M.avatar||M.allowVisitorCustomization!==void 0)&&ae(),M.voice)if(ee)try{a.voice=ee.configure(M.voice)}catch{}else if(typeof M.voice=="string"||M.voice.preset)a.voice=M.voice;else{let Me=typeof a.voice=="string"?{preset:a.voice}:a.voice;a.voice={...Me,...M.voice}}if(M.persona!==void 0&&(a.persona=Ca(M.persona),Oe.setPersona(a.persona),Aa(B,s())),M.baseBrain!==void 0&&!!M.baseBrain!=(a.baseBrain!==!1)){a.baseBrain=!!M.baseBrain;try{Oe.loadBaseXML(a.baseBrain?Dn:"")}catch{}}if(Ye)try{Oe.setBotProps(Ae())}catch{}if(M.aimlXml!==void 0&&M.aimlXml!==a.aimlXml){he.end(),a.aimlXml=M.aimlXml;try{Oe.loadXML(a.aimlXml),x(ce())}catch{}}Te()},destroy(){if(De=!0,he.end(),cancelAnimationFrame(Pe),ho?.disconnect(),d?.dispose(),X(),window.removeEventListener("pointermove",Xe),bt&&bt.disconnect(),ee)try{ee.free()}catch{}n.remove()}}}var Yr="1.5.0";var _o=typeof document>"u"?null:document.currentScript,Pn=globalThis.__BOT_COMPUTER_AUTO_CONFIG__,Cr=globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;Pn&&delete globalThis.__BOT_COMPUTER_AUTO_CONFIG__;Cr&&delete globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;var co={version:Yr,mount(e={}){let t=e.wasmUrl||(_o?.src?new URL("../vendor/tts/tts.wasm",_o.src).href:"./tts.wasm");return vr({...e,wasmUrl:t},{bindTTSFn:null,embeddedWasmGzBase64:Cr})}},Dr=globalThis.BotComputer?.runtimes||Object.create(null);co.runtimes=Dr;Dr["bot-3d-silent-chat.js"]=co;globalThis.BotComputer||(globalThis.BotComputer=co);function Ur(){if(Pn)return co.mount(Pn);if(!_o)return;let e=_o.dataset;if(e.nomount==="true"||e.manual==="true"||!["config","name","aiml","wasm","autostart","customize","renderMode","speech","chat"].some(a=>e[a]!==void 0))return;let t={};if(e.config)try{t=JSON.parse(e.config)}catch(a){console.warn("[bot.computer] Invalid JSON in data-config:",a)}for(let a of["name","role","company","greeting","position","size","renderMode"])e[a]&&(t[a]=e[a]);return e.wasm&&(t.wasmUrl=e.wasm),e.aiml&&(t.aimlUrl=e.aiml),e.customize!==void 0&&(t.allowVisitorCustomization=e.customize==="true"),e.chat!==void 0&&(t.chatEnabled=e.chat!=="false"),e.speech!==void 0&&(t.speechEnabled=e.speech!=="false"),e.autogreet!==void 0&&(t.autoGreet=e.autogreet==="true"),co.mount(t)}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ur,{once:!0}):Ur());})();
