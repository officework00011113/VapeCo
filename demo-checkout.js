/* Editable fictional checkout preview for Github Pages. Does not place orders. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('demo-checkout-form');
  if (!form) return;
  const date = $('demo-delivery-date');
  const today = new Date(); today.setDate(today.getDate() + 5);
  if (date) date.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const status = $('demo-email-status');
  const send = $('send-demo-email');
  const money = v => '$' + Number(v).toFixed(2);
  function normalized() {
    const d = Object.fromEntries(new FormData(form));
    const quantity = Math.max(1,Math.min(20,Math.floor(Number(d.quantity)||1)));
    const unit = Math.max(0,Math.min(999,Math.round(Number(d.unit_price||0)*100)/100));
    $('demo-quantity').value = String(quantity);
    $('demo-unit-price').value = unit.toFixed(2);
    return {...d, quantity, unit_price:unit.toFixed(2), total_usd:(unit*quantity).toFixed(2)};
  }
  function recalculate() {
    const info = normalized();
    $('demo-line-total').textContent = money(info.total_usd);
    $('demo-total').textContent = money(info.total_usd);
  }
  ['demo-quantity','demo-unit-price'].forEach(id => $(id)?.addEventListener('input', recalculate));
  recalculate();
  function emailContent(info) {
    return [
      'VAPECO / CLIENT SHOWCASE — DEMONSTRATION ONLY',
      'NOT A REAL ORDER · NO PAYMENT · NO DELIVERY REQUEST', '',
      `Sample name: ${info.name}`,`Sample email: ${info.email}`,`Sample phone: ${info.phone}`,
      `Example address: ${info.delivery_address}`,`Illustrative date: ${info.delivery_date}`,
      `Payment method: ${info.payment_method}`,'',
      `Example quantity: ${info.quantity}`,`Sample unit price: $${info.unit_price}`,
      `Sample total: $${info.total_usd}`,'',
      'Do not fulfill. This is a demonstration email, not an order.'
    ].join('\n');
  }
  function mailDraft(info) {
    const config = window.VAPECO_EMAIL_DEMO;
    const address = config?.recipient || 'officework00011113@gmail.com';
    const subject = config?.subjectCheckout || '[VapeCo] DEMO COD checkout preview — not an order';
    location.href = `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent(info))}`;
    status.dataset.kind='';
    status.textContent='Email draft requested. Open your mail application and click Send. No message has been sent by the website.';
  }
  $('open-demo-draft')?.addEventListener('click', () => {
    if (!form.checkValidity()) { form.reportValidity(); return; }
    mailDraft(normalized());
  });
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const info = normalized();
    if (location.protocol === 'file:') { mailDraft(info); return; }
    const config=window.VAPECO_EMAIL_DEMO;
    const endpoint=config?.ajaxEndpoint || 'https://formsubmit.co/ajax/officework00011113@gmail.com';
    send.disabled = true;
    status.dataset.kind=''; status.textContent='Submitting fictional test message…';
    try {
      const response=await fetch(endpoint,{
        method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          ...info,
          _subject: config?.subjectCheckout || '[VapeCo] DEMO COD checkout preview — not an order',
          _template:'table',
          message:emailContent(info),
          purpose:'DEMONSTRATION ONLY — NOT AN ORDER — DO NOT FULFILL'
        })
      });
      const result=await response.json().catch(()=>({}));
      if (!response.ok || result.success === false || result.success === 'false') throw new Error(result.message || 'Email service rejected the request.');
      status.dataset.kind='ok';
      status.textContent='Demo message accepted by the form email service. If this is your first submission, approve the recipient activation email in Gmail; inbox delivery is not guaranteed yet. No order was placed.';
    } catch(err) {
      status.dataset.kind='error';
      status.textContent=`Test email could not be submitted: ${err.message || 'network error'}. Use Open Sample Email Draft or check FormSubmit activation.`;
    } finally {send.disabled=false;}
  });
})();
