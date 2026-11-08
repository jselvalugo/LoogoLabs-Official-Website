import React from 'react';
import { useLang } from '../../lib/i18n';
import { TOOL_BY_PAGE } from '../../lib/tools';
import { FaqList, MoreTools, ServiceBand, TipsSignup, ToolFrame, useMoney } from './shared';

const tool = TOOL_BY_PAGE.get('ToolMissedCall');
const WEEKS_PER_MONTH = 52 / 12;

/** Pure calculation, exported so it can be checked on its own. */
export function missedCallCost({ missedPerWeek, newShare, closeRate, jobValue }) {
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : 0));
  const missed = clamp(missedPerWeek, 0, 10000) * WEEKS_PER_MONTH;
  const newCalls = missed * clamp(newShare, 0, 100) / 100;
  const jobs = newCalls * clamp(closeRate, 0, 100) / 100;
  const month = jobs * clamp(jobValue, 0, 10000000);
  return { missed, newCalls, jobs, month, year: month * 12 };
}

const num = (v) => (v === '' ? NaN : Number(v));

function Field({ id, label, hint, value, onChange, prefix, suffix, step = 1, max }) {
  const input = (
    <input id={id} className="tl-input" type="number" inputMode="decimal" min="0" max={max} step={step}
      value={value} onChange={(e) => onChange(e.target.value)} />
  );
  return (
    <div className="tl-field">
      <label htmlFor={id}>{label}</label>
      {prefix ? <div className="tl-prefix"><span>{prefix}</span>{input}</div>
        : suffix ? <div className="tl-suffix">{input}<span>{suffix}</span></div> : input}
      {hint && <p className="tl-hint">{hint}</p>}
    </div>
  );
}

function Explainer({ es }) {
  if (es) {
    return (
      <section className="tl-section tl-prose">
        <h2 className="tl-h2">Cómo leer el resultado</h2>
        <p>Esta calculadora estima el dinero que se va cuando un cliente nuevo llama, nadie contesta y termina contratando a otro negocio. No cuenta a los clientes actuales, que normalmente vuelven a llamar, así que el número es conservador.</p>
        <h3>La fórmula</h3>
        <p>Llamadas perdidas por semana × 4.33 semanas = llamadas perdidas al mes. De esas, la parte que son clientes nuevos, por tu tasa de cierre, da los trabajos que se perdieron. Esos trabajos por tu valor promedio dan el dinero perdido al mes, y por 12, al año.</p>
        <h3>Ejemplo</h3>
        <p>Una empresa de aire acondicionado pierde 8 llamadas a la semana, unas 35 al mes. Si 6 de cada 10 son clientes nuevos y cierra 4 de cada 10 cuando sí contesta, son unos 8 trabajos perdidos al mes. Con un trabajo promedio de $450, son unos $3,700 al mes, o más de $44,000 al año.</p>
        <h3>Qué hacer con el número</h3>
        <ul>
          <li>Cuenta tus llamadas perdidas reales durante una semana normal. La mayoría de los dueños se quedan cortos.</li>
          <li>Configura un mensaje de texto automático para cada llamada perdida. Muchos clientes contestan un texto aunque no dejen mensaje de voz.</li>
          <li>Si pierdes llamadas fuera de horario o en horas pico, un agente de voz con IA puede contestar todas al mismo tiempo, agendar el trabajo y pasar las urgentes a tu equipo.</li>
        </ul>
      </section>
    );
  }
  return (
    <section className="tl-section tl-prose">
      <h2 className="tl-h2">How to read the result</h2>
      <p>This calculator estimates the revenue that walks away when a new customer calls, nobody answers, and they hire someone else. It leaves out existing customers, who usually call back, so the number is on the conservative side.</p>
      <h3>The formula</h3>
      <p>Missed calls per week × 4.33 weeks = missed calls per month. The share of those that are new customers, times your close rate, gives the jobs you lost. Those jobs times your average job value give the revenue lost per month, and times 12, per year.</p>
      <h3>Example</h3>
      <p>An HVAC company misses 8 calls a week, about 35 a month. If 6 in 10 are new customers and it books 4 in 10 when it does answer, that is about 8 lost jobs a month. At a $450 average job, that is roughly $3,700 a month, or more than $44,000 a year.</p>
      <h3>What to do with the number</h3>
      <ul>
        <li>Count your real missed calls for one normal week. Most owners guess low.</li>
        <li>Set up an automatic text-back for every missed call. Many callers will answer a text even if they won’t leave a voicemail.</li>
        <li>If you miss calls after hours or at peak times, an AI voice agent can answer them all at once, book the job and hand urgent calls to your team.</li>
      </ul>
    </section>
  );
}

function MissedCallTool() {
  const es = useLang() === 'es';
  const money = useMoney();
  const [missed, setMissed] = React.useState('10');
  const [share, setShare] = React.useState('60');
  const [close, setClose] = React.useState('40');
  const [value, setValue] = React.useState('400');
  const r = missedCallCost({ missedPerWeek: num(missed), newShare: num(share), closeRate: num(close), jobValue: num(value) });
  const one = (n) => (n < 10 ? n.toFixed(1) : Math.round(n).toLocaleString(es ? 'es-US' : 'en-US'));

  return (
    <ToolFrame tool={tool}
      title={es ? <>¿Cuánto te cuestan <em>las llamadas perdidas?</em></> : <>How much do <em>missed calls cost you?</em></>}
      lede={es
        ? 'Ingresa cuántas llamadas pierdes, qué parte son clientes nuevos, cuántos cierras y cuánto vale un trabajo promedio. El cálculo se hace al instante en tu navegador.'
        : 'Enter how many calls you miss, how many are new customers, how many you close and what an average job is worth. The math runs instantly in your browser.'}>
      <div className="tl-panel tl-grid">
        <div>
          <Field id="mc-missed" label={es ? 'Llamadas perdidas por semana' : 'Missed calls per week'} value={missed} onChange={setMissed} max="10000"
            hint={es ? 'Sin contestar o que fueron al buzón de voz.' : 'Unanswered or sent to voicemail.'} />
          <div className="tl-row2">
            <Field id="mc-share" label={es ? 'Clientes nuevos' : 'New customers'} suffix="%" value={share} onChange={setShare} max="100" />
            <Field id="mc-close" label={es ? 'Tasa de cierre' : 'Close rate'} suffix="%" value={close} onChange={setClose} max="100" />
          </div>
          <Field id="mc-value" label={es ? 'Valor promedio por trabajo' : 'Average job value'} prefix="$" value={value} onChange={setValue} step="10"
            hint={es ? 'Lo que factura un trabajo típico, no la ganancia.' : 'What a typical job bills, not profit.'} />
        </div>
        <div className="tl-out" aria-live="polite">
          <div className="tl-stats">
            <div className="tl-stat tl-stat--hero">
              <p className="tl-stat__label">{es ? 'Dinero perdido al año' : 'Revenue lost per year'}</p>
              <p className="tl-stat__value">{money.format(r.year)}</p>
              <p className="tl-stat__note">{es ? `${money.format(r.month)} al mes` : `${money.format(r.month)} per month`}</p>
            </div>
            <div className="tl-stat">
              <p className="tl-stat__label">{es ? 'Llamadas perdidas al mes' : 'Missed calls per month'}</p>
              <p className="tl-stat__value">{one(r.missed)}</p>
            </div>
            <div className="tl-stat">
              <p className="tl-stat__label">{es ? 'Trabajos perdidos al mes' : 'Jobs lost per month'}</p>
              <p className="tl-stat__value">{one(r.jobs)}</p>
            </div>
          </div>
          <p className="tl-math">{es
            ? `Si contestaras solo la mitad de esas llamadas, recuperarías unos ${money.format(r.year / 2)} al año.`
            : `Answering just half of those calls would win back about ${money.format(r.year / 2)} a year.`}</p>
        </div>
      </div>

      <Explainer es={es} />
      <FaqList items={es ? tool.faqEs : tool.faq} heading={es ? 'Preguntas frecuentes' : 'Questions'} />
      <ServiceBand
        title={es ? 'Contesta cada llamada, a cualquier hora.' : 'Answer every call, at any hour.'}
        text={es
          ? 'Un agente de voz con IA contesta en menos de un segundo, en inglés o español, agenda el trabajo en tu calendario y pasa las urgentes a tu equipo.'
          : 'An AI voice agent answers in under a second, in English or Spanish, books the job into your calendar and hands urgent calls to your team.'}
        servicePage={tool.service}
        serviceLabel={es ? 'Ver agentes de voz con IA' : 'See AI voice agents'}
      />
      <TipsSignup tool={tool} />
      <MoreTools current={tool.page} />
    </ToolFrame>
  );
}

export default MissedCallTool;
