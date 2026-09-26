import { browserCli } from "../browser/cli.mjs";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:4177/workspace/",
  session = "overtrue-workflows";
const cli = browserCli(session);
await mkdir("output/playwright/workspace", { recursive: true });
await cli("open", base);
try {
  const { stdout } = await cli(
    "run-code",
    `async page=>{
 const passed=[];const check=(yes,label)=>{if(!yes)throw Error(label);passed.push(label)};const go=async route=>{await page.goto(${JSON.stringify(base)}+'#/'+route);await page.locator('[data-workspace-page]').waitFor()};
 await page.setViewportSize({width:1440,height:1000});
 await go('');
 check(await page.getByRole('link', { name: 'Documentation', exact: true }).first().getAttribute('href') === '/docs', 'workspace documentation link');
 check(await page.getByRole('link', { name: 'Source code', exact: true }).getAttribute('href') === 'https://github.com/overtrue/ui', 'workspace source link');
 await page.getByRole('button', { name: 'Quarterly', exact: true }).click();
 check((await page.getByRole('img', { name: /Quarterly booked and planned revenue for 2026/ }).getAttribute('aria-label')).includes('Q3 $16600'), 'quarterly chart keeps all four quarters');
 check((await page.locator('.scene-chart-summary').innerText()).includes('$61,700'), 'quarterly summary uses full reporting year');
 check(await page.getByText('-5.1% vs. August · booked & planned', { exact: true }).isVisible(), 'September metric keeps its comparison period');
 await page.getByRole('button', { name: 'Monthly', exact: true }).click();
 check((await page.getByRole('img', { name: /Monthly booked and planned revenue for 2026/ }).getAttribute('aria-label')).includes('Dec $7400'), 'monthly chart restores the full year');
 await page.getByRole('link', { name: /Ready for review Prepare the identity handover/ }).click();
 await page.getByLabel('Status of WK-184').waitFor();
 check(await page.locator('.scene-table tbody tr').count() === 1, 'attention link opens the matching task');
 check(await page.getByLabel('Status of WK-184').isVisible(), 'review task can be acted on');
 await page.getByPlaceholder('Search tasks…').fill('');
 await page.getByLabel('Status of WK-182').waitFor();
 check(await page.locator('.scene-table tbody tr').count() === 6, 'clearing the deep link restores the queue');
 await go('tasks');await page.getByRole('button',{name:'Add task',exact:true}).click();await page.getByLabel('Task title').fill('Review the accessibility checklist');await page.getByRole('button',{name:'Create task',exact:true}).click();check(await page.getByRole('heading',{name:'Review the accessibility checklist'}).isVisible(),'create task');
 await page.getByLabel('Status of WK-194').selectOption('Complete');check(await page.locator('.scene-board > section').filter({has:page.getByRole('heading',{name:'Complete',exact:true})}).getByText('Review the accessibility checklist').isVisible(),'move task between columns');
 await page.getByPlaceholder('Search tasks…').fill('does-not-exist');check(await page.getByText('No tasks match this search.').isVisible(),'task empty search');
 await go('sortable');const before=await page.locator('.scene-priority').first().innerText();await page.getByRole('button',{name:'Move down',exact:true}).first().click();check((await page.locator('.scene-priority').first().innerText())!==before,'reorder priorities');
 await go('users');await page.getByPlaceholder('Search people or disciplines…').fill('Research');check(await page.locator('.scene-people-grid [data-slot="member-card"]').count()===1,'filter people');await page.getByRole('link',{name:'View profile'}).click();check(await page.getByRole('heading',{name:'Ines Duarte'}).isVisible(),'open selected profile');
 await go('chat');await page.getByLabel('Message',{exact:true}).fill('The review notes are ready.');await page.getByRole('button',{name:'Send',exact:true}).click();check(await page.getByText('The review notes are ready.',{exact:true}).isVisible(),'send local chat message');await page.getByRole('button',{name:'# Culture venue'}).click();check(await page.getByText('The review notes are ready.',{exact:true}).count()===0,'channel messages are isolated');
 await go('email-inbox');await page.getByLabel('Reply to Ines Duarte').fill('Thanks, I will review the proposal.');await page.getByRole('button',{name:'Save reply draft'}).click();check(await page.getByRole('status').filter({hasText:'Reply saved'}).isVisible(),'save reply draft');await page.getByRole('button',{name:'Archive',exact:true}).click();check(await page.locator('.scene-inbox > aside > button').count()===3,'archive conversation');
 await go('gallery');await page.getByRole('button',{name:'Photography',exact:true}).click();check(await page.locator('.scene-library > button').count()===3,'filter asset library');await page.locator('.scene-library > button').first().click();await page.getByRole('dialog').waitFor();check(await page.getByRole('button',{name:'Close preview'}).evaluate(el=>el===document.activeElement),'asset dialog initial focus');await page.keyboard.press('Escape');check(await page.getByRole('dialog').count()===0,'asset dialog escape');
 await go('wizard');await page.getByLabel('Project name',{exact:true}).fill('New visitor guide');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Create project',exact:true}).click();check(await page.getByRole('heading',{name:'Your project is ready'}).isVisible(),'project creation steps');
 await go('settings');await page.getByLabel('Workspace name').fill('Acme Studio QA');await page.getByRole('button',{name:'Save changes',exact:true}).click();check(await page.getByRole('status').filter({hasText:'saved for this session'}).isVisible(),'save workspace settings');
 await go('datatables');await page.getByPlaceholder('Search projects or clients…').fill('Ceramics');check(await page.locator('tbody tr').count()===1,'project register search');await page.getByPlaceholder('Search projects or clients…').fill('');await page.getByRole('button',{name:'Budget: lowest first'}).click();check((await page.locator('tbody tr').first().innerText()).includes('Visitor experience'),'project register sort');const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export',exact:true}).click();check((await downloaded).suggestedFilename().endsWith('.csv'),'export actual CSV');
 await go('pay');await page.getByRole('button',{name:'Overdue',exact:true}).click();check(await page.locator('tbody tr').count()===1,'invoice status filter');await page.getByRole('link',{name:'INV-26-187',exact:true}).click();await page.getByRole('heading',{name:'INV-26-187',exact:true}).waitFor();check(await page.getByRole('heading',{name:'INV-26-187',exact:true}).isVisible(),'open selected invoice');
 await go('pricing');await page.getByRole('button',{name:'Yearly',exact:true}).click();check(await page.getByText('$23',{exact:false}).count()>0,'yearly plan pricing');await page.getByRole('button',{name:'Choose Collective',exact:true}).click();check((await page.getByRole('status').innerText()).includes('Collective selected'),'select sample plan');
 await go('fullcalendar');await page.locator('.fc-daygrid-day[data-date="2026-09-24"]').click();await page.getByLabel('Event title').fill('Accessibility review');await page.getByRole('button',{name:'Save event',exact:true}).click();check(await page.locator('.fc-event-title').filter({hasText:'Accessibility review'}).isVisible(),'create calendar event');
 await go('sign-in');await page.getByLabel('Email address').fill('qa@acme.example');await page.getByLabel('Password',{exact:true}).fill('example-only');await page.getByRole('button',{name:'Continue to workspace'}).click();check(await page.getByText('You’re ready to explore',{exact:true}).isVisible(),'demo authentication result');
 await go('high-order');const drawerTrigger=page.getByRole('button',{name:'Offcanvas',exact:true});await drawerTrigger.click();check(await page.getByRole('dialog',{name:'Offcanvas demo'}).isVisible(),'composition drawer is named');await page.keyboard.press('Tab');check(await page.getByRole('dialog').evaluate(el=>el.contains(document.activeElement)),'composition drawer traps focus');await page.keyboard.press('Escape');check(await page.getByRole('dialog').count()===0,'composition drawer closes on Escape');check(await drawerTrigger.evaluate(el=>el===document.activeElement),'composition drawer restores focus');
 const selectable=page.getByRole('button',{name:'Selectable',exact:true});await selectable.focus();await page.keyboard.press('Space');check(await selectable.getAttribute('aria-pressed')==='false','tag Space selection');await page.keyboard.press('Enter');check(await selectable.getAttribute('aria-pressed')==='true','tag Enter selection');
 const bell=page.getByRole('button',{name:'Notifications',exact:true}).last();await bell.focus();await page.keyboard.press('ArrowDown');await page.getByRole('menuitem',{name:'Mark all as read'}).click();check(await bell.locator('span').count()===0,'notification read state');await bell.click();check(await page.getByRole('menuitem',{name:'Mark all as read'}).getAttribute('data-disabled')!==null,'read action disabled when caught up');await page.keyboard.press('Escape');check(await bell.evaluate(el=>el===document.activeElement),'notification menu restores focus');
 const storedTheme=await page.evaluate(()=>localStorage.getItem('overtrue-workspace-theme-v2'));try{await page.evaluate(()=>localStorage.setItem('overtrue-workspace-theme-v2',JSON.stringify({accent:null,font:'invalid',radius:-100})));await page.reload();await page.locator('[data-workspace-page=high-order]').waitFor();check(await page.getByRole('heading',{name:'High-order components',exact:true}).isVisible(),'malformed theme recovers without blank screen');}finally{await page.evaluate(value=>{if(value===null)localStorage.removeItem('overtrue-workspace-theme-v2');else localStorage.setItem('overtrue-workspace-theme-v2',value)},storedTheme);await page.reload();}
 await go('');await page.getByRole('button',{name:'Customize theme',exact:true}).click();await page.getByRole('radio',{name:'Dark',exact:true}).check();await page.keyboard.press('Escape');await page.screenshot({path:'output/playwright/workspace/dark-overview.png'});check(await page.locator('.overtrue-workspace[data-bs-theme=dark]').count()===1,'workspace dark theme');
 await page.setViewportSize({width:390,height:844});await go('tasks');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile board fits');const sidebar=page.getByRole('dialog',{name:'Sidebar',exact:true});check(!await sidebar.isVisible(),'mobile sidebar starts closed');const sidebarTrigger=page.getByRole('button',{name:'Toggle sidebar',exact:true});await sidebarTrigger.click();check(await sidebar.isVisible(),'mobile workspace navigation');await page.screenshot({path:'output/playwright/workspace/mobile-navigation.png'});await page.keyboard.press('Escape');await sidebar.waitFor({state:'hidden'});await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Toggle sidebar');check(await sidebarTrigger.evaluate(el=>el===document.activeElement),'mobile sidebar restores focus');
 return passed;
}`,
  );
  const match = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!match) throw Error(stdout);
  const results = JSON.parse(match[1]);
  await writeFile(
    "output/playwright/workspace/interactions.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify({ passed: results.length, scenarios: results }, null, 2),
  );
} finally {
  await cli("close");
}
