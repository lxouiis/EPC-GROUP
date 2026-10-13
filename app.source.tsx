import React,{useEffect,useRef,useState} from "react";
import {createRoot} from "react-dom/client";

type Co={code:string;name:string;sector:string;since:string};
const COS:Co[]=[
 {code:"EPC-01",name:"Northline Logistics",sector:"Freight and warehousing",since:"2009"},
 {code:"EPC-02",name:"Halden Energy",sector:"Solar and grid contracting",since:"2011"},
 {code:"EPC-03",name:"Meridian Software",sector:"Custom business software",since:"2014"},
 {code:"EPC-04",name:"Ostra Capital",sector:"Private lending",since:"2015"},
 {code:"EPC-05",name:"Kiln Manufacturing",sector:"Precision components",since:"2017"},
 {code:"EPC-06",name:"Tessel Health",sector:"Clinic operations",since:"2019"},
];
const Rays=({s=28}:{s?:number})=>(
 <svg className="rays" width={s} height={s} viewBox="0 0 28 28" aria-hidden="true">
  {[[2,15,10,15],[5,5,11,11],[14,1,14,9],[23,5,17,11],[5,25,11,19]].map((l,i)=>
   <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} pathLength={1}/>)}
 </svg>);
const useReveal=()=>{
 const r=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const els=r.current?.querySelectorAll(".rv,.rays")||[];
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
  const start=()=>els.forEach((el,i)=>{(el as HTMLElement).style.transitionDelay=reduce?"0s":`${Math.min(i%6,2)*40}ms`;io.observe(el)});
  if((window as any).__intro){addEventListener("epc:intro-done",start,{once:true});return()=>{removeEventListener("epc:intro-done",start);io.disconnect()}}
  start();
  return()=>io.disconnect();
 });
 return r;
};
const Ph=({w,h,label}:{w:number;h:number;label:string})=>
 <div className="ph mono rv" style={{minHeight:Math.min(h/3,320)}}>Image slot / {label} / replace with {w} x {h} px</div>;
const Sec=({cls,children}:{cls:"dark"|"light";children:React.ReactNode})=>
 <section className={cls}><div className="wrap">{children}</div></section>;
const Head=({k,t}:{k:string;t:string})=><><p className="mono c-meta rv"><span className="dot"/>{k}</p><h2 className="rv">{t}</h2></>;


type Partner={name:string;src?:string;w?:number;h?:number};
/* Replace with real partners. Put logo files in assets/partners/ and set src, e.g. src:"assets/partners/acme.svg" */
const PARTNERS:Partner[]=[1,2,3,4,5,6].map(n=>({name:`Partner ${String(n).padStart(2,"0")}`}));
const Partners=()=>{
 const [i,setI]=useState(0);const [paused,setPaused]=useState(false);const [vis,setVis]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
 useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>setVis(e.isIntersecting));io.observe(el);return()=>io.disconnect()},[]);
 useEffect(()=>{if(reduce||paused||!vis)return;const t=setInterval(()=>{if(!document.hidden)setI(n=>(n+1)%PARTNERS.length)},3500);return()=>clearInterval(t)},[paused,vis,reduce]);
 const view=Array.from({length:5},(_,k)=>PARTNERS[(i+k)%PARTNERS.length]);
 return <Sec cls="dark"><Head k="06 / Partners" t="Who we work alongside."/>
  <div ref={ref} className="rv" style={{gridColumn:"1/-1"}} onPointerEnter={()=>setPaused(true)} onPointerLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}>
   <ul className="pl" aria-label="Partner logos">
    {view.map((p,k)=><li key={i+"-"+k} className="pc" style={{"--i":k} as React.CSSProperties}>
     {p.src?<img src={p.src} alt={p.name+" logo"} width={p.w||160} height={p.h||56} loading="lazy"/>
      :<div className="plc"><span className="mono">Logo slot / {p.name}</span><span className="mono">Replace with 240 x 80 px</span></div>}
    </li>)}
   </ul>
   <div className="seg" role="group" aria-label="Partner sets">
    {PARTNERS.map((_,n)=><button key={n} type="button" aria-label={"Show partner set "+(n+1)} aria-current={n===i} onClick={()=>setI(n)}/>)}
   </div>
  </div>
 </Sec>;
};

const Count=({v}:{v:string})=>{
 const to=parseInt(v.replace(/,/g,""),10);const [n,setN]=useState(to);const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const el=ref.current;if(!el||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  let raf=0,started=false;
  const run=()=>{const t0=performance.now();const tick=(t:number)=>{const k=Math.min(1,(t-t0)/300);setN(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)};
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!started){started=true;io.disconnect();setN(0);run()}},{threshold:.6});
  const go=()=>io.observe(el);
  if((window as any).__intro)addEventListener("epc:intro-done",go,{once:true});else go();
  return()=>{cancelAnimationFrame(raf);io.disconnect();removeEventListener("epc:intro-done",go)};
 },[to]);
 return <span ref={ref}>{n.toLocaleString("en-US")}</span>;
};
const Cols=()=>{
 const r=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=r.current;if(!el)return;const io=new IntersectionObserver(([e])=>el.classList.toggle("on",e.isIntersecting));io.observe(el);return()=>io.disconnect()},[]);
 return <div className="cols" ref={r} aria-hidden="true"><i/><i/><i/><i/><i/></div>;
};
const Home=()=>{
 const r=useReveal();
 const vidRef=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const v=vidRef.current;if(!v)return;
  const p=()=>{if(document.hidden)v.pause();else v.play().catch(()=>{})};
  p();addEventListener("visibilitychange",p);addEventListener("blur",()=>v.pause());addEventListener("focus",p);
  return()=>{removeEventListener("visibilitychange",p);removeEventListener("blur",()=>v.pause());removeEventListener("focus",p)}
 },[]);
 return <div ref={r}>
 <section className="dark hero-video" style={{paddingTop:120,minHeight:"100dvh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}><video ref={vidRef} autoPlay muted loop playsInline className="hero-video-bg" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0}}><source src="assets/hero-bg.mp4" type="video/mp4"/></video><Cols/><div className="wrap" style={{position:"relative",zIndex:1}}>
  <p className="mono c-meta rv" style={{marginBottom:32}}><span className="dot"/>EPC Group / Holding company</p>
  <h1 className="doto rv">Six companies. One standard.</h1>
  <p className="c-body rv" style={{gridColumn:"7/12",marginTop:48}}>EPC Group owns and operates businesses in logistics, energy, software, lending, manufacturing and health. We keep each one independent and hold all of them to the same numbers.</p>
  <div className="c-body rv" style={{gridColumn:"7/12",marginTop:32}}><a className="btn" href="#/contact"><span className="dot" style={{margin:0}}/>Start a conversation</a></div>
 </div></section>
 <Sec cls="light"><Head k="01 / Proof" t="The numbers, stated plainly."/>
  {[["6","operating companies"],["1,240","employees"],["17","years in business"],["14","states served"]].map(([n,l],i)=>
   <div className="stat rv" key={l} style={{"--stat-delay":`${i*60}ms`} as React.CSSProperties}><div className="big"><Count v={n}/></div><p className="mono" style={{marginTop:12}}>{l}</p></div>)}
 </Sec>
 <Sec cls="dark"><Head k="02 / Problem" t="Growing a business splits your attention."/>
  <p className="c-body rv">Every new vendor, system and hire adds a decision. Owners end up running logistics in the morning and chasing software bugs at night. Most outside partners solve one piece and leave the rest to you.</p>
  <p className="c-body rv" style={{marginTop:16}}>EPC Group is built so one conversation can reach every function you depend on.</p>
 </Sec>
 <Sec cls="light"><Head k="03 / Process" t="Three steps to a working relationship."/>
  {[["01","Tell us what you run","A 20 minute call. We ask about your operations, not your pitch."],["02","We match one company to the problem","Each EPC company works independently. You deal with the one that fits."],["03","You get a written scope in 5 days","Price, timeline and who is responsible. No retainer to read it."]].map(([i,t,d],idx)=>
   <div className="row rv" key={i} style={{"--row-delay":`${idx*40}ms`} as React.CSSProperties}><span className="i mono">{i}</span><h3 className="n">{t}</h3><p className="s">{d}</p></div>)}
 </Sec>
 <Sec cls="dark"><Head k="04 / Services" t="What the group does."/>
  {COS.map((c,i)=><a className="row rv" href="#/businesses" key={c.code} style={{"--row-delay":`${i*35}ms`} as React.CSSProperties}><span className="i mono">0{i+1}</span><h3 className="n">{c.name}</h3><span className="s">{c.sector}</span><span className="t mono">{c.since}</span></a>)}
 </Sec>
 <Sec cls="light"><Head k="05 / Clients" t="What owners tell us."/>
  {[["Our freight costs dropped 11% in the first year and the invoices finally match the shipments.","Client Name, Owner, Company A"],["They shipped the first working version in six weeks and told us what they would not build.","Client Name, Founder, Company B"]].map(([q,a],idx)=>
   <div className="row rv" key={a} style={{"--row-delay":`${idx*50}ms`} as React.CSSProperties}><p className="n" style={{gridColumn:"1/8",color:"#000",fontSize:24,letterSpacing:"-.02em",lineHeight:1.2,maxWidth:"34ch"}}>{q}</p><span className="mono s">{a}</span></div>)}
 </Sec>
 <Partners/>
 <Sec cls="light"><Head k="07 / FAQ" t="Questions we get."/>
  {[["Do I have to work with more than one company?","No. Most clients start with one."],["What size of business do you work with?","Typically 10 to 500 employees. We say so on the first call if we are not a fit."],["Where is the group based?","Placeholder City, Country. Replace with the head office address."],["How is client information stored?","Contact details you submit are used only to reply to you."]].map(([q,a])=>
   <details key={q} className="rv"><summary>{q}</summary><p>{a}</p></details>)}
 </Sec>
 <section className="dark hasbg"><Cols/><div className="wrap"><h2 className="rv" style={{gridColumn:"1/-1"}}>Tell us what you run.</h2>
  <div className="c-body rv" style={{gridColumn:"1/6"}}><a className="btn" href="#/contact"><span className="dot" style={{margin:0}}/>Start a conversation</a></div>
 </div></section></div>;
};
const Page=({k,t,children}:{k:string;t:string;children?:React.ReactNode})=>{const r=useReveal();return <div ref={r}><Sec cls="dark"><Head k={k} t={t}/>{children}</Sec></div>};
const About=()=><Page k="About" t="A group, not a conglomerate."><p className="c-body rv">EPC Group was founded in 2009 by Placeholder Founder to run one freight company. Each business since has been added only when an existing client needed it and no one else did it well. We report every company on one set of numbers.</p><Ph w={1440} h={900} label="Head office exterior"/></Page>;
const Biz=()=><Page k="Businesses" t="Six companies."><>{COS.map((c,i)=><div className="row rv" key={c.code}><span className="i mono">{c.code}</span><h3 className="n">{c.name}</h3><span className="s">{c.sector}</span><span className="t mono">{c.since}</span></div>)}</></Page>;
const Lead=()=><Page k="Leadership" t="Who answers the phone.">{[["Placeholder Name","Founder and Chair"],["Placeholder Name","Chief Executive"],["Placeholder Name","Chief Financial Officer"]].map(([n,r])=><div className="row rv" key={r}><h3 className="n">{n}</h3><span className="s mono">{r}</span></div>)}<Ph w={800} h={1000} label="Leadership portrait"/></Page>;
const News=()=><Page k="News" t="Recent.">{[["12 Sep 2026","Halden Energy completes a 4 MW solar install"],["03 Aug 2026","Northline Logistics opens a second warehouse"],["19 Jun 2026","Meridian Software releases version 3"]].map(([d,t])=><div className="row rv" key={t}><span className="i mono" style={{gridColumn:"1/3"}}>{d}</span><h3 className="n" style={{gridColumn:"3/-1"}}>{t}</h3></div>)}</Page>;
const Careers=()=><Page k="Careers" t="Open roles.">{[["Operations Analyst","Northline Logistics","Full time"],["Frontend Engineer","Meridian Software","Full time"],["Site Supervisor","Halden Energy","Contract"]].map(([r,c,t])=><a className="row rv" href="#/contact" key={r}><h3 className="n">{r}</h3><span className="s">{c}</span><span className="t mono">{t}</span></a>)}</Page>;
const Contact=()=><Page k="Contact" t="Start a conversation.">
 <form name="contact" method="POST" action="/thank-you.html" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact"/>
  <p hidden><label>Leave empty<input name="bot-field"/></label></p>
  <label><span className="mono">Name</span><input name="name" required autoComplete="name"/></label>
  <label><span className="mono">Company</span><input name="company" autoComplete="organization"/></label>
  <label><span className="mono">Email</span><input type="email" name="email" required autoComplete="email"/></label>
  <label><span className="mono">Phone</span><input type="tel" name="phone" autoComplete="tel"/></label>
  <label className="full"><span className="mono">What do you run, and what do you need?</span><textarea name="message" rows={5} required/></label>
  <div style={{gridColumn:"1/-1"}}><button className="btn" type="submit"><span className="dot" style={{margin:0}}/>Send</button></div>
 </form></Page>;
const R:Record<string,[string,()=>React.ReactElement]>={"/":["Home",Home],"/about":["About",About],"/businesses":["Businesses",Biz],"/leadership":["Leadership",Lead],"/news":["News",News],"/careers":["Careers",Careers],"/contact":["Contact",Contact]};
const App=()=>{
 const [p,setP]=useState(location.hash.slice(1)||"/");
 useEffect(()=>{const f=()=>{setP(location.hash.slice(1)||"/");scrollTo(0,0)};addEventListener("hashchange",f);return()=>removeEventListener("hashchange",f)},[]);
 const sp=useRef<HTMLElement>(null);
 useEffect(()=>{let raf=0;const f=()=>{raf=0;const h=document.documentElement;const m=h.scrollHeight-h.clientHeight;if(sp.current)sp.current.style.transform=`scaleX(${m>0?Math.min(1,scrollY/m):0})`};const on=()=>{if(!raf)raf=requestAnimationFrame(f)};addEventListener("scroll",on,{passive:true});addEventListener("resize",on);on();return()=>{removeEventListener("scroll",on);removeEventListener("resize",on);cancelAnimationFrame(raf)}},[p]);
 const [name,Page_]=R[p]||R["/"];
 useEffect(()=>{document.title=p==="/"?"EPC Group | Holding company for logistics, energy, software and more":`${name} | EPC Group`},[p,name]);
 return <><header><div className="wrap"><a className="brand" href="#/"><Rays/>EPC GROUP</a>
  <i className="sp" ref={sp as any} aria-hidden="true"/><nav aria-label="Main">{Object.entries(R).map(([h,[n]])=><a key={h} href={"#"+h} aria-current={h===p?"page":undefined} className="mono">{n}</a>)}</nav></div></header>
  <main key={p}><Page_/></main>
  <footer className="dark"><div className="wrap"><span className="mono">EPC Group / Placeholder address</span><span className="mono">hello@example.com</span><span className="mono">2026 EPC Group / build 3</span></div></footer></>;
};
createRoot(document.getElementById("root")!).render(<App/>);
