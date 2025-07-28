/* -------------------------------------------------- */
/* 1 ▸ Colour map for a tiny square in the header     */
const popColors = {
  NA1:"#56B4E9",
  NA2:"#F0E442",
  NA3:"#009E73",
  Admixture:"#E69F00",
  Outgroups:"#CC79A7",
  Unknown:"#999999"
};

/* ----- pretty names and facet state ----- */
const popNames={NA1:"North American 1 (NA1)",NA2:"North American 2 (NA2)",NA3:"North American 3 (NA3)",Admixture:"Admixture",Outgroups:"Outgroups",Unknown:"Unknown"};
const facetState={pop:new Set(),country:new Set(),host:new Set(),chemotype:new Set()};

/* ----- count helper ----- */
const countsOf=rows=>{
  const z={pop:{},country:{},host:{},chemotype:{}};
  rows.forEach(r=>{["pop","country","host","chemotype"].forEach(k=>z[k][r[k]]=(z[k][r[k]]||0)+1);});
  return z;
};

/* ----- master filter ----- */
let q="";
function masterFilter(r){
  if(facetState.pop.size&&!facetState.pop.has(r.pop))return false;
  if(facetState.country.size&&!facetState.country.has(r.country))return false;
  if(facetState.host.size&&!facetState.host.has(r.host))return false;
  if(facetState.chemotype.size&&!facetState.chemotype.has(r.chemotype))return false;
  if(q&&!`${r.id} ${r.species} ${r.host} ${r.country} ${r.chemotype} ${r.pop}`.toLowerCase().includes(q))return false;
  updateStatus();
  return true;
}

/* ----- table ----- */
const table=new Tabulator("#strainGrid",{
  data,
  height:"75vh",
  layout:"fitDataStretch",
  selectableRows:true,         /* NEW name */
  groupBy:"pop",
  groupStartOpen: false,
  groupHeader:(value,count)=>{
    const swatch = `<span style="
        display:inline-block;
        width:12px;height:12px;margin-right:6px;
        border-radius:2px;
        background:${popColors[value]||"#ccc"};
      "></span>`;
    const label  = `<b>${popNames[value]||value}</b>`;
    const meta   = `<span style="color:#555;font-weight:normal;">— ${count} strain${count!==1?"s":""}</span>`;
    return swatch + label + "&nbsp;" + meta;
  },
  columns:[
    {formatter:"rowSelection",title:"",width:28,hozAlign:"center",headerSort:false,
      cellClick:(e,cell)=>cell.getRow().toggleSelect()},
    {title:"ID",field:"id",sorter:"number",width:90,headerFilter:"input"},
    {title:"Pop",field:"pop",width:110},
    {title:"Species",field:"species",width:190,headerFilter:"input"},
    {title:"Host",field:"host",width:150,headerFilter:"input"},
    {title:"Chemotype",field:"chemotype",width:110,headerFilter:"input"},
    {title:"Country",field:"country",width:140,headerFilter:"input"}
  ],
  rowSelectionChanged:updateStatus,
  dataFiltered:()=>{colourGroups();rebuildFacets();updateStatus();}
});

/* KICK OFF THE FIRST UPDATE +++ */
table.on("tableBuilt", () => {
  applyFilters();
  rebuildFacets();
  colourGroups();
  updateStatus();          // first paint
});

table.on("rowSelectionChanged", () => {
  updateStatus();          // first paint
});

table.on("renderComplete", () => {
  updateStatus();          // first paint
});

table.on("dataFiltered", () => {
  updateStatus();          // first paint
});

/* ----- colour group bars ----- */
function colourGroups(){
  document.querySelectorAll(".tabulator-group.tabulator-group-level-0").forEach(g=>{
    g.classList.add(`pop-${g.dataset.group}`);
  });
}

/* ----- facet builder ----- */
["pop","country","host","chemotype"].forEach(k=>{
  document.getElementById(`facet-${k}`).innerHTML=`<h3>${k[0].toUpperCase()+k.slice(1)}</h3><div id="facet-${k}-list"></div>`;
});
function facetBlock(key,obj,label=x=>x){
  const div=document.getElementById(`facet-${key}-list`);
  const sel=facetState[key];
  div.innerHTML=Object.entries(obj).sort().map(([v,n])=>`
    <label><input type="checkbox" data-facet="${key}" value="${encodeURIComponent(v)}" ${sel.has(v)?"checked":""}>
      <span>${label(v)}</span><span class="count">${n}</span></label>`).join("")||"<em style='color:#777'>None</em>";
}
function rebuildFacets(){
  const C=countsOf(table.getData("active"));
  facetBlock("pop",C.pop,v=>popNames[v]||v);
  facetBlock("country",C.country);
  facetBlock("host",C.host);
  facetBlock("chemotype",C.chemotype);
}

/* ----- reapply filters ----- */
function applyFilters(){table.clearFilter(true);table.setFilter(masterFilter);}

/* ----- UI events ----- */
document.getElementById("facets").addEventListener("change",e=>{
  if(e.target.matches("input[data-facet]")){
    const k=e.target.dataset.facet,v=decodeURIComponent(e.target.value);
    e.target.checked?facetState[k].add(v):facetState[k].delete(v);applyFilters();
  }
});
//document.getElementById("clearAllFacets").onclick=()=>{Object.values(facetState).forEach(s=>s.clear());applyFilters();};

document.getElementById("clearAllFacets").onclick = () => {
  // 1) Clear all of our saved facet selections
  Object.values(facetState).forEach(s => s.clear());

  //rebuildFacets();
  // 3) Reapply your table filter so the table and status line update
  applyFilters();
  // 2) Re-render the facet checkboxes (all will now be unchecked)
  rebuildFacets();
};

document.getElementById("globalSearch").oninput=e=>{q=e.target.value.trim().toLowerCase();applyFilters();};
document.getElementById("btnSelectAllVis").onclick=()=>table.selectRow(table.getRows("active"));
document.getElementById("btnClearSel").onclick=()=>table.deselectRow();

/* export helpers */
const esc=v=>v==null?"":/["\n,]/.test(v=String(v))?`"${v.replace(/"/g,'""')}"`:v;
const dl=(txt,name,type)=>{const b=new Blob([txt],{type});const a=document.createElement("a");
a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)};
document.getElementById("btnExportCSV").onclick=()=>{
  const sel=table.getSelectedData();if(!sel.length)return alert("No rows selected");
  const hdr=["id","pop","species","host","chemotype","country"];
  dl([hdr.join(",")].concat(sel.map(r=>hdr.map(h=>esc(r[h])).join(","))).join("\n"),
     "selected_strains.csv","text/csv");
};
document.getElementById("btnExportJSON").onclick=()=>{
  const sel=table.getSelectedData();if(!sel.length)return alert("No rows selected");
  dl(JSON.stringify(sel,null,2),"selected_strains.json","application/json");
};

/* --- reliable status update --- */
function updateStatus(){
  const vis = table.getRows("active").length;   // rows currently on screen
  const tot = table.getData().length;           // entire dataset
  const sel = table.getSelectedData().length;   // ticked rows
  document.getElementById("statusBar").textContent =
      `Visible: ${vis} / ${tot} | Selected: ${sel}`;
}


/* ---------- “select random X %” buttons ---------- */
document.getElementById("toolbar").addEventListener("click", e=>{
  if (!e.target.classList.contains("btnRand")) return;

  const frac = parseFloat(e.target.dataset.frac);   // 0.05, 0.10, …
  const visibleRows = table.getRows("active");
  const nPick = Math.max(1, Math.round(visibleRows.length * frac));

  table.deselectRow();                              // clear previous
  /* shuffle & pick first n rows */
  visibleRows
    .sort(()=>Math.random()-0.5)
    .slice(0, nPick)
    .forEach(r => r.select());

  updateStatus();                                   // refresh counts
});

/* ----- first run AFTER table is ready ----- */
table.on("tableBuilt",()=>{applyFilters();rebuildFacets();colourGroups();updateStatus();});
