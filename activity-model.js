const dayMs=86400000;
const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
const dateMs=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(value+'T00:00:00.000Z').toISOString().slice(0,10)===value?Date.parse(value+'T00:00:00.000Z'):NaN;
const id=value=>Number.isSafeInteger(value)&&value>0;
function attemptTime(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value))return NaN;
  const [year,month,day,hour,minute,second]=value.match(/^\d{4}|\d{2}/g).slice(0,6).map(Number);
  if(year<2000||year>2200||hour>23||minute>59||second>59||new Date(Date.UTC(year,month-1,day)).toISOString().slice(0,10)!==value.slice(0,10))return NaN;
  return Date.parse(value);
}
export const activityDays=value=>value===364?364:182;
export function activityWindow(days=182,now=Date.now()){
  days=activityDays(days);if(!Number.isFinite(now)||now<Date.UTC(2000,0,1)||now>Date.UTC(2200,0,1))throw Error('Activity time is unavailable.');
  const asOf=new Date(now).toISOString(),today=asOf.slice(0,10),end=dateMs(today),start=new Date(end-(days-1)*dayMs).toISOString().slice(0,10);
  return {days,asOf,today,start,dates:Array.from({length:days},(_,index)=>new Date(end-(days-1-index)*dayMs).toISOString().slice(0,10))};
}
function safeCounts(raw={}){const submissions=count(raw.submissions);return {submissions,accepted:Math.min(submissions,count(raw.accepted)),practicedProblems:Math.min(submissions,count(raw.practicedProblems)),olderVersionSubmissions:Math.min(submissions,count(raw.olderVersionSubmissions)),unknownVersionSubmissions:Math.min(submissions,count(raw.unknownVersionSubmissions))};}
export function activityMetrics(activity=[]){
  let longestStreak=0,run=0,currentStreak=0,activeDays=0,submissions=0,accepted=0;
  for(const day of activity){submissions+=day.submissions;accepted+=day.accepted;if(day.submissions){activeDays++;run++;longestStreak=Math.max(longestStreak,run);}else run=0;}
  // A learner may practice later today. Yesterday's streak stays current until
  // today's UTC day closes; this never adds an unpracticed day to the length.
  let index=activity.length-1;if(index>=0&&!activity[index].submissions)index--;
  for(;index>=0&&activity[index].submissions;index--)currentStreak++;
  return {submissions,accepted,activeDays,currentStreak,longestStreak,streakAtWindowBoundary:currentStreak>0&&currentStreak===(activity.at(-1)?.submissions?activity.length:activity.length-1),longestAtWindowBoundary:longestStreak>0&&activity.slice(0,longestStreak).every(day=>day.submissions>0)};
}
/** Account payload normalization prevents stale identity data from entering UI. */
export function normalizeAccountActivity(raw,accountId,days=182){
  days=activityDays(days);
  if(!raw||typeof raw!=='object'||raw.accountId!==accountId||raw.source!=='account'||raw.timezone!=='UTC'||raw.days!==days||!Array.isArray(raw.activity)||raw.activity.length!==days||!Number.isFinite(Date.parse(raw.asOf)))throw Error('Your activity response changed. Refresh before continuing.');
  const expected=activityWindow(days,Date.parse(raw.asOf));
  if(raw.today!==expected.today||raw.start!==expected.start)throw Error('Your activity response changed. Refresh before continuing.');
  const activity=raw.activity.map((day,index)=>{if(!day||day.date!==expected.dates[index])throw Error('Your activity response changed. Refresh before continuing.');return {date:day.date,...safeCounts(day)};});
  const metrics=activityMetrics(activity),summary=safeCounts(raw.summary);
  if(summary.submissions!==metrics.submissions||summary.accepted!==metrics.accepted)throw Error('Your activity response changed. Refresh before continuing.');
  const topics=(Array.isArray(raw.topics)?raw.topics:[]).slice(0,20).filter(row=>typeof row?.category==='string'&&row.category.length<=100).map(row=>({category:row.category,...safeCounts(row)}));
  return {days,asOf:expected.asOf,today:expected.today,start:expected.start,timezone:'UTC',source:'account',activity,summary,metrics,topics};
}
/** Guest counts use only the available local feed; no claim of full history. */
export function guestActivity(problems=[],progress={},days=182,now=Date.now()){
  const window=activityWindow(days,now),catalog=new Map((Array.isArray(problems)?problems:[]).filter(p=>p&&id(p.id)&&p.published!==false&&p.published!==0).map(p=>[p.id,p]));
  const daily=new Map(window.dates.map(date=>[date,{date,submissions:0,accepted:0,practicedProblems:0,olderVersionSubmissions:0,unknownVersionSubmissions:0,ids:new Set()}]));
  const seen=new Set(),ids=new Set(),topics=new Map();let excludedImported=0,olderVersionSubmissions=0,unknownVersionSubmissions=0;
  const attempts=(Array.isArray(progress.attempts)?progress.attempts:[]).slice(-1000);
  for(const attempt of attempts){
    if(!attempt||typeof attempt!=='object'||!catalog.has(attempt.id)||typeof attempt.pass!=='boolean'||typeof attempt.at!=='string')continue;
    if(attempt.source==='imported'){excludedImported++;continue;}
    if(attempt.source!==undefined&&attempt.source!=='graded')continue;
    const at=attemptTime(attempt.at);if(!Number.isFinite(at)||at>now||at<Date.UTC(2000,0,1))continue;
    const day=daily.get(new Date(at).toISOString().slice(0,10));if(!day)continue;
    if(typeof attempt.submissionId==='string'&&attempt.submissionId){if(seen.has(attempt.submissionId))continue;seen.add(attempt.submissionId);}
    const problem=catalog.get(attempt.id),old=id(attempt.version)&&attempt.version!==problem.version,unknown=!id(attempt.version),category=typeof problem.category==='string'?problem.category.slice(0,100):'Other';
    if(!topics.has(category))topics.set(category,{category,submissions:0,accepted:0,practicedProblems:0,olderVersionSubmissions:0,unknownVersionSubmissions:0,ids:new Set()});
    for(const entry of [day,topics.get(category)]){entry.submissions++;entry.accepted+=Number(attempt.pass);entry.ids.add(attempt.id);entry.practicedProblems=entry.ids.size;entry.olderVersionSubmissions+=Number(old);entry.unknownVersionSubmissions+=Number(unknown);}
    ids.add(attempt.id);olderVersionSubmissions+=Number(old);unknownVersionSubmissions+=Number(unknown);
  }
  const clean=entry=>{const {ids:ignored,...value}=entry;return value;},activity=[...daily.values()].map(clean),metrics=activityMetrics(activity);
  return {days:window.days,asOf:window.asOf,today:window.today,start:window.start,timezone:'UTC',source:'guest',activity,metrics,summary:{submissions:metrics.submissions,accepted:metrics.accepted,practicedProblems:ids.size,olderVersionSubmissions,unknownVersionSubmissions},topics:[...topics.values()].map(clean).sort((a,b)=>b.submissions-a.submissions||a.category.localeCompare(b.category)),availableAttempts:attempts.length,excludedImported};
}
export function calendarWeeks(activity=[]){
  if(!activity.length)return [];
  const offset=(new Date(activity[0].date+'T00:00:00.000Z').getUTCDay()+6)%7;
  const slots=[...Array(offset).fill(null),...activity];while(slots.length%7)slots.push(null);
  return Array.from({length:slots.length/7},(_,index)=>slots.slice(index*7,index*7+7));
}
export function activityLevel(submissions){return submissions>=10?4:submissions>=5?3:submissions>=2?2:submissions===1?1:0;}
