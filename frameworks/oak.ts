import { SessionData } from "../mod.ts";


export default function use(session: any, options: { [key: string]: string | number | boolean } = { maxAge: 60, }) {
    console.log("cookie options", { options });
    // set default cookie options
        
        if ("boolean" != typeof options.secure) {
            const secure = true;
            console.log("  : setting secure:", secure);    
            options.secure = secure;
        }

        if ("string" != typeof options.path) {
            const path = "/";
            console.log("  : setting path:", path);    
            options.path = path;
        }
            
        if ("boolean" != typeof options.httpOnly) {
            const httpOnly = true;
            console.log("  : setting httpOnly:", httpOnly);    
            options.httpOnly = httpOnly;
        }    
    console.log("options massaged", { options });
    
    return async (context: any, next: any) => {
        
        try {
            const sid = context.cookies.get("sid");
            console.log("req", { context, sid });
        
		
		if (sid === undefined) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else if(session._store.sessionExists(sid) === false) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else {
            context.state.session = new SessionData(session, sid);
            context.cookies.set("sid", sid, options);
		}
		
		await context.state.session.init();
	
            await next();
        } catch (err) {
            console.error("AJ", err);
        }
	}
}