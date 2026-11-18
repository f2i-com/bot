import { mixColor } from "./geometry.js";

const PI = Math.PI;
const mix = (a,b,t) => a+(b-a)*t;
const clamp = t => Math.max(0, Math.min(1,t));
const smooth = t => { t=clamp(t); return t*t*(3-2*t); };

// A shoe last runs from heel (v=0) to toe (v=1). Both the sole and the
// curved upper sit on its perimeter, including the sharply pointed pump toe.
function patch(p, side, across, along, point, color) {
  const vertices=[],faces=[];
  for(let j=0;j<=along;j++) {
    for(let i=0;i<=across;i++) {
      vertices.push(point(i/across,j/along));
      if(j && i) {
        const d=j*(across+1)+i,b=d-across-1,a=b-1,c=d-1;
        if(side>0) faces.push([a,c,b],[b,c,d]); else faces.push([a,b,c],[b,d,c]);
      }
    }
  }
  p.mesh(vertices,faces,color);
}
const path=(n,point)=>Array.from({length:n+1},(_,i)=>point(i/n));

export function drawTailoredShoe(p, style, dyes, skin, side, footX, floor, scale, shape) {
  const high=style==="court_high_tops", pump=style==="slingback_pumps";
  const oxford=style==="brogue_oxfords";
  if(!high && !pump && !oxford) return false;
  const {shoeColor:leather,shoeTrim:trim,shoeSole:sole}=dyes;
  const shadow=mixColor(leather,"#2e2331",.36);
  const welt=mixColor(sole,trim,.42);
  const width=high?.188:pump?.164:.18, length=high?.70:pump?.73:.65;
  const rear=high?-.187:-.167, toe=rear+length;
  const heel=pump?.245:oxford?.063:0, thickness=high?.091:pump?.028:.047;
  const point=(x,h,z)=>[side*(footX+x+.08*z),floor+scale*h,z];
  const arch=v=>heel*(1-smooth((v-.16)/.48));
  const zAt=v=>mix(rear,toe,v);
  const radius=v=>{
    const cap=Math.max(.007,Math.sin(PI*clamp(v)))**(pump?.66:.42);
    const instep=1-.12*Math.exp(-(((v-.43)/.14)**2))+.15*Math.exp(-(((v-.72)/.17)**2));
    return width*cap*instep*(pump?1-.64*smooth((v-.63)/.37):1);
  };
  const base=(u,v,h,out=0)=>point(u*(radius(v)+out),arch(v)+h,zAt(v));
  const height=v=>(.068+.094*(1-v)+.105*Math.exp(-(((v-.41)/.22)**2))) *
    (.25+.75*Math.max(0,Math.sin(PI*v))**.24);
  const shell=(u,v,lift=0)=>point((1+lift)*u*radius(v),arch(v)+thickness+.029+
    height(v)*Math.sqrt(Math.max(0,1-u*u))+.54*lift,zAt(v));
  const outline=(t,h,out=0)=>{
    const angle=2*PI*t;
    return base(Math.sign(Math.sin(angle)),(1+Math.cos(angle))/2,h,out);
  };
  patch(p,side,64,2,(t,l)=>outline(t,mix(.009,thickness,l),.004*Math.sin(PI*l)),sole);
  patch(p,-side,12,36,(t,v)=>base(2*t-1,v,.009),sole);
  p.tube(path(72,t=>outline(t,thickness-.006,.003)),high?.009:.006,welt,{sides:7});
  const heelZ=rear+.065;
  if(heel) {
    // A stacked block and a tapered pin have different ground footprints.
    const rx=pump?.029:.107, rz=pump?.034:.085;
    const heelRing=(a,t)=>point((rx+t*(pump?.038:.009))*Math.sin(a),mix(.009,heel+thickness,t),
      heelZ+t*(pump?.026:0)+(rz+.014*t)*Math.cos(a));
    patch(p,side,30,5,(u,t)=>heelRing(2*PI*u,t),sole);
    patch(p,-side,28,1,(u,t)=>point(rx*t*Math.sin(2*PI*u),.009,heelZ+rz*t*Math.cos(2*PI*u)),sole);
    if(oxford) p.tube(path(32,t=>heelRing(2*PI*t,.45)),.006,welt,{sides:6});
  }
  // Seal the sidewall under the upper. Its curve remains continuous beneath
  // the open instep of the slingback and along the welt of the oxford.
  patch(p,side,64,2,(t,h)=>outline(t,thickness+.03*h),pump?trim:leather);
  if (pump && !skin) patch(p,side,20,32,(t,v)=>base((2*t-1)*.99,v,thickness+.031),mixColor(leather,trim,.35));
  else patch(p,side,28,42,(t,v)=>shell(2*t-1,v),pump?skin:leather);
  const lace=(v0,v1,u0,u1,color,weight)=>p.tube(path(14,t=>shell(mix(u0,u1,t),mix(v0,v1,t),.014+.006*Math.sin(PI*t))),weight,color,{sides:7});
  const bead=(u,v,sz,color)=>p.ellipsoid(shell(u,v,.014),[sz,.55*sz,sz],color,{sides:9,rings:5});

  if(pump) {
    const cut=u=>.605-.34*Math.abs(u)**2;
    patch(p,side,30,25,(t,s)=>{
      const u=2*t-1;
      return shell(u,mix(cut(u),1,s),.012);
    },leather);
    p.tube(path(38,t=>{const u=2*t-1;return shell(u,cut(u),.015);}),.009,trim,{sides:7});
    // Sling around the heel, with a buckle on the outside of each shoe.
    const sling=(a,offset=0)=>point(.137*Math.sin(a),heel+.145+.037*Math.cos(a)+offset,.010-.159*Math.cos(a));
    patch(p,side,40,2,(u,v)=>sling(mix(-2.16,2.16,u),.027*v),leather);
    const buckle=sling(1.59,.014);
    p.ellipsoid(buckle,[.014,.028,.029],trim,{sides:10,rings:8});
    for(const flank of [-1,1]) {
      patch(p,side,8,14,(u,v)=>{
        const breadth=Math.sin(PI*v)**.65;
        return shell(flank*(.045+.65*v),.69+.038*v+(u-.5)*.145*breadth,.044+.044*breadth);
      },trim);
    }
    p.ellipsoid(shell(0,.695,.064),[.032,.027,.023],trim,{sides:14,rings:7});
    return true;
  }

  if(high) {
    // High quarters rise around the actual ankle so the leg and cuff meet
    // for every calf width; the front tongue sits behind the lacing.
    const cuffH=.58;
    const shaft=(t,h,extra=0)=>{
      const a=2*PI*t, front=(1+Math.cos(a))*.5;
      const y=mix(.175,cuffH-.06*front,h), leg=shape(3.58-y);
      const rx=mix(.157,leg.rx+.033,h),rz=mix(.185,leg.rz+.033,h);
      return point(leg.x-footX+(rx+extra)*Math.sin(a),y,leg.z+.018*(1-h)+(rz+extra)*Math.cos(a));
    };
    patch(p,side,48,12,(u,v)=>shaft(u,v),leather);
    patch(p,side,48,4,(u,v)=>shaft(u,mix(.73,.96,v),.006),mixColor(leather,trim,.30));
    p.tube(path(54,t=>shaft(t,1,.005)),.019,trim,{sides:9});
    patch(p,side,25,15,(u,v)=>shell(2*u-1,mix(.77-.043*(2*u-1)**2,1,v),.012),trim);
    for (const flank of [-1,1]) {
      patch(p,side,22,3,(t,v)=>{
        const pos=mix(.21,.73,t),u=mix(.90,.65+.15*Math.cos(t*PI),v);
        return shell(flank*u,pos,.020);
      },mixColor(trim,leather,.26));
    }
    const tongue=(u,t)=>point(u*.065,.22+.315*t,.238-.105*t);
    patch(p,side,9,13,(u,v)=>tongue(2*u-1,v),shadow);
    for(let i=0;i<4;i++) {
      const a=.06+.22*i;
      for(const f of [-1,1]) p.tube(path(9,t=>{
        const pt=tongue(f*mix(-1,1,t),a+.17*t);
        pt[2]+=.012+.013*Math.sin(PI*t);return pt;
      }),.01,trim,{sides:7});
    }
  } else {
    // Perforated wingtip overlay: the centre point and swept sides share the
    // same curved lead edge as the stitching and punched brogue holes.
    const wing=u=>.62+.12*Math.exp(-((u/.28)**2))-.19*Math.abs(u)**2;
    patch(p,side,30,22,(t,v)=>{const u=2*t-1;return shell(u,mix(wing(u),1,v),.012);},mixColor(leather,trim,.24));
    p.tube(path(30,t=>{const u=2*t-1;return shell(u,wing(u),.023);}),.005,shadow,{sides:6});
    for(let i=0;i<17;i++) { const u=mix(-.92,.92,i/16); bead(u,wing(u)+.027,.0085,shadow); }
    for(const flank of [-1,1]) {
      patch(p,side,6,18,(t,v)=>shell(flank*mix(.25,.9,t),mix(.16,.57-.07*t,v),.013),leather);
      for(const v of [.33,.40,.47]) {
        bead(flank*.31,v,.014,shadow);
        lace(v,v+.033,flank*.29,-flank*.29,trim,.008);
      }
    }
    for(const [u,v] of [[0,.85],[-.18,.82],[.18,.82],[-.34,.8],[.34,.8]]) bead(u,v,.009,shadow);
  }
  return true;
}
