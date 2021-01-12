import { SessionData } from "../mod.ts";


export default function use(session: any, options: { [key: string]: string | number | boolean } = {}) {
    console.log("cookie options", { options });
    return async (context: any, next: any) => {
        console.log("req", context);
        try {
        const sid = context.cookies.get("sid");
        // set default cookie options
        const { protocol } = context.request.url;
        if (!options.secure) {
            options.secure = "http:" === protocol;
		}
		if (!options.path) {
			options.path = "/"
		}
        if (!options.httpOnly) {
            options.httpOnly = "http:" === protocol;
		}
		
		if (sid === undefined) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else if(session._store.sessionExists(sid) === false) {
			context.state.session = new SessionData(session);
			context.cookies.set("sid", context.state.session.sessionId, options);
		} else {
			context.state.session = new SessionData(session, sid);
		}
		
		await context.state.session.init();
	
            await next();
        } catch (err) {
            console.error("AJ", err);
        }
	}
}