(()=>{var e={};e.id=202,e.ids=[202],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,r,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.d(r,{db:()=>e});var o=s(46101);let e=await o.createPool({host:process.env.MYSQL_HOST,user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD,database:process.env.MYSQL_DATABASE,waitForConnections:!0,connectionLimit:10});t()}catch(e){t(e)}},1)},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},28303:e=>{function r(e){var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=()=>[],r.resolve=r,r.id=28303,e.exports=r},28354:e=>{"use strict";e.exports=require("util")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},41204:e=>{"use strict";e.exports=require("string_decoder")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66136:e=>{"use strict";e.exports=require("timers")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},85333:(e,r,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(r),s.d(r,{patchFetch:()=>c,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>l});var o=s(96559),a=s(48088),i=s(37719),n=s(92599),u=e([n]);n=(u.then?(await u)():u)[0];let d=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/search/route",pathname:"/api/search",filename:"route",bundlePath:"app/api/search/route"},resolvedPagePath:"/Users/ankursrivastava/Desktop/health/app/api/search/route.ts",nextConfigOutput:"export",userland:n}),{workAsyncStorage:p,workUnitAsyncStorage:l,serverHooks:x}=d;function c(){return(0,i.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:l})}t()}catch(e){t(e)}})},91645:e=>{"use strict";e.exports=require("net")},92599:(e,r,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(r),s.d(r,{POST:()=>n});var o=s(32190),a=s(7462),i=e([a]);async function n(e){try{let{keyword:r,latitude:s,longitude:t}=await e.json();if(!s||!t)return o.NextResponse.json({error:"Missing required fields: latitude, longitude"},{status:400});let i=`%${r||""}%`,n=`
        SELECT 
          users.id AS user_id,
          users.name AS user_name,
          doctors.latitude,
          doctors.longitude,
          users.address,
          (
            6371 * acos(
              cos(radians(?)) * cos(radians(doctors.latitude)) * 
              cos(radians(doctors.longitude) - radians(?)) + 
              sin(radians(?)) * sin(radians(doctors.latitude))
            )
          ) AS distance
        FROM users
        INNER JOIN doctors ON users.id = doctors.user_id
        WHERE users.name LIKE ?
        HAVING distance < ?
        ORDER BY distance ASC
        LIMIT 20;
      `,[u]=await a.db.execute(n,[s,t,s,i,30]);return await a.db.end(),o.NextResponse.json({results:u})}catch(e){return console.error("Search API error:",e),o.NextResponse.json({error:"Internal Server Error"},{status:500})}}a=(i.then?(await i)():i)[0],t()}catch(e){t(e)}})},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[447,580,101],()=>s(85333));module.exports=t})();