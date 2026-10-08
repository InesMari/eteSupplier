/// <reference types="miniprogram-api-typings" />
import { LPAPI } from "lpapi-ble";
export interface InitOptions {
    canvas?: WechatMiniprogram.OffscreenCanvas;
    showLog?: boolean | number;
    clientType?: number;
    /** 是否允许获取McuId，默认false */
    enableMcuId?: boolean;
}
export interface WXCanvasCreateOptions {
    canvas?: WechatMiniprogram.Canvas | WechatMiniprogram.OffscreenCanvas;
}
export declare class LPAPIFactory {
    static setLogLevel(logLevel: number | boolean): void;
    /**
     * 获取LPAPI接口实例。
     */
    static getInstance(options?: InitOptions): LPAPI;
    static createInstance(options?: InitOptions): LPAPI;
}
export * from "lpapi-ble";
