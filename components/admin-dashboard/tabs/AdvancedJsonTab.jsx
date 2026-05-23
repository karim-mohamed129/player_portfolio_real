"use client";

export default function AdvancedJsonTab({ content, jsonText, setJsonText, setContent, setStatus }) {
  return (
    <div className="grid gap-5">
      <h2 className="admin-title">Advanced JSON Editor</h2>
      <p className="text-white/60">من هنا تقدر تعدل أي جزء في الموقع حتى لو مش موجود في الفورم. لازم JSON صحيح.</p>
      <textarea className="min-h-[520px] w-full rounded-3xl border border-white/10 bg-black/40 p-5 font-mono text-sm text-green-100 outline-none focus:border-gold/60" value={jsonText} onChange={(event) => setJsonText(event.target.value)} dir="ltr" />
      <div className="flex flex-wrap gap-3">
        <button className="btn-muted" onClick={() => setJsonText(JSON.stringify(content, null, 2))}>استرجاع من الحالة الحالية</button>
        <button className="btn-red" onClick={() => {
          try {
            const parsed = JSON.parse(jsonText);
            setContent(parsed);
            setStatus("تم تطبيق JSON على الحالة الحالية. اضغط حفظ لتخزينه في MongoDB.");
          } catch (error) {
            setStatus(`JSON Error: ${error.message}`);
          }
        }}>تطبيق JSON</button>
      </div>
    </div>
  );
}
