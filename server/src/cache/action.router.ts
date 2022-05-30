import express, { Request, Response } from "express";
import { checkAuth } from "../middleware/auth";
import ActionService from "./action.service";

const NodeCache = require("node-cache");
const myCache = new NodeCache();

var callNumber: number = 0;

/**
 * Router Definition
 */
export const cacheRouter = express.Router();

const actionService = new ActionService();

// GET items
cacheRouter.get("/", async (req: Request, res: Response) => {
    try {
        callNumber++;
        if (callNumber % 100 === 0)
            console.log(callNumber);
        res.status(200).send("hello 2");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

cacheRouter.use(checkAuth);

cacheRouter.post("/mset", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        // console.log(body);
        res.status(200).send("hello");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/set", async (req: Request, res: Response) => {
    try {
        var body = req.body;

        await actionService.set(body);
        res.status(200).send("ok");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/get", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.get(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/hmset", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var result = await actionService.hmset(body);
        res.status(200).send(result);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

cacheRouter.post("/hget", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.hget(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

cacheRouter.post("/hset", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.hset(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

cacheRouter.post("/hvals", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.hvals(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/keys", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.keys(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/hkeys", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        //var key = body.key;
        var value = await actionService.hkeys(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/lrpush", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.lrpush(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/lrange", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.lrange(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/llen", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.llen(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/lset", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.lset(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/getInternal", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.getInternal(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



cacheRouter.post("/selectDB", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.selectDB(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/testClient", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.testClient(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/saveHostList", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.saveHostList(body);
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


cacheRouter.post("/readHostList", async (req: Request, res: Response) => {
    try {
        var body = req.body;
        var value = await actionService.readHostList();
        res.status(200).send(value);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});