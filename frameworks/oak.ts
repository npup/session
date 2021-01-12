import { SessionData } from "../mod.ts";


export default function use(session: any, options: { [key: string]: string | number | boolean } = {}) {
    console.log("cookie options", { options });
    return async (context: any, next: any) => {
        console.log("req", context);
        try {
        const sid = context.cookies.get("sid");
        // set default cookie options
        const { protocol } = context.request.url;
        if ("boolean" != typeof options.secure) {
            const secure = "http:" === protocol;
            console.log("  : setting secure:", secure);    
            options.secure = secure;
        }

        if ("string" != typeof options.path) {
            const path = "/";
            console.log("  : setting path:", path);    
            options.path = path;
        }
            
        if ("boolean" != typeof options.httpOnly) {
            const httpOnly = "http:" === protocol;
            console.log("  : setting httpOnly:", httpOnly);    
            options.httpOnly = httpOnly;
        }
            
            console.log("options massaged", { options });
		
		if (sid === undefined) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else if(session._store.sessionExists(sid) === false) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else {
            context.state.session = new SessionData(session, sid);
            context.cookies.set("sid", session, options);
		}
		
		await context.state.session.init();
	
            await next();
        } catch (err) {
            console.error("AJ", err);
        }
	}
}