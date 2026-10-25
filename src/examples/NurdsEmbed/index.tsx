import React, { useEffect, useMemo, useState } from "react";
import { Button, Layout, Message, Spin } from "@arco-design/web-react";
import { Check, Save } from "lucide-react";
import { EmailEditorProvider, type EmailTemplate } from "easy-email-pro-editor";
import { Retro, useEditorContext } from "easy-email-pro-theme";
import { EditorCore } from "easy-email-pro-core";
import mjml from "mjml-browser";
import "easy-email-pro-theme/lib/style.css";
import "@arco-themes/react-easy-email-pro/css/arco.css";

import { EditorHeader } from "../../components/EditorHeader";
import { useUpload } from "../../hooks/useUpload";
import { categories } from "../Simple";

type TemplateRecord = { id:number; name:string; subject:string; preheader:string; folder:string; tags:string[]; editor_engine:string; editor_engine_version:string; document:Record<string,unknown>; compiled_html:string; compiled_text:string; thumbnail_url:string|null; revision:number; };
const apiOrigin=String(process.env.NURDS_API_ORIGIN||"https://api.sandbox.nurds.com").replace(/\/$/,"");

function readSession(){const params=new URLSearchParams(location.hash.slice(1));const token=params.get("session")||"";if(token)history.replaceState(null,"",location.pathname+location.search);try{const payload=JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));return {token,templateId:Number(payload.template_id||0)};}catch{return {token,templateId:0};}}
function parentOrigin(){try{const origin=new URL(document.referrer).origin;return /^https:\/\/([a-z0-9-]+\.)*nurds\.(dev|com)$/i.test(origin)?origin:"*";}catch{return "*";}}
async function templateRequest<T>(path:string,token:string,init?:RequestInit):Promise<T>{const response=await fetch(`${apiOrigin}${path}`,{...init,headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`,...init?.headers}});if(!response.ok){const problem=await response.json().catch(()=>({}));throw new Error(problem.detail||"The template could not be loaded.");}return response.json();}
function SaveButton(){const {submit,dirty}=useEditorContext();return <Button type="primary" icon={dirty?<Save size={15}/>:<Check size={15}/>} disabled={!dirty} onClick={()=>submit()}>{dirty?"Save":"Saved"}</Button>;}

function Editor({record,token,onSaved}:{record:TemplateRecord;token:string;onSaved:(value:TemplateRecord)=>void}){
  const {upload}=useUpload();
  const initialValues=useMemo<EmailTemplate>(()=>{const document=record.document as Partial<EmailTemplate>;return {subject:document.subject||record.subject||"",content:document.content as EmailTemplate["content"]};},[record.id]);
  const save=async(values:EmailTemplate)=>{const mjmlSource=EditorCore.toMJML({element:values.content,mode:"production",beautify:true});const html=mjml(mjmlSource).html;const plain=new DOMParser().parseFromString(html,"text/html").body.textContent?.replace(/\s+/g," ").trim()||"";const subject=(values.subject||"").trim();const payload={name:record.name==="Untitled template"&&subject?subject:record.name,subject,preheader:record.preheader,folder:record.folder,tags:record.tags,editor_engine:"easy-email-pro",editor_engine_version:"1.59.8",document:values,compiled_html:html,compiled_text:plain,thumbnail_url:record.thumbnail_url,expected_revision:record.revision};try{const response=await templateRequest<{data:TemplateRecord}>(`/api/v1/email-templates/editor/${record.id}`,token,{method:"PATCH",body:JSON.stringify(payload)});onSaved(response.data);Message.success("Template saved");}catch(error){Message.error(error instanceof Error?error.message:"Template save failed");throw error;}};
  const config=Retro.useCreateConfig({clientId:process.env.CLIENT_ID!,height:"calc(100vh - 66px)",onUpload:upload,initialValues,onSubmit:save,categories,showSourceCode:true,showLayer:true,showPreview:true,showSidebar:true,compact:false,showDragMoveIcon:true,showInsertTips:true,enabledAutoComplete:true});
  return <EmailEditorProvider {...config}><EditorHeader minimal hideImport onBack={()=>window.parent.postMessage({type:"nurds:email-template:close"},parentOrigin())} extra={<SaveButton/>}/><Layout.Content><Retro.Layout/></Layout.Content></EmailEditorProvider>;
}

const statusStyle:React.CSSProperties={minHeight:"100vh",display:"grid",placeContent:"center",justifyItems:"center",gap:8,background:"#f6f8fb",color:"#1b2435",fontFamily:"Inter, system-ui, sans-serif"};
export default function NurdsEmbed(){const [{token,templateId}]=useState(readSession);const [record,setRecord]=useState<TemplateRecord|null>(null),[error,setError]=useState("");useEffect(()=>{if(!token||!templateId){setError("This editor session is invalid.");return;}void templateRequest<{data:TemplateRecord}>(`/api/v1/email-templates/editor/${templateId}`,token).then(response=>setRecord(response.data)).catch(reason=>setError(reason instanceof Error?reason.message:"The editor could not load."));},[token,templateId]);const saved=(value:TemplateRecord)=>{setRecord(value);window.parent.postMessage({type:"nurds:email-template:saved",template:value},parentOrigin());};if(error)return <main style={statusStyle}><h1>Editor unavailable</h1><p>{error}</p></main>;if(!record)return <main style={statusStyle}><Spin dot/><p>Loading editor…</p></main>;return <Editor key={`${record.id}:${record.revision}`} record={record} token={token} onSaved={saved}/>;}
